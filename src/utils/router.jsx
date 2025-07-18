export const ADMIN_PATH = "/admins";
export const ACCOUNT_PATH = "/account";
export const USER_PATH = "/pages";

export const ROUTERS = {
  USER: {
    HOME: "/", // đừng để ""
    PROFILE: `${USER_PATH}/thong-tin-ca-nhan`,
    PRODUCTS: `${USER_PATH}/san-pham`,
    PRODUCT: `${USER_PATH}/san-pham-chi-tiet/:id`,
    SHOPPING_CART: `${USER_PATH}/gio-hang`,
    CHECKOUT: `${USER_PATH}/thanh-toan`,
    VERIFY_EMAIL: `/xac-thuc-email`,
    ME_ORDERS: `${USER_PATH}/don-hang-cua-toi`,
    RETURN: `${USER_PATH}/chinh-sach-kiem-hang`,
    SETTING: `${USER_PATH}/cai-dat`,
    ORDER_SUCCESS: "/order-success",
    CONTACT: `${USER_PATH}/lien-he`,
    ABOUT: `${USER_PATH}/gioi-thieu`,
    PAYMENT: `${USER_PATH}/chinh-sach-thanh-toan`,
    SHIPPING: `${USER_PATH}/chinh-sach-giao-hang`,
  },
  ADMIN: {
    ORDERS: `${ADMIN_PATH}/doarhboard`,
    ORDERS_INVOICE: `${ADMIN_PATH}/order-invoice/:id`,
  },

  ACCOUNT: {
    LOGIN: `${ACCOUNT_PATH}/login`,
    REGISTER: `${ACCOUNT_PATH}/register`,
  },
};
