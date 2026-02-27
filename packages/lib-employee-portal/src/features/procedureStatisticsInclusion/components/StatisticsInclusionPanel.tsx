/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { Typography } from "@mui/joy";
import { Formik } from "formik";

import {
  ApiProcedureStatus,
  ApiStatisticsInclusion,
  ApiUserRole,
} from "@eshg/base-api";
import { SelectField, SubmitButton, buildEnumOptions } from "@eshg/lib-portal";

import { ButtonBar } from "../../../components/buttons/ButtonBar";
import { ContentPanel } from "../../../components/contentPanel/ContentPanel";
import { ContentPanelTitle } from "../../../components/contentPanel/ContentPanelTitle";
import { FormStack } from "../../../components/form/FormStack";
import { useHasUserRoleCheck } from "../../auth/hooks/useAccessControl";
import { useUpdateProcedureStatisticsInclusion } from "../api/mutations";
import { ProcedureStatisticsClient } from "../types/procedureStatisticsClient";

interface ProcedureWithStatisticsInclusion {
  id: string;
  status: ApiProcedureStatus;
  statisticsInclusion: ApiStatisticsInclusion;
}

export interface StatisticsInclusionPanelProps {
  procedure: ProcedureWithStatisticsInclusion;
  procedureStatisticsClient: ProcedureStatisticsClient;
  writeRole: ApiUserRole;
  hideCustom?: boolean;
  showDefaultMessage?: boolean;
  showForOpenProcedures?: boolean;
  title?: string;
  label?: string;
  statisticsInclusionDisplayValues: Record<ApiStatisticsInclusion, string>;
  statisticsInclusionDisplayReadOnlyValues: Record<
    ApiStatisticsInclusion,
    string
  >;
}

interface StatisticsInclusionValues {
  statisticsInclusion: ApiStatisticsInclusion;
}

export function StatisticsInclusionPanel(props: StatisticsInclusionPanelProps) {
  const {
    procedure,
    procedureStatisticsClient,
    writeRole,
    title,
    label,
    statisticsInclusionDisplayValues,
    statisticsInclusionDisplayReadOnlyValues,
  } = props;

  const hideDefaultMessage = !(props.showDefaultMessage ?? false);
  const showOnlyForClosedProcedures = !(props.showForOpenProcedures ?? false);
  const hideCustom = props.hideCustom ?? false;
  const isReadOnly = !useHasUserRoleCheck(writeRole);

  const updateProcedureStatisticsInclusion =
    useUpdateProcedureStatisticsInclusion(procedureStatisticsClient);

  if (
    showOnlyForClosedProcedures &&
    procedure.status !== ApiProcedureStatus.Closed
  ) {
    return undefined;
  }

  if (
    isReadOnly &&
    hideDefaultMessage &&
    procedure.statisticsInclusion === ApiStatisticsInclusion.Include
  ) {
    return undefined;
  }

  async function handleSubmit(values: StatisticsInclusionValues) {
    await updateProcedureStatisticsInclusion.mutateAsync(
      mapToRequest(procedure, values),
    );
  }

  const options = buildEnumOptions<ApiStatisticsInclusion>(
    statisticsInclusionDisplayValues,
  ).filter(
    (option) => !(hideCustom && option.value === ApiStatisticsInclusion.Custom),
  );

  return (
    <ContentPanel role="form" ariaLabel={title ?? "Vorgangsstatistik"}>
      <ContentPanelTitle component="h2">
        {title ?? "Vorgangsstatistik"}
      </ContentPanelTitle>
      {isReadOnly ? (
        <Typography>
          {
            statisticsInclusionDisplayReadOnlyValues[
              procedure.statisticsInclusion
            ]
          }
        </Typography>
      ) : (
        <Formik
          initialValues={mapToFormValues(procedure)}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, handleSubmit }) => {
            return (
              <FormStack dense onSubmit={handleSubmit}>
                <SelectField
                  name="statisticsInclusion"
                  label={label ?? "Vorgang in Statistiken verwenden?"}
                  options={options}
                />
                <ButtonBar
                  right={
                    <SubmitButton
                      submitting={isSubmitting}
                      aria-label="Statistik-Verwendung speichern"
                    >
                      Speichern
                    </SubmitButton>
                  }
                />
              </FormStack>
            );
          }}
        </Formik>
      )}
    </ContentPanel>
  );
}

function mapToRequest(
  procedure: ProcedureWithStatisticsInclusion,
  formValues: StatisticsInclusionValues,
) {
  return {
    procedureId: procedure.id,
    statisticsInclusion: formValues.statisticsInclusion,
  };
}

function mapToFormValues(
  procedure: ProcedureWithStatisticsInclusion,
): StatisticsInclusionValues {
  return {
    statisticsInclusion: procedure.statisticsInclusion,
  };
}
