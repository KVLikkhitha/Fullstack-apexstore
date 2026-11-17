import type { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "./TableHOC";

interface DataType {
  _id?: string;
  id?: string;
  quantity: number;
  discount: number;
  amount: number;
  status: string;
}

const columns: ColumnDef<DataType>[] = [
  {
    header: "Order ID",
    accessorKey: "id",
    cell: (info) => {
      const row = info.row.original;
      return <span style={{ fontFamily: "monospace" }}>{row.id || row._id}</span>;
    },
  },
  {
    header: "Quantity",
    accessorKey: "quantity",
  },
  {
    header: "Discount",
    accessorKey: "discount",
    cell: (info) => `₹${Number(info.getValue())}`,
  },
  {
    header: "Amount",
    accessorKey: "amount",
    cell: (info) => <strong>₹{Number(info.getValue())}</strong>,
  },
  {
    header: "Status",
    accessorKey: "status",
    cell: (info) => {
      const status = String(info.getValue());
      const colorClass =
        status === "Delivered"
          ? "status-pill delivered"
          : status === "Shipped"
          ? "status-pill shipped"
          : "status-pill processing";
      return <span className={colorClass}>{status}</span>;
    },
  },
];

const DashboardTable = ({ data = [] }: { data: DataType[] }) => {
  return (
    <DataTable<DataType>
      columns={columns}
      data={data}
      containerClassname="transaction-box"
      heading="Recent Transactions"
      showPagination={false}
    />
  );
};

export default DashboardTable;
