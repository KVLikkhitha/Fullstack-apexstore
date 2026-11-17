import { type ReactElement } from "react";
import { FaTrash } from "react-icons/fa";
import type { ColumnDef } from "@tanstack/react-table";
import AdminSidebar from "../../components/admin/AdminSidebar";
import { DataTable } from "../../components/admin/TableHOC";
import { useEcommerce } from "../../context/EcommerceContext";

interface DataType {
  id: string;
  avatar: ReactElement;
  name: string;
  email: string;
  gender: string;
  role: string;
  action?: ReactElement;
}

const Customers = () => {
  const { customers, deleteCustomer } = useEcommerce();

  const columns: ColumnDef<DataType>[] = [
    {
      header: "Avatar",
      accessorKey: "avatar",
      enableSorting: false,
      cell: (info) => info.getValue() as ReactElement,
    },
    {
      header: "Name",
      accessorKey: "name",
      cell: (info) => <strong>{String(info.getValue())}</strong>,
    },
    {
      header: "Gender",
      accessorKey: "gender",
      cell: (info) => {
        const gender = String(info.getValue());
        return (
          <span
            style={{
              fontSize: "0.85rem",
              color: gender === "Female" ? "#ec4899" : "#3b82f6",
            }}
          >
            {gender}
          </span>
        );
      },
    },
    {
      header: "Email",
      accessorKey: "email",
      cell: (info) => (
        <span style={{ color: "#64748b" }}>{String(info.getValue())}</span>
      ),
    },
    {
      header: "Role",
      accessorKey: "role",
      cell: (info) => {
        const role = String(info.getValue());
        return (
          <span
            className={
              role === "Admin" ? "role-chip admin" : "role-chip customer"
            }
          >
            {role}
          </span>
        );
      },
    },
    {
      header: "Action",
      id: "action",
      enableSorting: false,
      cell: (info) => {
        const row = info.row.original;
        return (
          <button
            title="Delete customer"
            onClick={() => deleteCustomer(row.id)}
            style={{
              border: "none",
              background: "transparent",
              color: "#ef4444",
              cursor: "pointer",
              padding: "0.5rem",
              borderRadius: "6px",
            }}
          >
            <FaTrash />
          </button>
        );
      },
    },
  ];

  const rows: DataType[] = customers.map((c) => ({
    id: c.id,
    avatar: (
      <img
        style={{
          borderRadius: "50%",
          width: "2.5rem",
          height: "2.5rem",
          objectFit: "cover",
        }}
        src={c.avatar}
        alt={c.name}
      />
    ),
    name: c.name,
    email: c.email,
    gender: c.gender,
    role: c.role,
  }));

  return (
    <div className="admin-container">
      <AdminSidebar />
      <main>
        <DataTable<DataType>
          columns={columns}
          data={rows}
          containerClassname="dashboard-product-box"
          heading="Customer Accounts"
          showPagination={true}
        />
      </main>
    </div>
  );
};

export default Customers;
