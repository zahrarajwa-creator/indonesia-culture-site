// Data Pertanyaan Kebudayaan dengan Koordinat Lokasi Sebenarnya
const cultureQuestions = [
    {
        id: 1,
        name: "Rumah Tongkonan",
        image: '../images/Toraja.jpg', 
        location: [ -2.9734, 119.8973 ], // Tana Toraja, Sulawesi Selatan
        caption: "Rumah adat Tongkonan, Tana Toraja, Sulawesi Selatan",
        maxDistanceKm: 400
    },
    {
        id: 2,
        name: "Rendang",
        image: '../images/Rendang.jpeg', 
        location: [ -0.9409, 100.3541 ], // Padang, Sumatera Barat
        caption: "Rendang, Sumatera Barat",
        maxDistanceKm: 600
    },
    {
        id: 3,
        name: "Lompat Batu Fahombo",
        image: '../images/lompat batu nias (2).jpeg', 
        location: [ 0.7712, 97.8078 ], // Nias Selatan, Sumatera Utara
        caption: "Tradisi Lompat Batu (Fahombo), Nias, Sumatera Utara",
        maxDistanceKm: 500
    },
    {
        id: 4,
        name: "Candi Borobudur",
        image: '../images/borobudur.jpg', 
        location: [ -7.6079, 110.2038 ], // Magelang, Jawa Tengah
        caption: "Candi Borobudur, Magelang, Jawa Tengah",
        maxDistanceKm: 300
    },
    {
        id: 5,
        name: "Tari Saman",
        image: '../images/tari saman.jpeg', 
        location: [ 4.3592, 97.0257 ], // Gayo Lues, Aceh
        caption: "Tari Saman, Aceh",
        maxDistanceKm: 700
    },
    {
        id: 6,
        name: "Pura Tanah Lot",
        image: '../images/tanah-lot-996675.jpg', 
        location: [ -8.6212, 115.0877 ], // Bali
        caption: "Pura Tanah Lot, Bali",
        maxDistanceKm: 250
    },
    {
        id: 7,
        name: "Komodo", 
        image: '../images/komodo.jpeg', 
        location: [ -8.5637, 119.4975 ], // Pulau Komodo, Nusa Tenggara Timur
        caption: "Komodo, Pulau Komodo, Nusa Tenggara Timur",
        maxDistanceKm: 400
    },
    {
        id: 8,
        name: "Reog Ponorogo",
        image: '../images/reog.jpg', 
        location: [ -7.8732, 111.4770 ], // Ponorogo, Jawa Timur
        caption: "Reog Ponorogo, Jawa Timur",
        maxDistanceKm: 300 
    },
    {
        id: 9,
        name: "Ampo",
        image: '../images/ampo.jpeg', 
        location: [ -6.8906, 112.0620 ], // Tuban, Jawa Timur
        caption: "Ampo (makanan dari tanah liat), Tuban, Jawa Timur",
        maxDistanceKm: 350 
    },
    {
        id: 10,
        name: "Sate Ayam Madura",
        image: '../images/sate ayam.jpeg', 
        location: [ -7.0519, 112.7523 ], // Madura (Bangkalan), Jawa Timur
        caption: "Sate Ayam Madura, Pulau Madura, Jawa Timur",
        maxDistanceKm: 400 
    },
    {
        id: 11,
        name: "Bantengan (Mberot)",
        image: '../images/mberot.jpg', 
        location: [ -7.9839, 112.6303 ], // Malang, Jawa Timur
        caption: "Kesenian Bantengan (Mberot), Malang, Jawa Timur",
        maxDistanceKm: 300 
    },
    {
        id: 12, 
        name: "Papeda",
        image: '../images/papeda.jpeg', 
        location: [ -2.5333, 140.7167 ], // Jayapura, Papua
        caption: "Papeda (makanan pokok), Papua",
        maxDistanceKm: 800 
    },
    {
        id: 13, 
        name: "Ondel-Ondel",
        image: '../images/ondel-ondel.jpeg', 
        location: [ -6.1750, 106.8283 ], // Jakarta
        caption: "Boneka raksasa Ondel-Ondel, DKI Jakarta",
        maxDistanceKm: 250 
    }
];

// --- API Konfigurasi dan Variabel Global ---
const URL_DASAR_API = 'https://whatsproject.my.id/geo/v1'; 
let cityBoundaryGeoJSON = []; 
let currentQuestionIndex = 0;
let totalScore = 0;
let map;
let playerGuessMarker = null;
let actualLocationMarker = null;
let lineToActual = null;
let currentGuessCoords = null;
let questionsForGame = []; 
const MAX_ROUNDS = 5; 

// --- Elemen DOM ---
const startScreen = document.getElementById('start-screen');
const startGameButton = document.getElementById('start-game-button');
const questionArea = document.getElementById('question-area');
const cultureImage = document.getElementById('culture-image');
const imageCaption = document.getElementById('image-caption');
const mapContainer = document.getElementById('map-container');
const guessButton = document.getElementById('guess-button');
const feedbackArea = document.getElementById('feedback-area');
const feedbackMessage = document.getElementById('feedback-message');
const distanceDisplay = document.getElementById('distance-display');
const roundScoreDisplay = document.getElementById('round-score-display');
const nextRoundButton = document.getElementById('next-round-button');
const scoreDisplay = document.getElementById('score');
const roundInfoDisplay = document.getElementById('round-info');
const finalResultModal = document.getElementById('final-result-modal');
const finalTotalScoreDisplay = document.getElementById('final-total-score');
const playAgainButton = document.getElementById('play-again-button');


// --- FUNGSI API BARU UNTUK MENGAMBIL DATA KOTA/KABUPATEN ---

// 1. Mendapatkan Total Halaman Kota/Kabupaten (GET /city/page)
async function getTotalCityPages() {
    try {
        const response = await fetch(`${URL_DASAR_API}/city/page`);
        
        // Cek status 202 (Accepted) atau 200
        if (response.status !== 202 && response.status !== 200) { 
            console.error(`Status API: ${response.status}`);
            throw new Error(`Gagal memuat halaman. Status: ${response.status}`);
        }
        
        const data = await response.json();
        return data.page; 
    } catch (error) {
        console.error("Gagal mengambil total halaman. Pastikan URL_DASAR_API benar.", error);
        return 0;
    }
}

// 2. Mengambil Data GeoJSON Kota/Kabupaten per Halaman (GET /city)
async function getCityDataByPage(pageNumber) { 
    try {
        const response = await fetch(`${URL_DASAR_API}/city?page=${pageNumber}`);
        
        // Cek kode 202 atau 200
        if (response.status !== 202 && response.status !== 200) { 
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        return await response.json(); 
    } catch (error) {
        console.error(`Gagal mengambil data halaman ${pageNumber}:`, error);
        return [];
    }
}

// 3. Fungsi Utama untuk Mengumpulkan dan Memproses Peta Batas Wilayah
async function loadIndonesiaBoundaryMap() {
    // Cek apakah Leaflet sudah dimuat
    if (typeof L === 'undefined') {
        return;
    }
    
    const totalPage = await getTotalCityPages();
    let rawData = [];
    
    if (totalPage === 0) {
        // Peringatan jika data batas gagal dimuat
        alert("Peringatan: Gagal memuat batas wilayah kota/kabupaten dari API. Peta akan tampil tanpa batas.");
        console.warn("Peringatan: Gagal memuat batas wilayah. Periksa konsol untuk detail error API.");
        return;
    }
    
    for (let i = 1; i <= totalPage; i++) {
        const pageData = await getCityDataByPage(i);
        rawData.push(pageData); 
    }

    const flatData = rawData.flat();
    
    cityBoundaryGeoJSON = flatData
        .map(item => item.cityFeature) 
        .filter(feature => feature !== undefined && feature !== null);

    console.log(`Berhasil memuat ${cityBoundaryGeoJSON.length} batas kota/kabupaten.`);

    const mapFeatures = {
        type: "FeatureCollection",
        features: cityBoundaryGeoJSON
    };

    L.geoJSON(mapFeatures, {
        style: function (feature) {
            return {
                // PERBAIKAN: Warna transparan agar tidak mengganggu peta
                color: '#aaaaaa', // Warna abu-abu muda
                weight: 0.5, // Garis sangat tipis
                fillColor: '#8b5a2b', 
                fillOpacity: 0.01 // Transparansi sangat tinggi
            };
        },
        onEachFeature: function (feature, layer) {
            if (feature.properties && feature.properties.name) {
                layer.bindPopup(feature.properties.name);
            }
        }
    }).addTo(map);

    map.fitBounds(L.geoJSON(mapFeatures).getBounds().pad(0.1));
}


// --- FUNGSI GAME UTAMA ---

// Fungsi untuk membuat dan menginisialisasi peta
function initMap() {
    if (typeof L === 'undefined') {
        console.error("ERROR: Leaflet.js belum dimuat! Peta tidak dapat diinisialisasi.");
        return;
    }

    // Pembersihan Peta Lama yang lebih ketat
    if (map) { 
        map.off();
        map.remove();
        map = null;
    }
    
    map = L.map('map-container', {
        center: [-2.5, 118.5], 
        zoom: 5,
        minZoom: 4, 
        maxBounds: [[-11, 90], [7, 145]] 
    });

    // Peta Dasar (OpenStreetMap)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // map.on('click', onMapClick); // DIPINDAHKAN KE loadNextRound()

    // Solusi Timing Map Tidak Muncul/Melebar
    setTimeout(() => {
        if (map) {
            map.invalidateSize(); 
            map.flyTo([-2.5, 118.5], 5, { duration: 1 }); 
        }
    }, 750); 
}

// Handler klik pada peta
function onMapClick(e) {
    if (guessButton.style.display !== 'none') { 
        if (playerGuessMarker) { map.removeLayer(playerGuessMarker); }
        playerGuessMarker = L.marker(e.latlng).addTo(map)
            .bindPopup("Tebakan Anda").openPopup();
        currentGuessCoords = [e.latlng.lat, e.latlng.lng];
        guessButton.disabled = false;
    }
}

// Fungsi untuk memulai permainan baru
async function startGame() { 
    startScreen.style.display = 'none';
    questionArea.style.display = 'flex'; 
    feedbackArea.style.display = 'none';
    finalResultModal.style.display = 'none';

    totalScore = 0;
    currentQuestionIndex = 0;
    scoreDisplay.textContent = `Total Skor: ${totalScore}`;
    
    questionsForGame = shuffleArray([...cultureQuestions]).slice(0, MAX_ROUNDS);
    
    initMap(); 
    
    // PERBAIKAN: Memuat API di latar belakang (tidak menunggu)
    loadIndonesiaBoundaryMap(); 

    loadNextRound();
}

// Fungsi untuk memuat babak berikutnya
function loadNextRound() {
    if (currentQuestionIndex >= MAX_ROUNDS) {
        endGame();
        return;
    }

    const question = questionsForGame[currentQuestionIndex];
    roundInfoDisplay.textContent = `Babak: ${currentQuestionIndex + 1} / ${MAX_ROUNDS}`;

    // Reset UI
    cultureImage.src = question.image;
    cultureImage.alt = question.name;
    imageCaption.style.display = 'none'; 
    guessButton.style.display = 'block'; 
    guessButton.disabled = true; 
    nextRoundButton.style.display = 'none';
    feedbackArea.style.display = 'none';

    // Hapus marker dan garis dari babak sebelumnya
    if (playerGuessMarker) { map.removeLayer(playerGuessMarker); playerGuessMarker = null; }
    if (actualLocationMarker) { map.removeLayer(actualLocationMarker); actualLocationMarker = null; }
    if (lineToActual) { map.removeLayer(lineToActual); lineToActual = null; }
    currentGuessCoords = null; 

    // Hapus listener dari babak sebelumnya jika ada
    map.off('click', onMapClick);
    // Tambahkan listener klik: Peta siap diklik setelah babak dimuat
    map.on('click', onMapClick); 

    // Kembali ke tampilan peta Indonesia
    map.flyTo([-2.5, 118.5], 5); 
}

// Fungsi saat pemain menekan tombol "Tebak Lokasi"
function submitGuess() {
    if (!currentGuessCoords) {
        alert("Silakan klik di peta untuk menempatkan tebakan Anda!");
        return;
    }

    guessButton.style.display = 'none'; 
    nextRoundButton.style.display = 'block'; 
    feedbackArea.style.display = 'block';
    
    const question = questionsForGame[currentQuestionIndex];
    imageCaption.textContent = question.caption;
    imageCaption.style.display = 'block';
    
    const actualCoords = question.location;

    // Tampilkan lokasi sebenarnya
    actualLocationMarker = L.marker(actualCoords, {
        icon: L.icon({
            iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png', 
            shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            shadowSize: [41, 41]
        })
    }).addTo(map).bindPopup(`Lokasi Sebenarnya: ${question.name}`).openPopup();

    // Gambar garis
    lineToActual = L.polyline([currentGuessCoords, actualCoords], { color: 'blue', weight: 3, opacity: 0.7 }).addTo(map);

    // Hitung jarak dan poin
    const distance = haversineDistance(currentGuessCoords, actualCoords);
    const roundScore = calculateScore(distance, question.maxDistanceKm);

    totalScore += roundScore;
    scoreDisplay.textContent = `Total Skor: ${totalScore}`;

    feedbackMessage.textContent = `Anda menebak lokasi ${question.name}.`;
    distanceDisplay.textContent = distance.toFixed(2);
    roundScoreDisplay.textContent = roundScore;

    // Zoom ke area yang mencakup tebakan dan lokasi sebenarnya
    const bounds = L.latLngBounds(currentGuessCoords, actualCoords);
    map.flyToBounds(bounds.pad(0.5)); 
}

// Fungsi untuk mengakhiri seluruh permainan
function endGame() {
    questionArea.style.display = 'none';
    feedbackArea.style.display = 'none';
    finalTotalScoreDisplay.textContent = totalScore;
    finalResultModal.style.display = 'flex';
    
    // Hapus peta dan listener-nya saat game berakhir
    if (map) {
        map.off();
        map.remove();
        map = null;
    }
}

// --- FUNGSI PEMBANTU ---
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function haversineDistance(coords1, coords2) {
    const R = 6371; // Radius bumi dalam kilometer
    const lat1 = coords1[0] * Math.PI / 180;
    const lon1 = coords1[1] * Math.PI / 180;
    const lat2 = coords2[0] * Math.PI / 180;
    const lon2 = coords2[1] * Math.PI / 180;

    const dLat = lat2 - lat1;
    const dLon = lon2 - lon1;

    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
             Math.cos(lat1) * Math.cos(lat2) *
             Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // Jarak dalam km
}

function calculateScore(distanceKm, maxDistanceKmFor100Points = 200) {
    if (distanceKm <= 10) { 
        return 100; // Akurat sempurna
    } 
    
    // Jarak 0 Poin dilonggarkan menjadi 1.5x dari batas per soal
    const zeroScoreDistance = maxDistanceKmFor100Points * 1.5; 
    
    if (distanceKm > zeroScoreDistance) { 
        return 0;
    } else {
        const score = 100 - (distanceKm / zeroScoreDistance) * 100;
        return Math.max(0, Math.round(score)); 
    }
}
// ---------------------------------------------------------------------

// --- Event Listeners ---
startGameButton.addEventListener('click', startGame);
guessButton.addEventListener('click', submitGuess);
nextRoundButton.addEventListener('click', () => {
    currentQuestionIndex++;
    loadNextRound();
});
playAgainButton.addEventListener('click', startGame);


// --- Inisialisasi Awal ---
document.addEventListener('DOMContentLoaded', () => {
    questionArea.style.display = 'none';
    feedbackArea.style.display = 'none';
    startScreen.style.display = 'block';
    finalResultModal.style.display = 'none';
});
