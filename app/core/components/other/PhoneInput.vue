<template>
  <div ref="root" class="phone-group" @keydown.esc.stop="closeCountries" @focusout="leaveCountries">
    <div class="phone-wrapper" :class="{ 'has-error': error }">
      <label :for="inputId" class="phone-label">{{ label }} <span>*</span></label>
      <button ref="countryTrigger" type="button" class="country-picker" aria-label="Choisir le pays et l’indicatif" :aria-expanded="countryOpen" @click="openCountries">
        <img v-if="!failedFlags[country]" :key="country" :src="selected.flag" @error="failedFlags[country] = true" referrerpolicy="no-referrer" alt="" width="24" height="17" />
        <span v-else class="country-code" aria-hidden="true">{{ country }}</span>
        <span aria-hidden="true">+{{ selected.dial }}</span>
        <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true"><path d="m3 4.5 3 3 3-3" fill="none" stroke="currentColor" stroke-width="1.5" /></svg>
      </button>
      <input :id="inputId" ref="input" v-model="nationalNumber" type="tel" name="phone"
        inputmode="tel" autocomplete="tel-national" :placeholder="placeholder"
        required :aria-invalid="!!error" :aria-describedby="error ? errorId : undefined"
        @input="updateNumber" @blur="formatNumber" />
    </div>
    <div v-if="countryOpen" class="country-menu">
      <Input v-model="countryQuery" label="Rechercher un pays" placeholder="Pays ou indicatif" prefix-icon="fi fi-rr-search" />
      <div class="country-list" role="group" aria-label="Pays et indicatifs">
        <button v-for="item in filteredCountries" :key="item.code" type="button" :class="{ selected: country === item.code }" :aria-pressed="country === item.code" @click="chooseCountry(item.code)">
          <img v-if="!failedFlags[item.code]" :src="item.flag" alt="" width="24" height="17" loading="lazy" @error="failedFlags[item.code] = true" />
          <span v-else class="country-code">{{ item.code }}</span><span class="country-name">{{ item.name }}</span><span class="dial">+{{ item.dial }}</span><i v-if="country === item.code" class="fi fi-rr-check" aria-hidden="true" />
        </button>
        <p v-if="!filteredCountries.length">Aucun pays trouvé.</p>
      </div>
    </div>
    <span v-if="error" :id="errorId" class="phone-error" role="alert">{{ error }}</span>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, useId, watch, nextTick, onMounted, onBeforeUnmount } from 'vue';
import { getCountries, getCountryCallingCode, parsePhoneNumberFromString } from 'libphonenumber-js/max';
import type { CountryCode } from 'libphonenumber-js';
import Input from './Input.vue';
import { AppColors } from '../../constants/app_colors';


const props = withDefaults(defineProps<{
  modelValue?: string;
  label?: string;
  placeholder?: string;
}>(), {
  modelValue: '',
  label: 'Phone',
  placeholder: 'Enter your phone number',
});

const colors = AppColors;
const emit = defineEmits<{ 'update:modelValue': [value: string] }>();
const country = ref<CountryCode>('CA');
const nationalNumber = ref('');
const input = ref<HTMLInputElement>();
const error = ref('');
const inputId = useId();
const errorId = `${inputId}-error`;
const names = new Intl.DisplayNames(['en'], { type: 'region' });
const failedFlags = ref<Partial<Record<CountryCode, boolean>>>({});
const countries = getCountries().map(code => ({
  code, name: names.of(code) || code, dial: getCountryCallingCode(code), flag: 'https://flagcdn.com/w40/' + code.toLowerCase() + '.png',
})).sort((a, b) => a.name.localeCompare(b.name, 'en'));
const selected = computed(() => countries.find(item => item.code === country.value)!);
const root = ref<HTMLElement>();
const countryTrigger = ref<HTMLButtonElement>();
const countryOpen = ref(false);
const countryQuery = ref('');
const filteredCountries = computed(() => {
  const query = countryQuery.value.trim().toLowerCase();
  return countries.filter(item => (item.name + ' ' + item.code + ' +' + item.dial).toLowerCase().includes(query));
});
async function openCountries() {
  countryOpen.value = !countryOpen.value;
  if (countryOpen.value) {
    countryQuery.value = '';
    await nextTick();
    root.value?.querySelector<HTMLInputElement>('.country-menu input')?.focus();
  }
}
function closeCountries() { countryOpen.value = false; countryTrigger.value?.focus(); }
function chooseCountry(code: CountryCode) { country.value = code; updateNumber(); closeCountries(); }
function leaveCountries(event: FocusEvent) { if (!root.value?.contains(event.relatedTarget as Node)) countryOpen.value = false; }
function outsideCountries(event: MouseEvent) { if (!root.value?.contains(event.target as Node)) countryOpen.value = false; }
onMounted(() => document.addEventListener('click', outsideCountries));
onBeforeUnmount(() => document.removeEventListener('click', outsideCountries));
const parsedNumber = () => parsePhoneNumberFromString(nationalNumber.value, { defaultCountry: country.value, extract: false });
let emittedValue: string | undefined;

function emitNumber(value: string) {
  emittedValue = value;
  emit('update:modelValue', value);
}

watch(() => props.modelValue, (value) => {
  if (value === emittedValue) {
    emittedValue = undefined;
    return;
  }
  const parsed = parsePhoneNumberFromString(value, { defaultCountry: country.value });
  if (parsed?.country) country.value = parsed.country;
  nationalNumber.value = parsed ? parsed.formatNational() : value;
  error.value = '';
  input.value?.setCustomValidity('');
}, { immediate: true });


function updateNumber() {
  error.value = '';
  input.value?.setCustomValidity('');
  const parsed = parsedNumber();
  // International paste/autofill may also identify a different country.
  if (nationalNumber.value.trim().startsWith('+') && parsed?.country) country.value = parsed.country;
  emitNumber(parsed?.isValid() ? parsed.number : '');
}

function formatNumber() {
  const parsed = parsedNumber();
  if (parsed?.isValid()) {
    if (parsed.country) country.value = parsed.country;
    nationalNumber.value = parsed.formatNational();
    emitNumber(parsed.number);
  }
}

function validate() {
  const parsed = parsedNumber();
  const valid = !!parsed?.isValid() && !parsed.ext;
  error.value = valid ? '' : 'Please enter a valid phone number without an extension.';
  input.value?.setCustomValidity(error.value);
  if (!valid) input.value?.reportValidity();
  else {
    formatNumber();
    emitNumber(parsed!.number);
  }
  return valid;
}
defineExpose({ validate });
</script>

<style scoped>
.phone-group { position: relative; width: 100%; min-width: 0; }
.phone-wrapper { position: relative; display: flex; align-items: center; min-width: 0; height: 54px; border: 1.5px solid v-bind('colors.border'); border-radius: 13px; background: v-bind('colors.surface'); transition: border-color .2s, box-shadow .2s; }
.phone-wrapper:focus-within { border-color: v-bind('colors.primary'); box-shadow: 0 0 0 4px v-bind('colors.primary10'); }
.phone-label { position: absolute; left: 12px; top: 0; transform: translateY(-50%); padding: 0 6px; font-size: 11px; font-weight: 600; background: v-bind('colors.surface'); color: v-bind('colors.textSecondary'); }
.phone-label span, .phone-error { color: v-bind('colors.danger'); }
.phone-wrapper:focus-within .phone-label { color: v-bind('colors.primary'); }
.country-picker { border: 0; background: var(--app-transparent); font-family: inherit; cursor: pointer; position: relative; display: flex; align-items: center; gap: 7px; flex-shrink: 0; height: 32px; padding: 0 10px 0 12px; border-right: 0; color: v-bind('colors.textPrimary'); font-size: 12px; }
.country-picker img { object-fit: cover; border-radius: 3px; }
.country-code { font-size: 11px; font-weight: 700; }
.country-picker:focus-within { outline: none; }
.phone-wrapper input { min-width: 0; width: 100%; height: 100%; padding: 0 12px; border: 0; outline: 0; background: var(--app-transparent); color: v-bind('colors.textPrimary'); font: inherit; font-size: 14px; border-radius: 0 13px 13px 0; }
.phone-wrapper input::placeholder { color: v-bind('colors.textMuted'); }
.phone-wrapper.has-error { border-color: v-bind('colors.danger'); }
.phone-error { display: block; padding: 6px 4px 0; font-size: 11px; }
@media (max-width: 640px) { .phone-wrapper { height: 52px; } .phone-wrapper input { font-size: 16px; } }
.country-menu { position: absolute; top: calc(100% + 8px); left: 0; right: 0; z-index: 30; padding: 16px 10px 8px; border: 1px solid v-bind('colors.border'); border-radius: 14px; background: v-bind('colors.surface'); box-shadow: 0 12px 32px var(--app-navyAlpha16); }
.country-list { max-height: 220px; overflow-y: auto; overscroll-behavior: contain; margin-top: 10px; }
.country-list button { display: flex; align-items: center; gap: 10px; width: 100%; min-height: 44px; padding: 10px; border: 0; border-radius: 8px; background: var(--app-transparent); color: v-bind('colors.textPrimary'); text-align: left; font: inherit; font-size: 12px; cursor: pointer; }
.country-list button.selected { background: v-bind('colors.primary10'); color: v-bind('colors.primary'); }
.country-list img { object-fit: cover; border-radius: 3px; flex-shrink: 0; }
.country-name { flex: 1; }
.dial { color: v-bind('colors.textSecondary'); }
.country-list p { text-align: center; color: v-bind('colors.textSecondary'); font-size: 12px; padding: 12px; }
.country-picker:focus-visible, .country-list button:focus-visible { outline: 2px solid v-bind('colors.primary'); outline-offset: -2px; }
</style>
