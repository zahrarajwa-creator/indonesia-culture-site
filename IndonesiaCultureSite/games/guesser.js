// guesser.js - Logika game tebak lokasi budaya
let map;
let currentQuestion;
let userGuess = null;
let totalScore = 0;
let round = 1;
let shuffledQuestions = [];

// Acak pertanyaan agar berbeda setiap main
function shuffleQuestions() {
    shuffledQuestions = [...questions].sort(() => Math.random() - 0.5);
}

// Inisialisasi peta Leaflet (fokus Indonesia)
function initMap() {
    map = L.map('map').setView([-2.5, 118], 5); // Pusat Indonesia
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    // Event klik di peta untuk menebak
    map.on('click', function(e) {
        userGuess = e.latlng;
        // Hapus marker lama, tambah marker baru
        map.eachLayer(layer => { if (layer instanceof L.Marker) map.removeLayer(layer); });
        L.marker([e.latlng.lat, e.latlng.lng]).addTo(map).bindPopup("Tebakan Anda").openPopup();
    });
}

// Hitung skor berdasarkan jarak (max 100 poin per ronde)
function calculateScore(guessLat, guessLng, actualLat, actualLng) {
    const R = 6371; // Radius bumi dalam km
    const dLat = (actualLat - guessLat) * Math.PI / 180;
    const dLng = (actualLng - guessLng) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(guessLat * Math.PI / 180) * Math.cos(actualLat * Math.PI / 180) * Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c;
    
    // Skor: Max 100 poin jika jarak 0, turun linier (100 km ≈ 0 poin)
    let score = Math.max(0, 100 - (distance / 10)); // Ubah /10 untuk atur kesulitan
    return { distance: distance.toFixed(2), score: Math.round(score) };
}

// Load ronde baru
function loadRound() {
    if (round > 5) {
        document.getElementById('result').textContent = `Game selesai! Skor akhir: ${totalScore}/500`;
        document.getElementById('nextBtn').style.display = 'none';
        document.getElementById('restartBtn').style.display = 'block';
        return;
    }
    
    currentQuestion = shuffledQuestions[round - 1];
    document.getElementById('quizImage').src = currentQuestion.image;
    document.getElementById('round').textContent = round;
    document.getElementById('result').textContent = "";
    document.getElementById('nextBtn').style.display = 'none';
    userGuess = null;
    // Reset peta
    map.eachLayer(layer => { if (layer instanceof L.Marker) map.removeLayer(layer); });
}

// Event tombol tebak
document.getElementById('guessBtn').addEventListener('click', () => {
    if (!userGuess) {
        alert("Klik dulu di peta untuk menebak!");
        return;
    }
    
    const result = calculateScore(userGuess.lat, userGuess.lng, currentQuestion.correctLat, currentQuestion.correctLng);
    totalScore += result.score;
    document.getElementById('totalScore').textContent = totalScore;
    document.getElementById('result').textContent = `Jarak: ${result.distance} km. Skor ronde: ${result.score}. ${currentQuestion.description}`;
    
    // Tunjukkan lokasi benar di peta
    L.marker([currentQuestion.correctLat, currentQuestion.correctLng]).addTo(map).bindPopup(`Lokasi Benar: ${currentQuestion.description}`).openPopup();
    
    document.getElementById('nextBtn').style.display = 'block';
});

// Event ronde berikutnya
document.getElementById('nextBtn').addEventListener('click', () => {
    round++;
    loadRound();
});

// Event restart game
document.getElementById('restartBtn').addEventListener('click', () => {
    totalScore = 0;
    round = 1;
    shuffleQuestions();
    document.getElementById('totalScore').textContent = totalScore;
    document.getElementById('restartBtn').style.display = 'none';
    loadRound();
});

// Jalankan saat halaman load
window.onload = () => {
    shuffleQuestions();
    initMap();
    loadRound();
};