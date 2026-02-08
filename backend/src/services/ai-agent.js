import axios from "axios";
import { z } from "zod";

import { tool } from "@langchain/core/tools";
import { MessagesAnnotation, StateGraph, END } from "@langchain/langgraph";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { AIMessage, ToolMessage } from "@langchain/core/messages";

const searchProductsTool = tool(
  async ({ query }) => {
    const response = await axios.get(
      `http://localhost:3000/api/product/search?q=${query}`,
    );

    return JSON.stringify(response.data);
  },

  {
    name: "search_products",
    description:
      'Search for products based on a query. Input should be a JSON object with a \'query\' field. Example: { "query": "laptop" }',
    schema: z.object({
      query: z.string().describe("The search query for products"),
    }),
  },
);

const addToCartTool = tool(
  async ({ productId, quantity, token }) => {
    const response = await axios.post(
      `http://localhost:3000/api/cart/add`,
      {
        productId,
        quantity,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`, // Use an environment variable for the API key
        },
      },
    );

    return JSON.stringify(response.data);
  },

  {
    name: "add_to_cart",
    description:
      'Add a product to the cart. Input should be a JSON object with \'productId\', \'quantity\', and \'token\' fields. Example: { "productId": "12345", "quantity": 2, "token": "abc123" }',
    schema: z.object({
      productId: z
        .string()
        .describe("The ID of the product to add to the cart"),
      quantity: z.number().describe("The quantity of the product to add"),
      token: z.string().describe("The authentication token for the user"),
    }),
  },
);

const model = new ChatGoogleGenerativeAI({
  model: "gemini-3-flash-preview",
  apiKey: process.env.GEMINI_API_KEY,
});

const toolByName = {
  search_products: searchProductsTool,
  add_to_cart: addToCartTool,
};

const modelWithTools = model.bindTools(Object.values(toolByName));

async function agentNode(state) {
  const response = await modelWithTools.invoke(state.messages);


  console.log("this is the ai response answer :- ", response)

  return {
    ...state,
    messages: [
      ...state.messages,
      new AIMessage({
        content: response.content,
        tool_calls: response.tool_calls ?? [],
      }),
    ],
  };
}

const toolNode = async (state, config) => {
  const lastMessage = state.messages[state.messages.length - 1];

  if (!lastMessage.tool_calls?.length) {
    return state;
  }

  for (const call of lastMessage.tool_calls) {
    const toolFn = toolByName[call.name];
    if (!toolFn) continue;

    const args =
      typeof call.args === "string" ? JSON.parse(call.args) : (call.args ?? {});

    const result = await toolFn.invoke({
      ...args,
      token: config.metadata.token,
    });

    state.messages.push(
      new ToolMessage({
        tool_call_id: call.id,
        content: result,
      }),
    );
  }

  return state;
};

const graph = new StateGraph(MessagesAnnotation)
  .addNode("agent", agentNode)
  .addNode("tools", toolNode)
  .addEdge("__start__", "agent")
  .addConditionalEdges("agent", (state) => {
    const last = state.messages[state.messages.length - 1];
    return last.tool_calls?.length ? "tools" : END;
  })
  .addEdge("tools", "agent");

const app = graph.compile();

export default app;
