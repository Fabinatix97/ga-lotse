/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Stack } from "@mui/joy";

import { CheckboxField, TextareaField } from "@eshg/lib-portal";

import { CONSULTATION_FIELD_NAME } from "../../../shared/constants";

import { Section } from "./Section";

export function NotesSection() {
  return (
    <Section title="Anmerkungen">
      <Stack gap={2}>
        <CheckboxField
          name="supervisedConsultation"
          label={CONSULTATION_FIELD_NAME.supervisedConsultation}
        />
        <TextareaField
          name="remark"
          label={CONSULTATION_FIELD_NAME.remark}
          minRows={5}
        />
      </Stack>
    </Section>
  );
}
