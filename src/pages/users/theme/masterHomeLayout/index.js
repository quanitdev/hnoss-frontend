import { memo } from "react";
import Footer from "../../../common/footer";
import { ROUTERS } from "../../../../utils/router";
import { useLocation } from "react-router-dom";
import Header from "../header_home";

const MasterHOMELayout = ({ children, ...props }) => {
  const location = useLocation();
  const isHOMEPage = location.pathname.startsWith(ROUTERS.USER.HOME);
 

  return (
    <>
      <div {...props}>
        {isHOMEPage   && <Header />}
        {children}
        {isHOMEPage && <Footer />}
      </div>
    </>
  );
};

export default memo(MasterHOMELayout);
