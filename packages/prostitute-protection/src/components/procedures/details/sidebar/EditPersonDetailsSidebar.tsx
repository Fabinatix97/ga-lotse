/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { isDefined } from "remeda";

import {
  SidebarWithFormRefProps,
  UseSidebarWithFormRefResult,
  useSidebarWithFormRef,
} from "@eshg/lib-employee-portal";
import {
  OptionalFieldValue,
  mapOptionalValue,
  parseOptionalDate,
  parseOptionalValue,
} from "@eshg/lib-portal";
import {
  ApiDocumentType,
  ApiPersonLanguage,
  ApiProcedureDetails,
  ApiUpdateEncryptedPersonalDataRequest,
} from "@eshg/prostitute-protection-api";

import { useUpdateProcedurePersonalDataMutation } from "../../../../api/mutations/procedures";
import { useDecryptedPersons } from "../../../../contexts/decryptedPersons/DecryptedPersonsStoreProvider";
import { DecryptedPerson } from "../../../../contexts/decryptedPersons/decryptedPersonsStore";
import { LanguageFieldsData } from "../../../form/LanguageFields";

import { EditPersonDetailsForm } from "./EditPersonDetailsForm";
import { SidebarFormProvider } from "./SidebarFormProvider";

export interface EditPersonalDataForm extends LanguageFieldsData {
  firstName: OptionalFieldValue<string>;
  lastName: string;
  alias: OptionalFieldValue<string>;
  dateOfBirth: OptionalFieldValue<string>;
  documentType: OptionalFieldValue<ApiDocumentType>;
  version: number;
}

interface EditPersonDetailsSidebarProps extends SidebarWithFormRefProps {
  procedure: ApiProcedureDetails;
}

function EditPersonDetailsSidebar({
  formRef,
  onClose,
  procedure,
}: EditPersonDetailsSidebarProps) {
  const updateProcedurePersonalData = useUpdateProcedurePersonalDataMutation(
    procedure.id,
  );
  const { addDecryptedPerson, getDecryptedPerson } = useDecryptedPersons();
  const personData = getDecryptedPerson(procedure.id);

  const hasEncryptedData = procedure.hasEncryptedData;
  const isCertificateCreated = isDefined(
    procedure.consultationCertificateCreatedAt,
  );

  async function handleSubmit(values: EditPersonalDataForm) {
    const personalData = mapFormToApi(values);
    await updateProcedurePersonalData.mutateAsync(personalData, {
      onSuccess: () => {
        addDecryptedPerson({
          id: procedure.id,
          firstName: values.firstName,
          lastName: values.lastName,
          dateOfBirth: new Date(values.dateOfBirth),
        });
        onClose(true);
      },
    });
  }

  const initialValues = mapApiToForm(procedure, personData);

  return (
    <SidebarFormProvider
      formRef={formRef}
      initialValues={initialValues}
      title="Angaben zur Person"
      onClose={onClose}
      onSubmit={handleSubmit}
    >
      <EditPersonDetailsForm
        disablePersonFields={hasEncryptedData && isCertificateCreated}
      />
    </SidebarFormProvider>
  );
}

function mapApiToForm(
  procedure: ApiProcedureDetails,
  personData?: DecryptedPerson,
): EditPersonalDataForm {
  const hasGerman = procedure.languages.includes(ApiPersonLanguage.German);

  return {
    firstName: parseOptionalValue(personData?.firstName),
    lastName: parseOptionalValue(personData?.lastName),
    alias: parseOptionalValue(procedure.alias),
    dateOfBirth: parseOptionalDate(personData?.dateOfBirth),
    languages: procedure.languages,
    hasSufficientGermanLanguageSkills: hasGerman,
    documentType: parseOptionalValue(procedure.documentTypeDto),
    version: procedure.version,
  };
}

function mapFormToApi(
  values: EditPersonalDataForm,
): ApiUpdateEncryptedPersonalDataRequest {
  return {
    firstName: values.firstName,
    lastName: values.lastName,
    alias: mapOptionalValue(values.alias),
    dateOfBirth: new Date(values.dateOfBirth),
    languages: values.languages,
    documentType: mapOptionalValue(values.documentType),
    version: values.version,
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
