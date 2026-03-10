<template>
  <div class="dashboard client" :class="{ 'sidebar-open': sidebarOpen }">

    <!-- Mobile overlay -->
    <div class="sidebar-overlay" @click="sidebarOpen = false"></div>

    <!-- Sidebar -->
    <aside class="sidebar">
      <div class="sidebar-header">
        <div class="brand">
          <span class="brand-icon">⚡</span>
          <span class="brand-name">ServiceHub</span>
        </div>
        <button class="sidebar-close-btn" @click="sidebarOpen = false">✕</button>
      </div>

      <nav class="sidebar-nav">
        <a
          v-for="item in navItems"
          :key="item.id"
          href="#"
          @click.prevent="navigate(item.id)"
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
            :src="`https://api.dicebear.com/7.x/avataaars/svg?seed=${authStore.user?.name ?? 'Client'}`"
            alt="Profile"
            class="user-avatar"
          />
          <div class="user-info">
            <div class="user-name">{{ authStore.user?.name ?? 'Cliente' }}</div>
            <div class="user-role">{{ roleLabel }}</div>
          </div>
        </div>
        <button class="logout-btn" @click="handleLogout" title="Cerrar sesión">🚪</button>
      </div>
    </aside>

    <!-- Main Content -->
    <main class="main-content">

      <!-- Mobile Topbar -->
      <div class="mobile-topbar">
        <button class="hamburger-btn" @click="sidebarOpen = true">☰</button>
        <div class="mobile-brand">
          <span>⚡</span>
          <span>ServiceHub</span>
        </div>
        <button class="icon-btn small">🔔</button>
      </div>

      <!-- Desktop Header -->
      <header class="content-header">
        <div class="header-left">
          <h1 class="page-title">Dashboard</h1>
          <p class="page-subtitle">
            Bienvenido, <strong>{{ authStore.user?.name }}</strong>
            <span class="date-text"> · {{ currentDate }}</span>
          </p>
        </div>
        <div class="header-right">
          <button class="icon-btn" title="Notificaciones">
            <span class="notification-dot"></span>
            🔔
          </button>
          <button class="icon-btn" title="Configuración">⚙️</button>
        </div>
      </header>

      <RouterView />
    </main>

    <!-- Mobile Bottom Nav -->
    <nav class="mobile-bottom-nav">
      <a
        v-for="item in mobileNavItems"
        :key="item.id"
        href="#"
        @click.prevent="navigate(item.id)"
        :class="['mobile-nav-item', { active: activeSection === item.id }]"
      >
        <span class="mobile-nav-icon">{{ item.icon }}</span>
        <span class="mobile-nav-label">{{ item.label }}</span>
      </a>
      <a href="#" class="mobile-nav-item" @click.prevent="sidebarOpen = true">
        <span class="mobile-nav-icon">☰</span>
        <span class="mobile-nav-label">Más</span>
      </a>
    </nav>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const route     = useRoute();
const router    = useRouter();
const authStore = useAuthStore();

const activeSection = ref('dashboard');
const sidebarOpen   = ref(false);

// Sync active section with current route
watch(() => route.name, (name) => {
  const map = {
    'ClientDashboard': 'dashboard',
    'ClientServices':  'services',
    'ClientSearch':    'search',
    'ClientMessages':  'messages',
    'ClientFavorites': 'favorites',
    'ClientHistory':   'history',
    'ClientSettings':  'settings',
  };
  activeSection.value = map[name] ?? 'dashboard';
}, { immediate: true });

// Close sidebar on Escape
const onKeydown = (e) => { if (e.key === 'Escape') sidebarOpen.value = false; };
onMounted(() => window.addEventListener('keydown', onKeydown));
onUnmounted(() => window.removeEventListener('keydown', onKeydown));

const navigate = (id) => {
  sidebarOpen.value = false;

  const routeMap = {
    dashboard: { name: 'ClientDashboard' },
    services:  { name: 'ClientServices' },
    search:    { name: 'ClientSearch' },
    messages:  { name: 'ClientMessages' },
    favorites: { name: 'ClientFavorites' },
    history:   { name: 'ClientHistory' },
    settings:  { name: 'ClientSettings' },
  };

  if (routeMap[id]) router.push(routeMap[id]);
};

const roleMap  = { client: 'Cliente Premium', admin: 'Administrador', professional: 'Profesional' };
const roleLabel   = computed(() => roleMap[authStore.user?.role] ?? authStore.user?.role ?? 'Cliente');
const currentDate = computed(() =>
  new Date().toLocaleDateString('es-PE', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
);

const handleLogout = () => authStore.logout();

const navItems = [
  { id: 'dashboard', icon: '🏠', label: 'Dashboard' },
  { id: 'services',  icon: '📋', label: 'Mis Servicios', badge: '12' },
  { id: 'search',    icon: '🔍', label: 'Buscar' },
  { id: 'messages',  icon: '💬', label: 'Mensajes', badge: '3' },
  { id: 'favorites', icon: '❤️', label: 'Favoritos' },
  { id: 'history',   icon: '📊', label: 'Historial' },
  { id: 'settings',  icon: '⚙️', label: 'Configuración' },
];

const mobileNavItems = [
  { id: 'dashboard', icon: '🏠', label: 'Inicio' },
  { id: 'services',  icon: '📋', label: 'Servicios' },
  { id: 'search',    icon: '🔍', label: 'Buscar' },
  { id: 'messages',  icon: '💬', label: 'Mensajes' },
];
</script>

<style>
*, *::before, *::after { box-sizing: border-box; }

/* ─── Layout ─── */
.dashboard.client {
  display: flex;
  min-height: 100vh;
  background: #f8fafc;
  font-family: 'Outfit', -apple-system, sans-serif;
  position: relative;
}

/* ─── Overlay ─── */
.sidebar-overlay {
  display: none;
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.55);
  z-index: 40;
  backdrop-filter: blur(3px);
}

/* ─── Sidebar ─── */
.sidebar {
  width: 280px;
  background: white;
  border-right: 1px solid #e2e8f0;
  display: flex;
  flex-direction: column;
  position: fixed;
  top: 0; left: 0;
  height: 100vh;
  z-index: 50;
  transition: transform 0.3s cubic-bezier(0.4,0,0.2,1);
  overflow-y: auto;
}

.sidebar-header {
  padding: 24px 20px;
  border-bottom: 1px solid #f1f5f9;
  position: relative;
}

.brand { display: flex; align-items: center; gap: 10px; }
.brand-icon { font-size: 32px; }
.brand-name {
  font-size: 24px; font-weight: 900;
  background: linear-gradient(135deg, #2563eb, #4f46e5);
  -webkit-background-clip: text; -webkit-text-fill-color: transparent;
}

.sidebar-close-btn {
  display: none;
  position: absolute; top: 16px; right: 16px;
  width: 32px; height: 32px; border-radius: 8px;
  border: none; background: #f1f5f9;
  font-size: 16px; font-weight: 700; color: #64748b;
  cursor: pointer; align-items: center; justify-content: center;
}

.sidebar-nav { flex: 1; padding: 20px 12px; overflow-y: auto; }

.nav-item {
  display: flex; align-items: center; gap: 12px;
  padding: 12px 16px; margin-bottom: 4px; border-radius: 12px;
  color: #64748b; text-decoration: none;
  font-weight: 600; font-size: 15px; transition: all 0.2s;
}
.nav-item:hover  { background: #f8fafc; color: #2563eb; }
.nav-item.active { background: linear-gradient(135deg, #eff6ff, #dbeafe); color: #2563eb; }

.nav-icon  { font-size: 20px; width: 24px; text-align: center; flex-shrink: 0; }
.nav-label { flex: 1; }
.nav-badge { background: #ef4444; color: white; padding: 2px 8px; border-radius: 10px; font-size: 11px; font-weight: 800; }

.sidebar-footer {
  padding: 20px; border-top: 1px solid #f1f5f9;
  display: flex; align-items: center; gap: 12px;
}
.user-profile { display: flex; align-items: center; gap: 12px; flex: 1; min-width: 0; }
.user-avatar  { width: 44px; height: 44px; border-radius: 12px; border: 2px solid #e2e8f0; flex-shrink: 0; }
.user-info    { min-width: 0; }
.user-name    { font-weight: 700; font-size: 14px; color: #1e293b; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.user-role    { font-size: 12px; color: #64748b; }
.logout-btn   { width: 40px; height: 40px; border-radius: 10px; border: none; background: #f1f5f9; font-size: 18px; cursor: pointer; transition: all 0.2s; flex-shrink: 0; }
.logout-btn:hover { background: #fee2e2; }

/* ─── Main Content ─── */
.main-content { flex: 1; margin-left: 280px; padding: 32px 40px; min-width: 0; }

/* ─── Mobile Topbar ─── */
.mobile-topbar {
  display: none; align-items: center; justify-content: space-between;
  padding: 12px 16px; background: white; border-bottom: 1px solid #e2e8f0;
  position: sticky; top: 0; z-index: 30;
  margin: 0 -20px 20px;
}
.hamburger-btn {
  width: 44px; height: 44px; border-radius: 12px; border: none; background: #f1f5f9;
  font-size: 20px; cursor: pointer; display: flex; align-items: center; justify-content: center;
}
.mobile-brand {
  display: flex; align-items: center; gap: 8px; font-size: 20px; font-weight: 900;
  background: linear-gradient(135deg, #2563eb, #4f46e5);
  -webkit-background-clip: text; -webkit-text-fill-color: transparent;
}

/* ─── Desktop Header ─── */
.content-header {
  display: flex; justify-content: space-between; align-items: center;
  margin-bottom: 32px; gap: 16px;
}
.page-title    { font-size: 32px; font-weight: 900; color: #0f172a; margin-bottom: 4px; line-height: 1.2; }
.page-subtitle { color: #64748b; font-size: 14px; }
.header-right  { display: flex; align-items: center; gap: 12px; flex-shrink: 0; }

.icon-btn {
  width: 48px; height: 48px; border-radius: 12px; border: none; background: white;
  font-size: 20px; cursor: pointer; transition: all 0.2s;
  box-shadow: 0 1px 3px rgba(0,0,0,.1);
  display: flex; align-items: center; justify-content: center;
  position: relative;
}
.icon-btn.small { width: 40px; height: 40px; font-size: 18px; box-shadow: none; background: #f1f5f9; }
.icon-btn:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(0,0,0,.1); }

.notification-dot {
  position: absolute; top: 10px; right: 10px;
  width: 8px; height: 8px; background: #ef4444;
  border-radius: 50%; border: 2px solid white;
}

/* ─── Mobile Bottom Nav ─── */
.mobile-bottom-nav {
  display: none; position: fixed; bottom: 0; left: 0; right: 0;
  background: white; border-top: 1px solid #e2e8f0;
  padding: 8px 0 max(8px, env(safe-area-inset-bottom));
  z-index: 30; justify-content: space-around;
  box-shadow: 0 -4px 20px rgba(0,0,0,.08);
}
.mobile-nav-item {
  display: flex; flex-direction: column; align-items: center; gap: 3px;
  text-decoration: none; padding: 6px 10px; border-radius: 12px; transition: all .2s; min-width: 52px;
}
.mobile-nav-item.active { background: #eff6ff; }
.mobile-nav-icon  { font-size: 22px; }
.mobile-nav-label { font-size: 10px; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: .3px; }
.mobile-nav-item.active .mobile-nav-label { color: #2563eb; }

/* ═══════════════════════════════════
   BREAKPOINTS
═══════════════════════════════════ */

@media (max-width: 1100px) {
  .sidebar      { width: 240px; }
  .main-content { margin-left: 240px; padding: 24px; }
  .page-title   { font-size: 26px; }
}

@media (max-width: 900px) {
  .sidebar      { transform: translateX(-100%); width: 280px; }
  .main-content { margin-left: 0; padding: 0 20px 20px; }

  .mobile-topbar     { display: flex; margin: 0 -20px 20px; }
  .content-header    { display: none; }
  .sidebar-close-btn { display: flex; }

  .sidebar-open .sidebar         { transform: translateX(0); }
  .sidebar-open .sidebar-overlay { display: block; }

  .mobile-bottom-nav { display: flex; }
}

@media (max-width: 640px) {
  .main-content  { padding: 0 16px 16px; }
  .mobile-topbar { margin: 0 -16px 16px; }
}
</style>