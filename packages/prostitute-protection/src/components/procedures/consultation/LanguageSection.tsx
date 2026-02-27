/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Stack } from "@mui/joy";
import { useFormikContext } from "formik";

import {
  CheckboxField,
  InputField,
  InputFieldProps,
  SingleAutocompleteField,
  useValidateLength,
} from "@eshg/lib-portal";

import {
  CONSULTATION_FIELD_NAME,
  LANGUAGE_OPTIONS,
} from "../../../shared/constants";

import { ConsultationFormData } from "./ConsultationForm";
import { Section, SectionColumn, SectionGridContainer } from "./Section";

export function LanguageSection() {
  return (
    <Section title="Sprache">
      <SectionGridContainer>
        <SectionColumn>
          <SingleAutocompleteField
            options={LANGUAGE_OPTIONS}
            name="languageOfConsultation"
            label={CONSULTATION_FIELD_NAME.languageOfConsultation}
          />
          <InterpreterInputFields />
        </SectionColumn>
      </SectionGridContainer>
    </Section>
  );
}

function InterpreterInputFields() {
  const { values } = useFormikContext<ConsultationFormData>();
  return (
    <Stack gap={3} role="group" aria-label="Dolmetscher">
      <CheckboxField
        name="interpreterConsulted"
        label={CONSULTATION_FIELD_NAME.interpreterConsulted}
        aria-label={
          values.interpreterConsulted ? "Nicht mehr hinzuziehen" : "Hinzuziehen"
        }
      />
      <Stack
        display={values.interpreterConsulted ? "flex" : "none"}
        direction="row"
        gap={3}
        flexWrap="wrap"
      >
        <InterpreterInputField
          name="interpreterFirstName"
          label={CONSULTATION_FIELD_NAME.interpreterFirstName}
        />
        <InterpreterInputField
          name="interpreterLastName"
          label={CONSULTATION_FIELD_NAME.interpreterLastName}
        />
      </Stack>
    </Stack>
  );
}

function InterpreterInputField(props: InputFieldProps) {
  const validateLength = useValidateLength();

  return (
    <InputField
      {...props}
      validate={(value) => (value ? validateLength(1, 80)(value) : undefined)}
      sx={{ flex: 1 }}
    />
  );
}
