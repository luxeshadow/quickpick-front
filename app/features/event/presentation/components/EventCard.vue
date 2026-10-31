<template>
  <article class="event-tile">
    <header>
      <span class="event-symbol">
        <i
          class="fi fi-rr-calendar"
          aria-hidden="true"
        />
      </span>
      <span
        class="event-state"
        :class="event.status"
      >
        <span />
        {{ statusLabel }}
      </span>
    </header>
    <p v-if="event.location" class="event-category"><i class="fi fi-rr-marker" aria-hidden="true" /> {{ event.location }}</p>
    <h3>{{ event.name }}</h3>
    <p class="event-date">{{ dateLabel }}</p>
    <p v-if="event.description" class="event-description">{{ event.description }}</p>
    <div class="event-metrics event-metrics-inline">
      <span>
        <strong>{{ event.mediaCount.toLocaleString('fr') }}</strong>
        médias
      </span>
    </div>
    <footer>
      <NuxtLink
        class="event-upload"
        :to="{ path: '/manager/upload', query: { event: event.id } }"
      >
        <i
          class="fi fi-rr-cloud-upload-alt"
          aria-hidden="true"
        />
        Ajouter des photos
      </NuxtLink>
      <button
        class="event-access"
        type="button"
        :aria-label="'Lien de ' + event.name"
        @click="$emit('link', event)"
      >
        <i
          class="fi fi-rr-link-alt"
          aria-hidden="true"
        />
      </button>
    </footer>
    <div class="event-management">
      <button
        type="button"
        :disabled="statusDisabled"
        :aria-busy="updating"
        @click="$emit('toggle', event)"
      >
        <LoadingSpinner v-if="updating" inline :size="18" label="Mise à jour de l’événement" />
        <i
          v-else
          :class="event.status === 'inactive' ? 'fi fi-rr-play' : 'fi fi-rr-pause'"
          aria-hidden="true"
        />
        {{ updating ? 'Mise à jour…' : event.status === 'inactive' ? 'Réactiver' : 'Désactiver' }}
      </button>
      <button
        class="delete-event"
        type="button"
        @click="$emit('delete', event)"
      >
        <i
          class="fi fi-rr-trash"
          aria-hidden="true"
        />
        Supprimer
      </button>
    </div>
  </article>
</template>
<script setup lang="ts">
import LoadingSpinner from '../../../../core/components/other/LoadingSpinner.vue';
import { computed } from 'vue';
import type { Event as ManagerEvent } from '../../domain/entities/event';
const props = withDefaults(defineProps<{ event: ManagerEvent; updating?: boolean; statusDisabled?: boolean }>(), { updating: false, statusDisabled: false });
defineEmits<{
  toggle: [event: ManagerEvent];
  delete: [event: ManagerEvent];
  link: [event: ManagerEvent];
}>();
const statusLabel = computed(
  () => ({ active: 'Actif', inactive: 'Inactif' })[props.event.status],
);
const dateLabel = computed(() =>
  props.event.eventDate ? new Date(props.event.eventDate).toLocaleDateString('fr', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }) : 'Date non renseignée',
);
</script>
<style scoped>
.event-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  margin: 10px 0 26px;
}
.event-filters {
  display: flex;
  gap: 6px;
}
.event-filters button {
  display: flex;
  align-items: center;
  gap: 8px;
  border: 0;
  background: var(--app-transparent);
  padding: 10px 14px;
  border-radius: 10px;
  color: var(--app-textSecondary);
  font-size: 12px;
  font-weight: 500;
}
.event-filters button.chosen {
  background: var(--app-navy);
  color: var(--app-surface);
}
.event-filters button span {
  font-size: 10px;
  opacity: 0.7;
}
.event-search {
  display: flex;
  align-items: center;
  gap: 10px;
  border: 1px solid var(--app-border);
  background: var(--app-surface);
  border-radius: 12px;
  padding: 0 14px;
  color: var(--app-textSecondary);
}
.event-search input {
  width: 210px;
  max-width: 100%;
  padding: 12px 0;
  border: 0;
  background: var(--app-transparent);
  font-size: 12px;
  outline: none;
  color: var(--app-textPrimary);
}
.event-search:focus-within {
  border-color: var(--app-primary);
  box-shadow: 0 0 0 3px var(--app-primaryAlpha12);
}
.event-collection {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 20px;
}
.event-tile {
  min-width: 0;
  background: var(--app-surface);
  border: 1px solid var(--app-border);
  border-radius: 20px;
  padding: 24px;
  box-shadow: 0 8px 24px var(--app-navyAlpha03);
}
.event-tile[hidden] {
  display: none;
}
.event-tile header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 28px;
}
.event-symbol {
  display: grid;
  place-items: center;
  width: 46px;
  height: 46px;
  border-radius: 14px;
  background: var(--app-infoLight);
  color: var(--app-primary);
  font-size: 21px;
}
.event-state {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: var(--app-success);
  font-size: 11px;
}
.event-state > span {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: currentColor;
}
.event-state.closed {
  color: var(--app-textSecondary);
}
.event-category {
  margin: 0 0 8px;
  font-size: 10px;
  color: var(--app-textSecondary);
  letter-spacing: 1px;
  text-transform: uppercase;
}
.event-tile h3 {
  font-size: 18px;
  line-height: 1.4;
  font-weight: 600;
  letter-spacing: -0.4px;
  margin: 0;
  min-height: 51px;
}
.event-date {
  font-size: 12px;
  color: var(--app-textSecondary);
  margin: 8px 0 24px;
}
.event-metrics {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
  padding: 18px 0;
  border-top: 1px solid var(--app-borderLight);
  border-bottom: 1px solid var(--app-borderLight);
}
.event-metrics > div {
  display: flex;
  align-items: center;
  gap: 10px;
}
.event-metrics i {
  color: var(--app-textMuted);
  font-size: 17px;
}
.event-metrics strong {
  display: block;
  font-size: 18px;
  font-weight: 600;
  letter-spacing: -0.4px;
}
.event-metrics small {
  display: block;
  font-size: 10px;
  color: var(--app-textSecondary);
  margin-top: 3px;
}
.event-tile footer {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 20px;
}
.event-upload {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  min-height: 42px;
  border: 0;
  border-radius: 10px;
  background: var(--app-infoLight);
  color: var(--app-primary);
  font-size: 11px;
  font-weight: 600;
}
.event-upload:hover {
  background: var(--app-blueWash);
}
.event-access {
  width: 42px;
  height: 42px;
  display: grid;
  place-items: center;
  border: 1px solid var(--app-border);
  border-radius: 10px;
  background: var(--app-surface);
  color: var(--app-textPrimary);
  font-size: 20px;
}
.event-thumb {
  background: var(--app-infoLight);
  color: var(--app-primary);
}
.event-filters button:focus-visible,
.event-tile button:focus-visible {
  outline: 2px solid var(--app-primary);
  outline-offset: 3px;
}
#eventEmpty {
  text-align: center;
  padding: 50px 20px;
  color: var(--app-textSecondary);
  font-size: 14px;
}
@media (max-width: 1200px) {
  .event-collection {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
@media (max-width: 640px) {
  .event-toolbar {
    align-items: stretch;
    flex-direction: column;
    gap: 14px;
  }
  .event-search input {
    width: 100%;
    font-size: 16px;
  }
  .event-collection {
    grid-template-columns: 1fr;
    gap: 16px;
  }
  .event-tile {
    padding: 22px;
  }
  .event-tile header {
    margin-bottom: 20px;
  }
  .event-tile h3 {
    min-height: 0;
  }
  .event-filters {
    justify-content: space-between;
  }
  .event-filters button {
    flex: 1;
    justify-content: center;
  }
}

.event-metrics.event-metrics-inline {
  display: flex;
  align-items: baseline;
  flex-wrap: wrap;
  gap: 8px;
  padding: 14px 0;
  border-top: 0;
  border-bottom: 1px solid var(--app-border);
  color: var(--app-textSecondary);
  font-size: 12px;
  line-height: 1.6;
}
.event-metrics-inline > span {
  white-space: nowrap;
}
.event-metrics.event-metrics-inline strong {
  display: inline;
  font-size: inherit;
  font-weight: 600;
  letter-spacing: normal;
  color: var(--app-textPrimary);
}
.event-metrics-inline .metric-separator {
  color: var(--app-textMuted);
}

.event-tile {
  position: relative;
  isolation: isolate;
  overflow: hidden;
}
.event-tile::before {
  content: '';
  position: absolute;
  top: -62px;
  right: -62px;
  width: 160px;
  height: 160px;
  box-sizing: border-box;
  border: 18px solid var(--app-primaryOpacity5_5);
  border-radius: 50%;
  box-shadow: 0 0 0 15px var(--app-primaryOpacity2_5);
  z-index: -1;
  pointer-events: none;
}

.event-upload {
  text-decoration: none;
}
.event-management {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  margin-top: 16px;
  padding-top: 14px;
  border-top: 1px solid var(--app-borderLight);
}
.event-management button {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  border: 0;
  background: none;
  padding: 6px 0;
  color: var(--app-textSecondary);
  font:
    500 11px Inter,
    sans-serif;
  cursor: pointer;
}
.event-management .delete-event {
  color: var(--app-dangerStrong);
}
.event-state.inactive {
  color: var(--app-warning);
}
i {
  display: inline-flex;
  line-height: 1;
}
button:focus-visible,
a:focus-visible {
  outline: 2px solid var(--app-primary);
  outline-offset: 3px;
}
.event-description { color: var(--manager-muted); font-size: 12px; line-height: 1.7; margin: 12px 0; }
.event-management button:disabled { opacity: .5; cursor: default; }
</style>
