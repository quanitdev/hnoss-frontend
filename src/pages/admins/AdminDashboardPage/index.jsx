import { useEffect, useState } from "react";
import AdminOrdersPage from "./AdminOrdersPage";
import AdminUsersPage from "./AdminUsersPage";
import AdminProductsPage from "./AdminProductsPage";
import "./style.scss";
import { SESSION_KEYS } from "../../../utils/constant";
import { useNavigate } from "react-router-dom";
import { ROUTERS } from "../../../utils/router";
import AdminBannerPage from "./AdminBannerPage";
import AdminOverviewPage from "./AdminOverviewPage";
import AdminVourcherPage from "./AdminVourcherPage";
import AdminContactsPage from "./AdminContactsPage";

export default function AdminDashboardPage() {
  const navigate = useNavigate();
  const [tab, setTab] = useState("overview");

  const user = localStorage.getItem(SESSION_KEYS.USER_INFO);
  // useEffect(() => {
  //   if (!user || JSON.parse(user).role !== "admin") {
  //     alert("❌ Bạn không có quyền truy cập trang này!");
  //     window.location.href = ROUTERS.ACCOUNT.LOGIN;
  //   }
  // }, [user, navigate]);

  return (
    <div className="admin-dashboard-layout">
      <div className="admin-sidebar">
        <div className="admin-greeting">
          Xin chào,<br></br> <b>{JSON.parse(user)?.name || "Admin"}</b>!
        </div>
        <button
          className={tab === "overview" ? "active" : ""}
          onClick={() => setTab("overview")}
        >
          📊 Tổng quan
        </button>
        <button
          className={tab === "orders" ? "active" : ""}
          onClick={() => setTab("orders")}
        >
          📦 Quản lý đơn hàng
        </button>
        <button
          className={tab === "users" ? "active" : ""}
          onClick={() => setTab("users")}
        >
          👥 Quản lý người dùng
        </button>
        <button
          className={tab === "products" ? "active" : ""}
          onClick={() => setTab("products")}
        >
          🛒 Quản lý sản phẩm
        </button>
        <button
          className={tab === "banner" ? "active" : ""}
          onClick={() => setTab("banner")}
        >
          🖼️ Quản lý Banner
        </button>
        <button
          className={tab === "voucher" ? "active" : ""}
          onClick={() => setTab("voucher")}
        >
          🎟️ Quản lý Voucher
        </button>
        <button
          className={tab === "contacts" ? "active" : ""}
          onClick={() => setTab("contacts")}
        >
          📬 Quản lý liên hệ
        </button>
        <button
          className="logout-btn"
          onClick={() => {
            localStorage.removeItem(SESSION_KEYS.USER_INFO);
            window.location.href = ROUTERS.ACCOUNT.LOGIN;
          }}
        >
          🚪 Đăng xuất
        </button>
      </div>
      <div className="admin-content">
        {tab === "overview" && <AdminOverviewPage />}
        {tab === "orders" && <AdminOrdersPage />}
        {tab === "users" && <AdminUsersPage />}
        {tab === "products" && <AdminProductsPage />}
        {tab === "banner" && <AdminBannerPage />}
        {tab === "voucher" && <AdminVourcherPage />}
        {tab === "contacts" && <AdminContactsPage />}
      </div>
    </div>
  );
}
