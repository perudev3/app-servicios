<template>
  <div class="dashboard professional">

    <!-- Sidebar -->
    <aside :class="['sidebar', { active: sidebarOpen }]">
      <div class="sidebar-header">
        <div class="brand">
          <img src="/images/logo.jpeg" class="brand-logo" />
          <span class="brand-name">IServices</span>
        </div>
        <div class="pro-badge-header">
          <span class="badge-icon">💼</span>
          <span>Profesional</span>
        </div>
      </div>

      <nav class="sidebar-nav">
        <router-link
          :to="{ name: 'ProfessionalHome' }"
          class="nav-item"
        >
          <span class="nav-icon">🏠</span>
          <span class="nav-label">Dashboard</span>
        </router-link>

        <router-link
          :to="{ name: 'ProfileProfesional' }"
          class="nav-item"
        >
          <span class="nav-icon">👤</span>
          <span class="nav-label">Mi Perfil</span>
        </router-link>
      </nav>

      <div class="sidebar-footer">
        <div class="user-profile">
          <img
            :src="`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name}`"
            class="user-avatar"
          />
          <div class="user-info">
            <div class="user-name">{{ user?.name }}</div>
            <div class="user-role">{{ formattedRole }}</div>
          </div>
        </div>

        <button class="logout-btn" @click="handleLogout">
          <i class="fa-solid fa-right-from-bracket"></i>
        </button>
      </div>
    </aside>

    <!-- Main -->
    <main class="main-content">

      <button class="mobile-toggle" @click="toggleSidebar">
        ☰
      </button>

      <header class="content-header">
        <div>
          <p class="page-subtitle">
            Panel profesional
          </p>
        </div>
      </header>

      <!-- Aquí se renderizan las vistas hijas -->
      <router-view />

    </main>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const sidebarOpen = ref(false)
const authStore = useAuthStore()
const route = useRoute()

const user = ref(null)


watch(
  () => route.fullPath,
  () => {
    sidebarOpen.value = false
  }
)

if (localStorage.getItem('user')) {
  user.value = JSON.parse(localStorage.getItem('user'))
}

const formattedRole = computed(() => {
  if (!user.value?.role) return ''

  if (user.value.role === 'professional') {
    return 'Profesional'
  }

  return user.value.role
})

const toggleSidebar = () => {
  sidebarOpen.value = !sidebarOpen.value
}

const handleLogout = () => {
  authStore.logout()
}
</script>

<style>
/* Base styles inherited from Client Dashboard */
.dashboard {
  display: flex;
  min-height: 100vh;
  background: #f8fafc;
  font-family: 'Outfit', -apple-system, sans-serif;
}

.sidebar {
  width: 280px;
  background: #ffffff;
  border-right: 1px solid #e2e8f0;
  display: flex;
  flex-direction: column;
  position: fixed;
  height: 100vh;
  left: 0;
  top: 0;
  box-shadow: 4px 0 25px rgba(0, 0, 0, 0.03);
  transition: all 0.3s ease;
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
  padding: 14px 16px;
  margin-bottom: 6px;
  border-radius: 14px;
  color: #64748b;
  text-decoration: none;
  font-weight: 600;
  font-size: 15px;
  transition: all 0.25s ease;
}

.nav-item:hover {
  background: #f1f5f9;
  color: #2563eb;
  transform: translateX(4px);
}

.nav-item.router-link-active {
  background: linear-gradient(135deg, #eff6ff, #dbeafe);
  color: #2563eb;
  font-weight: 700;
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.15);
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
  background: #fafafa;
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
  width: 42px;
  height: 42px;
  border-radius: 12px;
  border: none;
  background: #f1f5f9;
  font-size: 18px;
  cursor: pointer;
  transition: all 0.25s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.logout-btn:hover {
  background: #fee2e2;
  color: #dc2626;
  transform: translateY(-2px);
  box-shadow: 0 6px 18px rgba(220, 38, 38, 0.15);
}

.main-content {
  flex: 1;
  margin-left: 280px;
  padding: 40px;
  background: #f8fafc;
  min-height: 100vh;
}

.content-header {
  margin-bottom: 40px;
  padding-bottom: 16px;
  border-bottom: 1px solid #e2e8f0;
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

.brand {
  display: flex;
  align-items: center;
  gap: 10px;
}

.brand-logo {
  width: 35px;
  height: 35px;
  object-fit: cover;
  border-radius: 8px;
}
</style>
