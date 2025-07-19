import { useEffect, useState } from "react";
import axios from "axios";
import "./userpage.scss";

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [tab, setTab] = useState("list");
  const [msg, setMsg] = useState("");
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    password: "",
    role: "user"
  });

  // Lấy danh sách user
  useEffect(() => {
    if (tab === "list") fetchUsers();
    // eslint-disable-next-line
  }, [tab]);

  const fetchUsers = () => {
    axios.get("https://hnoss-backend.onrender.com/api/users")
      .then(res => setUsers(res.data))
      .catch(() => setMsg("Không thể tải danh sách người dùng"));
  };

  // Thêm user mới
  const handleAddUser = (e) => {
    e.preventDefault();
    setMsg("");
    axios.post("https://hnoss-backend.onrender.com/api/users", newUser)
      .then(() => {
        setMsg("Thêm người dùng thành công!");
        setNewUser({ name: "", email: "", password: "", role: "user" });
        fetchUsers();
      })
      .catch(err => setMsg(err.response?.data?.message || "Lỗi thêm người dùng"));
  };

  // Xóa user
  const handleDelete = (id) => {
    if (!window.confirm("Bạn chắc chắn muốn xóa người dùng này?")) return;
    axios.delete(`https://hnoss-backend.onrender.com/api/users/${id}`)
      .then(() => {
        setMsg("Đã xóa người dùng!");
        fetchUsers();
      })
      .catch(() => setMsg("Lỗi xóa người dùng"));
  };

  // Cập nhật quyền
  const handleRoleChange = (id, role) => {
    axios.put(`https://hnoss-backend.onrender.com/api/users/${id}/role`, { role })
      .then(() => {
        setMsg("Cập nhật quyền thành công!");
        fetchUsers();
      })
      .catch(() => setMsg("Lỗi cập nhật quyền"));
  };

  return (
    <div className="admin-users-page">
      <div className="admin-tabs">
        <button className={tab === "list" ? "active" : ""} onClick={() => setTab("list")}>Danh sách tài khoản</button>
        <button className={tab === "add" ? "active" : ""} onClick={() => setTab("add")}>Thêm tài khoản</button>
      </div>
      <div className="admin-content">
        {tab === "list" && (
          <>
            <h2>Danh sách tài khoản</h2>
            {msg && <p className="msg">{msg}</p>}
            <table className="user-table">
              <thead>
                <tr>
                  <th>Tên đăng nhập</th>
                  <th>Email</th>
                  <th>Quyền</th>
                  <th>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u.id}>
                    <td>{u.name}</td>
                    <td>{u.email}</td>
                    <td>
                      <select value={u.role} onChange={e => handleRoleChange(u.id, e.target.value)}>
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                    <td>
                      <button onClick={() => handleDelete(u.id)}>Xóa</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}
        {tab === "add" && (
          <>
            <h2>Thêm tài khoản mới</h2>
            {msg && <p className="msg">{msg}</p>}
            <form className="add-user-form" onSubmit={handleAddUser}>
              <input placeholder="Tên đăng nhập" value={newUser.name} onChange={e => setNewUser({ ...newUser, name: e.target.value })} required />
              <input placeholder="Email" value={newUser.email} onChange={e => setNewUser({ ...newUser, email: e.target.value })} required />
              <input placeholder="Mật khẩu" type="password" value={newUser.password} onChange={e => setNewUser({ ...newUser, password: e.target.value })} required />
              <select value={newUser.role} onChange={e => setNewUser({ ...newUser, role: e.target.value })}>
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
              <button type="submit">Thêm</button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}