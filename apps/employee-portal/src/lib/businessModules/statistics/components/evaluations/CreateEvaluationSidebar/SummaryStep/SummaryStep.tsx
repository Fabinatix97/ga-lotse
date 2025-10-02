/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Divider, Stack, Typography } from "@mui/joy";

import { DetailsList, InputField } from "@eshg/lib-portal";

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

interface SummaryStepProps
  extends SidebarStepContentProps<SummaryStepFormModel> {
  isEvaluationTemplateBranch: boolean;
  timeSpan: TimeSpan;
  anonymized: AnonymizedFieldValue;
  dataSource?: DataSource;
  selectedAttributes?: CategorizedFlatAttribute[];
  evaluationTemplateId?: string;
}

export function SummaryStep(props: SummaryStepProps) {
  if (props.isEvaluationTemplateBranch) {
    return (
      <SummaryStepFromTemplate
        evaluationTemplateId={props.evaluationTemplateId!}
        {...props}
      />
    );
  }

  return (
    <Summary
      dataSourceName={props.dataSource!.name}
      attributeLabels={props.selectedAttributes!.map(
        (attribute) => attribute.name,
      )}
      anonymizationOptions={props.dataSource!.anonymizationOptions}
      {...props}
    />
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
      <Stack gap={3}>
        <DetailsList>
          <Stack gap={3}>
            {props.evaluationTemplateName && (
              <Stack gap={1}>
                <Typography level="title-md" role="term">
                  Auswertungsvorlage
                </Typography>
                <Typography level="body-md" role="definition">
                  {props.evaluationTemplateName}
                </Typography>
              </Stack>
            )}
            <Stack gap={1}>
              <Typography level="title-md" role="term">
                Betrachtungszeitraum
              </Typography>
              <Typography level="body-md" role="definition">
                {formatDateRangeNumeric(
                  new Date(props.timeSpan.start),
                  new Date(props.timeSpan.end),
                )}
              </Typography>
            </Stack>
            <Stack gap={1}>
              <Typography level="title-md" role="term">
                Anonymisierung der Daten
              </Typography>
              <Typography level="body-md" role="definition">
                {willBeAnonymized(props.anonymized, props.anonymizationOptions)
                  ? "Ja"
                  : "Nein"}
              </Typography>
            </Stack>
            <Attributes attributeLabels={props.attributeLabels} />
          </Stack>
        </DetailsList>
        {props.analyses && <Analyses analyses={props.analyses} />}
      </Stack>
    </Stack>
  );
}
