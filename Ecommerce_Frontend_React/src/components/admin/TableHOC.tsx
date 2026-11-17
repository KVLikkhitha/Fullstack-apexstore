import { useState } from "react";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type SortingState,
} from "@tanstack/react-table";
import {
  AiOutlineSortAscending,
  AiOutlineSortDescending,
} from "react-icons/ai";
import { BsSearch } from "react-icons/bs";

export interface DataTableProps<TData extends object> {
  columns: ColumnDef<TData, unknown>[];
  data: TData[];
  containerClassname?: string;
  heading: string;
  showPagination?: boolean;
}

export function DataTable<TData extends object>({
  columns,
  data,
  containerClassname = "dashboard-product-box",
  heading,
  showPagination = false,
}: DataTableProps<TData>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState<string>("");

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      globalFilter,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 6,
      },
    },
  });

  return (
    <div className={containerClassname}>
      <div className="table-top-bar">
        <h2 className="heading">{heading}</h2>
        <label
          className="table-search-box"
          htmlFor={`search-${heading.toLowerCase().replace(/\s+/g, "-")}`}
        >
          <BsSearch style={{ cursor: "pointer" }} aria-hidden="true" />
          <input
            id={`search-${heading.toLowerCase().replace(/\s+/g, "-")}`}
            type="search"
            placeholder={`Search in ${heading.toLowerCase()}...`}
            value={globalFilter ?? ""}
            onChange={(e) => setGlobalFilter(e.target.value)}
          />
        </label>
      </div>

      <div className="table-wrapper">
        <table className="table">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  const canSort = header.column.getCanSort();
                  const isSorted = header.column.getIsSorted();

                  return (
                    <th
                      key={header.id}
                      onClick={header.column.getToggleSortingHandler()}
                      style={{ cursor: canSort ? "pointer" : "default" }}
                    >
                      <div className="th-content">
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                        {isSorted === "asc" && (
                          <AiOutlineSortAscending className="sort-icon" />
                        )}
                        {isSorted === "desc" && (
                          <AiOutlineSortDescending className="sort-icon" />
                        )}
                      </div>
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  style={{ textAlign: "center", padding: "2rem" }}
                >
                  <span style={{ color: "#64748b" }}>
                    No matching records found.
                  </span>
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row) => (
                <tr key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showPagination && table.getPageCount() > 0 && (
        <div className="table-pagination">
          <div className="table-page-info">
            <span>
              Page <strong>{table.getState().pagination.pageIndex + 1}</strong> of{" "}
              <strong>{table.getPageCount()}</strong>
            </span>
            <span className="total-records">({data.length} total entries)</span>
          </div>

          <div className="pagination-controls">
            <button
              disabled={!table.getCanPreviousPage()}
              onClick={() => table.previousPage()}
            >
              Previous
            </button>
            <button
              disabled={!table.getCanNextPage()}
              onClick={() => table.nextPage()}
            >
              Next
            </button>
            <select
              value={table.getState().pagination.pageSize}
              onChange={(e) => table.setPageSize(Number(e.target.value))}
              className="page-size-select"
            >
              {[6, 10, 20, 50].map((pageSize) => (
                <option key={pageSize} value={pageSize}>
                  Show {pageSize}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}
    </div>
  );
}

export function TableHOC<TData extends object>(
  columns: ColumnDef<TData, unknown>[],
  data: TData[],
  containerClassname: string,
  heading: string,
  showPagination: boolean = false
) {
  return function HOC() {
    return (
      <DataTable
        columns={columns}
        data={data}
        containerClassname={containerClassname}
        heading={heading}
        showPagination={showPagination}
      />
    );
  };
}

export default TableHOC;
