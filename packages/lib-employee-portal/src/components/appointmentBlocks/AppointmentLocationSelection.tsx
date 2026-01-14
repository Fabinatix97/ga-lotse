/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { Grid } from "@mui/joy";

import { SearchContactField } from "../../features/contacts/components/SearchContactField";
import { CONTACT_CATEGORY_NAMES } from "../../features/contacts/translations";
import { FormGroupGrid } from "../form/FormGroupGrid";

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
