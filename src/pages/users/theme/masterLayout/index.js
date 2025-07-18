import { memo } from "react";
import Header from "../header";
import Footer from "../../../common/footer";
import { useLocation } from "react-router-dom";
import { ROUTERS } from "../../../../utils/router";

const MasterLayout = ({ children, ...props }) => {
  const location = useLocation();
  
    const PROFILE = location.pathname.startsWith(ROUTERS.USER.PROFILE);
    const PRODUCTS = location.pathname.startsWith(ROUTERS.USER.PRODUCTS);
    const PRODUCT = location.pathname.startsWith(ROUTERS.USER.PRODUCT);
    const SHOPPING_CART = location.pathname.startsWith(ROUTERS.USER.SHOPPING_CART);
    const ME_ORDERS = location.pathname.startsWith(ROUTERS.USER.ME_ORDERS);
    const SETTING = location.pathname.startsWith(ROUTERS.USER.SETTING);
    const ORDER_SUCCESS = location.pathname.startsWith(ROUTERS.USER.ORDER_SUCCESS);
    const CONTACT = location.pathname.startsWith(ROUTERS.USER.CONTACT);
    const PAYMENT = location.pathname.startsWith(ROUTERS.USER.PAYMENT);
    const ABOUT = location.pathname.startsWith(ROUTERS.USER.ABOUT);
    const SHIPPING = location.pathname.startsWith(ROUTERS.USER.SHIPPING);
  
    const shouldShowHeaderAndFooter =
      PROFILE || PRODUCTS || PRODUCT || SHOPPING_CART || ME_ORDERS || SETTING || ORDER_SUCCESS || CONTACT || PAYMENT || ABOUT || SHIPPING;

  return (
    <>
      <div {...props}>  
        {shouldShowHeaderAndFooter  && <Header />}
        {children}
        {shouldShowHeaderAndFooter && <Footer />}
      </div>
    </>
  );
};

export default memo(MasterLayout);
