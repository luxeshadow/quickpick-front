<script setup lang="ts">
import { ref, watch } from 'vue';
import Input from '../../../../core/components/other/Input.vue';
import Button from '../../../../core/components/other/Button.vue';
import { Failure } from '../../../../core/error/failure';
import { useAuthStore } from '../../../auth/presentation/store/auth_store';
import { UpdateMyProfileUseCase } from '../../application/usecases/update_my_profile_usecase';
import { UpdateMyProfileRepositoryImpl } from '../../data/repositories/update_my_profile_repository_impl';
import type { UpdateMyProfileParam } from '../../application/params/update_my_profile_param';
const auth = useAuthStore();
const updateProfile = new UpdateMyProfileUseCase(new UpdateMyProfileRepositoryImpl());
const form = ref({ full_name: '', email: '', phone: '' });
const saved = ref({ full_name: '', email: '', phone: '' });
const busy = ref(false);
const error = ref('');
const notice = ref('');
watch(() => auth.session?.user, user => {
  saved.value = {
    full_name: typeof user?.full_name === 'string' ? user.full_name : '',
    email: typeof user?.email === 'string' ? user.email : '',
    phone: typeof user?.phone === 'string' ? user.phone : '',
  };
  form.value = { ...saved.value };
}, { immediate: true });
function reset() { form.value = { ...saved.value }; error.value = ''; notice.value = ''; }
async function save() {
  if (busy.value) return;
  error.value = ''; notice.value = '';
  const data: UpdateMyProfileParam['data'] = {};
  if (form.value.full_name !== saved.value.full_name) data.full_name = form.value.full_name;
  if (form.value.email !== saved.value.email) data.email = form.value.email;
  if (form.value.phone !== saved.value.phone) data.phone = form.value.phone || null;
  if (!Object.keys(data).length) { notice.value = 'Aucune modification à enregistrer.'; return; }
  const token = auth.session?.token ?? '';
  busy.value = true;
  const result = await updateProfile.execute({ token, data });
  busy.value = false;
  if (!auth.session || auth.session.token !== token) return;
  if (result instanceof Failure) { error.value = result.message; return; }
  auth.setSession({ token, user: {
    ...auth.session.user,
    id: result.user.id,
    full_name: result.user.full_name,
    email: result.user.email,
    phone: result.user.phone,
    status: result.user.status,
    registered_at: result.user.registered_at,
    email_verified_at: result.user.email_verified_at,
  } });
  notice.value = result.message;
}
</script>
<template>
  <section>
    <header class="section-header"><div class="section-title"><h2>Votre profil.</h2><p>Vos coordonnées personnelles.</p></div></header>
    <p v-if="error" role="alert">{{ error }}</p>
    <p v-if="notice" role="status">{{ notice }}</p>
    <form class="profile-editor" novalidate @submit.prevent="save" :aria-busy="busy">
      <div class="profile-form-section">
        <div class="profile-section-heading">
          <span class="profile-section-icon"><i class="fi fi-rr-user" aria-hidden="true" /></span>
          <div><h3>Informations personnelles</h3><p>Les informations pour vous identifier et vous contacter.</p></div>
        </div>
        <div class="profile-fields">
          <Input v-model="form.full_name" label="Nom complet" :disabled="busy || !auth.session" />
          <Input v-model="form.email" type="email" label="Adresse e-mail" :disabled="busy || !auth.session" />
          <Input v-model="form.phone" type="tel" label="Téléphone (facultatif)" :disabled="busy || !auth.session" />
        </div>
      </div>
      <footer class="profile-form-footer">
        <div>
          <Button label="Annuler" class="profile-reset" :on-click="reset" :disabled="busy" />
          <Button :label="busy ? 'Enregistrement…' : 'Enregistrer'" :loading="busy" icon="fi fi-rr-disk" type="submit" :disabled="busy || !auth.session" />
        </div>
      </footer>
    </form>
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
.profile-editor {
  max-width: 960px;
  background: var(--app-surface);
  border: 1px solid var(--app-border);
  border-radius: 22px;
  box-shadow: 0 8px 28px var(--app-navyAlpha04);
  overflow: hidden;
}
.profile-form-section {
  padding: 30px 32px;
}
.profile-form-section + .profile-form-section {
  border-top: 1px solid var(--app-borderLight);
}
.profile-section-heading {
  display: flex;
  align-items: center;
  gap: 13px;
  margin-bottom: 26px;
}
.profile-section-icon {
  display: grid;
  place-items: center;
  width: 42px;
  height: 42px;
  flex-shrink: 0;
  border-radius: 13px;
  background: var(--app-infoLight);
  color: var(--app-primary);
  font-size: 18px;
}
.profile-section-heading h3 {
  font-size: 15px;
  font-weight: 600;
  margin: 0 0 5px;
}
.profile-section-heading p {
  font-size: 12px;
  color: var(--app-textSecondary);
  margin: 0;
  line-height: 1.5;
}
.profile-fields {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 22px;
}
.profile-field {
  display: flex;
  flex-direction: column;
  gap: 9px;
  min-width: 0;
}
.profile-field > span {
  font-size: 12px;
  font-weight: 500;
  color: var(--app-textPrimary);
}
.profile-field small {
  font-size: 10px;
  color: var(--app-textMuted);
  margin-left: 8px;
  font-weight: 400;
}
.profile-field input {
  width: 100%;
  min-width: 0;
  min-height: 48px;
  padding: 12px 14px;
  border: 1px solid var(--app-border);
  background: var(--app-surfaceSoft);
  border-radius: 11px;
  font:
    400 13px Inter,
    sans-serif;
  color: var(--app-textPrimary);
  transition:
    border-color 0.2s,
    box-shadow 0.2s;
}
.profile-field input:focus {
  outline: 0;
  border-color: var(--app-primary);
  box-shadow: 0 0 0 3px var(--app-primaryAlpha12);
  background: var(--app-surface);
}
.profile-field-wide {
  grid-column: 1/-1;
}
.profile-form-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18px;
  padding: 22px 32px;
  background: var(--app-backgroundLight);
  border-top: 1px solid var(--app-borderLight);
}
.profile-form-footer > div {
  display: flex;
  align-items: center;
  gap: 12px;
}
.profile-form-footer p {
  font-size: 11px;
  color: var(--app-textSecondary);
  margin: 0;
}
.profile-reset {
  min-height: 42px;
  padding: 0 16px;
  border: 1px solid var(--app-border);
  border-radius: 12px;
  background: var(--app-surface);
  color: var(--app-textSecondary);
  font:
    500 12px Inter,
    sans-serif;
}
.whatsapp-contact {
  position: fixed;
  bottom: max(24px, env(safe-area-inset-bottom));
  right: 24px;
  z-index: 60;
  display: grid;
  place-items: center;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: var(--app-surface);
  box-shadow: 0 5px 20px var(--app-navyAlpha20);
  text-decoration: none;
  animation: whatsapp-pulse 3s ease-out infinite;
}
.whatsapp-contact img {
  width: 44px;
  height: 44px;
  object-fit: contain;
}
.whatsapp-contact:hover {
  animation: none;
  transform: translateY(-3px);
}
.whatsapp-contact:focus-visible {
  outline: 3px solid var(--app-primary);
  outline-offset: 5px;
}
.whatsapp-contact .whatsapp-fallback {
  display: none;
  color: var(--app-success);
  font-size: 24px;
}
@keyframes whatsapp-pulse {
  0%,
  65%,
  100% {
    box-shadow:
      0 5px 20px var(--app-navyAlpha20),
      0 0 0 0 var(--app-successAlpha00);
  }
  20% {
    box-shadow:
      0 5px 20px var(--app-navyAlpha20),
      0 0 0 10px var(--app-successAlpha20);
  }
  45% {
    box-shadow:
      0 5px 20px var(--app-navyAlpha20),
      0 0 0 18px var(--app-successAlpha00);
  }
}
.content {
  padding-bottom: 100px;
}
@media (max-width: 640px) {
  .profile-form-section {
    padding: 24px 20px;
  }
  .profile-fields {
    grid-template-columns: 1fr;
    gap: 18px;
  }
  .profile-field input {
    font-size: 16px;
  }
  .profile-form-footer {
    padding: 20px;
    align-items: stretch;
    flex-direction: column;
  }
  .profile-form-footer > div {
    justify-content: flex-end;
  }
  .whatsapp-contact {
    right: 17px;
    bottom: max(18px, env(safe-area-inset-bottom));
    width: 50px;
    height: 50px;
  }
  .whatsapp-contact img {
    width: 40px;
    height: 40px;
  }
}
@media (prefers-reduced-motion: reduce) {
  .whatsapp-contact {
    animation: none;
  }
  .profile-field input {
    transition: none;
  }
}

.profile-form-footer :deep(.app-button) {
  width: auto;
  min-width: 110px;
  padding-inline: 18px;
}

.profile-form-footer :deep(.profile-reset) {
  background: var(--app-surface);
  color: var(--app-textSecondary);
  border: 1px solid var(--app-border);
}

.profile-form-footer :deep(.app-button:focus-visible) {
  outline: 2px solid var(--app-primary);
  outline-offset: 3px;
}
.profile-form-footer :deep(.profile-reset:hover) {
  background: var(--app-background);
  color: var(--app-textPrimary);
  border-color: var(--app-border);
  box-shadow: none;
  transform: none;
}
</style>
