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

// 4. XỬ LÝ ĐĂNG KÝ FORM (MỚI TOÀN DIỆN)
const landingForm = document.getElementById("landingForm");
if (landingForm) {
    landingForm.addEventListener("submit", function (e) {
        e.preventDefault(); // Chặn tải lại trang mặc định
        let valid = true;

        // 1. Kiểm tra Họ Tên
        const name = document.getElementById("name");
        const nameErr = document.getElementById("nameErr");
        if (name && name.value.trim() === "") {
            nameErr.style.display = "block";
            valid = false;
        } else if (nameErr) {
            nameErr.style.display = "none";
        }

        // 2. Kiểm tra Ngày sinh
        const dob = document.getElementById("dob");
        const dobErr = document.getElementById("dobErr");
        if (dob && dob.value === "") {
            dobErr.style.display = "block";
            valid = false;
        } else if (dobErr) {
            dobErr.style.display = "none";
        }

        // 3. Kiểm tra Số Điện Thoại (10 số VN)
        const phone = document.getElementById("phone");
        const phoneErr = document.getElementById("phoneErr");
        const phoneRegex = /^(0[3|5|7|8|9])+([0-9]{8})$/;
        if (phone && !phoneRegex.test(phone.value.trim())) {
            phoneErr.style.display = "block";
            valid = false;
        } else if (phoneErr) {
            phoneErr.style.display = "none";
        }

        // 4. Kiểm tra Ngành muốn học
        const majorTarget = document.getElementById("majorTarget");
        const majorTargetErr = document.getElementById("majorTargetErr");
        if (majorTarget && majorTarget.value === "") {
            majorTargetErr.style.display = "block";
            valid = false;
        } else if (majorTargetErr) {
            majorTargetErr.style.display = "none";
        }

        // 5. Kiểm tra Ngành đã tốt nghiệp
        const majorGraduated = document.getElementById("majorGraduated");
        const majorGraduatedErr = document.getElementById("majorGraduatedErr");
        if (majorGraduated && majorGraduated.value.trim() === "") {
            majorGraduatedErr.style.display = "block";
            valid = false;
        } else if (majorGraduatedErr) {
            majorGraduatedErr.style.display = "none";
        }

        // 6. Kiểm tra Chứng chỉ B1 (Radio Button)
        const b1Options = document.getElementsByName("b1Certificate");
        const b1Err = document.getElementById("b1Err");
        let b1Checked = false;
        
        for (const option of b1Options) {
            if (option.checked) {
                b1Checked = true;
                break;
            }
        }

        if (!b1Checked && b1Err) {
            b1Err.style.display = "block";
            valid = false;
        } else if (b1Err) {
            b1Err.style.display = "none";
        }

        // Nếu TẤT CẢ thông tin đều hợp lệ
        if (valid) {
            alert("Hệ thống đã ghi nhận thông tin đăng ký thành công! Ban tư vấn tuyển sinh sẽ chủ động liên hệ lại bạn sớm nhất.");
            this.reset(); // Xóa trống toàn bộ Form để người khác điền tiếp
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
// Danh sách tên ngẫu nhiên để tạo độ tin cậy
const vips = [
    "Chị Nguyễn Thị M. (Quảng Ngãi)", 
    "Anh Lê Hoàng N. (BKC)", 
    "Anh Phạm Minh T.", 
    "Chị Trần Kim T.", 
    "Anh Vũ Hoàng L."
];

function showFakeNotification() {
    const toast = document.getElementById("toastNotification");
    const toastText = document.getElementById("toastText");

    if (toast && toastText) {
        // Chọn ngẫu nhiên một cái tên trong mảng
        const randomName = vips[Math.floor(Math.random() * vips.length)];
        toastText.innerText = `${randomName} vừa đăng ký tư vấn thành công!`;

        // Hiện lên
        toast.classList.add("show");

        // Ẩn đi sau 4 giây
        setTimeout(() => {
            toast.classList.remove("show");
        }, 4000);
    }
}

// Cứ sau mỗi 20 giây sẽ tự động kích hoạt thông báo một lần
setInterval(showFakeNotification, 20000);

// Kích hoạt lần đầu tiên sau khi load trang 5 giây
setTimeout(showFakeNotification, 5000);