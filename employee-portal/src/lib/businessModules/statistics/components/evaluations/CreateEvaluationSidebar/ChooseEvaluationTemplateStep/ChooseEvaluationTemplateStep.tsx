/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Alert } from "@eshg/lib-portal/components/Alert";
import { SingleAutocompleteField } from "@eshg/lib-portal/components/formFields/autocomplete/SingleAutocompleteField";
import { InternalLinkButton } from "@eshg/lib-portal/components/navigation/InternalLinkButton";
import { createFieldNameMapper } from "@eshg/lib-portal/helpers/form";
import { OpenInNewOutlined } from "@mui/icons-material";
import { Divider, Sheet, Stack, Typography } from "@mui/joy";
import { useFormikContext } from "formik";

import { useGetEvaluationTemplateDetails } from "@/lib/businessModules/statistics/api/queries/useGetEvaluationTemplateDetails";
import { ChooseEvaluationTemplateStepFormModel } from "@/lib/businessModules/statistics/components/evaluations/CreateEvaluationSidebar/ChooseEvaluationTemplateStep/chooseEvaluationTemplateStepFormModel";
import {
  Analyses,
  Attributes,
  DataSource,
} from "@/lib/businessModules/statistics/components/evaluations/SidebarSummary";
import { routes } from "@/lib/businessModules/statistics/shared/routes";
import { OverlayBoundary } from "@/lib/shared/components/boundaries/OverlayBoundary";

export interface EvaluationTemplateStepAutocompleteEntry {
  id: string;
  name: string;
}

export function ChooseEvaluationTemplateStep({
  evaluationTemplates,
}: {
  evaluationTemplates: EvaluationTemplateStepAutocompleteEntry[];
}) {
  const fieldName =
    createFieldNameMapper<ChooseEvaluationTemplateStepFormModel>();
  const { values } = useFormikContext<ChooseEvaluationTemplateStepFormModel>();

  const autocompleteOptions = evaluationTemplates.map((it) => ({
    value: it.id,
    label: it.name,
  }));

  return (
    <Stack gap={3}>
      <SingleAutocompleteField
        label="Vorlage wählen"
        placeholder="Bitte wählen"
        required="Bitte Vorlage auswählen."
        options={autocompleteOptions}
        name={fieldName("evaluationTemplateId")}
      />
      {values.evaluationTemplateId && (
        <OverlayBoundary>
          <Summary evaluationTemplateId={values.evaluationTemplateId} />
        </OverlayBoundary>
      )}
      <Divider />
      <InternalLinkButton
        href={routes.evaluations.templates.index}
        variant="plain"
        sx={{ alignSelf: "flex-end" }}
        endDecorator={<OpenInNewOutlined />}
      >
        Zur Vorlagentabelle
      </InternalLinkButton>
    </Stack>
  );
}

function Summary(props: { evaluationTemplateId: string }) {
  const evaluationTemplateDetails = useGetEvaluationTemplateDetails(
    props.evaluationTemplateId,
  );

  return (
    <Sheet variant="plain">
      <Stack gap={3}>
        {evaluationTemplateDetails.description && (
          <Stack gap={1}>
            <Typography level="title-md">Beschreibung</Typography>
            <Typography level="body-md">
              {evaluationTemplateDetails.description}
            </Typography>
          </Stack>
        )}
        <DataSource dataSourceName={evaluationTemplateDetails.dataSourceName} />
        <Attributes
          attributeLabels={evaluationTemplateDetails.attributeLabels}
        />
        <Analyses analyses={evaluationTemplateDetails.analyses} />
        <Alert
          variant="soft"
          color="primary"
          message="Die Analysen und Diagramme der Vorlage werden an die Daten des gewählten Betrachtungszeitraums angepasst."
        />
      </Stack>
    </Sheet>
  );
}
