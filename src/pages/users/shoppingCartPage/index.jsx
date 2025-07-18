import { memo, useState, useEffect } from "react";
import Breadcrumb from "../theme/breadcrumb";
import "./style.scss";
import { formatter } from "../../../utils/fomater";
import { AiOutlineClose } from "react-icons/ai";
import { Quantity } from "../../../component";
import { useNavigate } from "react-router-dom";
import { ROUTERS } from "../../../utils/router";
import { SESSION_KEYS } from "../../../utils/constant";
import { ReactSession } from "react-client-session";
import useShoppingCart from "../../../hooks/useShoppingCart";
import axios from "axios";
import locationData from "../../../data/vietnam_locations.json";
import { useGetBannersUS } from "../../../api/homePage";

const ShoppingCartPage = () => {
  const { data: banners = [] } = useGetBannersUS();
  const emptyCartBanner = banners.find((b) => b.name === "cart-0");
  const QRBanner = banners.find((b) => b.name === "ma-qr");
  const navigate = useNavigate();
  const { removeCart } = useShoppingCart();
  const [cart, setCart] = useState(ReactSession.get(SESSION_KEYS.CART));
  const [discountCode, setDiscountCode] = useState("");
  const [discountInfo, setDiscountInfo] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [showForm, setShowForm] = useState(false);

  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedWard, setSelectedWard] = useState("");
  const [specificAddress, setSpecificAddress] = useState("");
  const [receiver, setReceiver] = useState({
    name: "",
    email: "",
    phone: "",
    note: "",
  });

  const [shippingFee, setShippingFee] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState("cod"); // 'cod' hoặc 'prepaid'

  const provinces = locationData.map((loc) => loc.name);
  const districts = selectedProvince
    ? locationData
        .find((p) => p.name === selectedProvince)
        ?.districts.map((d) => d.name) || []
    : [];

  const wards = selectedDistrict
    ? locationData
        .find((p) => p.name === selectedProvince)
        ?.districts.find((d) => d.name === selectedDistrict)?.wards || []
    : [];

  useEffect(() => {
    if (!cart || cart.totalQuantity === 0) navigate(ROUTERS.USER.SHOPPING_CART);
  }, [cart]);

  useEffect(() => {
    if (selectedProvince) {
      const north = [
        "Hà Nội",
        "Hải Phòng",
        "Bắc Ninh",
        "Thái Nguyên",
        "Quảng Ninh",
      ];
      const central = ["Đà Nẵng", "Huế", "Nghệ An", "Quảng Trị", "Quảng Bình"];
      const south = [
        "TP. Hồ Chí Minh",
        "Cần Thơ",
        "Bình Dương",
        "Đồng Nai",
        "Vũng Tàu",
      ];

      if (north.includes(selectedProvince)) setShippingFee(40000);
      else if (central.includes(selectedProvince)) setShippingFee(30000);
      else if (south.includes(selectedProvince)) setShippingFee(50000);
      else setShippingFee(40000); // Mặc định
    }
  }, [selectedProvince]);

  const handleApplyDiscount = async () => {
    try {
      const res = await axios.post(
        "http://localhost:5000/api/sale/check-code",
        {
          code: discountCode,
          totalPrice: cart?.totalPrice,
        }
      );
      const { discount, discountType, discountAmount } = res.data;
      const info = {
        code: discountCode,
        discountType,
        discount,
        discountAmount,
        totalAfterDiscount: cart.totalPrice - discountAmount,
      };
      setDiscountInfo(info);
      setErrorMsg("");
      ReactSession.set("DISCOUNT_INFO", info);
    } catch (err) {
      setDiscountInfo(null);
      setErrorMsg(err.response?.data?.message || "Mã giảm giá không hợp lệ.");
      ReactSession.remove("DISCOUNT_INFO");
    }
  };

  const totalAfterDiscount = discountInfo
    ? discountInfo.totalAfterDiscount
    : cart?.totalPrice;
  const totalPayment = totalAfterDiscount + shippingFee;

  const handleSubmitOrder = async () => {
    const currentUser = ReactSession.get(SESSION_KEYS.USER_INFO);
    console.log("User FE:", currentUser);
    // Kiểm tra user_id hợp lệ
    const user_id = currentUser?.user_id || currentUser?.id;
    if (!user_id) {
      alert("❗ Không tìm thấy user_id. Vui lòng đăng nhập lại.");
      navigate(ROUTERS.USER.LOGIN);
      return;
    }

    if (
      !receiver.name ||
      !receiver.phone ||
      !selectedProvince ||
      !selectedDistrict ||
      !selectedWard ||
      !specificAddress
    ) {
      alert("❗ Vui lòng nhập đầy đủ thông tin giao hàng.");
      return;
    }

    const shippingAddress = `${specificAddress}, ${selectedWard}, ${selectedDistrict}, ${selectedProvince}`;

    const payload = {
      products: cart.products.map(({ product, quantity }) => ({
        product_id: product.id,
        quantity,
        price: product.price,
      })),
      totalQuantity: cart.totalQuantity,
      totalPrice: cart.totalPrice,
      discountCode: discountInfo?.code || null,
      discountAmount: discountInfo ? cart.totalPrice - totalAfterDiscount : 0,
      totalPay: totalPayment,
      shippingFee,
      note: receiver.note,
      receiver_name: receiver.name,
      receiver_phone: receiver.phone,
      receiver_email: receiver.email,
      shipping_address: shippingAddress,
      payment_method: paymentMethod,
      user_id, // luôn truyền user_id
    };
    console.log("Payload FE gửi:", payload);
    try {
      await axios.post("http://localhost:5000/api/orders/create", payload);
      ReactSession.remove(SESSION_KEYS.CART);
      ReactSession.remove("DISCOUNT_INFO");
      // alert("✅ Đặt hàng thành công!");
      // navigate(ROUTERS.USER.HOME);
      // window.location.reload();
      // Lưu thông tin đơn hàng để hiển thị ở trang xác nhận
      const orderSuccessInfo = {
        ...payload,
        products: cart.products.map(({ product, quantity }) => ({
          img: product.img,
          name: product.name,
          color: product.color,
          size: product.size,
          price: product.price,
          quantity,
        })),
      };
      sessionStorage.setItem(
        "ORDER_SUCCESS_INFO",
        JSON.stringify(orderSuccessInfo)
      );
      navigate("/order-success");
    } catch (err) {
      alert(err.response?.data?.message || "❌ Lỗi khi đặt hàng.");
    }
  };

  const handleQuantityChange = (productId, newQuantity) => {
    const updatedCart = { ...cart };
    const item = updatedCart.products.find((p) => p.product.id === productId);
    if (item) {
      item.quantity = newQuantity;
      updatedCart.totalQuantity = updatedCart.products.reduce(
        (sum, p) => sum + p.quantity,
        0
      );
      updatedCart.totalPrice = updatedCart.products.reduce(
        (sum, p) => sum + p.quantity * p.product.price,
        0
      );
      setCart(updatedCart);
      ReactSession.set(SESSION_KEYS.CART, updatedCart); // cập nhật session
    }
  };

  return (
    <>
      <Breadcrumb
        title="GIỎ HÀNG"
        paths={[
          { name: "Trang chủ", path: ROUTERS.USER.HOME },
          { name: "Sản phẩm", path: ROUTERS.USER.PRODUCTS },
          { name: "Giỏ hàng" },
        ]}
      />

      {!cart || cart.totalQuantity === 0 ? (
        <div className="empty-cart">
          <img
            src={
              emptyCartBanner?.value ||
              require("../../../assets/users/images/empty-cart.png")
            }
            alt="empty cart"
          />
          <h3>🛒 Giỏ hàng của bạn đang trống</h3>
          <p>Hãy thêm sản phẩm vào giỏ để tiếp tục mua sắm nhé!</p>
          <button
            className="button-submit"
            onClick={() => navigate(ROUTERS.USER.PRODUCTS)}
          >
            🛍️ Mua sắm ngay
          </button>
        </div>
      ) : (
        <div className="container">
          <div className="table_cart">
            <table>
              <thead>
                <tr>
                  <th>STT</th>
                  <th>Ảnh</th>
                  <th>Tên</th>
                  <th>Giá</th>
                  <th>Số lượng</th>
                  <th>Thành tiền</th>
                  <th>Xóa</th>
                </tr>
              </thead>
              <tbody className="tbody">
                {cart?.products?.map(({ product, quantity }, key) => (
                  <tr key={key}>
                    <td>{key + 1}</td>
                    <td>
                      <img src={product.img} alt="product-pic" />
                    </td>
                    <td>
                      {product.name}
                      {product.size ? ` (${product.size})` : ""}
                    </td>
                    <td>{formatter(product.price)}</td>
                    <td
                      style={{
                        padding: "63px 0",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Quantity
                        initquantity={quantity}
                        hasAddToCart={false}
                        onChange={(newQuantity) =>
                          handleQuantityChange(product.id, newQuantity)
                        }
                      />
                    </td>

                    <td>
                      {formatter(
                        cart.products[key].product.price *
                          cart.products[key].quantity
                      )}
                    </td>
                    <td
                      className="icon_close"
                      onClick={() => {
                        const updatedCart = removeCart(product.id);
                        setCart(updatedCart);
                      }}
                    >
                      <AiOutlineClose />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="row">
            <div className="col-lg-6">
              <div className="shopping_continue">
                <h3>Mã giảm giá</h3>
                <div className="shopping_discount">
                  <input
                    placeholder="Nhập mã giảm giá"
                    value={discountCode}
                    onChange={(e) => setDiscountCode(e.target.value)}
                  />
                  <button
                    className="button-submit"
                    onClick={handleApplyDiscount}
                  >
                    Áp dụng
                  </button>
                </div>
                {errorMsg && <p style={{ color: "red" }}>{errorMsg}</p>}
              </div>
            </div>

            <div className="col-lg-6">
              <div className="shopping_checkout">
                <h3>Chi tiết thanh toán:</h3>
                <ul>
                  {/* <li>Số lượng: <span>{cart.totalQuantity}</span></li> */}
                  <li>
                    Tổng tiền hàng: <span>{formatter(cart.totalPrice)}</span>
                  </li>
                  {discountInfo && (
                    <div className="sale_span">
                      <li>
                        Giảm giá (
                        {discountInfo.discountType === "percent"
                          ? `${discountInfo.discount}%`
                          : `${discountInfo.discount.toLocaleString()}đ`}
                        ):
                        <span>-{formatter(discountInfo.discountAmount)}</span>
                      </li>
                    </div>
                  )}
                  <li>
                    Phí vận chuyển: <span>{formatter(shippingFee)}</span>
                  </li>
                  <li>
                    <strong>Tổng thanh toán:</strong>{" "}
                    <span>{formatter(totalPayment)}</span>
                  </li>
                </ul>
                <button
                  className="button-submit"
                  onClick={() => {
                    const currentUser = ReactSession.get(
                      SESSION_KEYS.USER_INFO
                    );

                    if (!currentUser) {
                      alert("❗ Vui lòng đăng nhập để tiếp tục.");
                      navigate(ROUTERS.USER.LOGIN);
                    } else {
                      setShowForm(true);
                    }
                  }}
                >
                  Điền thông tin nhận hàng
                </button>
              </div>
            </div>

            {showForm && (
              <div className="overlay-form">
                <div className="address-form">
                  <h3>Thông tin giao hàng</h3>
                  <input
                    placeholder="Họ tên"
                    value={receiver.name}
                    onChange={(e) =>
                      setReceiver({ ...receiver, name: e.target.value })
                    }
                  />
                  <input
                    placeholder="Email"
                    value={receiver.email}
                    onChange={(e) =>
                      setReceiver({ ...receiver, email: e.target.value })
                    }
                  />
                  <input
                    placeholder="Số điện thoại"
                    value={receiver.phone}
                    onChange={(e) =>
                      setReceiver({ ...receiver, phone: e.target.value })
                    }
                  />

                  <select
                    value={selectedProvince}
                    onChange={(e) => {
                      setSelectedProvince(e.target.value);
                      setSelectedDistrict("");
                    }}
                  >
                    <option value="">Chọn tỉnh/thành</option>
                    {provinces.map((p, i) => (
                      <option key={i} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>

                  <select
                    value={selectedDistrict}
                    onChange={(e) => setSelectedDistrict(e.target.value)}
                  >
                    <option value="">Chọn quận/huyện</option>
                    {districts.map((d, i) => (
                      <option key={i} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>

                  <select
                    value={selectedWard}
                    onChange={(e) => setSelectedWard(e.target.value)}
                  >
                    <option value="">Chọn phường/xã</option>
                    {wards.map((w, i) => (
                      <option key={i} value={w}>
                        {w}
                      </option>
                    ))}
                  </select>

                  <input
                    placeholder="Địa chỉ cụ thể"
                    value={specificAddress}
                    onChange={(e) => setSpecificAddress(e.target.value)}
                  />
                  <textarea
                    placeholder="Ghi chú"
                    value={receiver.note}
                    onChange={(e) =>
                      setReceiver({ ...receiver, note: e.target.value })
                    }
                  />

                  {/* Thêm lựa chọn phương thức thanh toán dạng block đẹp */}
                  <div className="payment-methods-group">
                    <div
                      className={`payment-method-option${
                        paymentMethod === "bank" ? " selected" : ""
                      }`}
                      onClick={() => setPaymentMethod("bank")}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="bank"
                        checked={paymentMethod === "bank"}
                        onChange={() => setPaymentMethod("bank")}
                        style={{ accentColor: "#2e8b57" }}
                      />
                      <span className="icon" role="img" aria-label="bank">
                        💳
                      </span>
                      <span>Chuyển khoản qua ngân hàng</span>
                    </div>
                    <div
                      className={`payment-method-option${
                        paymentMethod === "cod" ? " selected" : ""
                      }`}
                      onClick={() => setPaymentMethod("cod")}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="cod"
                        checked={paymentMethod === "cod"}
                        onChange={() => setPaymentMethod("cod")}
                        style={{ accentColor: "#2e8b57" }}
                      />
                      <span className="icon" role="img" aria-label="cod">
                        📦
                      </span>
                      <span>Thanh toán khi giao hàng (COD)</span>
                    </div>
                  </div>
                  {paymentMethod === "bank" && (
                    <div className="payment-bank-qr">
                      <img
                        src={
                          QRBanner?.value ||
                          require("../../../assets/users/images/banner/vietcombank-qr.png")
                        }
                        alt="QR ngân hàng"
                        style={{ width: "200px", marginBottom: "10px" }}
                      />
                      <div className="bank-info">
                        LE VAN ANH QUAN
                        <br />
                        1031411523
                      </div>
                    </div>
                  )}

                  <p>
                    Phí vận chuyển: <span>{formatter(shippingFee)}</span>
                  </p>
                  <p>
                    <strong>Tổng thanh toán:</strong>{" "}
                    <span>{formatter(totalPayment)}</span>
                  </p>

                  <button onClick={handleSubmitOrder}>Xác nhận đặt hàng</button>
                  <button onClick={() => setShowForm(false)}>Huỷ</button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default memo(ShoppingCartPage);
