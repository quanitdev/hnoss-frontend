import { useState } from "react";
import { SESSION_KEYS } from "../../../utils/constant";
import "./style.scss";
import axios from "axios";

const UserSettingsPage = () => {
  const user = JSON.parse(localStorage.getItem(SESSION_KEYS.USER_INFO));

  // State cho tab
  const [tab, setTab] = useState("info"); // "info", "password", "orders"

  // State cho sửa thông tin

  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [infoMsg, setInfoMsg] = useState("");

  // State cho đổi mật khẩu
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [pwMsg, setPwMsg] = useState("");

  // Sửa thông tin
  const handleUpdateInfo = (e) => {
    e.preventDefault();
    setInfoMsg("");
    // Gửi API cập nhật thông tin ở đây
    // Ví dụ:
    axios
      .put(`/api/users/${user.id}`, { name, email })
      .then(() => setInfoMsg("Cập nhật thành công!"))
      .catch(() => setInfoMsg("Lỗi cập nhật!"));
  };

  // Đổi mật khẩu
  const handleChangePassword = (e) => {
    e.preventDefault();
    setPwMsg("");
    if (newPassword !== confirmPassword) {
      setPwMsg("Mật khẩu mới không khớp");
      return;
    }
    //  Gửi API đổi mật khẩu ở đây
    axios
      .post("/api/users/change-password", {
        user_id: user.id,
        oldPassword,
        newPassword,
      })
      .then((res) => setPwMsg(res.data.message))
      .catch((err) => setPwMsg("Lỗi đổi mật khẩu!"));
  };

  return (
    <div className="user-settings-layout">
      <div className="user-settings-tabs">
        <div className="tab-menu">
          <button
            className={tab === "info" ? "active" : ""}
            onClick={() => setTab("info")}
          >
            <span className="icon">
              <i className="fa fa-user" />
            </span>
            Sửa Thông Tin
          </button>
          <button
            className={tab === "password" ? "active" : ""}
            onClick={() => setTab("password")}
          >
            <span className="icon">
              <i className="fa fa-lock" />
            </span>
            Đổi Mật Khẩu
          </button>
          <button
            className={tab === "orders" ? "active" : ""}
            onClick={() => setTab("orders")}
          >
            <span className="icon">
              <i className="fa fa-file-text-o" />
            </span>
            Đơn Mua
          </button>
          <button
            className={tab === "voucher" ? "active" : ""}
            onClick={() => setTab("voucher")}
          >
            <span className="icon">
              <i className="fa fa-ticket" />
            </span>
            Kho Voucher
          </button>
        </div>
      </div>
      <div className="user-settings-content">
        {tab === "info" && (
          <div className="profile-edit">
            <h2>Sửa Thông Tin</h2>
            <form className="profile-form" onSubmit={handleUpdateInfo}>
              <div className="form-row">
                <label>Tên đăng nhập</label>
                <span>{user?.username || ""}</span>
              </div>
              <div className="form-row">
                <label>Tên</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Nhập tên"
                  required
                />
              </div>
              <div className="form-row">
                <label>Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Nhập email"
                  required
                />
              </div>
              <div className="form-row">
                <button type="submit" className="save-btn">
                  Lưu
                </button>
              </div>
              {infoMsg && (
                <p
                  style={{
                    color: infoMsg.includes("thành công") ? "green" : "crimson",
                  }}
                >
                  {infoMsg}
                </p>
              )}
            </form>
          </div>
        )}

        {tab === "password" && (
          <div className="profile-edit">
            <h2>Đổi Mật Khẩu</h2>
            <form className="profile-form" onSubmit={handleChangePassword}>
              <div className="form-row">
                <label>Mật khẩu cũ</label>
                <input
                  type="password"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  required
                />
              </div>
              <div className="form-row">
                <label>Mật khẩu mới</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
              </div>
              <div className="form-row">
                <label>Nhập lại mật khẩu mới</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
              <div className="form-row">
                <button type="submit" className="save-btn">
                  Đổi mật khẩu
                </button>
              </div>
              {pwMsg && (
                <p
                  style={{
                    color: pwMsg.includes("thành công") ? "green" : "crimson",
                  }}
                >
                  {pwMsg}
                </p>
              )}
            </form>
          </div>
        )}

        {tab === "orders" && (
          <div>
            <h2>Đơn Mua</h2>
            {/* Danh sách đơn hàng ở đây */}
          </div>
        )}
        {tab === "voucher" && (
          <div className="profile-edit">
            <h2>Kho Voucher</h2>
            <p>Bạn chưa có voucher nào.</p>
            {/* Nếu có danh sách voucher, render ở đây */}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserSettingsPage;
