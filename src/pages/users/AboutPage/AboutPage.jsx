import React from "react";
import "./AboutPage.scss";
import Breadcrumb from "../theme/breadcrumb";
import { ROUTERS } from "../../../utils/router";

const AboutPage = () => (
  <>
    <Breadcrumb
      title="Giới thiệu"
      paths={[
        { name: "Trang chủ", path: ROUTERS.USER.HOME },
        { name: "Giới thiệu" },
      ]}
    />
    <div className="about-container">
      <h2>Giới thiệu</h2>
      <hr />
      <h3>HNOSS - Thời trang thiết kế chính hãng, phong cách hiện đại</h3>
      <p>
        Được thành lập vào năm 2010, HNOSS khởi đầu từ một cửa hàng nhỏ tại TP.
        Hồ Chí Minh. Trải qua quá trình phát triển, đến nay HNOSS đã trở thành
        một trong những thương hiệu thời trang thiết kế hàng đầu, được đông đảo
        khách hàng trên toàn quốc tin tưởng và lựa chọn.
      </p>
      <div className="about-image">
        <img
          src="/assets/users/images/about/min-de-team.jpg"
          alt="HNOSS Team"
        />
      </div>
      <h4>Sứ mệnh</h4>
      <p>
        HNOSS mang sứ mệnh tôn vinh vẻ đẹp hiện đại, thanh lịch của người phụ nữ
        Việt Nam thông qua các thiết kế thời trang tinh tế, chất lượng cao và
        giá cả hợp lý. Chúng tôi không ngừng đổi mới, nâng cao chất lượng sản
        phẩm và dịch vụ để mang lại trải nghiệm tốt nhất cho khách hàng.
      </p>
      <h4>Tầm Nhìn</h4>
      <p>
        Đến năm 2025, HNOSS phấn đấu trở thành thương hiệu thời trang thiết kế
        chính hãng hàng đầu tại Việt Nam, mở rộng thị trường ra khu vực Đông Nam
        Á.
      </p>
      <h4>Lĩnh vực kinh doanh</h4>
      <p>
        HNOSS chuyên thiết kế, sản xuất và phân phối các sản phẩm thời trang nữ:
        đầm, váy, áo, quần, phụ kiện... với phong cách hiện đại, trẻ trung, phù
        hợp nhiều đối tượng khách hàng. Sản phẩm HNOSS được phân phối tại hệ
        thống cửa hàng trên toàn quốc và kênh bán hàng online.
      </p>
      <h4>Thông tin liên hệ</h4>
      <p>
        <b>HNOSS</b>
        <br />
        Địa chỉ: 176 Trần Phú, Phường Phước Vĩnh, TP Huế
        <br />
        Hotline: 098764794 (Zalo)
      </p>
    </div>
  </>
);

export default AboutPage;
