<template>
  <div class="users-panel">

    <!-- Page Header -->
    <div class="page-header">
      <div class="header-left">
        <div class="header-icon">👥</div>
        <div>
          <h1 class="page-title">Gestión de Usuarios</h1>
          <p class="page-subtitle">
            <span class="total-badge">{{ pagination.total }} usuarios registrados</span>
            <span class="subtitle-sep">·</span>
            Última actualización: {{ lastUpdated }}
          </p>
        </div>
      </div>
      <div class="header-actions">
        <button class="btn-refresh" @click="fetchUsers" :disabled="loading">
          <span :class="{ spinning: loading }">🔄</span>
          <span class="btn-text">Actualizar</span>
        </button>
        <button class="btn-export" @click="exportCSV">
          <span>📥</span>
          <span class="btn-text">Exportar</span>
        </button>
      </div>
    </div>

    <!-- Stat Cards Row -->
    <div class="stat-row">
      <div class="mini-stat" v-for="stat in statsRow" :key="stat.label" :class="stat.color">
        <span class="mini-stat-icon">{{ stat.icon }}</span>
        <div>
          <div class="mini-stat-value">{{ stat.value }}</div>
          <div class="mini-stat-label">{{ stat.label }}</div>
        </div>
      </div>
    </div>

    <!-- Filters Bar -->
    <div class="filters-bar">
      <!-- Search -->
      <div class="search-wrapper">
        <span class="search-icon">🔍</span>
        <input
          v-model="filters.search"
          @input="onSearchInput"
          type="text"
          placeholder="Buscar por nombre o email..."
          class="search-input"
        />
        <button v-if="filters.search" class="search-clear" @click="filters.search = ''; fetchUsers()">✕</button>
      </div>

      <!-- Role filter -->
      <div class="filter-group">
        <button
          v-for="r in roleFilters"
          :key="r.value"
          :class="['filter-chip', { active: filters.role === r.value }]"
          @click="setRoleFilter(r.value)"
        >
          <span>{{ r.icon }}</span>
          <span>{{ r.label }}</span>
          <span class="chip-count">{{ r.count }}</span>
        </button>
      </div>

      <!-- Status filter -->
      <div class="filter-group">
        <button
          v-for="s in statusFilters"
          :key="s.value"
          :class="['filter-chip', { active: filters.status === s.value }]"
          @click="setStatusFilter(s.value)"
        >
          <span :class="['status-dot-mini', s.value]"></span>
          <span>{{ s.label }}</span>
        </button>
      </div>

      <!-- Per page -->
      <select v-model="filters.perPage" @change="fetchUsers" class="per-page-select">
        <option value="10">10 / pág</option>
        <option value="25">25 / pág</option>
        <option value="50">50 / pág</option>
      </select>
    </div>

    <!-- Loading skeleton -->
    <div v-if="loading" class="skeleton-list">
      <div v-for="n in 6" :key="n" class="skeleton-row">
        <div class="sk sk-avatar"></div>
        <div class="sk-info">
          <div class="sk sk-line wide"></div>
          <div class="sk sk-line narrow"></div>
        </div>
        <div class="sk sk-badge"></div>
        <div class="sk sk-badge"></div>
        <div class="sk sk-btn"></div>
      </div>
    </div>

    <!-- Error -->
    <div v-else-if="error" class="error-state">
      <span class="error-icon">⚠️</span>
      <p>{{ error }}</p>
      <button class="btn-retry" @click="fetchUsers">Reintentar</button>
    </div>

    <!-- Empty -->
    <div v-else-if="users.length === 0" class="empty-state">
      <span class="empty-icon">🔍</span>
      <p class="empty-title">No se encontraron usuarios</p>
      <p class="empty-sub">Intenta con otros filtros de búsqueda</p>
      <button class="btn-clear-filters" @click="clearFilters">Limpiar filtros</button>
    </div>

    <!-- Users Table (desktop) -->
    <div v-else class="table-wrapper">
      <table class="users-table">
        <thead>
          <tr>
            <th>
              <label class="checkbox-wrap">
                <input type="checkbox" :checked="allSelected" @change="toggleSelectAll" />
                <span class="custom-check"></span>
              </label>
            </th>
            <th @click="setSort('name')" class="sortable">
              Usuario
              <span class="sort-icon">{{ sortIcon('name') }}</span>
            </th>
            <th @click="setSort('email')" class="sortable hide-md">
              Email
              <span class="sort-icon">{{ sortIcon('email') }}</span>
            </th>
            <th>Rol</th>
            <th class="hide-md">Estado</th>
            <th @click="setSort('created_at')" class="sortable hide-sm">
              Registrado
              <span class="sort-icon">{{ sortIcon('created_at') }}</span>
            </th>
            <th class="th-actions">Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="user in users"
            :key="user.id"
            :class="['user-row', { selected: selectedIds.includes(user.id) }]"
          >
            <!-- Checkbox -->
            <td class="td-check">
              <label class="checkbox-wrap">
                <input type="checkbox" :checked="selectedIds.includes(user.id)" @change="toggleSelect(user.id)" />
                <span class="custom-check"></span>
              </label>
            </td>

            <!-- User -->
            <td class="td-user">
              <div class="user-cell">
                <div class="avatar-wrap">
                  <img
                    :src="`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`"
                    :alt="user.name"
                    class="user-avatar"
                  />
                  <span :class="['online-dot', user.email_verified_at ? 'active' : 'inactive']"></span>
                </div>
                <div class="user-meta">
                  <span class="user-name">{{ user.name }}</span>
                  <span class="user-email-mobile hide-desktop">{{ user.email }}</span>
                  <span class="user-id">#{{ String(user.id).padStart(4, '0') }}</span>
                </div>
              </div>
            </td>

            <!-- Email -->
            <td class="td-email hide-md">
              <span class="email-text">{{ user.email }}</span>
            </td>

            <!-- Role -->
            <td class="td-role">
              <span :class="['role-badge', `role-${user.role}`]">
                {{ roleLabels[user.role]?.icon }} {{ roleLabels[user.role]?.label }}
              </span>
            </td>

            <!-- Status -->
            <td class="td-status hide-md">
              <span :class="['status-badge', user.email_verified_at ? 'status-active' : 'status-pending']">
                <span class="status-dot"></span>
                {{ user.email_verified_at ? 'Verificado' : 'Pendiente' }}
              </span>
            </td>

            <!-- Date -->
            <td class="td-date hide-sm">
              <span class="date-text">{{ formatDate(user.created_at) }}</span>
              <span class="date-relative">{{ timeAgo(user.created_at) }}</span>
            </td>

            <!-- Actions -->
            <td class="td-actions">
              <div class="actions-wrap">
                <button class="action-btn view-btn"   @click="openDetail(user)"         title="Ver detalle">👁️</button>
                <button class="action-btn edit-btn"   @click="openEdit(user)"           title="Editar">✏️</button>
                <button class="action-btn delete-btn" @click="confirmDelete(user)"      title="Eliminar">🗑️</button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Bulk Actions -->
    <div v-if="selectedIds.length > 0" class="bulk-bar">
      <span class="bulk-count">{{ selectedIds.length }} seleccionados</span>
      <div class="bulk-actions">
        <button class="bulk-btn" @click="bulkAction('activate')">✅ Activar</button>
        <button class="bulk-btn danger" @click="bulkAction('delete')">🗑️ Eliminar</button>
      </div>
      <button class="bulk-clear" @click="selectedIds = []">✕</button>
    </div>

    <!-- Pagination -->
    <div v-if="!loading && users.length > 0" class="pagination">
      <span class="pagination-info">
        Mostrando {{ paginationFrom }}–{{ paginationTo }} de {{ pagination.total }}
      </span>
      <div class="pagination-controls">
        <button class="page-btn" :disabled="pagination.currentPage === 1" @click="goToPage(1)">«</button>
        <button class="page-btn" :disabled="pagination.currentPage === 1" @click="goToPage(pagination.currentPage - 1)">‹</button>

        <button
          v-for="page in visiblePages"
          :key="page"
          :class="['page-btn', { active: page === pagination.currentPage, ellipsis: page === '...' }]"
          :disabled="page === '...'"
          @click="page !== '...' && goToPage(page)"
        >{{ page }}</button>

        <button class="page-btn" :disabled="pagination.currentPage === pagination.lastPage" @click="goToPage(pagination.currentPage + 1)">›</button>
        <button class="page-btn" :disabled="pagination.currentPage === pagination.lastPage" @click="goToPage(pagination.lastPage)">»</button>
      </div>
    </div>

    <!-- ── MODAL: Detail ───────────────────────────────── -->
    <Teleport to="body">
      <div v-if="showDetail" class="modal-overlay" @click.self="showDetail = false">
        <div class="modal detail-modal">
          <div class="modal-header">
            <h3>Detalle del Usuario</h3>
            <button class="modal-close" @click="showDetail = false">✕</button>
          </div>
          <div class="modal-body" v-if="selectedUser">
            <div class="detail-avatar-section">
              <img :src="`https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedUser.name}`" class="detail-avatar" />
              <div>
                <div class="detail-name">{{ selectedUser.name }}</div>
                <span :class="['role-badge', `role-${selectedUser.role}`]">
                  {{ roleLabels[selectedUser.role]?.icon }} {{ roleLabels[selectedUser.role]?.label }}
                </span>
              </div>
            </div>
            <div class="detail-grid">
              <div class="detail-item">
                <span class="detail-label">Email</span>
                <span class="detail-value">{{ selectedUser.email }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Estado</span>
                <span :class="['status-badge', selectedUser.email_verified_at ? 'status-active' : 'status-pending']">
                  <span class="status-dot"></span>
                  {{ selectedUser.email_verified_at ? 'Verificado' : 'Pendiente' }}
                </span>
              </div>
              <div class="detail-item">
                <span class="detail-label">ID de usuario</span>
                <span class="detail-value">#{{ String(selectedUser.id).padStart(4,'0') }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Registrado</span>
                <span class="detail-value">{{ formatDate(selectedUser.created_at) }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Verificado el</span>
                <span class="detail-value">{{ selectedUser.email_verified_at ? formatDate(selectedUser.email_verified_at) : '—' }}</span>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button class="modal-btn secondary" @click="showDetail = false">Cerrar</button>
            <button class="modal-btn primary" @click="openEdit(selectedUser); showDetail = false">Editar</button>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- ── MODAL: Edit ─────────────────────────────────── -->
    <Teleport to="body">
      <div v-if="showEdit" class="modal-overlay" @click.self="showEdit = false">
        <div class="modal edit-modal">
          <div class="modal-header">
            <h3>Editar Usuario</h3>
            <button class="modal-close" @click="showEdit = false">✕</button>
          </div>
          <div class="modal-body" v-if="editForm">
            <div class="form-group">
              <label class="form-label">Nombre</label>
              <input v-model="editForm.name" type="text" class="form-input" />
            </div>
            <div class="form-group">
              <label class="form-label">Email</label>
              <input v-model="editForm.email" type="email" class="form-input" />
            </div>
            <div class="form-group">
              <label class="form-label">Rol</label>
              <select v-model="editForm.role" class="form-input">
                <option value="client">Cliente</option>
                <option value="professional">Profesional</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div v-if="editError" class="form-error">⚠️ {{ editError }}</div>
          </div>
          <div class="modal-footer">
            <button class="modal-btn secondary" @click="showEdit = false">Cancelar</button>
            <button class="modal-btn primary" @click="saveEdit" :disabled="saving">
              {{ saving ? 'Guardando...' : 'Guardar cambios' }}
            </button>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- ── MODAL: Delete Confirm ───────────────────────── -->
    <Teleport to="body">
      <div v-if="showDeleteConfirm" class="modal-overlay" @click.self="showDeleteConfirm = false">
        <div class="modal confirm-modal">
          <div class="confirm-icon">🗑️</div>
          <h3 class="confirm-title">¿Eliminar usuario?</h3>
          <p class="confirm-text">
            Esta acción no se puede deshacer.<br/>
            <strong>{{ userToDelete?.name }}</strong> será eliminado permanentemente.
          </p>
          <div class="modal-footer">
            <button class="modal-btn secondary" @click="showDeleteConfirm = false">Cancelar</button>
            <button class="modal-btn danger" @click="deleteUser" :disabled="saving">
              {{ saving ? 'Eliminando...' : 'Sí, eliminar' }}
            </button>
          </div>
        </div>
      </div>
    </Teleport>

  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import userService from '../../services/userService'

// ─── Estado principal ──────────────────────────────────────
const users      = ref([]);
const loading    = ref(false);
const error      = ref('');
const lastUpdated = ref('—');

// ─── Filtros ───────────────────────────────────────────────
const filters = ref({
  search:  '',
  role:    'all',
  status:  'all',
  perPage: 10,
  sort:    'created_at',
  dir:     'desc',
});

// ─── Paginación ────────────────────────────────────────────
const pagination = ref({ total: 0, currentPage: 1, lastPage: 1, perPage: 10 });

const paginationFrom = computed(() =>
  Math.min((pagination.value.currentPage - 1) * pagination.value.perPage + 1, pagination.value.total)
);
const paginationTo = computed(() =>
  Math.min(pagination.value.currentPage * pagination.value.perPage, pagination.value.total)
);

const visiblePages = computed(() => {
  const { currentPage, lastPage } = pagination.value;
  if (lastPage <= 7) return Array.from({ length: lastPage }, (_, i) => i + 1);
  const pages = [];
  if (currentPage <= 4) {
    pages.push(1, 2, 3, 4, 5, '...', lastPage);
  } else if (currentPage >= lastPage - 3) {
    pages.push(1, '...', lastPage - 4, lastPage - 3, lastPage - 2, lastPage - 1, lastPage);
  } else {
    pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', lastPage);
  }
  return pages;
});

// ─── Estadísticas rápidas ──────────────────────────────────
const statsCache = ref({ total: 0, clients: 0, professionals: 0, admins: 0, verified: 0 });

const statsRow = computed(() => [
  { icon: '👥', label: 'Total',         value: statsCache.value.total,         color: 'blue'   },
  { icon: '👤', label: 'Clientes',      value: statsCache.value.clients,       color: 'green'  },
  { icon: '💼', label: 'Profesionales', value: statsCache.value.professionals, color: 'amber'  },
  { icon: '⚙️', label: 'Admins',        value: statsCache.value.admins,        color: 'red'    },
  { icon: '✅', label: 'Verificados',   value: statsCache.value.verified,      color: 'teal'   },
]);

const roleFilters = computed(() => [
  { value: 'all',          icon: '🌐', label: 'Todos',         count: statsCache.value.total         },
  { value: 'client',       icon: '👤', label: 'Clientes',      count: statsCache.value.clients       },
  { value: 'professional', icon: '💼', label: 'Profesionales', count: statsCache.value.professionals },
  { value: 'admin',        icon: '⚙️', label: 'Admins',        count: statsCache.value.admins        },
]);

const statusFilters = [
  { value: 'all',      label: 'Todos'     },
  { value: 'verified', label: 'Verificados' },
  { value: 'pending',  label: 'Pendientes'  },
];

// ─── Selección ─────────────────────────────────────────────
const selectedIds = ref([]);
const allSelected = computed(() => users.value.length > 0 && users.value.every(u => selectedIds.value.includes(u.id)));

const toggleSelectAll = () => {
  if (allSelected.value) selectedIds.value = [];
  else selectedIds.value = users.value.map(u => u.id);
};
const toggleSelect = (id) => {
  const idx = selectedIds.value.indexOf(id);
  if (idx === -1) selectedIds.value.push(id);
  else selectedIds.value.splice(idx, 1);
};

// ─── Sorting ───────────────────────────────────────────────
const setSort = (col) => {
  if (filters.value.sort === col) {
    filters.value.dir = filters.value.dir === 'asc' ? 'desc' : 'asc';
  } else {
    filters.value.sort = col;
    filters.value.dir = 'asc';
  }
  fetchUsers();
};
const sortIcon = (col) => {
  if (filters.value.sort !== col) return '↕';
  return filters.value.dir === 'asc' ? '↑' : '↓';
};

// ─── Helpers ───────────────────────────────────────────────
const roleLabels = {
  admin:        { icon: '⚙️', label: 'Admin'        },
  client:       { icon: '👤', label: 'Cliente'      },
  professional: { icon: '💼', label: 'Profesional'  },
};

const formatDate = (d) => {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('es-PE', { year: 'numeric', month: 'short', day: 'numeric' });
};

const timeAgo = (d) => {
  if (!d) return '';
  const diff = Date.now() - new Date(d).getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return 'hoy';
  if (days === 1) return 'ayer';
  if (days < 30)  return `hace ${days}d`;
  if (days < 365) return `hace ${Math.floor(days/30)}m`;
  return `hace ${Math.floor(days/365)}a`;
};

let searchTimeout = null;
const onSearchInput = () => {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => { pagination.value.currentPage = 1; fetchUsers(); }, 400);
};

const setRoleFilter = (val) => { filters.value.role = val; pagination.value.currentPage = 1; fetchUsers(); };
const setStatusFilter = (val) => { filters.value.status = val; pagination.value.currentPage = 1; fetchUsers(); };
const clearFilters = () => {
  filters.value = { search: '', role: 'all', status: 'all', perPage: 10, sort: 'created_at', dir: 'desc' };
  pagination.value.currentPage = 1;
  fetchUsers();
};

const goToPage = (page) => { pagination.value.currentPage = page; fetchUsers(); };

// ─── API ───────────────────────────────────────────────────
const fetchUsers = async () => {
  loading.value = true
  error.value = ''

  try {
    const { data } = await userService.getUsers({
      page: pagination.value.currentPage,
      per_page: filters.value.perPage,
      search: filters.value.search,
      role: filters.value.role,
      status: filters.value.status,
      sort: filters.value.sort,
      dir: filters.value.dir
    })

    if (!data.success) {
      throw new Error('Respuesta inválida del servidor')
    }

    // 👇 Laravel devuelve la paginación dentro de "users"
    users.value = data.users.data
    pagination.value.total = data.users.total
    pagination.value.lastPage = data.users.last_page
    pagination.value.currentPage = data.users.current_page
    pagination.value.perPage = data.users.per_page

    // 👇 Stats vienen aparte
    statsCache.value = data.stats

    lastUpdated.value = new Date().toLocaleTimeString('es-PE')

  } catch (err) {
    error.value = 'Error cargando usuarios'
    console.error(err)
  } finally {
    loading.value = false
  }
}

const generateDemoUsers = () => [
  { id: 1,  name: 'María González',  email: 'maria@example.com',  role: 'client',       email_verified_at: '2024-01-15', created_at: '2024-01-10' },
  { id: 2,  name: 'Carlos Mendoza',  email: 'carlos@example.com', role: 'professional', email_verified_at: '2024-01-20', created_at: '2024-01-18' },
  { id: 3,  name: 'Ana Rodríguez',   email: 'ana@example.com',    role: 'client',       email_verified_at: null,         created_at: '2024-02-01' },
  { id: 4,  name: 'Luis Paredes',    email: 'luis@example.com',   role: 'professional', email_verified_at: '2024-02-10', created_at: '2024-02-05' },
  { id: 5,  name: 'Sofia Torres',    email: 'sofia@example.com',  role: 'client',       email_verified_at: '2024-02-12', created_at: '2024-02-08' },
  { id: 6,  name: 'Admin Principal', email: 'admin@example.com',  role: 'admin',        email_verified_at: '2024-01-01', created_at: '2024-01-01' },
  { id: 7,  name: 'Pedro Castillo',  email: 'pedro@example.com',  role: 'client',       email_verified_at: null,         created_at: '2024-02-20' },
  { id: 8,  name: 'Laura García',    email: 'laura@example.com',  role: 'professional', email_verified_at: '2024-02-22', created_at: '2024-02-21' },
  { id: 9,  name: 'Miguel Vargas',   email: 'miguel@example.com', role: 'client',       email_verified_at: '2024-03-01', created_at: '2024-02-28' },
  { id: 10, name: 'Rosa Quispe',     email: 'rosa@example.com',   role: 'professional', email_verified_at: null,         created_at: '2024-03-05' },
];

// ─── Modales ───────────────────────────────────────────────
const showDetail      = ref(false);
const showEdit        = ref(false);
const showDeleteConfirm = ref(false);
const selectedUser    = ref(null);
const userToDelete    = ref(null);
const editForm        = ref(null);
const editError       = ref('');
const saving          = ref(false);

const openDetail = (user) => { selectedUser.value = user; showDetail.value = true; };
const openEdit   = (user) => {
  selectedUser.value = user;
  editForm.value = { ...user };
  editError.value = '';
  showEdit.value = true;
};
const confirmDelete = (user) => { userToDelete.value = user; showDeleteConfirm.value = true; };

const saveEdit = async () => {
  saving.value = true;
  editError.value = '';
  try {
    const { data } = await api.put(`/admin/users/${editForm.value.id}`, editForm.value);
    if (data.success) {
      const idx = users.value.findIndex(u => u.id === editForm.value.id);
      if (idx !== -1) users.value[idx] = { ...users.value[idx], ...editForm.value };
      showEdit.value = false;
    }
  } catch (err) {
    // Demo: actualiza localmente
    const idx = users.value.findIndex(u => u.id === editForm.value.id);
    if (idx !== -1) users.value[idx] = { ...users.value[idx], ...editForm.value };
    showEdit.value = false;
  } finally {
    saving.value = false;
  }
};

const deleteUser = async () => {
  saving.value = true;
  try {
    await api.delete(`/admin/users/${userToDelete.value.id}`);
    users.value = users.value.filter(u => u.id !== userToDelete.value.id);
    pagination.value.total--;
  } catch {
    // Demo: elimina localmente
    users.value = users.value.filter(u => u.id !== userToDelete.value.id);
  } finally {
    saving.value = false;
    showDeleteConfirm.value = false;
    userToDelete.value = null;
  }
};

const bulkAction = async (action) => {
  if (action === 'delete' && !confirm(`¿Eliminar ${selectedIds.value.length} usuarios?`)) return;
  try {
    // await api.post('/admin/users/bulk', { ids: selectedIds.value, action });
    if (action === 'delete') {
      users.value = users.value.filter(u => !selectedIds.value.includes(u.id));
    }
    selectedIds.value = [];
  } catch (err) { console.error(err); }
};

const exportCSV = () => {
  const headers = ['ID','Nombre','Email','Rol','Estado','Registrado'];
  const rows = users.value.map(u => [
    u.id, u.name, u.email, u.role,
    u.email_verified_at ? 'Verificado' : 'Pendiente',
    formatDate(u.created_at),
  ]);
  const csv = [headers, ...rows].map(r => r.join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `usuarios_${new Date().toISOString().split('T')[0]}.csv`;
  a.click();
};

onMounted(fetchUsers);
</script>

<style scoped>
*, *::before, *::after { box-sizing: border-box; }

.users-panel {
  font-family: 'Outfit', -apple-system, sans-serif;
  color: #0f172a;
  padding: 0;
}

/* ─── Page Header ─── */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  gap: 16px;
  flex-wrap: wrap;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.header-icon {
  width: 56px;
  height: 56px;
  background: linear-gradient(135deg, #dbeafe, #bfdbfe);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  flex-shrink: 0;
}

.page-title    { font-size: 28px; font-weight: 900; margin: 0 0 4px; line-height: 1.2; }
.page-subtitle { font-size: 13px; color: #64748b; margin: 0; display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }

.total-badge {
  background: linear-gradient(135deg, #2563eb, #4f46e5);
  color: white;
  padding: 3px 10px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 700;
}

.subtitle-sep { color: #cbd5e1; }

.header-actions { display: flex; gap: 10px; }

.btn-refresh, .btn-export {
  display: flex;
  align-items: center;
  gap: 7px;
  padding: 10px 18px;
  border-radius: 12px;
  border: none;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-refresh { background: #f1f5f9; color: #475569; }
.btn-refresh:hover:not(:disabled) { background: #e2e8f0; }
.btn-refresh:disabled { opacity: 0.6; cursor: not-allowed; }

.btn-export { background: linear-gradient(135deg, #2563eb, #3b82f6); color: white; box-shadow: 0 4px 14px rgba(37,99,235,.3); }
.btn-export:hover { transform: translateY(-1px); box-shadow: 0 6px 20px rgba(37,99,235,.4); }

@keyframes spin { to { transform: rotate(360deg); } }
.spinning { display: inline-block; animation: spin 1s linear infinite; }

/* ─── Stat Row ─── */
.stat-row {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 12px;
  margin-bottom: 20px;
}

.mini-stat {
  background: white;
  border-radius: 14px;
  padding: 14px 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  box-shadow: 0 1px 3px rgba(0,0,0,.06);
  border-left: 4px solid transparent;
  transition: all 0.2s;
}

.mini-stat:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(0,0,0,.08); }

.mini-stat.blue   { border-left-color: #3b82f6; }
.mini-stat.green  { border-left-color: #22c55e; }
.mini-stat.amber  { border-left-color: #f59e0b; }
.mini-stat.red    { border-left-color: #ef4444; }
.mini-stat.teal   { border-left-color: #14b8a6; }

.mini-stat-icon  { font-size: 24px; }
.mini-stat-value { font-size: 22px; font-weight: 900; color: #0f172a; line-height: 1; }
.mini-stat-label { font-size: 11px; color: #94a3b8; font-weight: 600; text-transform: uppercase; letter-spacing: .5px; margin-top: 2px; }

/* ─── Filters Bar ─── */
.filters-bar {
  background: white;
  border-radius: 16px;
  padding: 16px 20px;
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 16px;
  flex-wrap: wrap;
  box-shadow: 0 1px 3px rgba(0,0,0,.06);
}

.search-wrapper {
  position: relative;
  flex: 1;
  min-width: 200px;
  max-width: 320px;
}

.search-icon  { position: absolute; left: 14px; top: 50%; transform: translateY(-50%); font-size: 16px; pointer-events: none; }
.search-clear { position: absolute; right: 12px; top: 50%; transform: translateY(-50%); background: none; border: none; cursor: pointer; color: #94a3b8; font-size: 14px; padding: 2px 6px; border-radius: 4px; }
.search-clear:hover { color: #ef4444; }

.search-input {
  width: 100%;
  padding: 10px 36px;
  background: #f8fafc;
  border: 1.5px solid #e2e8f0;
  border-radius: 10px;
  font-size: 14px;
  color: #0f172a;
  outline: none;
  transition: all 0.2s;
  font-family: inherit;
}

.search-input:focus { border-color: #3b82f6; background: white; box-shadow: 0 0 0 3px rgba(59,130,246,.1); }
.search-input::placeholder { color: #94a3b8; }

.filter-group { display: flex; gap: 6px; flex-wrap: wrap; }

.filter-chip {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 7px 12px;
  background: #f8fafc;
  border: 1.5px solid #e2e8f0;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  color: #64748b;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
  font-family: inherit;
}

.filter-chip:hover { background: #f1f5f9; border-color: #cbd5e1; }
.filter-chip.active { background: linear-gradient(135deg, #eff6ff, #dbeafe); border-color: #3b82f6; color: #2563eb; }

.chip-count {
  background: #e2e8f0;
  color: #64748b;
  padding: 1px 6px;
  border-radius: 6px;
  font-size: 11px;
  font-weight: 800;
}

.filter-chip.active .chip-count { background: #bfdbfe; color: #2563eb; }

.status-dot-mini {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  flex-shrink: 0;
}

.status-dot-mini.verified { background: #22c55e; }
.status-dot-mini.pending  { background: #f59e0b; }
.status-dot-mini.all      { background: #94a3b8; }

.per-page-select {
  padding: 8px 12px;
  background: #f8fafc;
  border: 1.5px solid #e2e8f0;
  border-radius: 10px;
  font-size: 13px;
  font-weight: 600;
  color: #475569;
  cursor: pointer;
  outline: none;
  font-family: inherit;
  margin-left: auto;
}

/* ─── Skeleton ─── */
.skeleton-list { display: flex; flex-direction: column; gap: 1px; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,.06); }

.skeleton-row {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px 20px;
  background: white;
}

.sk {
  background: linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: 6px;
}

@keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }

.sk-avatar  { width: 40px; height: 40px; border-radius: 10px; flex-shrink: 0; }
.sk-info    { flex: 1; display: flex; flex-direction: column; gap: 8px; }
.sk-line    { height: 12px; }
.sk-line.wide   { width: 60%; }
.sk-line.narrow { width: 40%; }
.sk-badge   { width: 70px; height: 26px; border-radius: 8px; }
.sk-btn     { width: 80px; height: 30px; border-radius: 8px; }

/* ─── Error / Empty ─── */
.error-state, .empty-state {
  background: white;
  border-radius: 16px;
  padding: 60px 40px;
  text-align: center;
  box-shadow: 0 1px 3px rgba(0,0,0,.06);
}

.error-icon, .empty-icon { font-size: 48px; display: block; margin-bottom: 12px; }
.error-state p   { color: #ef4444; font-weight: 600; margin-bottom: 16px; }
.empty-title     { font-size: 18px; font-weight: 800; color: #0f172a; margin: 0 0 8px; }
.empty-sub       { color: #94a3b8; font-size: 14px; margin: 0 0 20px; }

.btn-retry, .btn-clear-filters {
  padding: 10px 24px;
  background: linear-gradient(135deg, #2563eb, #3b82f6);
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
}

/* ─── Table ─── */
.table-wrapper {
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0,0,0,.06);
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}

.users-table {
  width: 100%;
  border-collapse: collapse;
  min-width: 600px;
}

thead tr { background: #f8fafc; }

th {
  padding: 14px 16px;
  text-align: left;
  font-size: 12px;
  font-weight: 800;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: .5px;
  white-space: nowrap;
  user-select: none;
}

th.sortable { cursor: pointer; }
th.sortable:hover { color: #2563eb; }

.sort-icon { margin-left: 4px; font-size: 11px; opacity: 0.6; }
.th-actions { text-align: right; }

.user-row {
  border-top: 1px solid #f1f5f9;
  transition: background 0.15s;
}

.user-row:hover    { background: #f8fafc; }
.user-row.selected { background: #eff6ff; }

td { padding: 14px 16px; vertical-align: middle; }

/* Checkbox */
.td-check { width: 44px; }

.checkbox-wrap { display: inline-flex; align-items: center; cursor: pointer; position: relative; }
.checkbox-wrap input[type="checkbox"] { position: absolute; opacity: 0; width: 0; height: 0; }

.custom-check {
  width: 18px;
  height: 18px;
  border: 2px solid #cbd5e1;
  border-radius: 5px;
  background: white;
  transition: all 0.15s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.checkbox-wrap input:checked + .custom-check {
  background: #2563eb;
  border-color: #2563eb;
}

.checkbox-wrap input:checked + .custom-check::after {
  content: '✓';
  color: white;
  font-size: 11px;
  font-weight: 900;
  line-height: 1;
}

/* User cell */
.td-user { min-width: 160px; }

.user-cell { display: flex; align-items: center; gap: 12px; }

.avatar-wrap { position: relative; flex-shrink: 0; }

.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  border: 2px solid #f1f5f9;
  display: block;
}

.online-dot {
  position: absolute;
  bottom: -2px;
  right: -2px;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  border: 2px solid white;
}

.online-dot.active   { background: #22c55e; }
.online-dot.inactive { background: #94a3b8; }

.user-meta { display: flex; flex-direction: column; gap: 2px; min-width: 0; }
.user-name { font-weight: 700; font-size: 14px; color: #0f172a; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.user-id   { font-size: 11px; color: #94a3b8; font-weight: 600; }
.user-email-mobile { font-size: 12px; color: #64748b; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

/* Email */
.td-email    { max-width: 220px; }
.email-text  { font-size: 13px; color: #475569; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; display: block; }

/* Role badge */
.role-badge {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 5px 10px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 700;
  white-space: nowrap;
}

.role-admin        { background: #fee2e2; color: #dc2626; }
.role-client       { background: #dbeafe; color: #2563eb; }
.role-professional { background: #fef3c7; color: #d97706; }

/* Status badge */
.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 5px 10px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 700;
  white-space: nowrap;
}

.status-badge .status-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  flex-shrink: 0;
}

.status-active  { background: #dcfce7; color: #16a34a; }
.status-active .status-dot  { background: #16a34a; }
.status-pending { background: #fef3c7; color: #d97706; }
.status-pending .status-dot { background: #d97706; }

/* Date */
.td-date      { white-space: nowrap; }
.date-text    { font-size: 13px; color: #475569; display: block; }
.date-relative{ font-size: 11px; color: #94a3b8; font-weight: 600; }

/* Actions */
.td-actions   { text-align: right; }
.actions-wrap { display: flex; justify-content: flex-end; gap: 6px; }

.action-btn {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  border: none;
  background: #f8fafc;
  font-size: 15px;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.view-btn:hover   { background: #dbeafe; }
.edit-btn:hover   { background: #fef3c7; }
.delete-btn:hover { background: #fee2e2; }

/* ─── Bulk Bar ─── */
.bulk-bar {
  position: fixed;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%);
  background: #0f172a;
  color: white;
  padding: 14px 24px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  gap: 16px;
  box-shadow: 0 8px 32px rgba(0,0,0,.3);
  z-index: 100;
  white-space: nowrap;
}

.bulk-count   { font-size: 14px; font-weight: 700; }
.bulk-actions { display: flex; gap: 8px; }

.bulk-btn {
  padding: 7px 16px;
  border-radius: 8px;
  border: none;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  background: rgba(255,255,255,.15);
  color: white;
  transition: all 0.2s;
}

.bulk-btn:hover        { background: rgba(255,255,255,.25); }
.bulk-btn.danger       { background: rgba(239,68,68,.2); }
.bulk-btn.danger:hover { background: rgba(239,68,68,.4); }

.bulk-clear { background: none; border: none; color: #94a3b8; font-size: 18px; cursor: pointer; padding: 0 4px; }
.bulk-clear:hover { color: white; }

/* ─── Pagination ─── */
.pagination {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 16px;
  gap: 12px;
  flex-wrap: wrap;
}

.pagination-info { font-size: 13px; color: #64748b; font-weight: 600; }

.pagination-controls { display: flex; gap: 4px; flex-wrap: wrap; }

.page-btn {
  width: 36px;
  height: 36px;
  border-radius: 9px;
  border: 1.5px solid #e2e8f0;
  background: white;
  font-size: 13px;
  font-weight: 700;
  color: #475569;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.page-btn:hover:not(:disabled):not(.ellipsis) { border-color: #3b82f6; color: #2563eb; background: #eff6ff; }
.page-btn.active  { background: linear-gradient(135deg, #2563eb, #3b82f6); color: white; border-color: transparent; }
.page-btn:disabled { opacity: 0.4; cursor: not-allowed; }
.page-btn.ellipsis { border-color: transparent; background: transparent; cursor: default; }

/* ─── Modals ─── */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,.55);
  backdrop-filter: blur(4px);
  z-index: 200;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.modal {
  background: white;
  border-radius: 20px;
  box-shadow: 0 24px 80px rgba(0,0,0,.25);
  width: 100%;
  max-width: 480px;
  animation: modalIn 0.25s cubic-bezier(0.34,1.56,0.64,1);
  overflow: hidden;
}

@keyframes modalIn { from { opacity:0; transform:scale(.92) translateY(12px); } }

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid #f1f5f9;
}

.modal-header h3  { font-size: 18px; font-weight: 800; color: #0f172a; margin: 0; }
.modal-close      { background: none; border: none; font-size: 18px; cursor: pointer; color: #94a3b8; padding: 4px 8px; border-radius: 8px; }
.modal-close:hover{ background: #f1f5f9; color: #475569; }

.modal-body { padding: 24px; }

.detail-avatar-section { display: flex; align-items: center; gap: 16px; margin-bottom: 24px; }
.detail-avatar         { width: 64px; height: 64px; border-radius: 16px; border: 2px solid #f1f5f9; }
.detail-name           { font-size: 20px; font-weight: 800; color: #0f172a; margin-bottom: 6px; }

.detail-grid  { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.detail-item  { display: flex; flex-direction: column; gap: 4px; }
.detail-label { font-size: 11px; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: .5px; }
.detail-value { font-size: 14px; font-weight: 600; color: #0f172a; }

.form-group { display: flex; flex-direction: column; gap: 8px; margin-bottom: 16px; }
.form-label { font-size: 13px; font-weight: 700; color: #475569; }

.form-input {
  padding: 11px 14px;
  background: #f8fafc;
  border: 1.5px solid #e2e8f0;
  border-radius: 10px;
  font-size: 14px;
  color: #0f172a;
  outline: none;
  transition: all 0.2s;
  font-family: inherit;
  width: 100%;
}

.form-input:focus { border-color: #3b82f6; background: white; box-shadow: 0 0 0 3px rgba(59,130,246,.1); }
.form-error { background: #fee2e2; color: #dc2626; padding: 10px 14px; border-radius: 10px; font-size: 13px; font-weight: 600; }

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  padding: 16px 24px;
  border-top: 1px solid #f1f5f9;
}

.modal-btn {
  padding: 10px 22px;
  border-radius: 10px;
  border: none;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
  font-family: inherit;
}

.modal-btn.primary   { background: linear-gradient(135deg, #2563eb, #3b82f6); color: white; box-shadow: 0 4px 12px rgba(37,99,235,.3); }
.modal-btn.primary:hover:not(:disabled) { transform: translateY(-1px); }
.modal-btn.secondary { background: #f1f5f9; color: #475569; }
.modal-btn.secondary:hover { background: #e2e8f0; }
.modal-btn.danger    { background: linear-gradient(135deg, #ef4444, #dc2626); color: white; }
.modal-btn.danger:hover:not(:disabled) { box-shadow: 0 4px 12px rgba(239,68,68,.4); }
.modal-btn:disabled  { opacity: 0.6; cursor: not-allowed; }

.confirm-modal { max-width: 380px; text-align: center; padding-top: 8px; }
.confirm-icon  { font-size: 56px; margin: 24px 0 8px; display: block; }
.confirm-title { font-size: 22px; font-weight: 900; color: #0f172a; margin: 0 0 12px; }
.confirm-text  { font-size: 14px; color: #64748b; line-height: 1.6; margin: 0 0 8px; }
.confirm-modal .modal-footer { justify-content: center; }

/* ─── Responsive ─── */
@media (max-width: 1200px) {
  .stat-row { grid-template-columns: repeat(3, 1fr); }
}

@media (max-width: 900px) {
  .stat-row           { grid-template-columns: repeat(3, 1fr); }
  .filter-group       { gap: 5px; }
  .filter-chip        { padding: 6px 10px; font-size: 12px; }
}

@media (max-width: 768px) {
  .stat-row           { grid-template-columns: repeat(2, 1fr); gap: 10px; }
  .page-title         { font-size: 22px; }
  .header-icon        { width: 46px; height: 46px; font-size: 22px; }
  .filters-bar        { padding: 12px 16px; gap: 10px; }
  .search-wrapper     { max-width: 100%; width: 100%; }

  .hide-md            { display: none; }

  .detail-grid        { grid-template-columns: 1fr; }
  .btn-text           { display: none; }
  .btn-refresh, .btn-export { padding: 10px 14px; }
}

@media (max-width: 560px) {
  .stat-row           { grid-template-columns: repeat(2, 1fr); gap: 8px; }
  .mini-stat          { padding: 12px; }
  .mini-stat-value    { font-size: 18px; }

  .hide-sm            { display: none; }

  .filters-bar        { flex-direction: column; align-items: stretch; }
  .filter-group       { overflow-x: auto; padding-bottom: 4px; flex-wrap: nowrap; }
  .per-page-select    { margin-left: 0; width: 100%; }

  .pagination         { flex-direction: column; align-items: center; }
  .pagination-controls{ justify-content: center; }

  .bulk-bar           { bottom: 16px; left: 16px; right: 16px; transform: none; flex-wrap: wrap; justify-content: center; }

  .modal              { border-radius: 16px; }
}

@media (max-width: 400px) {
  .stat-row { grid-template-columns: 1fr 1fr; }
  .page-header { flex-direction: column; align-items: flex-start; }
  .header-actions { width: 100%; }
  .btn-refresh, .btn-export { flex: 1; justify-content: center; }
}
</style>