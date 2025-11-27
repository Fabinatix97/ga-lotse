/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiCountryCode } from "@eshg/base-api";
import {
  SidebarWithFormRefProps,
  UseSidebarWithFormRefResult,
  useSidebarWithFormRef,
} from "@eshg/lib-employee-portal";
import {
  OptionalFieldValue,
  mapOptionalDate,
  mapOptionalValue,
  mapRequiredValue,
  parseOptionalDate,
  parseOptionalValue,
  useSnackbar,
} from "@eshg/lib-portal";
import {
  ApiDocumentType,
  ApiPersonLanguage,
  ApiProcedureDetails,
} from "@eshg/prostitute-protection-api";

import { EditPersonDetailsForm } from "./EditPersonDetailsForm";
import { SidebarFormProvider } from "./SidebarFormProvider";

export interface EditPersonalDataForm {
  firstName: OptionalFieldValue<string>;
  lastName: string;
  alias: OptionalFieldValue<string>;
  dateOfBirth: OptionalFieldValue<string>;
  languages: ApiPersonLanguage[];
  hasSufficientGermanLanguageSkills: OptionalFieldValue<boolean>;
  nationality: OptionalFieldValue<ApiCountryCode>;
  documentType: OptionalFieldValue<ApiDocumentType>;
}

interface EditPersonDetailsSidebarProps extends SidebarWithFormRefProps {
  procedure: ApiProcedureDetails;
}

function EditPersonDetailsSidebar({
  formRef,
  onClose,
  procedure,
}: EditPersonDetailsSidebarProps) {
  const snackbar = useSnackbar();

  function handleSubmit(values: EditPersonalDataForm) {
    return new Promise((resolve) => {
      setTimeout(() => {
        snackbar.confirmation("Angaben zur Person erfolgreich aktualisiert");
        const apiValues = mapFormToApi(values);
        // eslint-disable-next-line no-console
        console.log({ personDetailsPayload: apiValues });
        onClose();
        resolve(true);
      }, 1000);
    });
  }

  const initialValues = mapApiToForm(procedure);

  return (
    <SidebarFormProvider
      formRef={formRef}
      initialValues={initialValues}
      title="Angaben zur Person bearbeiten"
      onClose={onClose}
      onSubmit={handleSubmit}
    >
      <EditPersonDetailsForm />
    </SidebarFormProvider>
  );
}

function mapApiToForm(procedure: ApiProcedureDetails): EditPersonalDataForm {
  const hasGerman = procedure.languages.includes(ApiPersonLanguage.German);

  return {
    firstName: parseOptionalValue(procedure.firstName),
    lastName: parseOptionalValue(procedure.lastName),
    alias: parseOptionalValue(procedure.alias),
    dateOfBirth: parseOptionalDate(procedure.dateOfBirth),
    languages: procedure.languages,
    hasSufficientGermanLanguageSkills: hasGerman,
    nationality: parseOptionalValue(procedure.nationality),
    documentType: parseOptionalValue(procedure.documentTypeDto),
  };
}

function mapFormToApi(values: EditPersonalDataForm) {
  return {
    firstName: mapOptionalValue(values.firstName),
    lastName: mapRequiredValue(values.lastName),
    alias: mapOptionalValue(values.alias),
    dateOfBirth: mapOptionalDate(values.dateOfBirth),
    languages: values.languages,
    nationality: mapOptionalValue(values.nationality),
    documentType: mapOptionalValue(values.documentType),
  };
}

export function useEditPersonDetailsSidebar(
  procedure: ApiProcedureDetails,
): UseSidebarWithFormRefResult {
  return useSidebarWithFormRef({
    component: (props) => (
      <EditPersonDetailsSidebar procedure={procedure} {...props} />
    ),
  });
}
