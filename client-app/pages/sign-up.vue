<template>
  <TwoColumn class="max-w-screen-xl">
    <template #left>
      <h1 v-t="'pages.sign_up.header'" class="mb-8 text-3xl font-bold uppercase tracking-wide lg:mt-5 lg:text-4xl"></h1>
      <form @submit="onSubmit">
        <div class="my-5 flex flex-col space-y-5 md:flex-row md:space-x-7 md:space-y-0">
          <VcRadioButton
            id="shipping"
            v-model="registrationKind"
            :value="RegistrationKind.personal"
            :label="$t('pages.sign_up.personal_registration_kind_label')"
            :disabled="loading"
          />

          <VcRadioButton
            id="pickup"
            v-model="registrationKind"
            :value="RegistrationKind.organization"
            :label="$t('pages.sign_up.organization_registration_kind_label')"
            :disabled="loading"
          />
        </div>

        <VcInput
          v-model.trim="firstName"
          :label="$t('common.labels.first_name')"
          :placeholder="$t('common.placeholders.first_name')"
          :message="errors.firstName"
          :error="!!errors.firstName"
          :maxlength="64"
          :disabled="loading"
          class="mb-4"
          name="firstName"
          required
          autocomplete="given-name"
        />

        <VcInput
          v-model.trim="lastName"
          :label="$t('common.labels.last_name')"
          :placeholder="$t('common.placeholders.last_name')"
          :message="errors.lastName"
          :error="!!errors.lastName"
          :maxlength="64"
          :disabled="loading"
          class="mb-4"
          name="lastName"
          required
          autocomplete="family-name"
        />

        <VcInput
          v-model.trim="email"
          :label="$t('common.labels.email')"
          :placeholder="$t('common.placeholders.email')"
          :message="errors.email"
          :error="!!errors.email"
          :maxlength="64"
          :disabled="loading"
          class="mb-4"
          name="email"
          required
          autocomplete="email"
          @input="emailValidationData.isChecked = false"
        />

        <VcInput
          v-if="registrationKind === RegistrationKind.personal"
          v-model="nationalId"
          class="mb-4"
          :label="$t('common.labels.national_id')"
          :placeholder="$t('common.placeholders.national_id')"
          :message="errors.nationalId"
          :error="!!errors.nationalId"
          :maxlength="64"
          name="nationalId"
          autocomplete="nationalId"
          required
        />

        <VcInput
          v-if="registrationKind === RegistrationKind.personal"
          v-model="fax"
          class="mb-4"
          :label="$t('common.labels.fax')"
          :placeholder="$t('common.placeholders.fax')"
          :message="errors.fax"
          :error="!!errors.fax"
          :maxlength="64"
          type="number"
          name="fax"
          autocomplete="fax"
          required
        />

        <VcInput
          v-if="registrationKind === RegistrationKind.personal"
          v-model="phoneNumber"
          class="mb-4"
          :label="$t('common.labels.phone')"
          :placeholder="$t('common.placeholders.phone')"
          :message="errors.phoneNumber"
          :error="!!errors.phoneNumber"
          :maxlength="64"
          type="number"
          name="phoneNumber"
          autocomplete="phoneNumber"
          required
        />

        <VcInput
          v-if="registrationKind === RegistrationKind.organization"
          v-model.trim="organizationName"
          :label="$t('common.labels.company_name')"
          :placeholder="$t('common.placeholders.company_name')"
          :message="errors.organizationName"
          :error="!!errors.organizationName"
          :maxlength="64"
          :disabled="loading"
          class="mb-4"
          name="organizationName"
          autocomplete="off"
          required
        />

        <VcInput
          v-if="registrationKind === RegistrationKind.organization"
          v-model="commercialRegistrationNumber"
          class="mb-4"
          :label="$t('common.labels.commercial_registration_number')"
          :placeholder="$t('common.placeholders.commercial_registration_number')"
          :message="errors.commercialRegistrationNumber"
          :error="!!errors.commercialRegistrationNumber"
          :maxlength="64"
          type="number"
          name="commercialRegistrationNumber"
          autocomplete="commercialRegistrationNumber"
          required
        />

        <VcInput
          v-if="registrationKind === RegistrationKind.organization"
          v-model="salesRepresentative"
          class="mb-4"
          :label="$t('common.labels.sales_representative')"
          :placeholder="$t('common.placeholders.sales_representative')"
          :message="errors.salesRepresentative"
          :error="!!errors.salesRepresentative"
          :maxlength="64"
          name="salesRepresentative"
          autocomplete="salesRepresentative"
          required
        />

        <VcInput
          v-if="registrationKind === RegistrationKind.organization"
          v-model="financialRepresentative"
          class="mb-4"
          :label="$t('common.labels.financial_representative')"
          :placeholder="$t('common.placeholders.financial_representative')"
          :message="errors.financialRepresentative"
          :error="!!errors.financialRepresentative"
          :maxlength="64"
          name="financialRepresentative"
          autocomplete="financialRepresentative"
          required
        />

        <VcSelect
          v-if="registrationKind === RegistrationKind.organization"
          v-model="companyCountry"
          text-field="name"
          :message="errors.companyCountryCode"
          :error="!!errors.companyCountryCode"
          :items="countries"
          :label="$t('common.labels.country')"
          :placeholder="$t('common.placeholders.select_country')"
          class="mb-4"
          required
          autocomplete
        />

        <VcSelect
          v-if="registrationKind === RegistrationKind.organization"
          v-model="region"
          text-field="name"
          :items="regions"
          :message="errors.regionId"
          :error="!!errors.regionId"
          :required="!!regions.length"
          :disabled="!regions.length"
          :label="$t('common.labels.region')"
          :placeholder="$t('common.placeholders.select_region')"
          class="mb-4"
          autocomplete
        />

        <VcSelect
          v-if="registrationKind === RegistrationKind.organization"
          v-model="businessCategory"
          text-field="name"
          :message="errors.businessCategoryCode"
          :error="!!errors.businessCategoryCode"
          :items="businessCategoryNames"
          :label="$t('common.labels.business_category')"
          :placeholder="$t('common.placeholders.business_category')"
          class="mb-4"
          required
          autocomplete
        />

        <VcSelect
          v-if="registrationKind === RegistrationKind.organization"
          v-model="companyType"
          text-field="name"
          :message="errors.companyTypeCode"
          :error="!!errors.companyTypeCode"
          :items="companyTypeNames"
          :label="$t('common.labels.company_type')"
          :placeholder="$t('common.placeholders.company_type')"
          class="mb-4"
          required
          autocomplete
        />

        <VcSelect
          v-if="registrationKind === RegistrationKind.organization"
          v-model="legalEntity"
          text-field="name"
          :message="errors.legalEntityCode"
          :error="!!errors.legalEntityCode"
          :items="legalEntityNames"
          :label="$t('common.labels.legal_entity')"
          :placeholder="$t('common.placeholders.legal_entity')"
          class="mb-4"
          required
          autocomplete
        />

        <VcSelect
          v-if="registrationKind === RegistrationKind.organization"
          v-model="companyClassification"
          text-field="name"
          :message="errors.companyClassificationCode"
          :error="!!errors.companyClassificationCode"
          :items="companyClassificationNames"
          :label="$t('common.labels.company_classification')"
          :placeholder="$t('common.placeholders.company_classification')"
          class="mb-4"
          required
          autocomplete
        />

        <div class="block justify-between lg:flex lg:space-x-6">
          <VcInput
            v-model="password"
            :label="$t('common.labels.password')"
            :placeholder="$t('common.placeholders.password')"
            :message="errors.password"
            :error="!!errors.password"
            :maxlength="64"
            :disabled="loading"
            class="mb-4 w-full lg:w-1/2"
            type="password"
            autocomplete="new-password"
            required
          />

          <VcInput
            v-model="confirmPassword"
            :label="$t('common.labels.confirm_password')"
            :placeholder="$t('common.placeholders.confirm_password')"
            :message="errors.confirmPassword"
            :error="!!errors.confirmPassword"
            :maxlength="64"
            :disabled="loading"
            class="mb-4 w-full lg:w-1/2"
            type="password"
            autocomplete="off"
            required
          />
        </div>

        <div class="mt-6 lg:mt-4">
          <PasswordTips v-if="passwordRequirements" :requirements="passwordRequirements" />

          <VcAlert
            v-for="error in commonErrors"
            :key="error"
            color="danger"
            size="sm"
            variant="solid-light"
            class="mt-3 text-xs"
            icon
          >
            {{ error }}
          </VcAlert>

          <VcButton :loading="loading" type="submit" class="mt-6 w-full lg:mt-3 lg:w-48">
            {{ $t("pages.sign_up.register_button") }}
          </VcButton>
        </div>
      </form>
    </template>

    <template #right>
      <VcImage class="max-w-md" src="/static/images/sign-up/image.webp" lazy />
    </template>
  </TwoColumn>
</template>

<script setup lang="ts">
import { toTypedSchema } from "@vee-validate/yup";
import { useDebounceFn } from "@vueuse/core";
import { useField, useForm } from "vee-validate";
import { reactive, ref, nextTick, onMounted, computed } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import { object, ref as yupRef, string, string as yupString } from "yup";
import { checkEmailUniqueness } from "@/core/api/graphql/account";
import { useIdentityErrorTranslator, usePageHead, useDynamicProperties, useCountries } from "@/core/composables";
import { PasswordTips, RegistrationKind, usePasswordRequirements, useUser } from "@/shared/account";
import { TwoColumn } from "@/shared/layout";
import type { AccountCreationResultType, CountryRegionType, CountryType } from "@/core/api/graphql/types";

const router = useRouter();

const ASYNC_VALIDATION_TIMEOUT_IN_MS = 500;

const { t } = useI18n();
const { registerUser, registerOrganization, loading } = useUser();
const { passwordRequirements, fetchPasswordRequirements } = usePasswordRequirements();
const getIdentityErrorTranslation = useIdentityErrorTranslator();
const { loadDynamicProperties, dynamicProperties } = useDynamicProperties();
const { countries, loadCountries } = useCountries();

usePageHead({
  title: t("pages.sign_up.meta.title"),
});

const validationSchema = toTypedSchema(
  object({
    registrationKind: string().required(),
    organizationName: string().when("registrationKind", {
      is: RegistrationKind.organization,
      then: (stringSchema) => stringSchema.required().max(64),
    }),
    email: string()
      .required()
      .email()
      .max(64)
      .test({
        message: t("common.messages.email_not_unique"),
        test: (value) =>
          new Promise((resolve) =>
            nextTick(() =>
              emailValidationData.isChecked
                ? resolve(emailValidationData.isUnique)
                : emailValidationDebounced(value, resolve),
            ),
          ),
      }),
    firstName: string().required().max(64),
    lastName: string().required().max(64),
    nationalId: string().when("registrationKind", {
      is: RegistrationKind.personal,
      then: (stringSchema) => stringSchema.required(),
    }),
    fax: string().when("registrationKind", {
      is: RegistrationKind.personal,
      then: (stringSchema) => stringSchema.required(),
    }),
    phoneNumber: string().when("registrationKind", {
      is: RegistrationKind.personal,
      then: (stringSchema) => stringSchema.required(),
    }),
    commercialRegistrationNumber: string().when("registrationKind", {
      is: RegistrationKind.organization,
      then: (stringSchema) => stringSchema.required(),
    }),
    salesRepresentative: string().when("registrationKind", {
      is: RegistrationKind.organization,
      then: (stringSchema) => stringSchema.required(),
    }),
    financialRepresentative: string().when("registrationKind", {
      is: RegistrationKind.organization,
      then: (stringSchema) => stringSchema.required(),
    }),
    companyCountryCode: string().when("registrationKind", {
      is: RegistrationKind.organization,
      then: (stringSchema) => stringSchema.required(),
    }),
    companyCountryName: string().when("registrationKind", {
      is: RegistrationKind.organization,
      then: (stringSchema) => stringSchema.required(),
    }),
    companyTypeCode: string().when("registrationKind", {
      is: RegistrationKind.organization,
      then: (stringSchema) => stringSchema.required(),
    }),
    companyTypeName: string().when("registrationKind", {
      is: RegistrationKind.organization,
      then: (stringSchema) => stringSchema.required(),
    }),
    businessCategoryCode: string().when("registrationKind", {
      is: RegistrationKind.organization,
      then: (stringSchema) => stringSchema.required(),
    }),
    businessCategoryName: string().when("registrationKind", {
      is: RegistrationKind.organization,
      then: (stringSchema) => stringSchema.required(),
    }),
    regionId: string().when("registrationKind", {
      is: RegistrationKind.organization,
      then: (stringSchema) => stringSchema.required(),
    }),
    regionName: string().when("registrationKind", {
      is: RegistrationKind.organization,
      then: (stringSchema) => stringSchema.required(),
    }),
    legalEntityCode: string().when("registrationKind", {
      is: RegistrationKind.organization,
      then: (stringSchema) => stringSchema.required(),
    }),
    legalEntityName: string().when("registrationKind", {
      is: RegistrationKind.organization,
      then: (stringSchema) => stringSchema.required(),
    }),
    companyClassificationCode: string().when("registrationKind", {
      is: RegistrationKind.organization,
      then: (stringSchema) => stringSchema.required(),
    }),
    companyClassificationName: string().when("registrationKind", {
      is: RegistrationKind.organization,
      then: (stringSchema) => stringSchema.required(),
    }),
    password: string().required(),
    confirmPassword: string()
      .required()
      .oneOf([yupRef("password")], t("common.messages.passwords_do_not_match")),
  }),
);

const { errors, handleSubmit, setFieldError } = useForm({
  validationSchema,
  initialValues: {
    registrationKind: RegistrationKind.personal,
    email: "",
    organizationName: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    nationalId: "",
    fax: "",
    phoneNumber: "",
    commercialRegistrationNumber: "",
    salesRepresentative: "",
    financialRepresentative: "",
    companyCountryCode: "",
    companyCountryName: "",
    companyTypeCode: "",
    companyTypeName: "",
    businessCategoryCode: "",
    businessCategoryName: "",
    regionId: "",
    regionName: "",
    legalEntityCode: "",
    legalEntityName: "",
    companyClassificationCode: "",
    companyClassificationName: "",
  },
  validateOnMount: false,
});

const businessCategoryNames = computed(() => {
  const businessCategoryItem: any = dynamicProperties.value.find((item: any) => item.name === "business_category");
  return businessCategoryItem
    ? businessCategoryItem.dictionaryItems.items.map((item: any, index: number) => {
        return { id: index, name: item.label };
      })
    : [];
});

const companyTypeNames = computed(() => {
  const companyTypeItem: any = dynamicProperties.value.find((item: any) => item.name === "company_type");
  return companyTypeItem
    ? companyTypeItem.dictionaryItems.items.map((item: any, index: number) => {
        return { id: index, name: item.label };
      })
    : [];
});

const legalEntityNames = computed(() => {
  const companyTypeItem: any = dynamicProperties.value.find((item: any) => item.name === "legal_entity");
  return companyTypeItem
    ? companyTypeItem.dictionaryItems.items.map((item: any, index: number) => {
        return { id: index, name: item.label };
      })
    : [];
});

const companyClassificationNames = computed(() => {
  const companyTypeItem: any = dynamicProperties.value.find((item: any) => item.name === "company_classification");
  return companyTypeItem
    ? companyTypeItem.dictionaryItems.items.map((item: any, index: number) => {
        return { id: index, name: item.label };
      })
    : [];
});

const companyCountry = computed<CountryType | undefined>({
  get: () => countries.value.find((item) => companyCountryCode.value === item.id),
  set: (value?: CountryType) => {
    companyCountryCode.value = value?.id ?? "";
    companyCountryName.value = value?.name ?? "";
    regionId.value = "";
    regionName.value = "";
  },
});
const regions = computed<CountryRegionType[]>(() => companyCountry.value?.regions ?? []);
const region = computed<CountryRegionType | undefined>({
  get: () => regions.value.find((item) => regionId.value === item.id),
  set: (value?: CountryRegionType) => {
    regionId.value = value?.id ?? "";
    regionName.value = value?.name ?? "";
  },
});

const regionRules = computed(() => {
  let rules = yupString().nullable();
  if (regions.value.length) {
    rules = rules.required();
  }
  return toTypedSchema(rules);
});

const businessCategory = computed<CountryType | undefined>({
  get: () => businessCategoryNames.value.find((item: any) => businessCategoryCode.value === item.id),
  set: (value?: CountryType) => {
    businessCategoryCode.value = value?.id ?? "";
    businessCategoryName.value = value?.name ?? "";
  },
});

const companyType = computed<CountryType | undefined>({
  get: () => companyTypeNames.value.find((item: any) => companyTypeCode.value === item.id),
  set: (value?: CountryType) => {
    companyTypeCode.value = value?.id ?? "";
    companyTypeName.value = value?.name ?? "";
  },
});

const legalEntity = computed<CountryType | undefined>({
  get: () => legalEntityNames.value.find((item: any) => legalEntityCode.value === item.id),
  set: (value?: CountryType) => {
    legalEntityCode.value = value?.id ?? "";
    legalEntityName.value = value?.name ?? "";
  },
});

const companyClassification = computed<CountryType | undefined>({
  get: () => companyClassificationNames.value.find((item: any) => companyClassificationCode.value === item.id),
  set: (value?: CountryType) => {
    companyClassificationCode.value = value?.id ?? "";
    companyClassificationName.value = value?.name ?? "";
  },
});

const { value: registrationKind } = useField<RegistrationKind>("registrationKind");
const { value: firstName } = useField<string>("firstName");
const { value: lastName } = useField<string>("lastName");
const { value: email } = useField<string>("email");
const { value: organizationName } = useField<string>("organizationName");
const { value: password } = useField<string>("password");
const { value: confirmPassword } = useField<string>("confirmPassword");
const { value: nationalId } = useField<string>("nationalId");
const { value: phoneNumber } = useField<string>("phoneNumber");
const { value: fax } = useField<string>("fax");
const { value: commercialRegistrationNumber } = useField<string>("commercialRegistrationNumber");
const { value: salesRepresentative } = useField<string>("salesRepresentative");
const { value: financialRepresentative } = useField<string>("financialRepresentative");

const { value: businessCategoryCode } = useField(
  "businessCategoryCode",
  toTypedSchema(yupString().required().nullable()),
  {
    syncVModel: false,
  },
);
const { value: businessCategoryName } = useField(
  "businessCategoryName",
  toTypedSchema(yupString().max(128).nullable()),
  {
    syncVModel: false,
  },
);

const { value: companyTypeCode } = useField("companyTypeCode", toTypedSchema(yupString().required().nullable()), {
  syncVModel: false,
});
const { value: companyTypeName } = useField("companyTypeName", toTypedSchema(yupString().required().nullable()), {
  syncVModel: false,
});

const { value: companyClassificationCode } = useField(
  "companyClassificationCode",
  toTypedSchema(yupString().required().nullable()),
  {
    syncVModel: false,
  },
);
const { value: companyClassificationName } = useField(
  "companyClassificationName",
  toTypedSchema(yupString().required().nullable()),
  {
    syncVModel: false,
  },
);

const { value: legalEntityCode } = useField("legalEntityCode", toTypedSchema(yupString().required().nullable()), {
  syncVModel: false,
});
const { value: legalEntityName } = useField("legalEntityName", toTypedSchema(yupString().required().nullable()), {
  syncVModel: false,
});

const { value: companyCountryCode } = useField("companyCountryCode", toTypedSchema(yupString().required().nullable()), {
  syncVModel: false,
});
const { value: companyCountryName } = useField("companyCountryName", toTypedSchema(yupString().max(128).nullable()), {
  syncVModel: false,
});
const { value: regionName } = useField("regionName", toTypedSchema(yupString().max(128).nullable()), {
  syncVModel: false,
});
const { value: regionId } = useField("regionId", regionRules, { syncVModel: false });

const commonErrors = ref<string[]>([]);
const jack = ref("");
const emailValidationData = reactive({
  isChecked: false,
  isUnique: false,
});

const emailValidationDebounced = useDebounceFn(async (value: string, resolve: (value: boolean) => void) => {
  emailValidationData.isUnique = await checkEmailUniqueness({ email: value });
  emailValidationData.isChecked = true;
  resolve(emailValidationData.isUnique);
}, ASYNC_VALIDATION_TIMEOUT_IN_MS);

const onSubmit = handleSubmit(async (data) => {
  let result: AccountCreationResultType;

  commonErrors.value = [];

  if (registrationKind.value === RegistrationKind.personal) {
    result = await registerUser({
      email: data.email!,
      firstName: data.firstName!,
      lastName: data.lastName!,
      userName: data.email!,
      password: data.password!,
      nationalId: data.nationalId!,
      phoneNumber: data.phoneNumber!,
      fax: data.fax!,
    });
  } else {
    result = await registerOrganization({
      organizationName: data.organizationName,
      email: data.email!,
      firstName: data.firstName,
      lastName: data.lastName,
      userName: data.email!,
      password: data.password!,
      commercialRegistrationNumber: data.commercialRegistrationNumber,
      salesRepresentative: data.salesRepresentative,
      financialRepresentative: data.financialRepresentative,
      companyCountry: data.companyCountryName,
      companyType: data.companyTypeName,
      businessCategory: data.businessCategoryName,
      legalEntity: data.legalEntityName,
      companyClassification: data.companyClassificationName,
    });
  }

  if (result.succeeded) {
    router.push({ name: "Welcome" });
  } else if (result.errors?.length) {
    console.log("result", result);
    result.errors.forEach((error) => {
      const errorDescription = getIdentityErrorTranslation(error);

      switch (error.code) {
        case "PasswordTooShort":
        case "PasswordRequiresLower":
        case "PasswordRequiresUpper":
        case "PasswordRequiresUniqueChars":
        case "PasswordRequiresDigit":
        case "PasswordRequiresNonAlphanumeric":
        case "RecentPasswordUsed":
        case "InvalidPasswordHasherCompatibilityMode":
        case "InvalidPasswordHasherIterationCount":
          setFieldError("password", errorDescription);
          break;

        case "DuplicateEmail":
        case "InvalidEmail":
          setFieldError("email", errorDescription);
          break;

        default:
          if (errorDescription) {
            console.log("errorDescription", errorDescription);
            commonErrors.value.push(errorDescription);
          }
      }
    });
  }
});

if (!passwordRequirements.value) {
  fetchPasswordRequirements();
}
onMounted(async () => {
  await loadDynamicProperties();
  if (!countries.value.length) {
    await loadCountries();
  }
  console.log("countries", countries);
  jack.value = window.currentStoreNameWithLang;
  console.log("jack", jack);
});
</script>
