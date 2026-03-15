<template>
  <div class="requests-container">

    <!-- HEADER -->
    <div class="requests-header">
      <div>
        <h2>Solicitudes disponibles</h2>
        <p class="subtitle">Solicitudes en tu ciudad y servicio</p>
      </div>
      <div class="live-badge">
        <span class="live-dot"></span>
        En vivo
      </div>
    </div>

    <!-- MAPA -->
    <div id="pro-map" ref="mapRef"></div>

    <!-- LISTA DE SOLICITUDES -->
    <div class="requests-list">

      <div v-if="requests.length === 0" class="empty-state">
        <span>📭</span>
        <p>No hay solicitudes disponibles en tu zona</p>
        <small>Actualizando cada 5 segundos...</small>
      </div>

      <div
        v-for="req in requests"
        :key="req.id"
        class="request-card"
        :class="{ 'request-new': req.isNew }"
      >

        <div class="request-top">
          <div class="request-service">🔧 {{ req.service_name }}</div>
          <div class="request-budget">${{ req.budget }}</div>
        </div>

        <p class="request-description">{{ req.description }}</p>

        <div class="request-meta">
          <span>📅 {{ req.service_date }} {{ req.service_time }}</span>
          <span v-if="req.address">📍 {{ req.address }}</span>
        </div>

        <div class="request-footer">
          <div class="client-info">
            <img
              :src="'https://api.dicebear.com/7.x/avataaars/svg?seed=' + req.client_name"
              class="client-avatar"
            />
            <span>{{ req.client_name }}</span>
          </div>
          <button
            class="btn-accept"
            @click="acceptRequest(req)"
            :disabled="accepting === req.id"
          >
            {{ accepting === req.id ? 'Aceptando...' : '✅ Aceptar' }}
          </button>
        </div>

      </div>

    </div>

  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue"
import L from "leaflet"
import "leaflet/dist/leaflet.css"
import api from "@/services/api"

/* ======================= */
/* STATES                  */
/* ======================= */
const mapRef   = ref(null)
const requests = ref([])
const accepting = ref(null)

let map         = null
let markers     = []
let pollRequests = null
let cityCenter  = { lat: 4.7110, lng: -74.0721 }
let previousIds = []

/* ======================= */
/* RANDOM POSITION         */
/* ======================= */
const randomNearby = (lat, lng, radiusKm = 5) => {
  const r = radiusKm / 111
  const u = Math.random()
  const v = Math.random()
  const w = r * Math.sqrt(u)
  const t = 2 * Math.PI * v
  return {
    lat: lat + w * Math.cos(t),
    lng: lng + w * Math.sin(t),
  }
}

/* ======================= */
/* CLIENT ICON             */
/* ======================= */
const createClientIcon = () => {
  return L.divIcon({
    className: '',
    html: `
      <div class="client-marker">
        <div class="client-ring"></div>
        <div class="client-core">👤</div>
      </div>
    `,
    iconSize:   [30, 30],
    iconAnchor: [15, 15],
  })
}

/* ======================= */
/* INIT MAP                */
/* ======================= */
const initMap = async () => {
  try {
    const profile = await api.get("/professional/dashboard")
    const cityId  = profile.data.professional?.city_id

    if (cityId) {
      const res  = await api.get(`/cities/${cityId}`)
      const city = res.data
      cityCenter = {
        lat: city.lat || 4.7110,
        lng: city.lng || -74.0721,
      }
    }
  } catch (e) {
    console.warn("Usando coordenadas por defecto")
  }

  map = L.map(mapRef.value).setView(
    [cityCenter.lat, cityCenter.lng],
    13
  )

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "© OpenStreetMap"
  }).addTo(map)
}

/* ======================= */
/* LOAD REQUESTS           */
/* ======================= */
const loadRequests = async () => {
  try {
    const res = await api.get("/professional/requests/available")

    const newData = res.data.map(req => ({
      ...req,
      isNew: !previousIds.includes(req.id)
    }))

    previousIds = res.data.map(r => r.id)
    requests.value = newData

    // Limpiar markers
    markers.forEach(m => map.removeLayer(m))
    markers = []

    // Marker por cada solicitud
    newData.forEach(req => {
      const pos = randomNearby(cityCenter.lat, cityCenter.lng, 5)

      const marker = L.marker([pos.lat, pos.lng], { icon: createClientIcon() })
        .addTo(map)
        .bindPopup(`
          <div style="min-width:160px; padding:4px">
            <strong style="font-size:13px">${req.service_name || 'Servicio'}</strong><br>
            <span style="color:#64748b; font-size:12px">${req.description?.substring(0, 60)}...</span><br>
            <strong style="color:#2563eb">$${req.budget}</strong>
          </div>
        `)

      markers.push(marker)
    })

  } catch (error) {
    console.error(error)
  }
}

/* ======================= */
/* ACCEPT REQUEST          */
/* ======================= */
const acceptRequest = async (req) => {
  try {
    accepting.value = req.id

    await api.post(`/professional/requests/${req.id}/accept`)

    // Quitar de la lista inmediatamente
    requests.value = requests.value.filter(r => r.id !== req.id)

    alert(`✅ Solicitud aceptada. Contacta al cliente para coordinar.`)

  } catch (error) {
    if (error.response?.status === 404) {
      alert("Esta solicitud ya fue tomada por otro profesional")
      loadRequests()
    } else {
      alert("Error al aceptar la solicitud")
    }
  } finally {
    accepting.value = null
  }
}

/* ======================= */
/* LIFECYCLE               */
/* ======================= */
onMounted(async () => {
  await initMap()
  await loadRequests()
  pollRequests = setInterval(loadRequests, 5000)
})

onUnmounted(() => {
  clearInterval(pollRequests)
  if (map) map.remove()
})
</script>

<style scoped>
.requests-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

/* HEADER */
.requests-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.requests-header h2 {
  font-size: 22px;
  font-weight: 800;
  margin: 0 0 4px;
}

.subtitle {
  font-size: 13px;
  color: #64748b;
  margin: 0;
}

.live-badge {
  display: flex;
  align-items: center;
  gap: 6px;
  background: #dcfce7;
  color: #166534;
  font-size: 12px;
  font-weight: 700;
  padding: 6px 12px;
  border-radius: 20px;
}

.live-dot {
  width: 8px;
  height: 8px;
  background: #16a34a;
  border-radius: 50%;
  animation: livePulse 1.2s infinite;
}

@keyframes livePulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50%       { opacity: 0.4; transform: scale(1.4); }
}

/* MAPA */
#pro-map {
  height: 320px;
  width: 100%;
  border-radius: 16px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
}

/* LISTA */
.requests-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.empty-state {
  text-align: center;
  padding: 40px;
  color: #94a3b8;
  background: #f8fafc;
  border-radius: 14px;
}

.empty-state span { font-size: 36px; display: block; margin-bottom: 8px; }
.empty-state small { font-size: 12px; }

/* REQUEST CARD */
.request-card {
  background: white;
  border: 2px solid #e2e8f0;
  border-radius: 16px;
  padding: 18px;
  transition: 0.3s;
}

.request-new {
  border-color: #2563eb;
  box-shadow: 0 0 0 3px rgba(37,99,235,0.1);
  animation: cardPop 0.4s ease;
}

@keyframes cardPop {
  0%   { transform: scale(0.97); }
  60%  { transform: scale(1.01); }
  100% { transform: scale(1); }
}

.request-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.request-service {
  font-weight: 700;
  font-size: 15px;
}

.request-budget {
  font-weight: 800;
  font-size: 18px;
  color: #2563eb;
}

.request-description {
  font-size: 13px;
  color: #475569;
  margin: 0 0 10px;
}

.request-meta {
  display: flex;
  gap: 16px;
  font-size: 12px;
  color: #64748b;
  margin-bottom: 14px;
}

.request-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.client-info {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  font-weight: 600;
}

.client-avatar {
  width: 32px;
  height: 32px;
  border-radius: 8px;
}

.btn-accept {
  background: linear-gradient(135deg, #16a34a, #22c55e);
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 10px;
  font-weight: 700;
  cursor: pointer;
  transition: 0.3s;
}

.btn-accept:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(22,163,74,0.3);
}

.btn-accept:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

/* MARKER CLIENTE */
:global(.client-marker) {
  position: relative;
  width: 30px;
  height: 30px;
}

:global(.client-core) {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 24px;
  height: 24px;
  background: #f59e0b;
  border: 2px solid white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  z-index: 2;
  box-shadow: 0 2px 6px rgba(245,158,11,0.5);
}

:global(.client-ring) {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 40px;
  height: 40px;
  background: rgba(245, 158, 11, 0.3);
  border-radius: 50%;
  animation: clientPulse 1.5s ease-out infinite;
  z-index: 1;
}

@keyframes clientPulse {
  0%   { transform: translate(-50%, -50%) scale(0.5); opacity: 1; }
  100% { transform: translate(-50%, -50%) scale(2);   opacity: 0; }
}
</style>