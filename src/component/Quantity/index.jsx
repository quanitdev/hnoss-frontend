import { memo, useState } from "react";
import "./style.scss";
import useShoppingCart from "../../hooks/useShoppingCart";
import { ReactSession } from "react-client-session";
import { SESSION_KEYS } from "../../utils/constant";

const Quantity = ({
  hasAddToCart = true,
  product,
  initquantity,
  onChange,
  selectedSize,
}) => {
  const { addToCart } = useShoppingCart();
  const [quantity, setQuantity] = useState(initquantity || 1);

  const incrementQuantity = (isPlus) => {
    if (!isPlus && quantity === 1) {
      return;
    }

    const newQuantity = isPlus ? quantity + 1 : quantity - 1;
    setQuantity(newQuantity);

    if (typeof onChange === "function") {
      onChange(newQuantity);
    }
  };

  return (
    <div className="quantity-container">
      <div className="quantity">
        <span className="qtybtn" onClick={() => incrementQuantity(false)}>
          -
        </span>
        <input type="number" value={quantity} readOnly />
        <span className="qtybtn" onClick={() => incrementQuantity(true)}>
          +
        </span>
      </div>
      {hasAddToCart && (
        <button
          type="button"
          className="button-submit"
          onClick={() => {
            const productWithSize = selectedSize
              ? { ...product, size: selectedSize }
              : product;
            addToCart(productWithSize, quantity);
            const curCart = ReactSession.get(SESSION_KEYS.CART);
          }}
        >
          Thêm giỏ hàng
        </button>
      )}
    </div>
  );
};

export default memo(Quantity);
