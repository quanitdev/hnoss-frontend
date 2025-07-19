import { memo, useState } from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import "./style.scss";
import { ProductCard } from "../../../component";
import {
  useGetCategoriesUS,
  useGetProductsUS,
  useGetBannersUS,
} from "../../../api/homePage";

const HomePage = () => {
  const responsive = {
    superLargeDesktop: {
      breakpoint: { max: 4000, min: 3000 },
      items: 5,
    },
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 4,
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 2,
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1,
    },
  };

  const { data: categories } = useGetCategoriesUS();
  const { data: products } = useGetProductsUS();
  const { data: banners } = useGetBannersUS();
  const [selectedCategory, setSelectedCategory] = useState(null);

  // Tạo silderItems chỉ khi categories có dữ liệu
  const silderItems = categories
    ? [
        {
          bgImg: categories[0]?.img,
          name: categories[0]?.name,
          id: categories[0]?.id,
        },
        {
          bgImg: categories[1]?.img,
          name: categories[1]?.name,
          id: categories[1]?.id,
        },
        {
          bgImg: categories[2]?.img,
          name: categories[2]?.name,
          id: categories[2]?.id,
        },
        {
          bgImg: categories[3]?.img,
          name: categories[3]?.name,
          id: categories[3]?.id,
        },
        {
          bgImg: categories[4]?.img,
          name: categories[4]?.name,
          id: categories[4]?.id,
        },
      ].filter((item) => item.name)
    : [];

  return (
    <>
      {/*Categories start*/}
      {silderItems.length > 0 && (
        <div className="container container_categories_slider">
          <Carousel responsive={responsive} className="categories_slider">
            {silderItems.map((item, key) => (
              <div
                className={`categories_slider_item${
                  selectedCategory === item.id ? " active" : ""
                }`}
                style={{ backgroundImage: `url(${item.bgImg})` }}
                key={key}
                onClick={() => setSelectedCategory(item.id)}
              >
                <p>{item.name}</p>
              </div>
            ))}
          </Carousel>
        </div>
      )}
      {/*Categories end*/}
      {/*Featured begin */}
      <div className="container">
        <div className="featured">
          <div className="section-title">
            <h2>Sản phẩm nổi bật</h2>
          </div>
          <div className="row">
            {products
              ?.filter(
                (product) =>
                  !selectedCategory || product.category_id === selectedCategory
              )
              .map((product) => (
                <div
                  className="col-lg-3 col-md-4 col-sm-6 col-xs-12"
                  key={product.id}
                >
                  <ProductCard product={product} img={product.value} />
                </div>
              ))}
          </div>
        </div>
      </div>
      {/* Featured End */}
      {/* Banner Slider start */}
      {banners && banners.length > 0 && (
        <div className="container container_banner_slider">
          <Carousel
            responsive={{
              desktop: {
                breakpoint: { max: 3000, min: 1024 },
                items: 3,
              },
              tablet: {
                breakpoint: { max: 1024, min: 600 },
                items: 2,
              },
              mobile: {
                breakpoint: { max: 600, min: 0 },
                items: 1,
              },
            }}
            arrows
            autoPlay={true}
            infinite={true}
            className="banner_slider"
          >
            {banners
              .filter((b) =>
                [
                  "banner-1",
                  "banner-2",
                  "banner-3",
                  "banner-4",
                  "banner-5",
                  "banner-6",
                ].includes(b.name)
              )
              .map((banner) => (
                <div className="banner_pic" key={banner.id}>
                  <img src={banner.value} alt={banner.name} />
                </div>
              ))}
          </Carousel>
        </div>
      )}
      {/* Banner Slider end */}
    </>
  );
};
export default memo(HomePage);
