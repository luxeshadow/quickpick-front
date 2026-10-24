<template>
  <div v-if="showBanner" class="expiry" role="status">
    <i
      class="fi fi-rr-exclamation"
      aria-hidden="true"
    />
    <span>{{ message }}</span>
    <NuxtLink to="/manager/subscription">
      Gérer mon abonnement
      <i class="fi fi-rr-arrow-small-right" />
    </NuxtLink>
  </div>
</template>
<script setup lang="ts">
import { ref, watch, onBeforeUnmount } from 'vue';
import { Failure } from '../../error/failure';
import { useToast } from '../../shared/useToast';
import { useAuthStore } from '../../../features/auth/presentation/store/auth_store';
import { GetCurrentSubscriptionUseCase } from '../../../features/subscription/application/usecases/get_current_subscription_usecase';
import { GetCurrentSubscriptionRepositoryImpl } from '../../../features/subscription/data/repositories/get_current_subscription_repository_impl';

const authStore = useAuthStore();
const { showToast } = useToast();
const getCurrentSubscription = new GetCurrentSubscriptionUseCase(new GetCurrentSubscriptionRepositoryImpl());
const showBanner = ref(false);
const message = ref('');
let requestId = 0;

watch(() => authStore.session?.token, async (token) => {
  const currentRequest = ++requestId;
  showBanner.value = false;
  message.value = '';
  if (!import.meta.client || !token) return;
  const result = await getCurrentSubscription.execute({ token });
  if (currentRequest !== requestId) return;
  if (result instanceof Failure) {
    showToast(result.message, 'fi-rr-exclamation', 'error');
    return;
  }
  message.value = result.message;
  showBanner.value = !result.hasActiveSubscription;
}, { immediate: true });
onBeforeUnmount(() => { requestId++; });
</script>
<style scoped>
.expiry {
  display: flex;
  align-items: center;
  gap: 10px;
  margin: -30px -30px 25px;
  padding: 9px 30px;
  background: var(--app-subscriptionAlert);
  color: var(--app-surface);
  font-size: 12px;
  line-height: 1.4;
}
.expiry a {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-left: auto;
  color: var(--app-surface);
  text-decoration: none;
  font-weight: 600;
}
.expiry i {
  display: flex;
}
@media (max-width: 850px) {
  .expiry {
    margin: -20px -17px 25px;
    padding: 7px 17px;
    font-size: 11px;
  }
  .expiry a {
    display: none;
  }
}
</style>
