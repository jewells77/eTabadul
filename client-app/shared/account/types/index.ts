export enum RegistrationKind {
  personal = "personal",
  organization = "organization",
}

export type RegisterOrganization = {
  userName: string;
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  middleName?: string;
  organizationName?: string;
  companyCountry?: string;
  commercialRegistrationNumber?: string;
  companyType?: string;
  businessCategory?: string;
  salesRepresentative?: string;
  financialRepresentative?: string;
  companyClassification?: string;
  legalEntity?: string;
};

export type SignMeUp = {
  userName: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  nationalId: string;
  phoneNumber: string;
  fax: string;
};

export type SignMeIn = {
  email: string;
  password: string;
  rememberMe?: boolean;
};

export type ForgotPassword = {
  email: string;
  resetPasswordUrlPath: string;
};

export type ResetPassword = {
  userId: string;
  token: string;
  password: string;
};

export type ChangePassword = {
  userId: string;
  oldPassword: string;
  newPassword: string;
};

export type CheckoutDefaults = {
  deliveryMethod?: string;
  shippingMethodId?: string;
  paymentMethodCode?: string;
};

export type UserPersonalData = {
  firstName: string;
  lastName: string;
};

export type OrdersFilterData = {
  statuses: string[];
  startDate?: Date;
  endDate?: Date;
};

export type OrdersFilterChipsItem = {
  fieldName: keyof OrdersFilterData;
  value: string | Date;
  label: string;
};
