// Contoh: Alert saat klik gambar
document.querySelectorAll('.item img').forEach(img => {
    img.addEventListener('click', () => {
        alert('Klik untuk detail lebih lanjut!');  // Ganti dengan modal atau redirect
    });
});

// Smooth scroll untuk navigasi
document.querySelectorAll('nav a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});