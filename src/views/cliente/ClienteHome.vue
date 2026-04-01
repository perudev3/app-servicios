<template>
  <div class="client-dashboard">

    <!-- ====================== -->
    <!-- CATEGORIAS -->
    <!-- ====================== -->
    <div class="section">
      <h2 class="section-title">Categorías</h2>
      <div class="categories-grid">
        <div v-for="cat in categories" :key="cat.id" class="category-card"
          :class="{ active: selectedCategory?.id === cat.id }" @click="selectCategory(cat)">
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
    <!-- MODAL SOLICITUD -->
    <!-- ====================== -->
    <div v-if="showRequestModal" class="modal-overlay">
      <div class="modal">

        <h3>Solicitar {{ selectedService?.name }}</h3>

        <textarea v-model="form.description" placeholder="Describe lo que necesitas"></textarea>

        <!-- SOLO SI ES CAPACITACION -->
        <div v-if="selectedCategory?.name === 'Capacitación'" class="people-box">

          <label class="input-label">👥 Número de personas a capacitar</label>

          <input type="number" v-model="form.people_count" min="1" placeholder="Ej: 10 personas" />

          <small class="hint">
            El costo se calcula automáticamente según la cantidad de personas
          </small>

        </div>

        <input v-model="form.address" placeholder="Dirección exacta (calle, número, zona)" />

        <input v-model="form.reference" placeholder="Referencia (ej: frente a colegio, edificio azul)" />

        <select v-model="form.city_id">
          <option value="" disabled>Selecciona una ciudad</option>
          <option v-for="city in cities" :key="city.id" :value="city.id">
            {{ city.name }} — {{ city.department }}
          </option>
        </select>

        <input type="date" v-model="form.service_date" />
        <input type="time" v-model="form.service_time" />

        <!-- PRECIO DINÁMICO -->
        <div class="price-box">

          <div>
            Precio por persona:
            <strong>${{ selectedService?.price }}</strong>
          </div>

          <div>
            Tu precio por persona:
            <strong>${{ form.budget }}</strong>
          </div>

          <div>
            Personas:
            <strong>{{ form.people_count || 1 }}</strong>
          </div>

          <div class="total-price">
            Total a pagar:
            <strong>${{ totalPrice }}</strong>
          </div>

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

/* ======================= */
/* STATES                  */
/* ======================= */
const categories = ref([])
const services = ref([])
const allServices = ref([])
const cities = ref([])
const selectedCategory = ref(null)
const selectedService = ref(null)
const showRequestModal = ref(false)
const showMap = ref(false)
const activeRequest = ref(null)
const sending = ref(false)

const form = ref({
  description: "",
  address: "",
  reference: "",
  city_id: "",
  service_date: "",
  service_time: "",
  budget: "",
  people_count: 1
})

const totalPrice = computed(() => {
  if (!selectedService.value) return 0

  const people = parseInt(form.value.people_count || 1)
  const price = parseFloat(form.value.budget || 0)

  if (!people || !price) return 0

  return people * price
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

  if (selectedCategory.value.name === 'CAPACITACIÓN') {
    if (!form.value.people_count || form.value.people_count <= 0) {
      alert("Debes ingresar la cantidad de personas a capacitar")
      return
    }
  }

  try {
    sending.value = true

    const res = await api.post("/client/service-request", {
      category_id: selectedCategory.value.id,
      service_id: selectedService.value.id,
      description: form.value.description,
      address: form.value.address,
      reference: form.value.reference,
      city_id: form.value.city_id,
      service_date: form.value.service_date,
      service_time: form.value.service_time,
      people_count: form.value.people_count,
      budget: totalPrice.value
    })

    // Guardar solicitud y mostrar mapa
    activeRequest.value = res.data.data
    showRequestModal.value = false
    //showMap.value = true

    // Reset form
    form.value = {
      description: "",
      address: "",
      city_id: "",
      service_date: "",
      service_time: "",
      budget: ""
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

.categories-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 14px;
}

.category-card {
  background: white;
  border-radius: 14px;
  padding: 16px;
  text-align: center;
  cursor: pointer;
  transition: all .25s ease;
  border: 1.5px solid #e2e8f0;
  position: relative;
}

.category-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.08);
  border-color: #2563eb;
}

.category-card.active {
  background: linear-gradient(135deg, #2563eb, #1d4ed8);
  color: white;
  border-color: transparent;
}

.category-icon {
  font-size: 26px;
  margin-bottom: 6px;
}

.category-name {
  font-weight: 700;
  font-size: 13px;
}

/* SERVICIOS */
.services-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.services-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 18px;
}

.service-card {
  background: white;
  border-radius: 16px;
  padding: 18px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  border: 1.5px solid #e2e8f0;
  transition: all .25s ease;
  position: relative;
}

.service-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 24px rgba(0, 0, 0, 0.08);
  border-color: #2563eb;
}

.service-card h3 {
  font-size: 15px;
  font-weight: 800;
  margin-bottom: 6px;
}

.service-card p {
  font-size: 13px;
  color: #64748b;
}

.service-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 14px;
}

.service-price {
  font-size: 18px;
  font-weight: 800;
  color: #16a34a;
}

.btn-primary {
  background: linear-gradient(135deg, #2563eb, #1d4ed8);
  color: white;
  border: none;
  padding: 8px 14px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
  transition: .2s;
}

.btn-primary:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.4);
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
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
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

.modal textarea {
  resize: none;
}

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
  .categories-grid {
    grid-template-columns: repeat(3, 1fr);
  }

  .services-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media(max-width:600px) {
  .categories-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .services-grid {
    grid-template-columns: 1fr;
  }
}


.price-box {
  background: #f1f5f9;
  padding: 12px;
  border-radius: 10px;
  font-size: 14px;
  margin-top: 10px;
}

.modal h3 {
  font-weight: 800;
  color: #1e293b;
}

.modal input,
.modal textarea,
.modal select {
  border: 1px solid #e2e8f0;
  transition: .2s;
}

.modal input:focus,
.modal textarea:focus,
.modal select:focus {
  border-color: #2563eb;
  outline: none;
}

.people-box {
  background: #f8fafc;
  padding: 12px;
  border-radius: 10px;
}

.input-label {
  font-size: 13px;
  font-weight: 700;
  display: block;
  margin-bottom: 5px;
}

.hint {
  font-size: 12px;
  color: #64748b;
}

.total-price {
  margin-top: 5px;
  font-size: 16px;
  color: #16a34a;
}
</style>