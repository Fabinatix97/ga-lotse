/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Alert } from "@eshg/lib-portal/components/Alert";
import { InputField } from "@eshg/lib-portal/components/formFields/InputField";
import { createFieldNameMapper } from "@eshg/lib-portal/helpers/form";
import { Divider, Stack, Typography } from "@mui/joy";

import { mapToApiBusinessModule } from "@/lib/businessModules/statistics/api/mapper/mapToApiBusinessModule";
import { EvaluationDetails } from "@/lib/businessModules/statistics/api/models/evaluationDetails";
import { CollapsableList } from "@/lib/businessModules/statistics/components/shared/CollapsableList";
import { SaveEvaluationTemplateStepFormModel } from "@/lib/businessModules/statistics/components/statistics/SaveAsEvaluationTemplateSidebar/SaveEvaluationTemplateStep/saveEvaluationTemplateStepFormModel";
import { SearchableGroups } from "@/lib/shared/components/SearchableGroups";
import { TextareaField } from "@/lib/shared/components/formFields/TextareaField";
import { businessModuleNames } from "@/lib/shared/components/procedures/constants";

export function SaveEvaluationTemplateStep({
  evaluationDetails,
}: {
  evaluationDetails: EvaluationDetails;
}) {
  const fieldName =
    createFieldNameMapper<SaveEvaluationTemplateStepFormModel>();

  const groups = evaluationDetails.analyses.map((evaluation) => ({
    name: evaluation.name,
    inAccordion: true,
    items: evaluation.diagramTitles.map((it, index) => ({
      key: index.toString(),
      searchableValue: it,
    })),
  }));

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
        <Stack gap={1}>
          <Typography level="title-md">Fachmodule</Typography>
          <Typography level="body-md">
            {
              businessModuleNames[
                mapToApiBusinessModule(evaluationDetails.businessModule)
              ]
            }
          </Typography>
        </Stack>
        <Stack gap={1}>
          <Typography level="title-md">Attribute</Typography>
          <CollapsableList items={evaluationDetails.attributeLabels} />
        </Stack>
        <Stack gap={2}>
          <Typography level="title-md">Analysen</Typography>
          <SearchableGroups
            groups={groups}
            renderItem={(item) => item.searchableValue}
            hideSearch={true}
          />
        </Stack>
        <Alert
          variant="soft"
          color="primary"
          message="Die Analysen und Diagramme der Vorlage werden an die Daten des gewählten Betrachtungszeitraums angepasst."
        />
      </Stack>
    </Stack>
  );
}
