<template>

  <div
    class="input-group"
    :class="{
      'is-focused': isFocused,
      'has-value': hasValue,
      'is-disabled': disabled
    }"
  >

    <div class="input-wrapper">

      <!-- =====================================
           PREFIX ICON
      ====================================== -->

      <div
        v-if="prefixIcon"
        class="input-icon input-prefix"
      >
        <i :class="prefixIcon"></i>
      </div>


      <!-- =====================================
           INPUT
      ====================================== -->

      <input
        :id="inputId"
        :type="type"
        :value="modelValue"
        :placeholder="isFocused ? placeholder : ''"
        :disabled="disabled"
        :required="required"
        :name="name"
        autocomplete="off"

        class="input-field"

        :class="{
          'has-prefix': prefixIcon,
          'has-suffix': suffixIcon
        }"

        @input="handleInput"
        @focus="handleFocus"
        @blur="handleBlur"
      />


      <!-- =====================================
           LABEL
      ====================================== -->

      <label
        :for="inputId"
        class="input-label"
      >
        {{ label }}

        <span
          v-if="required"
          class="required"
        >
          *
        </span>
      </label>


      <!-- =====================================
           SUFFIX ICON
      ====================================== -->

      <button
        v-if="suffixIcon"
        class="input-icon input-suffix"
        type="button"
        tabindex="-1"
        @click="$emit('suffix-click')"
      >
        <i :class="suffixIcon"></i>
      </button>

    </div>


    <!-- =====================================
         ERROR MESSAGE
    ====================================== -->

    <span
      v-if="error"
      class="input-error"
    >
      {{ error }}
    </span>

  </div>

</template>


<script setup lang="ts">

import { computed, ref, useId } from 'vue';

import { AppColors } from '../../constants/app_colors';

// Keep the palette available to server-rendered CSS bindings.
const colors = AppColors;


interface Props {

  modelValue?: string | number;

  label?: string;

  placeholder?: string;

  type?: string;

  name?: string;

  prefixIcon?: string;

  suffixIcon?: string;

  autocomplete?: string;

  disabled?: boolean;

  required?: boolean;

  error?: string;

}


const props = withDefaults(
  defineProps<Props>(),
  {

    modelValue: '',

    label: 'Label',

    placeholder: '',

    type: 'text',

    name: '',

    prefixIcon: '',

    suffixIcon: '',

    autocomplete: 'off',

    disabled: false,

    required: false,

    error: ''

  }
);


const emit = defineEmits<{

  (
    e: 'update:modelValue',
    value: string
  ): void;

  (
    e: 'focus',
    event: FocusEvent
  ): void;

  (
    e: 'blur',
    event: FocusEvent
  ): void;

  (
    e: 'suffix-click'
  ): void;

}>();


const isFocused = ref(false);


const inputId = useId();


const hasValue = computed(() => {

  return (
    props.modelValue !== '' &&
    props.modelValue !== null &&
    props.modelValue !== undefined
  );

});


const handleInput = (
  event: Event
) => {

  const target =
    event.target as HTMLInputElement;

  emit(
    'update:modelValue',
    target.value
  );

};


const handleFocus = (
  event: FocusEvent
) => {

  isFocused.value = true;

  emit(
    'focus',
    event
  );

};


const handleBlur = (
  event: FocusEvent
) => {

  isFocused.value = false;

  emit(
    'blur',
    event
  );

};

</script>


<style scoped>

.input-group {
  width: 100%;

  display: flex;

  flex-direction: column;

  gap: 6px;
}

.input-wrapper {
  width: 100%;

  height: 54px;

  position: relative;

  display: flex;

  align-items: center;

  background:
    v-bind('colors.surface');

  border:
    1.5px solid v-bind('colors.border');

  border-radius: 13px;

  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease,
    background 0.2s ease;
}


.input-group.is-focused
.input-wrapper {
  border-color:
    v-bind('colors.primary');

  box-shadow:
    0 0 0 4px
    v-bind('colors.primary10');

  background:
    v-bind('colors.surface');
}


.input-field {
  width: 100%;

  height: 100%;

  padding:
    0 15px;

  border: none;

  outline: none;

  background: var(--app-transparent);

  color:
    v-bind('colors.textPrimary');

  font-family: inherit;

  font-size: 14px;

  font-weight: 500;
}


.input-field.has-prefix {
  padding-left: 48px;
}


.input-field.has-suffix {
  padding-right: 48px;
}


.input-field::placeholder {
  color:
    v-bind('colors.textMuted');

  font-weight: 400;

  opacity: 0;

  transition:
    opacity 0.2s ease;
}


.input-group.is-focused
.input-field::placeholder {
  opacity: 1;
}



.input-label {
  position: absolute;

  left: 15px;

  top: 50%;

  z-index: 2;

  transform:
    translateY(-50%);

  padding:
    0 5px;

  background:
    v-bind('colors.surface');

  color:
    v-bind('colors.textSecondary');

  font-size: 13px;

  font-weight: 500;

  pointer-events: none;

  transition:
    top 0.2s ease,
    left 0.2s ease,
    transform 0.2s ease,
    font-size 0.2s ease,
    color 0.2s ease;
}



.input-field.has-prefix
~ .input-label {
  left: 48px;
}

.input-group.is-focused
.input-label,

.input-group.has-value
.input-label {

  top: 0;

  left: 12px;

  transform:
    translateY(-50%);

  padding:
    0 6px;

  color:
    v-bind('colors.primary');

  font-size: 11px;

  font-weight: 600;

}


.input-group.has-value:not(.is-focused)
.input-label {

  color:
    v-bind('colors.textSecondary');

}


.input-icon {
  width: 45px;

  height: 100%;

  position: absolute;

  top: 0;

  z-index: 3;

  display: flex;

  align-items: center;

  justify-content: center;

  border: none;

  outline: none;

  background: var(--app-transparent);

  color:
    v-bind('colors.textMuted');

  font-size: 17px;

  transition:
    color 0.2s ease;
}


.input-icon i {
  display: flex;

  align-items: center;

  justify-content: center;
}


.input-prefix {
  left: 3px;

  pointer-events: none;
}


.input-suffix {
  right: 3px;

  cursor: pointer;

  border-radius: 10px;
}


.input-suffix:hover {
  color:
    v-bind('colors.primary');

  background: var(--app-transparent);
}


.input-group.is-focused
.input-icon {
  color:
    v-bind('colors.primary');
}

.required {
  color:
    v-bind('colors.danger');
}

.input-error {
  padding-left: 4px;

  color:
    v-bind('colors.danger');

  font-size: 11px;

  font-weight: 500;
}


.input-group:has(.input-error)
.input-wrapper {
  border-color:
    v-bind('colors.danger');
}


.input-group:has(.input-error)
.input-label {
  color:
    v-bind('colors.danger');
}


.input-group.is-disabled {
  opacity: 0.6;
}


.input-group.is-disabled
.input-wrapper {
  background:
    v-bind('colors.backgroundLight');

  cursor: not-allowed;
}


.input-group.is-disabled
.input-field {
  cursor: not-allowed;
}


@media (max-width: 640px) {

  .input-wrapper {
    height: 52px;
  }


  .input-field {
    font-size: 13px;
  }


  .input-label {
    font-size: 12px;
  }

}

</style>