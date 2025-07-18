// import { memo } from "react";
// import "./style.scss";
// import { AiOutlineEye, AiOutlineShoppingCart } from "react-icons/ai";
// import { generatePath, Link } from "react-router-dom";
// import { formatter } from "../../utils/fomater";
// import { ROUTERS } from "../../utils/router";
// import useShoppingCart from "../../hooks/useShoppingCart";

// const ProductCard = ({ product }) => {
//   const { addToCart } = useShoppingCart();
//   return (
//     <>
//       <div className="featured_item pic-pr-10">
//         <div
//           className="featured_item_pic"
//           style={{ backgroundImage: `url(${generatePath(product.img)})` }}
//         >
//           <ul className="featured_item_pic_hover">
//             <li>
//               <Link to={generatePath(ROUTERS.USER.PRODUCT, { id: product.id })}>
//                 <AiOutlineEye />
//               </Link>
//             </li>

//             <li
//               onClick={() => addToCart(product, 1)}
//               style={{ cursor: "pointer" }}
//             >
//               <AiOutlineShoppingCart />
//             </li>
//           </ul>
//         </div>
//         <div className="featured_item_text">
//           <h6>
//             <Link to={generatePath(ROUTERS.USER.PRODUCT, { id: product.id })}>
//               {product.name}
//             </Link>
//           </h6>
//           <h5>{formatter(product.price)}</h5>
//         </div>
//       </div>
//     </>
//   );
// };

// export default memo(ProductCard);

import { memo } from "react";
import "./style.scss";
import { AiOutlineEye, AiOutlineShoppingCart } from "react-icons/ai";
import { generatePath, useNavigate, Link } from "react-router-dom";
import { formatter } from "../../utils/fomater";
import { ROUTERS } from "../../utils/router";
import useShoppingCart from "../../hooks/useShoppingCart";

const ProductCard = ({ product }) => {
  const { addToCart } = useShoppingCart();
  const navigate = useNavigate();

  const handleViewDetail = () => {
    navigate(generatePath(ROUTERS.USER.PRODUCT, { id: product.id }));
    window.location.reload();
  };

  return (
    <div className="featured_item pic-pr-10">
      {/* ✅ Thêm class image-wrapper */}
      <div
        className="featured_item_pic image-wrapper"
        style={{ backgroundImage: `url(${generatePath(product.img)})` }}
      >
        <ul className="featured_item_pic_hover">
          <li>
            <span onClick={handleViewDetail} style={{ cursor: "pointer" }}>
              <AiOutlineEye />
            </span>
          </li>
          <li
            onClick={() => addToCart(product, 1)}
            style={{ cursor: "pointer" }}
          >
            <AiOutlineShoppingCart />
          </li>
        </ul>
      </div>
      <div className="featured_item_text">
        <h6>
          <Link to={generatePath(ROUTERS.USER.PRODUCT, { id: product.id })}>
            {product.name}
          </Link>
        </h6>
        <h5>{formatter(product.price)}</h5>
      </div>
    </div>
  );
};

export default memo(ProductCard);
