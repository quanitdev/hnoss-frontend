import { useState } from "react";

const Quantity = ({ initquantity, hasAddToCart, onChangeQuantity }) => {
  const [quantity, setQuantity] = useState(initquantity);

  const handleChange = (value) => {
    const newQuantity = Math.max(1, value); // không cho nhỏ hơn 1
    setQuantity(newQuantity);
    onChangeQuantity && onChangeQuantity(newQuantity);
  };

  return (
    <div className="quantity-control">
      <button onClick={() => handleChange(quantity - 1)}>-</button>
      <input
        type="number"
        value={quantity}
        onChange={(e) => handleChange(Number(e.target.value))}
      />
      <button onClick={() => handleChange(quantity + 1)}>+</button>
    </div>
  );
};

export default Quantity;
