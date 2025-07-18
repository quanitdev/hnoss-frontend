import React from "react";
import "./style.scss";
import Header from "../theme/header";
import Footer from "../../common/footer";
import { ROUTERS } from "../../../utils/router";
import Breadcrumb from "../theme/breadcrumb";

const KiemHangPolicyPage = () => {
  return (
    <>
      <Header />
      <Breadcrumb
        title="Chính sách kiểm hàng"
        paths={[
          { name: "Trang chủ", path: ROUTERS.USER.HOME },
          { name: "Chính sách kiểm hàng" },
        ]}
      />
      <main className="policy-page">
        <div className="policy-banner-img">
          <img
            src={require("../../../assets/users/images/banner/chinhsach.png")}
            alt="Chính sách kiểm hàng"
            style={{
              width: "100%",
              maxWidth: 775,
              display: "block",
              margin: "40px auto",
            }}
          />
        </div>
      </main>
      <Footer />
    </>
  );
};

export default React.memo(KiemHangPolicyPage);
