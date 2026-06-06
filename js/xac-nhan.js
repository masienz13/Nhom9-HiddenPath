(function () {
    const raw = sessionStorage.getItem('hiddenpath_booking');
    const data = raw ? JSON.parse(raw) : null;

    const methodLabels = {
      transfer: 'Chuyển khoản ngân hàng',
      momo: 'Ví MoMo',
      cod: 'Thanh toán tiền mặt',
    };

    if (!data) {
      document.getElementById('xnIcon').textContent = '⚠️';
      document.getElementById('xnTitle').textContent = 'Không tìm thấy thông tin đặt tour';
      document.getElementById('xnDesc').textContent = 'Vui lòng quay lại trang đặt tour.';
      document.getElementById('xnBanner').style.background = 'linear-gradient(135deg,#7f5c1a,#a07020)';
      return;
    }

    // Banner
    if (data.method === 'transfer' || data.method === 'momo') {
      document.getElementById('xnIcon').textContent = '✅';
      document.getElementById('xnTitle').textContent = 'Thanh toán thành công!';
      document.getElementById('xnDesc').textContent = 'Email xác nhận đã được gửi tới ' + data.email + '.';
    } else {
      // cod
      document.getElementById('xnIcon').textContent = '🎉';
      document.getElementById('xnTitle').textContent = 'Đặt tour thành công!';
      document.getElementById('xnDesc').textContent = 'Nhân viên sẽ gọi tới ' + data.phone + ' trong vòng 2 giờ làm việc.';
    }
    document.getElementById('xnBookingId').textContent = data.bookingId;

    // Tour info
    document.getElementById('xnTourName').textContent = data.tourName || '--';
    document.getElementById('xnDate').textContent = data.selectedDate || 'Chưa xác định';
    document.getElementById('xnNum').textContent = data.numPeople + ' người';
    document.getElementById('xnUnit').textContent = data.unitPrice || '--';
    document.getElementById('xnMethod').textContent = methodLabels[data.method] || data.method;

    // Contact
    document.getElementById('xnName').textContent = data.name;
    document.getElementById('xnPhone').textContent = data.phone;
    document.getElementById('xnEmail').textContent = data.email;

    // Price summary
    document.getElementById('xnTotal').textContent = data.total;
    document.getElementById('xnDeposit').textContent = data.deposit;
    if (data.method === 'transfer' || data.method === 'momo') {
      document.getElementById('xnDepositRow').style.display = 'none';
    }

    // Bank transfer card
    if (data.method === 'transfer') {
      document.getElementById('xnBankCard').style.display = '';
      document.getElementById('xnBankAmount').textContent = data.total;
      document.getElementById('xnBankNote').textContent = 'HIDDENPATH ' + data.bookingId;
    }

    // Next steps
    const stepsMap = {
      transfer: [
        { icon: '🏦', title: 'Thực hiện chuyển khoản', desc: 'Chuyển khoản ' + data.total + ' với nội dung HIDDENPATH ' + data.bookingId + '.' },
        { icon: '📞', title: 'Nhân viên gọi xác nhận', desc: 'Trong vòng 2 giờ làm việc, nhân viên sẽ gọi tới ' + data.phone + ' để xác nhận đã nhận thanh toán.' },
        { icon: '📧', title: 'Nhận email xác nhận', desc: 'Email xác nhận chi tiết lịch trình gửi tới ' + data.email + ' sau khi đối chiếu giao dịch.' },
        { icon: '🏔', title: 'Chuẩn bị lên đường!', desc: 'Danh sách đồ cần mang và nhắc nhở sẽ gửi 3 ngày trước khởi hành.' },
      ],
      momo: [
        { icon: '📱', title: 'Kiểm tra xác nhận MoMo', desc: 'Bạn sẽ nhận thông báo qua ví MoMo và email trong vài phút.' },
        { icon: '📧', title: 'Nhận email xác nhận', desc: 'Email chi tiết đặt tour gửi tới ' + data.email + ' sau khi giao dịch thành công.' },
        { icon: '🏔', title: 'Chuẩn bị lên đường!', desc: 'Danh sách đồ cần mang và nhắc nhở sẽ gửi 3 ngày trước khởi hành.' },
      ],
      cod: [
        { icon: '📞', title: 'Nhân viên gọi xác nhận', desc: 'Nhân viên sẽ gọi tới ' + data.phone + ' để hẹn lịch nộp tiền mặt.' },
        { icon: '💵', title: 'Nộp tiền khi gặp nhân viên', desc: 'Thanh toán tại văn phòng hoặc điểm tập kết trước ngày khởi hành.' },
        { icon: '🏔', title: 'Chuẩn bị lên đường!', desc: 'Chúng tôi sẽ nhắc nhở và gửi danh sách đồ cần mang trước 3 ngày.' },
      ],
    };

    const steps = stepsMap[data.method] || stepsMap['cod'];
    document.getElementById('xnSteps').innerHTML = steps.map(s => `
      <li class="xn-step">
        <span class="xn-step-icon">${s.icon}</span>
        <div><strong>${s.title}</strong><span>${s.desc}</span></div>
      </li>`).join('');

    // Clear after 10 min
    setTimeout(() => sessionStorage.removeItem('hiddenpath_booking'), 10 * 60 * 1000);
  })();

  function copyText(text, btn) {
    navigator.clipboard.writeText(text).then(() => {
      const o = btn.textContent; btn.textContent = '✓ Đã copy';
      setTimeout(() => btn.textContent = o, 2000);
    });
  }
  function copyNote(btn) {
    copyText(document.getElementById('xnBankNote').textContent, btn);
  }