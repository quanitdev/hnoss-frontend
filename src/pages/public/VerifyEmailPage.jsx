import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ROUTERS } from "../../utils/router";
import "./style.scss";

const VerifyEmailPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [status, setStatus] = useState(null);
  const [email, setEmail] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const isSuccess = params.get("success") === "true";
    const emailFromUrl = params.get("email") || "";

    setStatus(isSuccess);
    setEmail(emailFromUrl);

    if (isSuccess) {
      setTimeout(() => {
        navigate(ROUTERS.ACCOUNT.LOGIN, {
          state: { email: emailFromUrl },
        });
      }, 2000);
    }
  }, [location, navigate]);

  return (
    <div className="verify-email-container">
      {status === null && <p>Đang xác thực tài khoản...</p>}

      {status === false && (
        <div className="error">
          <h2>Xác thực thất bại ❌</h2>
          <p>Liên kết không hợp lệ hoặc đã hết hạn.</p>
        </div>
      )}

      {status === true && (
        <div className="success">
          <h2>Xác thực thành công ✅</h2>
          <p>
            {email ? (
              <>
                Tài khoản <strong>{email}</strong> đã được xác thực.
                <br />
                Bạn sẽ được chuyển hướng đến trang đăng nhập sau vài giây...
              </>
            ) : (
              <>Bạn sẽ được chuyển hướng đến trang đăng nhập sau vài giây...</>
            )}
          </p>
        </div>
      )}
    </div>
  );
};

export default VerifyEmailPage;
