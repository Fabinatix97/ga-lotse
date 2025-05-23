/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Stack, Typography } from "@mui/joy";

import { Alert } from "@eshg/lib-portal";

import { SidebarStepContentProps } from "@/lib/shared/components/SidebarStepper/sidebarStep";
import { TimeSpanField } from "@/lib/shared/components/formFields/TimeSpanField";

import { UpdateEvaluationDataBasisFormModel } from "./updateEvaluationDataBasisFormModel";

export function UpdateEvaluationDataBasisStep(
  props: SidebarStepContentProps<UpdateEvaluationDataBasisFormModel>,
) {
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
        initialExplicitStartAndEndChecked
        name={props.fieldName("timeSpan")}
        label="Betrachtungszeitraum"
      />
    </Stack>
  );
}
