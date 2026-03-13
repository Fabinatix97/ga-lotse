/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Divider, Stack } from "@mui/joy";
import { useFormikContext } from "formik";

import {
  Alert,
  DateField,
  InputField,
  SelectField,
  buildEnumOptions,
  useValidateLength,
  validateDateOfBirthOfLegaLAge,
  validateTodayOrFutureDate,
} from "@eshg/lib-portal";
import { ApiDocumentType } from "@eshg/prostitute-protection-api";

import {
  DOCUMENT_TYPE_VALUES,
  PERSON_FIELD_NAME,
} from "../../../../shared/constants";
import { LanguageFields } from "../../../form/LanguageFields";

import { EditPersonalDataForm } from "./EditPersonDetailsSidebar";

interface EditPersonDetailsFormProps {
  disablePersonFields: boolean;
}

export function EditPersonDetailsForm({
  disablePersonFields,
}: EditPersonDetailsFormProps) {
  const validateLength = useValidateLength();
  const { values } = useFormikContext<EditPersonalDataForm>();
  return (
    <Stack gap={2}>
      {disablePersonFields && (
        <Alert
          color="warning"
          message="Nach erstellen eines Zertifikats sind Vorname, Nachname und Geburtsdatum nicht mehr bearbeitbar."
        />
      )}
      <InputField
        autoFocus
        name="firstName"
        label={PERSON_FIELD_NAME.firstName}
        required="Bitte einen Vornamen angeben."
        validate={validateLength(1, 80)}
        disabled={disablePersonFields}
      />
      <InputField
        name="lastName"
        label={PERSON_FIELD_NAME.lastName}
        required="Bitte einen Nachnamen angeben."
        validate={validateLength(1, 120)}
        disabled={disablePersonFields}
      />
      <DateField
        name="dateOfBirth"
        label={PERSON_FIELD_NAME.dateOfBirth}
        required="Bitte ein Geburtsdatum angeben."
        validate={validateDateOfBirthOfLegaLAge}
        disabled={disablePersonFields}
      />
      <InputField name="alias" label="Alias" validate={validateLength(1, 80)} />
      <Divider sx={{ marginBlock: 1 }} />
      <LanguageFields />
      <Divider sx={{ marginBlock: 1 }} />
      <SelectField
        name="documentType"
        label={PERSON_FIELD_NAME.documentType}
        options={buildEnumOptions(DOCUMENT_TYPE_VALUES)}
      />
      {values.documentType === ApiDocumentType.Other && (
        <InputField
          name="customDocumentType"
          label={PERSON_FIELD_NAME.customDocumentType}
          required="Bitte einen Dokumententyp angeben."
          validate={validateLength(1, 255)}
        />
      )}
      {values.documentType === ApiDocumentType.ResidencePermit && (
        <DateField
          name="residencePermitValidityDate"
          label={PERSON_FIELD_NAME.residencePermitValidityDate}
          required="Bitte ein Gültigkeitsdatum angeben."
          validate={validateTodayOrFutureDate(
            "Das Datum darf nicht in der Vergangenheit liegen.",
          )}
        />
      )}
    </Stack>
  );
}
