<template>
  <SubscriptionBanner />
  <div class="tabs">
    <span>Vue d’ensemble</span>
    <NuxtLink to="/manager/events">Mes événements</NuxtLink>
    <NuxtLink to="/manager/upload">Importer des photos</NuxtLink>
  </div>
  <div class="heading">
    <div>
      <h2>Chaque moment compte.</h2>
      <p>Bienvenue. Votre activité, en un coup d’œil.</p>
    </div>
    <AppSelect v-model="year" :options="years" label="Année des statistiques" />
  </div>
  <LoadingSpinner v-if="loading" label="Chargement des statistiques" />
  <div v-else-if="error" role="alert">
    <p>{{ error }}</p>
    <button type="button" @click="loadStats">Réessayer</button>
  </div>
  <div v-if="data" class="stats">
    <article
      v-for="stat in stats"
      :key="stat.label"
    >
      <i
        :class="'fi fi-rr-' + stat.icon"
        aria-hidden="true"
      />
      <strong>{{ stat.value.toLocaleString('fr-FR') }}</strong>
      <span>{{ stat.label }}</span>
    </article>
  </div>
  <div v-if="data" class="dashboard-grid">
    <section class="recent">
      <header>
        <h3>Événements récents</h3>
        <NuxtLink to="/manager/events">Voir tous</NuxtLink>
      </header>
      <div
        v-for="event in events"
        :key="event.id"
        class="event"
      >
        <i
          class="fi fi-rr-calendar"
          aria-hidden="true"
        />
        <div>
          <strong>{{ event.name }}</strong>
          <span>{{ event.event_date ? new Date(event.event_date).toLocaleDateString('fr-FR') : 'Sans date' }} · {{ event.photos_count }} photos · {{ event.videos_count }} vidéos</span>
        </div>
        <small>{{ event.total_media }} médias</small>
      </div>
      <p v-if="!events.length">Aucun événement.</p>
    </section>
    <EventChart :monthly="data.events_by_month" :loading="chartLoading" :error="chartError" @retry="loadChart" />
  </div>
</template>
<script setup lang="ts">
import LoadingSpinner from '../other/LoadingSpinner.vue';
import SubscriptionBanner from '../other/SubscriptionBanner.vue';
import AppSelect from '../other/AppSelect.vue';
import EventChart from '../../../features/event/presentation/components/EventChart.vue';
import { useMyStats } from '../../shared/mystat';

const { data, stats, events, year, years, loading, error, chartLoading, chartError, loadStats, loadChart } = useMyStats();
</script>
<style scoped>
.tabs {
  display: flex;
  gap: 24px;
  border-bottom: 1px solid var(--app-border);
  padding-bottom: 16px;
  font-size: 12px;
}
.tabs span {
  color: var(--app-primary);
  font-weight: 600;
}
.tabs a {
  color: var(--app-textSecondary);
  text-decoration: none;
}
.heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 30px 0 24px;
  gap: 20px;
}
h2 {
  font-size: 30px;
  letter-spacing: -1px;
  margin: 0;
}
p {
  font-size: 13px;
  color: var(--app-textSecondary);
}
.heading small {
  font-size: 10px;
  color: var(--app-textMuted);
}
.stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin-bottom: 24px;
}
.stats article {
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: flex-start;
  flex-direction: column;
  padding: 24px;
  border: 1px solid var(--app-border);
  border-radius: 20px;
  background: var(--app-surface);
}
.stats article:after {
  content: '';
  position: absolute;
  right: -25px;
  bottom: -55px;
  width: 140px;
  height: 140px;
  border: 22px solid var(--app-primaryAlpha04);
  border-radius: 50%;
}
.stats i,
.event > i {
  display: grid;
  place-items: center;
  width: 40px;
  height: 40px;
  border-radius: 12px;
  color: var(--app-primary);
  background: var(--app-infoLight);
}
.stats strong {
  font-size: 34px;
  letter-spacing: -1px;
  margin: 20px 0 7px;
}
.stats span {
  font-size: 12px;
  color: var(--app-textSecondary);
}
.dashboard-grid {
  display: grid;
  grid-template-columns: 1fr 1.4fr;
  gap: 24px;
  margin-bottom: 24px;
}
.recent {
  padding: 24px;
  border: 1px solid var(--app-border);
  border-radius: 20px;
  background: var(--app-surface);
}
.recent header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
h3 {
  font-size: 15px;
}
.recent a {
  font-size: 11px;
  color: var(--app-primary);
  text-decoration: none;
}
.event {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 24px 0;
  border-bottom: 1px solid var(--app-borderLight);
}
.event:last-child {
  border: 0;
}
.event > i {
  flex-shrink: 0;
}
.event div {
  flex: 1;
  min-width: 0;
}
.event strong {
  display: block;
  font-size: 12px;
}
.event span {
  display: block;
  color: var(--app-textSecondary);
  font-size: 10px;
  margin-top: 7px;
}
.event small {
  font-size: 10px;
  color: var(--app-success);
}
@media (max-width: 1100px) {
  .dashboard-grid {
    grid-template-columns: 1fr;
  }
}
@media (max-width: 640px) {
  .stats {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 8px;
    margin-bottom: 18px;
  }

  .stats article {
    min-width: 0;
    padding: 12px 9px;
    border-radius: 13px;
  }

  .stats i {
    width: 28px;
    height: 28px;
    border-radius: 8px;
    font-size: 13px;
  }

  .stats strong {
    margin: 10px 0 4px;
    font-size: 22px;
    line-height: 1.1;
    letter-spacing: -0.5px;
    white-space: nowrap;
  }

  .stats span {
    font-size: 10px;
    line-height: 1.4;
  }

  .stats article::after {
    display: none;
  }
  .heading {
    align-items: flex-start;
    flex-direction: column;
  }
  h2 {
    font-size: 25px;
  }
  .tabs {
    gap: 16px;
    font-size: 10px;
  }
}
</style>
