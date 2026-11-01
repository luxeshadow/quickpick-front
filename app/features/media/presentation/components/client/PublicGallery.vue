<template>
  <section class="public-gallery">
    <header class="gallery-appbar">
      <button class="icon-button" type="button" :aria-label="selecting ? 'Tout désélectionner' : 'Quitter la galerie'" @click="back">
        <i v-if="selecting" class="fi fi-rr-cross-small" aria-hidden="true"></i>
        <i v-else class="fi fi-rr-arrow-small-left" aria-hidden="true"></i>
      </button>
      <div class="appbar-title" aria-live="polite"><h1>{{ selecting ? `${selected.length} sélectionné(s)` : 'Galerie publique' }}</h1><span v-if="!selecting">Vos souvenirs, au même endroit.</span></div>
      <button v-if="selecting" class="icon-button download-button" type="button" aria-label="Télécharger la sélection" :disabled="!selected.length || downloading" :aria-busy="downloading" @click="downloadMedia(selected)">
        <LoadingSpinner v-if="downloading" inline :size="20" label="Téléchargement en cours" class="download-loading" /><i v-else class="fi fi-rr-download" aria-hidden="true"></i>
      </button>
      <button v-else class="select-button" type="button" :disabled="loading || !visibleItems.length" @click="selecting = true">Sélectionner</button>
    </header>

    <div class="gallery-content">
      <div class="gallery-intro" :style="{ backgroundColor: colors.navy }">
        <div><span class="collection-label"><i class="fi fi-rr-camera" aria-hidden="true"></i> QUICKPICK · LA GALERIE</span><h2>Vos moments, à emporter.</h2><p>Parcourez, sélectionnez et gardez vos photos préférées.</p></div>
        <div class="collection-count"><strong>{{ items.length }}</strong><span>souvenirs à découvrir</span></div>
      </div>
      <div class="gallery-tabs" role="group" aria-label="Type de média">
        <button type="button" :class="{ active: tab === 'photo' }" :aria-pressed="tab === 'photo'" @click="switchTab('photo')"><i class="fi fi-rr-picture" aria-hidden="true"></i> Photos <span>{{ photoCount }}</span></button>
        <button type="button" :class="{ active: tab === 'video' }" :aria-pressed="tab === 'video'" @click="switchTab('video')"><i class="fi fi-rr-play-alt" aria-hidden="true"></i> Vidéos <span>{{ videoCount }}</span></button>
      </div>
      <p class="gallery-hint">{{ selecting ? 'Touchez les éléments à sélectionner ou désélectionner.' : 'Appui long sur une photo pour en sélectionner plusieurs.' }}</p>
      <div v-if="loading" class="media-grid" aria-busy="true" aria-label="Chargement de la galerie">
        <SkeletonMedia v-for="n in 18" :key="n" />
      </div>
      <div v-else-if="visibleItems.length" class="media-grid">
        <button v-for="(item, index) in visibleItems" :key="item.id" class="media-tile" :class="{ selected: selected.includes(item.id) }"
          type="button" :aria-label="`${selecting ? 'Sélectionner : ' : 'Ouvrir : '}${item.title}`" :aria-pressed="selecting ? selected.includes(item.id) : undefined"
          @click="activate(item, index)" @pointerdown="beginPress($event, item.id)" @pointermove="movePress" @pointerup="cancelPress" @pointercancel="cancelPress" @pointerleave="cancelPress"
          @contextmenu.prevent="selectItem(item.id)" @keydown.space.prevent="toggleSelection(item.id)">
          <SkeletonMedia v-if="(item.type === 'photo' || item.thumbnail) && !loaded[item.id] && !failed[item.id]" class="tile-placeholder" />
          <img v-if="item.type === 'photo' || item.thumbnail" :src="item.thumbnail || item.src" :alt="item.title" draggable="false" loading="lazy" decoding="async"
            :class="{ ready: loaded[item.id] }" @load="loaded[item.id] = true" @error="failed[item.id] = true" />
          <span v-if="item.type === 'video'" class="video-badge" aria-hidden="true"><i class="fi fi-rr-play" /></span>
          <span v-if="failed[item.id]" class="tile-error">Image indisponible</span>
          <span v-if="selecting" class="selection-check" aria-hidden="true"><i v-if="selected.includes(item.id)" class="fi fi-rr-check" aria-hidden="true"></i></span>
        </button>
      </div>
      <div v-else class="empty-gallery"><i :class="tab === 'video' ? 'fi fi-rr-play-alt' : 'fi fi-rr-picture'" aria-hidden="true"></i><h2>{{ tab === 'video' ? 'Aucune vidéo pour le moment' : 'Aucune photo pour le moment' }}</h2></div>
    </div>

    <dialog ref="viewer" class="media-viewer" aria-label="Visionneuse de la galerie" @cancel.prevent="closeViewer" @close="finishViewer" @keydown="viewerKeydown">
      <template v-if="activeItem">
        <header class="viewer-appbar">
          <button type="button" class="icon-button" aria-label="Retour à la grille" @click="closeViewer"><i  class="fi fi-rr-arrow-small-left" aria-hidden="true"></i></button>
          <span aria-live="polite">{{ (activeIndex ?? 0) + 1 }} / {{ visibleItems.length }}</span>
          <button class="icon-button" type="button" aria-label="Télécharger ce média" :disabled="downloading" :aria-busy="downloading" @click="downloadMedia([activeItem.id])"><LoadingSpinner v-if="downloading" inline :size="20" label="Téléchargement en cours" class="download-loading" /><i v-else class="fi fi-rr-download" aria-hidden="true"></i></button>
        </header>
        <div class="viewer-stage" @pointerdown="beginSwipe" @pointerup="endSwipe" @pointercancel="swipeStart = null">
          <LoadingSpinner v-if="!viewerLoaded && !viewerFailed" class="viewer-loading" label="Chargement de la photo" />
          <p v-if="viewerFailed" class="viewer-error" role="alert">Ce média ne peut pas être chargé.</p>
          <img v-if="activeItem.type === 'photo'" :key="activeItem.id" :src="activeItem.src" :alt="activeItem.title" draggable="false" :class="{ ready: viewerLoaded }" @load="viewerLoaded = true" @error="viewerFailed = true" />
          <video v-else :key="`video-${activeItem.id}`" :src="activeItem.src" :poster="activeItem.thumbnail" controls playsinline preload="metadata" @loadedmetadata="viewerLoaded = true" @error="viewerFailed = true" />
        </div>
        <button class="viewer-prev icon-button" type="button" aria-label="Média précédent" :disabled="activeIndex === 0" @click="navigate(-1)"><i  class="fi fi-rr-angle-left" aria-hidden="true"></i></button>
        <button class="viewer-next icon-button" type="button" aria-label="Média suivant" :disabled="activeIndex === visibleItems.length - 1" @click="navigate(1)"><i  class="fi fi-rr-angle-right" aria-hidden="true"></i></button>
      </template>
    </dialog>

  </section>
</template>

<script setup lang="ts">
import LoadingSpinner from '../../../../../core/components/other/LoadingSpinner.vue';
import { computed, nextTick, onBeforeUnmount, ref } from 'vue';
import { useRouter, useRoute } from '#imports';
import { AppColors } from '../../../../../core/constants/app_colors';
import SkeletonMedia from './SkeletonMedia.vue';
import { useToast } from '../../../../../core/shared/useToast';
import { Failure } from '../../../../../core/error/failure';
import { GetMediaDownloadsUseCase } from '../../../application/usecases/get_media_downloads_usecase';
import { GetMediaDownloadsRepositoryImpl } from '../../../data/repositories/get_media_downloads_repository_impl';
interface GalleryMedia {
  id: string;
  type: 'photo' | 'video';
  src: string;
  thumbnail?: string;
  title: string;
}


const colors = AppColors;
const props = withDefaults(defineProps<{ items?: GalleryMedia[]; loading?: boolean }>(), { items: () => [
  { id: 'photo-1', type: 'photo', title: 'Photo 1', src: 'https://i.postimg.cc/hhc5xdKw/Aja.jpg' },
  { id: 'photo-2', type: 'photo', title: 'Photo 2', src: 'https://i.postimg.cc/9zCnT7Wh/Instagram-(2).jpg' },
  { id: 'photo-3', type: 'photo', title: 'Photo 3', src: 'https://i.postimg.cc/Bt4VDKJR/Mike-Swarovski.jpg' },
  { id: 'photo-4', type: 'photo', title: 'Photo 4', src: 'https://i.postimg.cc/Bt4VDKqf/mogged-dogs-pets.jpg' },
  { id: 'photo-5', type: 'photo', title: 'Photo 5', src: 'https://i.postimg.cc/Z04M3dTh/telechargement-(50).jpg' },
  { id: 'photo-6', type: 'photo', title: 'Photo 6', src: 'https://i.postimg.cc/G9d5YybZ/telechargement-(54).jpg' },
  { id: 'photo-7', type: 'photo', title: 'Photo 7', src: 'https://i.postimg.cc/qg45n3kf/telechargement-(56).jpg' },
], loading: false });
const router = useRouter();
const route = useRoute();
const getDownloads = new GetMediaDownloadsUseCase(new GetMediaDownloadsRepositoryImpl());
const tab = ref<'photo' | 'video'>('photo');
const selecting = ref(false);
const selected = ref<string[]>([]);
const loaded = ref<Record<string, boolean>>({});
const failed = ref<Record<string, boolean>>({});
const visibleItems = computed(() => props.items.filter(item => item.type === tab.value));
const photoCount = computed(() => props.items.filter(item => item.type === 'photo').length);
const videoCount = computed(() => props.items.filter(item => item.type === 'video').length);
const viewer = ref<HTMLDialogElement>();
const activeIndex = ref<number | null>(null);
const activeItem = computed(() => activeIndex.value === null ? null : visibleItems.value[activeIndex.value]);
const viewerLoaded = ref(false);
const viewerFailed = ref(false);
const downloading = ref(false);
const { showToast } = useToast();
const downloadUrls = new Set<string>();
const downloadTimers = new Set<ReturnType<typeof setTimeout>>();
let downloadController: AbortController | undefined;
let pressTimer: ReturnType<typeof setTimeout> | undefined;
let pressStart: { x: number; y: number } | null = null;
let suppressedClick: { id: string } | null = null;
let swipeStart: { x: number; y: number } | null = null;
let previousOverflow: string | null = null;

function clearSelection() { selecting.value = false; selected.value = []; }
function back() {
  if (selecting.value) clearSelection();
  else router.push({ path: '/media', query: { token: typeof route.query.token === 'string' ? route.query.token : '' } });
}
function switchTab(value: 'photo' | 'video') { cancelPress(); clearSelection(); tab.value = value; }
function selectItem(id: string) { selecting.value = true; if (!selected.value.includes(id)) selected.value.push(id); }
function toggleSelection(id: string) {
  selecting.value = true;
  selected.value = selected.value.includes(id) ? selected.value.filter(value => value !== id) : [...selected.value, id];
}
function cancelPress() { clearTimeout(pressTimer); pressTimer = undefined; pressStart = null; }
function beginPress(event: PointerEvent, id: string) {
  if (!event.isPrimary || event.button !== 0) return;
  cancelPress();
  suppressedClick = null;
  pressStart = { x: event.clientX, y: event.clientY };
  pressTimer = setTimeout(() => { selectItem(id); suppressedClick = { id }; }, 450);
}
function movePress(event: PointerEvent) {
  if (pressStart && Math.hypot(event.clientX - pressStart.x, event.clientY - pressStart.y) > 10) cancelPress();
}
async function activate(item: GalleryMedia, index: number) {
  if (suppressedClick?.id === item.id) { suppressedClick = null; return; }
  if (selecting.value) { toggleSelection(item.id); return; }
  activeIndex.value = index;
  viewerLoaded.value = false;
  viewerFailed.value = false;
  await nextTick();
  previousOverflow = document.documentElement.style.overflow;
  document.documentElement.style.overflow = 'hidden';
  viewer.value?.showModal();
}
function finishViewer() {
  activeIndex.value = null;
  swipeStart = null;
  if (previousOverflow !== null) { document.documentElement.style.overflow = previousOverflow; previousOverflow = null; }
}
function closeViewer() { viewer.value?.querySelector('video')?.pause(); viewer.value?.close(); finishViewer(); }
function navigate(delta: number) {
  if (activeIndex.value === null) return;
  const index = activeIndex.value + delta;
  if (index < 0 || index >= visibleItems.value.length) return;
  viewer.value?.querySelector('video')?.pause();
  viewerLoaded.value = false;
  viewerFailed.value = false;
  activeIndex.value = index;
}
function viewerKeydown(event: KeyboardEvent) {
  if ((event.target as HTMLElement).tagName === 'VIDEO') return;
  if (event.key === 'ArrowRight') { event.preventDefault(); navigate(1); }
  if (event.key === 'ArrowLeft') { event.preventDefault(); navigate(-1); }
}
function beginSwipe(event: PointerEvent) {
  if (!event.isPrimary || event.button !== 0 || activeItem.value?.type !== 'photo') return;
  swipeStart = { x: event.clientX, y: event.clientY };
  (event.currentTarget as HTMLElement).setPointerCapture(event.pointerId);
}
function endSwipe(event: PointerEvent) {
  if (!swipeStart) return;
  const dx = event.clientX - swipeStart.x;
  const dy = event.clientY - swipeStart.y;
  swipeStart = null;
  if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.2) navigate(dx < 0 ? 1 : -1);
}
async function downloadMedia(ids: string[]) {
  if (downloading.value || !ids.length) return;
  downloading.value = true;
  showToast('Préparation des fichiers…', 'fi-rr-hourglass-end');
  const result = await getDownloads.execute({
    token: typeof route.query.token === 'string' ? route.query.token : '',
    mediaIds: ids.map(id => Number(id)),
  });
  if (result instanceof Failure) {
    downloading.value = false;
    showToast(result.message, 'fi-rr-exclamation', 'error');
    return;
  }
  const controller = new AbortController();
  downloadController = controller;
  const items = result.map(item => ({ id: String(item.id), src: item.download_url, title: item.filename }));
  const files: { url: string; name: string }[] = [];
  let failures = 0;
  try {
    for (const item of items) {
      if (controller.signal.aborted) return;
      try {
        const response = await fetch(item.src, { mode: 'cors', credentials: 'omit', signal: controller.signal });
        if (!response.ok) throw new Error('Download failed');
        const blob = await response.blob();
        if (controller.signal.aborted) return;
        if (!blob.size || !/^(image|video)\//.test(blob.type)) throw new Error('Invalid media');
        const url = URL.createObjectURL(blob);
        downloadUrls.add(url);
        files.push({ url, name: item.title });
      } catch {
        if (controller.signal.aborted) return;
        failures++;
      }
    }
    // The link must stay inside the active dialog when the viewer is open.
    for (const file of files) {
      const link = document.createElement('a');
      link.href = file.url;
      link.download = file.name;
      (viewer.value?.open ? viewer.value : document.body).appendChild(link);
      link.click();
      link.remove();
      const timer = setTimeout(() => {
        URL.revokeObjectURL(file.url);
        downloadUrls.delete(file.url);
        downloadTimers.delete(timer);
      }, 60000);
      downloadTimers.add(timer);
    }
    const message = failures
      ? failures + ' fichier(s) indisponible(s). Réessayez le téléchargement.'
      : files.length > 1
        ? 'Si votre navigateur le demande, autorisez les téléchargements multiples.'
        : 'Si rien ne se passe, vérifiez les téléchargements bloqués dans votre navigateur.';
    showToast(message, failures ? 'fi-rr-exclamation' : 'fi-rr-info', failures ? 'error' : 'normal');
  } finally {
    downloading.value = false;
  }
}
onBeforeUnmount(() => {
  cancelPress(); finishViewer(); downloadController?.abort();
  downloadTimers.forEach(timer => clearTimeout(timer));
  downloadUrls.forEach(url => URL.revokeObjectURL(url));
});
</script>

<style scoped>
.public-gallery { min-height: 100dvh; background: v-bind('colors.surface'); color: v-bind('colors.textPrimary'); }
.gallery-appbar { position: sticky; top: 0; z-index: 10; display: flex; align-items: center; gap: 14px; min-height: 76px; padding: max(12px, env(safe-area-inset-top)) 24px 12px; border-bottom: 1px solid v-bind('colors.borderLight'); background: v-bind('colors.surface'); }
.icon-button { width: 44px; height: 44px; padding: 10px; flex-shrink: 0; display: grid; place-items: center; border: 0; border-radius: 12px; background: var(--app-transparent); color: inherit; cursor: pointer; }
.icon-button svg { width: 24px; height: 24px; fill: none; stroke: currentColor; stroke-width: 1.8; stroke-linecap: round; stroke-linejoin: round; }
.icon-button:hover { background: v-bind('colors.primary10'); }
button:disabled { opacity: .35; cursor: default; }
button:focus-visible, a:focus-visible { outline: 2px solid v-bind('colors.primary'); outline-offset: 3px; }
.appbar-title { flex: 1; min-width: 0; }
h1 { margin: 0; font-size: 18px; font-weight: 700; }
.appbar-title span { display: block; margin-top: 4px; color: v-bind('colors.textSecondary'); font-size: 12px; }
.select-button { border: 0; padding: 10px 0 10px 10px; color: v-bind('colors.primary'); background: var(--app-transparent); font: inherit; font-size: 13px; font-weight: 600; cursor: pointer; }
.download-button { color: v-bind('colors.primary'); }
.gallery-content { max-width: 1200px; margin: auto; padding: 24px 24px 40px; }
.gallery-tabs { display: flex; gap: 8px; }
.gallery-tabs button { min-height: 42px; padding: 10px 18px; border: 0; border-radius: 12px; background: v-bind('colors.backgroundLight'); color: v-bind('colors.textSecondary'); font: inherit; font-size: 14px; font-weight: 600; cursor: pointer; }
.gallery-tabs button.active { color: v-bind('colors.primary'); background: v-bind('colors.infoLight'); }
.gallery-tabs span { margin-left: 8px; font-size: 11px; opacity: .75; }
.gallery-hint { margin: 20px 0 16px; color: v-bind('colors.textSecondary'); font-size: 12px; line-height: 1.5; }
.media-grid { display: grid; grid-template-columns: repeat(6, minmax(0, 1fr)); gap: 6px; }
.media-tile { position: relative; display: block; aspect-ratio: 1; padding: 0; border: 0; border-radius: 6px; overflow: hidden; background: v-bind('colors.background'); cursor: pointer; user-select: none; -webkit-user-select: none; -webkit-touch-callout: none; touch-action: pan-y; }
.media-tile img { display: block; width: 100%; height: 100%; object-fit: cover; opacity: 0; pointer-events: none; }
.media-tile img.ready { opacity: 1; }
.media-tile.selected::after { content: ''; position: absolute; inset: 0; border: 3px solid v-bind('colors.primary'); border-radius: inherit; background: v-bind('colors.primary10'); pointer-events: none; }
.selection-check { position: absolute; top: 8px; right: 8px; z-index: 1; width: 23px; height: 23px; border: 2px solid var(--app-surface); border-radius: 50%; background: var(--app-blackAlpha44); color: var(--app-surface); display: grid; place-items: center; font-size: 14px; }
.selected .selection-check { background: v-bind('colors.primary'); }
.tile-placeholder { position: absolute; inset: 0; }
.tile-error { position: absolute; inset: 0; display: grid; place-items: center; padding: 10px; font-size: 11px; color: v-bind('colors.textSecondary'); }
.video-badge { position: absolute; bottom: 8px; left: 8px; color: var(--app-surface); background: var(--app-blackAlpha88); padding: 4px 8px; border-radius: 6px; }
.empty-gallery { padding: 70px 15px; text-align: center; color: v-bind('colors.textSecondary'); }
.empty-gallery > span { font-size: 42px; }
.empty-gallery h2 { font-size: 15px; font-weight: 500; margin-top: 12px; }
.media-viewer { position: fixed; inset: 0; width: 100%; height: 100dvh; max-width: none; max-height: none; margin: 0; padding: 0; border: 0; background: var(--app-cameraBackground); color: var(--app-surface); }
.media-viewer::backdrop { background: var(--app-cameraBackground); }
.viewer-appbar { height: calc(64px + env(safe-area-inset-top)); padding: env(safe-area-inset-top) 16px 0; display: flex; justify-content: space-between; align-items: center; }
.viewer-appbar > span { font-size: 14px; }
.viewer-stage { position: relative; display: flex; justify-content: center; align-items: center; width: 100%; height: calc(100% - 64px - env(safe-area-inset-top)); padding-bottom: env(safe-area-inset-bottom); touch-action: pan-y pinch-zoom; }
.viewer-stage > img, .viewer-stage > video { width: 100%; height: 100%; max-width: 100%; max-height: 100%; object-fit: contain; }
.viewer-stage > img { opacity: 0; user-select: none; -webkit-user-select: none; -webkit-touch-callout: none; }
.viewer-stage > img.ready { opacity: 1; }
.viewer-loading, .viewer-error { position: absolute; padding: 20px; color: var(--app-textOnDarkSecondary); font-size: 14px; text-align: center; }


.viewer-prev, .viewer-next { position: absolute; top: 50%; background: var(--app-blackAlpha77); border-radius: 50%; }
.viewer-prev { left: 16px; } .viewer-next { right: 16px; }
@media (max-width: 950px) { .media-grid { grid-template-columns: repeat(4, minmax(0, 1fr)); } }
@media (max-width: 640px) { .gallery-appbar { gap: 6px; padding-left: 8px; padding-right: 16px; min-height: 66px; } h1 { font-size: 16px; } .appbar-title span { display: none; } .gallery-content { padding: 18px 8px 28px; } .gallery-tabs, .gallery-hint { margin-left: 8px; margin-right: 8px; } .media-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 3px; } .media-tile { border-radius: 3px; } .viewer-prev, .viewer-next { width: 34px; height: 34px; padding: 5px; } .viewer-prev { left: 6px; } .viewer-next { right: 6px; } }


/* Gallery presentation */
.public-gallery { background: v-bind('colors.backgroundLight'); }
.gallery-appbar { border-bottom: 1px solid v-bind('colors.border'); padding-left: max(20px, calc((100vw - 1200px) / 2)); padding-right: max(20px, calc((100vw - 1200px) / 2)); }
.icon-button i { display: flex; font-size: 23px; }
.gallery-appbar > .icon-button { background: v-bind('colors.backgroundLight'); border: 1px solid v-bind('colors.borderLight'); }
.select-button { padding: 11px 17px; border: 1px solid v-bind('colors.border'); border-radius: 12px; background: v-bind('colors.surface'); }
.gallery-content { padding-top: 28px; }
.gallery-intro { display: flex; align-items: center; justify-content: space-between; gap: 24px; padding: 30px 34px; margin-bottom: 28px; border-radius: 22px; background-image: radial-gradient(ellipse at 95% 0%, var(--app-primaryAlpha38), var(--app-transparent) 65%); color: var(--app-surface); }
.collection-label { display: flex; align-items: center; gap: 8px; color: v-bind('colors.primaryLight'); font-size: 10px; font-weight: 700; letter-spacing: 1.8px; }
.gallery-intro h2 { margin: 14px 0 9px; font-size: clamp(22px, 3vw, 32px); line-height: 1.15; letter-spacing: -.8px; }
.gallery-intro p { margin: 0; color: v-bind('colors.textOnDarkSecondary'); font-size: 13px; line-height: 1.6; }
.collection-count { min-width: 135px; text-align: right; border-left: 1px solid v-bind('colors.white10'); padding-left: 28px; }
.collection-count strong { display: block; font-size: 40px; line-height: 1.2; font-weight: 600; }
.collection-count span { display: block; margin-top: 5px; font-size: 10px; color: v-bind('colors.textOnDarkSecondary'); }
.gallery-tabs { gap: 4px; padding: 5px; width: fit-content; border: 1px solid v-bind('colors.border'); border-radius: 15px; background: v-bind('colors.borderLight'); }
.gallery-tabs button { display: flex; align-items: center; gap: 8px; background: var(--app-transparent); border-radius: 10px; padding: 9px 17px; }
.gallery-tabs button.active { background: var(--app-surface); box-shadow: 0 2px 7px var(--app-navyAlpha0A); }
.gallery-tabs span { margin-left: 3px; background: v-bind('colors.background'); padding: 3px 6px; border-radius: 6px; }
.gallery-hint { margin-top: 18px; }
.media-grid { gap: 10px; }
.media-tile { border-radius: 12px; box-shadow: 0 2px 8px var(--app-navyAlpha08); }
.media-tile img { transition: transform .2s ease; }
@media (hover: hover) { .media-tile:hover img { transform: scale(1.045); } }
.selection-check { width: 25px; height: 25px; box-shadow: 0 2px 8px var(--app-blackAlpha33); }
.selection-check i { display: flex; font-size: 11px; }
.empty-gallery > i { display: inline-flex; padding: 22px; border-radius: 22px; background: v-bind('colors.infoLight'); color: v-bind('colors.primary'); font-size: 32px; }
@media (max-width: 640px) {
 .gallery-appbar { padding-left: 12px; padding-right: 14px; gap: 10px; }
 .select-button { font-size: 12px; padding: 10px 12px; }
 .gallery-content { padding: 18px 12px 32px; }
 .gallery-intro { padding: 23px 20px; margin-bottom: 20px; border-radius: 18px; }
 .gallery-intro h2 { font-size: 24px; max-width: 220px; }
 .gallery-intro p { font-size: 12px; }
 .collection-count { display: none; }
 .gallery-tabs, .gallery-hint { margin-left: 0; margin-right: 0; }
 .media-grid { gap: 6px; }
 .media-tile { border-radius: 8px; }
}
@media (prefers-reduced-motion: reduce) { .media-tile img { transition: none; } }


.download-loading { --spinner-color: currentColor; --spinner-track: transparent; }
.viewer-loading { --spinner-color: var(--app-primaryLight); --spinner-track: var(--app-white20); }
</style>
