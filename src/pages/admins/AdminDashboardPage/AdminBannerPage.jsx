import React, { useEffect, useState } from "react";
import axios from "axios";
import "./bannerpage.scss";

const AdminBannerPage = () => {
  const [banners, setBanners] = useState([]);
  const [form, setForm] = useState({ name: "", description: "" });
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [editId, setEditId] = useState(null);
  const [editBanner, setEditBanner] = useState(null);

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:5000/api/banners");
      setBanners(res.data);
      setError("");
    } catch (err) {
      console.error("Lỗi tải banner:", err);
      setError("Không thể tải danh sách banner");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !selectedFile) {
      setError("Vui lòng điền đầy đủ thông tin và chọn ảnh");
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("description", form.description);
      formData.append("image", selectedFile);

      await axios.post("http://localhost:5000/api/banners", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setForm({ name: "", description: "" });
      setSelectedFile(null);
      // Reset file input
      const fileInput = document.getElementById("bannerImage");
      if (fileInput) fileInput.value = "";

      fetchBanners();
      setError("");
    } catch (err) {
      console.error("Lỗi thêm banner:", err);
      setError(err.response?.data?.error || "Không thể thêm banner");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xoá banner này?")) {
      try {
        setLoading(true);
        await axios.delete(`http://localhost:5000/api/banners/${id}`);
        fetchBanners();
        setError("");
      } catch (err) {
        console.error("Lỗi xoá banner:", err);
        setError("Không thể xoá banner");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleEdit = (banner) => {
    setForm({ name: banner.name, description: banner.description || "" });
    setEditId(banner.id);
    setEditBanner(banner);
    setSelectedFile(null);
    setError("");
    // Scroll lên form
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!form.name) {
      setError("Vui lòng điền tên banner");
      return;
    }
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("description", form.description);
      if (selectedFile) {
        formData.append("image", selectedFile);
      }
      await axios.put(`http://localhost:5000/api/banners/${editId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setForm({ name: "", description: "" });
      setSelectedFile(null);
      setEditId(null);
      setEditBanner(null);
      const fileInput = document.getElementById("bannerImage");
      if (fileInput) fileInput.value = "";
      fetchBanners();
      setError("");
    } catch (err) {
      console.error("Lỗi cập nhật banner:", err);
      setError(err.response?.data?.error || "Không thể cập nhật banner");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
      if (!allowedTypes.includes(file.type)) {
        setError("Chỉ chấp nhận file ảnh (JPG, PNG, WEBP)");
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError("File ảnh không được lớn hơn 5MB");
        return;
      }

      setSelectedFile(file);
      setError("");
    }
  };

  return (
    <div className="admin-banner-page">

      {error && <div className="error-message">{error}</div>}

      <div className="banner-form-container">
        <form
          onSubmit={editId ? handleUpdate : handleSubmit}
          className="banner-form"
        >
          <div className="form-group">
            <label htmlFor="bannerName">Tên Banner:</label>
            <input
              id="bannerName"
              name="name"
              type="text"
              placeholder="VD: slider-1, hero-banner"
              value={form.name}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="bannerDescription">Mô tả (tùy chọn):</label>
            <textarea
              id="bannerDescription"
              name="description"
              placeholder="Mô tả về banner..."
              value={form.description}
              onChange={handleInputChange}
              rows="3"
            />
          </div>

          <div className="form-group">
            <label htmlFor="bannerImage">Chọn Ảnh:</label>
            <input
              id="bannerImage"
              name="image"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleFileChange}
              required={!editId}
            />
            <small>Chấp nhận: JPG, PNG, WEBP (tối đa 5MB)</small>
          </div>
          {editId && !selectedFile && editBanner && (
            <div className="form-group">
              <label>Ảnh gốc:</label>
              <div className="selected-image-preview">
                <img
                  src={editBanner.value}
                  alt="Ảnh gốc banner"
                  style={{
                    maxWidth: "200px",
                    maxHeight: "150px",
                    objectFit: "cover",
                  }}
                />
                <p>{editBanner.value.split("/").pop()}</p>
              </div>
            </div>
          )}
          {selectedFile && (
            <div className="form-group">
              <label>Ảnh đã chọn:</label>
              <div className="selected-image-preview">
                <img
                  src={URL.createObjectURL(selectedFile)}
                  alt="Preview"
                  style={{
                    maxWidth: "200px",
                    maxHeight: "150px",
                    objectFit: "cover",
                  }}
                />
                <p>{selectedFile.name}</p>
              </div>
            </div>
          )}

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading
              ? editId
                ? "Đang cập nhật..."
                : "Đang thêm..."
              : editId
              ? "Cập nhật Banner"
              : "Thêm Banner"}
          </button>
          {editId && (
            <button
              type="button"
              className="submit-btn"
              style={{ background: "#888", marginLeft: 8 }}
              onClick={() => {
                setEditId(null);
                setEditBanner(null);
                setForm({ name: "", description: "" });
                setSelectedFile(null);
                setError("");
                const fileInput = document.getElementById("bannerImage");
                if (fileInput) fileInput.value = "";
              }}
              disabled={loading}
            >
              Huỷ sửa
            </button>
          )}
        </form>
      </div>

      <div className="banner-list-container">
        <h3>Danh sách Banner</h3>
        {loading ? (
          <div className="loading">Đang tải...</div>
        ) : banners.length === 0 ? (
          <div className="empty-state">
            <p>Chưa có banner nào được thêm</p>
          </div>
        ) : (
          <div className="banner-table-wrapper">
            <table className="banner-table">
              <thead>
                <tr>
                  <th>STT</th>
                  <th>Tên Banner</th>
                  <th>Mô tả</th>
                  <th>Ảnh</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {banners.map((banner, index) => (
                  <tr key={banner.id}>
                    <td>{index + 1}</td>
                    <td className="banner-name">{banner.name}</td>
                    <td className="banner-description">
                      {banner.description || "Không có mô tả"}
                    </td>
                    <td className="banner-image">
                      <img
                        src={banner.value}
                        alt={banner.name}
                        onError={(e) => {
                          e.target.src = "/placeholder-image.png";
                          e.target.alt = "Ảnh không tải được";
                        }}
                      />
                    </td>
                    <td className="banner-actions">
                      <button
                        className="edit-btn"
                        onClick={() => handleEdit(banner)}
                        disabled={loading}
                      >
                        Sửa
                      </button>
                      <button
                        className="delete-btn"
                        onClick={() => handleDelete(banner.id)}
                        disabled={loading}
                      >
                        Xoá
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminBannerPage;
