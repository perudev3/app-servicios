<template>
    <div class="trabajos-container">

        <!-- TABS -->
        <div class="tabs">
            <button v-for="tab in tabs" :key="tab.key" class="tab-btn" :class="{ active: activeTab === tab.key }"
                @click="activeTab = tab.key">
                {{ tab.label }}
                <span v-if="countByTab(tab.key)" class="tab-badge">
                    {{ countByTab(tab.key) }}
                </span>
            </button>
        </div>

        <!-- LOADING -->
        <div v-if="loading" class="skeleton-list">
            <div v-for="n in 2" :key="n" class="skeleton-card">
                <div class="skeleton-line w-60"></div>
                <div class="skeleton-line w-90 short"></div>
                <div class="skeleton-line w-40 short"></div>
            </div>
        </div>

        <!-- EMPTY -->
        <div v-else-if="filtered.length === 0" class="empty-state">
            <div class="empty-icon">🗂️</div>
            <p class="empty-title">Sin trabajos en esta sección</p>
        </div>

        <!-- CARDS -->
        <TransitionGroup v-else name="card" tag="div" class="card-group">
            <div v-for="job in filtered" :key="job.id" class="job-card"
                :class="{ completed: job.status === 'completed' }">

                <!-- Status pill -->
                <span class="status-pill" :class="job.status">
                    {{ statusLabel(job.status) }}
                </span>

                <!-- Top -->
                <div class="job-top">
                    <div class="service-icon-wrap">
                        <svg viewBox="0 0 24 24" fill="none" stroke="#2563eb" stroke-width="2" width="16" height="16">
                            <path
                                d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z" />
                        </svg>
                    </div>
                    <div class="job-service">{{ job.service_name }}</div>
                    <div class="job-budget">${{ job.budget }}</div>
                </div>

                <p class="job-description">{{ job.description }}</p>

                <!-- Meta -->
                <div class="job-meta">
                    <span class="meta-chip">📅 {{ job.service_date }} {{ job.service_time }}</span>
                    <span v-if="job.address" class="meta-chip">📍 {{ job.address }}</span>
                </div>

                <div class="job-divider"></div>

                <!-- Footer -->
                <div class="job-footer">
                    <div class="client-info">
                        <div class="client-avatar">{{ getInitials(job.client_name) }}</div>
                        <div>
                            <span class="client-name">{{ job.client_name }}</span>
                            <span v-if="job.client_phone" class="client-phone">{{ job.client_phone }}</span>
                        </div>
                    </div>

                    <div class="job-actions">
                        <button v-if="job.status === 'accepted'" class="btn-evidence" @click="openEvidenceModal(job)">
                            📷 Evidencias
                        </button>
                        <button v-if="job.status === 'accepted'" class="btn-complete" @click="openCodeModal(job)">
                            ✓ Completar
                        </button>
                        <button v-if="job.status === 'completed'" class="btn-view-ev" @click="openEvidenceModal(job)">
                            🖼️ Ver evidencias
                        </button>
                    </div>
                </div>

            </div>
        </TransitionGroup>

        <!-- ===================== -->
        <!-- MODAL EVIDENCIAS      -->
        <!-- ===================== -->
        <Transition name="modal">
            <div v-if="evidenceModal" class="modal-overlay" @click.self="evidenceModal = false">
                <div class="modal-evidence">

                    <div class="modal-ev-header">
                        <div>
                            <h3>Evidencias del trabajo</h3>
                            <p>{{ selectedJob?.service_name }} — {{ selectedJob?.client_name }}</p>
                        </div>
                        <button class="btn-modal-close" @click="evidenceModal = false">✕</button>
                    </div>

                    <!-- Lista de evidencias subidas -->
                    <div class="evidences-grid" v-if="evidences.length">
                        <div v-for="ev in evidences" :key="ev.id" class="evidence-item">
                            <img v-if="ev.file_type === 'image'" :src="ev.file_url" class="ev-preview" />
                            <div v-else class="ev-file-icon">
                                {{ ev.file_type === 'video' ? '🎥' : '📄' }}
                            </div>
                            <p class="ev-note">{{ ev.note || 'Sin nota' }}</p>
                            <span class="ev-date">{{ ev.created_at }}</span>
                        </div>
                    </div>
                    <p v-else class="no-evidences">Aún no hay evidencias subidas.</p>

                    <!-- Subir nueva evidencia -->
                    <div v-if="selectedJob?.status === 'accepted'" class="upload-section">
                        <p class="upload-title">Subir nueva evidencia</p>

                        <label class="file-drop" :class="{ 'has-file': uploadFile }">
                            <input type="file" accept="image/*,video/*,.pdf" @change="onFileChange"
                                class="hidden-input" />
                            <span v-if="!uploadFile">
                                📎 Toca para seleccionar imagen, video o PDF
                            </span>
                            <span v-else class="file-selected">
                                ✓ {{ uploadFile.name }}
                            </span>
                        </label>

                        <textarea v-model="uploadNote" class="note-input"
                            placeholder="Nota opcional (ej: trabajo finalizado en cocina)" rows="2"></textarea>

                        <button class="btn-upload" :disabled="!uploadFile || uploading" @click="submitEvidence">
                            {{ uploading ? 'Subiendo...' : '⬆️ Subir evidencia' }}
                        </button>
                    </div>

                </div>
            </div>
        </Transition>

        <!-- MODAL CÓDIGO -->
        <Transition name="modal">
            <div v-if="codeModal" class="modal-overlay" @click.self="codeModal = false">
                <div class="modal-code">

                    <div class="modal-code-header">
                        <div class="code-icon">🔐</div>
                        <div>
                            <h3>Código de aprobación</h3>
                            <p>Ingresa el código de 6 dígitos que el cliente te proporcionó</p>
                        </div>
                    </div>

                    <div class="code-inputs">
                        <input v-for="(digit, i) in codeDigits" :key="i" :ref="el => digitRefs[i] = el"
                            v-model="codeDigits[i]" type="text" inputmode="numeric" maxlength="1" class="digit-input"
                            :class="{ filled: digit }" @input="onDigitInput(i)" @keydown.backspace="onBackspace(i)"
                            @paste.prevent="onPaste($event)" />
                    </div>

                    <p v-if="codeError" class="code-error">{{ codeError }}</p>

                    <div class="modal-code-actions">
                        <button class="btn-cancel-code" @click="codeModal = false">Cancelar</button>
                        <button class="btn-verify" :disabled="fullCode.length < 6 || verifying" @click="submitCode">
                            {{ verifying ? 'Verificando...' : 'Verificar →' }}
                        </button>
                    </div>

                </div>
            </div>
        </Transition>

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
    { key: 'accepted', label: 'En curso' },
    { key: 'completed', label: 'Completados' },
]
const activeTab = ref('accepted')
const loading = ref(true)
const completing = ref(null)
const jobs = ref([])

const evidenceModal = ref(false)
const selectedJob = ref(null)
const evidences = ref([])
const uploadFile = ref(null)
const uploadNote = ref('')
const uploading = ref(false)


const codeModal   = ref(false)
const codeDigits  = ref(['', '', '', '', '', ''])
const digitRefs   = ref([])
const codeError   = ref('')
const verifying   = ref(null)
const codeJob     = ref(null)

const fullCode = computed(() => codeDigits.value.join(''))

const openCodeModal = (job) => {
  codeJob.value    = job
  codeDigits.value = ['', '', '', '', '', '']
  codeError.value  = ''
  codeModal.value  = true
  // focus al primer input después del render
  setTimeout(() => { digitRefs.value[0]?.focus() }, 100)
}

const onDigitInput = (i) => {
  // Solo números
  codeDigits.value[i] = codeDigits.value[i].replace(/\D/, '')
  codeError.value = ''
  if (codeDigits.value[i] && i < 5) {
    digitRefs.value[i + 1]?.focus()
  }
}

const onBackspace = (i) => {
  if (!codeDigits.value[i] && i > 0) {
    codeDigits.value[i - 1] = ''
    digitRefs.value[i - 1]?.focus()
  }
}

const onPaste = (e) => {
  const text = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
  text.split('').forEach((char, i) => {
    codeDigits.value[i] = char
  })
  digitRefs.value[Math.min(text.length, 5)]?.focus()
}

const submitCode = async () => {
  if (fullCode.value.length < 6) return
  verifying.value = true
  codeError.value = ''

  try {
    await api.post(`/professional/requests/${codeJob.value.id}/verify-code`, {
      code: fullCode.value,
    })

    // Actualizar estado local
    const found = jobs.value.find(j => j.id === codeJob.value.id)
    if (found) found.status = 'completed'

    codeModal.value = false
    showToast('✓ Trabajo completado y aprobado', 'success')

  } catch (error) {
    codeError.value = error.response?.data?.message || 'Código incorrecto'
    // Limpiar inputs en error
    codeDigits.value = ['', '', '', '', '', '']
    setTimeout(() => digitRefs.value[0]?.focus(), 50)
  } finally {
    verifying.value = false
  }
}

const toast = ref({ visible: false, message: '', type: '' })
let toastTimer = null

/* ============ utils ============ */
const getInitials = (name = '') =>
    name.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase()

const statusLabel = (s) => ({
    accepted: 'En curso',
    completed: 'Completado',
}[s] || s)

const countByTab = (key) => jobs.value.filter(j => j.status === key).length

const filtered = computed(() => jobs.value.filter(j => j.status === activeTab.value))

const showToast = (message, type = '') => {
    clearTimeout(toastTimer)
    toast.value = { visible: true, message, type }
    toastTimer = setTimeout(() => { toast.value.visible = false }, 3000)
}

/* ============ load ============ */
const loadJobs = async () => {
    try {
        const res = await api.get('/professional/requests/accepted')
        jobs.value = res.data
    } catch {
        showToast('Error al cargar trabajos', 'error')
    } finally {
        loading.value = false
    }
}

/* ============ complete ============ */
const markComplete = async (job) => {
    try {
        completing.value = job.id
        await api.post(`/professional/requests/${job.id}/complete`)
        const found = jobs.value.find(j => j.id === job.id)
        if (found) found.status = 'completed'
        showToast('✓ Trabajo marcado como completado', 'success')
    } catch {
        showToast('Error al completar el trabajo', 'error')
    } finally {
        completing.value = null
    }
}

/* ============ evidences ============ */
const openEvidenceModal = async (job) => {
    selectedJob.value = job
    evidences.value = []
    uploadFile.value = null
    uploadNote.value = ''
    evidenceModal.value = true

    try {
        const res = await api.get(`/professional/requests/${job.id}/evidences`)
        evidences.value = res.data
    } catch {
        showToast('Error al cargar evidencias', 'error')
    }
}

const onFileChange = (e) => {
    uploadFile.value = e.target.files[0] || null
}

const submitEvidence = async () => {
    if (!uploadFile.value) return
    uploading.value = true

    try {
        const form = new FormData()
        form.append('file', uploadFile.value)
        form.append('note', uploadNote.value)

        const res = await api.post(
            `/professional/requests/${selectedJob.value.id}/evidences`,
            form,
            { headers: { 'Content-Type': 'multipart/form-data' } }
        )

        evidences.value.unshift({
            id: res.data.id,
            file_url: res.data.file_url,
            file_type: uploadFile.value.type.startsWith('image') ? 'image' : 'file',
            note: uploadNote.value,
            created_at: 'Ahora',
        })

        uploadFile.value = null
        uploadNote.value = ''
        showToast('✓ Evidencia subida', 'success')
    } catch {
        showToast('Error al subir la evidencia', 'error')
    } finally {
        uploading.value = false
    }
}

onMounted(loadJobs)
</script>

<style scoped>
/* ======================= */
/* CONTAINER               */
/* ======================= */
.trabajos-container {
    display: flex;
    flex-direction: column;
    gap: 16px;
    padding-bottom: 32px;
}

/* ======================= */
/* TABS                    */
/* ======================= */
.tabs {
    display: flex;
    gap: 8px;
    background: #f1f5f9;
    padding: 4px;
    border-radius: 12px;
    width: fit-content;
}

.tab-btn {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 8px 18px;
    border-radius: 9px;
    border: none;
    background: transparent;
    font-size: 13px;
    font-weight: 700;
    color: #64748b;
    cursor: pointer;
    transition: background 0.2s, color 0.2s;
    font-family: inherit;
}

.tab-btn.active {
    background: white;
    color: #2563eb;
    box-shadow: 0 1px 6px rgba(0, 0, 0, 0.08);
}

.tab-badge {
    background: #2563eb;
    color: white;
    font-size: 10px;
    font-weight: 800;
    padding: 2px 6px;
    border-radius: 20px;
    min-width: 18px;
    text-align: center;
}

.tab-btn:not(.active) .tab-badge {
    background: #94a3b8;
}

/* ======================= */
/* SKELETON                */
/* ======================= */
.skeleton-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.skeleton-card {
    background: white;
    border: 1px solid #f1f5f9;
    border-radius: 16px;
    padding: 18px;
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.skeleton-line {
    height: 14px;
    border-radius: 6px;
    background: linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%);
    background-size: 200% 100%;
    animation: shimmer 1.4s infinite;
}

.skeleton-line.short {
    height: 11px;
}

.skeleton-line.w-90 {
    width: 90%;
}

.skeleton-line.w-60 {
    width: 60%;
}

.skeleton-line.w-40 {
    width: 40%;
}

@keyframes shimmer {
    0% {
        background-position: 200% 0;
    }

    100% {
        background-position: -200% 0;
    }
}

/* ======================= */
/* EMPTY                   */
/* ======================= */
.empty-state {
    text-align: center;
    padding: 48px 24px;
    background: #f8fafc;
    border-radius: 16px;
    border: 1.5px dashed #e2e8f0;
    color: #94a3b8;
}

.empty-icon {
    font-size: 28px;
    margin-bottom: 10px;
}

.empty-title {
    font-size: 14px;
    font-weight: 700;
    color: #64748b;
    margin: 0;
}

/* ======================= */
/* CARD GROUP              */
/* ======================= */
.card-group {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.card-enter-active,
.card-leave-active {
    transition: opacity 0.25s ease, transform 0.25s ease;
}

.card-enter-from {
    opacity: 0;
    transform: translateY(-8px) scale(0.98);
}

.card-leave-to {
    opacity: 0;
    transform: translateX(-12px);
}

/* ======================= */
/* JOB CARD                */
/* ======================= */
.job-card {
    background: white;
    border: 1.5px solid #e2e8f0;
    border-radius: 16px;
    padding: 16px;
    position: relative;
    transition: box-shadow 0.2s;
}

.job-card:hover {
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.07);
}

.job-card.completed {
    border-color: #bbf7d0;
    background: #f0fdf4;
}

.status-pill {
    position: absolute;
    top: 12px;
    right: 12px;
    font-size: 10px;
    font-weight: 800;
    letter-spacing: 0.5px;
    text-transform: uppercase;
    padding: 3px 9px;
    border-radius: 6px;
}

.status-pill.accepted {
    background: #eff6ff;
    color: #1d4ed8;
    border: 1px solid #bfdbfe;
}

.status-pill.completed {
    background: #dcfce7;
    color: #166534;
    border: 1px solid #86efac;
}

.job-top {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 10px;
    padding-right: 88px;
}

.service-icon-wrap {
    width: 34px;
    height: 34px;
    border-radius: 10px;
    background: #eff6ff;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
}

.job-service {
    font-weight: 700;
    font-size: 14px;
    flex: 1;
}

.job-budget {
    font-weight: 800;
    font-size: 18px;
    color: #2563eb;
    letter-spacing: -0.5px;
}

.job-description {
    font-size: 13px;
    color: #475569;
    line-height: 1.5;
    margin: 0 0 10px;
}

.job-meta {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    margin-bottom: 14px;
}

.meta-chip {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    color: #64748b;
    font-size: 12px;
    padding: 4px 10px;
    border-radius: 8px;
}

.job-divider {
    height: 1px;
    background: #f1f5f9;
    margin-bottom: 14px;
}

/* ======================= */
/* JOB FOOTER              */
/* ======================= */
.job-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 10px;
    flex-wrap: wrap;
}

.client-info {
    display: flex;
    align-items: center;
    gap: 8px;
}

.client-avatar {
    width: 32px;
    height: 32px;
    border-radius: 8px;
    background: #e0e7ff;
    color: #3730a3;
    font-size: 11px;
    font-weight: 800;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
}

.client-name {
    font-size: 13px;
    font-weight: 600;
    color: #334155;
    display: block;
}

.client-phone {
    font-size: 11px;
    color: #64748b;
}

.job-actions {
    display: flex;
    gap: 6px;
    flex-wrap: wrap;
}

.btn-evidence {
    background: #ecfdf5;
    color: #065f46;
    border: 1px solid #a7f3d0;
    padding: 9px 14px;
    border-radius: 10px;
    font-size: 13px;
    font-weight: 700;
    cursor: pointer;
    font-family: inherit;
    transition: background 0.15s, transform 0.15s;
}

.btn-evidence:hover {
    background: #d1fae5;
    transform: translateY(-1px);
}

.btn-complete {
    background: linear-gradient(135deg, #1d4ed8, #2563eb);
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 10px;
    font-size: 13px;
    font-weight: 700;
    cursor: pointer;
    font-family: inherit;
    transition: opacity 0.15s, transform 0.15s, box-shadow 0.15s;
}

.btn-complete:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 4px 14px rgba(37, 99, 235, 0.35);
}

.btn-complete:disabled {
    opacity: 0.55;
    cursor: not-allowed;
}

.btn-view-ev {
    background: #f0fdf4;
    color: #166534;
    border: 1px solid #86efac;
    padding: 9px 14px;
    border-radius: 10px;
    font-size: 13px;
    font-weight: 700;
    cursor: pointer;
    font-family: inherit;
}

/* ======================= */
/* MODAL EVIDENCIAS        */
/* ======================= */
.modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.45);
    display: flex;
    justify-content: center;
    align-items: flex-end;
    z-index: 999;
    padding: 0;
}

.modal-evidence {
    background: white;
    width: 100%;
    max-width: 480px;
    border-radius: 20px 20px 0 0;
    padding: 20px;
    max-height: 85vh;
    overflow-y: auto;
    animation: slideUp 0.25s ease;
}

@keyframes slideUp {
    from {
        transform: translateY(60px);
        opacity: 0;
    }

    to {
        transform: translateY(0);
        opacity: 1;
    }
}

.modal-ev-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 16px;
}

.modal-ev-header h3 {
    font-size: 16px;
    font-weight: 800;
    margin: 0 0 3px;
}

.modal-ev-header p {
    font-size: 12px;
    color: #64748b;
    margin: 0;
}

.btn-modal-close {
    background: #f1f5f9;
    border: none;
    width: 32px;
    height: 32px;
    border-radius: 8px;
    font-size: 14px;
    cursor: pointer;
    flex-shrink: 0;
}

/* Grid evidencias */
.evidences-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
    gap: 10px;
    margin-bottom: 16px;
}

.evidence-item {
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 10px;
    padding: 8px;
    text-align: center;
}

.ev-preview {
    width: 100%;
    height: 80px;
    object-fit: cover;
    border-radius: 6px;
    margin-bottom: 6px;
}

.ev-file-icon {
    font-size: 32px;
    margin-bottom: 6px;
}

.ev-note {
    font-size: 11px;
    color: #475569;
    margin: 0 0 3px;
}

.ev-date {
    font-size: 10px;
    color: #94a3b8;
}

.no-evidences {
    font-size: 13px;
    color: #94a3b8;
    text-align: center;
    padding: 16px 0;
}

/* Upload */
.upload-section {
    border-top: 1px solid #f1f5f9;
    padding-top: 16px;
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.upload-title {
    font-size: 13px;
    font-weight: 700;
    color: #334155;
    margin: 0;
}

.file-drop {
    display: flex;
    align-items: center;
    justify-content: center;
    border: 2px dashed #cbd5e1;
    border-radius: 12px;
    padding: 20px;
    cursor: pointer;
    font-size: 13px;
    color: #64748b;
    transition: border-color 0.2s, background 0.2s;
    text-align: center;
}

.file-drop:hover {
    border-color: #2563eb;
    background: #eff6ff;
}

.file-drop.has-file {
    border-color: #22c55e;
    background: #f0fdf4;
}

.file-drop .file-selected {
    color: #15803d;
    font-weight: 700;
}

.hidden-input {
    display: none;
}

.note-input {
    width: 100%;
    padding: 10px 12px;
    border: 1.5px solid #e2e8f0;
    border-radius: 10px;
    font-size: 13px;
    font-family: inherit;
    color: #334155;
    resize: none;
    box-sizing: border-box;
    transition: border-color 0.2s;
}

.note-input:focus {
    outline: none;
    border-color: #2563eb;
}

.btn-upload {
    background: linear-gradient(135deg, #1d4ed8, #2563eb);
    color: white;
    border: none;
    padding: 12px;
    border-radius: 10px;
    font-size: 14px;
    font-weight: 700;
    cursor: pointer;
    font-family: inherit;
    transition: opacity 0.15s;
}

.btn-upload:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

/* ======================= */
/* MODAL TRANSITION        */
/* ======================= */
.modal-enter-active,
.modal-leave-active {
    transition: opacity 0.2s ease;
}

.modal-enter-from,
.modal-leave-to {
    opacity: 0;
}

/* ======================= */
/* TOAST                   */
/* ======================= */
.toast {
    position: fixed;
    bottom: 28px;
    left: 50%;
    transform: translateX(-50%);
    background: #1e293b;
    color: #fff;
    padding: 12px 22px;
    border-radius: 12px;
    font-size: 13px;
    font-weight: 600;
    z-index: 9999;
    white-space: nowrap;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
    pointer-events: none;
}

.toast.success {
    background: #14532d;
}

.toast.error {
    background: #7f1d1d;
}

.toast-enter-active,
.toast-leave-active {
    transition: opacity 0.25s ease, transform 0.3s cubic-bezier(.34, 1.56, .64, 1);
}

.toast-enter-from {
    opacity: 0;
    transform: translateX(-50%) translateY(16px) scale(0.95);
}

.toast-leave-to {
    opacity: 0;
    transform: translateX(-50%) translateY(10px);
}

/* ======================= */
/* RESPONSIVE              */
/* ======================= */
@media (max-width: 480px) {
    .job-footer {
        flex-direction: column;
        align-items: stretch;
    }

    .job-actions {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 8px;
    }

    .btn-complete {
        grid-column: span 2;
        padding: 13px;
    }

    .modal-evidence {
        border-radius: 20px 20px 0 0;
    }
}

/* ======================= */
/* MODAL CÓDIGO            */
/* ======================= */
.modal-code {
  background: white;
  width: 100%;
  max-width: 360px;
  border-radius: 20px 20px 0 0;
  padding: 28px 24px;
  animation: slideUp 0.25s ease;
}

.modal-code-header {
  display: flex;
  gap: 14px;
  align-items: flex-start;
  margin-bottom: 24px;
}

.code-icon {
  font-size: 28px;
  width: 48px;
  height: 48px;
  background: #eff6ff;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.modal-code-header h3 {
  font-size: 16px;
  font-weight: 800;
  margin: 0 0 4px;
  color: #0f172a;
}

.modal-code-header p {
  font-size: 12px;
  color: #64748b;
  margin: 0;
  line-height: 1.4;
}

/* Inputs de dígitos */
.code-inputs {
  display: flex;
  gap: 8px;
  justify-content: center;
  margin-bottom: 8px;
}

.digit-input {
  width: 44px;
  height: 54px;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  text-align: center;
  font-size: 22px;
  font-weight: 800;
  color: #1e293b;
  font-family: inherit;
  transition: border-color 0.2s, box-shadow 0.2s;
  outline: none;
  background: #f8fafc;
}

.digit-input:focus {
  border-color: #2563eb;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
  background: white;
}

.digit-input.filled {
  border-color: #2563eb;
  background: #eff6ff;
  color: #1d4ed8;
}

.code-error {
  text-align: center;
  font-size: 12px;
  font-weight: 600;
  color: #dc2626;
  margin: 4px 0 12px;
  min-height: 18px;
}

.modal-code-actions {
  display: flex;
  gap: 8px;
  margin-top: 16px;
}

.btn-cancel-code {
  flex: 1;
  padding: 12px;
  border: 1.5px solid #e2e8f0;
  background: white;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 700;
  color: #64748b;
  cursor: pointer;
  font-family: inherit;
}

.btn-verify {
  flex: 2;
  padding: 12px;
  background: linear-gradient(135deg, #1d4ed8, #2563eb);
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  font-family: inherit;
  transition: opacity 0.15s;
}

.btn-verify:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}
</style>