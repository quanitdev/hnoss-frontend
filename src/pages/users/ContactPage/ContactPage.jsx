import React, { useState } from "react";
import "./ContactPage.scss";
import Breadcrumb from "../theme/breadcrumb";
import { ROUTERS } from "../../../utils/router";
import axios from "axios";

const ContactPage = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [msg, setMsg] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg("");
    try {
      await axios.post("https://hnoss-backend.onrender.com/api/contact", form);
      setMsg("Gửi liên hệ thành công!");
      setForm({ name: "", email: "", phone: "", message: "" });
    } catch (err) {
      setMsg(
        err.response?.data?.message || "Gửi liên hệ thất bại. Vui lòng thử lại."
      );
    }
  };

  return (
    <>
      <Breadcrumb
        title="Liên hệ"
        paths={[
          { name: "Trang chủ", path: ROUTERS.USER.HOME },
          { name: "Liên hệ" },
        ]}
      />
      <div className="contact-container">
        <h2>Liên hệ</h2>
        <hr />
        <div className="contact-content">
          <div className="contact-info">
            <h3>Địa chỉ:</h3>
            <p>176 Trần Phú, Phường Phước Vĩnh, TP Huế</p>
            <div className="map-container">
              <iframe
                title="Google Map"
                src="https://www.google.com/maps?q=176+Trần+Phú,+Phường+Phước+Vĩnh,+TP+Huế&output=embed"
                width="100%"
                height="300"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
              ></iframe>
            </div>
            <h3>Số điện thoại:</h3>
            <p>(+84)98764794 (Zalo)</p>
            <h3>Email:</h3>
            <p>hnoss@gmail.com</p>
          </div>
          <form className="contact-form" onSubmit={handleSubmit}>
            <input
              type="text"
              name="name"
              placeholder="Họ tên của bạn"
              value={form.name}
              onChange={handleChange}
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Địa chỉ email của bạn"
              value={form.email}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="phone"
              placeholder="Số điện thoại của bạn"
              value={form.phone}
              onChange={handleChange}
            />
            <textarea
              name="message"
              placeholder="Nội dung"
              rows={7}
              value={form.message}
              onChange={handleChange}
              required
            />
            <button type="submit">Gửi</button>
            {msg && (
              <p
                style={{ color: msg.includes("thành công") ? "green" : "red" }}
              >
                {msg}
              </p>
            )}
          </form>
        </div>
      </div>
    </>
  );
};

export default ContactPage;
