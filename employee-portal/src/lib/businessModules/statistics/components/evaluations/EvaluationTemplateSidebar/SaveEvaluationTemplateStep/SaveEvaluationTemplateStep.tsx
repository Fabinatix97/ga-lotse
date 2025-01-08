/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Alert } from "@eshg/lib-portal/components/Alert";
import { InputField } from "@eshg/lib-portal/components/formFields/InputField";
import { createFieldNameMapper } from "@eshg/lib-portal/helpers/form";
import { Divider, Stack, Typography } from "@mui/joy";

import { EvaluationDetails } from "@/lib/businessModules/statistics/api/models/evaluationDetails";
import { SaveEvaluationTemplateStepFormModel } from "@/lib/businessModules/statistics/components/evaluations/EvaluationTemplateSidebar/SaveEvaluationTemplateStep/saveEvaluationTemplateStepFormModel";
import {
  Analyses,
  Attributes,
  DataSource,
} from "@/lib/businessModules/statistics/components/evaluations/SidebarSummary";
import { TextareaField } from "@/lib/shared/components/formFields/TextareaField";

export function SaveEvaluationTemplateStep({
  evaluationDetails,
}: {
  evaluationDetails: EvaluationDetails;
}) {
  const fieldName =
    createFieldNameMapper<SaveEvaluationTemplateStepFormModel>();

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
        <DataSource dataSourceName={evaluationDetails.dataSourceName} />
        <Attributes attributeLabels={evaluationDetails.attributeLabels} />
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
