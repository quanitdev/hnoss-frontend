import { SESSION_KEYS } from "../utils/constant";
import { useDispatch } from "react-redux";
import { setCart } from "../redux/commonSlide";

const useShoppingCart = () => {
  const dispatch = useDispatch();

  const addToCart = (product, quantity) => {
    const cart = localStorage.getItem(SESSION_KEYS.CART);
    const products = cart ? JSON.parse(cart).products : [];

    const productIndex = products.findIndex((c) => c.product.id === product.id);

    if (productIndex > -1) {
      products[productIndex].quantity += quantity;
    } else {
      products.push({
        product,
        quantity,
      });
    }

    const totalPrice = products.reduce((sum, item) => {
      return sum + item.product.price * item.quantity;
    }, 0);

    const newCart = {
      totalQuantity: products.length,
      totalPrice,
      products,
    };

    localStorage.setItem(SESSION_KEYS.CART, JSON.stringify(newCart));
    alert("Đã thêm sản phẩm vào giỏ hàng!");
    dispatch(setCart(newCart));
  };

  const removeCart = (id) => {
    const cart = localStorage.getItem(SESSION_KEYS.CART);

    if (!cart || !Array.isArray(JSON.parse(cart).products)) {
      alert("Không có sản phẩm trong giỏ hàng.");
      return cart;
    }

    if (window.confirm("Bạn có chắc chắn muốn xóa sản phẩm không?")) {
      const item = JSON.parse(cart).products.find(
        ({ product }) => product.id === id
      );

      if (!item) {
        alert("Không tìm thấy sản phẩm trong giỏ hàng.");
        return cart;
      }

      const totalPrice =
        JSON.parse(cart).totalPrice - item.quantity * item.product.price;
      const products = JSON.parse(cart).products.filter(
        ({ product }) => product.id !== id
      );

      const newCart = {
        totalQuantity: products.length,
        totalPrice,
        products,
      };

      localStorage.setItem(SESSION_KEYS.CART, JSON.stringify(newCart));
      dispatch(setCart(newCart));
      return newCart;
    }

    return cart;
  };

  return {
    addToCart,
    removeCart,
  };
};

export default useShoppingCart;
