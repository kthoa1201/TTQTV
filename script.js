/* ==========================================================================
   script.js - Logic Hoàn Chỉnh Cho Giao Diện Tuyển Sinh Thạc Sĩ
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {

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
    const wrapper = document.getElementById("sliderWrapper");

    window.moveSlide = function (direction) {
        currentSlide += direction;
        if (currentSlide >= totalSlides) {
            currentSlide = 0;
        } else if (currentSlide < 0) {
            currentSlide = totalSlides - 1;
        }
        if (wrapper) {
            wrapper.style.transform = `translateX(-${currentSlide * 33.333}%)`;
        }
    };

    // Tự động trượt ảnh chính sau mỗi 4 giây
    setInterval(() => {
        moveSlide(1);
    }, 4000);


    // ==========================================
    // 3. ĐỒNG HỒ ĐẾM NGƯỢC TỰ ĐỘNG (COUNTDOWN)
    // ==========================================
    let targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + 15); // Tự động lấy ngày hiện tại + 15 ngày
    const targetTime = targetDate.getTime();

    const daysElement = document.getElementById("days");
    const hoursElement = document.getElementById("hours");
    const minutesElement = document.getElementById("minutes");
    const secondsElement = document.getElementById("seconds");

    function updateCountdown() {
        const now = new Date().getTime();
        const difference = targetTime - now;

        if (difference < 0) {
            clearInterval(countdownInterval);
            if (daysElement) daysElement.innerText = "00";
            if (hoursElement) hoursElement.innerText = "00";
            if (minutesElement) minutesElement.innerText = "00";
            if (secondsElement) secondsElement.innerText = "00";
            return;
        }

        const d = Math.floor(difference / (1000 * 60 * 60 * 24));
        const h = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const m = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const s = Math.floor((difference % (1000 * 60)) / 1000);

        if (daysElement && hoursElement && minutesElement && secondsElement) {
            daysElement.innerText = d < 10 ? "0" + d : d;
            hoursElement.innerText = h < 10 ? "0" + h : h;
            minutesElement.innerText = m < 10 ? "0" + m : m;
            secondsElement.innerText = s < 10 ? "0" + s : s;
        }
    }

    // ĐÃ SỬA LỖI CHỮ "s" THỪA GÂY CHẾT SCRIPT Ở ĐÂY
    const countdownInterval = setInterval(updateCountdown, 1000);
    updateCountdown();


    // ==========================================
    // 4. KIỂM TRA VALIDATE FORM ĐĂNG KÝ TƯ VẤN MỚI
    // ==========================================
    const landingForm = document.getElementById("landingForm");
    if (landingForm) {
        landingForm.addEventListener("submit", function (e) {
            e.preventDefault();
            let valid = true;

            // Kiểm tra Họ Tên
            const name = document.getElementById("name");
            const nameErr = document.getElementById("nameErr");
            if (name && name.value.trim() === "") {
                if (nameErr) nameErr.style.display = "block";
                valid = false;
            } else if (nameErr) {
                nameErr.style.display = "none";
            }

            // Kiểm tra Ngày sinh
            const dob = document.getElementById("dob");
            const dobErr = document.getElementById("dobErr");
            if (dob && dob.value === "") {
                if (dobErr) dobErr.style.display = "block";
                valid = false;
            } else if (dobErr) {
                dobErr.style.display = "none";
            }

            // Kiểm tra Số Điện Thoại
            const phone = document.getElementById("phone");
            const phoneErr = document.getElementById("phoneErr");
            const phoneRegex = /^(0[3|5|7|8|9])+([0-9]{8})$/;
            if (phone && !phoneRegex.test(phone.value.trim())) {
                if (phoneErr) phoneErr.style.display = "block";
                valid = false;
            } else if (phoneErr) {
                phoneErr.style.display = "none";
            }

            // Kiểm tra Ngành muốn học
            const majorTarget = document.getElementById("majorTarget");
            const majorTargetErr = document.getElementById("majorTargetErr");
            if (majorTarget && majorTarget.value === "") {
                if (majorTargetErr) majorTargetErr.style.display = "block";
                valid = false;
            } else if (majorTargetErr) {
                majorTargetErr.style.display = "none";
            }

            // Kiểm tra Ngành đã tốt nghiệp
            const majorGraduated = document.getElementById("majorGraduated");
            const majorGraduatedErr = document.getElementById("majorGraduatedErr");
            if (majorGraduated && majorGraduated.value.trim() === "") {
                if (majorGraduatedErr) majorGraduatedErr.style.display = "block";
                valid = false;
            } else if (majorGraduatedErr) {
                majorGraduatedErr.style.display = "none";
            }

            // Kiểm tra Chứng chỉ B1
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

            if (valid) {
                alert("Hệ thống đã ghi nhận thông tin đăng ký thành công! Ban tư vấn tuyển sinh sẽ chủ động liên hệ lại bạn sớm nhất.");
                this.reset();
            }
        });
    }


    // ==========================================
    // 5. XỬ LÝ ĐÓNG/MỞ KHỐI FAQS (ACCORDION)
    // ==========================================
    window.toggleFaq = function (element) {
        const faqItem = element.parentElement;
        const isActive = faqItem.classList.contains('active');

        document.querySelectorAll('.faq-item').forEach(item => {
            item.classList.remove('active');
        });

        if (!isActive) {
            faqItem.classList.add('active');
        }
    };


    // ==========================================
    // 6. QUẢN LÝ HIỆU ỨNG CUỘN (REVEAL SECTIONS & BACK TO TOP)
    // ==========================================
    const backToTopBtn = document.getElementById("backToTop");

    function handleScrollEffects() {
        // A. Hiệu ứng nội dung xuất hiện từ từ khi lướt tới
        const reveals = document.querySelectorAll("section");
        const windowHeight = window.innerHeight;
        const elementVisible = 100;

        reveals.forEach((reveal) => {
            const elementTop = reveal.getBoundingClientRect().top;
            if (elementTop < windowHeight - elementVisible) {
                reveal.classList.add("reveal", "active");
            }
        });

        // B. Điều khiển ẩn/hiện nút Back to Top khi chạm sát vùng đáy trang
        if (backToTopBtn) {
            const totalPageHeight = document.documentElement.scrollHeight;
            const currentViewHeight = window.innerHeight;
            const scrolledDistance = window.scrollY || document.documentElement.scrollTop;

            if (totalPageHeight - (scrolledDistance + currentViewHeight) < 400) {
                backToTopBtn.classList.add("show");
            } else {
                backToTopBtn.classList.remove("show");
            }
        }
    }

    // Đăng ký cuộn mượt khi click nút Back to Top (Chỉ giữ lại duy nhất 1 listener sạch)
    if (backToTopBtn) {
        backToTopBtn.addEventListener("click", (e) => {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        });
    }

    window.addEventListener("scroll", handleScrollEffects);
    handleScrollEffects(); // Chạy ngay lập tức khi load để quét màn hình trước


    // ==========================================
    // 7. THÔNG BÁO ẢO ĐĂNG KÝ THÀNH CÔNG (TOAST)
    // ==========================================
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
            const randomName = vips[Math.floor(Math.random() * vips.length)];
            toastText.innerText = `${randomName} vừa đăng ký tư vấn thành công!`;
            toast.classList.add("show");

            setTimeout(() => {
                toast.classList.remove("show");
            }, 4000);
        }
    }

    setInterval(showFakeNotification, 20000);
    setTimeout(showFakeNotification, 5000);


    // ==========================================
    // 8. CHỨC NĂNG CHẠY SLIDER ĐỐI TÁC TỰ ĐỘNG
    // ==========================================
    let partnerStage = 0;
    const partnerTrack = document.getElementById("partnerTrack");


    // Cho chạy tự động sau mỗi 5 giây
    setInterval(autoSlidePartners, 5000);


});