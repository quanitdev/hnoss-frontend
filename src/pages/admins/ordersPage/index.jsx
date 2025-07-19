// import { memo, useEffect, useState } from "react";
// import "./style.scss";

// const STATUS ={
//   ORDERED:{
//     key: "ORDERED",
//     label: "Đã đặt",
//     className : "orders_dropdown-item",
//   },
//   PREPARING:{
//     key: "PREPARING",
//     label: "Lên đơn",
//     className : "orders_dropdown-item",
//   },
//   DIVIVERED:{
//     key: "DIVIVERED",
//     label: "Đã giao hàng",
//     className : "orders_dropdown-item",
//   },
//   CANCELLED:{
//     key: "CANCELLED",
//     label: "Hủy đơn hàng",
//     className : "orders_dropdown-item orders_dropdown-item--danger",
//   },
// };

// const OrderAdPage = () => {
//   const orders =[
//     {
//       id :1,
//       total: 200000,
//       customerName: "Quyên",
//       date: new Date("2025-04-15"),
//       status : "Dang lên đơn hàng",
//     },

//     {
//       id :2,
//       total: 200000,
//       customerName: "Quyên",
//       date: new Date("2025-04-15"),
//       status : "Dang lên đơn hàng",
//     },
//     {
//       id :3,
//       total: 200000,
//       customerName: "Quyên",
//       date: new Date(),
//       status : "Dang lên đơn hàng",
//     },
//     {
//       id :4,
//       total: 200000,
//       customerName: "Quyên",
//       date: new Date(),
//       status : "Dang lên đơn hàng",
//     },
//     {
//       id :5,
//       total: 200000,
//       customerName: "Quyên",
//       date: new Date(),
//       status : "Dang lên đơn hàng",
//     },
//   ];
//   const [activedDropdown, setActivedDropdown]= useState(null);

// useEffect(() => { 
//     const handleClickOutside = (event) =>{
//             const isDropdown = event.target.closest(".orders_dropdown");
//             if(!isDropdown){
//               setActivedDropdown(null);
//             }
//           };

//           document.addEventListener("mousedown",handleClickOutside);
//           return () =>   document.removeEventListener("mousedown",handleClickOutside);
// },[]);
//   return (
//     <div className="container">
//     <div className="orders">
//       <h2>Quản lí đơn hàng</h2>

//       <div className="orders_content">
//         <table className="orders_table">
//           <thead>
//             <tr>
//               <th>Mã đơn hàng</th>
//               <th>Tổng đơn</th>
//               <th>Khách hàng</th>
//               <th>Ngày đặt</th>
//               <th>Trạng thái</th>
//             </tr>
//             </thead>
//           <tbody>
//             {
//               orders.map((item, i) => (
//                 <tr key={i}>
//                 <td>
//                   <span>{item.id}</span>
//                 </td>
//                 <td>{item.total.toLocaleString()} ₫</td>
//                 <td>{item.customerName}</td>
//                 <td>{new Date(item.date).toLocaleDateString()}</td>
//                 <td>
//                 <div className="orders_dropdown">
//   <button className={`orders_action-button`}
//   onClick={() => setActivedDropdown(item.id)}
//   >
//     Đã đặt
//     <span className="arrow">▼</span>
//   </button>
//   {activedDropdown === item.id && (
//     <div className="orders_dropdown-menu">
//       {Object.values(STATUS).map((status) => (
//         <button
//           key={status.key}
//           className= {status.className}
//           onClick={() => setActivedDropdown(null)}
//         >
//           {status.label}
//         </button>
//       ))}
//     </div>
//   )}
// </div>
//                   </td>
//               </tr>
//               ))}
//           </tbody>

//         </table>
//       </div>

//       <div className="orders_footer">
//   <div className="orders_pagination">
//     <div className="orders_page-numbers">
//       <button className="orders_page-btn">+</button>
//       <button className="orders_page-btn orders_page-btn--active">
//         1
//       </button>
//       <button className="orders_page-btn">2</button>
//       <button className="orders_page-btn">3</button>
//       <button className="orders_page-btn">4</button>
//       <button className="orders_page-btn">5</button>
//       <button className="orders_page-btn">-</button>
//     </div>
//   </div>
// </div>

//     </div>
//   </div>
//   );
// };

// export default memo(OrderAdPage);


import { useEffect, useState } from "react";
import axios from "axios";
import "./style.scss";

const AdminOrdersPage = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    axios.get("https://hnoss-backend.onrender.com/api/order")
      .then((res) => setOrders(res.data))
      .catch((err) => console.error("Lỗi lấy đơn hàng:", err));
  }, []);

  const handleStatusChange = (id, status) => {
    axios.put(`https://hnoss-backend.onrender.com/api/order/update-status/${id}`, { status })
      .then(() => {
        setOrders(prev =>
          prev.map(order => order.id === id ? { ...order, status } : order)
        );
      });
  };

  return (
    <div className="admin-order">
      <h2>📦 Quản lý đơn hàng</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Người nhận</th>
            <th>Địa chỉ</th>
            <th>Tổng tiền</th>
            <th>Trạng thái</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {orders.map(order => (
            <tr key={order.id}>
              <td>{order.id}</td>
              <td>{order.receiver_name}</td>
              <td>{order.shipping_address}</td>
              <td>{order.total_pay.toLocaleString()}đ</td>
              <td>{order.status}</td>
              <td>
                <select
                  value={order.status}
                  onChange={(e) => handleStatusChange(order.id, e.target.value)}
                >
                  <option value="pending">Chờ xác nhận</option>
                  <option value="processing">Đang xử lý</option>
                  <option value="shipped">Đã giao</option>
                  <option value="delivered">Hoàn tất</option>
                  <option value="cancelled">Đã huỷ</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminOrdersPage;
