import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import "./admindashboard.scss";

const AdminOverviewPage = () => {
  const [stats, setStats] = useState(null);
  const [range, setRange] = useState("month");

  useEffect(() => {
    fetchStats();
  }, [range]);

  const fetchStats = async () => {
    const res = await axios.get(
      `http://localhost:5000/api/admin/dashboard-stats?range=${range}`
    );
    setStats(res.data);
  };

  if (!stats) return <p>Đang tải dữ liệu...</p>;

  return (
    <div className="admin-dashboard">
      <h2>Tổng quan doanh số</h2>

      <div className="time-filter">
        <label>Khoảng thời gian: </label>
        <select value={range} onChange={(e) => setRange(e.target.value)}>
          <option value="day">Hôm nay</option>
          <option value="week">Tuần này</option>
          <option value="month">Tháng này</option>
        </select>
      </div>

      <div className="dashboard-cards">
        <div className="card">
          <h3>Doanh thu</h3>
          <p>{stats.totalRevenue.toLocaleString()} đ</p>
        </div>
        <div className="card">
          <h3>Đơn hoàn thành</h3>
          <p>{stats.totalOrders}</p>
        </div>
        <div className="card">
          <h3>Sản phẩm đã bán</h3>
          <p>{stats.totalProductsSold}</p>
        </div>
      </div>

      {/* Bảng thống kê đơn hàng theo trạng thái */}
      <h3>Thống kê đơn hàng trong tháng</h3>
      <table
        style={{
          width: "100%",
          marginBottom: 24,
          textAlign: "center",
          borderCollapse: "collapse",
        }}
      >
        <thead>
          <tr>
            <th style={{ border: "1px solid #ccc", padding: 8 }}>Tổng đơn</th>
            <th style={{ border: "1px solid #ccc", padding: 8 }}>Chờ xử lý</th>
            <th style={{ border: "1px solid #ccc", padding: 8 }}>Đang xử lý</th>
            <th style={{ border: "1px solid #ccc", padding: 8 }}>Đang giao</th>
            <th style={{ border: "1px solid #ccc", padding: 8 }}>Hoàn tất</th>
            <th style={{ border: "1px solid #ccc", padding: 8 }}>Đã huỷ</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style={{ border: "1px solid #ccc", padding: 8 }}>
              {stats.orderStats?.total || 0}
            </td>
            <td style={{ border: "1px solid #ccc", padding: 8 }}>
              {stats.orderStats?.pending || 0}
            </td>
            <td style={{ border: "1px solid #ccc", padding: 8 }}>
              {stats.orderStats?.processing || 0}
            </td>
            <td style={{ border: "1px solid #ccc", padding: 8 }}>
              {stats.orderStats?.shipped || 0}
            </td>
            <td style={{ border: "1px solid #ccc", padding: 8 }}>
              {stats.orderStats?.delivered || 0}
            </td>
            <td style={{ border: "1px solid #ccc", padding: 8 }}>
              {stats.orderStats?.cancelled || 0}
            </td>
          </tr>
        </tbody>
      </table>

      <h3>Biểu đồ doanh thu</h3>
      {/* <ResponsiveContainer width="100%" height={300}>
        <BarChart data={stats.revenueChart}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="total" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer> */}
      <div style={{ width: "100%", height: 300 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={stats.revenueChart}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="label" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="total" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <h3>Top sản phẩm bán chạy</h3>
      <div className="top-products-ladder">
        {stats.topProducts.map((p, idx) => (
          <div
            key={p.id}
            className="product-item-ladder"
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: 16,
              marginLeft: idx * 32, // Tạo hiệu ứng bậc thang
              background: "#fff",
              borderRadius: 8,
              boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
              padding: 12,
              position: "relative",
              minWidth: 320,
            }}
          >
            <div
              style={{
                width: 60,
                height: 60,
                borderRadius: 8,
                overflow: "hidden",
                marginRight: 16,
                border: "1px solid #eee",
              }}
            >
              <img
                src={p.image}
                alt={p.name}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>
            <div style={{ flex: 1 }}>
              <h4 style={{ margin: 0 }}>{p.name}</h4>
              <p style={{ margin: 0, color: "#888" }}>Đã bán: {p.sold}</p>
              {p.inventory !== undefined && p.inventory < 10 && (
                <div style={{ color: "red", fontWeight: "bold", marginTop: 4 }}>
                  Sắp hết hàng, cần nhập thêm!
                </div>
              )}
            </div>
            <div
              style={{
                position: "absolute",
                left: -32,
                top: "50%",
                transform: "translateY(-50%)",
                fontWeight: "bold",
                fontSize: 20,
                color: "#007bff",
              }}
            >
              {idx + 1}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminOverviewPage;
