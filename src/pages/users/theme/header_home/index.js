import { memo, useEffect, useState, useRef } from "react";
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
import { useGetCategoriesUS, useGetBannersUS } from "../../../../api/homePage";
import { useDispatch, useSelector } from "react-redux";
import { SESSION_KEYS } from "../../../../utils/constant";
import { setCart } from "../../../../redux/commonSlide";

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [isShowHumberger, setShowHumberger] = useState(false);
  const [isHome, setIsHome] = useState(location.pathname.length <= 1);
  const [isShowCategories, setShowCategories] = useState(isHome);
  const { cart: cartRedux } = useSelector((state) => state.commonSlide);
  const sliderRef = useRef(null);

  const { data: banners = [], isLoading: bannersLoading } = useGetBannersUS();
  const logoBanner = banners.find((b) => b.name === "logo_main");

  // Debug: Log all banners to see what we get from API
  console.log("All banners from API:", banners);

  // Lấy tất cả banner có tên bắt đầu bằng "slider-" hoặc "silder-" và sắp xếp theo thứ tự
  const sliderImages = banners
    .filter((b) => {
      if (!b.name || !b.value) return false;
      // Kiểm tra cả "slider-" và "silder-" (lỗi chính tả có thể có)
      return b.name.startsWith("slider-") || b.name.startsWith("silder-");
    })
    .sort((a, b) => {
      // Sắp xếp theo số thứ tự trong tên (slider-1, slider-2, ...)
      const aName = a.name.replace("silder-", "slider-"); // Fix typo
      const bName = b.name.replace("silder-", "slider-"); // Fix typo
      const aNum = parseInt(aName.split("slider-")[1]);
      const bNum = parseInt(bName.split("slider-")[1]);
      return aNum - bNum;
    })
    .map((b) => b.value)
    .filter(Boolean);

  // Debug: Log filtered slider images
  console.log("Filtered slider images:", sliderImages);

  // Fallback images nếu không có slider từ DB
  const fallbackImages = [
    "../../../../assets/users/images/silders/slide-1.png",
    "../../../../assets/users/images/silders/slide-2.png",
    "../../../../assets/users/images/silders/slide-3.png",
    "../../../../assets/users/images/banner/banner1.jpg",
    "../../../../assets/users/images/banner/banner2.jpg",
  ];

  // Sử dụng slider từ DB nếu có, không thì dùng fallback
  const finalSliderImages =
    sliderImages.length > 0 ? sliderImages : fallbackImages;

  // Debug: Log final images being used
  console.log("Final slider images:", finalSliderImages);

  // Set CSS custom properties for animation
  useEffect(() => {
    if (sliderRef.current && finalSliderImages.length > 0) {
      const element = sliderRef.current;

      // Set CSS custom properties for each slide
      finalSliderImages.forEach((image, index) => {
        // Đảm bảo URL ảnh được format đúng
        let imageUrl = image;

        // Nếu URL không bắt đầu bằng http/https, thêm base URL
        if (image && !image.startsWith("http") && !image.startsWith("data:")) {
          // Nếu là URL tương đối, thêm base URL của API
          const baseURL =
            process.env.REACT_APP_API_URI || "http://localhost:5000";
          imageUrl = `${baseURL}/${image}`;
        } else if (image && image.includes("cloudinary")) {
          // Nếu là Cloudinary URL, đảm bảo format đúng
          imageUrl = image.replace(/^\/+/, ""); // Loại bỏ dấu / ở đầu nếu có
        }

        console.log(`Setting slide-${index + 1} with URL:`, imageUrl);
        element.style.setProperty(`--slide-${index + 1}`, `url('${imageUrl}')`);
      });

      // If we have fewer than 5 images, repeat them to fill the animation
      // If we have exactly 5 images, we don't need to repeat
      if (finalSliderImages.length < 5) {
        for (let i = finalSliderImages.length; i < 5; i++) {
          const repeatIndex = i % finalSliderImages.length;
          let imageUrl = finalSliderImages[repeatIndex];

          // Đảm bảo URL ảnh được format đúng
          if (
            imageUrl &&
            !imageUrl.startsWith("http") &&
            !imageUrl.startsWith("data:")
          ) {
            const baseURL =
              process.env.REACT_APP_API_URI || "http://localhost:5000";
            imageUrl = `${baseURL}/${imageUrl}`;
          } else if (imageUrl && imageUrl.includes("cloudinary")) {
            // Nếu là Cloudinary URL, đảm bảo format đúng
            imageUrl = imageUrl.replace(/^\/+/, ""); // Loại bỏ dấu / ở đầu nếu có
          }

          console.log(`Setting slide-${i + 1} (repeat) with URL:`, imageUrl);
          element.style.setProperty(`--slide-${i + 1}`, `url('${imageUrl}')`);
        }
      }
    }
  }, [finalSliderImages]);

  const user = JSON.parse(localStorage.getItem(SESSION_KEYS.USER_INFO));

  const handleLogout = () => {
    localStorage.removeItem(SESSION_KEYS.USER_INFO);
    localStorage.removeItem(SESSION_KEYS.TOKEN);
    localStorage.removeItem("DISCOUNT_INFO");
    navigate(ROUTERS.ACCOUNT.LOGIN);
  };

  const [menus, setMenus] = useState([
    { name: "Trang chủ", path: ROUTERS.USER.HOME },
    { name: "Cửa hàng", path: ROUTERS.USER.PRODUCTS },
    { name: "Sản phẩm", path: "", isShowSubmenu: false, child: [] },
    { name: "Giới thiệu", path: ROUTERS.USER.ABOUT },
    { name: "Liên hệ", path: ROUTERS.USER.CONTACT },
  ]);

  const { data: categories } = useGetCategoriesUS();

  useEffect(() => {
    const isHome = location.pathname.length <= 1;
    setIsHome(isHome);
    setShowCategories(isHome);
  }, [location]);

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
    const cart = JSON.parse(localStorage.getItem(SESSION_KEYS.CART));
    if (cart) {
      dispatch(setCart(cart));
    }
  }, [dispatch]);

  return (
    <>
      {/* Humberger menu */}
      <div
        className={`humberger_menu_overlay ${isShowHumberger ? "active" : ""}`}
        onClick={() => setShowHumberger(false)}
      />
      <div
        className={`humberger_menu_wrapper ${isShowHumberger ? "show" : ""}`}
      >
        <div className="header_logo">
          <Link to={ROUTERS.USER.HOME}>
            {logoBanner ? (
              <img
                src={logoBanner.value}
                alt="HNOSS Logo"
                style={{ height: "35px" }}
              />
            ) : (
              <span>HNOSS</span> // fallback nếu chưa load
            )}
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
      <div className="header-wrapper">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-3">
              <div className="header_logo">
                <Link to={ROUTERS.USER.HOME}>
                  {logoBanner ? (
                    <img
                      src={logoBanner.value}
                      alt="HNOSS Logo"
                      style={{ height: "35px" }}
                    />
                  ) : (
                    <span>HNOSS</span>
                  )}
                </Link>
              </div>
            </div>
            <div className="col-lg-6">
              <nav className="header_menu">
                <ul>
                  {menus?.map((menu, menuKey) => (
                    <li
                      key={menuKey}
                      className={
                        location.pathname === menu.path ? "active" : ""
                      }
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
                          <li onClick={handleLogout}>
                            <AiOutlineLogin /> Đăng xuất
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
      </div>

      {/* Animated Slider */}
      {bannersLoading ? (
        <div className="slider-fullwidth">
          <div className="slider-inner">
            <div className="slider-loading">
              <div className="loading-spinner"></div>
              <p>Đang tải slider...</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="slider-fullwidth">
          <div className="slider-inner">
            <div className="slider-animated" ref={sliderRef}></div>
          </div>
        </div>
      )}
    </>
  );
};

export default memo(Header);
