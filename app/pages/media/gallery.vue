<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useRoute } from '#imports';
import PublicGallery from '../../features/media/presentation/components/client/PublicGallery.vue';
import { Failure } from '../../core/error/failure';
import type { PublicMedia } from '../../features/media/domain/entities/public_media';
import { GetPublicMediaUseCase } from '../../features/media/application/usecases/get_public_media_usecase';
import { GetPublicMediaRepositoryImpl } from '../../features/media/data/repositories/get_public_media_repository_impl';
definePageMeta({ alias: ['/gallery', '/media/galery'] });
const route = useRoute();
const token = computed(() => typeof route.query.token === 'string' ? route.query.token : '');
const media = ref<PublicMedia[]>([]);
const items = computed(() => media.value.map(item => ({ id: String(item.id), type: 'photo' as const, title: item.filename, src: item.url })));
const loading = ref(true);
const loadingMore = ref(false);
const error = ref('');
const nextCursor = ref<string | null>(null);
const hasMore = ref(false);
const getMedia = new GetPublicMediaUseCase(new GetPublicMediaRepositoryImpl());
watch(token, async (value, oldValue, onCleanup) => {
  if (!import.meta.client) return;
  let cancelled = false;
  onCleanup(() => { cancelled = true; });
  media.value = []; loading.value = true; error.value = ''; hasMore.value = false; nextCursor.value = null;
  const result = await getMedia.execute({ token: value });
  if (cancelled) return;
  if (result instanceof Failure) error.value = result.message;
  else { media.value = result.media; nextCursor.value = result.pagination.next_cursor; hasMore.value = result.pagination.has_more; }
  loading.value = false;
}, { immediate: true });
async function loadMore() {
  if (loadingMore.value || !nextCursor.value) return;
  const currentToken = token.value;
  loadingMore.value = true; error.value = '';
  const result = await getMedia.execute({ token: currentToken, cursor: nextCursor.value });
  loadingMore.value = false;
  if (currentToken !== token.value) return;
  if (result instanceof Failure) { error.value = result.message; return; }
  media.value.push(...result.media);
  nextCursor.value = result.pagination.next_cursor; hasMore.value = result.pagination.has_more;
}
</script>
<template>
  <div>
    <p v-if="error" role="alert">{{ error }}</p>
    <PublicGallery :items="items" :loading="loading" />
    <button v-if="hasMore && nextCursor" type="button" class="load-more" :disabled="loadingMore" @click="loadMore">{{ loadingMore ? 'Chargement…' : 'Voir plus de photos' }}</button>
  </div>
</template>
<style scoped>
.load-more { display: block; margin: 20px auto; padding: 12px 20px; border: none; border-radius: 12px; background: var(--app-primary); color: var(--app-textOnPrimary); cursor: pointer; }
</style>
