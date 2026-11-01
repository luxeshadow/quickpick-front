<script setup lang="ts">
import AccessLinkError from '../../features/accesslink/presentation/components/AccessLinkError.vue';
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
  <AccessLinkError v-if="error" :message="error" />
  <ScanLanding v-else :disabled="loading"
    @scan="accessLink && navigateTo({ path: '/media/scan', query: { token } })"
    @gallery="accessLink && navigateTo({ path: '/media/galery', query: { token } })" />
</template>


