import { useEffect, useState } from "react";
import axios from "axios";
import "./contactspage.scss";
const statusOptions = [
  { value: "moi", label: "Mới" },
  { value: "daxem", label: "Đã xem" },
  { value: "daphanhoi", label: "Đã phản hồi" },
  { value: "daxuly", label: "Đã xử lý" },
];

export default function AdminContactsPage() {
  const [contacts, setContacts] = useState([]);
  const [msg, setMsg] = useState("");
  const [replyingId, setReplyingId] = useState(null);
  const [replyContent, setReplyContent] = useState("");

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/contact");
      setContacts(res.data);
    } catch {
      setMsg("Không thể tải danh sách liên hệ");
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      await axios.put(`http://localhost:5000/api/contact/${id}/status`, {
        status,
      });
      setContacts((prev) =>
        prev.map((c) => (c.id === id ? { ...c, status } : c))
      );
      setMsg("Cập nhật trạng thái thành công!");
    } catch {
      setMsg("Lỗi cập nhật trạng thái!");
    }
  };

  const handleReply = async (e, id, email) => {
    e.preventDefault();
    try {
      // Gửi mail qua backend (giả sử đã có API gửi mail)
      await axios.post("http://localhost:5000/api/contact/reply", {
        id,
        email,
        content: replyContent,
      });
      // Cập nhật trạng thái liên hệ
      await axios.put(`http://localhost:5000/api/contact/${id}/status`, {
        status: "daphanhoi",
      });
      setContacts((prev) =>
        prev.map((c) => (c.id === id ? { ...c, status: "daphanhoi" } : c))
      );
      setMsg("Phản hồi thành công!");
      setReplyingId(null);
      setReplyContent("");
    } catch {
      setMsg("Lỗi gửi phản hồi!");
    }
  };

  return (
    <div className="admin-contacts-page">
      <h2>Danh sách liên hệ</h2>
      {msg && <p>{msg}</p>}
      <table
        border="1"
        cellPadding="8"
        style={{ width: "100%", marginTop: 16 }}
      >
        <thead>
          <tr>
            <th>ID</th>
            <th>Họ tên</th>
            <th>Email</th>
            <th>Điện thoại</th>
            <th>Nội dung</th>
            <th>Ngày gửi</th>
            <th>Trạng thái</th>
            <th>Cập nhật</th>
          </tr>
        </thead>
        <tbody>
          {contacts.map((c) => (
            <tr key={c.id}>
              <td>{c.id}</td>
              <td>{c.name}</td>
              <td>{c.email}</td>
              <td>{c.phone}</td>
              <td>{c.message}</td>
              <td>{c.createdAt}</td>
              <td>
                <select
                  value={c.status}
                  onChange={(e) => handleStatusChange(c.id, e.target.value)}
                >
                  {statusOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </td>
              <td>
                {c.status === "moi" && (
                  <button onClick={() => handleStatusChange(c.id, "daxem")}>
                    Đánh dấu đã xem
                  </button>
                )}
                {c.status === "daxem" && (
                  <>
                    <button onClick={() => setReplyingId(c.id)}>
                      Phản hồi
                    </button>
                    {replyingId === c.id && (
                      <form
                        onSubmit={(e) => handleReply(e, c.id, c.email)}
                        style={{ marginTop: 8 }}
                      >
                        <textarea
                          value={replyContent}
                          onChange={(e) => setReplyContent(e.target.value)}
                          placeholder="Nhập nội dung phản hồi..."
                          rows={3}
                          style={{ width: "100%" }}
                          required
                        />
                        <button type="submit" style={{ marginTop: 4 }}>
                          Gửi phản hồi
                        </button>
                      </form>
                    )}
                  </>
                )}
                {c.status === "daphanhoi" && (
                  <button disabled style={{ background: "#aaa" }}>
                    Đã phản hồi
                  </button>
                )}
                {c.status === "daxuly" && (
                  <button disabled style={{ background: "#aaa" }}>
                    Đã xử lý
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
