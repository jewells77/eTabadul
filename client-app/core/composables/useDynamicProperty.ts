import { computed, readonly, ref, shallowRef } from "vue";
import { getDynamicProperty } from "@/core/api/graphql";
import { Logger } from "../utilities";

const loading = ref(false);
const dynamicProperties = shallowRef<[]>([]);

async function loadDynamicProperties() {
  loading.value = true;

  try {
    dynamicProperties.value = await getDynamicProperty();
  } catch (e) {
    Logger.error(loadDynamicProperties.name, e);
  } finally {
    loading.value = false;
  }
}

export function useDynamicProperties() {
  return {
    loadDynamicProperties,
    loading: readonly(loading),
    dynamicProperties: computed(() => dynamicProperties.value),
  };
}
