/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Alert } from "@eshg/lib-portal/components/Alert";
import { InputField } from "@eshg/lib-portal/components/formFields/InputField";
import { createFieldNameMapper } from "@eshg/lib-portal/helpers/form";
import { Divider, Stack, Typography } from "@mui/joy";

import { EvaluationTemplateDetails } from "@/lib/businessModules/statistics/api/models/evaluationTemplateDetails";
import {
  Analyses,
  Attributes,
  DataSource,
} from "@/lib/businessModules/statistics/components/evaluations/SidebarSummary";

import { UploadTemplateFormModel } from "./uploadTemplateFormModel";

export function UploadTemplateStep({
  evaluationTemplateDetails,
}: {
  evaluationTemplateDetails: EvaluationTemplateDetails;
}) {
  const fieldName = createFieldNameMapper<UploadTemplateFormModel>();

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
