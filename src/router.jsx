import { ADMIN_PATH, ACCOUNT_PATH, ROUTERS } from "./utils/router";
import { Route, Routes, useLocation } from "react-router-dom";

// Layouts
import MasterLayout from "./pages/users/theme/masterLayout";
import MasterHOMELayout from "./pages/users/theme/masterHomeLayout";
import MasterAdLayout from "./pages/admins/theme/masterAdLayout";

// User Pages
import HomePage from "./pages/users/homePage";
import ProductsPage from "./pages/users/productsPage";
import ProductDetailPage from "./pages/users/productDetailPage";
import ProfilePage from "./pages/users/profilePage";
import ShoppingCartPage from "./pages/users/shoppingCartPage";
import CheckoutPage from "./pages/users/checkoutPage";
import ReturnPolicyPage from "./pages/users/ReturnPolicyPage/ReturnPolicyPage";
import OrderSuccessPage from "./pages/users/checkoutPage/OrderSuccessPage";

// Public Pages
import VerifyEmailPage from "./pages/public/VerifyEmailPage";
import RegisterPage from "./pages/admins/registerPage";
import LoginAdPage from "./pages/admins/loginPage";

// Admin Pages
import AdminDashboardPage from "./pages/admins/AdminDashboardPage";

// Common
import NotFoundPage from "./pages/NotFoundPage/NotFoundPage";
import UserSettingsPage from "./pages/users/settings/UserSettingsPage";
import OrdersTab from "./pages/users/settings/OrdersTab";
import ScrollToTop from "./pages/users/theme/ScrollToTop/ScrollToTop";
import ContactPage from "./pages/users/ContactPage/ContactPage";
import AboutPage from "./pages/users/AboutPage/AboutPage";
import PaymentPolicyPage from "./pages/users/PaymentPolicyPage/PaymentPolicyPage";
import ShippingPolicyPage from "./pages/users/Shipping/Shipping";

// ==================== ROUTERS ====================
const renderUserRouter = () => {
  const userRouters = [
    { path: ROUTERS.USER.PROFILE, component: <ProfilePage /> },
    { path: ROUTERS.USER.PRODUCTS, component: <ProductsPage /> },
    { path: ROUTERS.USER.PRODUCT, component: <ProductDetailPage /> },
    { path: ROUTERS.USER.SHOPPING_CART, component: <ShoppingCartPage /> },
    { path: ROUTERS.USER.CHECKOUT, component: <CheckoutPage /> },
    { path: ROUTERS.USER.ME_ORDERS, component: <OrdersTab /> },
    { path: ROUTERS.USER.VERIFY_EMAIL, component: <VerifyEmailPage /> },
    { path: ROUTERS.USER.RETURN, component: <ReturnPolicyPage /> },
    { path: ROUTERS.USER.SETTING, component: <UserSettingsPage /> },
    { path: ROUTERS.USER.ORDER_SUCCESS, component: <OrderSuccessPage /> },
    { path: ROUTERS.USER.CONTACT, component: <ContactPage /> },
    { path: ROUTERS.USER.ABOUT, component: <AboutPage /> },
    { path: ROUTERS.USER.PAYMENT, component: <PaymentPolicyPage /> },
    { path: ROUTERS.USER.SHIPPING, component: <ShippingPolicyPage /> },
  ];

  return (
    <MasterLayout>
      <ScrollToTop />
      <Routes>
        {userRouters.map((item, index) => (
          <Route key={index} path={item.path} element={item.component} />
        ))}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </MasterLayout>
  );
};

const renderHomeRouter = () => {
  return (
    <MasterHOMELayout>
      <Routes>
        <Route path={ROUTERS.USER.HOME} element={<HomePage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </MasterHOMELayout>
  );
};

const renderAdminRouter = () => {
  const adminRouters = [
    { path: ROUTERS.ADMIN.ORDERS, component: <AdminDashboardPage /> },
    { path: ROUTERS.ACCOUNT.LOGIN, component: <LoginAdPage /> },
    { path: ROUTERS.ACCOUNT.REGISTER, component: <RegisterPage /> },
  ];

  return (
    <MasterAdLayout>
      <Routes>
        {adminRouters.map((item, index) => (
          <Route key={index} path={item.path} element={item.component} />
        ))}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </MasterAdLayout>
  );
};

// ==================== MAIN ROUTER ====================

const RouterCustom = () => {
  const location = useLocation();
  const pathname = location.pathname;

  if (pathname.startsWith(ADMIN_PATH) || pathname.startsWith(ACCOUNT_PATH)) {
    return renderAdminRouter();
  }

  if (pathname === ROUTERS.USER.HOME) {
    return renderHomeRouter();
  }

  return renderUserRouter();
};

export default RouterCustom;
