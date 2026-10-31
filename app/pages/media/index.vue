<script setup lang="ts">
import LoadingSpinner from '../../core/components/other/LoadingSpinner.vue';
import { computed, ref, watch } from 'vue';
import { useRoute } from '#imports';
import ScanLanding from '../../features/media/presentation/components/client/ScanLanding.vue';
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
</script>
<template>
  <LoadingSpinner v-if="loading" fullscreen :size="44" label="Chargement du lien d’accès" />
  <p v-else-if="error" role="alert">{{ error }}</p>
  <ScanLanding v-else-if="accessLink"
    @scan="navigateTo({ path: '/media/scan', query: { token } })"
    @gallery="navigateTo({ path: '/media/galery', query: { token } })" />
</template>


