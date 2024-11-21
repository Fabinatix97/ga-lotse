/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiStatisticsFeature } from "@eshg/employee-portal-api/statistics";
import { createFieldNameMapper } from "@eshg/lib-portal/helpers/form";
import { Stack, Typography } from "@mui/joy";
import { useFormikContext } from "formik";

import { useGetEvaluationTemplateDetails } from "@/lib/businessModules/statistics/api/queries/useGetEvaluationTemplateDetails";
import { useIsNewFeatureEnabled } from "@/lib/businessModules/statistics/api/queries/useStatisticsFeatureToggle";
import { AnonymizedToggleButtonGroupField } from "@/lib/businessModules/statistics/components/evaluations/AnonymizedToggleButtonGroupField";
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
      {values.dataSource && <DataSource name={values.dataSource.name} />}
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
  templateWithoutAnonymizationAllowed?: boolean;
}) {
  const fieldName = createFieldNameMapper<ConfigureDataSourceStepFormModel>();
  const { values } = useFormikContext<
    ChooseDataSourceStepFormModel & ChooseEvaluationTemplateStepFormModel
  >();
  const fakeAnonymizationEnabled = useIsNewFeatureEnabled(
    ApiStatisticsFeature.FakeAnonymization,
  );
  return (
    <>
      <Typography level="h3" component="h2">
        {props.name}
      </Typography>
      <TimeSpanField
        name={fieldName("timeSpan")}
        label="Betrachtungszeitraum"
      />
      {fakeAnonymizationEnabled && (
        <AnonymizedToggleButtonGroupField
          withoutAnonymizationAllowed={
            props.templateWithoutAnonymizationAllowed ??
            values.dataSource?.withoutAnonymizationAllowed ??
            false
          }
          name={fieldName("anonymized")}
        />
      )}
    </>
  );
}

function DataSourceFromTemplate(props: { evaluationTemplateId: string }) {
  const { dataSourceName, withoutAnonymizationAllowed } =
    useGetEvaluationTemplateDetails(props.evaluationTemplateId);
  return (
    <DataSource
      name={dataSourceName}
      templateWithoutAnonymizationAllowed={withoutAnonymizationAllowed}
    />
  );
}
