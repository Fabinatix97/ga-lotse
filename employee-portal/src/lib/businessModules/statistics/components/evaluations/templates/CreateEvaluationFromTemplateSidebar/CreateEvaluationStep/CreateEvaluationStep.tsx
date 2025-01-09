/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Alert } from "@eshg/lib-portal/components/Alert";
import { InputField } from "@eshg/lib-portal/components/formFields/InputField";
import { createFieldNameMapper } from "@eshg/lib-portal/helpers/form";
import { Divider, Stack, Typography } from "@mui/joy";

import { EvaluationTemplateDetails } from "@/lib/businessModules/statistics/api/models/evaluationTemplateDetails";
import { AnonymizationConfiguration } from "@/lib/businessModules/statistics/components/evaluations/AnonymizationConfiguration";
import {
  Analyses,
  Attributes,
  DataSource,
  Sensitivity,
} from "@/lib/businessModules/statistics/components/evaluations/SidebarSummary";
import { CreateEvaluationStepFormModel } from "@/lib/businessModules/statistics/components/evaluations/templates/CreateEvaluationFromTemplateSidebar/CreateEvaluationStep/createEvaluationStepFormModel";
import { TimeSpanField } from "@/lib/shared/components/formFields/TimeSpanField";

export function CreateEvaluationStep({
  evaluationTemplateDetails,
}: {
  evaluationTemplateDetails: EvaluationTemplateDetails;
}) {
  const fieldName = createFieldNameMapper<CreateEvaluationStepFormModel>();

  return (
    <Stack gap={3}>
      <InputField
        name={fieldName("name")}
        label="Name der Auswertung"
        required="Bitte Name angeben."
      />
      <Divider />
      <Typography level="h3" component="span">
        Datenquellen konfigurieren
      </Typography>
      <TimeSpanField
        name={fieldName("timeSpan")}
        label="Betrachtungszeitraum"
      />
      <Divider />
      <AnonymizationConfiguration
        name={fieldName("anonymized")}
        sensitivity={evaluationTemplateDetails.dataSourceSensitivity}
        anonymizationOptions={evaluationTemplateDetails.anonymizationOptions}
      />
      <Divider />
      <Typography level="h3" component="span">
        Zusammenfassung
      </Typography>
      <Stack gap={1}>
        <Typography level="title-md">Auswertungsvorlage</Typography>
        <Typography level="body-md">
          {evaluationTemplateDetails.name}
        </Typography>
      </Stack>
      <DataSource dataSourceName={evaluationTemplateDetails.dataSourceName} />
      <Sensitivity
        dataSourceSensitivity={evaluationTemplateDetails.dataSourceSensitivity}
      />
      <Attributes attributeLabels={evaluationTemplateDetails.attributeLabels} />
      <Analyses analyses={evaluationTemplateDetails.analyses} />
      <Alert
        variant="soft"
        color="primary"
        message="Die Analysen und Diagramme der Vorlage werden an die Daten des gewählten Betrachtungszeitraums angepasst."
      />
    </Stack>
  );
}
