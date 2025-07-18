import React from "react";
import "./PaymentPolicyPage.scss";
import { ROUTERS } from "../../../utils/router";
import Breadcrumb from "../theme/breadcrumb";

const PaymentPolicyPage = () => (
  <>
    <Breadcrumb
      title="Chính sách thanh toán"
      paths={[
        { name: "Trang chủ", path: ROUTERS.USER.HOME },
        { name: "Chính sách thanh toán"},
      ]}
    />
    <div className="payment-policy-container">
      <div className="payment-policy-content">
        <h2>Chính sách thanh toán</h2>
        <hr />
        <h3>1. Hình thức thanh toán bằng tiền mặt</h3>
        <b>1.a. Thanh toán trực tiếp tại cửa hàng</b>
        <p>
          Quý khách hàng vui lòng thanh toán trực tiếp tại cửa hàng ngay khi mua
          hàng
        </p>
        <b>1.b. Thanh toán tại điểm giao hàng</b>
        <ul>
          <li>
            Quý khách thanh toán cho nhân viên giao nhận toàn bộ hoặc phần còn
            lại của giá trị đơn hàng đã mua (nếu đã đặt cọc)
          </li>
          <li>
            Nếu địa điểm giao hàng ngay tại nơi thanh toán, nhân viên giao hàng
            của chúng tôi sẽ thu tiền khi giao hàng.
          </li>
        </ul>
        <h3>2. Thanh toán bằng chuyển khoản</h3>
        <p>
          <i>*Thông tin chuyển khoản:</i>
        </p>
        <p>
          <b>Tên thụ hưởng:</b> CÔNG TY TNHH THƯƠNG MẠI DỊCH VỤ HNOSS
        </p>
        <p>
          <b>Ngân hàng:</b> VCB
        </p>
        <p>
          <b>STK:</b> 1031411523
        </p>
        <p>
          <b>Nội dung:</b> Tên + SĐT
        </p>
      </div>
    </div>
  </>
);

export default PaymentPolicyPage;
