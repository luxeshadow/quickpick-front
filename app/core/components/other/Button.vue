<template>

  <button
    class="app-button"
    :type="type"
    :disabled="disabled"
    @click="handleClick"
  >

    <i
      v-if="icon"
      :class="icon"
      class="button-icon"
    ></i>

    <span>
      {{ label }}
    </span>

  </button>

</template>


<script setup lang="ts">

import { AppColors } from '../../constants/app_colors';

const colors = AppColors;


interface Props {

  label: string;

  icon?: string;

  type?: 'button' | 'submit' | 'reset';

  disabled?: boolean;

  onClick?: () => void;

}


const props = withDefaults(
  defineProps<Props>(),
  {
    icon: '',
    type: 'button',
    disabled: false,
    onClick: undefined
  }
);


const handleClick = () => {

  if (props.disabled) {
    return;
  }

  if (props.onClick) {
    props.onClick();
  }

};

</script>


<style scoped>

.app-button {
  width: 100%;
  height: 54px;

  display: flex;
  align-items: center;
  justify-content: center;

  gap: 9px;

  border: none;
  outline: none;

  border-radius: 13px;

  background:
    v-bind('colors.primary');

  color:
    v-bind('colors.textOnPrimary');

  font-family: inherit;
  font-size: 14px;
  font-weight: 700;

  cursor: pointer;



  transition:
    background 0.2s ease,
    box-shadow 0.2s ease,
    transform 0.2s ease;
}


.app-button:hover {
  background:
    v-bind('colors.primaryHover');

  box-shadow:
    0 12px 28px
    v-bind('colors.primary30');

  transform:
    translateY(-1px);
}


.app-button:active {
  transform:
    translateY(0)
    scale(0.99);
}


.app-button:disabled {
  opacity: 0.55;
  cursor: not-allowed;
  transform: none;
}


.button-icon {
  display: flex;
  align-items: center;
  justify-content: center;

  font-size: 17px;
}

</style>