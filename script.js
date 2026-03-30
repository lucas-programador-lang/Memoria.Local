let memorias = JSON.parse(localStorage.getItem('memorias_locais')) || [];
let map, markerTemp;

// Inicializa o Mapa
function initMap() {
    // Coordenadas iniciais (Pode ser Porto Velho como base)
    map = L.map('map').setView([-8.76116, -63.9004], 13);
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap'
    }).addTo(map);

    // Evento de clique para marcar local
    map.on('click', function(e) {
        if (markerTemp) map.removeLayer(markerTemp);
        markerTemp = L.marker([e.latlng.lat, e.latlng.lng]).addTo(map);
    });

    renderizarMemorias();
}

document.getElementById('form-memoria').addEventListener('submit', function(e) {
    e.preventDefault();
    if (!markerTemp) return alert("Por favor, clique no mapa para marcar onde essa história aconteceu!");

    const novaMemoria = {
        id: Date.now(),
        titulo: document.getElementById('mem-titulo').value,
        relato: document.getElementById('mem-relato').value,
        autor: document.getElementById('mem-autor').value || "Anônimo",
        lat: markerTemp.getLatLng().lat,
        lng: markerTemp.getLatLng().lng,
        data: new Date().toLocaleDateString('pt-BR')
    };

    memorias.unshift(novaMemoria);
    localStorage.setItem('memorias_locais', JSON.stringify(memorias));
    
    this.reset();
    map.removeLayer(markerTemp);
    markerTemp = null;
    renderizarMemorias();
});

function renderizarMemorias() {
    const feed = document.getElementById('feed-memorias');
    feed.innerHTML = memorias.map(m => `
        <div class="bg-white p-8 rounded-3xl shadow-sm border-l-4 border-amber-600 hover:shadow-md transition">
            <span class="text-[10px] uppercase tracking-widest text-amber-600 font-black">${m.data}</span>
            <h3 class="text-2xl font-bold mt-1 text-stone-800">${m.titulo}</h3>
            <p class="mt-4 text-stone-600 leading-relaxed font-sans">${m.relato}</p>
            <div class="mt-6 flex justify-between items-center border-t pt-4">
                <span class="text-sm font-bold italic text-stone-500">— ${m.autor}</span>
                <button onclick="focarNoMapa(${m.lat}, ${m.lng})" class="text-amber-700 font-bold text-sm hover:underline">
                    <i class="fas fa-map-pin"></i> Ver no mapa
                </button>
            </div>
        </div>
    `).join('');

    // Adiciona pins permanentes
    memorias.forEach(m => {
        L.marker([m.lat, m.lng]).addTo(map)
            .bindPopup(`<b>${m.titulo}</b><br>${m.autor}`);
    });
}

function focarNoMapa(lat, lng) {
    map.setView([lat, lng], 18);
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

initMap();
