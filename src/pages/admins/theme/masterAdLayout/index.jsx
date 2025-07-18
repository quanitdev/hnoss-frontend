import { memo } from "react";
import Footer from "../../../common/footer";
import { ROUTERS } from "../../../../utils/router";
import { useLocation } from "react-router-dom";
import HeaderAd from "../header";

const MasterAdLayout = ({ children, ...props }) => {
  const location = useLocation();
  const isLoginPage = location.pathname.startsWith(ROUTERS.ACCOUNT.LOGIN);
  const isRegisterPage = location.pathname.startsWith(ROUTERS.ACCOUNT.REGISTER);
  const ORDERS = location.pathname.startsWith(ROUTERS.ADMIN.ORDERS);

  return (
    <>
      <div {...props}>
        {!isLoginPage && !isRegisterPage && !ORDERS && <HeaderAd />}
        {children}
        {!isLoginPage && !isRegisterPage && !ORDERS && <Footer />}
      </div>
    </>
  );
};

export default memo(MasterAdLayout);
