import { memo } from "react";
import "./style.scss";
import { Link } from "react-router-dom";
import {
  AiFillFacebook,
  AiOutlineInstagram,
  AiFillYoutube,
} from "react-icons/ai";
import { FaTiktok } from "react-icons/fa";
import { ROUTERS } from "../../../utils/router";
import { useGetBannersUS } from "../../../api/homePage";
const Footer = () => {
  const { data: banners = [] } = useGetBannersUS();
  const logoBanner = banners.find((b) => b.name === "logo_main");
  const tb = banners.find((b) => b.name === "thong-bao");
  const footerimg = banners.find((b) => b.name === "footer-img");
  return (
    <footer
      className="footer"
      style={{
        backgroundImage: footerimg ? `url(${footerimg.value})` : "none",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="footer-bg-overlay"></div>
      <div className="footer-container">
        <div className="footer-col company">
          <h4>CÔNG TY TNHH MTV HNOSS</h4>
          <p>
            GPKD số 0317508868 cấp ngày 06/10/2022
            <br />
            tại Sở Kế hoạch và Đầu tư TP Huế
          </p>
          <p>Địa chỉ: 176 Trần Phú, Phường Phước Vĩnh, TP Huế</p>
          <p>Số điện thoại: (+84)98764794 (Zalo)</p>
          <p>Email: hnoss@gmail.com</p>
          <div className="footer-img">
            {" "}
            {tb ? (
              <img
                src={tb.value}
                alt="Đã thông báo Bộ Công Thương"
                className="gov-badge"
              />
            ) : (
              <span>Đã thông báo</span>
            )}{" "}
          </div>
        </div>
        <div className="footer-col quicklinks">
          <h4>Liên Kết Nhanh</h4>
          <ul>
            <li>
              <Link to={ROUTERS.USER.HOME}>Trang Chủ</Link>
            </li>
            <li>
              <Link to={ROUTERS.USER.PRODUCTS}>Lọc Sản Phẩm</Link>
            </li>
            <li>
              <Link to="#">Thương Hiệu</Link>
            </li>
            <li>
              <Link to="#">Loại Trang Phục</Link>
            </li>
            <li>
              <Link to="#">Hàng Thanh Lý</Link>
            </li>
            <li>
              <Link to="#">Phụ Kiện</Link>
            </li>
            <li>
              <Link to="#">Tin Tức</Link>
            </li>
            <li>
              <Link to={ROUTERS.USER.ABOUT}>Giới Thiệu</Link>
            </li>
            <li>
            <Link to={ROUTERS.USER.CONTACT}>Liên Hệ</Link>
            </li>
            <li>
              <Link to={ROUTERS.USER.SHIPPING}>Chính sách giao hàng</Link>
            </li>
            <li>
              <Link to="#">Chính sách bảo mật</Link>
            </li>
            <li>
            <Link to={ROUTERS.USER.PAYMENT}>Chính sách thanh toán</Link>
            </li>
            <li>
              <Link to={ROUTERS.USER.RETURN}>Chính sách kiểm hàng</Link>
            </li>
          </ul>
        </div>
        <div className="footer-col collections">
          <h4>Các Bộ Sưu Tập</h4>
          <ul>
            <li>
              <Link to="#">Màu Sắc</Link>
            </li>
            <li>
              <Link to="#">Mặc Vào Dịp</Link>
            </li>
            <li>
              <Link to="#">Phong Cách</Link>
            </li>
          </ul>
        </div>
        <div className="footer-col social">
          <h4>Theo Dõi Chúng Tôi Tại</h4>
          <div className="social-icons">
            <a href="#" aria-label="Facebook">
              <AiFillFacebook /> Facebook
            </a>
            <a href="#" aria-label="Instagram">
              <AiOutlineInstagram /> Instagram
            </a>
            <a href="#" aria-label="Tiktok">
              <FaTiktok /> Tiktok
            </a>
            <a href="#" aria-label="Youtube">
              <AiFillYoutube /> Youtube
            </a>
          </div>
        </div>
        <div className="footer-col logo">
          {logoBanner ? (
            <img src={logoBanner.value} alt="HNOSS logo" />
          ) : (
            <span>HNOSS</span>
          )}
        </div>
      </div>
      <div className="footer-bottom">
        <p>Copyrights &copy; 2025 by HNOSS. Powered by Quân</p>
      </div>
    </footer>
  );
};

export default memo(Footer);
