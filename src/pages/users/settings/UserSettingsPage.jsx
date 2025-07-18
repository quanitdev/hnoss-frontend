import { NavLink, useSearchParams } from "react-router-dom";
import EditInfo from "./EditInfo";
import ChangePassword from "./ChangePassword";
import OrdersTab from "./OrdersTab";
import VouchersTab from "./VoucherTab";
import "./styles/style.scss";
import { FaUser, FaLock, FaBox, FaGift } from "react-icons/fa";

export default function UserSettingsPage() {
  const [searchParams] = useSearchParams();
  const tab = searchParams.get("tab") || "info";

  const renderContent = () => {
    switch (tab) {
      case "info":
        return <EditInfo />;
      case "password":
        return <ChangePassword />;
      case "orders":
        return <OrdersTab />;
      case "vouchers":
        return <VouchersTab />;
      default:
        return <EditInfo />;
    }
  };

  return (
    <div className="user-settings-layout">
      <div className="user-settings-tabs">
        <div className="tab-menu">
          <NavLink
            to="?tab=info"
            className={() => (tab === "info" ? "active" : "")}
          >
            <span className="icon">
              <FaUser />
            </span>{" "}
            Thông tin
          </NavLink>
          <NavLink
            to="?tab=password"
            className={() => (tab === "password" ? "active" : "")}
          >
            <span className="icon">
              <FaLock />
            </span>{" "}
            Đổi mật khẩu
          </NavLink>
          <NavLink
            to="?tab=orders"
            className={() => (tab === "orders" ? "active" : "")}
          >
            <span className="icon">
              <FaBox />
            </span>{" "}
            Đơn mua
          </NavLink>
          <NavLink
            to="?tab=vouchers"
            className={() => (tab === "vouchers" ? "active" : "")}
          >
            <span className="icon">
              <FaGift />
            </span>{" "}
            Kho voucher
          </NavLink>
        </div>
      </div>
      <div className="user-settings-content">{renderContent()}</div>
    </div>
  );
}
