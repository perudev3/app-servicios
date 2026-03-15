<template>
  <div class="map-container">

    <!-- ESTADO DE LA SOLICITUD -->
    <div class="status-bar" :class="statusClass">
      <span class="status-icon">{{ statusIcon }}</span>
      <div>
        <strong>{{ statusText }}</strong>
        <p v-if="professional">
          {{ professional.name }} — {{ professional.phone }}
        </p>
      </div>
      <div v-if="status === 'pending'" class="pulse-dot"></div>
    </div>

    <!-- MAPA -->
    <div id="map" ref="mapRef"></div>

    <!-- PROFESIONALES DISPONIBLES -->
    <div class="professionals-list">
      <h3>Profesionales disponibles en tu ciudad</h3>
      <p class="subtitle">
        {{ professionals.length > 0 ? `${professionals.length} profesional(es) encontrado(s)` : 'Buscando profesionales para tu solicitud...' }}
      </p>

      <div v-if="professionals.length === 0" class="empty-state">
        <span>🔍</span>
        <p>Buscando profesionales cercanos...</p>
      </div>

      <div v-for="pro in professionals" :key="pro.id" class="pro-card">
        <img
          :src="pro.photo || 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + pro.name"
          class="pro-avatar"
        />
        <div class="pro-info">
          <strong>{{ pro.name }}</strong>
          <span>{{ pro.service }}</span>
        </div>
        <div class="pro-badge">Disponible</div>
      </div>

    </div>

  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from "vue"
import L from "leaflet"
import "leaflet/dist/leaflet.css"
import api from "@/services/api"

const props = defineProps({
  requestId: { type: Number, required: true },
  cityId:    { type: Number, required: true },
  serviceId: { type: Number, required: true },
})

const emit = defineEmits(["accepted"])

/* ======================= */
/* STATES                  */
/* ======================= */
const mapRef        = ref(null)
const status        = ref("pending")
const professional  = ref(null)
const professionals = ref([])

let map        = null
let markers    = []
let pollStatus = null
let pollPros   = null
let cityCenter = { lat: 4.7110, lng: -74.0721 } // fallback Bogotá

/* ======================= */
/* COMPUTED                */
/* ======================= */
const statusText = computed(() => {
  if (status.value === "pending")  return "Buscando profesional..."
  if (status.value === "accepted") return "¡Profesional asignado!"
  return "Procesando..."
})

const statusIcon = computed(() => {
  if (status.value === "pending")  return "🔍"
  if (status.value === "accepted") return "✅"
  return "⏳"
})

const statusClass = computed(() => ({
  "status-pending":  status.value === "pending",
  "status-accepted": status.value === "accepted",
}))

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
/* PULSE ICON              */
/* ======================= */
const createPulseIcon = () => {
  return L.divIcon({
    className: '',
    html: `
      <div class="pulse-marker">
        <div class="pulse-ring"></div>
        <div class="pulse-core"></div>
      </div>
    `,
    iconSize:   [20, 20],
    iconAnchor: [10, 10],
  })
}

/* ======================= */
/* INIT MAP                */
/* ======================= */
const initMap = async () => {
  try {
    const res = await api.get(`/cities/${props.cityId}`)
    const city = res.data
    cityCenter = {
      lat: city.lat || 4.7110,
      lng: city.lng || -74.0721,
    }
  } catch (e) {
    console.warn("No se encontraron coords de ciudad, usando Bogotá por defecto")
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
/* LOAD PROFESSIONALS      */
/* ======================= */
const loadProfessionals = async () => {
  try {
    const res = await api.get(`/client/professionals-available`, {
      params: {
        city_id:    props.cityId,
        service_id: props.serviceId,
      }
    })

    professionals.value = res.data

    // Limpiar markers anteriores
    markers.forEach(m => map.removeLayer(m))
    markers = []

    // Pintar marker aleatorio por cada profesional
    res.data.forEach(pro => {
      const pos = randomNearby(cityCenter.lat, cityCenter.lng, 5)

      const marker = L.marker([pos.lat, pos.lng], { icon: createPulseIcon() })
        .addTo(map)
        .bindPopup(`
          <div style="text-align:center; min-width:150px; padding:4px">
            <strong style="font-size:14px">${pro.name}</strong><br>
            <span style="color:#64748b; font-size:12px">${pro.service || ''}</span><br>
            <span style="font-size:12px">📞 ${pro.phone}</span>
          </div>
        `)

      markers.push(marker)
    })

  } catch (error) {
    console.error(error)
  }
}

/* ======================= */
/* POLLING STATUS          */
/* ======================= */
const checkStatus = async () => {
  try {
    const res = await api.get(`/client/service-request/${props.requestId}/status`)
    status.value = res.data.status

    if (res.data.status === "accepted") {
      professional.value = res.data.professional
      clearInterval(pollStatus)
      clearInterval(pollPros)
      emit("accepted", res.data.professional)
    }
  } catch (error) {
    console.error(error)
  }
}

/* ======================= */
/* LIFECYCLE               */
/* ======================= */
onMounted(async () => {
  await initMap()
  await loadProfessionals()
  pollStatus = setInterval(checkStatus, 4000)
  pollPros   = setInterval(loadProfessionals, 8000)
})

onUnmounted(() => {
  clearInterval(pollStatus)
  clearInterval(pollPros)
  if (map) map.remove()
})
</script>

<style scoped>
.map-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

/* MAPA */
#map {
  height: 380px;
  width: 100%;
  border-radius: 16px;
  z-index: 0;
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
}

/* STATUS BAR */
.status-bar {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 18px;
  border-radius: 14px;
  font-size: 14px;
}

.status-bar p {
  margin: 4px 0 0;
  font-size: 13px;
  opacity: 0.8;
}

.status-icon { font-size: 24px; }

.status-pending  { background: #fef9c3; color: #854d0e; }
.status-accepted { background: #dcfce7; color: #166534; }

/* PULSE STATUS DOT */
.pulse-dot {
  width: 12px;
  height: 12px;
  background: #f59e0b;
  border-radius: 50%;
  margin-left: auto;
  animation: pulse 1.2s infinite;
}

@keyframes pulse {
  0%, 100% { transform: scale(1);   opacity: 1; }
  50%       { transform: scale(1.5); opacity: 0.5; }
}

/* LISTA PROFESIONALES */
.professionals-list {
  background: white;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.05);
}

.professionals-list h3 {
  font-size: 16px;
  font-weight: 800;
  margin: 0 0 4px;
}

.subtitle {
  font-size: 13px;
  color: #64748b;
  margin-bottom: 16px;
}

.empty-state {
  text-align: center;
  padding: 30px;
  color: #94a3b8;
}

.empty-state span { font-size: 32px; }

/* PRO CARD */
.pro-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: #f8fafc;
  border-radius: 12px;
  margin-bottom: 10px;
}

.pro-avatar {
  width: 46px;
  height: 46px;
  border-radius: 12px;
  object-fit: cover;
}

.pro-info {
  display: flex;
  flex-direction: column;
  flex: 1;
}

.pro-info strong { font-size: 14px; }

.pro-info span {
  font-size: 12px;
  color: #64748b;
}

.pro-badge {
  background: #dcfce7;
  color: #166534;
  font-size: 11px;
  font-weight: 700;
  padding: 4px 10px;
  border-radius: 20px;
}

/* MARKER TITILANTE — :global porque Leaflet inyecta fuera del scoped */
:global(.pulse-marker) {
  position: relative;
  width: 20px;
  height: 20px;
}

:global(.pulse-core) {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 14px;
  height: 14px;
  background: #2563eb;
  border: 2px solid white;
  border-radius: 50%;
  box-shadow: 0 2px 6px rgba(37,99,235,0.5);
  z-index: 2;
}

:global(.pulse-ring) {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 30px;
  height: 30px;
  background: rgba(37, 99, 235, 0.3);
  border-radius: 50%;
  animation: markerPulse 1.5s ease-out infinite;
  z-index: 1;
}

@keyframes markerPulse {
  0%   { transform: translate(-50%, -50%) scale(0.5); opacity: 1; }
  100% { transform: translate(-50%, -50%) scale(2);   opacity: 0; }
}
</style>