/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Box, Sheet, Stack, Typography } from "@mui/joy";
import { useFormikContext } from "formik";

import {
  CheckboxField,
  InputField,
  PERSON_FIELD_NAME,
  SelectField,
  useValidateLength,
} from "@eshg/lib-portal";

import {
  LANGUAGE_FIELD_NAME,
  LANGUAGE_OPTIONS,
} from "../../../shared/constants";

import { ConsultationFormData } from "./ConsultationForm";

export function LanguageSection() {
  return (
    <Sheet component={Stack}>
      <Typography level="h3" mb={3}>
        Sprache
      </Typography>
      <Stack gap={2}>
        <SelectField
          name="language.languageOfConsultation"
          label={LANGUAGE_FIELD_NAME.languageOfConsultation}
          options={LANGUAGE_OPTIONS}
        />
        <InterpreterCheckbox
          name="language.interpreterCalledIn"
          label={LANGUAGE_FIELD_NAME.interpreterCalledIn}
        />
      </Stack>
    </Sheet>
  );
}

function InterpreterCheckbox({ name, label }: { name: string; label: string }) {
  const { getFieldMeta, setFieldValue } =
    useFormikContext<ConsultationFormData>();
  const validateLength = useValidateLength();

  function isInterpreterChecked() {
    return getFieldMeta(name).value === true;
  }

  return (
    <Stack
      component="fieldset"
      aria-label={label}
      border={0}
      margin={0}
      padding={0}
      spacing={0}
      gap={2}
    >
      <CheckboxField
        name={name}
        label={label}
        onChange={async (e) => {
          const { checked } = e.target;
          await setFieldValue(name, checked);
          if (!checked) {
            await setFieldValue("language.interpreterName", "");
            await setFieldValue("language.interpreterLastName", "");
          }
        }}
      />
      {isInterpreterChecked() && (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: 2,
          }}
        >
          <InputField
            name="language.interpreterName"
            label={PERSON_FIELD_NAME.firstName}
            validate={(value) =>
              value ? validateLength(1, 80)(value) : undefined
            }
            sx={{ minWidth: 0 }}
          />
          <InputField
            name="language.interpreterLastName"
            label={PERSON_FIELD_NAME.lastName}
            validate={(value) =>
              value ? validateLength(1, 80)(value) : undefined
            }
            sx={{ minWidth: 0 }}
          />
        </Box>
      )}
    </Stack>
  );
}
