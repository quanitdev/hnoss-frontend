import { memo, useState, useEffect } from "react";
import "./style.scss";
import { getProductsAPI, getCategoriesAPI } from "../../../api/homePage";
import { ProductCard } from "../../../component";
import { ROUTERS } from "../../../utils/router";
import Breadcrumb from "../theme/breadcrumb";
import FilterBox from "./FilterBox";
import Fuse from "fuse.js";

const ProductsPage = () => {
  const [searchText, setSearchText] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sortIndex, setSortIndex] = useState(0);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  // Thêm state cho filter loại và size
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [suggestions, setSuggestions] = useState([]);

  // Fuse.js options cho fuzzy search
  const fuseOptions = {
    keys: ["name"],
    threshold: 0.4,
  };
  let fuse = null;
  if (products.length > 0) {
    fuse = new Fuse(products, fuseOptions);
  }

  // ✅ Gọi API khi load trang
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await getProductsAPI();
        console.log("API trả về:", res);

        let productList = [];

        if (Array.isArray(res)) {
          productList = res;
        } else if (Array.isArray(res?.data)) {
          productList = res.data;
        } else if (Array.isArray(res?.products)) {
          productList = res.products;
        } else {
          console.warn("⚠️ Không có mảng sản phẩm hợp lệ. Dữ liệu:", res);
          return;
        }

        const mapped = productList.map((item) => ({
          id: item.id || item._id || Math.random(),
          name: item.name || "Không tên",
          price: item.price || 0,
          img: item.img || item.image || item.thumbnail || "/default-image.jpg",
          category_id: item.category_id,
        }));

        setProducts(mapped);
        setFilteredProducts(mapped);
      } catch (err) {
        console.error("❌ Lỗi gọi API:", err);
        setProducts([]);
        setFilteredProducts([]);
      }
    };
    fetchProducts();
  }, []);

  // Lấy categories khi load trang
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await getCategoriesAPI();
        let cats = [];
        if (Array.isArray(res)) cats = res;
        else if (Array.isArray(res?.data)) cats = res.data;
        else if (Array.isArray(res?.categories)) cats = res.categories;
        setCategories(cats);
      } catch (err) {
        setCategories([]);
      }
    };
    fetchCategories();
  }, []);

  const sorts = [
    "Giá thấp đến cao",
    "Giá cao đến thấp",
    "Mới đến cũ",
    "Cũ đến mới",
  ];

  const priceRanges = [
    { label: "Tất cả", value: "all", min: null, max: null },
    { label: "Từ 0đ - 300,000đ", value: "0-300", min: 0, max: 300000 },
    {
      label: "Từ 300,000đ - 600,000đ",
      value: "300-600",
      min: 300000,
      max: 600000,
    },
    {
      label: "Từ 600,000đ - 1,000,000đ",
      value: "600-1000",
      min: 600000,
      max: 1000000,
    },
    { label: "Lớn hơn 1,000,000đ", value: "1000+", min: 1000000, max: null },
  ];
  const [selectedPriceRange, setSelectedPriceRange] = useState("all");

  // ✅ Cập nhật danh sách sau khi lọc
  useEffect(() => {
    let result = [...products];
    const search = searchText.trim().toLowerCase();
    if (search) {
      result = result.filter((item) =>
        item.name.toLowerCase().includes(search)
      );
    }
    // Lọc theo khoảng giá
    const range = priceRanges.find((r) => r.value === selectedPriceRange);
    if (range && range.value !== "all") {
      result = result.filter((item) => {
        const price = parseInt(item.price, 10);
        const matchMin = range.min === null || price >= range.min;
        const matchMax = range.max === null || price < range.max;
        return matchMin && matchMax;
      });
    }
    const min = parseInt(minPrice, 10);
    const max = parseInt(maxPrice, 10);
    result = result.filter((item) => {
      const price = parseInt(item.price, 10);
      const matchMin = isNaN(min) || price >= min;
      const matchMax = isNaN(max) || price <= max;
      return matchMin && matchMax;
    });
    // Lọc theo loại sản phẩm (category)
    if (
      selectedTypes.length > 0 &&
      selectedTypes[0] &&
      selectedTypes[0] !== "all"
    ) {
      // Tìm id của category được chọn
      const selectedCat = categories.find(
        (cat) => cat.name === selectedTypes[0]
      );
      const selectedCatId = selectedCat
        ? selectedCat.id || selectedCat._id
        : null;
      result = result.filter((item) => {
        // So sánh product.category_id với id của category được chọn
        return item.category_id === selectedCatId;
      });
    }
    switch (sortIndex) {
      case 0:
        result.sort((a, b) => a.price - b.price);
        break;
      case 1:
        result.sort((a, b) => b.price - a.price);
        break;
      case 2:
        result.sort((a, b) => b.id - a.id);
        break;
      case 3:
        result.sort((a, b) => a.id - b.id);
        break;
      default:
        break;
    }
    setFilteredProducts(result);
  }, [
    searchText,
    minPrice,
    maxPrice,
    sortIndex,
    products,
    selectedPriceRange,
    selectedTypes,
  ]);

  return (
    <>
      <Breadcrumb
        title="Tất cả sản phẩm"
        paths={[
          { name: "Trang chủ", path: ROUTERS.USER.HOME },
          { name: "Sản phẩm" },
        ]}
      />

      <div className="container">
        <div className="row">
          {/* Sidebar */}
          <div className="col-lg-3 col-md-12 col-sm-12 col-xs-12">
            <div className="sidebar">
              <div className="sidebar_item">
                <h2>Tìm kiếm</h2>
                <input
                  type="text"
                  value={searchText}
                  onChange={(e) => {
                    setSearchText(e.target.value);
                    if (fuse && e.target.value.trim()) {
                      const result = fuse
                        .search(e.target.value.trim())
                        .map((r) => r.item);
                      setSuggestions(result.slice(0, 6));
                    } else {
                      setSuggestions([]);
                    }
                  }}
                  placeholder="Nhập tên sản phẩm..."
                />
                {suggestions.length > 0 && (
                  <div className="search-suggestions">
                    {suggestions.map((item) => (
                      <div
                        key={item.id}
                        className="suggestion-item"
                        onClick={() => {
                          setSearchText(item.name);
                          setSuggestions([]);
                        }}
                      >
                        {item.name}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <FilterBox title="Khoảng Giá">
                <div
                  style={{ display: "flex", flexDirection: "column", gap: 8 }}
                >
                  {priceRanges.map((range) => (
                    <label key={range.value}>
                      <input
                        type="checkbox"
                        checked={selectedPriceRange === range.value}
                        onChange={() => setSelectedPriceRange(range.value)}
                      />{" "}
                      {range.label}
                    </label>
                  ))}
                </div>
              </FilterBox>
              <FilterBox title="Loại Trang Phục">
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 6,
                    maxHeight: 220,
                    overflowY: "auto",
                  }}
                >
                  <label style={{ fontWeight: 400 }}>
                    <input
                      type="checkbox"
                      checked={!selectedTypes[0] || selectedTypes[0] === "all"}
                      onChange={() => setSelectedTypes(["all"])}
                    />{" "}
                    Tất cả
                  </label>
                  {categories.length === 0 ? (
                    <span>Đang tải...</span>
                  ) : (
                    categories.map((cat) => (
                      <label
                        key={cat.id || cat._id || cat.name}
                        style={{ fontWeight: 400 }}
                      >
                        <input
                          type="checkbox"
                          checked={selectedTypes[0] === cat.name}
                          onChange={() => setSelectedTypes([cat.name])}
                        />{" "}
                        {cat.name}
                      </label>
                    ))
                  )}
                </div>
              </FilterBox>
              <div className="sidebar_item">
                <h2>Sắp xếp</h2>
                <div className="tags">
                  {sorts.map((item, key) => (
                    <div
                      key={key}
                      className={`tag ${key === sortIndex ? "active" : ""}`}
                      onClick={() => setSortIndex(key)}
                      style={{ cursor: "pointer" }}
                    >
                      {item}
                    </div>
                  ))}
                </div>
              </div>
              {/* <div className="sidebar_item">
                <h2>Thể loại khác</h2>
                <ul>
                  {categories.map((name, key) => (
                    <li key={key}>
                      <Link to={ROUTERS.USER.PRODUCTS}>{name}</Link>
                    </li>
                  ))}
                </ul>
              </div> */}
            </div>
          </div>

          {/* Danh sách sản phẩm */}
          <div className="col-lg-9 col-md-12 col-sm-12 col-xs-12">
            <div className="row">
              {filteredProducts.length === 0 ? (
                <div className="col-12">Không tìm thấy sản phẩm phù hợp.</div>
              ) : (
                filteredProducts.map((item) => (
                  <div
                    key={item.id}
                    className="col-lg-4 col-md-4 col-sm-6 col-xs-12 mb-4"
                  >
                    <ProductCard product={item} />
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default memo(ProductsPage);
