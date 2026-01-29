/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Divider, Stack } from "@mui/joy";

import {
  Alert,
  DateField,
  InputField,
  SelectField,
  buildEnumOptions,
  useValidateLength,
  validateDateOfBirthOfLegaLAge,
} from "@eshg/lib-portal";

import {
  DOCUMENT_TYPE_VALUES,
  PERSON_FIELD_NAME,
} from "../../../../shared/constants";
import { LanguageFields } from "../../../form/LanguageFields";

interface EditPersonDetailsFormProps {
  disablePersonFields: boolean;
}

export function EditPersonDetailsForm({
  disablePersonFields,
}: EditPersonDetailsFormProps) {
  const validateLength = useValidateLength();

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
        validate={validateLength(1, 120)}
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
    </Stack>
  );
}
