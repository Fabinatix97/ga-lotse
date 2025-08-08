/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Button, Stack, Typography } from "@mui/joy";

import {
  OptionalFieldValue,
  SetFieldValueHelper,
  createFieldNameMapper,
  isEmptyString,
  useIsFormDisabled,
} from "@eshg/lib-portal";
import { ApiArticulationValue } from "@eshg/school-entry-api";

import { StatusChip } from "@/lib/businessModules/schoolEntry/features/procedures/examinations/StatusChip";
import { ArticulationField } from "@/lib/businessModules/schoolEntry/features/procedures/sopessExamination/ArticulationField";
import {
  ARTICULATION_EVALUATION_TYPES,
  ARTICULATION_VALUES,
} from "@/lib/businessModules/schoolEntry/features/procedures/translations";

interface ArticulationFormProps {
  lettersSAndZPoints: OptionalFieldValue<ApiArticulationValue>;
  formationSchPoints: OptionalFieldValue<ApiArticulationValue>;
  lettersTAndDPoints: OptionalFieldValue<ApiArticulationValue>;
  formationChPoints: OptionalFieldValue<ApiArticulationValue>;
  lettersGAndKPoints: OptionalFieldValue<ApiArticulationValue>;
  lettersLAndNPoints: OptionalFieldValue<ApiArticulationValue>;
  letterRPoints: OptionalFieldValue<ApiArticulationValue>;
  letterFAndFormationPfPoints: OptionalFieldValue<ApiArticulationValue>;
  letterBPoints: OptionalFieldValue<ApiArticulationValue>;
  formationsTrDrKrGrPoints: OptionalFieldValue<ApiArticulationValue>;
  setFieldValue: SetFieldValueHelper;
}

interface BooleanField {
  name: keyof Omit<ArticulationFormProps, "setFieldValue">;
  label: string;
}

const BOOLEAN_FIELDS: BooleanField[] = [
  { name: "lettersSAndZPoints", label: "S, Z" },
  { name: "formationSchPoints", label: "Sch" },
  { name: "lettersTAndDPoints", label: "T, D" },
  { name: "formationChPoints", label: "Ch" },
  { name: "lettersGAndKPoints", label: "G, K" },
  { name: "lettersLAndNPoints", label: "L, N" },
  { name: "letterRPoints", label: "R" },
  { name: "letterFAndFormationPfPoints", label: "F, Pf" },
  { name: "letterBPoints", label: "B" },
  { name: "formationsTrDrKrGrPoints", label: "tr, dr, kr, gr" },
];

function getSum(props: ArticulationFormProps) {
  let sum = 0;
  BOOLEAN_FIELDS.forEach((field) => {
    const fieldValue = props[field.name];
    if (!isEmptyString(fieldValue)) {
      sum += getValueNumber(ARTICULATION_VALUES[fieldValue]);
    }
  });

  return sum;
}

function getValueNumber(value: string): number {
  const numberAsString = value.split(" ")[0];

  if (numberAsString === undefined) {
    return 0;
  }
  const parsedNumber = parseInt(numberAsString);
  return parsedNumber === 9 ? 0 : parsedNumber;
}

export function ArticulationForm(props: ArticulationFormProps) {
  const fieldName = createFieldNameMapper("articulation");
  const disabled = useIsFormDisabled();
  const articulationValuesSum = getSum(props);

  function markAllAsInconspicuous() {
    BOOLEAN_FIELDS.forEach(
      (field) =>
        void props.setFieldValue(
          fieldName(field.name),
          ApiArticulationValue.Inconspicuous,
        ),
    );
  }

  return (
    <Stack
      gap={2}
      data-testid="articulationForm"
      role="group"
      aria-labelledby="artikulation-label"
    >
      <Typography level="title-sm" component="h2" id="artikulation-label">
        Artikulation, Dyslalie
      </Typography>
      <Stack direction="row" gap={2} alignItems="flex-start">
        <Button
          variant="outlined"
          disabled={disabled}
          aria-pressed={articulationValuesSum === 0}
          onClick={markAllAsInconspicuous}
        >
          unauffällig
        </Button>
        <Stack direction="row" gap={2} flexWrap="wrap" alignItems="center">
          {BOOLEAN_FIELDS.map((field) => (
            <ArticulationField
              key={field.name}
              name={fieldName(field.name)}
              label={field.label}
            />
          ))}
          <StatusChip aria-label="Berechnung Artikulation" minWidth="sm">
            {articulationValuesSum}
          </StatusChip>
          <StatusChip aria-label="Bewertung Artikulation" minWidth="sm">
            {articulationValuesSum === 0
              ? ARTICULATION_EVALUATION_TYPES.INCONSPICUOUS
              : ARTICULATION_EVALUATION_TYPES.CONSPICUOUS}
          </StatusChip>
        </Stack>
      </Stack>
    </Stack>
  );
}
