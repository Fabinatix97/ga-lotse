/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Divider, Stack, Typography } from "@mui/joy";

import { Alert, InputField } from "@eshg/lib-portal";

import { EvaluationTemplateDetails } from "@/lib/businessModules/statistics/api/models/evaluationTemplateDetails";
import {
  Analyses,
  Attributes,
  DataSource,
} from "@/lib/businessModules/statistics/components/evaluations/SidebarSummary";
import { SidebarStepContentProps } from "@/lib/shared/components/SidebarStepper/sidebarStep";

import { UploadTemplateFormModel } from "./uploadTemplateFormModel";

interface UploadTemplateStepProps
  extends SidebarStepContentProps<UploadTemplateFormModel> {
  evaluationTemplateDetails: EvaluationTemplateDetails;
}

export function UploadTemplateStep({
  evaluationTemplateDetails,
  fieldName,
}: UploadTemplateStepProps) {
  return (
    <Stack gap={3}>
      <Typography level="title-md">{evaluationTemplateDetails.name}</Typography>
      <Alert
        color="primary"
        message="Hochgeladene Auswertungsvorlagen werden mit anderen Gesundheitsämtern geteilt und stehen zur freien Nutzung zur Verfügung."
      />
      <InputField
        name={fieldName("name")}
        label="Name der Vorlage"
        required="Bitte Name angeben."
      />
      <InputField name={fieldName("description")} label="Beschreibung" />
      <InputField
        name={fieldName("contact")}
        label="Kontakt"
        required="Bitte Kontakt angeben."
      />
      <Divider />
      <DataSource dataSourceName={evaluationTemplateDetails.dataSourceName} />
      <Attributes attributeLabels={evaluationTemplateDetails.attributeLabels} />
      <Analyses analyses={evaluationTemplateDetails.analyses} />
    </Stack>
  );
}
