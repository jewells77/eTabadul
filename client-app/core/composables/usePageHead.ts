import { useHead } from "@unhead/vue";
import { computedEager } from "@vueuse/core";
import { unref } from "vue";
import { useLanguages } from "@/core/composables";
import { useThemeContext } from "./useThemeContext";
import type { IUsePageSeoData } from "../types";
const { currentLanguage } = useLanguages();

function getStoreNameLang(jsonString: string, defaultStoreName: string) {
  // Parse the JSON string into a JavaScript object
  console.log("currentLanguage", currentLanguage.value.cultureName);
  const currentLanguageCode = currentLanguage.value.cultureName;
  const currentStore = JSON.parse(jsonString);

  // Find the dynamic property with the name 'display_name'
  const displayNameProperty = currentStore.dynamicProperties.find((property: any) => property.name === "display_name");

  if (displayNameProperty && displayNameProperty.values && displayNameProperty.values.length > 0) {
    // Find the value with language 'ar-EG'
    const arabicDisplayName = displayNameProperty.values.find(
      (value: any) => value.language.cultureName === currentLanguageCode,
    );

    console.log("arabicDisplayName", arabicDisplayName);
    if (arabicDisplayName) {
      return arabicDisplayName.value;
      // window.currentStoreNameWithLang = result
      // console.log(' window.currentStoreNameWithLang',  window.currentStoreNameWithLang); // Output: "سوق التبادل الإلكتروني"
    } else {
      console.log("Arabic display name not found.");
      return defaultStoreName;
    }
  } else {
    console.log("Display name property not found in dynamicProperties.");
  }
}

export function usePageHead(data: IUsePageSeoData) {
  const { themeContext } = useThemeContext();

  const {
    storeName,
    settings: { page_title_with_store_name, page_title_store_name_align, page_title_divider },
  } = themeContext.value;
  return useHead({
    title: computedEager(() => {
      if (!data.title) {
        return "";
      }

      const textOrChunks = unref(data.title);
      const titleChunks: string[] = [];

      if (Array.isArray(textOrChunks)) {
        titleChunks.push(...textOrChunks);
      } else if (textOrChunks) {
        titleChunks.push(textOrChunks);
      }
      let currentStoreNameWithLang = storeName;
      if (window.currentStoreNameWithLang) {
        currentStoreNameWithLang = getStoreNameLang(window.currentStoreNameWithLang, storeName);
      }

      if (page_title_with_store_name) {
        titleChunks[page_title_store_name_align === "end" ? "push" : "unshift"](currentStoreNameWithLang);
      }
      console.log(
        "titleChunks.filter(Boolean).join(page_title_divider)",
        titleChunks.filter(Boolean).join(page_title_divider),
      );
      return titleChunks.filter(Boolean).join(page_title_divider);
    }),
    meta: () => {
      if (!data.meta) {
        return [];
      }
      return Object.entries(data.meta).map(([name, content]) => ({ name, content: unref(content) ?? "" }));
    },
  });
}
