import { memo } from "react";
import { ROUTERS } from "../../../../utils/router";
import { useLocation, useNavigate } from "react-router-dom";
import { AiOutlineLogout, AiOutlineShoppingCart } from "react-icons/ai";
import "./style.scss";

const HeaderAd = ({ children, ...props }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const navItems = [
    {
      path: ROUTERS.ADMIN.ORDERS,
      onClick: () => navigate(ROUTERS.ADMIN.ORDERS),
      label: "Quản lý đơn hàng",
      icon: <AiOutlineShoppingCart />,
    },
    {
      path: ROUTERS.ACCOUNT.LOGIN,
      onClick: () => navigate(ROUTERS.ADMIN.O),
      label: "Đăng xuất",
      icon: <AiOutlineLogout />,
    },
  ];

  return (
    <div className="admin_header container" {...props}>
      <nav className="admin_header_nav">
        {navItems.map(({ path, onClick, label, icon }) => (
          <div
            key={path}
            className={`admin_header_nav_item  ${
              location.pathname.includes(path)
                ? "admin_header_nav_item_active"
                : ""
            }`}
            onClick={onClick}
          >
            <span className="admin_header_nav_icon">{icon}</span>
            <span>{label}</span>
          </div>
        ))}
      </nav>
    </div>
  );
};

export default memo(HeaderAd);
