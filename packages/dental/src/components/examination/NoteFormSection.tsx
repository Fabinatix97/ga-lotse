/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { FormLabel } from "@mui/joy";

import { TextareaField } from "@eshg/lib-portal";

import {
  ExaminationSectionTitle,
  ExaminationSheet,
} from "./ExaminationSection";

export function NoteFormSection() {
  return (
    <ExaminationSheet component="section">
      <TextareaField
        name="note"
        label={
          <FormLabel>
            <ExaminationSectionTitle marginBottom={3}>
              Kommentar
            </ExaminationSectionTitle>
          </FormLabel>
        }
      />
    </ExaminationSheet>
  );
}
