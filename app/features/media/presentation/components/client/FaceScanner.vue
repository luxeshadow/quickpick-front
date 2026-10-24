<template>
  <section class="face-scanner" aria-labelledby="scanner-title">
    <header class="scanner-top">
      <AppLogo />
      <button class="close-button" type="button" aria-label="Fermer le scanner" @click="close">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" /></svg>
      </button>
    </header>
    <div class="scanner-content">
      <span class="eyebrow">Retrouver mes photos</span>
      <h1 id="scanner-title">Prenez une photo de votre visage.</h1>
      <p class="description">Placez votre visage dans le cadre ou choisissez une photo de vous.</p>
      <div class="viewfinder" :aria-busy="busy">
        <div v-if="busy" class="search-overlay" role="status" aria-label="Recherche de vos photos"><span class="search-spinner" aria-hidden="true"></span></div>
        <img v-if="preview" :src="preview" alt="Aperçu de votre photo" class="photo-preview" />
        <video v-show="streamActive && !preview" ref="video" autoplay muted playsinline webkit-playsinline class="camera-preview" @loadeddata="markReady" @canplay="markReady" />
        <div v-if="!streamActive && !preview" class="camera-placeholder" aria-hidden="true">
          <svg viewBox="0 0 160 200" fill="none"><ellipse cx="80" cy="65" rx="33" ry="42" stroke="currentColor" stroke-width="2" /><path d="M20 180c0-42 25-59 60-59s60 17 60 59" stroke="currentColor" stroke-width="2" stroke-linecap="round" /></svg>
        </div>
        <div v-if="!preview" class="face-guide" aria-hidden="true"></div>
        <span class="frame-corner top-left" aria-hidden="true"></span>
        <span class="frame-corner top-right" aria-hidden="true"></span>
        <span class="frame-corner bottom-left" aria-hidden="true"></span>
        <span class="frame-corner bottom-right" aria-hidden="true"></span>
        <span class="frame-caption">{{ preview ? 'Votre photo' : streamActive ? 'Regardez la caméra' : 'Votre visage, bien au centre' }}</span>
      </div>
      <p v-if="error || searchError" class="scanner-error" role="alert">{{ error || searchError }}</p>
      <p v-if="cameraNotice" class="camera-notice" role="status">{{ cameraNotice }}</p>
      <div class="scanner-tips"><span><i class="fi fi-rr-bulb" aria-hidden="true"></i> Bonne lumière</span><span><i class="fi fi-rr-user" aria-hidden="true"></i> Visage dégagé</span></div>
      <div class="scanner-actions">
        <template v-if="preview">
          <label class="consent"><input v-model="consent" type="checkbox" :disabled="busy" /> J’accepte l’analyse de mon visage pour retrouver mes photos.</label>
          <button class="primary-button" type="button" :disabled="busy || !consent" @click="usePhoto">{{ busy ? 'Recherche en cours…' : 'Retrouver mes photos' }}</button>
          <button class="secondary-button" type="button"  :disabled="busy" @click="reset">Reprendre une photo</button>
        </template>
        <template v-else>
          <button v-if="streamActive" class="primary-button" type="button" :disabled="!cameraReady || capturing" @click="capture"><i class="fi fi-rr-camera" aria-hidden="true"></i> {{ capturing ? 'Préparation…' : cameraReady ? 'Prendre la photo' : 'Préparation de la caméra…' }}</button>
          <button v-else class="primary-button" type="button" :disabled="starting" @click="startCamera"><i class="fi fi-rr-camera" aria-hidden="true"></i> {{ starting ? 'Ouverture de la caméra…' : 'Activer la caméra' }}</button>
          <button v-if="starting" class="secondary-button" type="button" @click="cancelCamera">Annuler la demande</button>
          <button v-if="isMobile && error" class="secondary-button" type="button" @click="openNativeCamera">Utiliser l’appareil photo du téléphone</button>
          <button class="secondary-button" type="button" @click="openPhotoPicker"><i class="fi fi-rr-picture" aria-hidden="true"></i> Choisir une photo</button>
        </template>
      </div>
      <input ref="nativeCameraInput" class="file-input" type="file" accept="image/*" capture="user" tabindex="-1" aria-label="Prendre une photo avec le téléphone" @change="selectPhoto" />
      <input ref="fileInput" class="file-input" type="file" accept="image/*" tabindex="-1" aria-label="Choisir votre photo" @change="selectPhoto" />
      <p class="privacy-note"><i class="fi fi-rr-lock" aria-hidden="true"></i> Le selfie n’est pas conservé. Une recherche acceptée consomme un scan, même en cas d’échec.</p>
    </div>
  </section>
</template>

<script setup lang="ts">
import AppLogo from '../../../../../core/components/other/AppLogo.vue';
import { nextTick, onBeforeUnmount, onMounted, ref } from 'vue';
import { AppColors } from '../../../../../core/constants/app_colors';

const props = withDefaults(defineProps<{ busy?: boolean; searchError?: string }>(), { busy: false, searchError: '' });
const consent = ref(false);
const colors = AppColors;
const emit = defineEmits<{ close: []; capture: [photo: File, consent: boolean]; change: [] }>();
const video = ref<HTMLVideoElement>();
const fileInput = ref<HTMLInputElement>();
const nativeCameraInput = ref<HTMLInputElement>();
const streamActive = ref(false);
const cameraReady = ref(false);
const starting = ref(false);
const capturing = ref(false);
const preview = ref('');
const error = ref('');
const cameraNotice = ref('');
const isMobile = ref(false);
let stream: MediaStream | undefined;
let photo: File | undefined;
let request = 0;

function stopCamera() {
  request++;
  const previousStream = stream;
  stream = undefined;
  previousStream?.getTracks().forEach(track => { track.onended = null; track.stop(); });
  streamActive.value = false;
  cameraReady.value = false;
  starting.value = false;
  capturing.value = false;
  if (video.value) video.value.srcObject = null;
}

function permissionHelp() {
  const ios = /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  if (ios) return 'Sur iPhone ou iPad, autorisez la caméra dans les réglages du site et du navigateur, puis réessayez. Si la page est ouverte dans une autre application, ouvrez-la dans Safari.';
  if (/Android/.test(navigator.userAgent)) return 'Sur Android, autorisez la caméra pour ce site et pour votre navigateur dans les paramètres du téléphone, puis réessayez. Vous pouvez aussi ouvrir cette page dans Chrome.';
  return 'Autorisez la caméra dans les paramètres de ce site et de votre navigateur, puis réessayez.';
}

function cameraError(reason: unknown) {
  const name = (reason as { name?: string })?.name;
  if (name === 'NotAllowedError' || name === 'PermissionDeniedError' || name === 'SecurityError') return 'Accès caméra non autorisé. ' + permissionHelp();
  if (name === 'NotFoundError' || name === 'DevicesNotFoundError') return 'Aucune caméra disponible. Vous pouvez choisir une photo sur votre appareil.';
  if (name === 'NotReadableError' || name === 'TrackStartError') return 'La caméra est occupée ou inaccessible. Fermez les autres applications qui l’utilisent, puis réessayez.';
  if (name === 'OverconstrainedError') return 'Cette caméra ne prend pas en charge le mode demandé. Vous pouvez choisir une photo.';
  return 'La caméra n’a pas pu démarrer. Réessayez ou choisissez une photo sur votre appareil.';
}

function markReady() {
  cameraReady.value = streamActive.value && !!video.value?.videoWidth && !!video.value?.videoHeight && (video.value?.readyState ?? 0) >= 2;
}

async function startCamera() {
  if (starting.value || streamActive.value) return;
  error.value = '';
  cameraNotice.value = '';
  if (!window.isSecureContext) {
    error.value = 'Pour activer la caméra, ouvrez ce site avec une adresse HTTPS. Vous pouvez aussi choisir une photo.';
    return;
  }
  if (!navigator.mediaDevices?.getUserMedia) {
    error.value = 'Ce navigateur ne permet pas l’accès direct à la caméra. Ouvrez cette page dans Safari ou Chrome, ou choisissez une photo.';
    return;
  }
  starting.value = true;
  const currentRequest = ++request;
  try {
    let camera: MediaStream;
    try {
      camera = await navigator.mediaDevices.getUserMedia({ video: { facingMode: { ideal: 'user' }, width: { ideal: 1280 }, height: { ideal: 960 } }, audio: false });
    } catch (reason) {
      if (currentRequest !== request) return;
      if ((reason as { name?: string }).name !== 'OverconstrainedError') throw reason;
      camera = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
    }
    // A browser permission prompt cannot be cancelled by JavaScript. Stop a late stream immediately.
    if (currentRequest !== request) { camera.getTracks().forEach(track => track.stop()); return; }
    stream = camera;
    streamActive.value = true;
    camera.getVideoTracks().forEach(track => {
      track.onended = () => {
        if (stream !== camera) return;
        stopCamera();
        cameraNotice.value = 'L’accès à la caméra a été interrompu. Appuyez sur Activer la caméra pour reprendre.';
      };
    });
    await nextTick();
    if (currentRequest !== request || !video.value) return;
    video.value.muted = true;
    video.value.playsInline = true;
    video.value.srcObject = camera;
    await video.value.play();
    if (currentRequest === request) markReady();
  } catch (reason) {
    if (currentRequest === request) { stopCamera(); error.value = cameraError(reason); }
  } finally {
    if (currentRequest === request) starting.value = false;
  }
}

function cancelCamera() { stopCamera(); cameraNotice.value = 'Demande annulée. Vous pouvez réessayer ou choisir une photo.'; }
function openPhotoPicker() { stopCamera(); fileInput.value?.click(); }
function openNativeCamera() { stopCamera(); nativeCameraInput.value?.click(); }

function setPhoto(file: File) {
  stopCamera();
  if (preview.value) URL.revokeObjectURL(preview.value);
  photo = file;
  consent.value = false;
  preview.value = URL.createObjectURL(file);
  error.value = '';
  cameraNotice.value = '';
  emit('change');
}

function selectPhoto(event: Event) {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];
  if (file && (file.type.startsWith('image/') || (!file.type && /\.(jpe?g|png|webp|heic|heif)$/i.test(file.name)))) setPhoto(file);
  input.value = '';
}

function capture() {
  const camera = video.value;
  if (!cameraReady.value || !camera?.videoWidth || capturing.value) return;
  const currentRequest = request;
  capturing.value = true;
  try {
    const canvas = document.createElement('canvas');
    const frameRatio = 4 / 4.5;
    const cropWidth = Math.min(camera.videoWidth, camera.videoHeight * frameRatio);
    const cropHeight = cropWidth / frameRatio;
    canvas.width = Math.round(cropWidth);
    canvas.height = Math.round(cropHeight);
    const context = canvas.getContext('2d');
    if (!context) throw new Error('Canvas unavailable');
    context.drawImage(camera, (camera.videoWidth - cropWidth) / 2, (camera.videoHeight - cropHeight) / 2, cropWidth, cropHeight, 0, 0, canvas.width, canvas.height);
    canvas.toBlob(blob => {
      if (currentRequest !== request) return;
      capturing.value = false;
      if (blob) setPhoto(new File([blob], 'quickpick-photo.jpg', { type: 'image/jpeg' }));
      else error.value = 'La photo n’a pas pu être prise. Veuillez réessayer.';
    }, 'image/jpeg', .92);
  } catch {
    capturing.value = false;
    error.value = 'La photo n’a pas pu être prise. Veuillez réessayer.';
  }
}

function pauseCamera() {
  if (stream || starting.value) {
    stopCamera();
    cameraNotice.value = 'Caméra mise en pause. Appuyez sur Activer la caméra pour reprendre.';
  }
}
function onVisibilityChange() { if (document.hidden) pauseCamera(); }
function reset() {
  stopCamera();
  if (preview.value) URL.revokeObjectURL(preview.value);
  preview.value = '';
  photo = undefined;
  consent.value = false;
  error.value = '';
  cameraNotice.value = '';
  emit('change');
}
function close() { if (props.busy) return; reset(); emit('close'); }
function usePhoto() { if (photo && consent.value && !props.busy) emit('capture', photo, consent.value); }

onMounted(() => {
  isMobile.value = /Android|iPhone|iPad|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  document.addEventListener('visibilitychange', onVisibilityChange);
  window.addEventListener('pagehide', pauseCamera);
});
onBeforeUnmount(() => {
  document.removeEventListener('visibilitychange', onVisibilityChange);
  window.removeEventListener('pagehide', pauseCamera);
  reset();
});
</script>

<style scoped>
.search-overlay { position: absolute; inset: 0; z-index: 2; display: grid; place-items: center; background: v-bind('colors.navy'); opacity: .92; }
.search-spinner { width: 44px; height: 44px; border: 4px solid v-bind('colors.white20'); border-top-color: v-bind('colors.primaryLight'); border-radius: 50%; animation: search-spin .8s linear infinite; }
@keyframes search-spin { to { transform: rotate(360deg); } }
.consent { display: flex; align-items: flex-start; gap: 10px; text-align: left; font-size: 12px; line-height: 1.6; color: v-bind('colors.textOnDarkSecondary'); }
.consent input { margin-top: 4px; accent-color: v-bind('colors.primary'); }
.secondary-button:disabled { opacity: .65; cursor: default; }
@media (prefers-reduced-motion: reduce) { .search-spinner { animation: none; } }

.face-scanner { min-height: 100dvh; background: radial-gradient(ellipse at 50% 35%, v-bind('colors.navySoft'), var(--app-transparent) 65%), v-bind('colors.navy'); color: v-bind('colors.white'); padding: 28px 24px 40px; }
.scanner-top { max-width: 1200px; margin: auto; display: flex; align-items: center; justify-content: space-between; }


.close-button { width: 44px; height: 44px; display: grid; place-items: center; border: 1px solid v-bind('colors.white20'); border-radius: 14px; background: v-bind('colors.white05'); color: inherit; cursor: pointer; }
.scanner-content { width: 100%; max-width: 480px; margin: 38px auto 0; text-align: center; }
.eyebrow { color: v-bind('colors.primaryLight'); font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; }
h1 { margin: 12px 0; font-size: clamp(27px, 4vw, 36px); line-height: 1.15; letter-spacing: -1px; }
.description { margin: 0 auto 26px; color: v-bind('colors.textOnDarkSecondary'); font-size: 14px; line-height: 1.7; max-width: 380px; }
.viewfinder { position: relative; width: min(100%, 340px); aspect-ratio: 4 / 4.5; margin: auto; border-radius: 28px; overflow: hidden; background: v-bind('colors.navyDark'); border: 1px solid v-bind('colors.white10'); }
.camera-placeholder { position: absolute; inset: 18% 25% 17%; display: grid; place-items: center; color: v-bind('colors.textOnDarkSecondary'); opacity: .4; }
.camera-placeholder svg { width: 100%; height: 100%; }
.camera-preview, .photo-preview { width: 100%; height: 100%; object-fit: cover; }
.camera-preview { transform: scaleX(-1); }
.face-guide { position: absolute; inset: 12% 18% 18%; border: 1px dashed v-bind('colors.primaryLight'); border-radius: 48%; pointer-events: none; }
.frame-corner { position: absolute; width: 29px; height: 29px; border: 3px solid v-bind('colors.primaryLight'); pointer-events: none; }
.top-left { top: 18px; left: 18px; border-right: 0; border-bottom: 0; border-radius: 9px 0 0; }
.top-right { top: 18px; right: 18px; border-left: 0; border-bottom: 0; border-radius: 0 9px 0 0; }
.bottom-left { bottom: 18px; left: 18px; border-right: 0; border-top: 0; border-radius: 0 0 0 9px; }
.bottom-right { bottom: 18px; right: 18px; border-left: 0; border-top: 0; border-radius: 0 0 9px; }
.frame-caption { position: absolute; bottom: 20px; left: 50%; transform: translateX(-50%); white-space: nowrap; background: v-bind('colors.navy'); padding: 7px 12px; border-radius: 20px; font-size: 11px; color: v-bind('colors.textOnDarkSecondary'); }
.scanner-tips { display: flex; justify-content: center; flex-wrap: wrap; gap: 20px; margin: 18px 0 25px; color: v-bind('colors.textOnDarkSecondary'); font-size: 12px; }
.scanner-tips span { display: flex; align-items: center; gap: 7px; }
.scanner-tips i { color: v-bind('colors.primaryLight'); }
.scanner-actions { display: flex; flex-direction: column; gap: 12px; max-width: 340px; margin: auto; }
.primary-button, .secondary-button { min-height: 52px; border-radius: 14px; padding: 12px 16px; display: flex; align-items: center; justify-content: center; gap: 10px; font: inherit; font-size: 14px; font-weight: 600; color: inherit; cursor: pointer; }
.primary-button { border: 0; background: v-bind('colors.primary'); }
.primary-button:hover { background: v-bind('colors.primaryHover'); }
.primary-button:disabled { opacity: .65; cursor: wait; }
.secondary-button { border: 1px solid v-bind('colors.white20'); background: v-bind('colors.white05'); }
button:focus-visible { outline: 2px solid v-bind('colors.primaryLight'); outline-offset: 4px; }
.privacy-note { margin: 22px 0 0; font-size: 11px; line-height: 1.6; color: v-bind('colors.textOnDarkSecondary'); }
.scanner-error { font-size: 13px; line-height: 1.5; color: v-bind('colors.danger'); }
.camera-notice { font-size: 13px; line-height: 1.6; color: v-bind('colors.textOnDarkSecondary'); }
.file-input { display: none; }
@media (max-width: 640px) { .face-scanner { padding: 18px 18px 30px; } .scanner-content { margin-top: 28px; }  }
</style>
