import { BiMaleFemale } from "react-icons/bi";
import { BsSearch } from "react-icons/bs";
import { FaRegBell, FaStore, FaExclamationTriangle } from "react-icons/fa";
import { HiTrendingDown, HiTrendingUp } from "react-icons/hi";
import { Link } from "react-router-dom";
import AdminSidebar from "../../components/admin/AdminSidebar";
import { BarChart, DoughnutChart } from "../../components/admin/Charts";
import Table from "../../components/admin/DashboardTable";
import data from "../../assets/data.json";
import { useEcommerce } from "../../context/EcommerceContext";

const userImg =
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSJxA5cTf-5dh5Eusm0puHbvAhOrCRPtckzjA&usqp";

const Dashboard = () => {
  const { products, orders, customers } = useEcommerce();

  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
  const totalUsers = customers.length;
  const totalTransactions = orders.length;
  const totalProducts = products.length;
  const lowStockProducts = products.filter((p) => p.stock <= 5);

  const dashboardTransactions = orders.slice(0, 6).map((o) => ({
    id: o.id,
    amount: o.total,
    quantity: o.orderItems.reduce((acc, i) => acc + i.quantity, 0),
    discount: o.discount,
    status: o.status,
  }));

  return (
    <div className="admin-container">
      <AdminSidebar />
      <main className="dashboard" id="main-content" tabIndex={-1}>
        <div className="bar">
          <button type="button" className="admin-search-btn" aria-label="Search records">
            <BsSearch aria-hidden="true" />
          </button>
          <input
            type="text"
            placeholder="Search for data, users, docs..."
            aria-label="Search dashboard data and metrics"
          />
          <Link
            to="/"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.4rem",
              background: "#eff6ff",
              color: "#2563eb",
              padding: "0.4rem 0.8rem",
              borderRadius: "6px",
              fontSize: "0.85rem",
              fontWeight: "700",
            }}
          >
            <FaStore /> View Storefront
          </Link>
          <FaRegBell />
          <img src={userImg} alt="User" />
        </div>

        <section className="widget-container">
          <WidgetItem
            percent={40}
            amount={true}
            value={totalRevenue}
            heading="Revenue"
            color="rgb(0, 115, 255)"
          />
          <WidgetItem
            percent={14}
            value={totalUsers}
            color="rgb(0 198 202)"
            heading="Users"
          />
          <WidgetItem
            percent={80}
            value={totalTransactions}
            color="rgb(255 196 0)"
            heading="Transactions"
          />

          <WidgetItem
            percent={30}
            value={totalProducts}
            color="rgb(76 0 255)"
            heading="Products"
          />
        </section>

        <section className="graph-container">
          <div className="revenue-chart">
            <h2>Revenue & Transaction</h2>
            <BarChart
              data_2={[300, 144, 433, 655, 237, 755, 190]}
              data_1={[200, 444, 343, 556, 778, 455, 990]}
              title_1="Revenue"
              title_2="Transaction"
              bgColor_1="rgb(0, 115, 255)"
              bgColor_2="rgba(53, 162, 235, 0.8)"
            />
          </div>

          <div className="dashboard-categories">
            <h2>Inventory</h2>

            <div>
              {data.categories.map((i) => (
                <CategoryItem
                  key={i.heading}
                  value={i.value}
                  heading={i.heading}
                  color={`hsl(${i.value * 4}, ${i.value}%, 50%)`}
                />
              ))}
            </div>
          </div>
        </section>

        {lowStockProducts.length > 0 && (
          <section
            className="low-stock-alert-section"
            style={{
              background: "#fff",
              borderRadius: "16px",
              padding: "1.5rem",
              margin: "2rem 0",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.04)",
              border: "1px solid #fed7aa",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "1rem",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                }}
              >
                <FaExclamationTriangle
                  style={{ color: "#ea580c", fontSize: "1.2rem" }}
                />
                <h2
                  style={{
                    fontSize: "1.1rem",
                    fontWeight: "700",
                    color: "#9a3412",
                    margin: 0,
                  }}
                >
                  Low Inventory Alerts ({lowStockProducts.length} Items need attention)
                </h2>
              </div>
              <Link
                to="/admin/product"
                style={{
                  fontSize: "0.85rem",
                  fontWeight: "600",
                  color: "#2563eb",
                }}
              >
                Manage All Inventory &rarr;
              </Link>
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fill, minmax(280px, 1fr))",
                gap: "1rem",
              }}
            >
              {lowStockProducts.map((p) => (
                <div
                  key={p.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    background: "#fff7ed",
                    padding: "0.75rem 1rem",
                    borderRadius: "10px",
                    border: "1px solid #ffedd5",
                  }}
                >
                  <div>
                    <div
                      style={{
                        fontWeight: "700",
                        fontSize: "0.9rem",
                        color: "#1e293b",
                      }}
                    >
                      {p.name}
                    </div>
                    <div
                      style={{ fontSize: "0.75rem", color: "#64748b" }}
                    >
                      SKU: {p.id} &bull; {p.category}
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <span
                      style={{
                        display: "inline-block",
                        padding: "0.2rem 0.5rem",
                        borderRadius: "999px",
                        fontSize: "0.75rem",
                        fontWeight: "700",
                        background:
                          p.stock === 0 ? "#fee2e2" : "#fef3c7",
                        color:
                          p.stock === 0 ? "#b91c1c" : "#b45309",
                        marginBottom: "0.3rem",
                      }}
                    >
                      {p.stock === 0 ? "Out of Stock" : `${p.stock} left`}
                    </span>
                    <Link
                      to={`/admin/product/${p.id}`}
                      style={{
                        display: "block",
                        fontSize: "0.75rem",
                        color: "#2563eb",
                        fontWeight: "600",
                      }}
                    >
                      Restock
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        <section className="transaction-container">
          <div className="gender-chart">
            <h2>Gender Ratio</h2>
            <DoughnutChart
              labels={["Female", "Male"]}
              data={[12, 19]}
              backgroundColor={[
                "hsl(340, 82%, 56%)",
                "rgba(53, 162, 235, 0.8)",
              ]}
              cutout={90}
            />
            <p>
              <BiMaleFemale />
            </p>
          </div>
          <Table data={dashboardTransactions} />
        </section>
      </main>
    </div>
  );
};

interface WidgetItemProps {
  heading: string;
  value: number;
  percent: number;
  color: string;
  amount?: boolean;
}

const WidgetItem = ({
  heading,
  value,
  percent,
  color,
  amount = false,
}: WidgetItemProps) => (
  <article className="widget">
    <div className="widget-info">
      <p>{heading}</p>
      <h4>{amount ? `₹${value}` : value}</h4>
      {percent > 0 ? (
        <span className="green">
          <HiTrendingUp /> +{percent}%{" "}
        </span>
      ) : (
        <span className="red">
          <HiTrendingDown /> {percent}%{" "}
        </span>
      )}
    </div>

    <div
      className="widget-circle"
      style={{
        background: `conic-gradient(
        ${color} ${(Math.abs(percent) / 100) * 360}deg,
        rgb(255, 255, 255) 0
      )`,
      }}
    >
      <span
        style={{
          color,
        }}
      >
        {percent}%
      </span>
    </div>
  </article>
);

interface CategoryItemProps {
  color: string;
  value: number;
  heading: string;
}

const CategoryItem = ({ color, value, heading }: CategoryItemProps) => (
  <div className="category-item">
    <h5>{heading}</h5>
    <div>
      <div
        style={{
          backgroundColor: color,
          width: `${value}%`,
        }}
      ></div>
    </div>
    <span>{value}%</span>
  </div>
);

export default Dashboard;
