<template>
  <teleport to="body">
    <!-- Sidebar back cover -->
    <transition name="fade">
      <div v-if="isVisible" class="fixed inset-0 z-50 h-full w-full bg-gray-900/30" @click="onHide" />
    </transition>

    <!-- Sidebar content -->
    <transition
      enter-from-class="-translate-x-full"
      leave-to-class="-translate-x-full"
      enter-active-class="will-change-transform"
      leave-active-class="will-change-transform"
    >
      <div
        v-if="isVisible"
        v-bind="$attrs"
        class="fixed inset-0 z-50 flex flex-col overflow-y-auto bg-white transition-transform"
      >
        <slot />
      </div>
    </transition>
  </teleport>
</template>

<script setup lang="ts">
import { syncRefs, useScrollLock } from "@vueuse/core";
import { toRefs } from "vue";

interface IEmits {
  (event: "hide"): void;
}

interface IProps {
  isVisible?: boolean;
}

defineOptions({
  inheritAttrs: false,
});

const emit = defineEmits<IEmits>();
const props = defineProps<IProps>();

const { isVisible } = toRefs(props);

syncRefs(isVisible, useScrollLock(document.body));

function onHide() {
  emit("hide");
}
</script>
