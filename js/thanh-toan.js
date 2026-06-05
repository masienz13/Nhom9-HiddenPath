(function(){
    /* ── STATE ── */
    let selectedTour = null;
    let numPeople    = 1;
    let selectedDate = null;
    let discount     = 0;
    let payMethod    = 'deposit';
    let qrGenerated  = { transfer: false, momo: false };

    const PROMO = { 'HIDDEN10': 0.10, 'TREKKING20': 0.20, 'NEWMEMBER': 0.15 };
    const METHOD_LABEL = {
      deposit:  'Đặt cọc 30% — Nhân viên gọi xác nhận',
      transfer: 'Chuyển khoản ngân hàng',
      momo:     'Ví MoMo',
      cod:      'Thanh toán tiền mặt',
    };

    /* ── INIT ── */
    const params  = new URLSearchParams(window.location.search);
    const tourId  = params.get('tour');

    function init() {
      const tours = window.hiddenPathTours || [];
      selectedTour = tours.find(t => t.id === tourId) || tours[0];
      if (!selectedTour) return;

      document.getElementById('tourSummaryImg').style.backgroundImage = `url('${selectedTour.image}')`;
      document.getElementById('tourSummaryName').textContent  = selectedTour.displayName;
      document.getElementById('tourSummaryLoc').textContent   = '📍 ' + selectedTour.location;
      document.getElementById('tourSummaryDur').textContent   = '⏱ ' + selectedTour.duration;
      document.getElementById('tourSummaryAlt').textContent   = '⛰ ' + selectedTour.altitude;
      document.getElementById('tourSummaryDiff').textContent  = selectedTour.difficulty;
      document.getElementById('summaryTourName').textContent  = selectedTour.displayName;
      document.getElementById('summaryUnitPrice').textContent = fmt(selectedTour.price);

      renderDates();
      updateSummary();
    }

    /* ── DATES ── */
    function renderDates() {
      const container = document.getElementById('dateOptions');
      const days = ['CN','T2','T3','T4','T5','T6','T7'];
      const base = new Date(2025, 6, 12);
      const dates = Array.from({length: 6}, (_, i) => {
        const d = new Date(base); d.setDate(base.getDate() + i * 7);
        return { label: `${d.getDate()}/${d.getMonth()+1}`, day: days[d.getDay()], slots: Math.floor(Math.random()*12) };
      });
      container.innerHTML = dates.map((d, i) => {
        const full = d.slots === 0, urgent = d.slots > 0 && d.slots <= 3;
        return `<div class="date-opt ${full?'sold-out':''} ${i===0&&!full?'selected':''}"
          data-date="${d.label}" onclick="${full?'':'selectDate(this)'}" title="${full?'Hết chỗ':''}">
          <span class="date-day">${d.day}</span>
          <span class="date-full">${d.label}</span>
          <span class="date-slots" style="color:${urgent?'#f97316':'inherit'}">${full?'Hết chỗ':'Còn '+d.slots+' chỗ'}</span>
        </div>`;
      }).join('');
      const first = container.querySelector('.date-opt:not(.sold-out)');
      if (first) selectedDate = first.dataset.date;
      updateSummary();
    }

    window.selectDate = function(el) {
      document.querySelectorAll('.date-opt').forEach(d => d.classList.remove('selected'));
      el.classList.add('selected');
      selectedDate = el.dataset.date;
      updateSummary();
    };

    /* ── COUNTER ── */
    document.getElementById('minusBtn').addEventListener('click', () => { if(numPeople>1){numPeople--;refreshCounter();} });
    document.getElementById('plusBtn').addEventListener('click',  () => { if(numPeople<12){numPeople++;refreshCounter();} });
    function refreshCounter() {
      document.getElementById('peopleCount').textContent   = numPeople;
      document.getElementById('minusBtn').disabled = numPeople <= 1;
      document.getElementById('plusBtn').disabled  = numPeople >= 12;
      updateSummary();
    }

    /* ── FORMAT ── */
    function fmt(n) { return Number(n).toLocaleString('vi-VN') + '₫'; }

    /* ── SUMMARY ── */
    function updateSummary() {
      if (!selectedTour) return;
      const base = selectedTour.price * numPeople;
      const disc = Math.round(base * discount);
      const total = base - disc;
      const dep   = Math.round(total * 0.3);

      document.getElementById('summaryPeople').textContent = numPeople + ' người';
      document.getElementById('summaryDate').textContent   = selectedDate || '--';
      document.getElementById('summaryTotal').textContent  = fmt(total);

      if (disc > 0) {
        document.getElementById('discountRow').style.display = '';
        document.getElementById('summaryDiscount').textContent = '-' + fmt(disc);
      } else {
        document.getElementById('discountRow').style.display = 'none';
      }

      // transfer notes
      const name  = document.getElementById('fullName').value.trim().split(' ').pop() || 'HoTen';
      const phone = document.getElementById('phone').value.trim() || 'SoDienThoai';
      const note  = `HP-${name}-${phone}`;

      ['depositNote','transferNote','momoNote'].forEach(id => {
        const el = document.getElementById(id); if(el) el.textContent = note;
      });
      const depositEl = document.getElementById('depositAmt');
      if (depositEl) depositEl.textContent = fmt(dep);
      const transferAmtEl = document.getElementById('transferAmt');
      if (transferAmtEl) transferAmtEl.textContent = fmt(total);
      const momoAmtEl = document.getElementById('momoAmt');
      if (momoAmtEl) momoAmtEl.textContent = fmt(total);

      // sidebar step2
      document.getElementById('cs-tour').textContent   = selectedTour.displayName;
      document.getElementById('cs-date').textContent   = selectedDate || '--';
      document.getElementById('cs-people').textContent = numPeople + ' người';
      document.getElementById('cs-unit').textContent   = fmt(selectedTour.price);
      document.getElementById('cs-total').textContent  = fmt(total);
      document.getElementById('cs-deposit').textContent = fmt(dep);
      document.getElementById('cs-method').textContent = METHOD_LABEL[payMethod];
      document.getElementById('cs-name').textContent   = document.getElementById('fullName').value || '--';
      document.getElementById('cs-phone').textContent  = document.getElementById('phone').value || '--';

      const isDeposit = payMethod === 'deposit';
      document.getElementById('cs-deposit-row').style.display = isDeposit ? '' : 'none';
      if (disc > 0) {
        document.getElementById('cs-discount-row').style.display = '';
        document.getElementById('cs-discount').textContent = '-' + fmt(disc);
      } else {
        document.getElementById('cs-discount-row').style.display = 'none';
      }

      const codPhoneEl = document.getElementById('codPhone');
      if (codPhoneEl) codPhoneEl.textContent = document.getElementById('phone').value || 'số điện thoại của bạn';

      return { total, dep, note };
    }

    document.getElementById('fullName').addEventListener('input', () => { updateSummary(); qrGenerated = {deposit:false,transfer:false,momo:false}; });
    document.getElementById('phone').addEventListener('input',    () => { updateSummary(); qrGenerated = {deposit:false,transfer:false,momo:false}; });

    /* ── PROMO ── */
    window.applyPromo = function() {
      const code = document.getElementById('promoInput').value.trim().toUpperCase();
      const res  = document.getElementById('promoResult');
      if (PROMO[code]) {
        discount = PROMO[code];
        res.className = 'promo-result promo-ok';
        res.textContent = `✅ Mã "${code}" — Giảm ${discount*100}%!`;
      } else {
        discount = 0;
        res.className = 'promo-result promo-err';
        res.textContent = `❌ Mã "${code}" không hợp lệ.`;
      }
      updateSummary();
      qrGenerated = {deposit:false,transfer:false,momo:false};
    };

    /* ── COPY ── */
    window.copyVal = function(text, btn) {
      navigator.clipboard.writeText(text).then(() => {
        btn.textContent = '✓ Đã copy';
        btn.classList.add('copied');
        setTimeout(() => { btn.textContent = 'Copy'; btn.classList.remove('copied'); }, 2000);
      });
    };

    /* ── QR GENERATION ── */
    function makeQR(elId, text, size) {
      const el = document.getElementById(elId);
      if (!el) return;
      el.innerHTML = '';
      new QRCode(el, { text: text || 'HIDDEN PATH', width: size||160, height: size||160, correctLevel: QRCode.CorrectLevel.M });
    }

    function generateQRs() {
      const vals = updateSummary();
      const { total, dep, note } = vals || {};
      const base  = selectedTour ? selectedTour.price * numPeople : 0;
      const disc  = Math.round(base * discount);
      const totalN = base - disc;
      const depN   = Math.round(totalN * 0.3);
      const n = document.getElementById('fullName').value.trim().split(' ').pop() || 'HoTen';
      const p = document.getElementById('phone').value.trim() || 'SoDienThoai';
      const noteStr = `HP-${n}-${p}`;

      // MB Bank QR format
      const vcbTransfer = `STK:0828861205|STN:CONG TY CP HIDDEN PATH|NH:MB Bank|ST:${totalN}|ND:${noteStr}`;
      const momoStr     = `MOMO:0345846390|STN:HIDDEN PATH|ST:${totalN}|ND:${noteStr}`;

      if (!qrGenerated.transfer) { makeQR('qrTransfer', vcbTransfer, 160); qrGenerated.transfer = true; }
      if (!qrGenerated.momo)     { makeQR('qrMomo',     momoStr,     160); qrGenerated.momo     = true; }
    }

    /* ── METHOD SWITCH ── */
    window.switchMethod = function(method, btn) {
      payMethod = method;
      document.querySelectorAll('.pay-tab').forEach(t => t.classList.remove('active'));
      btn.classList.add('active');
      document.querySelectorAll('.pay-panel').forEach(p => p.classList.remove('active'));
      document.getElementById('panel-' + method).classList.add('active');
      updateSummary();
    };

    /* ── VALIDATE ── */
    function validateStep1() {
      let ok = true;
      const show = (id, v) => document.getElementById(id).classList.toggle('show', v);
      const name  = document.getElementById('fullName');
      const phone = document.getElementById('phone');
      const email = document.getElementById('email');
      const terms = document.getElementById('agreeTerms');

      if (!name.value.trim() || name.value.trim().length < 2)
        { name.classList.add('error'); show('errName',true); ok=false; }
      else { name.classList.remove('error'); show('errName',false); }

      if (!phone.value.trim() || !/^[0-9]{9,11}$/.test(phone.value.replace(/\s/g,'')))
        { phone.classList.add('error'); show('errPhone',true); ok=false; }
      else { phone.classList.remove('error'); show('errPhone',false); }

      if (!email.value.trim() || !email.value.includes('@'))
        { email.classList.add('error'); show('errEmail',true); ok=false; }
      else { email.classList.remove('error'); show('errEmail',false); }

      if (!terms.checked) { show('errTerms',true); ok=false; }
      else { show('errTerms',false); }

      if (!selectedDate) { alert('Vui lòng chọn ngày khởi hành.'); ok=false; }
      return ok;
    }

    /* ── STEP NAVIGATION ── */
    window.goToStep2 = function() {
      if (!validateStep1()) return;

      // Activate step 2 UI
      document.getElementById('panelStep1').classList.remove('active');
      document.getElementById('panelStep2').classList.add('active');

      document.getElementById('step1').classList.remove('active');
      document.getElementById('step1').classList.add('done');
      document.getElementById('step1').querySelector('.step-num').textContent = '✓';
      document.getElementById('step2').classList.add('active');

      updateSummary();
      setTimeout(generateQRs, 100); // generate QRs after render
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    window.goBack = function() {
      document.getElementById('panelStep2').classList.remove('active');
      document.getElementById('panelStep1').classList.add('active');

      document.getElementById('step2').classList.remove('active');
      document.getElementById('step1').classList.remove('done');
      document.getElementById('step1').classList.add('active');
      document.getElementById('step1').querySelector('.step-num').textContent = '1';
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    /* ── SUBMIT ── */
    window.submitBooking = function() {
      const btn = document.getElementById('btnConfirm');
      btn.disabled = true;
      btn.textContent = '⏳ Đang gửi xác nhận...';

      const base  = selectedTour ? selectedTour.price * numPeople : 0;
      const disc  = Math.round(base * discount);
      const total = base - disc;
      const dep   = Math.round(total * 0.3);

      const methodLabel = {
        transfer: 'Chuyển khoản ngân hàng',
        momo:     'Ví MoMo',
        cod:      'Thanh toán tiền mặt',
      };

      const bookingData = {
        bookingId:    'HP-' + Math.floor(100000 + Math.random()*900000),
        method:       payMethod,
        tourId:       selectedTour ? selectedTour.id : '',
        tourName:     selectedTour ? selectedTour.displayName : '',
        name:         document.getElementById('fullName').value,
        phone:        document.getElementById('phone').value,
        email:        document.getElementById('email').value,
        total:        fmt(total),
        deposit:      fmt(dep),
        unitPrice:    selectedTour ? fmt(selectedTour.price) : '--',
        numPeople,
        selectedDate: selectedDate || '',
      };

      const customerEmail = document.getElementById('email').value.trim();

      // Gửi email xác nhận qua EmailJS
      const sendEmail = customerEmail
        ? emailjs.send('service_wkjxt9v', 'template_dujlt8p', {
            to_email:        customerEmail,
            customer_name:   bookingData.name,
            customer_phone:  bookingData.phone,
            tour_name:       bookingData.tourName,
            departure_date:  bookingData.selectedDate || 'Chưa chọn',
            num_people:      bookingData.numPeople,
            total_amount:    bookingData.total + 'đ',
            payment_method:  methodLabel[payMethod] || payMethod,
          })
        : Promise.resolve();

      sendEmail
        .then(() => {
          sessionStorage.setItem('hiddenpath_booking', JSON.stringify(bookingData));
          window.location.href = 'xac-nhan.html';
        })
        .catch((err) => {
          console.warn('EmailJS error:', err);
          // Vẫn chuyển trang dù gửi mail thất bại
          sessionStorage.setItem('hiddenpath_booking', JSON.stringify(bookingData));
          window.location.href = 'xac-nhan.html';
        });
    };

    init();
  })();