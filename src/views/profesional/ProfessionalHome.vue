<template>

  <!-- ALERTA PERFIL -->
  <div
    v-if="needsProfileCompletion"
    class="profile-warning"
  >
    <h3>⚠️ Completa tu perfil profesional</h3>
    <p>
      Para comenzar a recibir solicitudes de trabajo debes completar tu
      información profesional.
    </p>

    <button 
      @click="$router.push({ name: 'ProfileProfesional' })"
      class="complete-btn">
      Completar ahora
    </button>
  </div>

  <!-- RESUMEN GANANCIAS -->
  <div class="earnings-section">
    <div class="earnings-card main">
      <div class="earnings-label">Ganancias Este Mes</div>
      <div class="earnings-amount">$3,280</div>
      <div class="earnings-change positive">
        +18.5% vs mes anterior
      </div>
    </div>
  </div>

  <!-- SOLICITUDES DE TRABAJO -->
  <div class="section">
    <h2 class="section-title">📩 Solicitudes de Trabajo</h2>

    <div v-if="jobRequests.length === 0" class="empty-state">
      No tienes solicitudes pendientes.
    </div>

    <div class="jobs-grid">
      <div
        v-for="job in jobRequests"
        :key="job.id"
        class="job-card"
      >
        <div class="job-header">
          <h3>{{ job.title }}</h3>
          <span class="job-price">${{ job.price }}</span>
        </div>

        <p class="job-description">
          {{ job.description }}
        </p>

        <div class="job-footer">
          <span class="job-client">👤 {{ job.client }}</span>

          <div class="job-actions">
            <button class="btn accept">Aceptar</button>
            <button class="btn reject">Rechazar</button>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- TRABAJOS EN CURSO -->
  <div class="section">
    <h2 class="section-title">🔧 Trabajos en Curso</h2>

    <div v-if="activeJobs.length === 0" class="empty-state">
      No tienes trabajos activos actualmente.
    </div>

    <div class="jobs-grid">
      <div
        v-for="job in activeJobs"
        :key="job.id"
        class="job-card active"
      >
        <div class="job-header">
          <h3>{{ job.title }}</h3>
          <span class="job-status">En progreso</span>
        </div>

        <p class="job-description">
          {{ job.description }}
        </p>

        <div class="job-footer">
          <span class="job-client">👤 {{ job.client }}</span>

          <button class="btn complete">
            Marcar como completado
          </button>
        </div>
      </div>
    </div>
  </div>
</template>


<script setup>
import { ref, onMounted } from "vue";
import professionalService from "@/services/professionalService";

const professional = ref(null);
const needsProfileCompletion = ref(false);
const loading = ref(true);
const jobRequests = ref([
  {
    id: 1,
    title: "Instalación de ducha eléctrica",
    description: "Necesito instalar una ducha en departamento.",
    price: 120,
    client: "María López"
  },
  {
    id: 2,
    title: "Reparación de tubería",
    description: "Hay fuga en cocina, revisar y reparar.",
    price: 90,
    client: "Carlos Ruiz"
  }
])

const activeJobs = ref([
  {
    id: 3,
    title: "Cambio de llave general",
    description: "Reemplazo de llave principal de agua.",
    client: "Ana Torres"
  }
])

const loadDashboard = async () => {
  try {
    const { data } = await professionalService.getDashboard();
    professional.value = data.professional;
    needsProfileCompletion.value = data.needs_profile_completion;
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
};

onMounted(loadDashboard);
</script>

<style>
.section {
  margin-top: 40px;
}

.section-title {
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 20px;
}

.jobs-grid {
  display: grid;
  gap: 20px;
}

.job-card {
  background: #fff;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0,0,0,0.05);
}

.job-card.active {
  border-left: 5px solid #4CAF50;
}

.job-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
}

.job-price {
  font-weight: bold;
  color: #2196F3;
}

.job-status {
  font-size: 13px;
  background: #e8f5e9;
  padding: 5px 10px;
  border-radius: 20px;
}

.job-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 15px;
}

.btn {
  padding: 6px 12px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

.btn.accept {
  background: #4CAF50;
  color: white;
}

.btn.reject {
  background: #f44336;
  color: white;
}

.btn.complete {
  background: #2196F3;
  color: white;
}

.empty-state {
  padding: 20px;
  background: #f5f5f5;
  border-radius: 8px;
  text-align: center;
  color: #777;
}
</style>