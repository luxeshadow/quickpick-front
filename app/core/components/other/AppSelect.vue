<template>
  <div
    class="app-select"
    ref="root"
    @keydown.esc="open = false"
    @focusout="leave"
  >
    <button
      type="button"
      :aria-label="label"
      :aria-expanded="open"
      @click="open = !open"
    >
      {{ selectedLabel
      }}<i
        class="fi fi-rr-angle-small-down"
        aria-hidden="true"
      />
    </button>
    <div
      v-if="open"
      class="options"
    >
      <button
        v-for="option in normalizedOptions"
        :key="option.value"
        type="button"
        :class="{ selected: option.value === modelValue }"
        @click="choose(option.value)"
      >
        {{ option.label
        }}<i
          v-if="option.value === modelValue"
          class="fi fi-rr-check"
          aria-hidden="true"
        />
      </button>
    </div>
  </div>
</template>
<script setup lang="ts">
import { computed, ref, onMounted, onBeforeUnmount } from 'vue';
const props = withDefaults(defineProps<{ modelValue: string; options: (string | { value: string; label: string })[]; label: string; placeholder?: string }>(), { placeholder: 'Choisir' });
const normalizedOptions = computed(() => props.options.map(option => typeof option === 'string' ? { value: option, label: option } : option));
const selectedLabel = computed(() => normalizedOptions.value.find(option => option.value === props.modelValue)?.label || props.placeholder);
const emit = defineEmits<{ 'update:modelValue': [value: string] }>();
const open = ref(false);
const root = ref<HTMLElement>();
function choose(value: string) {
  emit('update:modelValue', value);
  open.value = false;
  root.value?.querySelector('button')?.focus();
}
function outside(event: MouseEvent) {
  if (!root.value?.contains(event.target as Node)) open.value = false;
}
function leave(event: FocusEvent) {
  if (!root.value?.contains(event.relatedTarget as Node)) open.value = false;
}
onMounted(() => document.addEventListener('click', outside));
onBeforeUnmount(() => document.removeEventListener('click', outside));
</script>
<style scoped>
.app-select {
  position: relative;
  min-width: 105px;
}
.app-select button {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 15px;
  width: 100%;
  padding: 11px 13px;
  border: 1px solid var(--app-border);
  border-radius: 10px;
  background: var(--app-surface);
  color: var(--app-textPrimary);
  font: inherit;
  font-size: 12px;
  cursor: pointer;
}
.options {
  position: absolute;
  top: calc(100% + 6px);
  left: 0;
  right: 0;
  z-index: 30;
  background: var(--app-surface);
  border: 1px solid var(--app-border);
  padding: 5px;
  border-radius: 12px;
  box-shadow: 0 10px 30px var(--app-navyAlpha20);
}
.options button {
  border: 0;
}
.options button:hover,
.options .selected {
  background: var(--app-infoLight);
  color: var(--app-primary);
}
button:focus-visible {
  outline: 2px solid var(--app-primary);
  outline-offset: 2px;
}
i {
  display: flex;
  font-size: 11px;
}
</style>
