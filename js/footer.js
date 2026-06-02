class FooterPlaceholder extends HTMLElement {
  connectedCallback() {
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
              <a href="#" aria-label="Facebook"><img src="img/fb.png" alt="fb"></a>
              <a href="#" aria-label="Instagram"><img src="img/ins.png" alt="ig"></a>
              <a href="#" aria-label="YouTube"><img src="img/yt.png" alt="yt"></a>
              <a href="#" aria-label="TikTok"><img src="img/tiktok.png" alt="tiktok"></a>
            </div>
          </section>

          <section>
            <h3>Điều khoản - Chính sách</h3>
            <a href="#">Hướng dẫn đặt tour</a>
            <a href="#">Chính sách hoàn hủy</a>
            <a href="#">Hình thức thanh toán</a>
            <a href="#">Điều khoản website</a>
            <a href="#">Chính sách bảo mật</a>
          </section>

          <section>
            <h3>Thông tin hữu ích</h3>
            <a href="#">Về chúng tôi</a>
            <a href="#">Liên hệ</a>
            <a href="blog.html">Tin tức</a>
          </section>

          <section>
            <h3>Các cung núi</h3>
            <a href="#">Fansipan - 3143m</a>
            <a href="#">Pu Si Lung - 3083m</a>
            <a href="#">Ky Quan San - 3046m</a>
            <a href="#">Tả Liên Sơn - 2996m</a>
            <a href="#">Tả Chì Nhù - 2979m</a>
            <a href="#">Lảo Thẩn - 2860m</a>
          </section>
        </div>
      </footer>
    `;
  }
}

customElements.define("footer-placeholder", FooterPlaceholder);
