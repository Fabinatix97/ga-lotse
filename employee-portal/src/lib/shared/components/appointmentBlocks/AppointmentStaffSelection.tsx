/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { NamedUser, UserField } from "@eshg/lib-employee-portal";
import { Button, Grid } from "@mui/joy";
import { SxProps } from "@mui/joy/styles/types";

import { FormGroupGrid } from "@/lib/shared/components/form/FormGroupGrid";

export const BUTTON_STYLES: SxProps = {
  marginTop: "27px", // vertically align button to form fields, taking validation errors into account
};

export interface AppointmentStaffSelectionProps {
  physicianOptions: NamedUser[];
  physicianRequired?: string;
  medicalAssistantOptions?: NamedUser[];
  consultantOptions?: NamedUser[];
  blockedStaff: string[];
  freeStaff: string[];
  validateAvailability: () => void;
}

export function AppointmentStaffSelection(
  props: Readonly<AppointmentStaffSelectionProps>,
) {
  return (
    <FormGroupGrid>
      <Grid xs={4}>
        <UserField
          name="physicians"
          label="Arzt/Ärztin"
          placeholder="auswählen"
          options={props.physicianOptions}
          required={props.physicianRequired}
          freeStaff={props.freeStaff}
          blockedStaff={props.blockedStaff}
        />
      </Grid>
      {props.medicalAssistantOptions && (
        <Grid xs={4}>
          <UserField
            name="mfas"
            label="MFA"
            placeholder="auswählen"
            options={props.medicalAssistantOptions}
            freeStaff={props.freeStaff}
            blockedStaff={props.blockedStaff}
          />
        </Grid>
      )}
      {props.consultantOptions && (
        <Grid xs={4}>
          <UserField
            name="consultants"
            label="Berater:in"
            placeholder="auswählen"
            options={props.consultantOptions}
            freeStaff={props.freeStaff}
            blockedStaff={props.blockedStaff}
          />
        </Grid>
      )}
      <Grid xs={4}>
        <Button
          variant="outlined"
          onClick={() => props.validateAvailability()}
          sx={BUTTON_STYLES}
        >
          Verfügbarkeit prüfen
        </Button>
      </Grid>
    </FormGroupGrid>
  );
}
