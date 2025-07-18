import { useEffect, useState } from "react";
import axios from "axios";
import "./style.scss";
import { ReactSession } from "react-client-session";
import { SESSION_KEYS } from "../../../utils/constant";

const UserOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const user = ReactSession.get(SESSION_KEYS.USER_INFO);
  console.log("User session:", user);

  useEffect(() => {
    if (!user?.id) {
      setError("❗ Bạn cần đăng nhập để xem đơn hàng.");
      setLoading(false);
      return;
    }

    const fetchOrders = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/orders/user/${user.id}`
        );
        console.log("Orders response:", res.data);
        setOrders(res.data);
      } catch (err) {
        setError("❌ Không thể tải đơn hàng. Vui lòng thử lại sau.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const formatStatus = (status) => {
    switch (status) {
      case "pending":
        return "🕒 Chờ xử lý";
      case "processing":
        return "🕒 Đang xử lý ";
      case "shipped":
        return "🚚 Đang giao";
      case "delivered":
        return "✅ Đã giao";
      case "cancelled":
        return "❌ Đã huỷ";
      default:
        return status;
    }
  };

  return (
    <div className="user-orders">
      <h2>📄 Đơn hàng của tôi</h2>

      {loading && <p>Đang tải đơn hàng...</p>}
      {error && (
        <p style={{ color: "crimson", textAlign: "center" }}>{error}</p>
      )}
      {!loading && !error && orders.length === 0 && (
        <p style={{ textAlign: "center" }}>Bạn chưa có đơn hàng nào.</p>
      )}

      <ul className="order-list">
        {orders.map((order) => (
          <li key={order.id} className="order-item">
            <p>
              <strong>Mã đơn:</strong> #{order.id}
            </p>
            <p>
              <strong>Ngày đặt:</strong>{" "}
              {new Date(order.created_at).toLocaleString()}
            </p>
            <p>
              <strong>Tổng thanh toán:</strong>{" "}
              {order.total_pay?.toLocaleString()}đ
            </p>
            <p>
              <strong>Trạng thái:</strong>{" "}
              <span className={`order-status ${order.status}`}>
                {formatStatus(order.status)}
              </span>
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserOrdersPage;
