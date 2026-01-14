/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

export {
  buildEmptyEmployeeChangeEntry,
  INITIAL_PROCEDURE_FORM_VALUES,
  type DataPrivacyFormValues,
  type EmployeeChangeEntry,
  type EmployeeInformationFormValues,
  type EmployeesFormValues,
  type GeneralInformationFormValues,
  type MedicalRegistryCreateProcedureFormValues,
  type OccupationalInformationFormValues,
  type PersonalInformationFormValues,
  type PracticeInformationFormValues,
  type ProfessionalismInformationFormValues,
  type RequiredDocumentsFormValues,
  type WrittenConfirmationFormValues,
} from "./components/createProcedureForm/createProcedureFormValues";

export {
  CHANGE_TYPE_NAMES,
  EMPLOYEE_CHANGE_TYPE_NAMES,
  EMPLOYMENT_STATUS_NAMES,
  EMPLOYMENT_TYPE_NAMES,
  PROFESSIONAL_TITLE_NAMES,
} from "./config/constants";

export { useValidateLifetimeDoctorNumber } from "./hooks/useValidators";

export { mapCreateProcedureRequest } from "./utils/mapper";
export { shouldEnableSection } from "./utils/sections";
