import { memo } from "react";
import "./style.scss";
import { Link } from "react-router-dom";
import { useGetBannersUS } from "../../../../api/homePage";

const Breadcrumb = ({ title = "HNOSS", paths = [] }) => {
  const { data: banners = [] } = useGetBannersUS();
  const breadcrumbBanner = banners.find((b) => b.name === "breadcrumb");
  const backgroundImage = breadcrumbBanner?.value;
  return (
    <div
      className="breadcrumb"
      style={{
        backgroundImage: backgroundImage ? `url(${backgroundImage})` : "none",
      }}
    >
      <div className="breadcrumb_text">
        <h2>{title}</h2>
        <div className="breadcrumb_option">
          <ul>
            {paths.map((item, index) => (
              <li key={index} className={item.path ? "link" : "active"}>
                {item.path ? (
                  <Link to={item.path}>{item.name}</Link>
                ) : (
                  item.name
                )}
                {index < paths.length - 1 && " › "}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default memo(Breadcrumb);
