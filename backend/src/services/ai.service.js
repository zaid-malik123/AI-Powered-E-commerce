import axios from "axios";
import { z } from "zod";

import { tool } from "@langchain/core/tools";
import { MessagesAnnotation, StateGraph, END } from "@langchain/langgraph";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { AIMessage, ToolMessage } from "@langchain/core/messages";
import { SystemMessage } from "@langchain/core/messages";

const searchProductsTool = tool(
  async ({ query, minPrice, maxPrice }) => {
    try {
      const response = await axios.get(
        `${process.env.SERVER_URL}/api/product/filter`,
        {
          params: { q: query, minPrice, maxPrice },
        }
      );

      return response.data.products
        .slice(0, 5)
        .map((p) => `${p.name} - ₹${p.price}`)
        .join("\n");

    } catch (error) {
      return "Error fetching products";
    }
  },
  {
    name: "search_products",
    description:
      "Search products with optional price filtering",
    schema: z.object({
      query: z.string(),
      minPrice: z.number().optional(),
      maxPrice: z.number().optional(),
    }),
  }
);

const searchBestSellingProduct = tool(
  async () => {
    const response = await axios.get(
      `${process.env.SERVER_URL}/api/product/best`
    );
    return JSON.stringify(response.data);
  },
  {
    name: "search_best_sellers",
    description: "Fetch best selling products",
    schema: z.object({}), 
  }
);

const systemPrompt = `
You are an AI Shopping Assistant for an online clothing store.

The store sells clothes for:
- Men
- Women
- Children

The products include:
- Winter wear (jackets, sweaters, hoodies, coats, etc.)
- Summer wear (t-shirts, shirts, dresses, shorts, etc.)
- All seasonal clothing

Your responsibilities:
- Communicate politely and clearly with users.
- Understand the user's needs such as gender, age group, season, size, budget, and style.
- Help users find suitable clothing products.
- Explain products in a simple and friendly way, including:
  - Fabric
  - Season suitability
  - Price
  - Size availability
  - Style or use-case (casual, party, daily wear, etc.)
- Recommend relevant products when possible.
- Suggest alternatives if a product is unavailable.

Tool usage:
- You will be provided with tools to:
  - Search and find products.
  - Filter products based on user preferences.
  - Add products to the user’s cart.
- Use these tools whenever required.
- Do NOT assume or invent product details.
- Only use information returned by the tools.

Rules:
- If the user's request is unclear, ask follow-up questions.
- If a product is not found, clearly inform the user.
- Do not answer questions unrelated to shopping or clothing.
- Do not provide false discounts or availability information.

Conversation style:
- Friendly, helpful, and customer-focused.
- Short and clear responses.
- Use simple English.
- Ask clarifying questions when needed.
- Be supportive, like a real shopping assistant.

If the user says something vague like:
"Show me something good"
Ask questions such as:
- "Is this for men, women, or kids?"
- "Which season are you shopping for?"
- "Any budget range?"

Important rules about cart actions:
- You NEVER ask the user for authentication tokens.
- Authentication tokens are handled internally by the system.
- When a user asks to add a product to the cart, directly call the add_to_cart tool.
- Assume the token will be available automatically during tool execution.
- if user don't ask quantity so that you assume that quantiy is 1

IMPORTANT DECISION POLICY:

- If the user intent is to ADD a product to the cart
  AND the productId is NOT explicitly provided:

  1. You MUST first call the product search tool
     using the product name mentioned by the user
     (for example: "nike shoes", "shoes", "jacket").

  2. From the search results:
     - Pick the most relevant and popular product.
     - Prefer mid-range price and common variants.

  3. Then IMMEDIATELY call the add_to_cart tool with:
     - productId from the selected product
     - quantity = 1 if not mentioned
  
  When a user asks about best seller products:
You MUST call the "search_best_sellers" tool first.
Then extract only the product names from the tool response.
Return only a clean list of names.
Do not add descriptions or extra text.

- Do NOT ask the user for product ID if a reasonable product
  can be found automatically.

- Only ask follow-up questions if:
  - No products are found
  - Multiple products are equally relevant
  - The product requires critical customization (like shoe size)



`;

const addToCartTool = tool(
  async ({ productId, quantity = 1, token }) => {
    const response = await axios.post(
      `${process.env.SERVER_URL}/api/cart/add`,
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
      token: z.string().optional().describe("The JWT token for authentication"),
    }),
  },
);

const model = new ChatGoogleGenerativeAI({
  model: "gemini-2.5-flash",
  apiKey: process.env.GEMINI_API_KEY,
});

const toolByName = {
  search_products: searchProductsTool,
  add_to_cart: addToCartTool,
  search_best_sellers: searchBestSellingProduct,
};

const systemMessage = new SystemMessage(systemPrompt);

const modelWithTools = model.bindTools(Object.values(toolByName));

async function agentNode(state) {
  const messagesWithSystem = [systemMessage, ...state.messages];

  const response = await modelWithTools.invoke(messagesWithSystem);

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
      token: state.token || config.metadata.token,
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
