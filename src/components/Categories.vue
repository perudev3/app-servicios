<template>
  <section id="services" class="section categories-section">
    <div class="container">
      <div class="section-header">
        <h2 class="section-title">Categorías Populares</h2>
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

          <p class="category-description">
            {{ category.description }}
          </p>

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
import { ref, onMounted } from "vue"
import api from "@/services/api"

const categories = ref([])

const fetchCategories = async () => {
  try {
    const response = await api.get("/categories")

    categories.value = response.data.map((cat) => ({
      id: cat.id,
      icon: "📂",
      title: cat.name,
      description: cat.description ?? "Servicios disponibles",
      professionals: 0,
      rating: 5,
    }))
  } catch (error) {
    console.error("Error cargando categorías", error)
  }
}

onMounted(() => {
  fetchCategories()
})
</script>

<style scoped>

.container{
  max-width:1200px;
  margin:auto;
  padding:0 20px;
}

.categories-section {
  padding: 100px 0;
  background: #f8fafc;
}

/* HEADER */

.section-header {
  text-align: center;
  max-width: 700px;
  margin: 0 auto 60px;
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
  font-size: 42px;
  font-weight: 900;
  color: #0f172a;
  margin-bottom: 16px;
}

.section-description {
  font-size: 18px;
  color: #64748b;
  line-height: 1.6;
}

/* GRID */

.categories-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 30px;
}

/* CARD */

.category-card {
  background: white;
  border-radius: 24px;
  padding: 32px 26px;
  position: relative;
  overflow: hidden;
  transition: all 0.35s ease;
  border: 2px solid transparent;
  cursor: pointer;
  box-shadow: 0 6px 25px rgba(0,0,0,0.05);
}

.card-shine {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    135deg,
    rgba(255,255,255,0),
    rgba(255,255,255,0.7),
    rgba(255,255,255,0)
  );
  transform: translateX(-100%) rotate(45deg);
  transition: transform 0.6s;
}

.category-card:hover .card-shine {
  transform: translateX(100%) rotate(45deg);
}

.category-card:hover {
  transform: translateY(-10px);
  border-color: #e0e7ff;
  box-shadow: 0 20px 50px rgba(37,99,235,0.15);
}

/* ICON */

.category-icon-wrapper {
  width: 70px;
  height: 70px;
  background: linear-gradient(135deg, #eff6ff, #dbeafe);
  border-radius: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 22px;
  transition: all 0.3s;
}

.category-card:hover .category-icon-wrapper {
  transform: scale(1.08) rotate(4deg);
  background: linear-gradient(135deg,#3b82f6,#2563eb);
}

.category-icon {
  font-size: 34px;
}

.category-card:hover .category-icon {
  filter: brightness(0) invert(1);
}

/* TEXT */

.category-title {
  font-size: 20px;
  font-weight: 800;
  color: #1e293b;
  margin-bottom: 10px;
}

.category-description {
  font-size: 14px;
  color: #64748b;
  line-height: 1.5;
  margin-bottom: 18px;
}

/* META */

.category-meta {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 13px;
  color: #94a3b8;
  font-weight: 600;
  margin-bottom: 22px;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 4px;
}

.meta-divider {
  color: #cbd5e1;
}

/* BUTTON */

.category-cta {
  width: 100%;
  background: linear-gradient(135deg,#f1f5f9,#e2e8f0);
  color: #475569;
  border: none;
  padding: 13px;
  border-radius: 10px;
  font-weight: 700;
  font-size: 14px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  transition: all 0.3s;
}

.category-card:hover .category-cta {
  background: linear-gradient(135deg,#2563eb,#4f46e5);
  color: white;
}

.arrow{
  font-size:18px;
}

/* ========================= */
/* RESPONSIVE */
/* ========================= */

@media (max-width: 1024px) {

  .categories-grid{
    grid-template-columns: repeat(2,1fr);
  }

}

@media (max-width: 768px) {

  .categories-section{
    padding:70px 0;
  }

  .section-title{
    font-size:32px;
  }

  .section-description{
    font-size:16px;
  }

  .categories-grid{
    grid-template-columns:1fr;
    gap:20px;
  }

  .category-card{
    padding:26px 22px;
  }

}

@media (max-width:480px){

  .section-title{
    font-size:26px;
  }

  .category-icon-wrapper{
    width:60px;
    height:60px;
  }

  .category-icon{
    font-size:28px;
  }

}

</style>