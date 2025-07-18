import { ReactSession } from "react-client-session";
import { SESSION_KEYS } from "../utils/constant";
import { useDispatch } from "react-redux";
import { setCart } from "../redux/commonSlide";

const useShoppingCart = () => {
    const dispatch = useDispatch();

  const addToCart = (product, quantity) => {
    const cart = ReactSession.get(SESSION_KEYS.CART);
    const products = cart ? cart.products : [];

    const productIndex = products.findIndex(
      (c) => c.product.id === product.id
    );

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

    ReactSession.set(SESSION_KEYS.CART, newCart);
    alert("Đã thêm sản phẩm vào giỏ hàng!");
    dispatch(setCart(newCart));
  };

  const removeCart = (id) => {
    const cart = ReactSession.get(SESSION_KEYS.CART);

    if (!cart || !Array.isArray(cart.products)) {
      alert("Không có sản phẩm trong giỏ hàng.");
      return cart;
    }

    if (window.confirm("Bạn có chắc chắn muốn xóa sản phẩm không?")) {
      const item = cart.products.find(({ product }) => product.id === id);

      if (!item) {
        alert("Không tìm thấy sản phẩm trong giỏ hàng.");
        return cart;
      }

      const totalPrice =
        cart.totalPrice - item.quantity * item.product.price;
      const products = cart.products.filter(
        ({ product }) => product.id !== id
      );

      const newCart = {
        totalQuantity: products.length,
        totalPrice,
        products,
      };

      ReactSession.set(SESSION_KEYS.CART, newCart);
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
