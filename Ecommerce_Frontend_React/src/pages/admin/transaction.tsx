import { useState, type ReactElement } from "react";
import { Link } from "react-router-dom";
import type { ColumnDef } from "@tanstack/react-table";
import AdminSidebar from "../../components/admin/AdminSidebar";
import { DataTable } from "../../components/admin/TableHOC";
import { useEcommerce } from "../../context/EcommerceContext";

interface DataType {
  id: string;
  user: string;
  amount: number;
  discount: number;
  quantity: number;
  status: string;
  action: ReactElement;
}

const columns: ColumnDef<DataType>[] = [
  {
    header: "Order ID",
    accessorKey: "id",
    cell: (info) => (
      <span style={{ fontFamily: "monospace", fontWeight: "700" }}>
        {String(info.getValue())}
      </span>
    ),
  },
  {
    header: "Customer",
    accessorKey: "user",
    cell: (info) => <strong>{String(info.getValue())}</strong>,
  },
  {
    header: "Items",
    accessorKey: "quantity",
    cell: (info) => `${Number(info.getValue())} items`,
  },
  {
    header: "Discount",
    accessorKey: "discount",
    cell: (info) => `₹${Number(info.getValue()).toLocaleString("en-IN")}`,
  },
  {
    header: "Amount",
    accessorKey: "amount",
    cell: (info) => (
      <strong>₹{Number(info.getValue()).toLocaleString("en-IN")}</strong>
    ),
  },
  {
    header: "Status",
    accessorKey: "status",
    cell: (info) => {
      const status = String(info.getValue());
      const pillClass =
        status === "Delivered"
          ? "status-pill delivered"
          : status === "Shipped"
          ? "status-pill shipped"
          : status === "Cancelled"
          ? "status-pill cancelled"
          : "status-pill processing";
      return <span className={pillClass}>{status}</span>;
    },
  },
  {
    header: "Action",
    accessorKey: "action",
    enableSorting: false,
    cell: (info) => info.getValue() as ReactElement,
  },
];

const Transaction = () => {
  const { orders } = useEcommerce();
  const [selectedStatus, setSelectedStatus] = useState<string>("All");

  const statuses = ["All", "Processing", "Shipped", "Delivered", "Cancelled"];

  const filteredOrders =
    selectedStatus === "All"
      ? orders
      : orders.filter((o) => o.status === selectedStatus);

  const rows: DataType[] = filteredOrders.map((o) => ({
    id: o.id,
    user: o.user,
    amount: o.total,
    discount: o.discount,
    quantity: o.orderItems.reduce((acc, i) => acc + i.quantity, 0),
    status: o.status,
    action: (
      <Link
        to={`/admin/transaction/${o.id}`}
        style={{ color: "#2563eb", fontWeight: "700" }}
      >
        Manage
      </Link>
    ),
  }));

  return (
    <div className="admin-container">
      <AdminSidebar />
      <main>
        {/* Status Filter Tabs */}
        <div
          style={{
            display: "flex",
            gap: "0.5rem",
            marginBottom: "1rem",
            flexWrap: "wrap",
            padding: "0 0.5rem",
          }}
        >
          {statuses.map((st) => {
            const count =
              st === "All"
                ? orders.length
                : orders.filter((o) => o.status === st).length;
            const active = selectedStatus === st;
            return (
              <button
                key={st}
                type="button"
                onClick={() => setSelectedStatus(st)}
                style={{
                  padding: "0.45rem 1rem",
                  borderRadius: "999px",
                  border: active
                    ? "1.5px solid #2563eb"
                    : "1px solid #cbd5e1",
                  background: active ? "#eff6ff" : "#ffffff",
                  color: active ? "#1d4ed8" : "#64748b",
                  fontWeight: active ? "700" : "500",
                  fontSize: "0.85rem",
                  cursor: "pointer",
                  transition: "all 0.15s ease",
                  boxShadow: active
                    ? "0 2px 8px rgba(37, 99, 235, 0.15)"
                    : "none",
                }}
              >
                {st} ({count})
              </button>
            );
          })}
        </div>

        <DataTable<DataType>
          columns={columns}
          data={rows}
          containerClassname="dashboard-product-box"
          heading={`Orders & Transactions (${filteredOrders.length})`}
          showPagination={true}
        />
      </main>
    </div>
  );
};

export default Transaction;
