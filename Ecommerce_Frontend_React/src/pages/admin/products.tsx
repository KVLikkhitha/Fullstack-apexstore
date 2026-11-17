import { type ReactElement } from "react";
import { FaPlus, FaTrash } from "react-icons/fa";
import { Link } from "react-router-dom";
import type { ColumnDef } from "@tanstack/react-table";
import AdminSidebar from "../../components/admin/AdminSidebar";
import { DataTable } from "../../components/admin/TableHOC";
import { useEcommerce } from "../../context/EcommerceContext";

interface DataType {
  id: string;
  photo: ReactElement;
  name: string;
  price: number;
  stock: number;
  category: string;
  action: ReactElement;
}

const columns: ColumnDef<DataType>[] = [
  {
    header: "Photo",
    accessorKey: "photo",
    enableSorting: false,
    cell: (info) => info.getValue() as ReactElement,
  },
  {
    header: "Name",
    accessorKey: "name",
    cell: (info) => (
      <div>
        <strong style={{ display: "block" }}>{String(info.getValue())}</strong>
        <span style={{ fontSize: "0.8rem", color: "#64748b" }}>
          SKU: {info.row.original.id}
        </span>
      </div>
    ),
  },
  {
    header: "Category",
    accessorKey: "category",
    cell: (info) => (
      <span className="category-chip">{String(info.getValue())}</span>
    ),
  },
  {
    header: "Price",
    accessorKey: "price",
    cell: (info) => (
      <strong>₹{Number(info.getValue()).toLocaleString("en-IN")}</strong>
    ),
  },
  {
    header: "Stock",
    accessorKey: "stock",
    cell: (info) => {
      const stock = Number(info.getValue());
      return (
        <span
          className={
            stock <= 0
              ? "status-pill out-of-stock"
              : stock < 5
              ? "status-pill low-stock"
              : "status-pill in-stock"
          }
        >
          {stock <= 0 ? "Out of Stock" : `${stock} in stock`}
        </span>
      );
    },
  },
  {
    header: "Action",
    accessorKey: "action",
    enableSorting: false,
    cell: (info) => info.getValue() as ReactElement,
  },
];

const Products = () => {
  const { products, deleteProduct } = useEcommerce();

  const rows: DataType[] = products.map((item) => ({
    id: item.id,
    photo: (
      <img
        src={item.photo}
        alt={item.name}
        style={{
          width: "45px",
          height: "45px",
          borderRadius: "8px",
          objectFit: "cover",
        }}
      />
    ),
    name: item.name,
    category: item.category,
    price: item.price,
    stock: item.stock,
    action: (
      <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
        <Link
          to={`/admin/product/${item.id}`}
          style={{ color: "#2563eb", fontWeight: "700" }}
        >
          Manage
        </Link>
        <button
          onClick={() => deleteProduct(item.id)}
          style={{
            border: "none",
            background: "none",
            color: "#ef4444",
            cursor: "pointer",
            padding: "0.25rem",
          }}
          title="Delete product"
        >
          <FaTrash />
        </button>
      </div>
    ),
  }));

  return (
    <div className="admin-container">
      <AdminSidebar />
      <main>
        <DataTable<DataType>
          columns={columns}
          data={rows}
          containerClassname="dashboard-product-box"
          heading="Products Inventory"
          showPagination={true}
        />
      </main>
      <Link
        to="/admin/product/new"
        className="create-product-btn"
        title="Create New Product"
      >
        <FaPlus />
      </Link>
    </div>
  );
};

export default Products;
