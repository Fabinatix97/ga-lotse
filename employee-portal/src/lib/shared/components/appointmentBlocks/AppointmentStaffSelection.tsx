/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { Button, Grid } from "@mui/joy";
import { SxProps } from "@mui/joy/styles/types";

import { AppointmentStaffField } from "@/lib/shared/components/appointmentBlocks/AppointmentStaffField";
import { FormGroupGrid } from "@/lib/shared/components/form/FormGroupGrid";

export const BUTTON_STYLES: SxProps = {
  marginTop: "27px", // vertically align button to form fields, taking validation errors into account
};

export interface AppointmentStaffSelectionProps {
  physicianOptions: SelectionOption[];
  medicalAssistantOptions?: SelectionOption[];
  consultantOptions?: SelectionOption[];
  blockedStaff: string[];
  freeStaff: string[];
  validateAvailability: () => void;
}

export interface SelectionOption {
  label: string;
  value: string;
}

export function AppointmentStaffSelection(
  props: Readonly<AppointmentStaffSelectionProps>,
) {
  return (
    <FormGroupGrid>
      <Grid xs={4}>
        <AppointmentStaffField
          name="physicians"
          label="Arzt:in"
          placeholder="auswählen"
          options={props.physicianOptions}
          freeStaff={props.freeStaff}
          blockedStaff={props.blockedStaff}
        />
      </Grid>
      {props.medicalAssistantOptions && (
        <Grid xs={4}>
          <AppointmentStaffField
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
          <AppointmentStaffField
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
