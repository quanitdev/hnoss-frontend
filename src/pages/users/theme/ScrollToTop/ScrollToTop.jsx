import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
const { pathname } = useLocation();

useEffect(() => {
window.scrollTo({
top: 0,
behavior: "smooth", // có thể bỏ nếu không cần hiệu ứng mượt
});
}, [pathname]);

return null;
};

export default ScrollToTop;

