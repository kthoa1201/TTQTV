/* ==========================================================================
   script.js - Logic Đã Tối Ưu Cho Giao Diện Tuyển Sinh Thạc Sĩ
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
    // --- CACHE CÁC PHẦN TỬ DOM DÙNG CHUNG (Tăng tốc độ truy xuất) ---
    const menuToggle = document.getElementById("menuToggle");
    const navMenu = document.getElementById("navMenu");
    const backToTopBtn = document.getElementById("backToTop");
    const sliderWrapper = document.getElementById("sliderWrapper");
    const toastNotification = document.getElementById("toastNotification");
    const toastText = document.getElementById("toastText");
    const videoModal = document.getElementById("videoModal");
    const popupIframe = document.getElementById("popupIframe");
    const landingForm = document.getElementById("landingForm");

    // ==========================================
    // 1. CHỨC NĂNG TRƯỢT MƯỢT ĐẾN CÁC PHẦN (SMOOTH SCROLL)
    // ==========================================
    window.scrollToSection = function (sectionId) {
        const section = document.getElementById(sectionId);
        if (section) {
            section.scrollIntoView({ behavior: "smooth" });
        }
    };

    // ==========================================
    // 2. CHỨC NĂNG CAROUSEL SLIDER CHẠY ẢNH TỰ ĐỘNG
    // ==========================================
    let currentSlide = 0;
    const totalSlides = 3;
    let sliderInterval;

    window.moveSlide = function (direction) {
        currentSlide += direction;
        if (currentSlide >= totalSlides) {
            currentSlide = 0;
        } else if (currentSlide < 0) {
            currentSlide = totalSlides - 1;
        }

        if (sliderWrapper) {
            sliderWrapper.style.transform = `translateX(-${currentSlide * 33.333}%)`;
        }
        // Khởi động lại bộ đếm thời gian để không bị nhảy ảnh quá nhanh khi user click tay
        resetSliderTimer();
    };

    function resetSliderTimer() {
        clearInterval(sliderInterval);
        sliderInterval = setInterval(() => {
            moveSlide(1);
        }, 4000);
    }

    // Kích hoạt slider tự động lần đầu
    resetSliderTimer();

    // ==========================================
    // 3. ĐỒNG HỒ ĐẾM NGƯỢC (COUNTDOWN TIMER)
    // ==========================================
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + 15); // Đặt mốc thời gian mặc định là 15 ngày tới

    function updateCountdown() {
        const now = new Date().getTime();
        const difference = targetDate - now;

        if (difference <= 0) {
            clearInterval(countdownInterval);
            // Hiển thị trạng thái khi hết thời gian
            const elements = ["days", "hours", "minutes", "seconds"];
            elements.forEach(id => {
                const el = document.getElementById(id);
                if (el) el.innerText = "00";
            });
            return;
        }

        const d = Math.floor(difference / (1000 * 60 * 60 * 24));
        const h = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const m = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const s = Math.floor((difference % (1000 * 60)) / 1000);

        // Hàm thêm số 0 phía trước nếu số < 10 (Ví dụ: 09 thay vì 9)
        const formatTime = (num) => num < 10 ? "0" + num : num;

        const dEl = document.getElementById("days");
        const hEl = document.getElementById("hours");
        const mEl = document.getElementById("minutes");
        const sEl = document.getElementById("seconds");

        if (dEl) dEl.innerText = formatTime(d);
        if (hEl) hEl.innerText = formatTime(h);
        if (mEl) mEl.innerText = formatTime(m);
        if (sEl) sEl.innerText = formatTime(s);
    }

    const countdownInterval = setInterval(updateCountdown, 1000);
    updateCountdown(); // Chạy ngay lập tức để tránh bị trễ 1 giây đầu tiên

    // ==========================================
    // 4. KIỂM TRA DỮ LIỆU FORM (VALIDATION)
    // ==========================================
    if (landingForm) {
        landingForm.addEventListener("submit", (e) => {
            e.preventDefault(); // Ngăn trang bị tải lại
            let isValid = true;

            // Thu thập dữ liệu các ô input
            const name = document.getElementById("name");
            const dob = document.getElementById("dob");
            const phone = document.getElementById("phone");
            const majorTarget = document.getElementById("majorTarget");
            const majorGraduated = document.getElementById("majorGraduated");
            const b1Options = document.getElementsByName("b1Certificate");

            // Hàm hiển thị/ẩn lỗi nhanh
            const toggleError = (elementErrId, condition) => {
                const errEl = document.getElementById(elementErrId);
                if (errEl) {
                    errEl.style.display = condition ? "block" : "none";
                }
                if (condition) isValid = false;
            };

            // Kiểm tra Họ Tên
            toggleError("nameErr", !name || name.value.trim() === "");

            // Kiểm tra Ngày Sinh
            toggleError("dobErr", !dob || dob.value === "");

            // Kiểm tra Số Điện Thoại (Regex chuẩn 10 số Việt Nam)
            const phoneRegex = /(03|05|07|08|09)+([0-8]{1})([0-9]{7})\b/;
            toggleError("phoneErr", !phone || !phoneRegex.test(phone.value.trim()));

            // Kiểm tra Ngành Đăng Ký Học
            toggleError("majorTargetErr", !majorTarget || majorTarget.value === "");

            // Kiểm tra Ngành Đã Tốt Nghiệp
            toggleError("majorGraduatedErr", !majorGraduated || majorGraduated.value.trim() === "");

            // Kiểm tra Chứng chỉ B1 (Radio Button)
            let isB1Checked = false;
            for (let i = 0; i < b1Options.length; i++) {
                if (b1Options[i].checked) {
                    isB1Checked = true;
                    break;
                }
            }
            toggleError("b1Err", !isB1Checked);

            // Nếu tất cả hợp lệ -> Xử lý gửi dữ liệu thành công
            if (isValid) {
                alert("🎉 Chúc mừng! Bạn đã gửi đăng ký xét tuyển thành công. Ban tuyển sinh sẽ liên hệ với bạn sớm nhất.");
                landingForm.reset(); // Xóa sạch form sau khi gửi thành công
            }
        });
    }

    // ==========================================
    // 5. HIỆU ỨNG CUỘN TRANG (BACK TO TOP & REVEAL)
    // ==========================================
    window.addEventListener("scroll", () => {
        // 5a. Hiện/Ẩn nút Lên đầu trang
        if (backToTopBtn) {
            if (window.scrollY > 300) {
                backToTopBtn.classList.add("show");
            } else {
                backToTopBtn.classList.remove("show");
            }
        }

        // 5b. Hiệu ứng xuất hiện dần khi cuộn trang (Reveal Elements)
        const reveals = document.querySelectorAll(".reveal");
        const windowHeight = window.innerHeight;
        const revealPoint = 150;

        reveals.forEach(reveal => {
            const revealTop = reveal.getBoundingClientRect().top;
            if (revealTop < windowHeight - revealPoint) {
                reveal.classList.add("active");
            }
        });
    });

    if (backToTopBtn) {
        backToTopBtn.addEventListener("click", () => {
            window.scrollTo({ top: 0, behavior: "smooth" });
        });
    }

    // ==========================================
    // 6. POPUP XEM VIDEO YOUTUBE
    // ==========================================
    window.openVideoPopup = function () {
        if (videoModal && popupIframe) {
            popupIframe.src = "https://www.youtube.com/embed/KelpjDfiuB4?autoplay=1";
            videoModal.style.display = "flex";
        }
    };

    window.closeVideoPopup = function () {
        if (videoModal && popupIframe) {
            popupIframe.src = "";
            videoModal.style.display = "none";
        }
    };

    // Đóng popup nếu người dùng bấm ra vùng tối bên ngoài khung video
    window.addEventListener("click", (event) => {
        if (event.target === videoModal) {
            closeVideoPopup();
        }
    });

    // ==========================================
    // 7. TOAST THÔNG BÁO CHẠY NGẪU NHIÊN (FAKE REGISTER TOAST)
    // ==========================================
    const listNames = [
        "Anh Nguyễn Minh T.", "Chị Phan Ngọc H.", "Anh Trần Văn K.",
        "Chị Lê Thúy A.", "Anh Vũ Hoàng N.", "Chị Ngô Thị M."
    ];
    const listMajors = [
        "Quản trị kinh doanh", "Công nghệ thông tin",
        "Tâm lý học", "Ngôn ngữ Anh"
    ];

    function showRandomToast() {
        if (!toastNotification || !toastText) return;

        const randomName = listNames[Math.floor(Math.random() * listNames.length)];
        const randomMajor = listMajors[Math.floor(Math.random() * listMajors.length)];

        toastText.innerHTML = `${randomName} vừa đăng ký tư vấn ngành ${randomMajor} thành công!`;

        toastNotification.classList.add("show");

        // Tự động ẩn thông báo sau 4 giây
        setTimeout(() => {
            toastNotification.classList.remove("show");
        }, 4000);
    }

    // Thiết lập hiển thị ngẫu nhiên từ 15 đến 25 giây xuất hiện 1 lần
    function scheduleNextToast() {
        const randomDelay = Math.floor(Math.random() * (25000 - 15000 + 1)) + 15000;
        setTimeout(() => {
            showRandomToast();
            scheduleNextToast();
        }, randomDelay);
    }

    // Chạy thông báo đầu mốc sau 6 giây kể từ khi mở trang
    setTimeout(() => {
        showRandomToast();
        scheduleNextToast();
    }, 6000);

    // ==========================================
    // 8. MENU HAMBURGER ĐIỆN THOẠI RESPONSIVE
    // ==========================================
    if (menuToggle && navMenu) {
        menuToggle.addEventListener("click", (e) => {
            e.stopPropagation(); // Ngăn chặn sự kiện nổi bọt
            menuToggle.classList.toggle("active");
            navMenu.classList.toggle("active");
        });

        // Tự động ĐÓNG menu lại sau khi người dùng chọn 1 mục
        const menuItems = navMenu.querySelectorAll("a");
        menuItems.forEach(item => {
            item.addEventListener("click", () => {
                menuToggle.classList.remove("active");
                navMenu.classList.remove("active");
            });
        });

        // Click ra ngoài vùng menu sẽ tự động đóng menu điện thoại lại
        document.addEventListener("click", (e) => {
            if (!navMenu.contains(e.target) && !menuToggle.contains(e.target)) {
                menuToggle.classList.remove("active");
                navMenu.classList.remove("active");
            }
        });
    }
    // ==========================================
    // 10. CHỨC NĂNG SLIDER CHẠY 12 NGÀNH ĐÀO TẠO TỰ ĐỘNG & HOVER PAUSE
    // ==========================================
    let currentProgPage = 0;
    const totalProgPages = 2; // Gồm 2 nhóm (mỗi nhóm 6 ngành)
    const progTrack = document.getElementById("progTrack");
    const progViewport = document.getElementById("progViewport");
    const progPrevBtn = document.getElementById("progPrevBtn");
    const progNextBtn = document.getElementById("progNextBtn");
    let progAutoplayTimer = null;

    // Hàm thực hiện chuyển trang trượt
    function switchProgPage(pageIndex) {
        currentProgPage = pageIndex;
        // Trượt thanh ray qua lại 0% hoặc -50% (vì track rộng 200%)
        if (progTrack) {
            progTrack.style.transform = `translateX(-${currentProgPage * 50}%)`;
        }
    }

    // Hàm tự động nhảy trang tiếp theo
    function autoNextProgPage() {
        let targetPage = currentProgPage + 1;
        if (targetPage >= totalProgPages) {
            targetPage = 0; // Quay về nhóm 1
        }
        switchProgPage(targetPage);
    }

    // Khởi chạy đồng hồ tự động sau mỗi 6 giây trượt 1 lần
    function startProgAutoplay() {
        if (!progAutoplayTimer) {
            progAutoplayTimer = setInterval(autoNextProgPage, 6000);
        }
    }

    // Dừng đồng hồ tự động khi người dùng tương tác
    function stopProgAutoplay() {
        if (progAutoplayTimer) {
            clearInterval(progAutoplayTimer);
            progAutoplayTimer = null;
        }
    }

    // Gán sự kiện cho Nút bấm Tiến (Next)
    if (progNextBtn) {
        progNextBtn.addEventListener("click", () => {
            let targetPage = currentProgPage + 1;
            if (targetPage >= totalProgPages) targetPage = 0;
            switchProgPage(targetPage);
        });
    }

    // Gán sự kiện cho Nút bấm Lùi (Prev)
    if (progPrevBtn) {
        progPrevBtn.addEventListener("click", () => {
            let targetPage = currentProgPage - 1;
            if (targetPage < 0) targetPage = totalProgPages - 1;
            switchProgPage(targetPage);
        });
    }

    // XỬ LÝ LIA CHUỘT (HOVER): Đứng yên khi chạm vào, chạy lại khi bỏ ra ngoài
    if (progViewport) {
        progViewport.addEventListener("mouseenter", stopProgAutoplay);
        progViewport.addEventListener("mouseleave", startProgAutoplay);
    }

    // Kích hoạt chạy tự động lần đầu tiên
    startProgAutoplay();
});