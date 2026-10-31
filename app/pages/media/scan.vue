<script setup lang="ts">
import LoadingSpinner from '../../core/components/other/LoadingSpinner.vue';
import { computed, ref, onBeforeUnmount, watch } from 'vue';
import { useRoute } from '#imports';
import FaceScanner from '../../features/media/presentation/components/client/FaceScanner.vue';
import PublicGallery from '../../features/media/presentation/components/client/PublicGallery.vue';
import { CreateGuestScanUseCase } from '../../features/media/application/usecases/create_guest_scan_usecase';
import { CreateGuestScanRepositoryImpl } from '../../features/media/data/repositories/create_guest_scan_repository_impl';
import type { GuestScanResult } from '../../features/media/domain/entities/guest_scan';
import { ResolvePublicAccessLinkUseCase } from '../../features/accesslink/application/usecases/resolve_public_access_link_usecase';
import { ResolvePublicAccessLinkRepositoryImpl } from '../../features/accesslink/data/repositories/resolve_public_access_link_repository_impl';
import { Failure } from '../../core/error/failure';
import type { PublicAccessLink } from '../../features/accesslink/domain/entities/access_link';
const route = useRoute();
const token = computed(() => typeof route.query.token === 'string' ? route.query.token : '');
const accessLink = ref<PublicAccessLink | null>(null);
const error = ref('');
const loading = ref(true);
const resolveLink = new ResolvePublicAccessLinkUseCase(new ResolvePublicAccessLinkRepositoryImpl());
watch(token, async (value, oldValue, onCleanup) => {
  if (!import.meta.client) return;
  let cancelled = false;
  onCleanup(() => { cancelled = true; });
  accessLink.value = null; loading.value = true; error.value = '';
  const result = await resolveLink.execute({ token: value });
  if (cancelled) return;
  if (result instanceof Failure) error.value = result.message;
  else accessLink.value = result;
  loading.value = false;
}, { immediate: true });

const scanResult = ref<GuestScanResult | null>(null);
const searching = ref(false);
const searchError = ref('');
const createScan = new CreateGuestScanUseCase(new CreateGuestScanRepositoryImpl());
const matchedItems = computed(() => (scanResult.value?.media ?? []).map(item => ({ id: String(item.id), type: 'photo' as const, title: item.filename, src: item.url })));
let searchRequest = 0;
watch(token, () => { searchRequest++; scanResult.value = null; searchError.value = ''; searching.value = false; });
onBeforeUnmount(() => { searchRequest++; });
async function handleCapture(photo: File, consent: boolean) {
  if (searching.value) return;
  searching.value = true; searchError.value = '';
  const currentRequest = ++searchRequest;
  const result = await createScan.execute({ token: token.value, selfie: photo, consent });
  if (currentRequest !== searchRequest) return;
  searching.value = false;
  if (result instanceof Failure) { searchError.value = result.message; return; }
  scanResult.value = result;
}
</script>
<template>
  <LoadingSpinner v-if="loading" fullscreen :size="44" label="Chargement du lien d’accès" />
  <p v-else-if="error" role="alert">{{ error }}</p>
  <div v-else-if="accessLink">
    <FaceScanner v-if="!scanResult" :busy="searching" :search-error="searchError" @close="navigateTo({ path: '/media', query: { token } })" @capture="handleCapture" @change="searchError = ''" />
    <template v-else>
      <div class="scan-result" role="status">
        <p>{{ scanResult.scan.status === 'no_match' ? 'Aucune photo correspondante trouvée.' : scanResult.scan.matches_count + ' photo(s) trouvée(s).' }}</p>
        <button type="button" @click="scanResult = null">Reprendre une recherche</button>
        <button type="button" @click="navigateTo({ path: '/media', query: { token } })">Retour à l’accueil</button>
      </div>
      <PublicGallery v-if="matchedItems.length" :items="matchedItems" />
    </template>
  </div>
</template>
<style scoped>


.scan-result { padding: 20px; text-align: center; background: var(--app-background); color: var(--app-textPrimary); }
.scan-result button { margin: 5px; padding: 10px 16px; border: 1px solid var(--app-border); border-radius: 10px; background: var(--app-surface); color: var(--app-primary); cursor: pointer; }
</style>
