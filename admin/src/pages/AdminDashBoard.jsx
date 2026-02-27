import { useState } from "react";
import { FaPlus, FaList, FaClipboardList } from "react-icons/fa";
import AdminNav from "../components/AdminNav";
import AddItems from "../components/AddItems";
import ListItems from "../components/ListItems";
import Orders from "../components/Orders";

const AdminDashBoard = () => {
  const [active, setActive] = useState("add");

  const renderContent = () => {
    switch (active) {
      case "add":
        return <AddItems />;
      case "list":
        return <ListItems />;
      case "orders":
        return <Orders />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* 🔹 Top Header */}
      <AdminNav />

      {/* 🔹 Main Layout */}
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-gray-50 border-r border-gray-200 min-h-screen p-6">
          <nav className="space-y-4">
            <button
              onClick={() => setActive("add")}
              className={`flex items-center gap-3 w-full p-3 rounded border border-gray-200 ${
                active === "add" ? "bg-white shadow" : "hover:bg-white"
              }`}
            >
              <FaPlus />
              Add Items
            </button>

            <button
              onClick={() => setActive("list")}
              className={`flex items-center gap-3 w-full p-3 rounded border border-gray-200 ${
                active === "list" ? "bg-white shadow" : "hover:bg-white"
              }`}
            >
              <FaList />
              List Items
            </button>

            <button
              onClick={() => setActive("orders")}
              className={`flex items-center gap-3 w-full p-3 rounded border border-gray-200 ${
                active === "orders" ? "bg-white shadow" : "hover:bg-white"
              }`}
            >
              <FaClipboardList />
              Orders
            </button>
          </nav>
        </aside>

        {/* Content Area */}
        <main className="flex-1 p-10">
          <div className="bg-white p-8 rounded shadow-sm min-h-screen">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashBoard;
