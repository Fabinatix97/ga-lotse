/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { Grid } from "@mui/joy";

import { contactCategoryNames } from "@/lib/baseModule/shared/translations";
import { FormGroupGrid } from "@/lib/shared/components/form/FormGroupGrid";
import { SearchContactField } from "@/lib/shared/components/formFields/SearchContactField";

interface AppointmentLocationSelectionProps {
  contactCategory: "SCHOOL" | "HEALTH_DEPARTMENT";
}

export function AppointmentLocationSelection(
  props: AppointmentLocationSelectionProps,
) {
  const translatedCategory = contactCategoryNames[props.contactCategory];

  return (
    <FormGroupGrid>
      <Grid xs={4}>
        <SearchContactField
          name="locationId"
          label={translatedCategory}
          category={props.contactCategory}
        />
      </Grid>
    </FormGroupGrid>
  );
}
