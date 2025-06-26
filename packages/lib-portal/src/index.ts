/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

export {
  type ApiConfiguration,
  ApiProvider,
  useApiConfiguration,
  useApiConfigurationUrl,
} from "./api/ApiProvider";
export {
  type FeatureToggleQueryOptions,
  selectDisabledOldFeature,
  selectEnabledNewFeature,
  useGetFeatureToggle,
  useGetFeatureToggleUnsuspended,
} from "./api/featureToggles";
export { HiddenDownloadContainer } from "./api/files/HiddenDownloadContainer";
export {
  downloadFileAndOpen,
  getFilenameFromHeader,
  useFileDownload,
} from "./api/files/download";
export { type QueryKeyFactory, queryKeyFactory } from "./api/queryKeyFactory";
export {
  SEMI_STATIC_QUERY_OPTIONS,
  STATIC_QUERY_OPTIONS,
} from "./api/queryOptions";
export { unwrapRawResponse } from "./api/unwrapRawResponse";
export { useHandledBackgroundQuery } from "./api/useHandledBackgroundQuery";
export { useHandledMutation } from "./api/useHandledMutation";

export { Alert, type AlertProps } from "./components/Alert";
export {
  BaseModal,
  type BaseModalProps,
  type BaseModalPropsRequiredClose,
} from "./components/BaseModal";
export {
  EnvironmentIndicator,
  useEnvironmentIndicatorHeight,
} from "./components/EnvironmentIndicator";
export { EnvironmentTypeProvider } from "./components/EnvironmentTypeProvider";
export { LoadingIndicator } from "./components/LoadingIndicator";
export { LoadingOverlay } from "./components/LoadingOverlay";
export { LoadingOverlayHiddenBackdrop } from "./components/LoadingOverlayHiddenBackdrop";
export { Markdown, defaultComponents } from "./components/Markdown";
export { NonceProvider, useNonce } from "./components/NonceProvider";
export { Row } from "./components/Row";
export {
  BaseErrorModal,
  type ErrorModalProps,
} from "./components/boundaries/BaseErrorModal";
export {
  BaseOverlayBoundary,
  type BaseOverlayBoundaryProps,
} from "./components/boundaries/BaseOverlayBoundary";
export {
  NextErrorBoundary,
  type NextErrorBoundaryProps,
} from "./components/boundaries/NextErrorBoundary";
export { QueryBoundary } from "./components/boundaries/QueryBoundary";
export { ButtonLink } from "./components/buttons/ButtonLink";
export { SubmitButton } from "./components/buttons/SubmitButton";
export {
  BaseConfirmationDialog,
  type ConfirmationDialogProps,
} from "./components/confirmationDialog/BaseConfirmationDialog";
export {
  BaseConfirmationDialogButtonBar,
  type DialogButtonBarProps,
} from "./components/confirmationDialog/BaseConfirmationDialogButtonBar";
export {
  ConfirmationDialogContext,
  type ConfirmationDialogOptions,
  ConfirmationDialogProvider,
} from "./components/confirmationDialog/ConfirmationDialogProvider";
export {
  BaseDetailsItem,
  BaseDetailsItemLabel,
  type BaseDetailsItemProps,
  BaseDetailsItemValue,
} from "./components/details/BaseDetailsItem";
export { DetailsList } from "./components/details/DetailsList";
export {
  DisabledFormProvider,
  useIsFormDisabled,
} from "./components/form/DisabledFormContext";
export { FormAddMoreButton } from "./components/form/FormAddMoreButton";
export { FormPlus, scrollToFirstFormError } from "./components/form/FormPlus";
export {
  MultiStepForm,
  type StepFactory,
  useMultiStepForm,
} from "./components/form/MultiStepForm";
export {
  MultiAutocompleteField,
  type MultiAutocompleteFieldProps,
} from "./components/formFields/autocomplete/MultiAutocompleteField";
export {
  type FieldOrientation,
  SoftRequiredBooleanSelectField,
  SoftRequiredInput,
  SoftRequiredNumberField,
  SoftRequiredSelectField,
  resolveFieldComponent,
  type SoftRequiredSelectFieldProps,
} from "./components/form/fieldVariants";
export {
  BaseField,
  type BaseFieldProps,
  type FieldComponentProps,
  FormHelperTextWithIcon,
  renderHelperText,
  renderLabel,
  useBaseField,
} from "./components/formFields/BaseField";
export {
  BooleanRadioField,
  type BooleanRadioGroupFieldProps,
} from "./components/formFields/BooleanRadioField";
export { BooleanSelectField } from "./components/formFields/BooleanSelectField";
export {
  CheckboxField,
  type CheckboxFieldProps,
} from "./components/formFields/CheckboxField";
export { CheckboxGroupField } from "./components/formFields/CheckboxGroupField";
export { DateField } from "./components/formFields/DateField";
export { DecoratedInputField } from "./components/formFields/DecoratedInputField";
export { EmailField } from "./components/formFields/EmailField";
export {
  FieldArrayWithFocus,
  type FieldArrayRenderExtendedProps,
} from "./components/formFields/FieldArrayWithFocus";
export {
  FieldSetColumn,
  FieldSetControl,
} from "./components/formFields/FieldSetControl";
export { HorizontalField } from "./components/formFields/HorizontalField";
export {
  InputArrayField,
  getIndexLabel,
} from "./components/formFields/InputArrayField";
export {
  InputField,
  type InputFieldProps,
} from "./components/formFields/InputField";
export { Legend } from "./components/formFields/Legend";
export {
  type MonthAndYear,
  MonthAndYearFields,
  type MonthAndYearFieldsProps,
  mapMonthAndYear,
} from "./components/formFields/MonthAndYearFields";
export { NumberField } from "./components/formFields/NumberField";
export { PhoneNumberField } from "./components/formFields/PhoneNumberField";
export {
  RadioButtonsField,
  type RadioButtonsFieldProps,
} from "./components/formFields/RadioButtonsField";
export {
  RadioGroupField,
  type RadioGroupFieldProps,
} from "./components/formFields/RadioGroupField";
export {
  SelectField,
  type SelectFieldOption,
  type SelectFieldProps,
  type SelectFieldValue,
} from "./components/formFields/SelectField";
export {
  SelectObjectField,
  type SelectObjectFieldValue,
} from "./components/formFields/SelectObjectField";
export {
  type SelectOption,
  SelectOptions,
  optionsFromRecord,
} from "./components/formFields/SelectOptions";
export {
  DebouncedTextareaField,
  TextareaField,
  type TextareaFieldProps,
} from "./components/formFields/TextareaField";
export type { FieldVariantProps } from "./components/formFields/types";
export { YearField } from "./components/formFields/YearField";
export {
  type YesOrNoFieldData,
  YesOrNoWithFollowUp,
  mapBoolToYesOrNo,
  mapYesOrNoToBool,
} from "./components/formFields/YesOrNoWithFollowUp";
export { type AppointmentListProps } from "./components/formFields/appointmentPicker/AppointmentListForDate";
export {
  type Appointment,
  AppointmentPickerField,
  type AppointmentPickerFieldProps,
  type AppointmentPickerLayoutProps,
} from "./components/formFields/appointmentPicker/AppointmentPickerField";
export {
  formatAppointmentTime,
  isSameAppointment,
} from "./components/formFields/appointmentPicker/helpers";
export { APPOINTMENT_PICKER_FIELD_LABELS_DE } from "./components/formFields/appointmentPicker/labels";
export {
  SingleAutocompleteField,
  type SingleAutocompleteFieldProps,
} from "./components/formFields/autocomplete/SingleAutocompleteField";
export {
  AcademicTitle,
  GENDER_OPTIONS,
  GENDER_VALUES,
  PERSON_FIELD_NAME,
  SALUTATION_OPTIONS,
  SALUTATION_VALUES,
  TITLE_OPTIONS,
  TITLE_VALUES,
  getOptionalTitle,
} from "./components/formFields/constants";
export { formatFileSize } from "./components/formFields/file/helpers";
export { type FileLike, FileType } from "./components/formFields/file/types";
export { validateFileName } from "./components/formFields/file/validators";
export { useDragAndDrop } from "./components/formFields/file/useDragAndDrop";
export { ExpandNavigation } from "./components/icons/ExpandNavigation";
export { CustomAutocomplete } from "./components/inputs/CustomAutocomplete";
export { YearInput } from "./components/inputs/YearInput";
export { LiveAnnouncer } from "./components/liveAnnouncer/LiveAnnouncer";
export {
  ExternalLink,
  ExternalLinkButton,
  ExternalLinkIconButton,
} from "./components/navigation/externalLinks";
export {
  InternalLink,
  InternalLinkButton,
  InternalLinkIconButton,
} from "./components/navigation/internalLinks";
export {
  NavigationContextProvider,
  type OnBeforeNavigateProps,
  useNavigation,
} from "./components/navigation/NavigationContext";
export { NavigationLink } from "./components/navigation/NavigationLink";
export {
  type Snackbar,
  type SnackbarComponentProps,
  SnackbarProvider,
  useSnackbar,
} from "./components/snackbar/SnackbarProvider";
export { ThemeRegistry } from "./components/themeRegistry/ThemeRegistry";

export { apiMiddlewares } from "./config/apiMiddlewares";

export {
  AlertSlot,
  useAlert,
  useControlledAlert,
  useResetAlertContext,
} from "./errorHandling/AlertContext";
export { ErrorAlert } from "./errorHandling/ErrorAlert";
export { PortalError } from "./errorHandling/PortalError";
export { PortalErrorCode } from "./errorHandling/PortalErrorCode";
export {
  getCloseable,
  getErrorAction,
  getErrorDescription,
} from "./errorHandling/errorMappers";
export { resolveError } from "./errorHandling/errorResolvers";

export {
  formatDate,
  formatDateTime,
  formatTime,
  formatWeekdayDateTime,
  formatWeekdayDateTimeRange,
} from "./formatters/dateTime";
export { formatFacilityName } from "./formatters/facility";
export { formatCurrency } from "./formatters/numbers";
export {
  OPTIONAL_FALLBACK_VALUE,
  formatOptional,
  formatOptionalKey,
} from "./formatters/optional";
export { formatPersonName, formatUserName } from "./formatters/person";

export { assertNever, assertNonEmptyArray } from "./helpers/assertions";
export { countryOptions, translateCountry } from "./helpers/countryOption";
export {
  TIME_FORMAT,
  calculateAge,
  durationBetweenDatesInMinutes,
  formatDateToFullReadableString,
  formatDateToYear,
  isAdult,
  isDateCurrentDateOrGreater,
  isDateString,
  isTimeString,
  toDateString,
  toDateTimeString,
  toUtcDate,
} from "./helpers/dateTime";
export {
  NO_SELECTION_LABEL,
  addMissingKeys,
  buildEnumOptions,
  createFieldNameMapper,
  dropBlankStrings,
  dropEmptyKeys,
  mapNullableValue,
  mapOptionalDate,
  mapOptionalString,
  mapOptionalValue,
  mapRequiredValue,
  parseOptionalDate,
  parseOptionalValue,
} from "./helpers/form";
export { getPropertyIf } from "./helpers/getProperty";
export {
  ensureArray,
  isBlankString,
  isEmptyString,
  isInteger,
  isNonEmptyArray,
  isNonEmptyString,
} from "./helpers/guards";
export { encodeReservedHtmlCharacters } from "./helpers/htmlStringEncoder";
export { ifDefined } from "./helpers/ifDefined";
export { getLastPage } from "./helpers/paginationHelper";
export { isValidURL } from "./helpers/url";
export {
  validateDateOfBirth,
  validateDateTime,
  validateEmail,
  validateHexColorCode,
  validateInteger,
  validateIntegerAnd,
  validatePipe,
  validateLength,
  validatePositiveInteger,
  validateRange,
  validateRegex,
  validateTime,
  validateZipCode,
  validateGermanZipCode,
  validateTodayOrFutureDate,
} from "./helpers/validators";

export { useIsBreakpointDown, useIsMobile } from "./hooks/theme";
export { useHasChanged } from "./hooks/useHasChanged";
export { useIsActiveRoute } from "./hooks/useIsActiveRoute";
export { useMonthAndYearValidationsRules } from "./hooks/useMonthAndYearValidations";
export { useNavigateEffect } from "./hooks/useNavigateEffect";
export { usePrevious } from "./hooks/usePrevious";
export { useToggleableState } from "./hooks/useToggleableState";
export { useUuid } from "./hooks/useUuid";
export {
  useValidateEmail,
  useValidateFile,
  useValidateFileType,
  useValidateLength,
  useValidateNumber,
  useValidatePastOrTodayDate,
  useValidateZipCode,
  useValidateGermanZipCode,
} from "./hooks/useValidators";
export { useWindowDimensions } from "./hooks/useWindowDimension";

export { de } from "./i18n/locales/de";
export { loadLocale } from "./i18n/loadLocale";
export { i18nNamespace } from "./i18n/namespace";
export { useTranslation } from "./i18n/useTranslation";

export { useIsServer } from "./next/renderingHooks";

export type {
  FieldProps,
  FormProps,
  NestedFormProps,
  NullableFieldValue,
  OptionalFieldValue,
  SetFieldValueHelper,
  ValidationRules,
  Validator,
} from "./types/form";
export type { EnumMap } from "./types/helpers";
export type {
  DynamicLayoutProps,
  DynamicPageProps,
  LayoutProps,
  PageProps,
  RouteParams,
  SearchParams,
} from "./types/pageParams";
export type { MutationBundle, MutationPassThrough } from "./types/query";
export type { RequiresChildren } from "./types/react";
export type { Nullable, WithRequired } from "./types/utility";
