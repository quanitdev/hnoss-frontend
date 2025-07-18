import React from "react";
import { ROUTERS } from "../../../utils/router";
import Breadcrumb from "../theme/breadcrumb";
import "./Shipping.scss";

const ShippingPolicyPage = () => (
  <>
    <Breadcrumb
      title="Chính sách giao hàng"
      paths={[
        { name: "Trang chủ", path: ROUTERS.USER.HOME },
        { name: "Chính sách giao hàng" },
      ]}
    />
    <div className="payment-policy-container">
      <div className="payment-policy-content">
        <h2>Chính sách giao hàng</h2>
        <hr />
        <b>a) Các phương thức giao hàng</b>
        <p>Chúng tôi sử dụng 02 phương thức giao hàng:</p>
        <p>
          – Khách hàng mua trực tiếp hàng tại cửa hàng của chúng tôi
          <br />– Ship hàng qua các đơn vị vận chuyển
        </p>
        <b>b) Thời hạn ước tính cho việc giao hàng</b>
        <p>
          Thời gian giao hàng thường trong khoảng từ 3-5 ngày kể từ ngày chốt
          đơn hàng hoặc theo thỏa thuận với khách khi đặt hàng.
          <br />
          Thông thường sau khi nhận được thông tin đặt hàng chúng tôi sẽ xử lý
          đơn hàng trong vòng 24h và phản hồi lại thông tin cho khách hàng về
          việc thanh toán và giao nhận.
        </p>
        <p>
          Thông thường sau khi nhận được thông tin đặt hàng chúng tôi sẽ xử lý
          đơn hàng trong vòng 24h và phản hồi lại thông tin cho khách hàng về
          việc thanh toán và giao nhận.
        </p>
        <p>
          Tuy nhiên, cũng có trường hợp việc giao hàng kéo dài hơn nhưng chỉ xảy
          ra trong những tình huống bất khả kháng như sau:
        </p>
        <ul>
          <li>
            Nhân viên chúng tôi liên lạc với khách hàng qua điện thoại không
            được nên không thể giao hàng.
          </li>
          <li>Địa chỉ giao hàng bạn cung cấp không chính xác hoặc khó tìm.</li>
          <li>
            Số lượng đơn hàng tăng đột biến khiến việc xử lý đơn hàng bị chậm.
          </li>
          <li>
            Đối tác cung cấp hàng chậm hơn dự kiến khiến việc giao hàng bị chậm
            lại hoặc đối tác vận chuyển giao hàng bị chậm
          </li>
        </ul>
        <p>
          Về phí vận chuyển, chúng tôi sử dụng dịch vụ vận chuyển ngoài nên cước
          phí vận chuyển sẽ được tính theo phí của các đơn vị vận chuyển tuỳ vào
          vị trí và khối lượng của đơn hàng, khi liên hệ xác nhận đơn hàng với
          khách sẽ báo mức phí cụ thể cho khách hàng.
        </p>
        <b>c) Các giới hạn về mặt địa lý cho việc giao hàng</b>
        <p>
          Riêng khách tỉnh có nhu cầu mua số lượng lớn hoặc khách buôn sĩ nếu có
          nhu cầu mua sản phẩm, chúng tôi sẽ nhờ dịch vụ giao nhận của các công
          ty vận chuyển và phí sẽ được tính theo phí của các đơn vị cung cấp
          dịch vụ vận chuyển hoặc theo thỏa thuận hợp đồng giữa 2 bên.
        </p>
        <b>
          d) Phân định trách nhiệm của thương nhân, tổ chức cung ứng dịch vụ
          logistics về cung cấp chứng từ hàng hóa trong quá trình giao nhận:
        </b>{" "}
        bên <b>minde.vn</b> chịu trách nhiệm giao hóa đơn bán hàng đến khách
        hàng trong quá trình giao nhận
        <br />
        <b>Nghĩa vụ của bên vận chuyển</b>
        <ul>
          <li>
            Bên vận chuyển có trách nhiệm cung cấp chứng từ hàng hóa khi giao
            hàng từ bên thuê vận chuyển.
          </li>
          <li>
            Bảo đảm vận chuyển hàng hóa đầy đủ, an toàn đến địa điểm đã định,
            theo đúng thời hạn.
          </li>
          <li>Giao hàng hóa cho người có quyền nhận.</li>
          <li>
            Chịu chi phí liên quan đến việc chuyên chở hàng hóa, trừ trường hợp
            có thỏa thuận khác.
          </li>
          <li>Mua bảo hiểm trách nhiệm dân sự theo quy định của pháp luật.</li>
          <li>
            Bồi thường thiệt hại cho bên thuê vận chuyển trong trường hợp bên
            vận chuyển để mất, hư hỏng hàng hóa, trừ trường hợp có thỏa thuận
            khác hoặc pháp luật có quy định khác.
          </li>
        </ul>
        <b>Quyền của bên vận chuyển</b>
        <ul>
          <li>
            Kiểm tra sự xác thực của hàng hóa, của vận đơn hoặc chứng từ vận
            chuyển tương đương khác.
          </li>
          <li>
            Từ chối vận chuyển hàng hóa không đúng với loại hàng hóa đã thỏa
            thuận trong hợp đồng.
          </li>
          <li>
            Yêu cầu bên thuê vận chuyển thanh toán đủ cước phí vận chuyển đúng
            thời hạn.
          </li>
          <li>
            Từ chối vận chuyển hàng hóa cấm giao dịch, hàng hóa có tính chất
            nguy hiểm, độc hại
          </li>
        </ul>
        <b>Nghĩa vụ của bên thuê vận chuyển</b>
        <ul>
          <li>
            Trả đủ tiền cước phí vận chuyển cho bên vận chuyển theo đúng thời
            hạn, phương thức đã thỏa thuận.
          </li>
          <li>
            Cung cấp thông tin cần thiết liên quan đến hàng hóa vận chuyển để
            bảo đảm an toàn cho hàng hóa vận chuyển.
          </li>
          <li>
            Trông coi hàng hóa trên đường vận chuyển, nếu có thỏa thuận. Trường
            hợp bên thuê vận chuyển trông coi vận chuyển mà tài sản bị mất, hư
            hỏng thì không được bồi thường.
          </li>
        </ul>
        <b>Quyền của bên thuê vận chuyển</b>
        <ul>
          <li>
            Yêu cầu bên vận chuyển chuyên chở hàng hóa đến đúng địa điểm, thời
            điểm đã thỏa thuận.
          </li>
          <li>
            Trực tiếp hoặc chỉ định người thứ ba nhận lại hàng hóa đã thuê vận
            chuyển.
          </li>
        </ul>
        <b>
          e) Trách nhiệm về trường hợp hàng bị hư hỏng do quá trình vận chuyển
        </b>
        <p>
          Về việc cung cấp chứng từ hàng hóa trong quá trình giao nhận.
          <br />
          Đối với hàng hóa bị hư hỏng do quá trình vận chuyển dù là đơn hàng do
          chính cửa hàng vận chuyển hay do bên thứ 3 vận chuyển thì chúng tôi sẽ
          là bên đứng ra chịu trách nhiệm giải quyết vấn đề cho khách hàng.
          <br />
          Khách hàng có quyền từ chối nhận sản phẩm và yêu cầu đổi trả theo quy
          định “ đổi trả hoàn phí” còn mọi vấn đề phát sinh chúng tôi sẽ làm
          việc lại với đối tác vận chuyển để giải quyết đến bù cho đơn hàng theo
          thỏa thuận hợp tác giữa công ty với đối tác thứ 3 cung cấp dịch vụ vận
          chuyển.
        </p>
        <p>
          <b>Lưu ý:</b> Trường hợp phát sinh chậm trễ trong việc giao hàng chúng
          tôi sẽ thông tin kịp thời cho khách hàng và khách hàng có thể lựa chọn
          giữa việc Hủy hoặc tiếp tục chờ hàng.
        </p>
      </div>
    </div>
  </>
);

export default ShippingPolicyPage;
