/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  CONTACT_CATEGORY_NAMES,
  SearchContactField,
} from "@eshg/lib-employee-portal";
import { Grid } from "@mui/joy";

import { FormGroupGrid } from "@/lib/shared/components/form/FormGroupGrid";

interface AppointmentLocationSelectionProps {
  contactCategory: "SCHOOL" | "HEALTH_DEPARTMENT";
}

export function AppointmentLocationSelection(
  props: AppointmentLocationSelectionProps,
) {
  const translatedCategory = CONTACT_CATEGORY_NAMES[props.contactCategory];

  return (
    <FormGroupGrid>
      <Grid xs={4}>
        <SearchContactField
          name="location"
          label={translatedCategory}
          category={props.contactCategory}
        />
      </Grid>
    </FormGroupGrid>
  );
}
