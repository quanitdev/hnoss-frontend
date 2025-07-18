import { memo, useEffect, useState } from "react";
import "./style.scss";
import {
  AiOutlineShoppingCart,
  AiOutlineUser,
  AiOutlineDownCircle,
  AiOutlineUpCircle,
} from "react-icons/ai";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { formatter } from "../../../utils/fomater";
import { ROUTERS } from "../../../utils/router";
import { useGetCategoriesUS } from "../../../api/homePage";
import { useDispatch, useSelector } from "react-redux";
import { SESSION_KEYS } from "../../../utils/constant";
import { setCart } from "../../../redux/commonSlide";
import logo from "../../../assets/users/images/logo/logo.png";
export const categories = [];
const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [isShowHumberger, setShowHumberger] = useState(false);
  const [isHome, setIsHome] = useState(location.pathname.length <= 1);
  const [isShowCategories, setShowCategories] = useState(isHome);
  const { cart: cartRedux } = useSelector((state) => state.commonSlide);

  const [menus, setMenus] = useState([
    {
      name: "Trang chủ",
      path: ROUTERS.USER.HOME,
    },
    {
      name: "Cửa hàng",
      path: ROUTERS.USER.PRODUCTS,
    },
    {
      name: "Sản phẩm",
      path: "",
      isShowSubmenu: false,
      child: [],
    },
    {
      name: "Giới thiệu",
      path: ROUTERS.USER.ABOUT,
    },
    {
      name: "Liên hệ",
      path: ROUTERS.USER.CONTACT,
    },
  ]);

  useEffect(() => {
    const isHome = location.pathname.length <= 1;
    setIsHome(isHome);
    setShowCategories(isHome);
  }, [location]);

  const { data: categories } = useGetCategoriesUS();

  useEffect(() => {
    if (categories) {
      setMenus((prevMenus) => {
        const newMenus = [...prevMenus];
        newMenus[2] = {
          ...newMenus[2],
          child: categories.map((category) => ({
            name: category.name,
            path: ROUTERS.USER.PRODUCTS,
          })),
        };
        return newMenus;
      });
    }
  }, [categories]);

  useEffect(() => {
    const cart = localStorage.getItem(SESSION_KEYS.CART);
    if (cart) {
      dispatch(setCart(cart));
    }
  }, [dispatch]);

  return (
    <>
      <div
        className={`humberger_menu_overlay ${isShowHumberger ? "active" : ""}`}
        onClick={() => setShowHumberger(false)}
      />

      <div
        className={`humberger_menu_wrapper ${isShowHumberger ? "show" : ""}`}
      >
        <div className="header_logo">
          <Link to={ROUTERS.USER.HOME}>
            <img src={logo} alt="HNOSS Logo" style={{ height: "50px" }} />
          </Link>
        </div>

        <div className="humberger_menu_cart">
          <ul>
            <li>
              <Link to={""}>
                <AiOutlineShoppingCart /> <span>0</span>
              </Link>
            </li>
          </ul>
          <div className="header_cart_price">
            Giỏ hàng: <span>{formatter(10012830)}</span>
          </div>
        </div>
        <div className="humberger_menu_widget">
          <div className="header_top_right_auth">
            <Link to={""}>
              <AiOutlineUser /> Đăng nhập
            </Link>
          </div>
        </div>

        <div className="humberger_menu_nav">
          <ul>
            {menus.map((menu, menuKey) => (
              <li key={menuKey} to={menu.path}>
                <Link
                  to={menu.path}
                  onClick={() => {
                    const newMenus = [...menus];
                    newMenus[menuKey].isShowSubmenu =
                      !newMenus[menuKey].isShowSubmenu;
                    setMenus(newMenus);
                  }}
                >
                  {menu.name}
                  {menu.child &&
                    (menu.isShowSubmenu ? (
                      <AiOutlineDownCircle />
                    ) : (
                      <AiOutlineUpCircle />
                    ))}
                </Link>
                {menu.child && (
                  <ul
                    className={`header_menu_dropdown ${
                      menu.isShowSubmenu ? "show_submenu" : ""
                    }`}
                  >
                    {menu.child.map((childItem, childKey) => (
                      <li key={`${menuKey}-${childKey}`}>
                        <Link to={childItem.path}>{childItem.name}</Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="container">
        {/*  */}
        <div className="row">
          {/*  */}
          <div className="col-lg-3">
            <div className="header_logo">
              <Link to={ROUTERS.USER.HOME}>
                <img src={logo} alt="HNOSS Logo" style={{ height: "35px" }} />
              </Link>
            </div>
          </div>
          {/* / */}
          <div className="col-lg-6 ">
            <nav className="header_menu">
              <ul>
                {menus?.map((menu, menuKey) => (
                  <li
                    key={menuKey}
                    className={location.pathname === menu.path ? "active" : ""}
                  >
                    <Link to={menu?.path}>{menu?.name}</Link>
                    {menu.child && (
                      <ul className="header_menu_dropdown">
                        {menu.child.map((childItem, childKey) => (
                          <li key={`${menuKey}-${childKey}`}>
                            <Link to={childItem.path}>{childItem.name}</Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </>
  );
};

export default memo(Header);
