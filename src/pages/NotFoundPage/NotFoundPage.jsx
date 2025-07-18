import React from "react";
import { useNavigate } from "react-router-dom";
import "./style.scss"; // Đảm bảo đã tạo file style.scss cùng thư mục

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="notfound-container">
      <h1>404</h1>
      <img
        src="https://cdn.dribbble.com/users/285475/screenshots/2083086/dribbble_1.gif"
        alt="404"
        className="notfound-img"
      />
      <h2>Look like you're lost</h2>
      <p>the page you are looking for not available!</p>
      <button className="link_404" onClick={() => navigate("/")}>
        Go to Home
      </button>
    </div>
  );
};

export default NotFoundPage;