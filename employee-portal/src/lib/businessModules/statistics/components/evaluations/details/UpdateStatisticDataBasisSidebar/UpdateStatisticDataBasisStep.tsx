/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Alert } from "@eshg/lib-portal/components/Alert";
import { Stack, Typography } from "@mui/joy";

import { TimeSpanField } from "@/lib/shared/components/formFields/TimeSpanField";

export function UpdateStatisticDataBasisStep() {
  return (
    <Stack gap={3}>
      <Alert
        color="warning"
        title="Duplikat erstellt?"
        message="Die Datenbasis wird nach der Aktualisierung unwiderruflich ersetzt. Um ein Backup zu erstellen, legen Sie in der Übersicht ein Duplikat der Auswertung an."
      />
      <Typography level="h3" component="h2">
        Neuer Betrachtungszeitraum
      </Typography>
      <TimeSpanField
        initialExplicitStartAndEndChecked={true}
        name="timeSpan"
        label="Betrachtungszeitraum"
      />
    </Stack>
  );
}
