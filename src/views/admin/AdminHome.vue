<template v-else>

  <!-- Loading -->
  <div v-if="loadingStats" class="loading-overlay">
    <div class="loading-spinner"></div>
    <p>Cargando estadísticas...</p>
  </div>

  <!-- Error -->
  <div v-if="apiError" class="api-error-banner">
    ⚠️ {{ apiError }}
  </div>

  <!-- ALERTA -->
  <div v-if="stats.pendingProfessionals > 0" class="alert-banner">
    ⚠️ {{ stats.pendingProfessionals }} profesionales pendientes de aprobación
  </div>

  <!-- MAIN STATS -->
  <div class="main-stats-grid" v-if="!loadingStats">

    <div class="main-stat-card">
      <span class="stat-icon">👥</span>
      <div class="stat-value">{{ stats.totalUsers }}</div>
      <div class="stat-label">Usuarios</div>
    </div>

    <div class="main-stat-card">
      <span class="stat-icon">💼</span>
      <div class="stat-value">{{ stats.totalProfessionals }}</div>
      <div class="stat-label">Profesionales</div>
    </div>

    <div class="main-stat-card">
      <span class="stat-icon">👤</span>
      <div class="stat-value">{{ stats.totalClients }}</div>
      <div class="stat-label">Clientes</div>
    </div>

    <div class="main-stat-card">
      <span class="stat-icon">🟢</span>
      <div class="stat-value">{{ stats.activeUsers }}</div>
      <div class="stat-label">Activos</div>
    </div>

  </div>

  <!-- HEALTH -->
  <div class="health-grid">

    <div class="health-card success">
      <span>✔</span>
      <div>
        <div class="health-title">Activos</div>
        <div class="health-value">{{ stats.activeUsers }}</div>
      </div>
    </div>

    <div class="health-card warning">
      <span>⏳</span>
      <div>
        <div class="health-title">Pendientes</div>
        <div class="health-value">{{ stats.pendingProfessionals }}</div>
      </div>
    </div>

    <div class="health-card danger">
      <span>🚫</span>
      <div>
        <div class="health-title">Inactivos</div>
        <div class="health-value">{{ stats.inactiveUsers }}</div>
      </div>
    </div>

    <div class="health-card info">
      <span>📊</span>
      <div>
        <div class="health-title">Conversión</div>
        <div class="health-value">{{ conversionRate }}%</div>
      </div>
    </div>

  </div>

  <!-- USUARIOS RECIENTES -->
  <div class="section-card">
    <div class="card-header">
      <h3>Usuarios Recientes</h3>
    </div>

    <div v-if="loadingUsers">Cargando...</div>

    <div v-else>
      <div v-for="user in recentUsers" :key="user.id" class="user-item">
        <img :src="`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`" />
        <div>
          <div>{{ user.name }}</div>
          <small>{{ roleMap[user.role] }}</small>
        </div>
        <span :class="user.email_verified_at ? 'status-ok' : 'status-pending'">
          {{ user.email_verified_at ? 'Activo' : 'Pendiente' }}
        </span>
      </div>
    </div>
  </div>

</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import api from '@/services/api'

const loadingStats = ref(false)
const loadingUsers = ref(false)
const apiError = ref('')

const stats = ref({
  totalUsers: 0,
  totalClients: 0,
  totalProfessionals: 0,
  activeUsers: 0,
  inactiveUsers: 0,
  pendingProfessionals: 0,
})

const recentUsers = ref([])

const roleMap = {
  client: 'Cliente',
  professional: 'Profesional'
}

const conversionRate = computed(() => {
  if (!stats.value.totalUsers) return 0
  return Math.round(
    (stats.value.totalProfessionals / stats.value.totalUsers) * 100
  )
})

const fetchStats = async () => {
  loadingStats.value = true
  try {
    const { data } = await api.get('/admin/stats')
    if (data.success) stats.value = data.stats
  } catch {
    apiError.value = 'Error cargando estadísticas'
  } finally {
    loadingStats.value = false
  }
}

const fetchRecentUsers = async () => {
  loadingUsers.value = true
  try {
    const { data } = await api.get('/admin/users?per_page=5')
    if (data.success) recentUsers.value = data.users.data
  } catch {
    recentUsers.value = []
  } finally {
    loadingUsers.value = false
  }
}

onMounted(() => {
  fetchStats()
  fetchRecentUsers()
})
</script>


<style>
.main-stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
}

.main-stat-card {
  background: white;
  padding: 16px;
  border-radius: 14px;
  text-align: center;
  box-shadow: 0 2px 6px rgba(0,0,0,.05);
}

.stat-icon {
  font-size: 22px;
}

.stat-value {
  font-size: 22px;
  font-weight: bold;
}

.stat-label {
  font-size: 12px;
  color: #64748b;
}

.health-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
  margin-top: 15px;
}

.health-card {
  display: flex;
  gap: 10px;
  padding: 12px;
  border-radius: 12px;
  background: white;
}

.success { border-left: 4px solid #22c55e; }
.warning { border-left: 4px solid #f59e0b; }
.danger  { border-left: 4px solid #ef4444; }
.info    { border-left: 4px solid #3b82f6; }

.alert-banner {
  background: #fef3c7;
  padding: 10px;
  border-radius: 8px;
  margin-bottom: 12px;
}

.user-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 0;
}

.user-item img {
  width: 35px;
  border-radius: 8px;
}

.status-ok {
  color: #16a34a;
  font-weight: bold;
}

.status-pending {
  color: #d97706;
}
</style>