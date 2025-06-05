/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Stack, Typography } from "@mui/joy";

import { SchoolInfoLetter } from "@/lib/businessModules/schoolEntry/api/models/SchoolInfoLetter";

export function LetterHeader({ values }: { values: SchoolInfoLetter }) {
  return (
    <Stack gap={3} data-testid="letter-header">
      <Typography level="body-md">
        Schulinfobrief / Schulärztliches Gutachten
      </Typography>
      <Typography level="h2">
        Einschulungsuntersuchung {values.schoolYear}
      </Typography>
      <Stack flexDirection="row" gap={3}>
        <Typography level="h3">
          {values.child.name} <Typography fontWeight={400}>geb. </Typography>{" "}
          {values.child.dateOfBirth}
        </Typography>
        <Typography level="body-md">
          Untersuchungsdatum {values.date}
        </Typography>
      </Stack>
    </Stack>
  );
}
