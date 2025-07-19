import React, { useEffect, useState } from "react";
import axios from "axios";

const END_POINT = "https://hnoss-backend.onrender.com/api/sale";

export default function AdminVoucherPage() {
  const [vouchers, setVouchers] = useState([]);
  const [form, setForm] = useState({
    code: "",
    discount_value: "",
    discount_type: "percent", // hoặc "amount"
    max_uses: "",
    min_order: "",
    expires_at: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [msg, setMsg] = useState("");

  // Lấy danh sách voucher
  const fetchVouchers = async () => {
    try {
      const res = await axios.get(END_POINT);
      setVouchers(res.data);
    } catch {
      setMsg("Không thể tải danh sách voucher.");
    }
  };

  useEffect(() => {
    fetchVouchers();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg("");
    try {
      // Xử lý expires_at thành 'YYYY-MM-DD 23:59:59'
      let submitData = { ...form };
      if (submitData.expires_at && submitData.expires_at.length === 10) {
        submitData.expires_at = submitData.expires_at + " 23:59:59";
      }
      if (editingId) {
        await axios.put(`${END_POINT}/${editingId}`, submitData);
        setMsg("Cập nhật voucher thành công!");
      } else {
        await axios.post(END_POINT, submitData);
        setMsg("Thêm voucher thành công!");
      }
      setForm({
        code: "",
        discount_value: "",
        discount_type: "percent",
        max_uses: "",
        min_order: "",
        expires_at: "",
      });
      setEditingId(null);
      fetchVouchers();
    } catch (err) {
      setMsg(
        err.response?.data?.error ||
        err.response?.data?.message ||
        "Lỗi khi thêm/cập nhật voucher."
      );
    }
  };

  const handleEdit = (v) => {
    setForm({
      code: v.code,
      discount_value: v.discount_value,
      discount_type: v.discount_type,
      max_uses: v.max_uses,
      min_order: v.min_order,
      expires_at: v.expires_at?.slice(0, 10) || "",
    });
    setEditingId(v.id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Xóa voucher này?")) return;
    try {
      await axios.delete(`${END_POINT}/${id}`);
      setMsg("Đã xóa voucher!");
      fetchVouchers();
    } catch {
      setMsg("Lỗi khi xóa voucher.");
    }
  };

  return (
    <div
      className="admin-voucher-page"
      style={{ maxWidth: 800, margin: "0 auto" }}
    >
      <h2>🎟️ Quản lý Voucher</h2>
      {msg && (
        <div
          style={{ color: msg.includes("thành công") ? "green" : "crimson" }}
        >
          {msg}
        </div>
      )}
      <form onSubmit={handleSubmit} style={{ marginBottom: 24 }}>
        <input
          name="code"
          value={form.code}
          onChange={handleChange}
          placeholder="Mã voucher"
          required
        />
        <input
          name="discount_value"
          value={form.discount_value}
          onChange={handleChange}
          placeholder="Giá trị giảm"
          type="number"
          required
        />
        <select
          name="discount_type"
          value={form.discount_type}
          onChange={handleChange}
        >
          <option value="percent">Phần trăm (%)</option>
          <option value="amount">Số tiền (VNĐ)</option>
        </select>
        <input
          name="max_uses"
          value={form.max_uses}
          onChange={handleChange}
          placeholder="Số lần dùng tối đa"
          type="number"
          required
        />
        <input
          name="min_order"
          value={form.min_order}
          onChange={handleChange}
          placeholder="Đơn tối thiểu"
          type="number"
          required
        />
        <input
          name="expires_at"
          value={form.expires_at}
          onChange={handleChange}
          placeholder="Ngày hết hạn"
          type="date"
          required
        />
        <button type="submit" className="submit-btn">
          {editingId ? "Cập nhật" : "Thêm voucher"}
        </button>
        {editingId && (
          <button
            type="button"
            className="cancel"
            onClick={() => {
              setEditingId(null);
              setForm({
                code: "",
                discount_value: "",
                discount_type: "percent",
                max_uses: "",
                min_order: "",
                expires_at: "",
              });
            }}
          >
            Hủy
          </button>
        )}
      </form>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Mã</th>
            <th>Giá trị</th>
            <th>Kiểu</th>
            <th>Tối đa</th>
            <th>Đã dùng</th>
            <th>Tối thiểu</th>
            <th>Hết hạn</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {vouchers.map((v) => (
            <tr key={v.id}>
              <td>{v.id}</td>
              <td>{v.code}</td>
              <td>
                {v.discount_type === "percent"
                  ? `${v.discount_value}%`
                  : `${v.discount_value.toLocaleString()}đ`}
              </td>
              <td>{v.discount_type}</td>
              <td>{v.max_uses}</td>
              <td>{v.used_count}</td>
              <td>{v.min_order?.toLocaleString()}</td>
              <td>{v.expires_at?.slice(0, 10)}</td>
              <td>
                <button
                  className="edit"
                  title="Sửa"
                  onClick={() => handleEdit(v)}
                >
                  ✏️
                </button>
                <button
                  className="delete"
                  title="Xóa"
                  onClick={() => handleDelete(v.id)}
                >
                  🗑️
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
