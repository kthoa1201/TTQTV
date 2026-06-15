/* ==========================================================================
   script.js - Bộ Điều Khiển Tính Năng Landing Page 2026 (Bản chuẩn hóa)
   ========================================================================== */

// 1. CHỨC NĂNG TRƯỢT MƯỢT (SMOOTH SCROLL TO SECTION)
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ behavior: "smooth" });
    }
}

// 2. CHỨC NĂNG SLIDER BAR (CAROUSEL) CHẠY ẢNH TỰ ĐỘNG
let currentSlide = 0;
const totalSlides = 3;
const wrapper = document.getElementById("sliderWrapper");

function moveSlide(direction) {
    currentSlide += direction;
    if (currentSlide >= totalSlides) {
        currentSlide = 0;
    } else if (currentSlide < 0) {
        currentSlide = totalSlides - 1;
    }
    if (wrapper) {
        wrapper.style.transform = `translateX(-${currentSlide * 33.333}%)`;
    }
}

// Tự động trượt ảnh sau mỗi 4 giây
setInterval(() => {
    moveSlide(1);
}, 4000);

// 3. TỰ ĐỘNG TẠO NGÀY TƯƠNG LAI ĐỂ ĐỒNG HỒ ĐẾM NGƯỢC LUÔN CHẠY
let targetDate = new Date();
targetDate.setDate(targetDate.getDate() + 15); // Tự động lấy ngày hiện tại cộng thêm 15 ngày
const targetTime = targetDate.getTime();

function updateCountdown() {
    const now = new Date().getTime();
    const difference = targetTime - now;

    // Nếu thời gian kết thúc, dừng đồng hồ
    if (difference < 0) {
        clearInterval(countdownInterval);
        return;
    }

    const d = Math.floor(difference / (1000 * 60 * 60 * 24));
    const h = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const m = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const s = Math.floor((difference % (1000 * 60 ?? 1000)) / 1000);

    // Gán dữ liệu số vào giao diện HTML nếu phần tử tồn tại
    if (document.getElementById("days")) {
        document.getElementById("days").innerText = d < 10 ? "0" + d : d;
        document.getElementById("hours").innerText = h < 10 ? "0" + h : h;
        document.getElementById("minutes").innerText = m < 10 ? "0" + m : m;
        document.getElementById("seconds").innerText = s < 10 ? "0" + s : s;
    }
}
// Chạy chu kỳ cập nhật mỗi 1 giây
const countdownInterval = setInterval(updateCountdown, 1000);
updateCountdown();

// 4. XỬ LÝ ĐĂNG KÝ FORM (FORM VALIDATION)
const landingForm = document.getElementById("landingForm");
if (landingForm) {
    landingForm.addEventListener("submit", function (e) {
        e.preventDefault(); // Chặn tải lại trang mặc định
        let valid = true;

        // Kiểm tra Họ Tên
        const name = document.getElementById("name");
        const nameErr = document.getElementById("nameErr");
        if (name && name.value.trim() === "") {
            nameErr.style.display = "block";
            valid = false;
        } else if (nameErr) {
            nameErr.style.display = "none";
        }

        // Kiểm tra Số Điện Thoại (10 số VN)
        const phone = document.getElementById("phone");
        const phoneErr = document.getElementById("phoneErr");
        const phoneRegex = /^(0[3|5|7|8|9])+([0-9]{8})$/;
        if (phone && !phoneRegex.test(phone.value.trim())) {
            phoneErr.style.display = "block";
            valid = false;
        } else if (phoneErr) {
            phoneErr.style.display = "none";
        }

        // Kiểm tra Email
        const email = document.getElementById("email");
        const emailErr = document.getElementById("emailErr");
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (email && !emailRegex.test(email.value.trim())) {
            emailErr.style.display = "block";
            valid = false;
        } else if (emailErr) {
            emailErr.style.display = "none";
        }

        // Nếu hợp lệ thông tin
        if (valid) {
            alert("Hệ thống đã ghi nhận thông tin đăng ký thạc sĩ thành công! Ban tư vấn tuyển sinh sẽ chủ động liên hệ lại bạn sớm nhất.");
            this.reset(); // Xóa trống Form
        }
    });
}

// 5. XỬ LÝ ĐÓNG/MỞ KHỐI FAQS (ACCORDION)
function toggleFaq(element) {
    const faqItem = element.parentElement;
    const isActive = faqItem.classList.contains('active');
    
    // Đóng tất cả các mục FAQ khác lại
    document.querySelectorAll('.faq-item').forEach(item => {
        item.classList.remove('active');
    });
    
    // Nếu mục vừa ấn chưa mở thì mở nó ra
    if (!isActive) {
        faqItem.classList.add('active');
    }
}

// 6. QUẢN LÝ SỰ KIỆN CUỘN TRANG (Gộp chung hiệu ứng Xuất hiện & Nút Back to Top)
const backToTopBtn = document.getElementById("backToTop");

function handleScrollEffects() {
    // --- Phần A: Hiệu ứng xuất hiện nội dung (Reveal on Scroll) ---
    const reveals = document.querySelectorAll("section");
    const windowHeight = window.innerHeight;
    const elementVisible = 100;

    reveals.forEach((reveal) => {
        const elementTop = reveal.getBoundingClientRect().top;
        if (elementTop < windowHeight - elementVisible) {
            reveal.classList.add("reveal"); 
            reveal.classList.add("active"); 
        }
    });

    // --- Phần B: Điều khiển nút Back To Top xuất hiện sát ĐÁY TRANG ---
    if (backToTopBtn) {
        const totalPageHeight = document.documentElement.scrollHeight;
        const currentViewHeight = window.innerHeight;
        const scrolledDistance = window.scrollY || document.documentElement.scrollTop;

        // Khi người dùng cách đáy trang dưới 400px (đang ở Form / Footer), nút hiện ra
        if (totalPageHeight - (scrolledDistance + currentViewHeight) < 400) {
            backToTopBtn.classList.add("show");
        } else {
            backToTopBtn.classList.remove("show");
        }
    }
}

// Lắng nghe một sự kiện cuộn duy nhất để tối ưu hiệu năng trình duyệt
window.addEventListener("scroll", handleScrollEffects);

// Chạy kiểm tra ngay khi vừa tải trang xong
handleScrollEffects();

if (backToTopBtn) {
    // 1. LẮNG NGHE SỰ KIỆN CUỘN CHUỘT ĐỂ ẨN/HIỆN NÚT CHÍNH XÁC KHI CHẠM ĐÁY
    window.addEventListener("scroll", () => {
        const totalPageHeight = document.documentElement.scrollHeight;
        const currentViewHeight = window.innerHeight;
        const scrolledDistance = window.scrollY || document.documentElement.scrollTop;

        // Tính toán khoảng cách chạm đáy trang (cách đáy dưới 400px thì hiện)
        if (totalPageHeight - (scrolledDistance + currentViewHeight) < 400) {
            backToTopBtn.classList.add("show");
        } else {
            backToTopBtn.classList.remove("show");
        }
    });

    // 2. KÍCH HOẠT SỰ KIỆN CLICK ĐỂ CUỘN MƯỢT LÊN ĐẦU TRANG
    backToTopBtn.addEventListener("click", (e) => {
        e.preventDefault(); // Ngăn chặn hành vi mặc định của thẻ/nút
        window.scrollTo({
            top: 0,
            behavior: "smooth" // Hiệu ứng cuộn mượt mà không bị khựng
        });
    });
    if (backToTopBtn) 
    {
      backToTopBtn.addEventListener("click", (e) => 
        {
          e.preventDefault(); // Chặn hoàn toàn hành vi nhảy trang mặc định của trình duyệt
        
          window.scrollTo
          ({
            top: 0,
            behavior: "smooth" // Ép cuộn từ từ
          });
        });
    }
}
