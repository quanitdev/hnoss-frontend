import { memo, useState, useRef } from "react";
import "./style.scss";
import { formatter } from "../../../utils/fomater";
import {
} from "react-icons/ai";

import { ProductCard } from "../../../component";
import { Quantity } from "../../../component";
import { useProductDetailUS } from "../../../api/productDetailPage/queries";
import { useGetProductsUS } from "../../../api/homePage/queries";
import { useParams } from "react-router-dom";
import { ROUTERS } from "../../../utils/router";
import Breadcrumb from "../theme/breadcrumb";
import { useGetBannersUS } from "../../../api/homePage";

const MAGNIFIER_SIZE = 180; // kích thước lens vuông
const MAGNIFIER_ZOOM = 2; // độ phóng to

const ProductDetailPage = () => {
  const { data: banners = [] } = useGetBannersUS();
  const sizeGuideBanner = banners.find((b) => b.name === "size");
  const { id } = useParams();
  const { data: product, isLoading } = useProductDetailUS(id);
  const { data: allProducts, isLoading: isLoadingProducts } =
    useGetProductsUS();

  // Ảnh sản phẩm: nếu có mảng images thì dùng ảnh đầu tiên, không thì fallback về 1 ảnh
  const mainImage =
    product?.images && product.images.length > 0
      ? product.images[0]
      : product?.img || "/default.jpg";
  const [selectedSize, setSelectedSize] = useState("M");
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const [activeTab, setActiveTab] = useState("description");

  // Magnifier state
  const [showMagnifier, setShowMagnifier] = useState(false);
  const [magnifierPos, setMagnifierPos] = useState({
    x: 0,
    y: 0,
    width: 1,
    height: 1,
  });
  const imgRef = useRef(null);

  // Bình luận
  const [comments, setComments] = useState([
    {
      name: "Khách",
      content: "Sản phẩm rất đẹp!",
      date: new Date().toLocaleString(),
    },
  ]);
  const [commentInput, setCommentInput] = useState("");
  function handleAddComment() {
    if (commentInput.trim()) {
      setComments([
        {
          name: "Bạn",
          content: commentInput,
          date: new Date().toLocaleString(),
        },
        ...comments,
      ]);
      setCommentInput("");
    }
  }

  console.log("product:", product); // Debug dữ liệu
  console.log("allProducts:", allProducts); // Debug dữ liệu sản phẩm
  console.log("isLoadingProducts:", isLoadingProducts); // Debug loading state

  return (
    <>
      <Breadcrumb
        title="CHI TIẾT SẢN PHẨM"
        paths={[
          { name: "Trang chủ", path: ROUTERS.USER.HOME },
          { name: "Sản phẩm", path: ROUTERS.USER.PRODUCTS },
          { name: product?.name || "Chi tiết sản phẩm" },
        ]}
      />

      {!isLoading && product && (
        <div className="container">
          <div className="row">
            {/* Ảnh sản phẩm lớn với hiệu ứng kính lúp magnifier */}
            <div
              className="col-lg-6 col-xl-12 col-md-12 col-sm-12 col-xs-12 product_detail_pic"
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <div
                className="product-main-image-magnifier"
                style={{ position: "relative", width: 350, height: 500 }}
              >
                <img
                  ref={imgRef}
                  src={mainImage}
                  alt="product"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                  }}
                  onMouseEnter={() => setShowMagnifier(true)}
                  onMouseLeave={() => setShowMagnifier(false)}
                  onMouseMove={(e) => {
                    const { left, top, width, height } =
                      imgRef.current.getBoundingClientRect();
                    const x = e.pageX - left - window.scrollX;
                    const y = e.pageY - top - window.scrollY;
                    setMagnifierPos({ x, y, width, height });
                  }}
                />
                {showMagnifier && (
                  <>
                    {/* Lens */}
                    <div
                      className="magnifier-lens"
                      style={{
                        left: Math.max(
                          0,
                          Math.min(
                            magnifierPos.x - MAGNIFIER_SIZE / 2,
                            magnifierPos.width - MAGNIFIER_SIZE
                          )
                        ),
                        top: Math.max(
                          0,
                          Math.min(
                            magnifierPos.y - MAGNIFIER_SIZE / 2,
                            magnifierPos.height - MAGNIFIER_SIZE
                          )
                        ),
                        width: MAGNIFIER_SIZE,
                        height: MAGNIFIER_SIZE,
                      }}
                    />
                    {/* Vùng phóng to */}
                    <div
                      className="magnifier-large"
                      style={{
                        left: 370, // cách ảnh gốc 20px
                        top: 0,
                        width: MAGNIFIER_SIZE * MAGNIFIER_ZOOM,
                        height: MAGNIFIER_SIZE * MAGNIFIER_ZOOM,
                        backgroundImage: `url(${mainImage})`,
                        backgroundRepeat: "no-repeat",
                        backgroundSize: `${
                          magnifierPos.width * MAGNIFIER_ZOOM
                        }px ${magnifierPos.height * MAGNIFIER_ZOOM}px`,
                        backgroundPosition: `-${
                          Math.max(
                            0,
                            Math.min(
                              magnifierPos.x - MAGNIFIER_SIZE / 2,
                              magnifierPos.width - MAGNIFIER_SIZE
                            )
                          ) * MAGNIFIER_ZOOM
                        }px -${
                          Math.max(
                            0,
                            Math.min(
                              magnifierPos.y - MAGNIFIER_SIZE / 2,
                              magnifierPos.height - MAGNIFIER_SIZE
                            )
                          ) * MAGNIFIER_ZOOM
                        }px`,
                      }}
                    />
                  </>
                )}
              </div>
            </div>
            {/* Thông tin sản phẩm */}
            <div className="col-lg-6 col-xl-12 col-md-12 col-sm-12 col-xs-12 product_detail_text">
              <h2>{product.name}</h2>
              <h3>{formatter(product.price)}</h3>
              <p>{product.sort_description}</p>
              {/* Lựa chọn size */}
              {product.category_id !== 5 && (
                <div className="product-sizes" style={{ margin: "16px 0" }}>
                  <span style={{ marginRight: 8 }}></span>
                  {["S", "M", "L"].map((size) => (
                    <button
                      key={size}
                      style={{
                        marginRight: 8,
                        padding: "4px 12px",
                        border:
                          selectedSize === size
                            ? "2px solid #000"
                            : "1px solid #ccc",
                        background: selectedSize === size ? "#eee" : "#fff",
                        borderRadius: 4,
                        cursor: "pointer",
                      }}
                      className={selectedSize === size ? "active" : ""}
                      onClick={() => setSelectedSize(size)}
                    >
                      {size}
                    </button>
                  ))}
                  <button
                    style={{
                      marginLeft: 16,
                      color: "#007bff",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      textDecoration: "underline",
                    }}
                    onClick={() => setShowSizeGuide(true)}
                  >
                    Hướng dẫn tính size
                  </button>
                </div>
              )}
              <Quantity product={product} selectedSize={selectedSize} />
              <ul>
                <li>
                  <b>Tình trạng: </b>{" "}
                  <span>{product.inventory > 0 ? "Còn hàng" : "Hết hàng"}</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Overlay hướng dẫn size */}
          {showSizeGuide && (
            <div
              className="size-guide-overlay"
              style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100vw",
                height: "100vh",
                background: "rgba(0,0,0,0.4)",
                zIndex: 1000,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
              onClick={() => setShowSizeGuide(false)}
            >
              <div
                className="size-guide-content"
                style={{
                  background: "#fff",
                  padding: 24,
                  borderRadius: 8,
                  position: "relative",
                  maxWidth: 600,
                  width: "90%",
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <img
                  src={
                    sizeGuideBanner?.value ||
                    require("../../../assets/users/images/banner/size.png")
                  }
                  alt="Hướng dẫn size"
                  style={{ width: "100%", borderRadius: 8 }}
                />

                <button
                  style={{
                    position: "absolute",
                    top: 8,
                    right: 8,
                    background: "none",
                    border: "none",
                    fontSize: 24,
                    cursor: "pointer",
                  }}
                  onClick={() => setShowSizeGuide(false)}
                >
                  &times;
                </button>
              </div>
            </div>
          )}

          {/* Tabs mô tả & bình luận */}
          <div
            className="product-tabs"
            style={{
              marginTop: 32,
              borderBottom: "1px solid #eee",
              display: "flex",
              gap: 16,
            }}
          >
            <button
              onClick={() => setActiveTab("description")}
              className={activeTab === "description" ? "active" : ""}
              style={{
                border: "none",
                background: "none",
                fontWeight: activeTab === "description" ? "bold" : "normal",
                borderBottom:
                  activeTab === "description" ? "2px solid #000" : "none",
                padding: 8,
                cursor: "pointer",
              }}
            >
              Mô tả
            </button>
            <button
              onClick={() => setActiveTab("comment")}
              className={activeTab === "comment" ? "active" : ""}
              style={{
                border: "none",
                background: "none",
                fontWeight: activeTab === "comment" ? "bold" : "normal",
                borderBottom:
                  activeTab === "comment" ? "2px solid #000" : "none",
                padding: 8,
                cursor: "pointer",
              }}
            >
              Bình luận
            </button>
          </div>
          <div className="tab-content" style={{ marginTop: 16 }}>
            {activeTab === "description" && (
              <div>
                <div
                  dangerouslySetInnerHTML={{ __html: product.description }}
                />
              </div>
            )}
            {activeTab === "comment" && (
              <div className="product-comments">
                <div className="comment-form">
                  <textarea
                    value={commentInput}
                    onChange={(e) => setCommentInput(e.target.value)}
                    placeholder="Nhập bình luận của bạn..."
                    rows={3}
                  />
                  <button onClick={handleAddComment}>Gửi bình luận</button>
                </div>
                <div className="comment-list">
                  {comments.length === 0 && <p>Chưa có bình luận nào.</p>}
                  {comments.map((c, idx) => (
                    <div key={idx} className="comment-item">
                      <b>{c.name}</b>{" "}
                      <span style={{ color: "#888", fontSize: 12 }}>
                        {c.date}
                      </span>
                      <div>{c.content}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="section-title">
            <h2>Sản phẩm tương tự</h2>
          </div>
          <div className="row">
            {!isLoadingProducts && allProducts ? (
              (() => {
                const similarProducts = allProducts
                  .filter(
                    (item) =>
                      String(item.category_id) ===
                        String(product?.category_id) &&
                      String(item.id) !== String(product?.id)
                  )
                  .slice(0, 4);

                console.log("Similar products found:", similarProducts.length);
                console.log("Product category_id:", product?.category_id);
                console.log(
                  "All products category_ids:",
                  allProducts.map((p) => ({
                    id: p.id,
                    category_id: p.category_id,
                  }))
                );

                return similarProducts.length > 0 ? (
                  similarProducts.map((item, key) => (
                    <div
                      key={key}
                      className="col-lg-3 col-md-4 col-sm-6 col-xs-12"
                    >
                      <ProductCard product={item} />
                    </div>
                  ))
                ) : (
                  <div className="col-12">
                    <p>Không có sản phẩm tương tự</p>
                  </div>
                );
              })()
            ) : (
              <div className="col-12">
                <p>Đang tải sản phẩm tương tự...</p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default memo(ProductDetailPage);
