<template>
  <section id="professionals" class="section professionals-section">
    <div class="container">
      <div class="section-header">
        <div class="section-badge">Profesionales Destacados</div>
        <h2 class="section-title">Conoce a Nuestros Expertos</h2>
        <p class="section-description">
          Profesionales verificados con años de experiencia y calificaciones
          excepcionales
        </p>
      </div>

      <div class="professionals-grid">
        <div v-for="pro in professionals" :key="pro.id" class="pro-card">
          <div class="pro-badge" v-if="pro.featured">
            <span class="badge-star">⭐</span>
            Top Rated
          </div>

          <div class="pro-avatar-wrapper">
            <div class="pro-status"></div>
            <img :src="pro.avatar" :alt="pro.name" class="pro-avatar" />
          </div>

          <h3 class="pro-name">{{ pro.name }}</h3>
          <p class="pro-role">{{ pro.role }}</p>

          <div class="pro-rating">
            <span class="stars">★★★★★</span>
            <span class="rating-text"
              >{{ pro.rating }} ({{ pro.reviews }} reviews)</span
            >
          </div>

          <div class="pro-stats">
            <div class="stat">
              <div class="stat-value">{{ pro.completedJobs }}</div>
              <div class="stat-label">Trabajos</div>
            </div>
            <div class="stat-divider"></div>
            <div class="stat">
              <div class="stat-value">{{ pro.responseTime }}</div>
              <div class="stat-label">Respuesta</div>
            </div>
          </div>

          <div class="pro-skills">
            <span
              v-for="skill in pro.skills.slice(0, 3)"
              :key="skill"
              class="skill-tag"
            >
              {{ skill }}
            </span>
          </div>

          <button class="pro-cta">
            <span>Ver Perfil</span>
            <span class="cta-arrow">→</span>
          </button>
        </div>
      </div>

      <div class="view-all-wrapper">
        <button class="view-all-btn">
          Ver Todos los Profesionales
          <span class="btn-icon">→</span>
        </button>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue';

const professionals = ref([
  {
    id: 1,
    name: 'Carlos Mendoza',
    role: 'Plomero Certificado',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Carlos',
    rating: 5.0,
    reviews: 234,
    completedJobs: '500+',
    responseTime: '< 1h',
    skills: ['Plomería', 'Gas', 'Calefacción'],
    featured: true,
  },
  {
    id: 2,
    name: 'Ana Rodríguez',
    role: 'Diseñadora UX/UI',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ana',
    rating: 4.9,
    reviews: 189,
    completedJobs: '320+',
    responseTime: '< 2h',
    skills: ['Figma', 'UI Design', 'Branding'],
    featured: true,
  },
  {
    id: 3,
    name: 'Miguel Torres',
    role: 'Electricista Profesional',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Miguel',
    rating: 4.8,
    reviews: 312,
    completedJobs: '650+',
    responseTime: '< 30m',
    skills: ['Instalaciones', 'Reparaciones', 'Domótica'],
    featured: false,
  },
  {
    id: 4,
    name: 'Laura García',
    role: 'Desarrolladora Full Stack',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Laura',
    rating: 5.0,
    reviews: 156,
    completedJobs: '280+',
    responseTime: '< 1h',
    skills: ['React', 'Node.js', 'MongoDB'],
    featured: true,
  },
  {
    id: 5,
    name: 'Roberto Silva',
    role: 'Carpintero Experto',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Roberto',
    rating: 4.9,
    reviews: 267,
    completedJobs: '420+',
    responseTime: '< 2h',
    skills: ['Muebles', 'Restauración', 'Diseño'],
    featured: false,
  },
  {
    id: 6,
    name: 'Patricia Luna',
    role: 'Consultora de Marketing',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Patricia',
    rating: 5.0,
    reviews: 198,
    completedJobs: '340+',
    responseTime: '< 1h',
    skills: ['SEO', 'Social Media', 'Strategy'],
    featured: false,
  },
  {
    id: 7,
    name: 'David Ramírez',
    role: 'Fotógrafo Profesional',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=David',
    rating: 4.9,
    reviews: 223,
    completedJobs: '380+',
    responseTime: '< 2h',
    skills: ['Eventos', 'Retratos', 'Edición'],
    featured: false,
  },
  {
    id: 8,
    name: 'Carmen Vega',
    role: 'Profesora de Inglés',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Carmen',
    rating: 5.0,
    reviews: 301,
    completedJobs: '520+',
    responseTime: '< 1h',
    skills: ['TOEFL', 'Business', 'Conversación'],
    featured: true,
  },
]);
</script>

<style scoped>
.professionals-section {
  padding: 120px 0;
  background: white;
}

.section-header {
  text-align: center;
  max-width: 700px;
  margin: 0 auto 80px;
}

.section-badge {
  display: inline-block;
  background: linear-gradient(135deg, #fef3c7, #fde68a);
  color: #d97706;
  padding: 8px 20px;
  border-radius: 50px;
  font-size: 14px;
  font-weight: 700;
  margin-bottom: 20px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.section-title {
  font-size: 48px;
  font-weight: 900;
  color: #0f172a;
  margin-bottom: 20px;
  letter-spacing: -1px;
}

.section-description {
  font-size: 18px;
  color: #64748b;
  line-height: 1.6;
}

.professionals-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 32px;
  margin-bottom: 60px;
}

.pro-card {
  background: white;
  border: 2px solid #f1f5f9;
  border-radius: 24px;
  padding: 32px 24px;
  text-align: center;
  position: relative;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
}

.pro-card:hover {
  transform: translateY(-12px);
  border-color: #dbeafe;
  box-shadow: 0 30px 60px rgba(37, 99, 235, 0.12);
}

.pro-badge {
  position: absolute;
  top: 16px;
  right: 16px;
  background: linear-gradient(135deg, #fbbf24, #f59e0b);
  color: white;
  padding: 6px 14px;
  border-radius: 50px;
  font-size: 12px;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 4px;
  box-shadow: 0 4px 12px rgba(251, 191, 36, 0.4);
}

.badge-star {
  font-size: 14px;
}

.pro-avatar-wrapper {
  position: relative;
  width: 110px;
  height: 110px;
  margin: 0 auto 20px;
}

.pro-status {
  position: absolute;
  bottom: 4px;
  right: 4px;
  width: 20px;
  height: 20px;
  background: #22c55e;
  border: 3px solid white;
  border-radius: 50%;
  z-index: 2;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.pro-avatar {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  border: 4px solid #f1f5f9;
  object-fit: cover;
  transition: all 0.3s;
}

.pro-card:hover .pro-avatar {
  border-color: #3b82f6;
  transform: scale(1.05);
}

.pro-name {
  font-size: 20px;
  font-weight: 800;
  color: #1e293b;
  margin-bottom: 6px;
}

.pro-role {
  font-size: 15px;
  color: #64748b;
  font-weight: 500;
  margin-bottom: 16px;
}

.pro-rating {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-bottom: 20px;
}

.stars {
  color: #fbbf24;
  font-size: 16px;
  letter-spacing: 2px;
}

.rating-text {
  font-size: 14px;
  color: #475569;
  font-weight: 600;
}

.pro-stats {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 24px;
  padding: 20px;
  background: #f8fafc;
  border-radius: 16px;
  margin-bottom: 20px;
}

.stat {
  text-align: center;
}

.stat-value {
  font-size: 20px;
  font-weight: 800;
  color: #2563eb;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 12px;
  color: #64748b;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.stat-divider {
  width: 1px;
  height: 40px;
  background: #e2e8f0;
}

.pro-skills {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  justify-content: center;
  margin-bottom: 24px;
}

.skill-tag {
  background: linear-gradient(135deg, #eff6ff, #dbeafe);
  color: #2563eb;
  padding: 6px 14px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 700;
}

.pro-cta {
  width: 100%;
  background: linear-gradient(135deg, #2563eb, #4f46e5);
  color: white;
  border: none;
  padding: 14px 24px;
  border-radius: 12px;
  font-weight: 700;
  font-size: 15px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.3s;
  box-shadow: 0 4px 20px rgba(37, 99, 235, 0.3);
}

.pro-cta:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 30px rgba(37, 99, 235, 0.4);
}

.cta-arrow {
  transition: transform 0.3s;
  font-size: 18px;
}

.pro-cta:hover .cta-arrow {
  transform: translateX(4px);
}

.view-all-wrapper {
  text-align: center;
  margin-top: 60px;
}

.view-all-btn {
  background: white;
  color: #2563eb;
  border: 2px solid #2563eb;
  padding: 16px 40px;
  border-radius: 14px;
  font-weight: 700;
  font-size: 16px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  transition: all 0.3s;
}

.view-all-btn:hover {
  background: #2563eb;
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 8px 30px rgba(37, 99, 235, 0.3);
}

.btn-icon {
  transition: transform 0.3s;
  font-size: 18px;
}

.view-all-btn:hover .btn-icon {
  transform: translateX(4px);
}

@media (max-width: 768px) {
  .section-title {
    font-size: 36px;
  }

  .professionals-grid {
    grid-template-columns: 1fr;
  }
}
</style>
