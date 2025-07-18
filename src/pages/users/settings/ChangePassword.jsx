import { useState } from "react";
import axios from "axios";
import { SESSION_KEYS } from "../../../utils/constant";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "./styles/_ChangePassword.scss";

export default function ChangePassword() {
  const user = JSON.parse(localStorage.getItem(SESSION_KEYS.USER_INFO));

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [showOldPw, setShowOldPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);

  const handleChange = async (e) => {
    e.preventDefault();
    setMsg("");

    if (newPassword.length < 8) {
      return setMsg("Mật khẩu mới phải có ít nhất 8 ký tự.");
    }

    if (!/^[A-Za-z0-9]{8,}$/.test(newPassword)) {
      return setMsg(
        "Mật khẩu mới chỉ được chứa chữ và số, không có ký tự đặc biệt."
      );
    }

    if (newPassword !== confirmPassword) {
      return setMsg("Mật khẩu xác nhận không khớp.");
    }

    try {
      const res = await axios.post(
        `http://localhost:5000/api/users/change-password`,
        {
          user_id: user.id,
          oldPassword,
          newPassword,
        }
      );
      setMsg(res.data.message || "Đổi mật khẩu thành công");
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setMsg(err.response?.data?.message || "Lỗi đổi mật khẩu!");
    }
  };

  return (
    <form onSubmit={handleChange} className="change-password">
      <h2>Đổi Mật Khẩu</h2>

      <div className="form-row">
        <label>Mật khẩu cũ</label>
        <div className="input-password">
          <input
            type={showOldPw ? "text" : "password"}
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            required
          />
          <span
            className="toggle-password"
            onClick={() => setShowOldPw(!showOldPw)}
          >
            {showOldPw ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>
      </div>

      <div className="form-row">
        <label>Mật khẩu mới</label>
        <div className="input-password">
          <input
            type={showNewPw ? "text" : "password"}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
          <span
            className="toggle-password"
            onClick={() => setShowNewPw(!showNewPw)}
          >
            {showNewPw ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>
      </div>

      <div className="form-row">
        <label>Nhập lại mật khẩu mới</label>
        <div className="input-password">
          <input
            type={showConfirmPw ? "text" : "password"}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <span
            className="toggle-password"
            onClick={() => setShowConfirmPw(!showConfirmPw)}
          >
            {showConfirmPw ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>
      </div>

      <div className="form-row btn-row">
        <button className="save-btn" type="submit">
          Đổi mật khẩu
        </button>
      </div>

      {msg && (
        <p className={`message ${msg.includes("thành công") ? "success" : ""}`}>
          {msg}
        </p>
      )}
    </form>
  );
}
