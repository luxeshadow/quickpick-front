<script setup lang="ts">
import { ref, watch } from 'vue';
import { Failure } from '../../../../core/error/failure';
import { useAuthStore } from '../../../auth/presentation/store/auth_store';
import type { AccessLink } from '../../domain/entities/access_link';
import ManagerDialog from '../../../../core/components/other/ManagerDialog.vue';
import Input from '../../../../core/components/other/Input.vue';
import Button from '../../../../core/components/other/Button.vue';
import { GetEventAccessLinksUseCase } from '../../application/usecases/get_event_access_links_usecase';
import { GetEventAccessLinksRepositoryImpl } from '../../data/repositories/get_event_access_links_repository_impl';
import { GenerateAccessLinkUseCase } from '../../application/usecases/generate_access_link_usecase';
import { GenerateAccessLinkRepositoryImpl } from '../../data/repositories/generate_access_link_repository_impl';
import { ShowAccessLinkUseCase } from '../../application/usecases/show_access_link_usecase';
import { ShowAccessLinkRepositoryImpl } from '../../data/repositories/show_access_link_repository_impl';
import { UpdateAccessLinkUseCase } from '../../application/usecases/update_access_link_usecase';
import { UpdateAccessLinkRepositoryImpl } from '../../data/repositories/update_access_link_repository_impl';
import { DeleteAccessLinkUseCase } from '../../application/usecases/delete_access_link_usecase';
import { DeleteAccessLinkRepositoryImpl } from '../../data/repositories/delete_access_link_repository_impl';

const props = defineProps<{ event: { id: number; name: string } | null }>();
const emit = defineEmits<{ close: [] }>();
const auth = useAuthStore();
const getLinks = new GetEventAccessLinksUseCase(new GetEventAccessLinksRepositoryImpl());
const generateLink = new GenerateAccessLinkUseCase(new GenerateAccessLinkRepositoryImpl());
const showLink = new ShowAccessLinkUseCase(new ShowAccessLinkRepositoryImpl());
const updateLink = new UpdateAccessLinkUseCase(new UpdateAccessLinkRepositoryImpl());
const deleteLink = new DeleteAccessLinkUseCase(new DeleteAccessLinkRepositoryImpl());

const links = ref<AccessLink[]>([]);
const busy = ref(false);
const error = ref('');
const notice = ref('');
const formOpen = ref(false);
const editing = ref<AccessLink | null>(null);
const expiresAt = ref('');
const maxScans = ref('');
const isActive = ref(true);
const deletingId = ref<number | null>(null);

async function copyLink(url: string) {
  notice.value = '';
  try {
    await navigator.clipboard.writeText(url);
    notice.value = 'Lien copié.';
  } catch {
    notice.value = 'Impossible de copier le lien.';
  }
}

watch(() => props.event?.id, async (eventId, oldId, onCleanup) => {
  let cancelled = false;
  onCleanup(() => { cancelled = true; });
  links.value = []; error.value = ''; notice.value = ''; formOpen.value = false; deletingId.value = null;
  if (!eventId) return;
  busy.value = true;
  const result = await getLinks.execute({ token: auth.session?.token ?? '', eventId });
  if (cancelled) return;
  if (result instanceof Failure) error.value = result.message;
  else links.value = result;
  busy.value = false;
});
function openCreate() {
  editing.value = null; expiresAt.value = ''; maxScans.value = ''; isActive.value = true;
  error.value = ''; formOpen.value = true;
}
async function openEdit(linkId: number) {
  busy.value = true; error.value = '';
  const result = await showLink.execute({ token: auth.session?.token ?? '', linkId });
  busy.value = false;
  if (result instanceof Failure) { error.value = result.message; return; }
  editing.value = result;
  expiresAt.value = result.expiresAt ? new Date(new Date(result.expiresAt).getTime() - new Date(result.expiresAt).getTimezoneOffset() * 60000).toISOString().slice(0, 16) : '';
  maxScans.value = result.maxScans === null ? '' : String(result.maxScans);
  isActive.value = result.isActive; formOpen.value = true;
}
async function save() {
  if (!props.event) return;
  busy.value = true; error.value = ''; notice.value = '';
  const values = { token: auth.session?.token ?? '', expiresAt: expiresAt.value ? new Date(expiresAt.value).toISOString() : undefined, maxScans: maxScans.value === '' ? null : Number(maxScans.value) };
  const result = editing.value
    ? await updateLink.execute({ ...values, linkId: editing.value.id, isActive: isActive.value })
    : await generateLink.execute({ ...values, eventId: props.event.id });
  busy.value = false;
  if (result instanceof Failure) { error.value = result.message; return; }
  const index = links.value.findIndex(link => link.id === result.id);
  if (index === -1) links.value.unshift(result); else links.value[index] = result;
  formOpen.value = false;
}
async function remove() {
  if (deletingId.value === null) return;
  const linkId = deletingId.value;
  busy.value = true; error.value = '';
  const result = await deleteLink.execute({ token: auth.session?.token ?? '', linkId });
  busy.value = false;
  if (result instanceof Failure) { error.value = result.message; return; }
  links.value = links.value.filter(link => link.id !== linkId);
  deletingId.value = null; notice.value = result;
}
</script>
<template>
  <ManagerDialog :open="!!event" title="Liens d’accès" @close="!busy && emit('close')">
    <p class="access-event">{{ event?.name }}</p>
    <p v-if="error" role="alert">{{ error }}</p>
    <p v-if="notice" role="status">{{ notice }}</p>
    <p v-if="busy" role="status">Chargement…</p>
    <Button v-if="!formOpen" class="access-generate" label="Générer un lien d’accès" icon="fi fi-rr-plus" :disabled="busy" :on-click="openCreate" />
    <form v-else class="access-form" @submit.prevent="save">
      <h4>{{ editing ? 'Modifier le lien' : 'Nouveau lien' }}</h4>
      <Input v-model="expiresAt" type="datetime-local" label="Expiration (facultatif)" :disabled="busy" />
      <Input v-model="maxScans" type="number" label="Nombre maximal de scans (facultatif)" placeholder="Sans limite" min="1" step="1" :disabled="busy" />
      <label v-if="editing"><input v-model="isActive" type="checkbox" :disabled="busy" /> Lien actif</label>
      <div class="dialog-actions">
        <Button class="create-cancel" label="Annuler" :disabled="busy" :on-click="() => formOpen = false" />
        <Button class="create-submit" :label="editing ? 'Enregistrer' : 'Générer'" type="submit" :disabled="busy" />
      </div>
    </form>
    <div class="access-heading"><h4>Liens déjà générés</h4><span>{{ links.length }}</span></div>
    <div class="access-list">
      <article v-for="link in links" :key="link.id" class="access-item">
        <div class="access-row"><span class="access-source">{{ link.source === 'automatic' ? 'Lien automatique' : 'Lien manuel' }}</span><span class="access-status" :class="{ inactive: !link.isActive }">{{ link.isActive ? 'Actif' : 'Inactif' }}</span></div>
        <div class="access-url-row">
          <a class="access-url" :href="link.publicUrl" target="_blank" rel="noopener noreferrer">{{ link.publicUrl }}</a>
          <button type="button" class="access-copy" aria-label="Copier le lien" title="Copier le lien" @click="copyLink(link.publicUrl)">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true">
              <rect x="8" y="8" width="12" height="12" rx="2" />
              <path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2" />
            </svg>
          </button>
        </div>
        <div class="access-details"><span>{{ link.expiresAt ? 'Expire le ' + new Date(link.expiresAt).toLocaleString('fr-FR') : 'Sans expiration' }}</span><span>{{ link.scansCount }} scans{{ link.maxScans === null ? ' · sans limite' : ' / ' + link.maxScans }}</span></div>
        <div class="access-delete-actions">
          <template v-if="deletingId === link.id">
            <p>Supprimer définitivement ce lien d’accès ?</p>
            <Button class="create-cancel" label="Annuler" :disabled="busy" :on-click="() => deletingId = null" />
            <Button class="access-delete" label="Confirmer" :disabled="busy" :on-click="remove" />
          </template>
          <template v-else>
            <Button class="create-cancel" label="Modifier" :disabled="busy" :on-click="() => openEdit(link.id)" />
            <Button class="access-delete" label="Supprimer" :disabled="busy" :on-click="() => deletingId = link.id" />
          </template>
        </div>
      </article>
    </div>
    <p v-if="!busy && !error && !links.length" class="access-empty">Aucun lien d’accès.</p>
  </ManagerDialog>
</template>
<style scoped>
.access-event { margin: 0 0 8px; color: var(--manager-text); font-size: 14px; font-weight: 600; }
.access-generate { margin: 18px 0; font-size: 13px; height: 44px; }
.access-form { display: grid; gap: 22px; padding: 18px 0; }
.access-form h4, .access-heading h4 { margin: 0; font-size: 13px; }
.access-heading { display: flex; align-items: center; gap: 8px; margin: 24px 0 12px; }
.access-heading > span { border-radius: 6px; padding: 3px 7px; background: var(--manager-bg); font-size: 11px; }
.access-list { display: grid; gap: 12px; }
.access-item { border: 1px solid var(--manager-border); border-radius: 12px; padding: 14px; min-width: 0; }
.access-row, .access-source, .access-details, .access-details > span { display: flex; align-items: center; gap: 8px; }
.access-row { justify-content: space-between; }
.access-source { font-size: 12px; font-weight: 600; }
.access-status { padding: 4px 7px; border-radius: 6px; background: var(--app-successSubtle); color: var(--app-successText); font-size: 10px; }
.access-status.inactive { background: var(--app-surfaceMuted); color: var(--app-textSecondary); }
.access-url { padding: 10px; border-radius: 7px; background: var(--app-background); overflow-wrap: anywhere; font-size: 11px; color: var(--app-textSlate); line-height: 1.6; }
.access-details { flex-wrap: wrap; justify-content: space-between; font-size: 10px; color: var(--app-textSecondary); gap: 10px; }
.access-empty { display: grid; justify-items: center; gap: 12px; padding: 28px 10px; border: 1px dashed var(--manager-border); border-radius: 12px; color: var(--app-textSecondary); font-size: 12px; text-align: center; }
.access-delete-actions { display: flex; justify-content: flex-end; align-items: center; flex-wrap: wrap; gap: 8px; margin-top: 14px; padding-top: 12px; border-top: 1px solid var(--manager-border); }
.access-delete-actions p { flex-basis: 100%; margin: 0 0 4px; font-size: 12px; color: var(--manager-text); }
.access-delete-actions .app-button { width: auto; min-height: 40px; height: auto; padding: 10px 12px; font-size: 12px; box-shadow: none; transform: none; }
.access-delete-actions .create-cancel { border: 1px solid var(--manager-border); color: var(--manager-text); background: var(--app-surface); }
.access-delete-actions .access-delete { background: var(--app-dangerSubtle); color: var(--app-dangerText); border: 1px solid var(--app-dangerBorder); }
.access-delete-actions .app-button:hover { box-shadow: none; transform: none; }

.access-url { display: block; }
.dialog-actions { display: flex; justify-content: flex-end; gap: 10px; }
.dialog-actions .app-button { width: auto; height: 44px; font-size: 13px; }
.dialog-actions .create-cancel { background: var(--app-surface); color: var(--manager-text); border: 1px solid var(--manager-border); box-shadow: none; }
.dialog-actions .create-cancel:hover { background: var(--app-background); box-shadow: none; transform: none; }
.dialog-actions .create-submit { background: var(--app-primary); color: var(--app-textOnPrimary); border: 1px solid var(--app-primary); }
.dialog-actions .create-submit:hover { background: var(--app-primaryHover); border-color: var(--app-primaryHover); }
.access-url-row { display: flex; align-items: center; gap: 8px; margin: 10px 0; }
.access-url-row .access-url { flex: 1; min-width: 0; }
.access-copy { display: grid; place-items: center; flex-shrink: 0; width: 36px; height: 36px; padding: 0; border: 1px solid var(--manager-border); border-radius: 8px; background: var(--app-surface); color: var(--app-primary); cursor: pointer; }
.access-copy:hover { background: var(--app-infoLight); }
</style>
