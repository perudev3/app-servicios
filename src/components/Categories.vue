<template>
  <section id="services" class="section categories-section">
    <div class="container">
      <div class="section-header">
        <div class="section-badge">Nuestros Servicios</div>
        <h2 class="section-title">Explora Categorías Populares</h2>
        <p class="section-description">
          Encuentra exactamente lo que necesitas entre cientos de servicios
          profesionales
        </p>
      </div>

      <div class="categories-grid">
        <div
          v-for="category in categories"
          :key="category.id"
          class="category-card"
        >
          <div class="card-shine"></div>
          <div class="category-icon-wrapper">
            <span class="category-icon">{{ category.icon }}</span>
          </div>
          <h3 class="category-title">{{ category.title }}</h3>
          <p class="category-description">{{ category.description }}</p>
          <div class="category-meta">
            <span class="meta-item">
              <span class="meta-icon">👥</span>
              {{ category.professionals }}+ pros
            </span>
            <span class="meta-divider">•</span>
            <span class="meta-item">
              <span class="meta-icon">⭐</span>
              {{ category.rating }}
            </span>
          </div>
          <button class="category-cta">
            Ver Servicios
            <span class="arrow">→</span>
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue';

const categories = ref([
  {
    id: 1,
    icon: '🏠',
    title: 'Hogar & Reparaciones',
    description: 'Plomería, electricidad, carpintería y más',
    professionals: 2500,
    rating: 4.9,
  },
  {
    id: 2,
    icon: '💼',
    title: 'Negocios & Consultoría',
    description: 'Marketing, legal, contabilidad y asesoría',
    professionals: 3200,
    rating: 4.8,
  },
  {
    id: 3,
    icon: '🎨',
    title: 'Diseño & Creatividad',
    description: 'Diseño gráfico, web, branding y multimedia',
    professionals: 4100,
    rating: 4.9,
  },
  {
    id: 4,
    icon: '💻',
    title: 'Tecnología & Desarrollo',
    description: 'Apps, web, software y soporte IT',
    professionals: 5800,
    rating: 5.0,
  },
  {
    id: 5,
    icon: '🎓',
    title: 'Educación & Tutorías',
    description: 'Clases particulares, idiomas y formación',
    professionals: 1900,
    rating: 4.7,
  },
  {
    id: 6,
    icon: '🚗',
    title: 'Transporte & Logística',
    description: 'Mudanzas, delivery, mensajería express',
    professionals: 1200,
    rating: 4.8,
  },
  {
    id: 7,
    icon: '✨',
    title: 'Belleza & Bienestar',
    description: 'Spa, peluquería, fitness y salud',
    professionals: 2700,
    rating: 4.9,
  },
  {
    id: 8,
    icon: '🎉',
    title: 'Eventos & Celebraciones',
    description: 'Organización, catering, fotografía',
    professionals: 1500,
    rating: 4.8,
  },
]);
</script>

<style scoped>
.categories-section {
  padding: 120px 0;
  background: #f8fafc;
}

.section-header {
  text-align: center;
  max-width: 700px;
  margin: 0 auto 80px;
}

.section-badge {
  display: inline-block;
  background: linear-gradient(135deg, #dbeafe, #e0e7ff);
  color: #2563eb;
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

.categories-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 30px;
}

.category-card {
  background: white;
  border-radius: 24px;
  padding: 36px 28px;
  position: relative;
  overflow: hidden;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  border: 2px solid transparent;
  cursor: pointer;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04);
}

.card-shine {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0),
    rgba(255, 255, 255, 0.8),
    rgba(255, 255, 255, 0)
  );
  transform: translateX(-100%) rotate(45deg);
  transition: transform 0.6s;
}

.category-card:hover .card-shine {
  transform: translateX(100%) rotate(45deg);
}

.category-card:hover {
  transform: translateY(-12px);
  border-color: #e0e7ff;
  box-shadow: 0 30px 60px rgba(37, 99, 235, 0.15);
}

.category-icon-wrapper {
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #eff6ff, #dbeafe);
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 24px;
  transition: all 0.3s;
}

.category-card:hover .category-icon-wrapper {
  transform: scale(1.1) rotate(5deg);
  background: linear-gradient(135deg, #3b82f6, #2563eb);
}

.category-icon {
  font-size: 42px;
  transition: all 0.3s;
}

.category-card:hover .category-icon {
  filter: brightness(0) invert(1);
}

.category-title {
  font-size: 22px;
  font-weight: 800;
  color: #1e293b;
  margin-bottom: 12px;
}

.category-description {
  font-size: 15px;
  color: #64748b;
  line-height: 1.5;
  margin-bottom: 20px;
}

.category-meta {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 13px;
  color: #94a3b8;
  font-weight: 600;
  margin-bottom: 24px;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 4px;
}

.meta-icon {
  font-size: 14px;
}

.meta-divider {
  color: #cbd5e1;
}

.category-cta {
  width: 100%;
  background: linear-gradient(135deg, #f1f5f9, #e2e8f0);
  color: #475569;
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
}

.category-card:hover .category-cta {
  background: linear-gradient(135deg, #2563eb, #4f46e5);
  color: white;
  transform: translateY(-2px);
}

.arrow {
  transition: transform 0.3s;
  font-size: 18px;
}

.category-card:hover .arrow {
  transform: translateX(4px);
}

@media (max-width: 768px) {
  .section-title {
    font-size: 36px;
  }

  .categories-grid {
    grid-template-columns: 1fr;
  }
}
</style>
