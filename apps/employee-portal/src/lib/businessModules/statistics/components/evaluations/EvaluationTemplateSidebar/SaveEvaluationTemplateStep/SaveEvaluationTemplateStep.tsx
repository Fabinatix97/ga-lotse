/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Divider, Stack, Typography } from "@mui/joy";

import {
  Alert,
  DetailsList,
  InputField,
  TextareaField,
} from "@eshg/lib-portal";

import { EvaluationDetails } from "@/lib/businessModules/statistics/api/models/evaluationDetails";
import { SaveEvaluationTemplateStepFormModel } from "@/lib/businessModules/statistics/components/evaluations/EvaluationTemplateSidebar/SaveEvaluationTemplateStep/saveEvaluationTemplateStepFormModel";
import {
  Analyses,
  Attributes,
  DataSource,
} from "@/lib/businessModules/statistics/components/evaluations/SidebarSummary";
import { SidebarStepContentProps } from "@/lib/shared/components/SidebarStepper/sidebarStep";

interface SaveEvaluationTemplateStepProps
  extends SidebarStepContentProps<SaveEvaluationTemplateStepFormModel> {
  evaluationDetails: EvaluationDetails;
}

export function SaveEvaluationTemplateStep({
  evaluationDetails,
  fieldName,
}: SaveEvaluationTemplateStepProps) {
  return (
    <Stack gap={3}>
      <Stack gap={2}>
        <InputField
          name={fieldName("name")}
          label="Name der Vorlage"
          required="Bitte Name angeben."
        />
        <TextareaField name={fieldName("description")} label="Beschreibung" />
      </Stack>
      <Divider />
      <Typography level="h3" component="h2">
        Zusammenfassung
      </Typography>
      <Stack gap={2}>
        <DetailsList>
          <Stack gap={2}>
            <DataSource dataSourceName={evaluationDetails.dataSourceName} />
            <Attributes attributeLabels={evaluationDetails.attributeLabels} />
          </Stack>
        </DetailsList>
        <Analyses analyses={evaluationDetails.analyses} />
        <Alert
          variant="soft"
          color="primary"
          message="Die Analysen und Diagramme der Vorlage werden an die Daten des gewählten Betrachtungszeitraums angepasst."
        />
      </Stack>
    </Stack>
  );
}
