<template>
  <div class="vc-line-item-property">
    <div class="vc-line-item-property__label">{{ label }}</div>
    <div class="vc-line-item-property__dots"></div>
    <div class="vc-line-item-property__value">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
interface Prop {
  label: string;
}

withDefaults(defineProps<Prop>(), {
  label: () => "",
});
</script>

<style lang="scss">
.vc-line-item-property {
  @apply grid grid-cols-[auto_1fr_auto] gap-1.5 text-13;

  @media (min-width: theme("screens.md")) {
    @apply grid-cols-[45%_1fr];
  }

  @media (min-width: theme("screens.lg")) {
    @apply text-xs;
  }

  &__label {
    @apply grow min-w-0 font-medium capitalize text-gray-600 truncate;

    @media (min-width: theme("screens.md")) {
      @apply font-bold text-gray-800;
    }
  }

  &__dots {
    @apply grow mb-1 h-4 border-b-2 border-gray-200 border-dotted;

    @media (min-width: theme("screens.md")) {
      @apply hidden;
    }
  }

  &__value {
    @apply min-w-0 font-semibold truncate;

    @media (min-width: theme("screens.md")) {
      @apply font-normal;
    }
  }
}
</style>
