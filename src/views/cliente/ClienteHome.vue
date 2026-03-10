<template>
  <div class="client-dashboard">

    <!-- Stats Cards -->
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon">📋</div>
        <div class="stat-content">
          <div class="stat-value">12</div>
          <div class="stat-label">Servicios Activos</div>
        </div>
        <div class="stat-trend positive">+3 este mes</div>
      </div>

      <div class="stat-card">
        <div class="stat-icon">✅</div>
        <div class="stat-content">
          <div class="stat-value">48</div>
          <div class="stat-label">Completados</div>
        </div>
        <div class="stat-trend positive">+12 este mes</div>
      </div>

      <div class="stat-card">
        <div class="stat-icon">💰</div>
        <div class="stat-content">
          <div class="stat-value">$2,450</div>
          <div class="stat-label">Gastado Total</div>
        </div>
        <div class="stat-trend neutral">Este año</div>
      </div>

      <div class="stat-card">
        <div class="stat-icon">⭐</div>
        <div class="stat-content">
          <div class="stat-value">4.9</div>
          <div class="stat-label">Calificación Promedio</div>
        </div>
        <div class="stat-trend positive">Excelente</div>
      </div>
    </div>

    <!-- Quick Actions -->
    <div class="section">
      <h2 class="section-title">Acciones Rápidas</h2>
      <div class="actions-grid">
        <button class="action-card">
          <span class="action-icon">🔍</span>
          <div class="action-content">
            <div class="action-name">Buscar Servicios</div>
            <div class="action-desc">Encuentra profesionales</div>
          </div>
          <span class="action-arrow">→</span>
        </button>

        <button class="action-card">
          <span class="action-icon">📅</span>
          <div class="action-content">
            <div class="action-name">Agendar Cita</div>
            <div class="action-desc">Programa un servicio</div>
          </div>
          <span class="action-arrow">→</span>
        </button>

        <button class="action-card">
          <span class="action-icon">💬</span>
          <div class="action-content">
            <div class="action-name">Mensajes</div>
            <div class="action-desc">Chatea con profesionales</div>
          </div>
          <span class="action-arrow">→</span>
        </button>

        <button class="action-card">
          <span class="action-icon">📊</span>
          <div class="action-content">
            <div class="action-name">Historial</div>
            <div class="action-desc">Ver servicios pasados</div>
          </div>
          <span class="action-arrow">→</span>
        </button>
      </div>
    </div>

    <!-- Active Services -->
    <div class="section">
      <div class="section-header">
        <h2 class="section-title">Servicios Activos</h2>
        <a href="#" class="view-all">Ver todos →</a>
      </div>

      <div class="services-list">
        <div
          v-for="service in activeServices"
          :key="service.id"
          class="service-card"
        >
          <div class="service-header">
            <img
              :src="service.providerAvatar"
              alt="Provider"
              class="service-avatar"
            />
            <div class="service-info">
              <div class="service-provider">{{ service.providerName }}</div>
              <div class="service-type">{{ service.type }}</div>
            </div>
            <span :class="['service-status', service.status]">
              {{ service.statusLabel }}
            </span>
          </div>

          <div class="service-details">
            <div class="detail-item">
              <span class="detail-icon">📅</span>
              <span class="detail-text">{{ service.date }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-icon">💰</span>
              <span class="detail-text">${{ service.price }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-icon">📍</span>
              <span class="detail-text">{{ service.location }}</span>
            </div>
          </div>

          <div class="service-progress">
            <div class="progress-bar">
              <div
                class="progress-fill"
                :style="{ width: service.progress + '%' }"
              ></div>
            </div>
            <span class="progress-text">{{ service.progress }}% completado</span>
          </div>

          <div class="service-actions">
            <button class="btn-secondary">Contactar</button>
            <button class="btn-primary">Ver Detalles</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Recommended Professionals -->
    <div class="section">
      <div class="section-header">
        <h2 class="section-title">Profesionales Recomendados</h2>
        <a href="#" class="view-all">Ver más →</a>
      </div>

      <div class="professionals-grid">
        <div v-for="pro in recommendedPros" :key="pro.id" class="pro-card">
          <div class="pro-header">
            <img :src="pro.avatar" alt="Professional" class="pro-avatar" />
            <span class="pro-badge">⭐ Top</span>
          </div>
          <h3 class="pro-name">{{ pro.name }}</h3>
          <p class="pro-role">{{ pro.role }}</p>
          <div class="pro-rating">
            <span class="stars">★★★★★</span>
            <span class="rating-value">{{ pro.rating }} ({{ pro.reviews }})</span>
          </div>
          <div class="pro-tags">
            <span v-for="tag in pro.tags" :key="tag" class="pro-tag">{{ tag }}</span>
          </div>
          <button class="pro-hire-btn">Contratar Ahora</button>
        </div>
      </div>
    </div>

    <!-- Mobile bottom spacer -->
    <div class="mobile-bottom-spacer"></div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const activeServices = ref([
  {
    id: 1,
    providerName: 'Carlos Mendoza',
    providerAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Carlos',
    type: 'Plomería Residencial',
    status: 'in-progress',
    statusLabel: 'En Progreso',
    date: '15 Feb, 2026',
    price: 150,
    location: 'San Isidro',
    progress: 65,
  },
  {
    id: 2,
    providerName: 'Ana Rodríguez',
    providerAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ana',
    type: 'Diseño Web',
    status: 'scheduled',
    statusLabel: 'Programado',
    date: '18 Feb, 2026',
    price: 450,
    location: 'Remoto',
    progress: 20,
  },
]);

const recommendedPros = ref([
  {
    id: 1,
    name: 'Roberto Silva',
    role: 'Carpintero Experto',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Roberto',
    rating: 4.9,
    reviews: 267,
    tags: ['Muebles', 'Restauración'],
  },
  {
    id: 2,
    name: 'Laura García',
    role: 'Desarrolladora Full Stack',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Laura',
    rating: 5.0,
    reviews: 156,
    tags: ['React', 'Node.js'],
  },
  {
    id: 3,
    name: 'Miguel Torres',
    role: 'Electricista Pro',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Miguel',
    rating: 4.8,
    reviews: 312,
    tags: ['Instalaciones', 'Domótica'],
  },
]);
</script>

<style scoped>
.client-dashboard { /* no extra padding needed, layout ya lo maneja */ }

/* ─── Stats Grid ─── */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
  margin-bottom: 40px;
}

.stat-card {
  background: white;
  padding: 24px;
  border-radius: 20px;
  box-shadow: 0 1px 3px rgba(0,0,0,.05);
  transition: all 0.3s;
}
.stat-card:hover { transform: translateY(-4px); box-shadow: 0 8px 30px rgba(0,0,0,.08); }

.stat-icon    { font-size: 36px; margin-bottom: 12px; }
.stat-value   { font-size: 32px; font-weight: 900; color: #0f172a; margin-bottom: 4px; }
.stat-label   { font-size: 14px; color: #64748b; font-weight: 600; margin-bottom: 8px; }

.stat-trend          { font-size: 12px; font-weight: 700; padding: 4px 10px; border-radius: 6px; display: inline-block; }
.stat-trend.positive { background: #dcfce7; color: #16a34a; }
.stat-trend.neutral  { background: #f1f5f9; color: #64748b; }

/* ─── Sections ─── */
.section        { margin-bottom: 40px; }
.section-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
.section-title  { font-size: 24px; font-weight: 800; color: #0f172a; margin-bottom: 0; }
.view-all       { color: #2563eb; font-weight: 700; font-size: 14px; text-decoration: none; }
.view-all:hover { color: #1e40af; }

/* ─── Quick Actions ─── */
.actions-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 0;
}

.action-card {
  display: flex; align-items: center; gap: 16px;
  padding: 20px; background: white;
  border: 2px solid #f1f5f9; border-radius: 16px;
  cursor: pointer; transition: all 0.3s; text-align: left; width: 100%;
}
.action-card:hover { border-color: #dbeafe; transform: translateY(-2px); box-shadow: 0 8px 20px rgba(37,99,235,.1); }

.action-icon    { font-size: 28px; flex-shrink: 0; }
.action-content { flex: 1; }
.action-name    { font-weight: 700; color: #0f172a; margin-bottom: 2px; font-size: 14px; }
.action-desc    { font-size: 13px; color: #64748b; }
.action-arrow   { font-size: 20px; color: #cbd5e1; transition: all 0.3s; }
.action-card:hover .action-arrow { color: #2563eb; transform: translateX(4px); }

/* ─── Service Cards ─── */
.services-list { display: grid; gap: 20px; }

.service-card {
  background: white; padding: 24px;
  border-radius: 20px; box-shadow: 0 1px 3px rgba(0,0,0,.05);
}

.service-header { display: flex; align-items: center; gap: 16px; margin-bottom: 20px; }
.service-avatar { width: 56px; height: 56px; border-radius: 14px; border: 2px solid #f1f5f9; flex-shrink: 0; }
.service-info   { flex: 1; min-width: 0; }
.service-provider { font-weight: 800; font-size: 16px; color: #0f172a; }
.service-type     { font-size: 14px; color: #64748b; }

.service-status             { padding: 6px 14px; border-radius: 8px; font-size: 12px; font-weight: 700; white-space: nowrap; flex-shrink: 0; }
.service-status.in-progress { background: #dbeafe; color: #2563eb; }
.service-status.scheduled   { background: #fef3c7; color: #d97706; }

.service-details {
  display: flex; gap: 24px; flex-wrap: wrap;
  margin-bottom: 20px; padding: 16px;
  background: #f8fafc; border-radius: 12px;
}
.detail-item  { display: flex; align-items: center; gap: 8px; }
.detail-icon  { font-size: 16px; }
.detail-text  { font-size: 14px; font-weight: 600; color: #475569; }

.service-progress { margin-bottom: 20px; }
.progress-bar     { height: 8px; background: #f1f5f9; border-radius: 4px; overflow: hidden; margin-bottom: 8px; }
.progress-fill    { height: 100%; background: linear-gradient(90deg, #2563eb, #3b82f6); border-radius: 4px; transition: width 0.3s; }
.progress-text    { font-size: 13px; color: #64748b; font-weight: 600; }

.service-actions { display: flex; gap: 12px; }

.btn-secondary, .btn-primary {
  flex: 1; padding: 12px 24px; border-radius: 10px;
  font-weight: 700; font-size: 14px; cursor: pointer; transition: all 0.3s; border: none;
}
.btn-secondary       { background: #f8fafc; color: #475569; }
.btn-secondary:hover { background: #f1f5f9; }
.btn-primary         { background: linear-gradient(135deg, #2563eb, #3b82f6); color: white; }
.btn-primary:hover   { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(37,99,235,.3); }

/* ─── Professionals Grid ─── */
.professionals-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}

.pro-card {
  background: white; padding: 24px; border-radius: 20px;
  text-align: center; box-shadow: 0 1px 3px rgba(0,0,0,.05); transition: all 0.3s;
}
.pro-card:hover { transform: translateY(-4px); box-shadow: 0 8px 30px rgba(0,0,0,.08); }

.pro-header   { position: relative; margin-bottom: 16px; }
.pro-avatar   { width: 80px; height: 80px; border-radius: 16px; border: 3px solid #f1f5f9; margin: 0 auto; }
.pro-badge    { position: absolute; top: -8px; right: calc(50% - 60px); background: #fbbf24; color: white; padding: 4px 10px; border-radius: 8px; font-size: 11px; font-weight: 800; }

.pro-name   { font-size: 18px; font-weight: 800; color: #0f172a; margin-bottom: 4px; }
.pro-role   { font-size: 14px; color: #64748b; margin-bottom: 12px; }
.pro-rating { display: flex; align-items: center; justify-content: center; gap: 8px; margin-bottom: 16px; }
.stars        { color: #fbbf24; font-size: 14px; }
.rating-value { font-size: 13px; font-weight: 600; color: #475569; }

.pro-tags { display: flex; gap: 8px; justify-content: center; flex-wrap: wrap; margin-bottom: 20px; }
.pro-tag  { background: #eff6ff; color: #2563eb; padding: 6px 12px; border-radius: 8px; font-size: 12px; font-weight: 700; }

.pro-hire-btn {
  width: 100%; padding: 12px 24px;
  background: linear-gradient(135deg, #2563eb, #3b82f6); color: white;
  border: none; border-radius: 10px; font-weight: 700; font-size: 14px;
  cursor: pointer; transition: all 0.3s;
}
.pro-hire-btn:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(37,99,235,.3); }

/* ─── Mobile spacer ─── */
.mobile-bottom-spacer { display: none; height: 80px; }

/* ═══════════════════════════════════
   BREAKPOINTS
═══════════════════════════════════ */

@media (max-width: 1400px) {
  .stats-grid          { grid-template-columns: repeat(2, 1fr); }
  .professionals-grid  { grid-template-columns: repeat(2, 1fr); }
}

@media (max-width: 1024px) {
  .actions-grid { grid-template-columns: repeat(2, 1fr); }
}

@media (max-width: 900px) {
  .mobile-bottom-spacer { display: block; }
}

@media (max-width: 640px) {
  .stats-grid   { grid-template-columns: repeat(2, 1fr); gap: 12px; }
  .actions-grid { grid-template-columns: repeat(2, 1fr); gap: 10px; }
  .professionals-grid { grid-template-columns: 1fr; }

  .stat-card  { padding: 16px; }
  .stat-value { font-size: 26px; }
  .stat-icon  { font-size: 28px; margin-bottom: 8px; }

  .service-details { gap: 12px; }
  .action-card     { padding: 14px; gap: 10px; }
}

@media (max-width: 480px) {
  .stats-grid         { grid-template-columns: repeat(2, 1fr); gap: 10px; }
  .professionals-grid { grid-template-columns: 1fr; }
  .section-title      { font-size: 20px; }

  .service-header  { flex-wrap: wrap; }
  .service-actions { flex-direction: column; }
  .btn-secondary, .btn-primary { flex: none; width: 100%; }
}

@media (max-width: 360px) {
  .stats-grid   { grid-template-columns: 1fr; }
  .actions-grid { grid-template-columns: 1fr 1fr; }
}
</style>