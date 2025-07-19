import { memo, useEffect, useState } from "react";
import Header from "../../../pages/common/header_login/header";
import Footer from "../../../pages/common/footer";
import "./style.scss";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { ROUTERS } from "../../../utils/router";
import axios from "axios";
import { SESSION_KEYS } from "../../../utils/constant";

const LoginAdPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  useEffect(() => {
    console.log("📥 location.state:", location.state);

    if (location.state?.email && location.state?.password) {
      console.log("✅ Nhận state:", location.state);
      setForm({
        email: location.state.email,
        password: location.state.password,
      });
    } else if (location.state?.email) {
      // Nếu chỉ có email, vẫn set email
      setForm((prev) => ({ ...prev, email: location.state.email }));
    } else {
      const emailFromSession = sessionStorage.getItem("verified_email");
      if (emailFromSession) {
        setForm((prev) => ({ ...prev, email: emailFromSession }));
      }
    }
  }, [location]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await axios.post(
        "https://hnoss-backend.onrender.com/api/auth/login",
        form
      );
      const { token, user, role } = res.data;

      // LƯU SESSION
      localStorage.setItem(SESSION_KEYS.TOKEN, token);
      localStorage.setItem(SESSION_KEYS.USER_INFO, JSON.stringify(user));

      if (role === "admin") {
        navigate(ROUTERS.ADMIN.ORDERS);
      } else {
        navigate(ROUTERS.USER.HOME);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Đăng nhập thất bại.");
    }
  };

  return (
    <>
      <Header />
      <div className="login-page">
        <div className="login-form-container">
          <div className="login-form-box">
            <h2>ĐĂNG NHẬP</h2>
            <p>Vui lòng đăng nhập để tiếp tục</p>

            {error && (
              <p className="error-text" style={{ color: "red" }}>
                {error}
              </p>
            )}

            <form className="login-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="text"
                  name="email"
                  placeholder="Nhập email"
                  value={form.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Mật khẩu</label>
                <input
                  type="password"
                  name="password"
                  placeholder="Nhập mật khẩu"
                  value={form.password}
                  onChange={handleChange}
                  required
                />
              </div>

              <button type="submit" className="submit-button">
                Đăng nhập
              </button>

              <div className="form-footer">
                <span>
                  Bạn chưa có tài khoản?{" "}
                  <Link to={ROUTERS.ACCOUNT.REGISTER}>Đăng ký</Link>
                </span>
              </div>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default memo(LoginAdPage);
