class FooterPlaceholder extends HTMLElement {
  connectedCallback() {
    const basePath = window.location.pathname.includes("/tours/") ? "../" : "";
    this.innerHTML = `
      <footer class="site-footer">
        <div class="footer-inner">
          <section class="footer-brand">
            <h2>Hidden Path</h2>
            <p>Mountain Tours Vietnam</p>
            <strong>Công ty Cổ phần Hidden Path</strong>
            <p>Địa chỉ: Số 27, Ngụy Như Kon Tum, Thanh Xuân, Hà Nội</p>
            <p>Văn phòng: Hà Thành Plaza, 102 Thái Thịnh, Đống Đa, Hà Nội</p>
            <p>Email: hiddenpathbooking@gmail.com</p>
            <p>Tổng đài dịch vụ: 1900 2869</p>
            <p>Hotline đặt tour: 0345846390</p>
            <div class="social-list" aria-label="Mạng xã hội">
              <a href="#" aria-label="Facebook"><img src="${basePath}img/fb.png" alt="fb"></a>
              <a href="#" aria-label="Instagram"><img src="${basePath}img/ins.png" alt="ig"></a>
              <a href="#" aria-label="YouTube"><img src="${basePath}img/yt.png" alt="yt"></a>
              <a href="#" aria-label="TikTok"><img src="${basePath}img/tiktok.png" alt="tiktok"></a>
            </div>
          </section>

          <section>
            <h3>Điều khoản - Chính sách</h3>
            <a href="${basePath}huong-dan-dat-tour.html">Hướng dẫn đặt tour</a>
            <a href="${basePath}chinh-sach-hoan-huy.html">Chính sách hoàn hủy</a>
            <a href="${basePath}hinh-thuc-thanh-toan.html">Hình thức thanh toán</a>
            <a href="#">Chính sách bảo mật</a>
          </section>

          <section>
            <h3>Thông tin hữu ích</h3>
            <a href="${basePath}ve-chung-toi.html">Về chúng tôi</a>
            <a href="${basePath}lien-he.html">Liên hệ</a>
            <a href="${basePath}blog.html">Tin tức</a>
          </section>

          <section class="footer-mountains">
            <h3>Các cung núi</h3>
            <div class="footer-mountain-list">
              <a href="${basePath}tours/fansipan.html">Fansipan - 3143m</a>
              <a href="${basePath}tours/khang-su-van.html">Khang Su Văn - 3012m</a>
              <a href="${basePath}tours/ky-quan-san.html">Ky Quan San - 3046m</a>
              <a href="${basePath}tours/lao-than.html">Lảo Thẩn - 2860m</a>
              <a href="${basePath}tours/ngu-chi-son.html">Ngũ Chỉ Sơn - 2858m</a>
              <a href="${basePath}tours/nhiu-co-san.html">Nhìu Cồ San - 2965m</a>
              <a href="${basePath}tours/phu-sa-phin.html">Phu Sa Phìn - 2868m</a>
              <a href="${basePath}tours/pu-ta-leng.html">Pu Ta Leng - 3049m</a>
              <a href="${basePath}tours/ta-lien-son.html">Tả Liên Sơn - 2996m</a>
               <a href="${basePath}tours/nam-kang-ho-tao.html">Nam Kang Ho Tao - 2881m</a>
            </div>
          </section>
        </div>
      </footer>
    `;
  }
}

customElements.define("footer-placeholder", FooterPlaceholder);
