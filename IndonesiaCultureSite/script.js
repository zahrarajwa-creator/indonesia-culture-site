document.addEventListener('DOMContentLoaded', function() {
    
    // =================================================
    // === 1. LOGIKA UTAMA (Smooth Scroll & Header Scroll) ===
    // =================================================
    const header = document.querySelector('header');
    
    // Smooth Scrolling (Navigasi)
    document.querySelectorAll('nav a[href^="#"]').forEach(link => {
        link.addEventListener('click', function(e) {
            const hash = this.hash;
            if (hash && hash !== "#") {
                e.preventDefault();
                const targetElement = document.querySelector(hash);
                
                if (targetElement) {
                    const headerHeight = header.offsetHeight;
                    
                    window.scrollTo({
                        top: targetElement.offsetTop - headerHeight - 10, 
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // Header Scrolled Class (Berubah warna/shadow saat scroll)
    const heroSection = document.querySelector('.hero-section');
    const triggerHeight = heroSection ? heroSection.offsetHeight / 2 : 50; 

    window.addEventListener('scroll', () => {
        if (window.scrollY > triggerHeight) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
            // Menghapus kelas 'scrolled' jika di paling atas. 
            // Jika Anda ingin header memiliki bayangan terus, hapus baris ini dan baris yang menyertainya
        }
    });


    // =================================================
    // === 2. LOGIKA CAROUSEL (Otomatis & Progress Bar) ===
    // =================================================
    const slides = document.querySelectorAll('.image-slides .slide');
    const textItems = document.querySelectorAll('.story-info-wrapper .story-text-item');
    const indicatorsContainer = document.querySelector('.carousel-container .slide-indicators');
    const totalSlides = slides.length;
    const slideInterval = 6000; // 6 detik per slide
    const carouselContainer = document.querySelector('.carousel-container');
    
    let currentSlide = 0;
    let autoSlideTimer;
    let indicatorBars = [];

    if (totalSlides > 0 && totalSlides === textItems.length && indicatorsContainer) {

        // A. Buat dan Inisialisasi Indikator Bar
        for (let i = 0; i < totalSlides; i++) {
            const bar = document.createElement('div');
            bar.classList.add('indicator-bar');
            
            const progress = document.createElement('div');
            progress.classList.add('progress');
            bar.appendChild(progress);
            
            bar.addEventListener('click', () => {
                showSlide(i);
                restartAutoSlide(); // Restart timer saat diklik manual
            });
            
            indicatorsContainer.appendChild(bar);
            indicatorBars.push(bar);
        }

        // B. Fungsi untuk Menampilkan Slide, Teks, dan Progress Bar
        function showSlide(index) {
            // Logika Looping
            if (index < 0) {
                index = totalSlides - 1; 
            } 
            if (index >= totalSlides) {
                index = 0; 
            }
            currentSlide = index;

            // 1. Reset semua slide, teks, dan progress bar
            slides.forEach(slide => slide.classList.remove('active'));
            textItems.forEach(text => text.classList.remove('active'));
            
            indicatorBars.forEach(bar => {
                bar.classList.remove('active');
                const progress = bar.querySelector('.progress');
                if(progress) {
                    // Reset animasi: hentikan, set width ke 0
                    progress.style.animation = 'none';
                    progress.style.width = '0%';
                    progress.style.animationPlayState = '';
                }
            });
            
            // 2. Atur slide, teks, dan progress bar yang baru
            slides[currentSlide].classList.add('active');
            textItems[currentSlide].classList.add('active');
            indicatorBars[currentSlide].classList.add('active');
            
            // 3. Restart animasi progress bar aktif
            const activeProgress = indicatorBars[currentSlide].querySelector('.progress');
            if (activeProgress) {
                activeProgress.offsetHeight; // Paksakan reflow agar animasi diulang
                activeProgress.style.animation = `progress-bar ${slideInterval / 1000}s linear forwards`;
            }
        }

        // C. Fungsi untuk Pindah ke Slide Berikutnya
        function nextSlide() {
            showSlide(currentSlide + 1);
        }
        
        // D. Fungsi untuk Memulai Ulang Auto-play (Digunakan untuk inisialisasi dan klik)
        function restartAutoSlide() {
            clearInterval(autoSlideTimer);
            showSlide(currentSlide); 
            autoSlideTimer = setInterval(nextSlide, slideInterval);
        }

        // E. Kontrol Auto-play saat Mouse Hover
        carouselContainer.addEventListener('mouseenter', () => {
            clearInterval(autoSlideTimer);
            const activeProgress = indicatorBars[currentSlide].querySelector('.progress');
            if (activeProgress) {
                activeProgress.style.animationPlayState = 'paused'; // Jeda animasi
            }
        });
        
        carouselContainer.addEventListener('mouseleave', () => {
            const activeProgress = indicatorBars[currentSlide].querySelector('.progress');
            if (activeProgress) {
                activeProgress.style.animationPlayState = 'running'; // Lanjutkan animasi
            }
            // Lanjutkan interval utama
            autoSlideTimer = setInterval(nextSlide, slideInterval); 
        });
        
        // F. Inisialisasi Awal
        restartAutoSlide();
    } 
});
