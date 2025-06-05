/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Stack } from "@mui/joy";

import {
  Alert,
  InputField,
  SelectField,
  TextareaField,
} from "@eshg/lib-portal";

import { TextTemplateContextOptions } from "./constants";

export function TextTemplateFields() {
  return (
    <Stack gap={2}>
      <InputField
        label="Name"
        name="name"
        required="Bitte einen Namen angeben"
      />
      <SelectField
        label="Kontext"
        name="context"
        options={TextTemplateContextOptions}
        required="Bitte einen Kontext auswählen"
      />
      <TextareaField
        label="Inhalt"
        name="content"
        required="Bitte Text eingeben"
        placeholder="z.B. Wert-Name: $Eingabe"
      />
      <Alert
        color="primary"
        message={
          <>
            Das <strong>$</strong>-Zeichen kann als Platzhalter verwendet
            werden. Nach dem Einfügen kann man zwischen den Platzhalter mit{" "}
            <strong>Strg+Leertaste</strong> oder <strong>Strg+Eingabe</strong>{" "}
            springen.
          </>
        }
      />
    </Stack>
  );
}
