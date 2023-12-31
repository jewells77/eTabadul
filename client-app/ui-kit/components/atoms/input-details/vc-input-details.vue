<template>
  <div
    :class="[
      'vc-input-details',
      {
        'vc-input-details--hide-empty': !showEmpty,
        'vc-input-details--error': error,
        'vc-input-details--single-line': singleLine,
      },
    ]"
  >
    <!-- Message -->
    <template v-if="message">
      <!-- eslint-disable-next-line vue/no-v-html -->
      <div v-if="!singleLine" class="vc-input-details__message" v-html="message"></div>

      <VcTooltip v-else class="w-full" placement="bottom-start" strategy="fixed">
        <template #trigger>
          <div class="vc-input-details__message">{{ message }}</div>
        </template>

        <template #content>
          <div class="vc-input-details__tooltip">{{ message }}</div>
        </template>
      </VcTooltip>
    </template>

    <!-- Counter -->
    <div v-if="counter" class="vc-input-details__counter">
      {{ textLength }}<template v-if="maxLength"> / {{ maxLength }}</template>
    </div>
  </div>
</template>

<script setup lang="ts">
interface IProps {
  message?: string;
  singleLine?: boolean;
  error?: boolean;
  counter?: boolean;
  showEmpty?: boolean;
  textLength?: number;
  maxLength?: number | string;
}

withDefaults(defineProps<IProps>(), {
  textLength: 0,
});
</script>

<style lang="scss">
.vc-input-details {
  $error: "";
  $singleLine: "";

  @apply flex justify-end mt-0.5 gap-2 min-h-[0.875rem] text-11;

  &--error {
    $error: &;
  }

  &--single-line {
    $singleLine: &;
  }

  &--hide-empty {
    @apply empty:hidden;
  }

  &__message {
    @apply grow text-gray-400;

    #{$error} & {
      @apply text-[color:var(--color-danger)];
    }

    #{$singleLine} & {
      @apply xs:line-clamp-1;
    }
  }

  &__tooltip {
    @apply w-52 rounded-sm bg-white py-1.5 px-3.5 text-xs text-tooltip shadow-sm-x-y;
  }

  &__counter {
    @apply font-medium text-right whitespace-nowrap;
  }
}
</style>
