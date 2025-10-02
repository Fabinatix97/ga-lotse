/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { Stack, Typography } from "@mui/joy";
import { SxProps } from "@mui/joy/styles/types/theme";
import { FormikErrors } from "formik";
import { isDefined } from "remeda";

import { validateNumberWithAtMostTwoDecimalDigits } from "@eshg/lib-employee-portal";
import {
  NestedFormProps,
  OptionalFieldValue,
  SoftRequiredNumberField,
  createFieldNameMapper,
  mapOptionalValue,
  validateInteger,
  validatePipe,
  validateRange,
} from "@eshg/lib-portal";
import { GetPercentilesRequest } from "@eshg/school-entry-api";

import { Percentiles } from "@/lib/businessModules/schoolEntry/api/models/examinations/Percentiles";
import { useGetPercentiles } from "@/lib/businessModules/schoolEntry/api/queries/valueEvaluatorApi";
import { StatusChip } from "@/lib/businessModules/schoolEntry/features/procedures/examinations/StatusChip";
import { REQUIRED_PROCEDURE_PROPERTIES } from "@/lib/businessModules/schoolEntry/features/procedures/translations";

function formatPercentageValue(value: number | undefined) {
  return value === undefined ? "" : formatDecimal(value * 100);
}

function formatDecimalValue(value: number | undefined) {
  return value === undefined ? "" : formatDecimal(value);
}

function formatDecimal(value: number) {
  return value.toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
}

const MIN_1 = 1;
const MAX_999 = 999;
const MIN_0_01 = 0.01;
const MAX_999_99 = 999.99;

const FIXED_WIDTH_STYLE: SxProps = { width: "95px" };

const validateIntegerInMinMax = validatePipe(
  validateRange(MIN_1, MAX_999),
  validateInteger,
);

const validateWeight = validatePipe(
  validateRange(MIN_0_01, MAX_999_99),
  validateNumberWithAtMostTwoDecimalDigits,
);

export interface MeasurementFieldsValues {
  height: OptionalFieldValue<number>;
  weight: OptionalFieldValue<number>;
  systole: OptionalFieldValue<number>;
  diastole: OptionalFieldValue<number>;
}

interface MeasurementFieldsProps extends NestedFormProps {
  procedureId: string;
  values: MeasurementFieldsValues;
  errors?: FormikErrors<MeasurementFieldsValues>;
  initialPercentiles: Percentiles;
}

export function MeasurementFields(props: MeasurementFieldsProps) {
  const fieldName = createFieldNameMapper(props.name);

  const getPercentiles = useGetPercentiles(
    mapToGetPercentilesRequest(props.procedureId, props.values),
    {
      initialData: props.initialPercentiles,
      enabled: hasValidFieldValues(props.errors),
    },
  );
  const percentiles = getPercentiles.data ?? {};

  return (
    <Stack
      direction="row"
      gap={2}
      alignItems="center"
      flexWrap="wrap"
      role="group"
      aria-labelledby="masse-label"
    >
      <Typography level="title-sm" component="h2" id="masse-label">
        Maße
      </Typography>
      <Stack direction="row" gap={4} alignItems="center" flexWrap="wrap">
        <Stack direction="row" gap={2} alignItems="center" flexWrap="wrap">
          <Stack direction="row" gap={2} alignItems="center">
            <SoftRequiredNumberField
              name={fieldName("height")}
              label={REQUIRED_PROCEDURE_PROPERTIES.DEVELOPMENT_SCREENING_HEIGHT}
              validate={validateIntegerInMinMax}
              sx={FIXED_WIDTH_STYLE}
              min={MIN_1}
              max={MAX_999}
              softRequired
            />
            <StatusChip label="Perz.">
              {formatPercentageValue(percentiles.heightPercentile)}
            </StatusChip>
          </Stack>
          <Stack direction="row" gap={2} alignItems="center">
            <SoftRequiredNumberField
              name={fieldName("weight")}
              label={REQUIRED_PROCEDURE_PROPERTIES.DEVELOPMENT_SCREENING_WEIGHT}
              validate={validateWeight}
              sx={FIXED_WIDTH_STYLE}
              min={MIN_0_01}
              max={MAX_999_99}
              softRequired
            />
            <StatusChip label="Perz.">
              {formatPercentageValue(percentiles.weightPercentile)}
            </StatusChip>
          </Stack>
          <Stack direction="row" gap={2} alignItems="center">
            <StatusChip label="BMI (kg/m²)">
              {formatDecimalValue(percentiles.bmi)}
            </StatusChip>
            <StatusChip label="Perz.">
              {formatPercentageValue(percentiles.bmiPercentile)}
            </StatusChip>
          </Stack>
        </Stack>
        <Stack direction="row" gap={2} alignItems="center" flexWrap="wrap">
          <SoftRequiredNumberField
            name={fieldName("systole")}
            label={REQUIRED_PROCEDURE_PROPERTIES.DEVELOPMENT_SCREENING_SYSTOLE}
            validate={validateIntegerInMinMax}
            sx={FIXED_WIDTH_STYLE}
            min={MIN_1}
            max={MAX_999}
            softRequired
          />
          <SoftRequiredNumberField
            name={fieldName("diastole")}
            label={REQUIRED_PROCEDURE_PROPERTIES.DEVELOPMENT_SCREENING_DIASTOLE}
            validate={validateIntegerInMinMax}
            sx={FIXED_WIDTH_STYLE}
            min={MIN_1}
            max={MAX_999}
            softRequired
          />
        </Stack>
      </Stack>
    </Stack>
  );
}

function mapToGetPercentilesRequest(
  procedureId: string,
  fieldValues: MeasurementFieldsValues,
): GetPercentilesRequest {
  return {
    procedureId,
    height: !isDefined(validateIntegerInMinMax(fieldValues.height))
      ? mapOptionalValue(fieldValues.height)
      : undefined,
    weight: !isDefined(validateWeight(fieldValues.weight))
      ? mapOptionalValue(fieldValues.weight)
      : undefined,
  };
}

function hasValidFieldValues(
  fieldErrors: FormikErrors<MeasurementFieldsValues> | undefined,
) {
  return fieldErrors?.height === undefined && fieldErrors?.weight === undefined;
}
