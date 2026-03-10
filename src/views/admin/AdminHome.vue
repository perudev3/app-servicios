      <template v-else>
        <!-- Loading -->
        <div v-if="loadingStats" class="loading-overlay">
          <div class="loading-spinner"></div>
          <p>Cargando estadísticas...</p>
        </div>

        <!-- Error -->
        <div v-if="apiError" class="api-error-banner">
          <span>⚠️ {{ apiError }}</span>
          <button @click="apiError = ''" class="close-error">✕</button>
        </div>

        <!-- Stats Grid -->
        <div class="main-stats-grid" v-if="!loadingStats">
          <div class="main-stat-card users">
            <div class="stat-header">
              <div class="stat-icon-wrapper"><span>👥</span></div>
              <div class="stat-trend positive">+12.5%</div>
            </div>
            <div class="stat-value">{{ stats.totalUsers.toLocaleString() }}</div>
            <div class="stat-label">Usuarios Totales</div>
            <div class="stat-breakdown">
              <div class="breakdown-item">
                <span class="breakdown-dot clients"></span>
                <span>{{ stats.totalClients.toLocaleString() }} Clientes</span>
              </div>
              <div class="breakdown-item">
                <span class="breakdown-dot pros"></span>
                <span>{{ stats.totalProfessionals.toLocaleString() }} Profesionales</span>
              </div>
            </div>
          </div>

          <div class="main-stat-card revenue">
            <div class="stat-header">
              <div class="stat-icon-wrapper"><span>💰</span></div>
              <div class="stat-trend positive">+8.3%</div>
            </div>
            <div class="stat-value">${{ stats.monthlyRevenue.toLocaleString() }}</div>
            <div class="stat-label">Ingresos Este Mes</div>
            <div class="mini-chart">
              <div v-for="(v, i) in revenueChart" :key="i" class="mini-bar" :style="{ height: v + '%' }"></div>
            </div>
          </div>

          <div class="main-stat-card services">
            <div class="stat-header">
              <div class="stat-icon-wrapper"><span>📋</span></div>
              <div class="stat-trend positive">+15.2%</div>
            </div>
            <div class="stat-value">{{ stats.activeServices.toLocaleString() }}</div>
            <div class="stat-label">Servicios Activos</div>
            <div class="stat-detail">
              <span class="detail-highlight">{{ stats.pendingServices }}</span> pendientes
            </div>
          </div>

          <div class="main-stat-card satisfaction">
            <div class="stat-header">
              <div class="stat-icon-wrapper"><span>⭐</span></div>
              <div class="stat-trend positive">+0.2</div>
            </div>
            <div class="stat-value">{{ stats.avgRating }}/5</div>
            <div class="stat-label">Satisfacción</div>
            <div class="rating-bars">
              <div class="rating-bar"><div class="bar-fill" style="width:95%"></div></div>
              <div class="rating-bar"><div class="bar-fill" style="width:85%"></div></div>
              <div class="rating-bar"><div class="bar-fill" style="width:70%"></div></div>
            </div>
          </div>
        </div>

        <!-- Two Columns -->
        <div class="two-column-section">
          <div class="section-card">
            <div class="card-header">
              <h3 class="card-title">Usuarios Recientes</h3>
              <a href="#" class="view-link">Ver todos →</a>
            </div>
            <div v-if="loadingUsers" class="inner-loading">Cargando...</div>
            <div v-else class="users-list">
              <div v-for="user in recentUsers" :key="user.id" class="user-item">
                <img :src="`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`" alt="User" class="user-item-avatar" />
                <div class="user-item-info">
                  <div class="user-item-name">{{ user.name }}</div>
                  <div class="user-item-type">{{ roleMap[user.role] ?? user.role }}</div>
                </div>
                <span :class="['user-item-status', user.email_verified_at ? 'active' : 'pending']">
                  {{ user.email_verified_at ? 'Activo' : 'Pendiente' }}
                </span>
              </div>
              <div v-if="recentUsers.length === 0" class="empty-state">No hay usuarios recientes</div>
            </div>
          </div>

          <div class="section-card">
            <div class="card-header">
              <h3 class="card-title">Pendientes de Aprobación</h3>
              <a href="#" class="view-link">Ver todos →</a>
            </div>
            <div class="approvals-list">
              <div v-for="item in pendingApprovals" :key="item.id" class="approval-item">
                <div class="approval-icon">{{ item.icon }}</div>
                <div class="approval-info">
                  <div class="approval-title">{{ item.title }}</div>
                  <div class="approval-desc">{{ item.description }}</div>
                  <div class="approval-time">{{ item.time }}</div>
                </div>
                <div class="approval-actions">
                  <button class="approve-btn" @click="handleApprove(item)">✓</button>
                  <button class="reject-btn" @click="handleReject(item)">✗</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Table -->
        <div class="section">
          <div class="section-card">
            <div class="card-header">
              <h3 class="card-title">Estadísticas por Categoría</h3>
              <button class="export-btn">
                <span>📊</span>
                <span class="export-label"> Exportar</span>
              </button>
            </div>
            <div class="stats-table">
              <table>
                <thead>
                  <tr>
                    <th>Categoría</th>
                    <th>Servicios</th>
                    <th class="hide-sm">Profesionales</th>
                    <th>Ingresos</th>
                    <th class="hide-sm">Calificación</th>
                    <th>Tendencia</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="category in categoryStats" :key="category.id">
                    <td>
                      <div class="table-category">
                        <span class="category-icon">{{ category.icon }}</span>
                        <span>{{ category.name }}</span>
                      </div>
                    </td>
                    <td><strong>{{ category.services }}</strong></td>
                    <td class="hide-sm">{{ category.professionals }}</td>
                    <td><span class="revenue-value">${{ category.revenue.toLocaleString() }}</span></td>
                    <td class="hide-sm"><span class="rating-badge">⭐ {{ category.rating }}</span></td>
                    <td>
                      <span :class="['trend-indicator', category.trend > 0 ? 'up' : 'down']">
                        {{ category.trend > 0 ? '↗' : '↘' }} {{ Math.abs(category.trend) }}%
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- Bottom spacer for mobile nav -->
        <div class="mobile-bottom-spacer"></div>
      </template>

      <script setup>
    import { ref, onMounted } from 'vue'
import api from '@/services/api'

const loadingStats = ref(false)
const loadingUsers = ref(false)
const apiError = ref('')

const stats = ref({
  totalUsers: 0,
  totalClients: 0,
  totalProfessionals: 0,
  monthlyRevenue: 0,
  activeServices: 0,
  pendingServices: 0,
  avgRating: 0,
})

const recentUsers = ref([])

const fetchStats = async () => {
  loadingStats.value = true
  try {
    const { data } = await api.get('/admin/stats')
    if (data.success) stats.value = data.stats
  } catch (e) {
    apiError.value = 'Error cargando estadísticas'
  } finally {
    loadingStats.value = false
  }
}

const fetchRecentUsers = async () => {
  loadingUsers.value = true
  try {
    const { data } = await api.get('/admin/users?per_page=4')
    if (data.success) recentUsers.value = data.users.data ?? data.users
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