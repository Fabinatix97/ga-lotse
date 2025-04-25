/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Divider, Stack, Typography } from "@mui/joy";

import { InputField } from "@eshg/lib-portal/components/formFields/InputField";

import { Analysis } from "@/lib/businessModules/statistics/api/models/analysis";
import { AnonymizationOptions } from "@/lib/businessModules/statistics/api/models/anonymizationOptions";
import { useGetEvaluationTemplateDetails } from "@/lib/businessModules/statistics/api/queries/useGetEvaluationTemplateDetails";
import { AnonymizedFieldValue } from "@/lib/businessModules/statistics/components/evaluations/AnonymizationConfiguration";
import { CategorizedFlatAttribute } from "@/lib/businessModules/statistics/components/evaluations/CreateEvaluationSidebar/ChooseAttributesStep/ChooseAttributesStep";
import { DataSource } from "@/lib/businessModules/statistics/components/evaluations/CreateEvaluationSidebar/ChooseDataSourceStep/ChooseDataSourceStep";
import { willBeAnonymized } from "@/lib/businessModules/statistics/components/evaluations/CreateEvaluationSidebar/CreateEvaluationFromScratchSidebar";
import { SummaryStepFormModel } from "@/lib/businessModules/statistics/components/evaluations/CreateEvaluationSidebar/SummaryStep/summaryStepFormModel";
import {
  Analyses,
  Attributes,
} from "@/lib/businessModules/statistics/components/evaluations/SidebarSummary";
import { SidebarStepContentProps } from "@/lib/shared/components/SidebarStepper/sidebarStep";
import { TimeSpan } from "@/lib/shared/components/formFields/TimeSpanField";
import { formatDateRangeNumeric } from "@/lib/shared/helpers/dateTime";

export interface SummaryStepProps
  extends SidebarStepContentProps<SummaryStepFormModel> {
  isEvaluationTemplateBranch: boolean;
  timeSpan: TimeSpan;
  anonymized: AnonymizedFieldValue;
  dataSource?: DataSource;
  selectedAttributes?: CategorizedFlatAttribute[];
  evaluationTemplateId?: string;
}

export function SummaryStep(props: SummaryStepProps) {
  return (
    <>
      {props.isEvaluationTemplateBranch ? (
        <SummaryStepFromTemplate
          evaluationTemplateId={props.evaluationTemplateId!}
          {...props}
        />
      ) : (
        <Summary
          dataSourceName={props.dataSource!.name}
          attributeLabels={props.selectedAttributes!.map(
            (attribute) => attribute.name,
          )}
          anonymizationOptions={props.dataSource!.anonymizationOptions}
          {...props}
        />
      )}
    </>
  );
}

interface SummaryStepFromTemplateProps
  extends SidebarStepContentProps<SummaryStepFormModel> {
  timeSpan: TimeSpan;
  anonymized: AnonymizedFieldValue;
  evaluationTemplateId: string;
}

function SummaryStepFromTemplate(props: SummaryStepFromTemplateProps) {
  const evaluationTemplate = useGetEvaluationTemplateDetails(
    props.evaluationTemplateId,
  );
  return (
    <Summary
      dataSourceName={evaluationTemplate.dataSourceName}
      attributeLabels={evaluationTemplate.attributeLabels}
      evaluationTemplateName={evaluationTemplate.name}
      analyses={evaluationTemplate.analyses}
      anonymizationOptions={evaluationTemplate.anonymizationOptions}
      {...props}
    />
  );
}

interface SummaryProps extends SidebarStepContentProps<SummaryStepFormModel> {
  timeSpan: TimeSpan;
  anonymized: AnonymizedFieldValue;
  anonymizationOptions: AnonymizationOptions;
  dataSourceName: string;
  attributeLabels: string[];
  evaluationTemplateName?: string;
  analyses?: Analysis[];
}

function Summary(props: SummaryProps) {
  return (
    <Stack gap={3}>
      <InputField
        name={props.fieldName("evaluationName")}
        label="Name der Auswertung"
        required="Bitte Name angeben."
      />
      <Divider />
      <Typography level="h4" component="h2">
        {props.dataSourceName}
      </Typography>
      {props.evaluationTemplateName && (
        <Stack gap={1}>
          <Typography level="title-md">Auswertungsvorlage</Typography>
          <Typography level="body-md">
            {props.evaluationTemplateName}
          </Typography>
        </Stack>
      )}
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
          {willBeAnonymized(props.anonymized, props.anonymizationOptions)
            ? "Ja"
            : "Nein"}
        </Typography>
      </Stack>
      <Attributes attributeLabels={props.attributeLabels} />
      {props.analyses && <Analyses analyses={props.analyses} />}
    </Stack>
  );
}
