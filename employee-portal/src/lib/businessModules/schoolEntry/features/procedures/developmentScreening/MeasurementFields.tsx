/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { Stack, Typography } from "@mui/joy";
import { SxProps } from "@mui/joy/styles/types/theme";
import { FormikErrors } from "formik";
import { isDefined } from "remeda";

import { SoftRequiredNumberField } from "@eshg/lib-portal/components/form/fieldVariants";
import {
  createFieldNameMapper,
  mapOptionalValue,
} from "@eshg/lib-portal/helpers/form";
import {
  NestedFormProps,
  OptionalFieldValue,
} from "@eshg/lib-portal/types/form";
import { GetPercentilesRequest } from "@eshg/school-entry-api";

import { Percentiles } from "@/lib/businessModules/schoolEntry/api/models/examinations/Percentiles";
import { useGetPercentiles } from "@/lib/businessModules/schoolEntry/api/queries/valueEvaluatorApi";
import { StatusChip } from "@/lib/businessModules/schoolEntry/features/procedures/examinations/StatusChip";
import {
  validateNonNegativeInteger,
  validatePositiveNumberWithAtMostTwoDecimalDigits,
} from "@/lib/shared/helpers/validators";

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

const MIN_0 = 0;
const MIN_1 = 1;
const MAX_10000 = 10000;

const FIXED_WIDTH_STYLE: SxProps = { width: "95px" };

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
    <Stack direction="row" gap={2} alignItems="center" flexWrap="wrap">
      <Typography level="title-sm">Maße</Typography>
      <Stack direction="row" gap={4} alignItems="center" flexWrap="wrap">
        <Stack direction="row" gap={2} alignItems="center" flexWrap="wrap">
          <Stack direction="row" gap={2} alignItems="center">
            <SoftRequiredNumberField
              name={fieldName("height")}
              label="Größe (m)"
              validate={validatePositiveNumberWithAtMostTwoDecimalDigits}
              sx={FIXED_WIDTH_STYLE}
              min={MIN_1}
              max={MAX_10000}
              softRequired
            />
            <StatusChip label="Perz.">
              {formatPercentageValue(percentiles.heightPercentile)}
            </StatusChip>
          </Stack>
          <Stack direction="row" gap={2} alignItems="center">
            <SoftRequiredNumberField
              name={fieldName("weight")}
              label="Gewicht (kg)"
              validate={validatePositiveNumberWithAtMostTwoDecimalDigits}
              sx={FIXED_WIDTH_STYLE}
              min={MIN_1}
              max={MAX_10000}
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
            label="RRsys (mmHg)"
            validate={validateNonNegativeInteger}
            sx={FIXED_WIDTH_STYLE}
            min={MIN_0}
            max={MAX_10000}
            softRequired
          />
          <SoftRequiredNumberField
            name={fieldName("diastole")}
            label="RRdiast (mmHg)"
            validate={validateNonNegativeInteger}
            sx={FIXED_WIDTH_STYLE}
            min={MIN_0}
            max={MAX_10000}
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
    height: !isDefined(
      validatePositiveNumberWithAtMostTwoDecimalDigits(fieldValues.height),
    )
      ? mapOptionalValue(fieldValues.height)
      : undefined,
    weight: !isDefined(
      validatePositiveNumberWithAtMostTwoDecimalDigits(fieldValues.weight),
    )
      ? mapOptionalValue(fieldValues.weight)
      : undefined,
  };
}

function hasValidFieldValues(
  fieldErrors: FormikErrors<MeasurementFieldsValues> | undefined,
) {
  return fieldErrors?.height === undefined && fieldErrors?.weight === undefined;
}
