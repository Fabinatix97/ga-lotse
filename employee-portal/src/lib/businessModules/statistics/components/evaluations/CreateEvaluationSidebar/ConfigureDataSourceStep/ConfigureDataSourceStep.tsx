/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { createFieldNameMapper } from "@eshg/lib-portal/helpers/form";
import { Stack, Typography } from "@mui/joy";
import { useFormikContext } from "formik";

import { AnonymizationOptions } from "@/lib/businessModules/statistics/api/models/anonymizationOptions";
import { DataSourceSensitivity } from "@/lib/businessModules/statistics/api/models/dataSourceSensitivity";
import { useGetEvaluationTemplateDetails } from "@/lib/businessModules/statistics/api/queries/useGetEvaluationTemplateDetails";
import { AnonymizationConfiguration } from "@/lib/businessModules/statistics/components/evaluations/AnonymizationConfiguration";
import { ChooseDataSourceStepFormModel } from "@/lib/businessModules/statistics/components/evaluations/CreateEvaluationSidebar/ChooseDataSourceStep/chooseDataSourceStepFormModel";
import { ChooseEvaluationTemplateStepFormModel } from "@/lib/businessModules/statistics/components/evaluations/CreateEvaluationSidebar/ChooseEvaluationTemplateStep/chooseEvaluationTemplateStepFormModel";
import { ConfigureDataSourceStepFormModel } from "@/lib/businessModules/statistics/components/evaluations/CreateEvaluationSidebar/ConfigureDataSourceStep/configureDataSourceStepFormModel";
import { OverlayBoundary } from "@/lib/shared/components/boundaries/OverlayBoundary";
import { TimeSpanField } from "@/lib/shared/components/formFields/TimeSpanField";

export function ConfigureDataSourceStep() {
  const { values } = useFormikContext<
    ChooseDataSourceStepFormModel & ChooseEvaluationTemplateStepFormModel
  >();

  return (
    <Stack gap={3}>
      {values.dataSource && (
        <DataSource
          name={values.dataSource.name}
          sensitivity={values.dataSource.sensitivity}
          anonymizationOptions={values.dataSource.anonymizationOptions}
        />
      )}
      {values._dataSourceId === "CHOOSE_EVALUATION_TEMPLATE" && (
        <OverlayBoundary>
          <DataSourceFromTemplate
            evaluationTemplateId={values.evaluationTemplateId!}
          />
        </OverlayBoundary>
      )}
    </Stack>
  );
}

function DataSource(props: {
  name: string;
  sensitivity: DataSourceSensitivity | undefined;
  anonymizationOptions: AnonymizationOptions;
}) {
  const fieldName = createFieldNameMapper<ConfigureDataSourceStepFormModel>();

  return (
    <>
      <Typography level="h3" component="h2">
        {props.name}
      </Typography>
      <TimeSpanField
        name={fieldName("timeSpan")}
        label="Betrachtungszeitraum"
      />
      <AnonymizationConfiguration
        sensitivity={props.sensitivity}
        name={fieldName("anonymized")}
        anonymizationOptions={props.anonymizationOptions}
      />
    </>
  );
}

function DataSourceFromTemplate(props: { evaluationTemplateId: string }) {
  const { dataSourceName, dataSourceSensitivity, anonymizationOptions } =
    useGetEvaluationTemplateDetails(props.evaluationTemplateId);
  return (
    <DataSource
      name={dataSourceName}
      sensitivity={dataSourceSensitivity}
      anonymizationOptions={anonymizationOptions}
    />
  );
}
