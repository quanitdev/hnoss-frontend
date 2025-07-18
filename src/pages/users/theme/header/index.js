import { memo, useEffect, useState } from "react";
import "./style.scss";
import {
  AiOutlineShoppingCart,
  AiOutlineMenu,
  AiOutlineUser,
  AiOutlineDownCircle,
  AiOutlineUpCircle,
  AiOutlineUserAdd,
  AiOutlineLogin,
} from "react-icons/ai";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { formatter } from "../../../../utils/fomater";
import { ROUTERS } from "../../../../utils/router";
import { MdEmail } from "react-icons/md";
import { useGetCategoriesUS } from "../../../../api/homePage";
import { useDispatch, useSelector } from "react-redux";
import { SESSION_KEYS } from "../../../../utils/constant";
import { ReactSession } from "react-client-session";
import { setCart } from "../../../../redux/commonSlide";
import logo from "../../../../assets/users/images/logo/logo.png";

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [isShowHumberger, setShowHumberger] = useState(false);
  const [isHome, setIsHome] = useState(location.pathname.length <= 1);
  const [isShowCategories, setShowCategories] = useState(isHome);
  const { cart: cartRedux } = useSelector((state) => state.commonSlide);

  const user = ReactSession.get(SESSION_KEYS.USER_INFO); // ✅ Lấy user từ session

  const handleLogout = () => {
    ReactSession.remove(SESSION_KEYS.USER_INFO);
    ReactSession.remove(SESSION_KEYS.TOKEN);
    ReactSession.remove("DISCOUNT_INFO");
    window.location.href = ROUTERS.ACCOUNT.LOGIN;
  };

  const [menus, setMenus] = useState([
    { name: "Trang chủ", path: ROUTERS.USER.HOME },
    { name: "Cửa hàng", path: ROUTERS.USER.PRODUCTS },
    { name: "Sản phẩm", path: "", isShowSubmenu: false, child: [] },
    { name: "Giới thiệu", path: ROUTERS.USER.ABOUT },
    { name: "Liên hệ", path: ROUTERS.USER.CONTACT },
  ]);

  useEffect(() => {
    const isHome = location.pathname.length <= 1;
    setIsHome(isHome);
    setShowCategories(isHome);
  }, [location]);

  const { data: categories } = useGetCategoriesUS();

  useEffect(() => {
    const cart = ReactSession.get(SESSION_KEYS.CART);
    if (cart) {
      dispatch(setCart(cart));
    }
  }, [dispatch]);

  return (
    <>
      {/* Humberger menu overlay */}
      <div
        className={`humberger_menu_overlay ${isShowHumberger ? "active" : ""}`}
        onClick={() => setShowHumberger(false)}
      />
      <div
        className={`humberger_menu_wrapper ${isShowHumberger ? "show" : ""}`}
      >
        <div className="header_logo">
          <Link to={ROUTERS.USER.HOME}>
            <img src={logo} alt="HNOSS Logo" style={{ height: "35px" }} />
          </Link>
        </div>
        <div
          className="humberger_menu_cart"
          style={{ display: "flex", alignItems: "center", gap: "8px" }}
        >
          <ul
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              margin: 0,
            }}
          >
            <li>
              <Link to={ROUTERS.USER.SHOPPING_CART}>
                <AiOutlineShoppingCart /> <span>{cartRedux.totalQuantity}</span>
              </Link>
            </li>
          </ul>
          <div className="header_cart_price" style={{ margin: 0 }}>
            Giỏ hàng: <span>{formatter(cartRedux.totalPrice)}</span>
          </div>
          {user && (
            <div
              className="humberger_user_dropdown"
              style={{ position: "relative", marginLeft: "10px" }}
            >
              <div
                className="user_toggle"
                onClick={() => setShowCategories((prev) => !prev)}
                style={{ cursor: "pointer" }}
              >
                <AiOutlineUser size={22} />
              </div>
              {isShowCategories && (
                <ul className="header_menu_dropdown user_menu_dropdown show_submenu">
                  <li>
                    <strong>Xin chào {user.name}</strong>
                  </li>
                  <li>
                    <Link to={ROUTERS.USER.SETTING} className="dropdown-link">
                      <AiOutlineUser style={{ marginRight: "6px" }} /> Tài khoản
                      của tôi
                    </Link>
                  </li>
                  <li>
                    <Link
                      to={`${ROUTERS.USER.SETTING}?tab=orders`}
                      className="dropdown-link"
                    >
                      <AiOutlineShoppingCart style={{ marginRight: "6px" }} />{" "}
                      Đơn mua
                    </Link>
                  </li>
                  <li onClick={handleLogout} style={{ cursor: "pointer" }}>
                    <AiOutlineLogin /> Đăng xuất
                  </li>
                </ul>
              )}
            </div>
          )}
        </div>
        <div className="humberger_menu_nav">
          <ul>
            {menus.map((menu, menuKey) => (
              <li key={menuKey}>
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
        <div className="humberger_menu_contact">
          <ul>
            {!user && (
              <>
                <li>
                  <Link to={ROUTERS.ACCOUNT.LOGIN} className="auth-link">
                    <AiOutlineLogin /> Đăng nhập
                  </Link>
                </li>
                <li>
                  <Link to={ROUTERS.ACCOUNT.REGISTER} className="auth-link">
                    <AiOutlineUserAdd /> Đăng ký
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>

      {/* Main Header */}
      <div className="container">
        <div className="row">
          <div className="col-lg-3">
            <div className="header_logo">
              <Link to={ROUTERS.USER.HOME}>
                <img src={logo} alt="HNOSS Logo" style={{ height: "35px" }} />
              </Link>
            </div>
          </div>
          <div className="col-lg-6">
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
          <div className="col-lg-3">
            <div className="header_cart">
              <div className="header_cart_price">
                <span>{formatter(cartRedux.totalPrice)}</span>
              </div>
              <ul>
                <li>
                  <Link to={ROUTERS.USER.SHOPPING_CART}>
                    <AiOutlineShoppingCart />{" "}
                    <span>{cartRedux.totalQuantity}</span>
                  </Link>
                </li>
                {/* User Account - cùng hàng với giỏ hàng */}
                <li className="header_user_dropdown">
                  <div className="user_toggle">
                    <AiOutlineUser />
                  </div>
                  <ul className="header_menu_dropdown user_menu_dropdown">
                    {user ? (
                      <>
                        <li>
                          <strong>Xin chào {user.name}</strong>
                        </li>
                        <li>
                          <Link to={ROUTERS.USER.SETTING}>
                            Tài khoản của tôi
                          </Link>
                        </li>
                        <li>
                          <Link to={`${ROUTERS.USER.SETTING}?tab=orders`}>
                            Đơn mua
                          </Link>
                        </li>
                        <li
                          onClick={handleLogout}
                          style={{ cursor: "pointer" }}
                        >
                          <AiOutlineLogin />
                          <Link to={ROUTERS.ACCOUNT.LOGIN}>Đăng xuất</Link>
                        </li>
                      </>
                    ) : (
                      <>
                        <li>
                          <AiOutlineUser />
                          <Link to={ROUTERS.ACCOUNT.LOGIN}>Đăng nhập</Link>
                        </li>
                        <li>
                          <AiOutlineUserAdd />
                          <Link to={ROUTERS.ACCOUNT.REGISTER}>Đăng ký</Link>
                        </li>
                      </>
                    )}
                  </ul>
                </li>
              </ul>
            </div>

            <div className="humberger_open">
              <AiOutlineMenu onClick={() => setShowHumberger(true)} />
            </div>
          </div>
        </div>
      </div>

      {/* Categories & Search */}
      {/* <div className="container">
        <div className="row hero_categories_container">
          <div className="col-lg-9 hero_search_container">
            {isHome && (
              <div className="hero_item">
                <div className="hero_text">
                  <Link to="" className="primary-btn">
                    Mua ngay
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div> */}
    </>
  );
};

export default memo(Header);
