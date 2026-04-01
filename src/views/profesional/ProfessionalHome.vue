<template>

<div class="dashboard-container">

  <!-- ALERTA PERFIL -->
  <div v-if="needsProfileCompletion" class="profile-warning">
    <div class="warning-content">
      <div class="warning-icon">⚠️</div>

      <div class="warning-text">
        <h3>Completa tu perfil profesional</h3>
        <p>
          Para comenzar a recibir solicitudes de trabajo debes completar tu
          información profesional.
        </p>
      </div>

      <button
        @click="$router.push({ name: 'ProfileProfesional' })"
        class="complete-btn"
      >
        Completar perfil
      </button>
    </div>
  </div>

  <!-- GANANCIAS -->
  <div class="earnings-grid">

    <div class="earnings-card main">
      <div class="earnings-label">Ganancias Este Mes</div>
      <div class="earnings-amount">$3,280</div>
      <div class="earnings-change positive">
        +18.5% vs mes anterior
      </div>
    </div>

  </div>

  <ProfessionalRequests />

  <!-- TRABAJOS ACTIVOS -->
  <div class="section">

    <div class="section-header">
      <h2>🔧 Trabajos en Curso</h2>
    </div>

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

          <span class="job-client">
            👤 {{ job.client }}
          </span>

          <button class="btn complete">
            Marcar como completado
          </button>

        </div>

      </div>

    </div>

  </div>

</div>

</template>

<script setup>

import { ref, onMounted } from "vue";
import professionalService from "@/services/professionalService";
import ProfessionalRequests from "./ProfessionalRequests.vue"

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

    const { data } = await professionalService.getDashboard()

    professional.value = data.professional
    needsProfileCompletion.value = data.needs_profile_completion

  } catch (error) {

    console.error(error)

  } finally {

    loading.value = false

  }
}

onMounted(loadDashboard)

</script>

<style scoped>

.dashboard-container{
max-width:1200px;
margin:auto;
padding:20px;
}

/* ALERTA PERFIL */

.profile-warning{
background:#fff3cd;
border:1px solid #ffe69c;
padding:20px;
border-radius:12px;
margin-bottom:30px;
}

.warning-content{
display:flex;
align-items:center;
gap:20px;
flex-wrap:wrap;
}

.warning-icon{
font-size:28px;
}

.warning-text h3{
margin:0;
font-size:18px;
}

.warning-text p{
margin:4px 0 0;
font-size:14px;
color:#555;
}

.complete-btn{
background:#2563eb;
color:white;
border:none;
padding:10px 18px;
border-radius:8px;
cursor:pointer;
font-weight:600;
}

/* GANANCIAS */

.earnings-grid{
display:grid;
grid-template-columns:repeat(auto-fit,minmax(250px,1fr));
gap:20px;
margin-bottom:30px;
}

.earnings-card{
background:white;
border-radius:14px;
padding:25px;
box-shadow:0 4px 14px rgba(0,0,0,0.05);
}

.earnings-label{
font-size:14px;
color:#666;
}

.earnings-amount{
font-size:32px;
font-weight:700;
margin:8px 0;
}

.earnings-change{
font-size:13px;
}

.earnings-change.positive{
color:#16a34a;
}

/* SECCIONES */

.section{
margin-top:30px;
}

.section-header{
margin-bottom:15px;
}

.section-header h2{
font-size:20px;
}

/* JOB GRID */

.jobs-grid{
display:grid;
grid-template-columns:repeat(2,1fr);
gap:20px;
}

/* JOB CARD */

.job-card{
background:white;
padding:20px;
border-radius:12px;
box-shadow:0 4px 10px rgba(0,0,0,0.05);
transition:.3s;
}

.job-card:hover{
transform:translateY(-3px);
}

.job-card.active{
border-left:5px solid #22c55e;
}

/* HEADER */

.job-header{
display:flex;
justify-content:space-between;
margin-bottom:10px;
align-items:center;
}

.job-price{
font-weight:700;
color:#2563eb;
}

/* DESCRIPTION */

.job-description{
font-size:14px;
color:#555;
}

/* FOOTER */

.job-footer{
display:flex;
justify-content:space-between;
align-items:center;
margin-top:15px;
flex-wrap:wrap;
gap:10px;
}

.job-client{
font-size:14px;
color:#444;
}

/* BOTONES */

.btn{
padding:6px 12px;
border:none;
border-radius:6px;
cursor:pointer;
font-size:13px;
}

.btn.accept{
background:#22c55e;
color:white;
}

.btn.reject{
background:#ef4444;
color:white;
}

.btn.complete{
background:#2563eb;
color:white;
}

/* STATUS */

.job-status{
font-size:12px;
background:#e8f5e9;
padding:5px 10px;
border-radius:20px;
}

/* EMPTY */

.empty-state{
padding:20px;
background:#f5f5f5;
border-radius:8px;
text-align:center;
color:#777;
}

/* RESPONSIVE */

@media (max-width:900px){

.jobs-grid{
grid-template-columns:1fr;
}

.warning-content{
flex-direction:column;
align-items:flex-start;
}

}

@media (max-width:600px){

.dashboard-container{
padding:15px;
}

.earnings-amount{
font-size:26px;
}

.section-header h2{
font-size:18px;
}

}
</style>