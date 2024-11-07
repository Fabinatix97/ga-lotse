/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { BooleanSelectField } from "@eshg/lib-portal/components/formFields/BooleanSelectField";
import {
  MonthAndYear,
  MonthAndYearFields,
} from "@eshg/lib-portal/components/formFields/MonthAndYearFields";
import { Grid, GridProps } from "@mui/joy";
import { SxProps } from "@mui/joy/styles/types";

import {
  DiseaseType,
  diseaseTypeNames,
} from "@/lib/businessModules/stiProtection/shared/constants";

import { AutoWidthHorizontalField } from "./MedicalHistoryForm";

export const booleanSelectGroupGridProps: GridProps = {
  container: true,
  direction: "row",
  xxs: 12,
  lg: 6,
  rowSpacing: 2,
  rowGap: 1,
};

export function BooleanSelectDate({
  date,
  diseaseType,
  fieldNameDate,
  fieldNameSelect,
  showDateField = false,
}: {
  date: MonthAndYear;
  diseaseType: DiseaseType;
  fieldNameDate: string;
  fieldNameSelect: string;
  showDateField?: boolean;
}) {
  return (
    <Grid
      {...booleanSelectGroupGridProps}
      mb={1}
      component="section"
      aria-label={diseaseTypeNames[diseaseType]}
    >
      <Grid xxs={12} md={6}>
        <BooleanSelectField
          name={fieldNameSelect}
          label={diseaseTypeNames[diseaseType]}
          component={AutoWidthHorizontalField}
          sx={{ mr: 1 }}
        />
      </Grid>
      <Grid
        xxs={12}
        md={6}
        sx={{
          ml: {
            xxs: 3,
            md: "inherit",
          },
          ...fadeInOut(showDateField),
        }}
      >
        <MonthAndYearFields fieldName={fieldNameDate} date={date} />
      </Grid>
    </Grid>
  );
}

export function fadeInOut(shouldFadeIn: boolean): SxProps {
  return {
    visibility: shouldFadeIn ? "visible" : "hidden",
    opacity: shouldFadeIn ? 1 : 0,
    height: shouldFadeIn ? "100%" : 0,
    transition: "all ease-in-out 0.4s",
    "@media (prefers-reduced-motion)": {
      transition: "none",
    },
  };
}
