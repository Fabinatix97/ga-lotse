/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Stack, Typography } from "@mui/joy";

import { AnonymizationOptions } from "@/lib/businessModules/statistics/api/models/anonymizationOptions";
import { DataSourceSensitivity } from "@/lib/businessModules/statistics/api/models/dataSourceSensitivity";
import { useGetEvaluationTemplateDetails } from "@/lib/businessModules/statistics/api/queries/useGetEvaluationTemplateDetails";
import { AnonymizationConfiguration } from "@/lib/businessModules/statistics/components/evaluations/AnonymizationConfiguration";
import { DataSource } from "@/lib/businessModules/statistics/components/evaluations/CreateEvaluationSidebar/ChooseDataSourceStep/ChooseDataSourceStep";
import {
  ChooseAttributeStepOrConfigureDataSourceStepFormModel,
  ChooseEvaluationTemplateOrConfigureDataSourceStepFormModel,
} from "@/lib/businessModules/statistics/components/evaluations/CreateEvaluationSidebar/createEvaluationFromScratchFormModel";
import { SidebarStepContentProps } from "@/lib/shared/components/SidebarStepper/sidebarStep";
import { TimeSpanField } from "@/lib/shared/components/formFields/TimeSpanField";

interface ConfigureDataSourceStepProps
  extends SidebarStepContentProps<
    | ChooseEvaluationTemplateOrConfigureDataSourceStepFormModel
    | ChooseAttributeStepOrConfigureDataSourceStepFormModel
  > {
  isEvaluationTemplateBranch: boolean;
  dataSource?: DataSource;
  evaluationTemplateId?: string;
  explicitStartAndEnd: boolean;
}

export function ConfigureDataSourceStep(props: ConfigureDataSourceStepProps) {
  if (props.isEvaluationTemplateBranch) {
    return (
      <ConfigureDataSourceFromTemplate
        evaluationTemplateId={props.evaluationTemplateId!}
        {...props}
      />
    );
  }

  return (
    <ConfigureDataSource
      name={props.dataSource!.name}
      sensitivity={props.dataSource!.sensitivity}
      anonymizationOptions={props.dataSource!.anonymizationOptions}
      {...props}
    />
  );
}

interface ConfigureDataSourceProps
  extends SidebarStepContentProps<
    | ChooseEvaluationTemplateOrConfigureDataSourceStepFormModel
    | ChooseAttributeStepOrConfigureDataSourceStepFormModel
  > {
  name: string;
  sensitivity: DataSourceSensitivity | undefined;
  anonymizationOptions: AnonymizationOptions;
  explicitStartAndEnd: boolean;
}

function ConfigureDataSource(props: ConfigureDataSourceProps) {
  return (
    <Stack gap={3}>
      <Typography level="h3" component="h2">
        {props.name}
      </Typography>
      <TimeSpanField
        name={props.fieldName("timeSpan")}
        label="Betrachtungszeitraum"
        initialExplicitStartAndEndChecked={props.explicitStartAndEnd}
      />
      <AnonymizationConfiguration
        sensitivity={props.sensitivity}
        name={props.fieldName("anonymized")}
        anonymizationOptions={props.anonymizationOptions}
      />
    </Stack>
  );
}

interface ConfigureDataSourceFromTemplateProps
  extends SidebarStepContentProps<
    | ChooseEvaluationTemplateOrConfigureDataSourceStepFormModel
    | ChooseAttributeStepOrConfigureDataSourceStepFormModel
  > {
  evaluationTemplateId: string;
  explicitStartAndEnd: boolean;
}

function ConfigureDataSourceFromTemplate(
  props: ConfigureDataSourceFromTemplateProps,
) {
  const { dataSourceName, dataSourceSensitivity, anonymizationOptions } =
    useGetEvaluationTemplateDetails(props.evaluationTemplateId);
  return (
    <ConfigureDataSource
      name={dataSourceName}
      sensitivity={dataSourceSensitivity}
      anonymizationOptions={anonymizationOptions}
      {...props}
    />
  );
}
