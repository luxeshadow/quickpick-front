<template>
  <section class="chart-card">
    <header><div><small>VOTRE ACTIVITÉ · {{ monthly.year }}</small><h3>Événements par mois</h3></div></header>
    <div class="chart-area" :aria-busy="loading">
      <canvas ref="canvas" role="img" :aria-label="description" />
      <div v-if="loading" class="chart-overlay">
        <LoadingSpinner label="Chargement du graphique" />
      </div>
      <div v-else-if="error" class="chart-overlay" role="alert">
        <span>{{ error }}</span>
        <button type="button" @click="emit('retry')">Réessayer</button>
      </div>
    </div>
  </section>
</template>
<script setup lang="ts">
import LoadingSpinner from '../../../../core/components/other/LoadingSpinner.vue';
import Chart from 'chart.js/auto';
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { AppColors } from '../../../../core/constants/app_colors';
import type { MyStats } from '../../../user/domain/entities/my_stats';

const props = defineProps<{ monthly: MyStats['events_by_month']; loading?: boolean; error?: string }>();
const emit = defineEmits<{ retry: [] }>();
const canvas = ref<HTMLCanvasElement>();
let chart: Chart | undefined;

const description = computed(() => {
  return 'Événements par mois en ' + props.monthly.year + ' : ' + props.monthly.total;
});

onMounted(() => {
  if (!canvas.value) return;

  chart = new Chart(canvas.value, {
    type: 'bar',
    data: {
      labels: props.monthly.labels,
      datasets: props.monthly.datasets.map(dataset => ({
        label: dataset.label,
        data: [...dataset.data],
        backgroundColor: AppColors.primary,
        borderRadius: 5,
        maxBarThickness: 30,
      })),
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? false : { duration: 400 },
      font: { family: 'Inter, sans-serif' },
      plugins: { legend: { display: false } },
      scales: {
        x: { grid: { display: false } },
        y: { beginAtZero: true, ticks: { precision: 0 } },
      },
    },
  });
});

watch(() => props.monthly, monthly => {
  if (!chart) return;

  chart.data.labels = monthly.labels;
  chart.data.datasets = monthly.datasets.map(dataset => ({
    label: dataset.label,
    data: [...dataset.data],
    backgroundColor: AppColors.primary,
    borderRadius: 5,
    maxBarThickness: 30,
  }));
  chart.update();
});

onBeforeUnmount(() => {
  chart?.destroy();
});
</script>
<style scoped>
.chart-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  background: var(--app-surface);
  font-size: 13px;
  text-align: center;
}

.chart-card {
  padding: 24px;
  background: var(--app-surface);
  border: 1px solid var(--app-border);
  border-radius: 20px;
  min-width: 0;
}
header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 15px;
  margin-bottom: 25px;
}
small {
  font-size: 9px;
  letter-spacing: 1.5px;
  color: var(--app-textSecondary);
}
h3 {
  font-size: 16px;
  margin: 7px 0 0;
  font-weight: 600;
}
.chart-area {
  position: relative;
  height: 250px;
}
.chart-area p {
  position: absolute;
  inset: 30%;
  font-size: 12px;
  color: var(--app-textSecondary);
}
@media (max-width: 640px) {
  .chart-card {
    padding: 18px;
  }
  h3 {
    font-size: 14px;
  }
}
</style>
