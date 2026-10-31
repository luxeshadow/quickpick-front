<script setup lang="ts">
import LoadingSpinner from '../../../../core/components/other/LoadingSpinner.vue';
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from '#imports';
import Input from '../../../../core/components/other/Input.vue';
import Button from '../../../../core/components/other/Button.vue';
import ManagerDialog from '../../../../core/components/other/ManagerDialog.vue';
import { AppColors } from '../../../../core/constants/app_colors';
import { Failure } from '../../../../core/error/failure';
import { useAuthStore } from '../../../auth/presentation/store/auth_store';
import type { User } from '../../domain/entities/user';
import { GetUsersUseCase } from '../../application/usecases/get_users_usecase';
import { GetUsersRepositoryImpl } from '../../data/repositories/get_users_repository_impl';
import { SearchUsersUseCase } from '../../application/usecases/search_users_usecase';
import { SearchUsersRepositoryImpl } from '../../data/repositories/search_users_repository_impl';
import { ShowUserUseCase } from '../../application/usecases/show_user_usecase';
import { ShowUserRepositoryImpl } from '../../data/repositories/show_user_repository_impl';
import { DeleteUserUseCase } from '../../application/usecases/delete_user_usecase';
import { DeleteUserRepositoryImpl } from '../../data/repositories/delete_user_repository_impl';

const colors = AppColors;
const auth = useAuthStore();
const route = useRoute();
const router = useRouter();

const getUsers = new GetUsersUseCase(new GetUsersRepositoryImpl());
const findUsers = new SearchUsersUseCase(new SearchUsersRepositoryImpl());
const showUser = new ShowUserUseCase(new ShowUserRepositoryImpl());
const removeUser = new DeleteUserUseCase(new DeleteUserRepositoryImpl());

const users = ref<User[]>([]);
const selected = ref<User | null>(null);
const search = ref('');
const searchQuery = ref('');
const page = ref(1);
const lastPage = ref(1);
const total = ref(0);

const loading = ref(false);
const loadingDetail = ref(false);
const deleting = ref(false);
const confirming = ref(false);
const error = ref('');
const detailError = ref('');
const notice = ref('');

let usersRequestId = 0;
let detailRequestId = 0;

const selectedId = computed(() => {
  if (typeof route.query.user !== 'string') {
    return null;
  }

  const id = Number(route.query.user);

  if (!Number.isInteger(id) || id < 1) {
    return null;
  }

  return id;
});

async function loadUsers(requestedPage = page.value) {
  const requestId = ++usersRequestId;
  page.value = requestedPage;
  loading.value = true;
  error.value = '';
  users.value = [];
  total.value = 0;
  lastPage.value = 1;

  const params = {
    token: auth.session?.token ?? '',
    page: requestedPage,
    perPage: 20,
  };

  let result;

  if (searchQuery.value) {
    result = await findUsers.execute({
      ...params,
      search: searchQuery.value,
    });
  } else {
    result = await getUsers.execute(params);
  }

  if (requestId !== usersRequestId) {
    return;
  }

  loading.value = false;

  if (result instanceof Failure) {
    error.value = result.message;
    return;
  }

  users.value = result.users;
  total.value = result.pagination.total;
  lastPage.value = result.pagination.last_page;
}

function runSearch() {
  searchQuery.value = search.value.trim();
  loadUsers(1);
}

function openUser(id: number) {
  router.push({
    path: route.path,
    query: { ...route.query, user: String(id) },
  });
}

function closeDetail() {
  const query = { ...route.query };
  delete query.user;

  router.replace({ path: route.path, query });
}

async function loadUserDetail() {
  const requestId = ++detailRequestId;
  const id = selectedId.value;

  selected.value = null;
  detailError.value = '';
  confirming.value = false;
  loadingDetail.value = false;

  if (id === null) {
    return;
  }

  loadingDetail.value = true;

  const result = await showUser.execute({
    token: auth.session?.token ?? '',
    id,
  });

  if (requestId !== detailRequestId) {
    return;
  }

  loadingDetail.value = false;

  if (result instanceof Failure) {
    detailError.value = result.message;
    return;
  }

  selected.value = result;
}

async function deleteUser() {
  if (!selected.value || deleting.value) {
    return;
  }

  deleting.value = true;
  detailError.value = '';

  const result = await removeUser.execute({
    token: auth.session?.token ?? '',
    id: selected.value.id,
  });

  deleting.value = false;

  if (result instanceof Failure) {
    detailError.value = result.message;
    return;
  }

  confirming.value = false;
  notice.value = result;
  closeDetail();

  let nextPage = page.value;

  if (users.value.length === 1 && nextPage > 1) {
    nextPage--;
  }

  await loadUsers(nextPage);
}

function refreshUsers() {
  loadUsers(1);
  loadUserDetail();
}

watch(selectedId, loadUserDetail);
watch(() => auth.session?.token, refreshUsers);
onMounted(refreshUsers);

onBeforeUnmount(() => {
  usersRequestId++;
  detailRequestId++;
});
</script>
<template>
  <p v-if="notice" role="status">{{ notice }}</p>
  <section v-if="selectedId === null" class="card">
    <div class="head"><div><h2>Utilisateurs</h2><p>Consultez les comptes et leur activité.</p></div><span class="pill">{{ total }} utilisateurs</span></div>
    <form class="toolbar" @submit.prevent="runSearch">
      <Input v-model="search" class="search" type="search" label="Rechercher" placeholder="Nom ou e-mail" prefix-icon="fi fi-rr-search" />
      <Button class="compact" label="Rechercher" type="submit" :disabled="loading" />
    </form>
    <LoadingSpinner v-if="loading" label="Chargement des utilisateurs" />
    <p v-if="error" role="alert">{{ error }}</p>
    <div v-if="!loading && !error" class="table-wrap desktop-users">
      <table><thead><tr><th>Utilisateur</th><th>Abonnement actif</th><th>Événements</th><th>Total médias</th><th>Action</th></tr></thead>
        <tbody><tr v-for="user in users" :key="user.id">
          <td><strong>{{ user.full_name }}</strong><small>{{ user.email }}</small></td>
          <td><span class="pill">{{ user.current_subscription?.subscription_plan.name ?? 'Aucun abonnement actif' }}</span></td>
          <td>{{ user.statistics?.events }}</td><td>{{ user.statistics?.total_media }}</td>
          <td><Button class="compact light" label="Voir le détail" :on-click="() => openUser(user.id)" /></td>
        </tr><tr v-if="!users.length"><td colspan="5" class="empty">Aucun utilisateur trouvé.</td></tr></tbody>
      </table>
    </div>
    <div v-if="!loading && !error" class="mobile-users">
      <article v-for="user in users" :key="user.id" class="mobile-user">
        <div class="mobile-user-body">
          <div class="mobile-user-heading"><Button class="user-name" :label="user.full_name" :on-click="() => openUser(user.id)" /><span class="pill">{{ user.current_subscription?.subscription_plan.name ?? 'Aucun abonnement actif' }}</span></div>
          <p class="user-email">{{ user.email }}</p>
          <div class="mobile-user-footer"><span>{{ user.statistics?.events }} événements</span><span>{{ user.statistics?.total_media }} médias</span></div>
        </div>
      </article>
      <p v-if="!users.length" class="empty">Aucun utilisateur trouvé.</p>
    </div>
    <nav v-if="lastPage > 1 && !error" class="user-pagination" aria-label="Pagination des utilisateurs">
      <Button class="compact light" label="Précédent" :disabled="loading || page <= 1" :on-click="() => loadUsers(page - 1)" />
      <span>Page {{ page }} / {{ lastPage }}</span>
      <Button class="compact light" label="Suivant" :disabled="loading || page >= lastPage" :on-click="() => loadUsers(page + 1)" />
    </nav>
  </section>
  <section v-else>
    <nav class="detail-breadcrumb" aria-label="Fil d’Ariane"><Button label="Utilisateurs" class="breadcrumb-back" :disabled="deleting" :on-click="closeDetail" /><span>Détail</span></nav>
    <LoadingSpinner v-if="loadingDetail" label="Chargement de l’utilisateur" />
    <p v-if="detailError" role="alert">{{ detailError }}</p>
    <template v-if="selected">
      <div class="card">
        <div class="head"><div><h2>{{ selected.full_name }}</h2><p>{{ selected.email }} · {{ selected.phone ?? 'Téléphone non renseigné' }}</p><p>Inscrit le {{ new Date(selected.registered_at).toLocaleDateString('fr-FR') }}</p><p>{{ selected.status }} · {{ selected.roles?.join(', ') }}</p></div><span class="pill">{{ selected.current_subscription?.subscription_plan.name ?? 'Aucun abonnement actif' }}</span></div>
        <p>Email vérifié : {{ selected.email_verified_at ? new Date(selected.email_verified_at).toLocaleDateString('fr-FR') : 'Non' }}</p>
        <div class="stats">
          <div><small>Événements</small><strong>{{ selected.statistics?.events }}</strong></div>
          <div><small>Photos</small><strong>{{ selected.statistics?.photos }}</strong></div>
          <div><small>Vidéos</small><strong>{{ selected.statistics?.videos }}</strong></div>
          <div><small>Total médias</small><strong>{{ selected.statistics?.total_media }}</strong></div>
        </div>
        <h2 class="events-title">Événements</h2>
        <div class="table-wrap"><table><thead><tr><th>Événement</th><th>Photos</th><th>Vidéos</th><th>Total médias</th></tr></thead><tbody>
          <tr v-for="event in selected.events" :key="event.id"><td><strong>{{ event.name }}</strong><small>{{ event.event_date ? new Date(event.event_date).toLocaleDateString('fr-FR') : '' }}</small></td><td>{{ event.photos_count }}</td><td>{{ event.videos_count }}</td><td>{{ event.total_media }}</td></tr>
          <tr v-if="!selected.events?.length"><td colspan="4">Aucun événement.</td></tr>
        </tbody></table></div>
      </div>
      <div class="card"><h2>Historique des abonnements</h2>
        <article v-for="subscription in selected.subscriptions" :key="subscription.id" class="history-item"><strong>{{ subscription.subscription_plan.name }}</strong><p>{{ subscription.status }} · {{ new Date(subscription.starts_at).toLocaleDateString('fr-FR') }} — {{ subscription.ends_at ? new Date(subscription.ends_at).toLocaleDateString('fr-FR') : 'Sans date de fin' }}</p></article>
        <p v-if="!selected.subscriptions?.length">Aucun abonnement.</p>
      </div>
      <div class="card"><h2>Historique des paiements</h2>
        <article v-for="payment in selected.payments" :key="payment.id" class="history-item"><strong>{{ payment.amount }} {{ payment.currency }}</strong><p>{{ payment.status }} · {{ payment.provider }} · {{ payment.payment_method }}</p><p>{{ payment.external_reference }}<span v-if="payment.paid_at"> · {{ new Date(payment.paid_at).toLocaleDateString('fr-FR') }}</span></p></article>
        <p v-if="!selected.payments?.length">Aucun paiement.</p>
      </div>
      <div class="card head"><div><h2>Supprimer l’utilisateur</h2><p>Supprimer définitivement ce compte.</p></div><Button label="Supprimer l’utilisateur" class="compact danger" :disabled="deleting" :on-click="() => confirming = true" /></div>
    </template>
  </section>
  <ManagerDialog :open="confirming" title="Supprimer définitivement cet utilisateur ?" @close="!deleting && (confirming = false)">
    <p>Le compte de {{ selected?.full_name }} sera supprimé.</p>
    <p v-if="detailError" role="alert">{{ detailError }}</p>
    <div class="dialog-actions"><Button label="Annuler" class="compact light" :disabled="deleting" :on-click="() => confirming = false" /><Button :label="deleting ? 'Suppression…' : 'Supprimer'" :loading="deleting" class="compact danger" :disabled="deleting" :on-click="deleteUser" /></div>
  </ManagerDialog>
</template>
<style scoped>
.card {
  background:v-bind('colors.surface');
  border:1px solid v-bind('colors.border');
  border-radius:20px;
  padding:26px;
  margin-bottom:24px;
}
h2 {
  margin:0 0 8px;
  font-size:20px;
  color:v-bind('colors.textPrimary');
}
p,small {
  color:v-bind('colors.textSecondary');
  line-height:1.7;
  font-size:13px;
}
.head {
  display:flex;
  justify-content:space-between;
  align-items:center;
  gap:16px;
  flex-wrap:wrap;
}
.pill {
  display:inline-block;
  border-radius:8px;
  padding:5px 10px;
  background:v-bind('colors.infoLight');
  color:v-bind('colors.primary');
  font-size:12px;
  font-weight:600;
}
.pill.free {
  background:v-bind('colors.successLight');
  color:v-bind('colors.success');
}
.compact {
  width:auto;
  padding:0 18px;
  height:42px;
  font-size:13px;
}
.light {
  background:v-bind('colors.surface');
  color:v-bind('colors.textPrimary');
  border:1px solid v-bind('colors.border');
}
.danger {
  background:v-bind('colors.dangerLight');
  color:v-bind('colors.danger');
  border:1px solid v-bind('colors.danger');
}
.table-wrap {
  overflow-x:auto;
}
table {
  width:100%;
  border-collapse:collapse;
  white-space:nowrap;
}
th {
  padding:14px;
  text-align:left;
  font-size:11px;
  text-transform:uppercase;
  color:v-bind('colors.textSecondary');
  background:v-bind('colors.backgroundLight');
}
td {
  padding:17px 14px;
  border-bottom:1px solid v-bind('colors.borderLight');
  font-size:13px;
  color:v-bind('colors.textPrimary');
}
td small {
  display:block;
  margin-top:4px;
}
.empty {
  text-align:center;
  padding:40px;
}
@media(max-width:480px) {
  .card {
    padding:18px;
  }
}
.toolbar {
  display:flex;
  justify-content:space-between;
  gap:20px;
  align-items:center;
  flex-wrap:wrap;
  margin:28px 0;
}
.tabs {
  display:flex;
  gap:6px;
  padding:5px;
  border-radius:12px;
  background:v-bind('colors.background');
}
.tab {
  background:var(--app-transparent);
  color:v-bind('colors.textSecondary');
}
.tab.chosen {
  background:v-bind('colors.surface');
  color:v-bind('colors.primary');
  box-shadow:0 2px 8px var(--app-navyAlpha0D);
}
.search {
  max-width:320px;
}
.back {
  margin-bottom:20px;
}
.stats {
  display:grid;
  grid-template-columns:repeat(4,1fr);
  gap:16px;
  margin:24px 0;
}
.stats>div {
  padding:20px;
  border:1px solid v-bind('colors.border');
  border-radius:14px;
  background:v-bind('colors.surfaceSoft');
}
.stats strong {
  display:block;
  font-size:27px;
  margin-top:8px;
}
.dialog-actions {
  display:flex;
  gap:12px;
  justify-content:flex-end;
  margin-top:24px;
}
@media(max-width:700px) {
  .stats {
    grid-template-columns:1fr 1fr;
  }
  .search {
    max-width:none;
  }
}
.compact:hover {
  background: v-bind('colors.primary');
  box-shadow: none;
  transform: none;
}
.compact.light:hover {
  background: v-bind('colors.surface');
}
.compact.danger:hover {
  background: v-bind('colors.dangerLight');
}
.compact.tab:hover {
  background: var(--app-transparent);
}
.compact.tab.chosen:hover {
  background: v-bind('colors.surface');
  box-shadow: 0 2px 8px var(--app-navyAlpha0D);
}
.mobile-users {
  display: none;
}
@media (max-width: 700px) {
  .card {
    padding: 0;
    border: 0;
    border-radius: 0;
    background: var(--app-transparent);
    margin-bottom: 24px;
  }
  .desktop-users {
    display: none;
  }
  .mobile-users {
    display: block;
  }
  .toolbar {
    gap: 20px;
    margin: 24px 0 12px;
  }
  .tabs {
    width: 100%;
  }
  .tab {
    flex: 1;
    padding: 0 10px;
  }
  .search {
    width: 100%;
  }
  .mobile-user {
    padding: 16px 0;
    border-bottom: 1px solid v-bind('colors.border');
    cursor: pointer;
  }
  .mobile-user-heading, .mobile-user-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
  }
  .user-name, .user-name:hover, .user-name:active {
    width: auto;
    height: auto;
    padding: 0;
    justify-content: flex-start;
    text-align: left;
    background: var(--app-transparent);
    color: v-bind('colors.textPrimary');
    font-size: 14px;
    box-shadow: none;
    transform: none;
  }
  .user-email {
    margin: 6px 0;
    overflow-wrap: anywhere;
  }
  .mobile-user-footer {
    color: v-bind('colors.textSecondary');
  }
  .head p {
    overflow-wrap: anywhere;
  }
  .stats {
    gap: 10px;
  }
  .stats > div {
    padding: 14px;
  }
  .stats strong {
    font-size: 23px;
  }
  .dialog-actions {
    flex-wrap: wrap;
  }
}

.back :deep(.button-icon), .back :deep(span) {
  display: inline-flex;
  align-items: center;
  line-height: 1;
}
.back :deep(.button-icon::before) {
  display: block;
  line-height: 1;
}
.mobile-events {
  display: none;
}
@media (max-width: 700px) {
  .back, .back:hover {
    padding: 0;
    border: 0;
    background: var(--app-transparent);
    color: v-bind('colors.primary');
    gap: 10px;
    margin-bottom: 20px;
  }
  .desktop-events {
    display: none;
  }
  .mobile-events {
    display: grid;
    gap: 12px;
    margin-top: 16px;
  }
  .events-title {
    font-size: 18px;
  }
  .event-summary {
    padding: 16px;
    background: v-bind('colors.surface');
    border: 1px solid v-bind('colors.borderLight');
    border-radius: 14px;
  }
  .event-heading {
    display: flex;
    align-items: center;
    gap: 12px;
  }
  .event-icon {
    display: grid;
    place-items: center;
    width: 38px;
    height: 38px;
    flex-shrink: 0;
    border-radius: 11px;
    color: v-bind('colors.primary');
    background: v-bind('colors.infoLight');
  }
  .event-heading h3 {
    margin: 0;
    font-size: 14px;
    line-height: 1.5;
    color: v-bind('colors.textPrimary');
  }
  .event-heading p {
    margin: 3px 0 0;
    font-size: 12px;
  }
  .event-numbers {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 8px;
    border-top: 1px solid v-bind('colors.borderLight');
    margin: 16px 0 0;
    padding-top: 14px;
  }
  .event-numbers dt {
    display: flex;
    align-items: center;
    gap: 5px;
    font-size: 11px;
    color: v-bind('colors.textSecondary');
  }
  .event-numbers dd {
    margin: 7px 0 0;
    font-size: 18px;
    font-weight: 700;
    color: v-bind('colors.textPrimary');
  }
}
.detail-breadcrumb {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 22px;
  font-size: 13px;
  line-height: 20px;
  color: v-bind('colors.textSecondary');
}
.breadcrumb-back,
.breadcrumb-back:hover,
.breadcrumb-back:active {
  width: auto;
  height: auto;
  padding: 0;
  border: 0;
  border-radius: 0;
  background: var(--app-transparent);
  color: v-bind('colors.primary');
  font-size: 13px;
  line-height: 20px;
  box-shadow: none;
  transform: none;
}

.breadcrumb-separator {
  display: inline-flex;
  align-items: center;
  font-size: 16px;
  line-height: 1;
}
.breadcrumb-separator::before { display: block; }
@media (max-width: 700px) {
  .mobile-users {
    display: grid;
    gap: 0;
  }
  .mobile-user {
    display: grid;
    grid-template-columns: minmax(0, 1fr) 14px;
    gap: 10px;
    align-items: start;
    padding: 20px 0;
  }
  .mobile-user-body { min-width: 0; }
  .mobile-user-heading { flex-wrap: wrap; gap: 6px 8px; }
  .mobile-user-heading .pill { padding: 3px 7px; font-size: 10px; border-radius: 6px; }
  .mobile-user-heading .user-name { font-size: 13px; line-height: 1.4; }
  .user-email { margin: 5px 0 12px; font-size: 11px; line-height: 1.5; }
  .mobile-user-footer { justify-content: flex-start; flex-wrap: wrap; gap: 6px 14px; font-size: 11px; }
  .mobile-user-footer span { display: inline-flex; align-items: center; gap: 6px; }
  .mobile-user-footer i { display: inline-flex; line-height: 1; font-size: 12px; }
  .user-chevron { align-self: center; display: flex; font-size: 18px; color: v-bind('colors.textMuted'); }
}
@media (max-width: 700px) {
  .toolbar {
    gap: 14px;
    margin: 18px 0 4px;
  }
  .tabs {
    gap: 22px;
    padding: 0;
    border-radius: 0;
    background: var(--app-transparent);
    border-bottom: 1px solid v-bind('colors.border');
  }
  .compact.tab,
  .compact.tab:hover {
    flex: none;
    height: 38px;
    padding: 0 0 9px;
    border-radius: 0;
    border-bottom: 2px solid var(--app-transparent);
    background: var(--app-transparent);
    box-shadow: none;
    color: v-bind('colors.textSecondary');
    font-size: 12px;
    font-weight: 500;
  }
  .compact.tab.chosen,
  .compact.tab.chosen:hover {
    background: var(--app-transparent);
    border-bottom-color: v-bind('colors.primary');
    color: v-bind('colors.primary');
    box-shadow: none;
    font-weight: 600;
  }
  .search :deep(.input-wrapper) {
    height: 40px;
    border-width: 1px;
    border-radius: 9px;
    box-shadow: none;
  }
  .search :deep(.input-field.has-prefix) {
    padding-left: 36px;
    padding-right: 10px;
    font-size: 14px;
  }
  .search :deep(.input-icon) {
    width: 32px;
    font-size: 14px;
  }
  .search :deep(.input-field.has-prefix ~ .input-label) {
    left: 34px;
    font-size: 12px;
  }
  .search.is-focused :deep(.input-label),
  .search.has-value :deep(.input-label) {
    left: 10px;
    font-size: 10px;
  }
}
.user-pagination { display: flex; align-items: center; justify-content: center; gap: 12px; margin-top: 20px; }
.history-item { padding: 16px 0; border-bottom: 1px solid v-bind('colors.borderLight'); }
</style>
