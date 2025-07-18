import { memo, useState } from "react";
import Header from "../../../pages/common/header_login/header";
import Footer from "../../../pages/common/footer";
import "./style.scss";
import { useNavigate } from "react-router-dom";
import { ROUTERS } from "../../../utils/router";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import axios from "axios";

const RegisterPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (form.password.length < 8) {
      return setError("Mật khẩu phải có ít nhất 8 ký tự.");
    }

    // ✅ Cho phép chữ và số, không ký tự đặc biệt
    if (!/^[A-Za-z0-9]{8,}$/.test(form.password)) {
      return setError(
        "Mật khẩu chỉ được chứa chữ cái và số, không chứa ký tự đặc biệt."
      );
    }

    if (form.password !== form.confirmPassword) {
      return setError("Mật khẩu xác nhận không khớp.");
    }

    try {
      setIsLoading(true);
      await axios.post("http://localhost:5000/api/auth/register", {
        name: form.name,
        email: form.email,
        password: form.password,
      });

      setSuccess("Đăng ký thành công! Đang chuyển hướng...");
      setTimeout(() => {
        navigate(ROUTERS.ACCOUNT.LOGIN, {
          state: {
            email: form.email,
            password: form.password,
          },
        });
      }, 2000);
    } catch (err) {
      setError(
        err.response?.data?.message || "Lỗi hệ thống. Vui lòng thử lại."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Header />
      <div className="register-page">
        <div className="register-form-container">
          <div className="register-form-box">
            <h2>ĐĂNG KÝ</h2>
            <p>Vui lòng nhập thông tin để tạo tài khoản</p>

            {error && <p className="error-text">{error}</p>}
            {success && <p className="success-text">{success}</p>}

            <form className="register-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Họ và tên</label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Nhập họ tên"
                  required
                />
              </div>

              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="Nhập email"
                  required
                />
              </div>

              <div className="form-group">
                <label>Mật khẩu</label>
                <div className="input-password">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={form.password}
                    onChange={(e) => {
                      handleChange(e);
                      const value = e.target.value;
                      const input = e.target;
                      const text = document.getElementById("password-strength");

                      input.style.borderColor =
                        value.length >= 8 ? "rgb(0, 246, 0)" : "red";
                      if (text) {
                        text.innerText =
                          value.length >= 8
                            ? "Mật khẩu: Mạnh"
                            : "Mật khẩu: Yếu";
                        text.style.color = value.length >= 8 ? "green" : "red";
                      }
                    }}
                    placeholder="Chứa chữ & số, tối thiểu 8 ký tự"
                    pattern="^[A-Za-z0-9]{8,}$"
                    required
                  />
                  <span
                    className="toggle-password"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </span>
                </div>
                <p
                  id="password-strength"
                  className="password-strength-text"
                ></p>
              </div>

              <div className="form-group">
                <label>Xác nhận mật khẩu</label>
                <div className="input-password">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={form.confirmPassword}
                    onChange={handleChange}
                    placeholder="Nhập lại mật khẩu"
                    required
                  />
                  <span
                    className="toggle-password"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                  </span>
                </div>
              </div>

              <button
                type="submit"
                className="submit-button"
                disabled={isLoading}
              >
                {isLoading ? "Đang xử lý..." : "Đăng ký"}
              </button>

              <div className="form-footer">
                <span>
                  Đã có tài khoản? <a href={ROUTERS.ACCOUNT.LOGIN}>Đăng nhập</a>
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

export default memo(RegisterPage);
