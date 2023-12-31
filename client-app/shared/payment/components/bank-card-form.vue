<template>
  <form class="flex flex-col gap-y-3" autocomplete="off">
    <VcInput
      v-maska
      data-maska="#### #### #### #### ###"
      :model-value="cardNumber"
      :label="labels.number"
      :message="formErrors.number || errors.number"
      :error="!!formErrors.number || !!errors.number"
      :readonly="readonly"
      :disabled="disabled"
      placeholder="1111 1111 1111 1111"
      minlength="12"
      maxlength="19"
      required
      @update:model-value="updateValue($event)"
      @input="input"
    />

    <VcInput
      v-model.trim="cardholderName"
      :label="labels.cardholderName"
      :message="formErrors.cardholderName || errors.cardholderName"
      :error="!!formErrors.cardholderName || !!errors.cardholderName"
      :readonly="readonly"
      :disabled="disabled"
      required
      @input="input"
    />

    <div class="flex flex-col gap-x-6 gap-y-3 sm:flex-row">
      <VcInput
        v-model="expirationDate"
        v-maska
        data-maska="## / ##"
        :label="labels.expirationDate"
        :placeholder="$t('shared.payment.bank_card_form.expiration_date_placeholder')"
        :message="expirationDateErrors"
        :error="!!expirationDateErrors"
        :readonly="readonly"
        :disabled="disabled"
        name="expirationDate"
        autocomplete="off"
        minlength="7"
        maxlength="7"
        class="basis-1/4"
        required
        @input="input"
      />

      <VcInput
        v-model="securityCode"
        v-maska
        data-maska="####"
        :label="labels.securityCode"
        :message="formErrors.securityCode || errors.securityCode"
        :error="!!formErrors.securityCode || !!errors.securityCode"
        :readonly="readonly"
        :disabled="disabled"
        type="password"
        placeholder="111"
        name="securityCode"
        autocomplete="off"
        minlength="3"
        maxlength="4"
        class="basis-1/4"
        hide-password-switcher
        required
        @input="input"
        @keyup.enter="$emit('submit')"
      />
    </div>
  </form>
</template>

<script setup lang="ts">
import { toTypedSchema } from "@vee-validate/yup";
import { clone } from "lodash";
import { vMaska } from "maska";
import { useField, useForm } from "vee-validate";
import { computed, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { object, string } from "yup";
import type { BankCardErrorsType, BankCardType } from "@/shared/payment";

const emit = defineEmits<IEmits>();
const props = withDefaults(defineProps<IProps>(), {
  errors: () => ({}),
});

interface IEmits {
  (event: "update:modelValue", bankCardData: Partial<BankCardType>): void;
  (event: "update:valid", value: boolean): void;
  (event: "submit"): void;
}

interface IProps {
  modelValue: BankCardType;
  valid?: boolean;
  readonly?: boolean;
  disabled?: boolean;
  errors?: BankCardErrorsType;
}

const { t } = useI18n();

const initialValues = ref<BankCardType>({ number: "", cardholderName: "", month: "", year: "", securityCode: "" });

const labels = computed(() => {
  return {
    number: t("shared.payment.bank_card_form.number_label"),
    cardholderName: t("shared.payment.bank_card_form.cardholder_name_label"),
    expirationDate: t("shared.payment.bank_card_form.expiration_date_label"),
    yearLabel: t("shared.payment.bank_card_form.year_label"),
    monthLabel: t("shared.payment.bank_card_form.month_label"),
    securityCode: t("shared.payment.bank_card_form.security_code_label"),
  };
});

const monthYupSchema = string()
  .required()
  .length(2)
  .matches(/^(0?[1-9]|1[0-2])$/, t("shared.payment.authorize_net.errors.month"))
  .label(labels.value.monthLabel);

const validationSchema = toTypedSchema(
  object({
    number: string().required().min(12).max(19).label(labels.value.number),
    cardholderName: string().required().max(64).label(labels.value.cardholderName),
    month: monthYupSchema,
    year: string().when("month", ([month], schema) => {
      return monthYupSchema.isValidSync(month) ? schema.length(2).label(labels.value.yearLabel) : schema;
    }),
    securityCode: string().required().min(3).max(4).label(labels.value.securityCode),
  }),
);

const { values, meta, errors: formErrors } = useForm<BankCardType>({ validationSchema, initialValues });

const { value: number } = useField<string>("number", undefined, { syncVModel: false });
const { value: cardholderName } = useField<string>("cardholderName", undefined, { syncVModel: false });
const { value: month } = useField<string>("month", undefined, { syncVModel: false });
const { value: year } = useField<string>("year", undefined, { syncVModel: false });
const { value: securityCode } = useField<string>("securityCode", undefined, { syncVModel: false });

const expirationDate = computed({
  get: () => (month.value.length > 1 || year.value ? `${month.value || "  "} / ${year.value}` : month.value),
  set(value: string) {
    const [rawMonth = "", rawYear = ""] = value.split(/\s*\/\s*/);
    month.value = rawMonth;
    year.value = rawYear;
  },
});

const expirationDateErrors = computed<string>(() =>
  [formErrors.value.month, formErrors.value.year, props.errors.month, props.errors.year].filter(Boolean).join(". "),
);

const cardNumber = computed<string | undefined>(() => (number.value ? number.value.match(/.{1,4}/g)?.join(" ") : ""));

function updateValue(value?: string): void {
  number.value = value ? value.replace(/ /g, "") : "";
}

function input() {
  emit("update:modelValue", clone(values));
}

watch(
  () => props.modelValue,
  (value) => (initialValues.value = clone(value)),
  { deep: true },
);

watch(
  () => meta.value.valid,
  (value) => emit("update:valid", value),
  { immediate: true },
);
</script>
