import { useEffect, useState } from "react";
import axios from "axios";
import "./styles/_VouchersTab.scss";

export default function VouchersTab() {
  const [vouchers, setVouchers] = useState([]);
  const [search, setSearch] = useState("");
  const [filtered, setFiltered] = useState([]);

  useEffect(() => {
    const fetchVouchers = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/vouchers"); // Sửa theo BE nếu cần
        const now = new Date();
        const validVouchers = res.data.filter(v =>
          new Date(v.expires_at) > now
        );
        setVouchers(validVouchers);
        setFiltered(validVouchers);
      } catch (err) {
        console.error("Lỗi khi lấy voucher:", err);
      }
    };

    fetchVouchers();
  }, []);

  useEffect(() => {
    const result = vouchers.filter(v =>
      v.code.toLowerCase().includes(search.toLowerCase())
    );
    setFiltered(result);
  }, [search, vouchers]);

  return (
    <div className="voucher-tab">
      <h2>🎁 Kho Voucher</h2>
      <input
        type="text"
        placeholder="Tìm mã voucher..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="search-input"
      />
      {filtered.length === 0 ? (
        <p>Không có voucher nào phù hợp.</p>
      ) : (
        <table className="voucher-table">
          <thead>
            <tr>
              <th>Mã</th>
              <th>Loại</th>
              <th>Giá trị</th>
              <th>Đơn tối thiểu</th>
              <th>Đã dùng</th>
              <th>Tối đa</th>
              <th>Hạn dùng</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((v) => (
              <tr key={v.id}>
                <td>{v.code}</td>
                <td>{v.discount_type === "percent" ? "Phần trăm" : "Tiền mặt"}</td>
                <td>
                  {v.discount_type === "percent"
                    ? `${v.discount_value}%`
                    : `${v.discount_value.toLocaleString()}đ`}
                </td>
                <td>{v.min_order?.toLocaleString()}đ</td>
                <td>{v.used_count}</td>
                <td>{v.max_uses}</td>
                <td>{new Date(v.expires_at).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
