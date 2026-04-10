<template>
  <div class="solicitudes-container">

    <!-- TABS -->
    <div class="tabs">
      <button
        v-for="tab in tabs"
        :key="tab.key"
        class="tab-btn"
        :class="{ active: activeTab === tab.key }"
        @click="activeTab = tab.key"
      >
        {{ tab.label }}
        <span v-if="countByTab(tab.key)" class="tab-badge">
          {{ countByTab(tab.key) }}
        </span>
      </button>
    </div>

    <!-- LOADING -->
    <div v-if="loading" class="skeleton-list">
      <div v-for="n in 3" :key="n" class="skeleton-card">
        <div class="skeleton-line w-60"></div>
        <div class="skeleton-line w-90 short"></div>
        <div class="skeleton-line w-40 short"></div>
      </div>
    </div>

    <!-- EMPTY -->
    <div v-else-if="filtered.length === 0" class="empty-state">
      <div class="empty-icon">📋</div>
      <p class="empty-title">Sin solicitudes en esta sección</p>
    </div>

    <!-- CARDS -->
    <TransitionGroup v-else name="card" tag="div" class="card-group">
      <div
        v-for="req in filtered"
        :key="req.id"
        class="solicitud-card"
        :class="req.status"
      >

        <span class="status-pill" :class="req.status">
          {{ statusLabel(req.status) }}
        </span>

        <!-- Top -->
        <div class="card-top">
          <div class="service-icon-wrap">
            <svg viewBox="0 0 24 24" fill="none" stroke="#2563eb" stroke-width="2" width="16" height="16">
              <path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z"/>
            </svg>
          </div>
          <div class="card-service">{{ req.service_name }}</div>
          <div class="card-budget">${{ req.budget }}</div>
        </div>

        <p class="card-description">{{ req.description }}</p>

        <div class="card-meta">
          <span class="meta-chip">📅 {{ req.service_date }} {{ req.service_time }}</span>
          <span v-if="req.address" class="meta-chip">📍 {{ req.address }}</span>
        </div>

        <!-- Profesional asignado -->
        <div v-if="req.professional" class="professional-box">
          <img
            :src="`https://api.dicebear.com/7.x/avataaars/svg?seed=${req.professional.name}`"
            class="pro-avatar"
          />
          <div class="pro-info">
            <span class="pro-label">Profesional asignado</span>
            <span class="pro-name">{{ req.professional.name }}</span>
            <span v-if="req.professional.phone" class="pro-phone">📞 {{ req.professional.phone }}</span>
          </div>
        </div>

        <div class="card-divider"></div>

        <!-- Footer -->
        <div class="card-footer">

          <!-- Código activo -->
          <div v-if="req.status === 'accepted' && req.completion_code" class="code-active-box">
            <div class="code-active-label">Código activo</div>
            <div class="code-digits">
              <span v-for="(d, i) in req.completion_code.split('')" :key="i" class="code-digit">
                {{ d }}
              </span>
            </div>
            <div class="code-expires">
              Válido por ~15 min · Compártelo solo con el profesional
            </div>
            <button class="btn-regen" @click="generateCode(req)">
              🔄 Regenerar
            </button>
          </div>

          <!-- Sin código aún -->
          <button
            v-else-if="req.status === 'accepted'"
            class="btn-gen-code"
            :disabled="generating === req.id"
            @click="generateCode(req)"
          >
            {{ generating === req.id ? 'Generando...' : '🔐 Generar código de aprobación' }}
          </button>

          <!-- Completado -->
          <div v-else-if="req.status === 'completed'" class="completed-badge">
            ✅ Trabajo completado y aprobado
          </div>

        </div>

      </div>
    </TransitionGroup>

    <!-- TOAST -->
    <Transition name="toast">
      <div v-if="toast.visible" class="toast" :class="toast.type">
        {{ toast.message }}
      </div>
    </Transition>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import api from '@/services/api'

const tabs = [
  { key: 'pending',   label: 'Pendientes' },
  { key: 'accepted',  label: 'En curso' },
  { key: 'completed', label: 'Completadas' },
]

const activeTab  = ref('accepted')
const loading    = ref(true)
const requests   = ref([])
const generating = ref(null)
const toast      = ref({ visible: false, message: '', type: '' })
let toastTimer   = null

const filtered     = computed(() => requests.value.filter(r => r.status === activeTab.value))
const countByTab   = (key) => requests.value.filter(r => r.status === key).length

const statusLabel = (s) => ({
  pending:   'Pendiente',
  accepted:  'En curso',
  completed: 'Completada',
  rejected:  'Rechazada',
}[s] || s)

const showToast = (message, type = '') => {
  clearTimeout(toastTimer)
  toast.value = { visible: true, message, type }
  toastTimer = setTimeout(() => { toast.value.visible = false }, 3500)
}

const loadRequests = async () => {
  try {
    const res = await api.get('/client/requests')
    requests.value = res.data
  } catch {
    showToast('Error al cargar solicitudes', 'error')
  } finally {
    loading.value = false
  }
}

const generateCode = async (req) => {
  generating.value = req.id
  try {
    const res = await api.post(`/client/requests/${req.id}/generate-code`)
    // Actualizar el código en local
    const found = requests.value.find(r => r.id === req.id)
    if (found) {
      found.completion_code            = res.data.code
      found.completion_code_expires_at = res.data.expires_at
    }
    showToast('✓ Código generado — compártelo con el profesional', 'success')
  } catch {
    showToast('Error al generar el código', 'error')
  } finally {
    generating.value = null
  }
}

onMounted(loadRequests)
</script>

<style scoped>

.solicitudes-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding-bottom: 32px;
}

/* TABS */
.tabs {
  display: flex;
  gap: 8px;
  background: #f1f5f9;
  padding: 4px;
  border-radius: 12px;
  width: fit-content;
}
.tab-btn {
  display: flex; align-items: center; gap: 6px;
  padding: 8px 18px; border-radius: 9px; border: none;
  background: transparent; font-size: 13px; font-weight: 700;
  color: #64748b; cursor: pointer;
  transition: background 0.2s, color 0.2s;
  font-family: inherit;
}
.tab-btn.active { background: white; color: #2563eb; box-shadow: 0 1px 6px rgba(0,0,0,0.08); }
.tab-badge {
  background: #2563eb; color: white; font-size: 10px; font-weight: 800;
  padding: 2px 6px; border-radius: 20px; min-width: 18px; text-align: center;
}
.tab-btn:not(.active) .tab-badge { background: #94a3b8; }

/* SKELETON */
.skeleton-list { display: flex; flex-direction: column; gap: 12px; }
.skeleton-card {
  background: white; border: 1px solid #f1f5f9;
  border-radius: 16px; padding: 18px;
  display: flex; flex-direction: column; gap: 10px;
}
.skeleton-line {
  height: 14px; border-radius: 6px;
  background: linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%);
  background-size: 200% 100%; animation: shimmer 1.4s infinite;
}
.skeleton-line.short { height: 11px; }
.skeleton-line.w-90 { width: 90%; }
.skeleton-line.w-60 { width: 60%; }
.skeleton-line.w-40 { width: 40%; }
@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

/* EMPTY */
.empty-state {
  text-align: center; padding: 48px 24px;
  background: #f8fafc; border-radius: 16px;
  border: 1.5px dashed #e2e8f0; color: #94a3b8;
}
.empty-icon { font-size: 28px; margin-bottom: 10px; }
.empty-title { font-size: 14px; font-weight: 700; color: #64748b; margin: 0; }

/* CARD GROUP */
.card-group { display: flex; flex-direction: column; gap: 12px; }
.card-enter-active, .card-leave-active { transition: opacity 0.25s ease, transform 0.25s ease; }
.card-enter-from { opacity: 0; transform: translateY(-8px) scale(0.98); }
.card-leave-to { opacity: 0; transform: translateX(-12px); }

/* SOLICITUD CARD */
.solicitud-card {
  background: white; border: 1.5px solid #e2e8f0;
  border-radius: 16px; padding: 16px; position: relative;
  transition: box-shadow 0.2s;
}
.solicitud-card:hover { box-shadow: 0 4px 16px rgba(0,0,0,0.07); }
.solicitud-card.accepted  { border-color: #bfdbfe; }
.solicitud-card.completed { border-color: #bbf7d0; background: #f0fdf4; }

.status-pill {
  position: absolute; top: 12px; right: 12px;
  font-size: 10px; font-weight: 800; letter-spacing: 0.5px;
  text-transform: uppercase; padding: 3px 9px; border-radius: 6px;
}
.status-pill.pending   { background: #fef9c3; color: #854d0e; border: 1px solid #fde68a; }
.status-pill.accepted  { background: #eff6ff; color: #1d4ed8; border: 1px solid #bfdbfe; }
.status-pill.completed { background: #dcfce7; color: #166534; border: 1px solid #86efac; }

.card-top {
  display: flex; align-items: center; gap: 10px;
  margin-bottom: 10px; padding-right: 88px;
}
.service-icon-wrap {
  width: 34px; height: 34px; border-radius: 10px;
  background: #eff6ff; display: flex; align-items: center;
  justify-content: center; flex-shrink: 0;
}
.card-service { font-weight: 700; font-size: 14px; flex: 1; }
.card-budget  { font-weight: 800; font-size: 18px; color: #2563eb; letter-spacing: -0.5px; }
.card-description { font-size: 13px; color: #475569; line-height: 1.5; margin: 0 0 10px; }

.card-meta { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 14px; }
.meta-chip {
  display: inline-flex; align-items: center; gap: 5px;
  background: #f8fafc; border: 1px solid #e2e8f0;
  color: #64748b; font-size: 12px; padding: 4px 10px; border-radius: 8px;
}

/* PROFESIONAL BOX */
.professional-box {
  display: flex; align-items: center; gap: 12px;
  background: #f0f9ff; border: 1px solid #bae6fd;
  border-radius: 12px; padding: 12px 14px; margin-bottom: 14px;
}
.pro-avatar {
  width: 40px; height: 40px; border-radius: 10px;
  background: #e0f2fe; flex-shrink: 0;
}
.pro-info { display: flex; flex-direction: column; gap: 2px; }
.pro-label { font-size: 10px; font-weight: 700; color: #0369a1; text-transform: uppercase; letter-spacing: 0.5px; }
.pro-name  { font-size: 14px; font-weight: 700; color: #0c4a6e; }
.pro-phone { font-size: 12px; color: #0369a1; }

.card-divider { height: 1px; background: #f1f5f9; margin-bottom: 14px; }

/* FOOTER */
.card-footer { display: flex; flex-direction: column; gap: 10px; }

/* Código activo */
.code-active-box {
  background: #fffbeb; border: 1.5px solid #fde68a;
  border-radius: 14px; padding: 14px 16px;
  display: flex; flex-direction: column; align-items: center; gap: 8px;
}
.code-active-label {
  font-size: 11px; font-weight: 700; color: #92400e;
  text-transform: uppercase; letter-spacing: 0.5px;
}
.code-digits {
  display: flex; gap: 6px;
}
.code-digit {
  width: 38px; height: 46px;
  background: white; border: 2px solid #f59e0b;
  border-radius: 10px; display: flex; align-items: center; justify-content: center;
  font-size: 22px; font-weight: 900; color: #b45309;
}
.code-expires { font-size: 11px; color: #92400e; text-align: center; }

.btn-regen {
  background: transparent; border: 1px solid #f59e0b;
  color: #b45309; padding: 6px 14px; border-radius: 8px;
  font-size: 12px; font-weight: 700; cursor: pointer;
  font-family: inherit;
}

/* Generar código */
.btn-gen-code {
  width: 100%; padding: 13px;
  background: linear-gradient(135deg, #1d4ed8, #2563eb);
  color: white; border: none; border-radius: 12px;
  font-size: 14px; font-weight: 700; cursor: pointer;
  font-family: inherit;
  transition: opacity 0.15s, transform 0.15s;
}
.btn-gen-code:hover:not(:disabled) { transform: translateY(-1px); }
.btn-gen-code:disabled { opacity: 0.55; cursor: not-allowed; }

/* Completado */
.completed-badge {
  background: #dcfce7; border: 1px solid #86efac;
  color: #166534; font-size: 13px; font-weight: 700;
  padding: 12px; border-radius: 10px; text-align: center;
}

/* TOAST */
.toast {
  position: fixed; bottom: 28px; left: 50%;
  transform: translateX(-50%);
  background: #1e293b; color: #fff;
  padding: 12px 22px; border-radius: 12px;
  font-size: 13px; font-weight: 600; z-index: 9999;
  white-space: nowrap; box-shadow: 0 8px 24px rgba(0,0,0,0.2);
  pointer-events: none;
}
.toast.success { background: #14532d; }
.toast.error   { background: #7f1d1d; }
.toast-enter-active, .toast-leave-active {
  transition: opacity 0.25s ease, transform 0.3s cubic-bezier(.34,1.56,.64,1);
}
.toast-enter-from { opacity: 0; transform: translateX(-50%) translateY(16px) scale(0.95); }
.toast-leave-to   { opacity: 0; transform: translateX(-50%) translateY(10px); }

@media (max-width: 480px) {
  .tabs { width: 100%; }
  .tab-btn { flex: 1; justify-content: center; padding: 8px 8px; }
}
</style>