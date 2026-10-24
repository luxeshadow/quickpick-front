<template>
  <div ref="root" class="date-input" @keydown.esc.stop="close" @focusout="leave">
    <button ref="trigger" class="date-trigger" type="button" :disabled="disabled" :aria-expanded="open" @click="toggle">
      <span class="label">{{ label }}</span><span>{{ displayDate || 'Choisir une date' }}</span>
      <i class="fi fi-rr-calendar" aria-hidden="true" />
    </button>
    <div v-if="open" ref="calendar" class="calendar" popover="auto" :style="position" role="group" aria-label="Calendrier" @toggle="onPopoverToggle">
      <header><button type="button" aria-label="Mois précédent" @click="changeMonth(-1)"><i class="fi fi-rr-angle-small-left" /></button><strong aria-live="polite">{{ monthLabel }}</strong><button type="button" aria-label="Mois suivant" @click="changeMonth(1)"><i class="fi fi-rr-angle-small-right" /></button></header>
      <div class="days"><span v-for="day in ['Lu', 'Ma', 'Me', 'Je', 'Ve', 'Sa', 'Di']" :key="day">{{ day }}</span>
        <span v-for="n in offset" :key="'empty' + n" />
        <button v-for="day in days" :key="day" type="button" :class="{ selected: modelValue === valueFor(day), today: today === valueFor(day) }" :aria-pressed="modelValue === valueFor(day)" :aria-label="day + ' ' + monthLabel" @click="choose(valueFor(day))">{{ day }}</button>
      </div>
      <footer><button type="button" @click="choose('')">Effacer</button><button type="button" @click="choose(today)">Aujourd’hui</button></footer>
    </div>
  </div>
</template>
<script setup lang="ts">
import { computed, ref, nextTick, onMounted, onBeforeUnmount } from 'vue';
import { AppColors } from '../../constants/app_colors';
const props = withDefaults(defineProps<{ modelValue: string; label?: string; disabled?: boolean }>(), { label: 'Date', disabled: false });
const emit = defineEmits<{ 'update:modelValue': [value: string] }>();
const colors = AppColors;
const root = ref<HTMLElement>();
const trigger = ref<HTMLButtonElement>();
const open = ref(false);
const calendar = ref<HTMLElement>();
const position = ref({ top: '0px', left: '0px', width: '300px', maxHeight: '320px' });
const month = ref(new Date());
function localDate(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}
const today = ref(localDate(new Date()));
const monthLabel = computed(() => month.value.toLocaleDateString('fr', { month: 'long', year: 'numeric' }));
const displayDate = computed(() => props.modelValue ? new Date(props.modelValue + 'T12:00:00').toLocaleDateString('fr', { day: 'numeric', month: 'long', year: 'numeric' }) : '');
const offset = computed(() => (new Date(month.value.getFullYear(), month.value.getMonth(), 1).getDay() + 6) % 7);
const days = computed(() => new Date(month.value.getFullYear(), month.value.getMonth() + 1, 0).getDate());
function valueFor(day: number) { return localDate(new Date(month.value.getFullYear(), month.value.getMonth(), day)); }
async function toggle() {
  if (!open.value) {
    today.value = localDate(new Date());
    month.value = new Date((props.modelValue || today.value) + 'T12:00:00');
  }
  if (open.value) { close(); return; }
  const rect = trigger.value!.getBoundingClientRect();
  const width = Math.min(320, rect.width, window.innerWidth - 24);
  position.value = {
    top: (rect.bottom + 8) + 'px',
    left: Math.max(12, Math.min(rect.left, window.innerWidth - width - 12)) + 'px',
    width: width + 'px',
    maxHeight: Math.max(0, window.innerHeight - rect.bottom - 20) + 'px',
  };
  open.value = true;
  await nextTick();
  calendar.value?.showPopover();
}
function onPopoverToggle(event: Event) {
  if ((event as ToggleEvent).newState === 'closed') open.value = false;
}
function repositionClose() { if (open.value) close(); }
function changeMonth(step: number) { month.value = new Date(month.value.getFullYear(), month.value.getMonth() + step, 1); }
function close() { open.value = false; trigger.value?.focus(); }
function choose(value: string) { emit('update:modelValue', value); close(); }
function leave(event: FocusEvent) { if (!root.value?.contains(event.relatedTarget as Node)) open.value = false; }
function outside(event: MouseEvent) { if (!root.value?.contains(event.target as Node)) open.value = false; }
onMounted(() => { document.addEventListener('click', outside); window.addEventListener('resize', repositionClose); });
onBeforeUnmount(() => { document.removeEventListener('click', outside); window.removeEventListener('resize', repositionClose); });
</script>
<style scoped>
.date-input { width: 100%; }
button { font: inherit; cursor: pointer; }
.date-trigger { position: relative; width: 100%; min-height: 54px; display: flex; justify-content: space-between; align-items: center; gap: 12px; padding: 14px 16px; border: 1.5px solid v-bind('colors.border'); border-radius: 13px; background: v-bind('colors.surface'); color: v-bind('colors.textPrimary'); font-size: 14px; }
.label { position: absolute; top: -7px; left: 12px; padding: 0 5px; background: v-bind('colors.surface'); color: v-bind('colors.textSecondary'); font-size: 11px; }
i { display: flex; line-height: 1; }
.calendar { position: fixed; inset: auto; margin: 0; box-sizing: border-box; overflow-y: auto; overscroll-behavior: contain; box-shadow: 0 12px 36px var(--app-navyAlpha24); padding: 14px; border: 1px solid v-bind('colors.border'); border-radius: 14px; background: v-bind('colors.surface'); }
header, footer { display: flex; justify-content: space-between; align-items: center; gap: 8px; }
header strong { font-size: 13px; text-transform: capitalize; }
header button { display: grid; place-items: center; width: 36px; height: 36px; border: 0; border-radius: 8px; background: v-bind('colors.backgroundLight'); color: v-bind('colors.textPrimary'); }
.days { display: grid; grid-template-columns: repeat(7, 1fr); gap: 3px; margin: 10px 0; }
.days span { text-align: center; font-size: 11px; color: v-bind('colors.textSecondary'); padding: 7px 0; }
.days button { min-height: 36px; border: 1px solid var(--app-transparent); border-radius: 8px; background: var(--app-transparent); color: v-bind('colors.textPrimary'); font-size: 12px; }
.days .today { border-color: v-bind('colors.primary'); }
.days .selected { background: v-bind('colors.primary'); color: var(--app-surface); }
footer { border-top: 1px solid v-bind('colors.border'); padding-top: 8px; }
footer button { padding: 8px; border: 0; background: var(--app-transparent); color: v-bind('colors.primary'); font-size: 12px; }
button:focus-visible { outline: 2px solid v-bind('colors.primary'); outline-offset: 2px; }
button:disabled { opacity: .5; cursor: default; }
</style>
