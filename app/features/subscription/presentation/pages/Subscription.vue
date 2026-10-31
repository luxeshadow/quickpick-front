<script setup lang="ts">
import LoadingSpinner from '../../../../core/components/other/LoadingSpinner.vue';
import { ref, watch } from 'vue';
import { Failure } from '../../../../core/error/failure';
import { useAuthStore } from '../../../auth/presentation/store/auth_store';
import type { SubscriptionPlan } from '../../../subscribeplan/domain/entities/subscription_plan';
import type { CurrentSubscription } from '../../domain/entities/subscription';
import { GetSubscriptionPlansUseCase } from '../../../subscribeplan/application/usecases/get_subscription_plans_usecase';
import { GetSubscriptionPlansRepositoryImpl } from '../../../subscribeplan/data/repositories/get_subscription_plans_repository_impl';
import { GetCurrentSubscriptionUseCase } from '../../application/usecases/get_current_subscription_usecase';
import { GetCurrentSubscriptionRepositoryImpl } from '../../data/repositories/get_current_subscription_repository_impl';

const authStore = useAuthStore();
const plans = ref<SubscriptionPlan[]>([]);
const currentSubscription = ref<CurrentSubscription | null>(null);
const loading = ref(false);
const plansError = ref('');
const subscriptionError = ref('');
const getPlans = new GetSubscriptionPlansUseCase(new GetSubscriptionPlansRepositoryImpl());
const getCurrentSubscription = new GetCurrentSubscriptionUseCase(new GetCurrentSubscriptionRepositoryImpl());

watch(() => authStore.session?.token, async (token, oldToken, onCleanup) => {
  if (!import.meta.client) return;
  let cancelled = false;
  onCleanup(() => { cancelled = true; });
  loading.value = true;
  plans.value = [];
  currentSubscription.value = null;
  plansError.value = '';
  subscriptionError.value = '';

  const [plansResult, subscriptionResult] = await Promise.all([
    getPlans.execute({ token }),
    getCurrentSubscription.execute({ token: token ?? '' }),
  ]);
  if (cancelled) return;
  if (plansResult instanceof Failure) {
    plansError.value = plansResult.message;
  } else {
    plans.value = plansResult;
  }
  if (subscriptionResult instanceof Failure) {
    subscriptionError.value = subscriptionResult.message;
  } else {
    currentSubscription.value = subscriptionResult;
  }
  loading.value = false;
}, { immediate: true });
</script>

<template>
  <section id="page-subscription" class="subscription-page">
    <div class="section-header">
      <div class="section-title">
        <h2>Un forfait pour chaque besoin.</h2>
        <p>Comparez les fonctionnalités et le nombre d’événements inclus.</p>
      </div>
    </div>
    <LoadingSpinner v-if="loading" label="Chargement des abonnements" />
    <p v-if="plansError" role="alert">{{ plansError }}</p>
    <p v-if="subscriptionError" role="alert">{{ subscriptionError }}</p>
    <p v-if="!loading && currentSubscription" role="status">{{ currentSubscription.message }}</p>
    <p v-if="!loading && !plansError && !plans.length">Aucun plan disponible.</p>
    <div class="offer-grid">
      <article v-for="plan in plans" :key="plan.id" class="offer-card"
        :class="{ 'current-offer': currentSubscription?.hasActiveSubscription && currentSubscription.subscription?.subscriptionPlanId === plan.id }">
        <div v-if="currentSubscription?.hasActiveSubscription && currentSubscription.subscription?.subscriptionPlanId === plan.id" class="current-offer-badge">
          <span class="subscription-emblem"><i class="fi fi-rr-badge-check" aria-hidden="true"></i></span>
          <div><small>VOTRE ESPACE QUICKPICK</small><strong>Votre abonnement</strong></div>
          <span class="subscription-active"><span></span>Actif</span>
        </div>
        <div class="offer-heading">
          <span class="offer-icon"><i class="fi fi-rr-calendar" aria-hidden="true"></i></span>
          <span class="offer-kicker">{{ plan.description }}</span>
        </div>
        <h3>{{ plan.name }}</h3>
        <div class="offer-limit">
          <strong>{{ plan.maxEvents ?? 'Illimité' }}</strong><span>événements</span>
        </div>
        <p class="offer-price">
          {{ Number(plan.price) === 0 ? 'Gratuit' : plan.price }}
          <span v-if="plan.durationDays !== null"> / {{ plan.durationDays }} jours</span>
        </p>
        <ul class="offer-features">
          <li>
            <span class="feature-circle included" aria-label="Inclus"><i class="fi fi-rr-check" aria-hidden="true"></i></span>
            <span>Photos<small>{{ plan.maxPhotos ?? 'Illimité' }}</small></span>
          </li>
          <li>
            <span class="feature-circle" :class="plan.acceptVideo ? 'included' : 'excluded'" :aria-label="plan.acceptVideo ? 'Inclus' : 'Non inclus'">
              <i :class="plan.acceptVideo ? 'fi fi-rr-check' : 'fi fi-rr-cross-small'" aria-hidden="true"></i>
            </span>
            <span>Vidéos<small v-if="plan.acceptVideo">{{ plan.maxVideos ?? 'Illimité' }}</small></span>
          </li>
        </ul>
      </article>
    </div>
  </section>
</template>
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
.offer-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 18px;
  align-items: stretch;
}
.offer-card {
  min-width: 0;
  border: 1px solid var(--app-border);
  border-radius: 20px;
  padding: 24px 20px;
  background: var(--app-surface);
  box-shadow: 0 8px 28px var(--app-navyAlpha04);
}
.business-offer {
  border-color: var(--app-primary);
  background: linear-gradient(160deg, var(--app-infoLight), var(--app-surface) 45%);
}
.offer-heading {
  display: flex;
  align-items: center;
  gap: 10px;
  min-height: 38px;
  margin-bottom: 22px;
}
.offer-icon {
  display: grid;
  place-items: center;
  width: 34px;
  height: 34px;
  border-radius: 10px;
  background: var(--app-infoLight);
  color: var(--app-primary);
  flex-shrink: 0;
}
.offer-kicker {
  font-size: 8px;
  font-weight: 600;
  line-height: 1.6;
  letter-spacing: 1px;
  color: var(--app-textSecondary);
}
.offer-card h3 {
  font-size: 18px;
  font-weight: 600;
  letter-spacing: -0.4px;
  margin: 0 0 24px;
}
.offer-limit {
  display: flex;
  align-items: baseline;
  gap: 8px;
}
.offer-limit strong {
  font-size: 44px;
  line-height: 1;
  font-weight: 600;
  letter-spacing: -2px;
  color: var(--app-navy);
}
.offer-limit > span {
  font-size: 12px;
  color: var(--app-textSecondary);
}
.offer-price {
  font-size: 12px;
  color: var(--app-textSecondary);
  margin: 12px 0 24px;
}
.offer-features {
  border-top: 1px solid var(--app-borderLight);
  padding: 22px 0 0;
  margin: 0;
  list-style: none;
  display: grid;
  gap: 17px;
}
.offer-features li {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  font-size: 11px;
  color: var(--app-textPrimary);
  line-height: 1.65;
}
.feature-circle {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 21px;
  height: 21px;
  border-radius: 50%;
  color: var(--app-surface);
  font-size: 10px;
}
.feature-circle.included {
  background: var(--app-success);
}
.feature-circle.excluded {
  background: var(--app-danger);
  font-size: 15px;
}
.feature-circle.pending {
  background: var(--app-border);
  color: var(--app-textSecondary);
  font-size: 14px;
}
.offer-features small {
  display: block;
  color: var(--app-textMuted);
  font-size: 10px;
}
.offer-note {
  margin-top: 20px;
  font-size: 11px;
  color: var(--app-textSecondary);
}
@media (max-width: 1200px) {
  .offer-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
@media (max-width: 640px) {
  .offer-grid {
    grid-template-columns: 1fr;
  }
  .offer-card {
    padding: 24px;
  }
  .offer-features li {
    font-size: 13px;
  }
}
.offer-card.current-offer {
  position: relative;
  border: 2px solid var(--app-primary);
  box-shadow: 0 0 0 4px var(--app-primaryOpacity8);
  padding-top: 24px;
}
.current-offer-badge {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin: -24px -20px 24px;
  padding: 11px 14px;
  border-radius: 17px 17px 0 0;
  background: var(--app-primary);
  color: var(--app-surface);
  font-size: 11px;
  font-weight: 600;
  line-height: 1.4;
}
.current-offer-badge i {
  font-size: 11px;
}
@media (max-width: 640px) {
  .current-offer-badge {
    margin-left: -24px;
    margin-right: -24px;
  }
}
.offer-card.current-offer {
  border: 1px solid var(--app-primary);
  box-shadow:
    0 12px 32px var(--app-navyOpacity10),
    0 0 0 3px var(--app-primaryOpacity6);
  background: radial-gradient(ellipse at 100% 15%, var(--app-primary10), var(--app-transparent) 48%), var(--app-surface);
}
.current-offer-badge {
  position: relative;
  justify-content: flex-start;
  gap: 10px;
  padding: 20px 16px;
  margin-top: -24px;
  margin-bottom: 26px;
  border-radius: 18px 18px 0 0;
  background:
    radial-gradient(circle at 100% 0%, var(--app-primaryLightOpacity30), var(--app-transparent) 65%),
    linear-gradient(135deg, var(--app-navy), var(--app-navyMedium));
  overflow: hidden;
  flex-wrap: wrap;
}
.current-offer-badge:after {
  content: '';
  position: absolute;
  right: -38px;
  top: -48px;
  width: 150px;
  height: 150px;
  border: 1px solid var(--app-white10);
  border-radius: 50%;
  box-shadow: 0 0 0 20px var(--app-surfaceOpacity2_5);
  pointer-events: none;
}
.subscription-emblem {
  display: grid;
  place-items: center;
  width: 35px;
  height: 35px;
  border-radius: 11px;
  background: var(--app-primaryLightOpacity16);
  border: 1px solid var(--app-primaryLightOpacity25);
  color: var(--app-bluePale);
  flex-shrink: 0;
}
.subscription-emblem i {
  font-size: 20px;
}
.current-offer-badge > div {
  position: relative;
  z-index: 1;
}
.current-offer-badge small {
  display: block;
  font-size: 7px;
  letter-spacing: 1px;
  color: var(--app-textOnDarkSecondary);
  font-weight: 500;
  margin-bottom: 5px;
}
.current-offer-badge strong {
  display: block;
  font-size: 12px;
  font-weight: 600;
}
.subscription-active {
  position: relative;
  z-index: 1;
  display: inline-flex;
  align-items: center;
  gap: 5px;
  margin-left: auto;
  padding: 5px 7px;
  background: var(--app-successOpacity13);
  border: 1px solid var(--app-successOpacity25);
  border-radius: 20px;
  font-size: 9px;
  color: var(--app-successPastel);
}
.subscription-active > span {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: var(--app-success);
}
.current-offer .offer-limit strong {
  color: var(--app-primary);
}
.current-offer .offer-icon {
  background: var(--app-primary);
  color: var(--app-surface);
}
.current-offer .offer-heading {
  margin-bottom: 16px;
}
</style>
