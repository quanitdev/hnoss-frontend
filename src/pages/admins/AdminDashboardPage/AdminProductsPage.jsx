import React, { useEffect, useState, useRef } from "react";
import "./productpage.scss";
import axios from "axios";
import { useGetCategoriesUS } from "../../../api/homePage/queries";

const END_POINT = "http://localhost:5000/api/products";

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({
    id: "",
    name: "",
    price: "",
    description: "",
    sort_description: "",
    img: "",
    inventory: "",
    category_id: "", // thêm
    product_code: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const textareaRef = useRef(null);
  const formRef = useRef(null);

  const { data: categories = [] } = useGetCategoriesUS();

  // Fetch sản phẩm
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await axios.get(END_POINT);
      setProducts(res.data);
    } catch (err) {
      setError("❌ Không thể tải danh sách sản phẩm.");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append("image", file);
      setLoading(true);
      setError("");
      try {
        const res = await axios.post(
          "http://localhost:5000/api/products/upload-image",
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
        setForm((prev) => ({ ...prev, img: res.data.url }));
      } catch (err) {
        setError("❌ Upload ảnh thất bại");
      }
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const submitData = { ...form };
      if (!editingId) delete submitData.product_code;
      if (editingId) {
        await axios.put(`${END_POINT}/${editingId}`, submitData);
        setSuccess("✅ Cập nhật sản phẩm thành công.");
      } else {
        await axios.post(END_POINT, submitData);
        setSuccess("✅ Thêm sản phẩm thành công.");
      }
      setForm({
        id: "",
        name: "",
        price: "",
        description: "",
        sort_description: "",
        img: "",
        inventory: "",
        category_id: "",
      });
      setEditingId(null);
      fetchProducts();
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          err.response?.data?.error ||
          err.response?.data?.message ||
          (editingId
            ? "❌ Không thể cập nhật sản phẩm."
            : "❌ Không thể thêm sản phẩm.")
      );
    }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xoá sản phẩm này?")) return;
    setError("");
    setSuccess("");
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${END_POINT}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuccess("✅ Xoá sản phẩm thành công.");
      fetchProducts();
    } catch (err) {
      setError(
        err.response?.data?.error ||
          err.response?.data?.message ||
          "❌ Xoá thất bại."
      );
    }
  };

  const handleEdit = (product) => {
    setForm({
      id: product.id || "",
      name: product.name || "",
      price: product.price || "",
      description: product.description || "",
      sort_description: product.sort_description || "",
      img: product.img || "",
      inventory: product.inventory || "",
      category_id: product.category_id || "",
      product_code: product.product_code || "",
    });
    setEditingId(product.id);
    // Cuộn lên form
    setTimeout(() => {
      if (formRef.current) {
        formRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 100);
  };

  const handleDescriptionChange = (e) => {
    setForm({ ...form, description: e.target.value });
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height =
        textareaRef.current.scrollHeight + "px";
    }
  };

  return (
    <div className="admin-products-page">
      <h2>🛒 Quản lý sản phẩm</h2>
      {success && (
        <div className="success" style={{ color: "green", marginBottom: 8 }}>
          {success}
        </div>
      )}
      {error && (
        <div className="error" style={{ color: "crimson", marginBottom: 8 }}>
          {error}
        </div>
      )}
      <form className="product-form" onSubmit={handleSubmit} ref={formRef}>
        {/* Hiển thị ID khi sửa */}
        {/* {editingId && (
          <input
            name="id"
            value={form.id}
            onChange={handleChange}
            placeholder="Mã sản phẩm"
            required
          />
        )} */}
        <input
          name="id"
          value={form.id}
          onChange={handleChange}
          placeholder="Mã sản phẩm"
          required
        />
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Tên sản phẩm"
          required
        />
        <input
          name="price"
          value={form.price}
          onChange={handleChange}
          placeholder="Giá"
          type="number"
          required
        />
        <input
          name="inventory"
          value={form.inventory}
          onChange={handleChange}
          placeholder="Số lượng"
          type="number"
          required
        />
        <input
          name="sort_description"
          value={form.sort_description}
          onChange={handleChange}
          placeholder="Mô tả ngắn"
        />
        <select
          name="category_id"
          value={form.category_id}
          onChange={handleChange}
          required
        >
          <option value="">-- Chọn danh mục --</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
        {form.img && (
          <div style={{ margin: "8px 0" }}>
            <img src={form.img} alt="Ảnh sản phẩm" width={80} />
          </div>
        )}
        <input type="file" accept="image/*" onChange={handleImageUpload} />
        <textarea
          name="description"
          value={form.description}
          onChange={handleDescriptionChange}
          placeholder="Mô tả"
          ref={textareaRef}
        />
        <button type="submit" disabled={loading}>
          {loading ? "Đang xử lý..." : editingId ? "Cập nhật" : "Thêm sản phẩm"}
        </button>
      </form>

      <table className="product-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Tên</th>
            <th>Giá</th>
            <th>Ảnh</th>
            <th>Danh mục</th>
            <th>Số lượng</th>
            <th>Mô tả</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {products.length > 0 ? (
            products.map((p) => (
              <tr key={p.id}>
                <td>{p.id}</td>
                <td>{p.name}</td>
                <td>{p.price}</td>
                <td>{p.img && <img src={p.img} alt={p.name} width={40} />}</td>
                <td>{p.category_name || p.category_id}</td>
                <td>{p.inventory}</td>
                <td>{p.description}</td>
                <td>
                  <button onClick={() => handleEdit(p)}>Sửa</button>
                  <button onClick={() => handleDelete(p.id)}>Xoá</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="8">Không có sản phẩm</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
