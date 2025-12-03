/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Stack, Typography } from "@mui/joy";

import { CheckboxField, TextareaField } from "@eshg/lib-portal";

import { CONSULTATION_FIELD_NAME } from "../../../shared/constants";

import { SectionGrid } from "./SectionGrid";

export function NotesSection() {
  return (
    <SectionGrid defaultColumn={1} sx={{ mt: 6 }}>
      <Typography level="h3">Anmerkungen</Typography>
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
    </SectionGrid>
  );
}
