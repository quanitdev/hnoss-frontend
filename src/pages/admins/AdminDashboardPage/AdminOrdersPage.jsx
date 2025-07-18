import { useEffect, useState } from "react";
import axios from "axios";
import "./orderpage.scss";
import { useNavigate } from "react-router-dom";
import logo from "../../../assets/users/images/logo/logo.png";

const statusOptions = [
  { value: "pending", label: "Chờ xác nhận" },
  { value: "processing", label: "Đang xử lý" },
  { value: "shipped", label: "Đang giao" },
  { value: "delivered", label: "Hoàn tất" },
  { value: "cancelled", label: "Đã huỷ" },
];

const statusLabel = (status) => {
  const found = statusOptions.find((opt) => opt.value === status);
  return found ? found.label : status;
};

const AdminOrdersPage = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState("all");
  const [msg, setMsg] = useState("");
  const [showInvoice, setShowInvoice] = useState(false);
  const [invoiceOrder, setInvoiceOrder] = useState(null);
  const [invoiceUser, setInvoiceUser] = useState(null);
  const [loadingInvoice, setLoadingInvoice] = useState(false);

  // Lấy danh sách đơn hàng và user
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/orders")
      .then((res) => setOrders(res.data))
      .catch(() => setMsg("Lỗi lấy đơn hàng"));

    axios
      .get("http://localhost:5000/api/users")
      .then((res) => setUsers(res.data))
      .catch(() => setMsg("Lỗi lấy danh sách user"));
  }, []);

  // Lọc đơn hàng theo user
  const filteredOrders =
    selectedUser === "all"
      ? orders
      : orders.filter((order) => order.user_id === Number(selectedUser));

  const handleStatusChange = (id, status) => {
    axios
      .put(`http://localhost:5000/api/orders/update-status/${id}`, { status })
      .then(() => {
        setOrders((prev) =>
          prev.map((order) => (order.id === id ? { ...order, status } : order))
        );
        setMsg("Cập nhật trạng thái thành công!");
      })
      .catch(() => setMsg("Lỗi cập nhật trạng thái!"));
  };

  // Hiển thị hóa đơn modal
  const openInvoice = async (orderId) => {
    setLoadingInvoice(true);
    setShowInvoice(true);
    try {
      const [orderRes, usersRes] = await Promise.all([
        axios.get(`http://localhost:5000/api/orders/${orderId}`),
        axios.get("http://localhost:5000/api/users"),
      ]);
      console.log("orderRes.data:", orderRes.data);
      setInvoiceOrder({
        ...orderRes.data.order,
        products: orderRes.data.items,
      });
      const foundUser = usersRes.data.find(
        (u) => Number(u.id) === Number(orderRes.data.order.user_id)
      );
      setInvoiceUser(foundUser);
    } catch (e) {
      setInvoiceOrder(null);
      setInvoiceUser(null);
    }
    setLoadingInvoice(false);
  };

  return (
    <div className="admin-order">
      <h2>📦 Quản lý đơn hàng</h2>
      {/* Dropdown lọc user */}
      <div style={{ marginBottom: 16 }}>
        <label>
          Lọc theo người dùng:{" "}
          <select
            value={selectedUser}
            onChange={(e) => setSelectedUser(e.target.value)}
            style={{ padding: 6, borderRadius: 4, minWidth: 120 }}
          >
            <option value="all">Tất cả</option>
            {users.map((u) => (
              <option key={u.id} value={u.id}>
                {u.name}
              </option>
            ))}
          </select>
        </label>
      </div>
      {msg && (
        <p style={{ color: msg.includes("thành công") ? "green" : "crimson" }}>
          {msg}
        </p>
      )}
      <table>
        <thead>
          <tr>
            <th>Tên người dùng</th>
            <th>ID</th>
            <th>Người nhận</th>
            <th>Địa chỉ</th>
            <th>Tổng tiền</th>
            <th>Trạng thái</th>
            <th>Hành động</th>
            <th>Hóa đơn</th>
          </tr>
        </thead>
        <tbody>
          {filteredOrders.map((order) => {
            // Tìm tên user theo user_id
            const user = users.find(
              (u) => Number(u.id) === Number(order.user_id)
            );
            return (
              <tr key={order.id}>
                <td>{user ? user.name : "Không rõ"}</td>
                <td>{order.id}</td>
                <td>{order.receiver_name}</td>
                <td>{order.shipping_address}</td>
                <td>{order.total_pay?.toLocaleString()}đ</td>
                <td>{statusLabel(order.status)}</td>
                <td>
                  <select
                    value={order.status}
                    onChange={(e) =>
                      handleStatusChange(order.id, e.target.value)
                    }
                  >
                    {/* Luôn hiển thị trạng thái hiện tại */}
                    <option value={order.status}>
                      {statusLabel(order.status)}
                    </option>
                    {/* Nếu chưa phải Hoàn tất/Đã huỷ, cho phép chuyển sang trạng thái kế tiếp */}
                    {(() => {
                      const currentIdx = statusOptions.findIndex(
                        (opt) => opt.value === order.status
                      );
                      // Nếu chưa phải trạng thái cuối cùng và chưa bị huỷ, cho phép chuyển sang trạng thái tiếp theo
                      if (
                        currentIdx !== -1 &&
                        currentIdx < statusOptions.length - 2 && // trừ 2 vì cuối là 'Hoàn tất', kế cuối là 'Đã huỷ'
                        order.status !== "cancelled"
                      ) {
                        const nextOpt = statusOptions[currentIdx + 1];
                        return (
                          <option value={nextOpt.value}>{nextOpt.label}</option>
                        );
                      }
                      // Nếu trạng thái hiện tại là 'Đang giao', cho phép sang 'Hoàn tất'
                      if (order.status === "shipped") {
                        const deliveredOpt = statusOptions.find(
                          (opt) => opt.value === "delivered"
                        );
                        return (
                          <option value={deliveredOpt.value}>
                            {deliveredOpt.label}
                          </option>
                        );
                      }
                      return null;
                    })()}
                    {/* Cho phép chuyển sang Đã huỷ nếu chưa phải Hoàn tất/Đã huỷ */}
                    {order.status !== "delivered" &&
                      order.status !== "cancelled" && (
                        <option value="cancelled">Đã huỷ</option>
                      )}
                  </select>
                </td>
                <td>
                  <button
                    style={{
                      padding: "10px 25px",
                      borderRadius: 4,
                      background: "#2e8b57",
                      color: "#fff",
                      border: "none",
                      cursor: "pointer",
                    }}
                    onClick={() => openInvoice(order.id)}
                  >
                    Hóa đơn
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      {/* Modal hóa đơn */}
      {showInvoice && (
        <div
          className="invoice-modal"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(0,0,0,0.3)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
          onClick={() => setShowInvoice(false)}
        >
          <div
            style={{
              background: "#fff",
              borderRadius: 10,
              minWidth: 340,
              maxWidth: 900,
              padding: 32,
              boxShadow: "0 2px 16px rgba(0,0,0,0.18)",
              position: "relative",
              width: "90vw",
              maxHeight: "90vh",
              overflowY: "auto",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {loadingInvoice ? (
              <div style={{ padding: 40, textAlign: "center" }}>
                Đang tải hóa đơn...
              </div>
            ) : !invoiceOrder || !invoiceOrder.id ? (
              <div
                style={{ padding: 40, textAlign: "center", color: "crimson" }}
              >
                Không tìm thấy đơn hàng!
              </div>
            ) : (
              <>
                <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
                  <img src={logo} alt="HNOSS" style={{ height: 70 }} />
                  <h2 style={{ flex: 1, textAlign: "center", margin: 0 }}>
                    HÓA ĐƠN BÁN HÀNG
                  </h2>
                </div>
                <div style={{ margin: "18px 0 8px 0", fontWeight: 500 }}>
                  CÔNG TY TNHH MTV HNOSS
                  <br />
                  Địa chỉ: 176 Trần Phú, Phường Phước Vĩnh, TP Huế
                  <br />
                  Số điện thoại: (+84)98764794
                  <br />
                  Email: hnoss@gmail.com
                </div>
                <div
                  style={{
                    background: "#eafbe7",
                    color: "#2e8b57",
                    padding: 10,
                    borderRadius: 6,
                    margin: "12px 0",
                    fontWeight: 600,
                    fontSize: 18,
                  }}
                >
                  ✓ Đặt hàng thành công
                </div>
                <div style={{ marginBottom: 12 }}>
                  <b>Tên:</b> {invoiceUser?.name || "Không rõ"} &nbsp;{" "}
                  <b>Email:</b> {invoiceUser?.email || ""}
                  <br />
                  <b>SDT:</b> {invoiceOrder.receiver_phone || ""} &nbsp;{" "}
                  <b>Phương thức thanh toán:</b>{" "}
                  {invoiceOrder.payment_method || "COD"}
                  <br />
                  <b>
                    Tổng tiền:
                  </b> {invoiceOrder.total_pay?.toLocaleString()} đ &nbsp;{" "}
                  <b>Mã voucher:</b> {invoiceOrder.discount_code || ""}
                  <br />
                  <b>Điểm được tích:</b>{" "}
                  {Math.floor(invoiceOrder.total_pay / 120)} &nbsp;{" "}
                  <b>Điểm sử dụng:</b> {invoiceOrder.point_used || 0}
                  <br />
                  <b>Địa chỉ:</b> {invoiceOrder.shipping_address}
                  <br />
                  <b>Ghi chú:</b> {invoiceOrder.note || ""}
                </div>
                <table
                  style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    marginBottom: 18,
                  }}
                >
                  <thead>
                    <tr style={{ background: "#f6f8fa" }}>
                      <th
                        style={{
                          border: "1px solid #eee",
                          padding: 8,
                          textAlign: "left",
                        }}
                      >
                        SẢN PHẨM
                      </th>
                      <th style={{ border: "1px solid #eee", padding: 8 }}>
                        GIÁ BÁN
                      </th>
                      <th style={{ border: "1px solid #eee", padding: 8 }}>
                        SỐ LƯỢNG
                      </th>
                      <th style={{ border: "1px solid #eee", padding: 8 }}>
                        TỔNG CỘNG
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {(invoiceOrder.products || []).map((p, idx) => (
                      <tr key={idx}>
                        <td
                          style={{
                            border: "1px solid #eee",
                            padding: 8,
                            display: "flex",
                            alignItems: "center",
                            gap: 10,
                          }}
                        >
                          {p.img && (
                            <img
                              src={
                                p.img?.startsWith("http")
                                  ? p.img
                                  : `/assets/users/images/products/${p.img}`
                              }
                              alt={p.name}
                              style={{
                                width: 48,
                                height: 48,
                                objectFit: "cover",
                                borderRadius: 4,
                              }}
                            />
                          )}{" "}
                          {p.name}
                        </td>
                        <td style={{ border: "1px solid #eee", padding: 8 }}>
                          {p.price?.toLocaleString()} đ
                        </td>
                        <td style={{ border: "1px solid #eee", padding: 8 }}>
                          {p.quantity}
                        </td>
                        <td style={{ border: "1px solid #eee", padding: 8 }}>
                          {(p.price * p.quantity)?.toLocaleString()} đ
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginTop: 32,
                  }}
                >
                  <div>
                    <b>Khách hàng</b>
                    <div style={{ marginTop: 18 }}>{invoiceUser?.name}</div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <b>Đại diện cửa hàng</b>
                    <div style={{ marginTop: 18 }}>HNOSS</div>
                  </div>
                </div>
                <div style={{ display: "flex", gap: 16, marginTop: 32 }}>
                  <button
                    onClick={() => window.print()}
                    style={{
                      background: "#222",
                      color: "#fff",
                      border: "none",
                      borderRadius: 4,
                      padding: "8px 18px",
                      fontWeight: 500,
                      cursor: "pointer",
                    }}
                  >
                    Xuất PDF
                  </button>
                  <button
                    onClick={() => setShowInvoice(false)}
                    style={{
                      background: "#1656f0",
                      color: "#fff",
                      border: "none",
                      borderRadius: 4,
                      padding: "8px 18px",
                      fontWeight: 500,
                      cursor: "pointer",
                    }}
                  >
                    Đóng
                  </button>
                </div>
                <button
                  style={{
                    position: "absolute",
                    top: 8,
                    right: 12,
                    background: "none",
                    border: "none",
                    fontSize: 24,
                    cursor: "pointer",
                    color: "#2e8b57",
                  }}
                  onClick={() => setShowInvoice(false)}
                >
                  &times;
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrdersPage;
