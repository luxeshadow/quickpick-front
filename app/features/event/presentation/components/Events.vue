<template>
  <section>
    <header class="section-header">
      <div class="section-title">
        <h2>Vos événements.</h2>
        <p>Chaque événement, ses photos et ses souvenirs.</p>
      </div>
      <button
        class="btn btn-primary"
        @click="openCreate"
      >
        <i
          class="fi fi-rr-plus"
          aria-hidden="true"
        />
        Créer un événement
      </button>
    </header>
    <div class="event-toolbar">
      <div
        class="event-filters"
        role="group"
        aria-label="Statut des événements"
      >
        <button
          v-for="option in filters"
          :key="option.value"
          :class="{ chosen: filter === option.value }"
          :aria-pressed="filter === option.value"
          @click="selectFilter(option.value)"
        >
          {{ option.label }}
          <span v-if="filter === option.value && !loadingEvents && !loadError">{{ total }}</span>
        </button>
      </div>
      <label class="event-search">
        <i
          class="fi fi-rr-search"
          aria-hidden="true"
        />
        <input
          v-model="search"
          type="search"
          placeholder="Rechercher un événement"
          @input="searchMyEvents"
          aria-label="Rechercher un événement"
        />
      </label>
    </div>
    <p v-if="loadingEvents" role="status" class="empty">Chargement des événements…</p>
    <div v-else-if="loadError" class="empty" role="alert"><p>{{ loadError }}</p><button class="btn" @click="loadEvents(page)">Réessayer</button></div>
    <div v-else class="event-collection">
      <EventCard
        v-for="event in events"
        :key="event.id"
        :event="event"
        :updating="updatingEventId === event.id"
        :status-disabled="updatingEventId !== null"
        @toggle="toggle"
        @delete="removing = $event"
        @link="showLink"
      />
    </div>
    <p
      v-if="!loadingEvents && !loadError && !events.length"
      class="empty"
    >
      Aucun événement ne correspond à votre recherche.
    </p>
    <nav v-if="lastPage > 1 && !loadError" class="event-pagination" aria-label="Pagination des événements">
      <button class="btn" :disabled="loadingEvents || page <= 1" @click="loadEvents(page - 1)">Précédent</button>
      <span>Page {{ page }} / {{ lastPage }}</span>
      <button class="btn" :disabled="loadingEvents || page >= lastPage" @click="loadEvents(page + 1)">Suivant</button>
    </nav>
    <ManagerDialog
      :open="creating"
      title="Créer un événement"
      @close="!submitting && (creating = false)"
    >
      <form @submit.prevent="create" novalidate :aria-busy="submitting">
        <Input v-model="name" class="field" label="Nom de l’événement" placeholder="Ex. Mariage Alice & Thomas" :disabled="submitting" />
        <Input v-model="description" class="field" label="Description (facultatif)" placeholder="Décrivez votre événement" :disabled="submitting" />
        <Input v-model="location" class="field" label="Lieu (facultatif)" placeholder="Lieu de l’événement" :disabled="submitting" />
        <DateInput v-model="date" class="field" label="Date (facultatif)" :disabled="submitting" />
        <div class="dialog-actions">
          <Button class="create-cancel" label="Annuler" type="button" :disabled="submitting" :on-click="() => creating = false" />
          <Button class="create-submit" :label="submitting ? 'Création…' : 'Créer'" type="submit" :disabled="submitting" />
        </div>
      </form>
    </ManagerDialog>
    <ManagerDialog
      :open="!!removing"
      title="Supprimer cet événement ?"
      @close="removing = null"
    >
      <p class="dialog-text">La suppression de « {{ removing?.name }} » sera disponible après le branchement de son API.</p>
      <div class="dialog-actions">
        <button
          class="btn"
          @click="removing = null"
        >
          Annuler
        </button>
        <button
          class="btn danger"
          @click="remove"
        >
          Supprimer
        </button>
      </div>
    </ManagerDialog>
    <AccessLinksDialog :event="linkEvent" @close="linkEvent = null" />
  </section>
</template>
<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { GetMyEventsUseCase } from '../../application/usecases/get_my_events_usecase';
import { GetMyEventsRepositoryImpl } from '../../data/repositories/get_my_events_repository_impl';
import { GetMyEventsByStatusUseCase } from '../../application/usecases/get_my_events_by_status_usecase';
import { GetMyEventsByStatusRepositoryImpl } from '../../data/repositories/get_my_events_by_status_repository_impl';
import { SearchMyEventsUseCase } from '../../application/usecases/search_my_events_usecase';
import { SearchMyEventsRepositoryImpl } from '../../data/repositories/search_my_events_repository_impl';
import EventCard from './EventCard.vue';
import AccessLinksDialog from '../../../accesslink/presentation/components/AccessLinksDialog.vue';
import ManagerDialog from '../../../../core/components/other/ManagerDialog.vue';
import DateInput from '../../../../core/components/other/DateInput.vue';
import Input from '../../../../core/components/other/Input.vue';
import Button from '../../../../core/components/other/Button.vue';
import { UpdateEventStatusUseCase } from '../../application/usecases/update_event_status_usecase';
import { UpdateEventStatusRepositoryImpl } from '../../data/repositories/update_event_status_repository_impl';
import { Failure } from '../../../../core/error/failure';
import { useAuthStore } from '../../../auth/presentation/store/auth_store';
import { CreateEventUseCase } from '../../application/usecases/create_event_usecase';
import { CreateEventRepositoryImpl } from '../../data/repositories/create_event_repository_impl';
import { useToast } from '../../../../core/shared/useToast';
import type { Event as ManagerEvent } from '../../domain/entities/event';

const events = ref<ManagerEvent[]>([]);
const { showToast } = useToast();
const search = ref('');
const filter = ref<'all' | 'active' | 'inactive'>('all');
const creating = ref(false);
const removing = ref<ManagerEvent | null>(null);
const linkEvent = ref<ManagerEvent | null>(null);
const name = ref('');
const description = ref('');
const location = ref('');
const submitting = ref(false);
const authStore = useAuthStore();
const createEvent = new CreateEventUseCase(new CreateEventRepositoryImpl());
const getMyEvents = new GetMyEventsUseCase(new GetMyEventsRepositoryImpl());
const getMyEventsByStatus = new GetMyEventsByStatusUseCase(new GetMyEventsByStatusRepositoryImpl());
const searchMyEventsUseCase = new SearchMyEventsUseCase(new SearchMyEventsRepositoryImpl());
const loadingEvents = ref(false);
const loadError = ref('');
const page = ref(1);
const lastPage = ref(1);
const total = ref(0);
let requestId = 0;
let searchTimer: ReturnType<typeof setTimeout> | undefined;
function searchMyEvents() {
  clearTimeout(searchTimer);
  requestId++;
  filter.value = 'all';
  page.value = 1;
  loadingEvents.value = true;
  loadError.value = '';
  searchTimer = setTimeout(() => loadEvents(1), 300);
}
onBeforeUnmount(() => { clearTimeout(searchTimer); requestId++; });
async function loadEvents(requestedPage = 1) {
  clearTimeout(searchTimer);
  const currentRequest = ++requestId;
  loadingEvents.value = true;
  loadError.value = '';
  const params = { token: authStore.session?.token ?? '', page: requestedPage };
  let result;
  if (search.value.trim()) {
    result = await searchMyEventsUseCase.execute({ ...params, search: search.value });
  } else if (filter.value !== 'all') {
    result = await getMyEventsByStatus.execute({ ...params, status: filter.value });
  } else {
    result = await getMyEvents.execute(params);
  }
  if (currentRequest !== requestId) return;
  loadingEvents.value = false;
  if (result instanceof Failure) {
    events.value = [];
    loadError.value = result.message;
    return;
  }
  events.value = result.events;
  page.value = result.currentPage;
  lastPage.value = result.lastPage;
  total.value = result.total;
}
function selectFilter(status: 'all' | 'active' | 'inactive') {
  clearTimeout(searchTimer);
  filter.value = status;
  page.value = 1;
  search.value = '';
  loadEvents();
}
onMounted(() => loadEvents());
const date = ref('');
function openCreate() {
  if (!date.value) {
    const today = new Date();
    date.value = today.getFullYear() + '-' + String(today.getMonth() + 1).padStart(2, '0') + '-' + String(today.getDate()).padStart(2, '0');
  }
  creating.value = true;
}
const filters: { value: 'all' | 'active' | 'inactive'; label: string }[] = [
  { value: 'all', label: 'Tous' },
  { value: 'active', label: 'Actifs' },
  { value: 'inactive', label: 'Inactifs' },
];
const updateEventStatus = new UpdateEventStatusUseCase(new UpdateEventStatusRepositoryImpl());
const updatingEventId = ref<number | null>(null);
async function toggle(event: ManagerEvent) {
  if (updatingEventId.value !== null) return;
  updatingEventId.value = event.id;
  const result = await updateEventStatus.execute({
    token: authStore.session?.token ?? '',
    id: event.id,
    status: event.status === 'active' ? 'inactive' : 'active',
  });
  if (result instanceof Failure) {
    updatingEventId.value = null;
    showToast(result.message, 'fi-rr-exclamation', 'error');
    return;
  }
  showToast(result.status === 'inactive' ? 'Événement désactivé.' : 'Événement réactivé.', 'fi-rr-check', 'success');
  const index = events.value.findIndex(item => item.id === result.id);
  if (index !== -1) {
    if (filter.value !== 'all' && result.status !== filter.value) {
      events.value.splice(index, 1);
      total.value = Math.max(0, total.value - 1);
    } else {
      events.value[index] = result;
    }
  }
  updatingEventId.value = null;
}
function remove() {
  removing.value = null;
  showToast('La suppression n’est pas encore connectée à l’API.', 'fi-rr-info');
}
async function create() {
  if (submitting.value) return;
  submitting.value = true;
  const result = await createEvent.execute({
    token: authStore.session?.token ?? '',
    name: name.value,
    description: description.value,
    location: location.value,
    event_date: date.value,
  });
  submitting.value = false;
  if (result instanceof Failure) {
    showToast(result.message, 'fi-rr-exclamation', 'error');
    return;
  }
  creating.value = false;
  name.value = '';
  description.value = '';
  location.value = '';
  date.value = '';
  showToast('Événement « ' + result.name + ' » créé avec succès.', 'fi-rr-check', 'success');
  await loadEvents(1);
}
function showLink(event: ManagerEvent) { linkEvent.value = event; }
</script>
<style scoped>
.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 28px;
}
.section-title h2 {
  font-size: 30px;
  letter-spacing: -1px;
  margin: 0;
  font-weight: 700;
}
.section-title p {
  font-size: 13px;
  color: var(--manager-muted);
  line-height: 1.6;
  margin: 10px 0 0;
}
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 9px;
  min-height: 44px;
  padding: 11px 16px;
  border: 1px solid var(--manager-border);
  border-radius: 12px;
  background: var(--app-surface);
  color: var(--manager-text);
  font:
    600 12px Inter,
    sans-serif;
  cursor: pointer;
  text-decoration: none;
}
.btn-primary {
  background: var(--manager-primary);
  border-color: var(--manager-primary);
  color: var(--app-surface);
}
button {
  font-family: inherit;
  cursor: pointer;
}
button:disabled {
  cursor: default;
  opacity: 0.45;
}
button:focus-visible,
a:focus-visible {
  outline: 2px solid var(--manager-primary);
  outline-offset: 3px;
}
i {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
}
input {
  font-family: inherit;
}
input:focus {
  outline: 2px solid var(--app-primaryAlpha40);
  outline-offset: 1px;
}
.empty {
  padding: 40px;
  text-align: center;
  color: var(--manager-muted);
  font-size: 13px;
}
@media (max-width: 640px) {
  .section-header {
    align-items: flex-start;
    flex-direction: column;
  }
  .section-title h2 {
    font-size: 25px;
  }
}
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

.event-filters {
  flex-wrap: wrap;
}
.field {
  display: flex;
  flex-direction: column;
  gap: 9px;
  margin-bottom: 18px;
  font-size: 12px;
}
.field input {
  padding: 12px;
  border: 1px solid var(--app-border);
  border-radius: 10px;
  min-width: 0;
}
.dialog-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 24px;
}
.dialog-text {
  font-size: 13px;
  line-height: 1.6;
}
.local-note {
  font-size: 11px;
  line-height: 1.6;
  color: var(--app-textSecondary);
}
.danger {
  background: var(--app-danger);
  color: var(--app-surface);
  border-color: var(--app-danger);
}
.dialog-actions .create-cancel, .dialog-actions .create-submit { width: auto; min-width: 110px; height: 44px; padding: 0 20px; font-size: 13px; box-shadow: none; transform: none; }
.dialog-actions .create-cancel { background: var(--app-surface); color: var(--manager-text); border: 1px solid var(--manager-border); }
.dialog-actions .create-cancel:hover { background: var(--app-surface); box-shadow: none; transform: none; }
.dialog-actions .create-submit:hover { background: var(--manager-primary); box-shadow: none; transform: none; }
.event-pagination { display: flex; justify-content: center; align-items: center; gap: 12px; margin: 24px 0; font-size: 12px; }
</style>
