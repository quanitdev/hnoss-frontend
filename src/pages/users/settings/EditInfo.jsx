import { useState } from "react";
import axios from "axios";
import { SESSION_KEYS } from "../../../utils/constant";
import "./styles/_EditInfo.scss";
export default function EditInfo() {
  const user = JSON.parse(localStorage.getItem(SESSION_KEYS.USER_INFO));
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [msg, setMsg] = useState("");

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put(
        `https://hnoss-backend.onrender.com/api/users/${user.id}`,
        { name, email }
      );
      setMsg(res.data.message);
    } catch (err) {
      setMsg("Lỗi cập nhật thông tin!");
    }
  };

  return (
    <form onSubmit={handleUpdate} className="profile-form">
      <h2>Sửa Thông Tin</h2>
      <div className="form-row">
        <label>Tên</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
      <div className="form-row">
        <label>Email</label>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <button className="save-btn" type="submit">
        Lưu
      </button>
      {msg && (
        <p className={msg.includes("thành công") ? "success" : ""}>{msg}</p>
      )}
    </form>
  );
}
