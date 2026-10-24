<script setup lang="ts">
import { ref, watch } from 'vue';
import Input from '../../../../core/components/other/Input.vue';
import Button from '../../../../core/components/other/Button.vue';
import ManagerDialog from '../../../../core/components/other/ManagerDialog.vue';
import { AppColors } from '../../../../core/constants/app_colors';
import { Failure } from '../../../../core/error/failure';
import { useAuthStore } from '../../../auth/presentation/store/auth_store';
import type { SubscriptionPlan } from '../../domain/entities/subscription_plan';
import { GetSubscriptionPlansUseCase } from '../../application/usecases/get_subscription_plans_usecase';
import { GetSubscriptionPlansRepositoryImpl } from '../../data/repositories/get_subscription_plans_repository_impl';
import { CreateSubscriptionPlanUseCase } from '../../application/usecases/create_subscription_plan_usecase';
import { CreateSubscriptionPlanRepositoryImpl } from '../../data/repositories/create_subscription_plan_repository_impl';
import { ShowSubscriptionPlanUseCase } from '../../application/usecases/show_subscription_plan_usecase';
import { ShowSubscriptionPlanRepositoryImpl } from '../../data/repositories/show_subscription_plan_repository_impl';
import { UpdateSubscriptionPlanUseCase } from '../../application/usecases/update_subscription_plan_usecase';
import { UpdateSubscriptionPlanRepositoryImpl } from '../../data/repositories/update_subscription_plan_repository_impl';
import { DeleteSubscriptionPlanUseCase } from '../../application/usecases/delete_subscription_plan_usecase';
import { DeleteSubscriptionPlanRepositoryImpl } from '../../data/repositories/delete_subscription_plan_repository_impl';

const colors = AppColors;
const auth = useAuthStore();
const getPlans = new GetSubscriptionPlansUseCase(new GetSubscriptionPlansRepositoryImpl());
const createPlan = new CreateSubscriptionPlanUseCase(new CreateSubscriptionPlanRepositoryImpl());
const showPlan = new ShowSubscriptionPlanUseCase(new ShowSubscriptionPlanRepositoryImpl());
const updatePlan = new UpdateSubscriptionPlanUseCase(new UpdateSubscriptionPlanRepositoryImpl());
const deletePlan = new DeleteSubscriptionPlanUseCase(new DeleteSubscriptionPlanRepositoryImpl());

const plans = ref<SubscriptionPlan[]>([]);
const busy = ref(false);
const loading = ref(false);
const error = ref('');
const notice = ref('');
const editingId = ref<number | null>(null);
const deleting = ref<SubscriptionPlan | null>(null);
const form = ref({ name: '', description: '', price: '', duration: '', maxEvents: '', maxPhotos: '', acceptVideo: false, maxVideos: '', active: true });

function resetForm() {
  editingId.value = null;
  form.value = { name: '', description: '', price: '', duration: '', maxEvents: '', maxPhotos: '', acceptVideo: false, maxVideos: '', active: true };
}
async function loadPlans() {
  const result = await getPlans.execute({ token: auth.session?.token });
  if (result instanceof Failure) { error.value = result.message; return; }
  plans.value = result;
}
watch(() => auth.session?.token, async (token, oldToken, onCleanup) => {
  if (!import.meta.client) return;
  let cancelled = false;
  onCleanup(() => { cancelled = true; });
  resetForm(); plans.value = []; error.value = ''; notice.value = ''; deleting.value = null;
  loading.value = false;
  if (!token) { error.value = 'Connectez-vous pour gérer les plans d’abonnement.'; return; }
  loading.value = true;
  const result = await getPlans.execute({ token });
  if (cancelled) return;
  if (result instanceof Failure) error.value = result.message;
  else plans.value = result;
  loading.value = false;
}, { immediate: true });

async function edit(plan: SubscriptionPlan) {
  busy.value = true; error.value = ''; notice.value = '';
  const result = await showPlan.execute({ token: auth.session?.token ?? '', id: plan.id });
  busy.value = false;
  if (result instanceof Failure) { error.value = result.message; return; }
  editingId.value = result.id;
  form.value = {
    name: result.name, description: result.description ?? '', price: result.price,
    duration: result.durationDays === null ? '' : String(result.durationDays),
    maxEvents: result.maxEvents === null ? '' : String(result.maxEvents),
    maxPhotos: result.maxPhotos === null ? '' : String(result.maxPhotos),
    acceptVideo: result.acceptVideo,
    maxVideos: result.maxVideos === null ? '' : String(result.maxVideos), active: result.isActive,
  };
}
async function save() {
  if (busy.value) return;
  busy.value = true; error.value = ''; notice.value = '';
  const data = {
    name: form.value.name, description: form.value.description || null, price: String(form.value.price),
    duration_days: form.value.duration === '' ? null : Number(form.value.duration),
    max_events: form.value.maxEvents === '' ? null : Number(form.value.maxEvents),
    max_photos: form.value.maxPhotos === '' ? null : Number(form.value.maxPhotos),
    accept_video: form.value.acceptVideo,
    max_videos: form.value.maxVideos === '' ? null : Number(form.value.maxVideos), is_active: form.value.active,
  };
  if (editingId.value === null) {
    const result = await createPlan.execute({ token: auth.session?.token ?? '', data });
    if (result instanceof Failure) { error.value = result.message; busy.value = false; return; }
    notice.value = result;
  } else {
    const result = await updatePlan.execute({ token: auth.session?.token ?? '', id: editingId.value, data });
    if (result instanceof Failure) { error.value = result.message; busy.value = false; return; }
    notice.value = 'Plan d’abonnement mis à jour.';
  }
  resetForm();
  await loadPlans();
  busy.value = false;
}
async function toggleActive(plan: SubscriptionPlan) {
  busy.value = true; error.value = ''; notice.value = '';
  const result = await updatePlan.execute({ token: auth.session?.token ?? '', id: plan.id, data: { is_active: !plan.isActive } });
  if (result instanceof Failure) { error.value = result.message; busy.value = false; return; }
  if (editingId.value === plan.id) form.value.active = result.isActive;
  await loadPlans(); busy.value = false;
}
async function remove() {
  if (!deleting.value || busy.value) return;
  busy.value = true; error.value = ''; notice.value = '';
  const id = deleting.value.id;
  const result = await deletePlan.execute({ token: auth.session?.token ?? '', id });
  if (result instanceof Failure) { error.value = result.message; busy.value = false; return; }
  notice.value = result; deleting.value = null;
  if (editingId.value === id) resetForm();
  await loadPlans(); busy.value = false;
}
</script>
<template>
  <div>
    <p v-if="error" role="alert">{{ error }}</p>
    <p v-if="notice" role="status">{{ notice }}</p>
    <div class="plan-grid">
      <section class="card">
        <h2>{{ editingId === null ? 'Créer un plan d’abonnement' : 'Modifier le plan d’abonnement' }}</h2>
        <p>Définissez une offre et ses limites d’utilisation.</p>
        <form novalidate @submit.prevent="save" :aria-busy="busy">
          <div class="fields">
            <Input v-model="form.name" class="full" label="Nom du plan" required :disabled="busy || loading" />
            <label class="description full">Description<textarea v-model="form.description" rows="3" :disabled="busy || loading" /></label>
            <Input v-model="form.price" type="number" label="Prix" required :disabled="busy || loading" />
            <Input v-model="form.duration" type="number" label="Durée (jours, facultatif)" :disabled="busy || loading" />
            <Input v-model="form.maxEvents" type="number" label="Événements maximum" placeholder="Illimité" :disabled="busy || loading" />
            <Input v-model="form.maxPhotos" type="number" label="Photos maximum" placeholder="Illimité" :disabled="busy || loading" />
            <Input v-model="form.maxVideos" type="number" label="Vidéos maximum" :disabled="busy || loading" />
          </div>
          <label class="check"><input v-model="form.acceptVideo" type="checkbox" :disabled="busy || loading" />Vidéos autorisées</label>
          <label class="check"><input v-model="form.active" type="checkbox" :disabled="busy || loading" />Plan actif</label>
          <div class="head">
            <Button class="compact" :label="busy ? 'Enregistrement…' : editingId === null ? 'Créer le plan' : 'Enregistrer'" type="submit" :disabled="busy || loading" />
            <Button v-if="editingId !== null" class="compact light" label="Annuler" :on-click="resetForm" :disabled="busy || loading" />
          </div>
        </form>
      </section>
      <section class="card">
        <h2>Plans disponibles</h2><p>Les offres de votre catalogue.</p>
        <p v-if="loading" role="status">Chargement des plans…</p>
        <p v-if="!loading && !error && !plans.length">Aucun plan disponible.</p>
        <article v-for="plan in plans" :key="plan.id" class="plan">
          <div class="head"><strong>{{ plan.name }}</strong><span class="pill">{{ plan.isActive ? 'Actif' : 'Inactif' }}</span></div>
          <p class="price">{{ plan.price }} <small v-if="plan.durationDays !== null">/ {{ plan.durationDays }} jours</small></p>
          <p>{{ plan.description }}</p>
          <p>{{ plan.maxEvents ?? 'Illimité' }} événements · {{ plan.maxPhotos ?? 'Illimité' }} photos</p>
          <p>{{ plan.acceptVideo ? 'Vidéos autorisées : ' + (plan.maxVideos ?? 'Illimité') : 'Vidéos non autorisées' }}</p>
          <div class="plan-actions">
            <Button class="compact light" label="Modifier" :disabled="busy || loading" :on-click="() => edit(plan)" />
            <Button class="compact light" :label="plan.isActive ? 'Désactiver' : 'Activer'" :disabled="busy || loading" :on-click="() => toggleActive(plan)" />
            <Button class="compact danger" label="Supprimer" :disabled="busy || loading" :on-click="() => deleting = plan" />
          </div>
        </article>
      </section>
    </div>
    <ManagerDialog :open="!!deleting" title="Supprimer définitivement ce plan ?" @close="!busy && (deleting = null)">
      <p>{{ deleting?.name }}</p>
      <p v-if="error" role="alert">{{ error }}</p>
      <div class="head">
        <Button class="compact light" label="Annuler" :disabled="busy" :on-click="() => deleting = null" />
        <Button class="compact danger" label="Supprimer définitivement" :disabled="busy" :on-click="remove" />
      </div>
    </ManagerDialog>
  </div>
</template>
<style scoped>
.card { background:v-bind('colors.surface'); border:1px solid v-bind('colors.border'); border-radius:20px; padding:26px; margin-bottom:24px; }
h2 { margin:0 0 8px; font-size:20px; color:v-bind('colors.textPrimary'); }
p,small { color:v-bind('colors.textSecondary'); line-height:1.7; font-size:13px; }
.head { display:flex; justify-content:space-between; align-items:center; gap:16px; flex-wrap:wrap; }
.pill { display:inline-block; border-radius:8px; padding:5px 10px; background:v-bind('colors.infoLight'); color:v-bind('colors.primary'); font-size:12px; font-weight:600; }
.pill.free { background:v-bind('colors.successLight'); color:v-bind('colors.success'); }
.compact { width:auto; padding:0 18px; height:42px; font-size:13px; }
.light { background:v-bind('colors.surface'); color:v-bind('colors.textPrimary'); border:1px solid v-bind('colors.border'); }
.danger { background:v-bind('colors.dangerLight'); color:v-bind('colors.danger'); border:1px solid v-bind('colors.danger'); }
.table-wrap { overflow-x:auto; }
table { width:100%; border-collapse:collapse; white-space:nowrap; }
th { padding:14px; text-align:left; font-size:11px; text-transform:uppercase; color:v-bind('colors.textSecondary'); background:v-bind('colors.backgroundLight'); }
td { padding:17px 14px; border-bottom:1px solid v-bind('colors.borderLight'); font-size:13px; color:v-bind('colors.textPrimary'); }
td small { display:block; margin-top:4px; }
.empty { text-align:center; padding:40px; }
@media(max-width:480px) { .card { padding:18px; } }

.plan-grid { display:grid; grid-template-columns:1.4fr 1fr; gap:24px; align-items:start; }
.fields { display:grid; grid-template-columns:1fr 1fr; gap:24px 20px; margin:28px 0; }
.full { grid-column:1/-1; }
.description { display:flex; flex-direction:column; gap:8px; font-size:13px; }
textarea { font:inherit; padding:12px; border:1px solid v-bind('colors.border'); border-radius:12px; background:v-bind('colors.surface'); color:v-bind('colors.textPrimary'); resize:vertical; }
.check { display:flex; align-items:center; gap:10px; margin-bottom:24px; font-size:14px; }
.check input { accent-color:v-bind('colors.primary'); }
.plan { padding:20px 0; border-bottom:1px solid v-bind('colors.borderLight'); }
.price { font-size:24px; font-weight:700; color:v-bind('colors.textPrimary'); }
@media(max-width:900px) { .plan-grid { grid-template-columns:1fr; } }
@media(max-width:480px) { .fields { grid-template-columns:1fr; } }
.compact:hover { background: v-bind('colors.primary'); box-shadow: none; transform: none; }
.compact.light:hover { background: v-bind('colors.surface'); }
.compact.danger:hover { background: v-bind('colors.dangerLight'); }
.compact.tab:hover { background: var(--app-transparent); }
.compact.tab.chosen:hover { background: v-bind('colors.surface'); box-shadow: 0 2px 8px var(--app-navyAlpha0D); }
.plan-actions { display: flex; flex-wrap: wrap; gap: 8px; }
.compact.danger:hover { background: v-bind('colors.dangerLight'); }
</style>
