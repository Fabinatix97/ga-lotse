/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { InputField } from "@eshg/lib-portal/components/formFields/InputField";
import { createFieldNameMapper } from "@eshg/lib-portal/helpers/form";
import { Divider, Stack, Typography } from "@mui/joy";
import { useFormikContext } from "formik";

import { useGetEvaluationTemplateDetails } from "@/lib/businessModules/statistics/api/queries/useGetEvaluationTemplateDetails";
import {
  AnonymizedFieldValue,
  anonymizedFieldValueNames,
} from "@/lib/businessModules/statistics/components/evaluations/AnonymizationConfiguration";
import { SummaryStepFormModel } from "@/lib/businessModules/statistics/components/evaluations/CreateEvaluationSidebar/SummaryStep/summaryStepFormModel";
import { CreateEvaluationFromScratchFormModel } from "@/lib/businessModules/statistics/components/evaluations/CreateEvaluationSidebar/createEvaluationFromScratchFormModel";
import {
  Analyses,
  Attributes,
} from "@/lib/businessModules/statistics/components/evaluations/SidebarSummary";
import { OverlayBoundary } from "@/lib/shared/components/boundaries/OverlayBoundary";
import { TimeSpan } from "@/lib/shared/components/formFields/TimeSpanField";
import { formatDateRangeNumeric } from "@/lib/shared/helpers/dateTime";

export function SummaryStep() {
  const { values } = useFormikContext<CreateEvaluationFromScratchFormModel>();
  const fieldName = createFieldNameMapper<SummaryStepFormModel>();

  return (
    <Stack gap={3}>
      <InputField
        name={fieldName("evaluationName")}
        label="Name der Auswertung"
        required="Bitte Name angeben."
      />
      <Divider />
      {values._dataSourceId === "CHOOSE_EVALUATION_TEMPLATE" ? (
        <OverlayBoundary>
          <EvaluationTemplateSummary
            evaluationTemplateId={values.evaluationTemplateId!}
            timeSpan={values.timeSpan}
            anonymized={values.anonymized}
          />
        </OverlayBoundary>
      ) : (
        <Summary
          timeSpan={values.timeSpan}
          dataSourceName={values.dataSource!.name}
          attributeLabels={values.selectedAttributes!.map((it) => it.name)}
          anonymized={values.anonymized}
        />
      )}
    </Stack>
  );
}

function Summary(props: {
  timeSpan: TimeSpan;
  dataSourceName: string;
  attributeLabels: string[];
  anonymized: AnonymizedFieldValue;
}) {
  return (
    <>
      <Typography level="h4" component="h2">
        {props.dataSourceName}
      </Typography>
      <Stack gap={1}>
        <Typography level="title-md">Betrachtungszeitraum</Typography>
        <Typography level="body-md">
          {formatDateRangeNumeric(
            new Date(props.timeSpan.start),
            new Date(props.timeSpan.end),
          )}
        </Typography>
      </Stack>
      <Stack gap={1}>
        <Typography level="title-md">Anonymisierung der Daten</Typography>
        <Typography level="body-md">
          {anonymizedFieldValueNames[props.anonymized]}
        </Typography>
      </Stack>
      <Attributes attributeLabels={props.attributeLabels} />
    </>
  );
}

function EvaluationTemplateSummary(props: {
  evaluationTemplateId: string;
  timeSpan: TimeSpan;
  anonymized: AnonymizedFieldValue;
}) {
  const evaluationTemplateDetails = useGetEvaluationTemplateDetails(
    props.evaluationTemplateId,
  );
  return (
    <>
      <Typography level="h4" component="h2">
        {evaluationTemplateDetails.dataSourceName}
      </Typography>
      <Stack gap={1}>
        <Typography level="title-md">Auswertungsvorlage</Typography>
        <Typography level="body-md">
          {evaluationTemplateDetails.name}
        </Typography>
      </Stack>
      <Stack gap={1}>
        <Typography level="title-md">Betrachtungszeitraum</Typography>
        <Typography level="body-md">
          {formatDateRangeNumeric(
            new Date(props.timeSpan.start),
            new Date(props.timeSpan.end),
          )}
        </Typography>
      </Stack>
      <Stack gap={1}>
        <Typography level="title-md">Anonymisierung der Daten</Typography>
        <Typography level="body-md">
          {anonymizedFieldValueNames[props.anonymized]}
        </Typography>
      </Stack>
      <Attributes attributeLabels={evaluationTemplateDetails.attributeLabels} />
      <Analyses analyses={evaluationTemplateDetails.analyses} />
    </>
  );
}
