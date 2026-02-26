<template>
  <div class="dashboard professional">
    <!-- Sidebar -->
    <aside :class="['sidebar', { active: sidebarOpen }]">
      <div class="sidebar-header">
        <div class="brand">
          <span class="brand-icon">⚡</span>
          <span class="brand-name">ServiceHub</span>
        </div>
        <div class="pro-badge-header">
          <span class="badge-icon">💼</span>
          <span>Profesional</span>
        </div>
      </div>

      <nav class="sidebar-nav">
        <a
          v-for="item in navItems"
          :key="item.id"
          :href="`#${item.id}`"
          @click="activeSection = item.id"
          :class="['nav-item', { active: activeSection === item.id }]"
        >
          <span class="nav-icon">{{ item.icon }}</span>
          <span class="nav-label">{{ item.label }}</span>
          <span v-if="item.badge" class="nav-badge">{{ item.badge }}</span>
        </a>
      </nav>

      <div class="sidebar-footer">
        <div class="user-profile">
          <img
            src="https://api.dicebear.com/7.x/avataaars/svg?seed=Professional"
            alt="Profile"
            class="user-avatar"
          />
          <div class="user-info">
            <div class="user-name">Carlos Mendoza</div>
            <div class="user-role">Plomero Certificado</div>
          </div>
        </div>
        <button class="logout-btn" @click="logout">🚪</button>
      </div>
    </aside>

    <!-- Main Content -->
    <main class="main-content">
      <button class="mobile-toggle" @click="toggleSidebar">
        ☰
      </button>
      <!-- Header -->

      
      <header class="content-header">
        <div class="header-left">
          <h1 class="page-title">Mi Negocio</h1>
          <p class="page-subtitle">
            ¡Hola Carlos! Tienes 5 solicitudes nuevas 🎉
          </p>
        </div>
        <div class="header-right">
          <button class="icon-btn">
            <span class="notification-dot"></span>🔔
          </button>
          <button class="icon-btn">⚙️</button>
        </div>
      </header>

      <div
        v-if="needsProfileCompletion"
        class="profile-warning"
      >
        <h3>⚠️ Completa tu perfil profesional</h3>
        <p>
          Para comenzar a recibir solicitudes de trabajo debes completar tu
          información profesional.
        </p>

        <button @click="$router.push('/professional/profile')" class="complete-btn">
          Completar ahora
        </button>
      </div>

      <!-- Earnings Overview -->
      <div class="earnings-section">
        <div class="earnings-card main">
          <div class="earnings-header">
            <div class="earnings-label">Ganancias Este Mes</div>
            <button class="period-selector">Febrero 2026 ▼</button>
          </div>
          <div class="earnings-amount">$3,280</div>
          <div class="earnings-change positive">+18.5% vs mes anterior</div>
          <div class="earnings-chart">
            <div
              class="chart-bar"
              v-for="(value, index) in chartData"
              :key="index"
              :style="{ height: value + '%' }"
            >
              <div class="bar-tooltip">${{ Math.round(value * 50) }}</div>
            </div>
          </div>
        </div>

        <div class="earnings-stats">
          <div class="stat-box">
            <div class="stat-icon">📋</div>
            <div class="stat-value">23</div>
            <div class="stat-label">Servicios Activos</div>
            <div class="stat-trend">+5 esta semana</div>
          </div>
          <div class="stat-box">
            <div class="stat-icon">✅</div>
            <div class="stat-value">156</div>
            <div class="stat-label">Completados</div>
            <div class="stat-trend">98% éxito</div>
          </div>
          <div class="stat-box">
            <div class="stat-icon">⭐</div>
            <div class="stat-value">4.9</div>
            <div class="stat-label">Calificación</div>
            <div class="stat-trend">234 reviews</div>
          </div>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="section">
        <h2 class="section-title">Acciones Rápidas</h2>
        <div class="actions-grid">
          <button class="action-card primary">
            <span class="action-icon">➕</span>
            <div class="action-content">
              <div class="action-name">Nuevo Servicio</div>
              <div class="action-desc">Publicar oferta</div>
            </div>
          </button>
          <button class="action-card">
            <span class="action-icon">📅</span>
            <div class="action-content">
              <div class="action-name">Mi Calendario</div>
              <div class="action-desc">Ver agenda</div>
            </div>
          </button>
          <button class="action-card">
            <span class="action-icon">💬</span>
            <div class="action-content">
              <div class="action-name">Mensajes</div>
              <div class="action-desc">5 nuevos</div>
            </div>
          </button>
          <button class="action-card">
            <span class="action-icon">📊</span>
            <div class="action-content">
              <div class="action-name">Reportes</div>
              <div class="action-desc">Ver analytics</div>
            </div>
          </button>
        </div>
      </div>

      <!-- New Requests -->
      <div class="section">
        <div class="section-header">
          <h2 class="section-title">Nuevas Solicitudes</h2>
          <a href="#" class="view-all">Ver todas →</a>
        </div>

        <div class="requests-list">
          <div
            v-for="request in newRequests"
            :key="request.id"
            class="request-card"
          >
            <div class="request-header">
              <img
                :src="request.clientAvatar"
                alt="Client"
                class="request-avatar"
              />
              <div class="request-info">
                <div class="request-client">{{ request.clientName }}</div>
                <div class="request-service">{{ request.service }}</div>
              </div>
              <span class="request-time">{{ request.timeAgo }}</span>
            </div>

            <p class="request-description">{{ request.description }}</p>

            <div class="request-details">
              <div class="detail-item">
                <span class="detail-icon">📍</span>
                <span>{{ request.location }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-icon">📅</span>
                <span>{{ request.date }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-icon">💰</span>
                <span>Presupuesto: ${{ request.budget }}</span>
              </div>
            </div>

            <div class="request-actions">
              <button class="btn-decline">Rechazar</button>
              <button class="btn-accept">Aceptar Solicitud</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Active Jobs -->
      <div class="section">
        <div class="section-header">
          <h2 class="section-title">Trabajos en Curso</h2>
          <a href="#" class="view-all">Ver todos →</a>
        </div>

        <div class="jobs-grid">
          <div v-for="job in activeJobs" :key="job.id" class="job-card">
            <div class="job-status-badge" :class="job.status">
              {{ job.statusLabel }}
            </div>
            <div class="job-client">
              <img :src="job.clientAvatar" alt="Client" class="job-avatar" />
              <div>
                <div class="job-client-name">{{ job.clientName }}</div>
                <div class="job-service-name">{{ job.serviceName }}</div>
              </div>
            </div>
            <div class="job-progress-section">
              <div class="progress-label">
                <span>Progreso</span>
                <span>{{ job.progress }}%</span>
              </div>
              <div class="progress-bar">
                <div
                  class="progress-fill"
                  :style="{ width: job.progress + '%' }"
                ></div>
              </div>
            </div>
            <div class="job-info-grid">
              <div class="job-info-item">
                <span class="info-icon">💰</span>
                <span>${{ job.amount }}</span>
              </div>
              <div class="job-info-item">
                <span class="info-icon">📅</span>
                <span>{{ job.deadline }}</span>
              </div>
            </div>
            <button class="job-action-btn">Ver Detalles →</button>
          </div>
        </div>
      </div>

      <!-- Reviews Section -->
      <div class="section">
        <div class="section-header">
          <h2 class="section-title">Últimas Reseñas</h2>
          <a href="#" class="view-all">Ver todas →</a>
        </div>

        <div class="reviews-list">
          <div
            v-for="review in recentReviews"
            :key="review.id"
            class="review-card"
          >
            <div class="review-header">
              <img
                :src="review.clientAvatar"
                alt="Client"
                class="review-avatar"
              />
              <div class="review-info">
                <div class="review-client">{{ review.clientName }}</div>
                <div class="review-rating">
                  <span class="stars"
                    >{{ '★'.repeat(review.rating)
                    }}{{ '☆'.repeat(5 - review.rating) }}</span
                  >
                  <span class="review-date">{{ review.date }}</span>
                </div>
              </div>
            </div>
            <p class="review-text">{{ review.text }}</p>
            <div class="review-service">{{ review.service }}</div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>

import { ref, onMounted } from "vue";
import professionalService from "../services/professionalService";

const activeSection = ref('dashboard');

const sidebarOpen = ref(false)

const toggleSidebar = () => {
  sidebarOpen.value = !sidebarOpen.value
}

const navItems = [
  { id: 'dashboard', icon: '🏠', label: 'Dashboard' },
  { id: 'requests', icon: '📬', label: 'Solicitudes', badge: '5' },
  { id: 'jobs', icon: '📋', label: 'Trabajos', badge: '23' },
  { id: 'calendar', icon: '📅', label: 'Calendario' },
  { id: 'earnings', icon: '💰', label: 'Ganancias' },
  { id: 'reviews', icon: '⭐', label: 'Reseñas' },
  { id: 'profile', icon: '👤', label: 'Mi Perfil' },
  { id: 'settings', icon: '⚙️', label: 'Configuración' },
];


const professional = ref(null);
const needsProfileCompletion = ref(false);
const loading = ref(true);

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

const logout = () => {
  window.location.href = '/login';
};
</script>

<style scoped>
/* Base styles inherited from Client Dashboard */
.dashboard {
  display: flex;
  min-height: 100vh;
  background: #f8fafc;
  font-family: 'Outfit', -apple-system, sans-serif;
}

.sidebar {
  width: 280px;
  background: white;
  border-right: 1px solid #e2e8f0;
  display: flex;
  flex-direction: column;
  position: fixed;
  height: 100vh;
  left: 0;
  top: 0;
}

.sidebar-header {
  padding: 24px 20px;
  border-bottom: 1px solid #f1f5f9;
}

.brand {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;
}

.brand-icon {
  font-size: 32px;
}

.brand-name {
  font-size: 24px;
  font-weight: 900;
  background: linear-gradient(135deg, #2563eb, #4f46e5);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.pro-badge-header {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: linear-gradient(135deg, #fef3c7, #fde68a);
  color: #d97706;
  padding: 6px 14px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 800;
}

.badge-icon {
  font-size: 14px;
}

.sidebar-nav {
  flex: 1;
  padding: 20px 12px;
  overflow-y: auto;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  margin-bottom: 4px;
  border-radius: 12px;
  color: #64748b;
  text-decoration: none;
  font-weight: 600;
  font-size: 15px;
  transition: all 0.3s;
}

.nav-item:hover {
  background: #f8fafc;
  color: #2563eb;
}

.nav-item.active {
  background: linear-gradient(135deg, #eff6ff, #dbeafe);
  color: #2563eb;
}

.nav-icon {
  font-size: 20px;
  flex-shrink: 0;
}

.nav-label {
  flex: 1;
}

.nav-badge {
  background: #ef4444;
  color: white;
  padding: 2px 8px;
  border-radius: 10px;
  font-size: 11px;
  font-weight: 800;
}

.sidebar-footer {
  padding: 20px;
  border-top: 1px solid #f1f5f9;
  display: flex;
  align-items: center;
  gap: 12px;
}

.user-profile {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
}

.user-avatar {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  border: 2px solid #e2e8f0;
}

.user-info {
  flex: 1;
}

.user-name {
  font-weight: 700;
  font-size: 14px;
  color: #1e293b;
}

.user-role {
  font-size: 12px;
  color: #64748b;
}

.logout-btn {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  border: none;
  background: #f1f5f9;
  font-size: 18px;
  cursor: pointer;
  transition: all 0.3s;
}

.logout-btn:hover {
  background: #fee2e2;
  transform: scale(1.05);
}

.main-content {
  flex: 1;
  margin-left: 280px;
  padding: 32px 40px;
}

.content-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
}

.page-title {
  font-size: 32px;
  font-weight: 900;
  color: #0f172a;
  margin-bottom: 4px;
}

.page-subtitle {
  color: #64748b;
  font-size: 16px;
}

.header-right {
  display: flex;
  gap: 12px;
}

.icon-btn {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  border: none;
  background: white;
  font-size: 20px;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  position: relative;
}

.icon-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.notification-dot {
  position: absolute;
  top: 10px;
  right: 10px;
  width: 8px;
  height: 8px;
  background: #ef4444;
  border-radius: 50%;
  border: 2px solid white;
}

/* Earnings Section */
.earnings-section {
  display: grid;
  grid-template-columns: 1.5fr 1fr;
  gap: 24px;
  margin-bottom: 40px;
}

.earnings-card {
  background: linear-gradient(135deg, #2563eb, #3b82f6);
  padding: 32px;
  border-radius: 24px;
  color: white;
  box-shadow: 0 20px 60px rgba(37, 99, 235, 0.3);
}

.earnings-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.earnings-label {
  font-size: 15px;
  opacity: 0.9;
  font-weight: 600;
}

.period-selector {
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
}

.earnings-amount {
  font-size: 56px;
  font-weight: 900;
  margin-bottom: 8px;
}

.earnings-change {
  font-size: 14px;
  font-weight: 700;
  margin-bottom: 24px;
}

.earnings-change.positive {
  color: #86efac;
}

.earnings-chart {
  display: flex;
  align-items: flex-end;
  gap: 6px;
  height: 100px;
}

.chart-bar {
  flex: 1;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 4px 4px 0 0;
  position: relative;
  transition: all 0.3s;
  cursor: pointer;
}

.chart-bar:hover {
  background: rgba(255, 255, 255, 0.5);
}

.bar-tooltip {
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.8);
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 11px;
  white-space: nowrap;
  opacity: 0;
  transition: opacity 0.3s;
}

.chart-bar:hover .bar-tooltip {
  opacity: 1;
}

.earnings-stats {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.stat-box {
  background: white;
  padding: 24px;
  border-radius: 20px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  transition: all 0.3s;
}

.stat-box:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08);
}

.stat-icon {
  font-size: 32px;
  margin-bottom: 12px;
}

.stat-value {
  font-size: 32px;
  font-weight: 900;
  color: #0f172a;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 14px;
  color: #64748b;
  font-weight: 600;
  margin-bottom: 6px;
}

.stat-trend {
  font-size: 12px;
  color: #16a34a;
  font-weight: 700;
}

.section {
  margin-bottom: 40px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.section-title {
  font-size: 24px;
  font-weight: 800;
  color: #0f172a;
}

.view-all {
  color: #2563eb;
  font-weight: 700;
  font-size: 14px;
  text-decoration: none;
}

.actions-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 40px;
}

.action-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;
  background: white;
  border: 2px solid #f1f5f9;
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.3s;
  text-align: left;
}

.action-card:hover {
  border-color: #dbeafe;
  transform: translateY(-2px);
}

.action-card.primary {
  background: linear-gradient(135deg, #2563eb, #3b82f6);
  border-color: transparent;
  color: white;
}

.action-icon {
  font-size: 28px;
}

.action-content {
  flex: 1;
}

.action-name {
  font-weight: 700;
  margin-bottom: 2px;
}

.action-desc {
  font-size: 13px;
  opacity: 0.7;
}

/* Request Cards */
.requests-list {
  display: grid;
  gap: 20px;
}

.request-card {
  background: white;
  padding: 24px;
  border-radius: 20px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  border: 2px solid transparent;
  transition: all 0.3s;
}

.request-card:hover {
  border-color: #dbeafe;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08);
}

.request-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 16px;
}

.request-avatar {
  width: 52px;
  height: 52px;
  border-radius: 12px;
  border: 2px solid #f1f5f9;
}

.request-info {
  flex: 1;
}

.request-client {
  font-weight: 800;
  font-size: 16px;
  color: #0f172a;
}

.request-service {
  font-size: 14px;
  color: #64748b;
}

.request-time {
  font-size: 12px;
  color: #94a3b8;
  font-weight: 600;
}

.request-description {
  color: #475569;
  line-height: 1.6;
  margin-bottom: 16px;
}

.request-details {
  display: flex;
  gap: 24px;
  margin-bottom: 20px;
  padding: 16px;
  background: #f8fafc;
  border-radius: 12px;
}

.detail-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 600;
  color: #475569;
}

.detail-icon {
  font-size: 16px;
}

.request-actions {
  display: flex;
  gap: 12px;
}

.btn-decline,
.btn-accept {
  flex: 1;
  padding: 12px 24px;
  border-radius: 10px;
  font-weight: 700;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s;
  border: none;
}

.btn-decline {
  background: #f8fafc;
  color: #475569;
}

.btn-decline:hover {
  background: #f1f5f9;
}

.btn-accept {
  background: linear-gradient(135deg, #2563eb, #3b82f6);
  color: white;
}

.btn-accept:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
}

/* Jobs Grid */
.jobs-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}

.job-card {
  background: white;
  padding: 24px;
  border-radius: 20px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  position: relative;
  transition: all 0.3s;
}

.job-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08);
}

.job-status-badge {
  position: absolute;
  top: 16px;
  right: 16px;
  padding: 6px 12px;
  border-radius: 8px;
  font-size: 11px;
  font-weight: 800;
}

.job-status-badge.in-progress {
  background: #dbeafe;
  color: #2563eb;
}

.job-status-badge.pending {
  background: #fef3c7;
  color: #d97706;
}

.job-status-badge.scheduled {
  background: #f3e8ff;
  color: #9333ea;
}

.job-client {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
}

.job-avatar {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  border: 2px solid #f1f5f9;
}

.job-client-name {
  font-weight: 700;
  color: #0f172a;
  font-size: 15px;
}

.job-service-name {
  font-size: 13px;
  color: #64748b;
}

.job-progress-section {
  margin-bottom: 16px;
}

.progress-label {
  display: flex;
  justify-content: space-between;
  font-size: 13px;
  font-weight: 600;
  color: #64748b;
  margin-bottom: 8px;
}

.progress-bar {
  height: 6px;
  background: #f1f5f9;
  border-radius: 3px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #2563eb, #3b82f6);
  border-radius: 3px;
  transition: width 0.3s;
}

.job-info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-bottom: 16px;
}

.job-info-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 600;
  color: #475569;
}

.info-icon {
  font-size: 16px;
}

.job-action-btn {
  width: 100%;
  padding: 12px;
  background: #f8fafc;
  border: none;
  border-radius: 10px;
  font-weight: 700;
  font-size: 14px;
  color: #2563eb;
  cursor: pointer;
  transition: all 0.3s;
}

.job-action-btn:hover {
  background: #eff6ff;
}

/* Reviews */
.reviews-list {
  display: grid;
  gap: 20px;
}

.review-card {
  background: white;
  padding: 24px;
  border-radius: 20px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.review-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 16px;
}

.review-avatar {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  border: 2px solid #f1f5f9;
}

.review-client {
  font-weight: 700;
  color: #0f172a;
  margin-bottom: 4px;
}

.review-rating {
  display: flex;
  align-items: center;
  gap: 12px;
}

.stars {
  color: #fbbf24;
  font-size: 14px;
}

.review-date {
  font-size: 12px;
  color: #94a3b8;
}

.review-text {
  color: #475569;
  line-height: 1.6;
  margin-bottom: 12px;
}

.review-service {
  display: inline-block;
  background: #eff6ff;
  color: #2563eb;
  padding: 6px 12px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 700;
}

@media (max-width: 1400px) {
  .earnings-section {
    grid-template-columns: 1fr;
  }

  .jobs-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 1024px) {
  .actions-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* =========================
   RESPONSIVE MEJORADO
   ========================= */

/* Tablets grandes */
@media (max-width: 1200px) {
  .main-content {
    padding: 24px;
  }

  .earnings-amount {
    font-size: 42px;
  }

  .jobs-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* Tablets */
@media (max-width: 992px) {
  .earnings-section {
    grid-template-columns: 1fr;
  }

  .actions-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .request-details {
    flex-direction: column;
    gap: 12px;
  }
}

/* Móviles */
@media (max-width: 768px) {

  /* Sidebar oculto completamente */
  .sidebar {
    position: fixed;
    width: 260px;
    z-index: 1000;
  }

  .main-content {
    margin-left: 0;
    padding: 20px;
  }

  .content-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
    margin-top: 65px;
  }

  .page-title {
    font-size: 24px;
  }

  .earnings-amount {
    font-size: 36px;
  }

  .earnings-card {
    padding: 24px;
  }

  .actions-grid,
  .jobs-grid {
    grid-template-columns: 1fr;
  }

  .request-actions {
    flex-direction: column;
  }

  .job-info-grid {
    grid-template-columns: 1fr;
  }
}

/* Móviles pequeños */
@media (max-width: 480px) {

  .main-content {
    padding: 16px;
  }

  .earnings-amount {
    font-size: 30px;
  }

  .stat-value {
    font-size: 24px;
  }

  .request-card,
  .job-card,
  .review-card,
  .stat-box {
    padding: 18px;
  }

  .section-title {
    font-size: 18px;
  }
}

/* =========================
   MOBILE SIDEBAR FIX
   ========================= */

.mobile-toggle {
  display: none;
  position: fixed;
  top: 20px;
  left: 20px;
  background: #2563eb;
  color: white;
  border: none;
  padding: 10px 14px;
  border-radius: 10px;
  font-size: 20px;
  cursor: pointer;
  z-index: 1100;
}

/* Solo en móvil */
@media (max-width: 768px) {

  .mobile-toggle {
    display: block;
  }

  .sidebar {
    position: fixed;
    width: 260px;
    z-index: 1000;
    transform: translateX(-100%);
    transition: transform 0.3s ease;
  }

  .sidebar.active {
    transform: translateX(0);
  }

  .main-content {
    margin-left: 0;
  }
}

.profile-warning {
  background: #fff3cd;
  border: 1px solid #ffeeba;
  padding: 20px;
  border-radius: 12px;
  margin-bottom: 20px;
}

.complete-btn {
  margin-top: 10px;
  background: #0d6efd;
  color: white;
  border: none;
  padding: 10px 16px;
  border-radius: 8px;
  cursor: pointer;
}
</style>
