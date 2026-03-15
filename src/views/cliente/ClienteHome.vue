<template>
  <div class="client-dashboard">

    <!-- ====================== -->
    <!-- CATEGORIAS -->
    <!-- ====================== -->
    <div class="section">
      <h2 class="section-title">Categorías</h2>
      <div class="categories-grid">
        <div v-for="cat in categories" :key="cat.id" class="category-card" @click="selectCategory(cat)">
          <div class="category-icon">🛠️</div>
          <div class="category-name">{{ cat.name }}</div>
        </div>
      </div>
    </div>

    <!-- ====================== -->
    <!-- SERVICIOS -->
    <!-- ====================== -->
    <div class="section" v-if="services.length">
      <h2 class="section-title">Servicios - {{ selectedCategory?.name }}</h2>
      <div class="services-grid">
        <div v-for="service in services" :key="service.id" class="service-card">
          <div>
            <h3>{{ service.name }}</h3>
            <p>{{ service.description || 'Servicio profesional disponible' }}</p>
          </div>
          <div class="service-footer">
            <span class="service-price">${{ service.price }}</span>
            <button class="btn-primary" @click="requestService(service)">Solicitar</button>
          </div>
        </div>
      </div>
    </div>

    <!-- ====================== -->
    <!-- MAPA POST-SOLICITUD -->
    <!-- ====================== -->
    <div v-if="showMap && activeRequest" class="section">
      <div class="map-header">
        <h2 class="section-title">Buscando profesional</h2>
        <button class="btn-cancel-map" @click="cancelSearch">✕ Cancelar búsqueda</button>
      </div>
      <ServiceRequestMap
        :requestId="activeRequest.id"
        :cityId="activeRequest.city_id"
        :serviceId="activeRequest.service_id"
        @accepted="onAccepted"
      />
    </div>

    <!-- ====================== -->
    <!-- MODAL SOLICITUD -->
    <!-- ====================== -->
    <div v-if="showRequestModal" class="modal-overlay">
      <div class="modal">

        <h3>Solicitar {{ selectedService?.name }}</h3>

        <textarea v-model="form.description" placeholder="Describe el problema o lo que necesitas"></textarea>

        <input v-model="form.address" placeholder="Dirección" />

        <select v-model="form.city_id">
          <option value="" disabled>Selecciona una ciudad</option>
          <option v-for="city in cities" :key="city.id" :value="city.id">
            {{ city.name }} — {{ city.department }}
          </option>
        </select>

        <input type="date" v-model="form.service_date" />

        <input type="time" v-model="form.service_time" />

        <input type="number" v-model="form.budget" placeholder="Presupuesto" />

        <div v-if="budgetError" class="error-text">
          El presupuesto mínimo para este servicio es ${{ selectedService?.price }}
        </div>

        <div class="price-info">
          Precio promedio del servicio: <strong>${{ selectedService?.price }}</strong>
        </div>

        <div class="modal-actions">
          <button class="btn-primary" @click="sendRequest" :disabled="budgetError || sending">
            {{ sending ? "Enviando..." : "Enviar solicitud" }}
          </button>
          <button class="btn-cancel" @click="showRequestModal = false">Cancelar</button>
        </div>

      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue"
import api from "@/services/api"
import categoryService from "@/services/categoryService"
import ServiceRequestMap from "./ServiceRequestMap.vue"

/* ======================= */
/* STATES                  */
/* ======================= */
const categories      = ref([])
const services        = ref([])
const allServices     = ref([])
const cities          = ref([])
const selectedCategory = ref(null)
const selectedService  = ref(null)
const showRequestModal = ref(false)
const showMap          = ref(false)
const activeRequest    = ref(null)
const sending          = ref(false)

const form = ref({
  description:  "",
  address:      "",
  city_id:      "",
  service_date: "",
  service_time: "",
  budget:       ""
})

const budgetError = computed(() => {
  if (!form.value.budget) return false
  return parseFloat(form.value.budget) < parseFloat(selectedService.value?.price || 0)
})

/* ======================= */
/* LOADERS                 */
/* ======================= */
const loadCategories = async () => {
  try {
    const res = await categoryService.getAllProfesional()
    categories.value = res.data
  } catch (error) {
    console.error(error)
  }
}

const loadServices = async () => {
  try {
    const res = await api.get("/services")
    allServices.value = res.data
  } catch (error) {
    console.error(error)
  }
}

const loadCities = async () => {
  const res = await api.get("/cities")
  cities.value = res.data
}

/* ======================= */
/* SELECT CATEGORY         */
/* ======================= */
const selectCategory = (cat) => {
  selectedCategory.value = cat
  services.value = allServices.value.filter(s => s.category_id === cat.id)
}

/* ======================= */
/* OPEN REQUEST MODAL      */
/* ======================= */
const requestService = (service) => {
  selectedService.value = service
  form.value.budget = service.price
  showRequestModal.value = true
}

/* ======================= */
/* SEND REQUEST            */
/* ======================= */
const sendRequest = async () => {

  if (!form.value.city_id) {
    alert("Selecciona una ciudad")
    return
  }

  if (!form.value.budget) {
    alert("Debes ingresar un presupuesto")
    return
  }

  if (parseFloat(form.value.budget) < parseFloat(selectedService.value.price)) {
    alert(`El presupuesto mínimo para este servicio es $${selectedService.value.price}`)
    return
  }

  try {
    sending.value = true

    const res = await api.post("/client/service-request", {
      category_id:  selectedCategory.value.id,
      service_id:   selectedService.value.id,
      description:  form.value.description,
      address:      form.value.address,
      city_id:      form.value.city_id,
      service_date: form.value.service_date,
      service_time: form.value.service_time,
      budget:       form.value.budget
    })

    // Guardar solicitud y mostrar mapa
    activeRequest.value = res.data.data
    showRequestModal.value = false
    showMap.value = true

    // Reset form
    form.value = {
      description:  "",
      address:      "",
      city_id:      "",
      service_date: "",
      service_time: "",
      budget:       ""
    }

  } catch (error) {
    console.error(error)
    alert("Error al enviar la solicitud")
  } finally {
    sending.value = false
  }
}

/* ======================= */
/* MAP EVENTS              */
/* ======================= */
const onAccepted = (professional) => {
  alert(`✅ ¡${professional.name} aceptó tu solicitud!\n📞 ${professional.phone}`)
  showMap.value = false
  activeRequest.value = null
}

const cancelSearch = () => {
  showMap.value = false
  activeRequest.value = null
}

/* ======================= */
/* INIT                    */
/* ======================= */
onMounted(() => {
  loadCategories()
  loadServices()
  loadCities()
})
</script>

<style scoped>
.client-dashboard {
  display: flex;
  flex-direction: column;
  gap: 40px;
}

.section {
  background: white;
  padding: 25px;
  border-radius: 16px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.section-title {
  font-size: 22px;
  font-weight: 800;
  margin-bottom: 20px;
}

/* MAP HEADER */
.map-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0;
}

.map-header .section-title {
  margin-bottom: 0;
}

.btn-cancel-map {
  background: #fee2e2;
  color: #991b1b;
  border: none;
  padding: 8px 16px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  font-size: 13px;
}

/* CATEGORIAS */
.categories-grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 15px;
}

.category-card {
  background: #f8fafc;
  border-radius: 12px;
  padding: 20px;
  text-align: center;
  cursor: pointer;
  transition: .3s;
}

.category-card:hover {
  background: #2563eb;
  color: white;
}

.category-icon {
  font-size: 30px;
  margin-bottom: 8px;
}

.category-name { font-weight: 700; }

/* SERVICIOS */
.services-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.service-card {
  background: #f8fafc;
  border-radius: 14px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.service-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 15px;
}

.service-price {
  font-weight: 800;
  color: #2563eb;
}

.btn-primary {
  background: #2563eb;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 8px;
  cursor: pointer;
}

.btn-cancel {
  background: #e5e7eb;
  border: none;
  padding: 8px 16px;
  border-radius: 8px;
  cursor: pointer;
}

/* MODAL */
.modal-overlay {
  position: fixed;
  top: 0; left: 0;
  width: 100%; height: 100%;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
}

.modal {
  background: white;
  padding: 25px;
  border-radius: 14px;
  width: 350px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.modal textarea,
.modal input,
.modal select {
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
  background: white;
  width: 100%;
}

.modal textarea { resize: none; }

.modal-actions {
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
}

.error-text {
  color: #ef4444;
  font-size: 13px;
  margin-top: -5px;
}

.price-info {
  font-size: 13px;
  color: #64748b;
}

/* RESPONSIVE */
@media(max-width:1100px) {
  .categories-grid { grid-template-columns: repeat(3, 1fr); }
  .services-grid   { grid-template-columns: repeat(2, 1fr); }
}

@media(max-width:600px) {
  .categories-grid { grid-template-columns: repeat(2, 1fr); }
  .services-grid   { grid-template-columns: 1fr; }
}
</style>