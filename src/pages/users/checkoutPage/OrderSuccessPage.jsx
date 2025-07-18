import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { formatter } from "../../../utils/fomater";
import "./style.scss";

const OrderSuccessPage = ({ orderInfo }) => {
  const navigate = useNavigate();
  useEffect(() => {
    if (!sessionStorage.getItem("ORDER_SUCCESS_RELOADED")) {
      sessionStorage.setItem("ORDER_SUCCESS_RELOADED", "1");
      window.location.reload();
    } else {
      sessionStorage.removeItem("ORDER_SUCCESS_RELOADED");
    }
  }, []);
  const info =
    orderInfo || JSON.parse(sessionStorage.getItem("ORDER_SUCCESS_INFO"));
  if (!info) return <div>Không tìm thấy thông tin đơn hàng!</div>;

  return (
    <div className="order-success-page">
      {/* PHẦN 1: Logo + HÓA ĐƠN BÁN HÀNG */}
      <div
        className="print-section print-header"
        style={{
          display: "flex",
          alignItems: "center",
          marginBottom: 8,
          position: "relative",
          height: 60,
        }}
      >
        <img
          src={require("../../../assets/users/images/logo/logo.png")}
          alt="logo"
          style={{
            height: 36,
            position: "absolute",
            left: 0,
            top: "50%",
            transform: "translateY(-50%)",
          }}
        />
        <div
          style={{
            fontWeight: 700,
            fontSize: 22,
            letterSpacing: 1,
            margin: "0 auto",
            textAlign: "center",
            width: "100%",
          }}
        >
          HÓA ĐƠN BÁN HÀNG
        </div>
      </div>
      {/* PHẦN 2: Thông tin công ty */}
      <div className="print-section print-company" style={{ marginBottom: 16 }}>
        <div>
          <b>CÔNG TY TNHH MTV HNOSS</b>
        </div>
        <div>Địa chỉ: 176 Trần Phú, Phường Phước Vĩnh, TP Huế</div>
        <div>Số điện thoại: (+84)98764794</div>
        <div>Email: hnoss@gmail.com</div>
      </div>
      {/* PHẦN 3: Thông tin đơn hàng */}
      <div className="print-section print-order-form">
        <div className="order-success-banner">
          <div className="success-check">✔</div>
          <span className="success-title">Đặt hàng thành công</span>
        </div>
        <div className="order-success-info">
          <div className="order-success-row">
            <div>
              <b>Tên:</b> {info.receiver_name}
            </div>
            <div>
              <b>Email:</b> {info.receiver_email}
            </div>
          </div>
          <div className="order-success-row">
            <div>
              <b>SDT:</b> {info.receiver_phone}
            </div>
            <div>
              <b>Phương thức thanh toán:</b>{" "}
              {info.payment_method === "bank" ? "VNPay" : "COD"}
            </div>
          </div>
          <div className="order-success-row">
            <div>
              <b>Tổng tiền:</b> {formatter(info.totalPay)}
            </div>
            <div>
              <b>Mã voucher:</b> {info.discountCode || ""}
            </div>
          </div>
          <div className="order-success-row">
            <div>
              <b>Điểm được tích:</b>{" "}
              {info.loyaltyPoint || Math.floor(info.totalPay / 120)}
            </div>
            <div>
              <b>Điểm sử dụng:</b> {info.usedPoint || 0}
            </div>
          </div>
          <div className="order-success-row">
            <div style={{ width: "100%" }}>
              <b>Địa chỉ:</b> {info.shipping_address}
            </div>
          </div>
          <div className="order-success-row">
            <div style={{ width: "100%" }}>
              <b>Ghi chú:</b> {info.note || ""}
            </div>
          </div>
        </div>
        <div className="order-success-table">
          <table>
            <thead>
              <tr>
                <th>SẢN PHẨM</th>
                <th>GIÁ BÁN</th>
                <th>SỐ LƯỢNG</th>
                <th>TỔNG CỘNG</th>
              </tr>
            </thead>
            <tbody>
              {info.products.map((item, idx) => (
                <tr key={idx}>
                  <td style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <img
                      src={item.img}
                      alt="product"
                      style={{
                        width: 50,
                        height: 50,
                        objectFit: "cover",
                        borderRadius: 4,
                      }}
                    />
                    <div>
                      {item.name} <br />
                      {item.color ? `${item.color}/` : ""}
                      {item.size}
                    </div>
                  </td>
                  <td>{formatter(item.price)}</td>
                  <td>{item.quantity}</td>
                  <td>{formatter(item.price * item.quantity)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {/* PHẦN 4: Chữ ký */}
      <div
        className="print-section print-signature"
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: 40,
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div>
            <b>Khách hàng</b>
          </div>
          <div style={{ height: 60 }}></div>
          <div>{info.receiver_name}</div>
        </div>
        <div style={{ textAlign: "center" }}>
          <div>
            <b>Đại diện cửa hàng</b>
          </div>
          <div style={{ height: 60 }}></div>
          <div>HNOSS</div>
        </div>
      </div>
      <div className="order-success-actions">
        <button onClick={() => window.print()}>Xuất PDF</button>
        <button onClick={() => navigate("/")}>Quay về trang chủ</button>
      </div>
    </div>
  );
};

export default OrderSuccessPage;
