import { useEffect, useState } from "react";
import axios from "axios";
import { SESSION_KEYS } from "../../../utils/constant";
import "./styles/_OrdersTab.scss";

export default function OrdersTab() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const user = ReactSession.get(SESSION_KEYS.USER_INFO);

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
        setOrders(res.data);
      } catch {
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
        return "🔄 Đang xử lý";
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
    <div className="orders-tab">
      <h2>📦 Đơn hàng của tôi</h2>

      {loading && <p>Đang tải đơn hàng...</p>}
      {error && <p className="error-text">{error}</p>}
      {!loading && !error && orders.length === 0 && (
        <p className="empty-text">Bạn chưa có đơn hàng nào.</p>
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
              {order.total_pay?.toLocaleString()}₫
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
}
