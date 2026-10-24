<template>
  <dialog
    ref="dialog"
    class="manager-dialog"
    @cancel.prevent="$emit('close')"
    @click="backdrop"
  >
    <header>
      <h3>{{ title }}</h3>
      <button
        type="button"
        aria-label="Fermer"
        @click="$emit('close')"
      >
        <i
          class="fi fi-rr-cross-small"
          aria-hidden="true"
        />
      </button>
    </header>
    <slot />
  </dialog>
</template>
<script setup lang="ts">
import { ref, watch, onBeforeUnmount } from 'vue';
const props = defineProps<{ open: boolean; title: string }>();
const emit = defineEmits<{ close: [] }>();
const dialog = ref<HTMLDialogElement>();
let previous: string | null = null;
function restore() {
  if (previous !== null) {
    document.documentElement.style.overflow = previous;
    previous = null;
  }
}
watch(
  () => props.open,
  (open) => {
    if (open && dialog.value && !dialog.value.open) {
      previous = document.documentElement.style.overflow;
      document.documentElement.style.overflow = 'hidden';
      dialog.value.showModal();
    } else if (!open) {
      dialog.value?.close();
      restore();
    }
  },
  { flush: 'post' },
);
function backdrop(event: MouseEvent) {
  if (event.target !== dialog.value) return;
  const r = dialog.value.getBoundingClientRect();
  if (
    event.clientX < r.left ||
    event.clientX > r.right ||
    event.clientY < r.top ||
    event.clientY > r.bottom
  )
    emit('close');
}
onBeforeUnmount(restore);
</script>
<style scoped>
.manager-dialog {
  width: min(470px, calc(100% - 32px));
  max-height: 85dvh;
  overflow: auto;
  padding: 26px;
  border: 1px solid var(--app-border);
  border-radius: 20px;
  color: var(--app-textPrimary);
  background: var(--app-surface);
}
.manager-dialog::backdrop {
  background: var(--app-navyDarkAlpha88);
}
header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  margin-bottom: 22px;
}
h3 {
  font-size: 18px;
  margin: 0;
}
button {
  display: grid;
  place-items: center;
  padding: 0;
  flex-shrink: 0;
  line-height: 1;
  width: 34px;
  height: 34px;
  border: 0;
  background: var(--app-background);
  color: var(--app-textSecondary);
  border-radius: 50%;
  font-size: 22px;
  cursor: pointer;
}
button i { display: flex; align-items: center; justify-content: center; width: 1em; height: 1em; line-height: 1; }
button i::before { display: block; line-height: 1; }
</style>
