<template>
  <section>
    <header class="section-header">
      <div class="section-title">
        <h2>Place aux souvenirs.</h2>
        <p>Choisissez un événement, puis ajoutez ses médias.</p>
      </div>

    </header>
    <div class="import-layout">
      <div class="import-main">
        <div class="import-destination">
          <span class="import-step">01</span>
          <div class="import-picker">
            <label>Événement de destination</label>
            <fieldset :disabled="running || loadingOptions">
              <AppSelect
                v-model="selectedId"
                :options="eventOptions"
                label="Événement de destination"
              />
            </fieldset>
            <p v-if="loadingOptions" role="status">Chargement des événements…</p>
            <p v-else-if="optionsError" role="alert">{{ optionsError }} <button class="btn" @click="loadOptions">Réessayer</button></p>
            <p v-else-if="!events.length">Aucun événement disponible.</p>
          </div>
        </div>
        <div
          class="import-drop"
          :class="{ drag: dragging }"
          @dragover.prevent="dragging = !running"
          @dragleave.prevent="dragging = false"
          @drop.prevent="drop"
        >
          <div class="import-illustration">
            <span>
              <i
                class="fi fi-rr-picture"
                aria-hidden="true"
              />
            </span>
            <span>
              <i
                class="fi fi-rr-cloud-upload-alt"
                aria-hidden="true"
              />
            </span>
          </div>
          <h3>Vos médias commencent ici.</h3>
          <p>
            Glissez vos médias dans cette zone
            <br />
            ou sélectionnez-les sur votre appareil.
          </p>
          <button
            class="btn btn-primary"
            :disabled="running || !selectedEvent || loadingEvent"
            @click="input?.click()"
          >
            <i
              class="fi fi-rr-plus"
              aria-hidden="true"
            />
            Choisir des médias
          </button>
          <input
            ref="input"
            type="file"
            accept="image/jpeg,image/png,image/webp,video/mp4,video/quicktime,video/webm"
            multiple
            hidden
            @change="pick"
          />
          <small>JPG, PNG, WebP · 25 Mo/image — MP4, MOV, WebM · 500 Mo/vidéo</small>
        </div>
        <div class="import-selection">
          <header>
            <div>
              <span class="import-step">02</span>
              <h3>
                Médias sélectionnés
                <span>{{ photos.length }}</span>
              </h3>
            </div>
            <button
              :disabled="running || !photos.length"
              @click="clear"
            >
              Tout retirer
            </button>
          </header>
          <div class="import-grid">
            <div
              v-for="photo in photos"
              :key="photo.id"
              class="import-photo"
            >
              <video v-if="photo.file.type.startsWith('video/')" :src="photo.url" controls preload="metadata" />
              <img
                v-else
                :src="photo.url"
                :alt="photo.file.name"
              />
              <button
                :disabled="running"
                :aria-label="'Retirer ' + photo.file.name"
                @click="remove(photo.id)"
              >
                <i
                  class="fi fi-rr-cross-small"
                  aria-hidden="true"
                />
              </button>
              <p>{{ photo.file.name }}</p>
            </div>
          </div>
          <p
            v-if="!photos.length"
            class="empty"
          >
            Les médias ajoutés apparaîtront ici.
          </p>
        </div>
      </div>
      <aside class="import-summary">
        <span class="import-summary-icon">
          <i
            class="fi fi-rr-calendar"
            aria-hidden="true"
          />
        </span>
        <span class="eyebrow">VOTRE IMPORT</span>
        <h3>{{ eventName || 'Aucun événement disponible' }}</h3>
        <p v-if="loadingEvent" role="status">Chargement de l’événement…</p>
        <p v-else-if="eventError" role="alert">{{ eventError }} <button class="btn" @click="loadSelectedEvent">Réessayer</button></p>
        <template v-else-if="selectedEvent">
          <p v-if="selectedEvent.description">{{ selectedEvent.description }}</p>
          <div class="import-summary-line"><span>Statut</span><strong>{{ selectedEvent.status === 'active' ? 'Actif' : 'Inactif' }}</strong></div>
          <div v-if="selectedEvent.location" class="import-summary-line"><span>Lieu</span><strong>{{ selectedEvent.location }}</strong></div>
          <div v-if="selectedEvent.eventDate" class="import-summary-line"><span>Date</span><strong>{{ new Date(selectedEvent.eventDate).toLocaleDateString('fr') }}</strong></div>
          <div class="import-summary-line"><span>Médias existants</span><strong>{{ selectedEvent.mediaCount }}</strong></div>
        </template>
        <div class="import-summary-line">
          <span>Médias</span>
          <strong>{{ photos.length }}</strong>
        </div>
        <div class="import-summary-line">
          <span>Poids total</span>
          <strong>{{ totalSize }} Mo</strong>
        </div>
        <button
          class="btn btn-primary"
          :disabled="running || !photos.length || !selectedEvent || loadingEvent"
          :aria-busy="running"
          @click="upload"
        >
          <i
            class="fi fi-rr-cloud-upload-alt"
            aria-hidden="true"
          />
          {{ running ? 'Envoi en cours…' : 'Envoyer les médias' }}
        </button>
        <p v-if="running" role="status">Envoi et traitement par le serveur en cours…</p>
        <ul v-if="failedFiles.length" role="alert">
          <li v-for="(file, index) in failedFiles" :key="index">{{ file.filename }} : {{ file.error }}</li>
        </ul>
        <p
          v-if="message"
          class="feedback"
          role="status"
        >
          {{ message }}
        </p>
      </aside>
    </div>
  </section>
</template>
<script setup lang="ts">
import { ref, computed, onMounted, watch, onBeforeUnmount } from 'vue';
import { useRoute } from '#imports';
import AppSelect from '../../../../../../core/components/other/AppSelect.vue';
import { useToast } from '../../../../../../core/shared/useToast';
import { Failure } from '../../../../../../core/error/failure';
import { useAuthStore } from '../../../../../auth/presentation/store/auth_store';
import type { Event as EventEntity } from '../../../../../event/domain/entities/event';
import { GetMyEventsForSelectUseCase } from '../../../../../event/application/usecases/get_my_events_for_select_usecase';
import { GetMyEventsForSelectRepositoryImpl } from '../../../../../event/data/repositories/get_my_events_for_select_repository_impl';
import { ShowEventUseCase } from '../../../../../event/application/usecases/show_event_usecase';
import { ShowEventRepositoryImpl } from '../../../../../event/data/repositories/show_event_repository_impl';
import { DirectMediaUploadUseCase } from '../../../../application/usecases/direct_media_upload_usecase';
import { DirectMediaUploadRepositoryImpl } from '../../../../data/repositories/direct_media_upload_repository_impl';
const uploadMedia = new DirectMediaUploadUseCase(new DirectMediaUploadRepositoryImpl());
const failedFiles = ref<{ filename: string; error: string }[]>([]);
const route = useRoute();
const { showToast } = useToast();
const authStore = useAuthStore();
const getOptions = new GetMyEventsForSelectUseCase(new GetMyEventsForSelectRepositoryImpl());
const showEvent = new ShowEventUseCase(new ShowEventRepositoryImpl());
const events = ref<{ id: number; name: string; status: 'active' | 'inactive' }[]>([]);
const selectedId = ref('');
const selectedEvent = ref<EventEntity | null>(null);
const loadingOptions = ref(false);
const loadingEvent = ref(false);
const optionsError = ref('');
const eventError = ref('');
let detailRequest = 0;
const eventOptions = computed(() => events.value.map(event => ({ value: String(event.id), label: event.name + (event.status === 'inactive' ? ' · Inactif' : '') })));
const eventName = computed(() => selectedEvent.value?.name || events.value.find(event => String(event.id) === selectedId.value)?.name || '');
async function loadOptions() {
  loadingOptions.value = true;
  optionsError.value = '';
  const result = await getOptions.execute({ token: authStore.session?.token ?? '' });
  loadingOptions.value = false;
  if (result instanceof Failure) { optionsError.value = result.message; return; }
  events.value = result;
  const requested = typeof route.query.event === 'string' ? route.query.event : '';
  selectedId.value = requested || (result[0] ? String(result[0].id) : '');
}
async function loadSelectedEvent() {
  const request = ++detailRequest;
  selectedEvent.value = null;
  eventError.value = '';
  loadingEvent.value = false;
  if (!selectedId.value) return;
  loadingEvent.value = true;
  const result = await showEvent.execute({ token: authStore.session?.token ?? '', id: Number(selectedId.value) });
  if (request !== detailRequest) return;
  loadingEvent.value = false;
  if (result instanceof Failure) { eventError.value = result.message; return; }
  selectedEvent.value = result;
}
watch(selectedId, () => { clear(); loadSelectedEvent(); });
watch(() => route.query.event, value => { if (typeof value === 'string' && !running.value) selectedId.value = value; });
onMounted(loadOptions);
const input = ref<HTMLInputElement>();
const photos = ref<{ id: number; file: File; url: string }[]>([]);
let sequence = 0;
const dragging = ref(false);
const running = ref(false);

const message = ref('');

const totalSize = computed(() =>
  (photos.value.reduce((total, p) => total + p.file.size, 0) / 1048576).toLocaleString('fr', {
    maximumFractionDigits: 1,
  }),
);
function add(files: FileList | null) {
  if (running.value || !files || !selectedEvent.value || loadingEvent.value) return;
  let rejected = 0;
  for (const file of Array.from(files)) {
    if (!['image/jpeg', 'image/png', 'image/webp', 'video/mp4', 'video/quicktime', 'video/webm'].includes(file.type)) {
      rejected++;
      continue;
    }
    if (
      photos.value.some(
        (p) =>
          p.file.name === file.name &&
          p.file.size === file.size &&
          p.file.lastModified === file.lastModified,
      )
    )
      continue;
    photos.value.push({ id: ++sequence, file, url: URL.createObjectURL(file) });
  }
  failedFiles.value = [];
  message.value = '';
  if (rejected)
    showToast(
      'Certains fichiers ont été ignorés. Utilisez JPG, PNG, WebP, MP4, MOV ou WebM.',
      'fi-rr-exclamation',
      'error',
    );
}
function pick(e: Event) {
  const target = e.target as HTMLInputElement;
  add(target.files);
  target.value = '';
}
function drop(e: DragEvent) {
  dragging.value = false;
  add(e.dataTransfer?.files || null);
}
function remove(id: number) {
  if (running.value) return;
  const photo = photos.value.find((p) => p.id === id);
  if (photo) URL.revokeObjectURL(photo.url);
  photos.value = photos.value.filter((p) => p.id !== id);
  failedFiles.value = [];
  message.value = '';
}
function clear() {
  photos.value.forEach((p) => URL.revokeObjectURL(p.url));
  photos.value = [];
  failedFiles.value = [];
  message.value = '';
}
async function upload() {
  if (running.value || !photos.value.length || !selectedEvent.value || loadingEvent.value) return;
  running.value = true;
  message.value = '';
  failedFiles.value = [];
  const result = await uploadMedia.execute({
    token: authStore.session?.token ?? '',
    eventId: selectedEvent.value.id,
    files: photos.value.map(photo => photo.file),
  });
  running.value = false;
  if (result instanceof Failure) {
    message.value = result.message;
    showToast(result.message, 'fi-rr-exclamation', 'error');
    return;
  }
  selectedEvent.value = result.event;
  clear();
  failedFiles.value = result.failedFiles;
  message.value = result.message;
  if (result.failedFiles.length) {
    message.value += ' Sélectionnez à nouveau uniquement les fichiers en échec.';
    showToast(result.message, 'fi-rr-exclamation', 'error');
  } else {
    showToast(result.message, 'fi-rr-check', 'success');
  }
}
onBeforeUnmount(() => {
  detailRequest++;

  photos.value.forEach((p) => URL.revokeObjectURL(p.url));
});
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
.upload-preview-tag {
  font-size: 10px;
  padding: 7px 11px;
  border: 1px solid var(--app-border);
  border-radius: 20px;
  color: var(--app-textSecondary);
  background: var(--app-surface);
}
.import-layout {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 300px;
  gap: 26px;
  align-items: start;
}
.import-main {
  min-width: 0;
}
.import-destination {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;
  background: var(--app-surface);
  border: 1px solid var(--app-border);
  border-radius: 16px;
  margin-bottom: 20px;
}
.import-step {
  display: grid;
  place-items: center;
  width: 30px;
  height: 30px;
  flex-shrink: 0;
  background: var(--app-infoLight);
  color: var(--app-primary);
  border-radius: 50%;
  font-size: 10px;
  font-weight: 600;
}
.import-picker {
  flex: 1;
  min-width: 0;
}
.import-picker label {
  display: block;
  font-size: 11px;
  color: var(--app-textSecondary);
  margin-bottom: 8px;
}
.import-drop {
  position: relative;
  overflow: hidden;
  text-align: center;
  padding: 44px 24px;
  border: 1.5px dashed var(--app-blueMist);
  border-radius: 20px;
  background: radial-gradient(ellipse at 50% 0%, var(--app-infoLight), var(--app-surface) 70%);
  transition:
    background 0.2s,
    border-color 0.2s;
}
.import-drop.drag {
  border-color: var(--app-primary);
  background: var(--app-infoLight);
}
.import-illustration {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 74px;
  margin-bottom: 20px;
}
.import-illustration span {
  display: grid;
  place-items: center;
  width: 58px;
  height: 64px;
  background: var(--app-surface);
  border: 1px solid var(--app-borderBlueSoft);
  border-radius: 13px;
  color: var(--app-primaryLight);
  font-size: 25px;
  transform: rotate(-12deg);
}
.import-illustration span + span {
  margin-left: -12px;
  transform: rotate(10deg);
  background: var(--app-primary);
  color: var(--app-surface);
  border-color: var(--app-primary);
  box-shadow: 0 8px 20px var(--app-primaryAlpha20);
}
.import-drop h3 {
  font-size: 21px;
  font-weight: 600;
  letter-spacing: -0.6px;
  margin: 0 0 10px;
}
.import-drop p {
  font-size: 12px;
  color: var(--app-textSecondary);
  line-height: 1.8;
  margin: 0 0 24px;
}
.import-drop small {
  display: block;
  color: var(--app-textMuted);
  font-size: 10px;
  margin-top: 17px;
}
.import-selection {
  margin-top: 26px;
}
.import-selection > header,
.import-selection > header > div {
  display: flex;
  align-items: center;
  gap: 10px;
}
.import-selection > header {
  justify-content: space-between;
  margin-bottom: 18px;
}
.import-selection h3 {
  font-size: 13px;
  font-weight: 600;
  margin: 0;
}
.import-selection h3 span {
  color: var(--app-textSecondary);
  margin-left: 6px;
}
.import-selection header button {
  border: 0;
  background: none;
  font-size: 11px;
  color: var(--app-textSecondary);
}
.import-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 12px;
}
.import-photo {
  position: relative;
  min-width: 0;
}
.import-photo img,
.import-photo video {
  width: 100%;
  aspect-ratio: 1;
  object-fit: cover;
  border-radius: 12px;
  background: var(--app-border);
}
.import-photo button {
  position: absolute;
  right: 6px;
  top: 6px;
  display: grid;
  place-items: center;
  width: 28px;
  height: 28px;
  background: var(--app-navyAlphaCC);
  color: var(--app-surface);
  border: 0;
  border-radius: 50%;
}
.import-photo p {
  font-size: 10px;
  color: var(--app-textSecondary);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-top: 6px;
}
#importEmpty {
  padding: 30px;
  text-align: center;
  color: var(--app-textMuted);
  font-size: 12px;
  border: 1px solid var(--app-border);
  border-radius: 14px;
}
.import-summary {
  padding: 26px;
  border: 1px solid var(--app-border);
  border-radius: 20px;
  background: var(--app-surface);
}
.import-summary-icon {
  display: grid;
  place-items: center;
  width: 44px;
  height: 44px;
  background: var(--app-infoLight);
  color: var(--app-primary);
  border-radius: 13px;
  margin-bottom: 22px;
  font-size: 20px;
}
.import-summary h3 {
  font-size: 18px;
  line-height: 1.5;
  font-weight: 600;
  margin: 8px 0;
}
.import-summary > p {
  font-size: 12px;
  color: var(--app-textSecondary);
  line-height: 1.7;
}
.import-summary-line {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  padding: 16px 0;
  border-bottom: 1px solid var(--app-borderLight);
  color: var(--app-textSecondary);
}
.import-summary-line strong {
  color: var(--app-textPrimary);
}
.import-summary > .btn {
  width: 100%;
  margin-top: 24px;
}
.import-local-note {
  display: flex;
  gap: 8px;
  margin-top: 15px;
  font-size: 10px !important;
}
.import-local-note i {
  margin-top: 4px;
}
#page-upload button:disabled {
  opacity: 0.45;
  cursor: default;
  transform: none;
}
.import-photo button:focus-visible {
  outline: 2px solid var(--app-primary);
  outline-offset: 2px;
}
#importFeedback {
  color: var(--app-primary);
  font-size: 12px;
}
@media (max-width: 1100px) {
  .import-layout {
    grid-template-columns: minmax(0, 1fr) 260px;
    gap: 18px;
  }
}
@media (max-width: 850px) {
  .import-layout {
    grid-template-columns: 1fr;
  }
  .import-summary {
    padding: 22px;
  }
  .import-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
  .import-drop {
    padding: 32px 18px;
  }
  .import-selection h3 {
    font-size: 12px;
  }
}
.import-progress {
  margin-top: 22px;
}
.import-progress[hidden] {
  display: none;
}
.import-progress-heading {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
  margin-bottom: 10px;
  font-size: 11px;
  color: var(--app-textSecondary);
}
.import-progress-heading strong {
  color: var(--app-primary);
  font-size: 13px;
  font-variant-numeric: tabular-nums;
}
.import-progress-track {
  height: 7px;
  background: var(--app-borderLight);
  border-radius: 10px;
  overflow: hidden;
}
.import-progress-track > div {
  height: 100%;
  width: 0;
  background: var(--app-primary);
  border-radius: 10px;
  transition: width 0.1s linear;
}
@media (prefers-reduced-motion: reduce) {
  .import-progress-track > div {
    transition: none;
  }
}
fieldset {
  padding: 0;
  margin: 0;
  border: 0;
  min-width: 0;
}
fieldset:disabled {
  opacity: 0.6;
  pointer-events: none;
}
.eyebrow {
  font-size: 9px;
  letter-spacing: 1.5px;
  color: var(--app-textSecondary);
}
.feedback {
  color: var(--app-primary);
  font-size: 12px;
}
</style>
