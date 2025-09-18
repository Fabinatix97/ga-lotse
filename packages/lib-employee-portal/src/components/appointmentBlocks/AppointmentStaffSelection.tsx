/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { Button, Grid } from "@mui/joy";
import { SxProps } from "@mui/joy/styles/types";
import {
  DefaultError,
  UndefinedInitialDataOptions,
  useQueryClient,
} from "@tanstack/react-query";
import { useFormikContext } from "formik";
import { useState } from "react";

import { useSnackbar } from "@eshg/lib-portal";

import { FormGroupGrid } from "../form/FormGroupGrid";
import { NamedUser, UserField } from "../formFields/UserField";

const BUTTON_STYLES: SxProps = {
  marginTop: "27px", // vertically align button to form fields, taking validation errors into account
};

interface ValidateAppointmentBlockGroupsAvailabilityResponse {
  userIdsWithEventConflicts: string[];
  userIdsWithoutEventConflicts: string[];
}

interface StaffSelection {
  physicians?: string[];
  mfas?: string[];
  consultants?: string[];
}

interface AppointmentStaffSelectionProps {
  physicianOptions?: NamedUser[];
  physicianRequired?: string;
  medicalAssistantOptions?: NamedUser[];
  consultantOptions?: NamedUser[];
  validateAppointmentBlocks: () => void;
  getCheckAvailabilityQuery: () => UndefinedInitialDataOptions<
    ValidateAppointmentBlockGroupsAvailabilityResponse,
    DefaultError,
    ValidateAppointmentBlockGroupsAvailabilityResponse,
    readonly unknown[]
  >;
  singleColumn?: boolean;
}

export function AppointmentStaffSelection(
  props: Readonly<AppointmentStaffSelectionProps>,
) {
  const snackbar = useSnackbar();
  const queryClient = useQueryClient();

  const [freeStaff, setFreeStaff] = useState<string[]>([]);
  const [blockedStaff, setBlockedStaff] = useState<string[]>([]);
  const { values: staffSelection } = useFormikContext<StaffSelection>();

  async function validateAvailability() {
    try {
      props.validateAppointmentBlocks();
    } catch {
      snackbar.notification(
        "Bitte Terminblöcke für die Validierung konfigurieren",
      );
      return;
    }
    if (props.physicianRequired && staffSelection.physicians?.length === 0) {
      snackbar.notification(props.physicianRequired);
      return;
    }
    let teamMembers = 0;
    const groups: string[] = [];
    if (props.physicianOptions) {
      teamMembers += staffSelection.physicians?.length ?? 0;
      groups.push("einen Arzt/eine Ärztin");
    }
    if (props.medicalAssistantOptions) {
      teamMembers += staffSelection.mfas?.length ?? 0;
      groups.push("ein:e MFA");
    }
    if (props.consultantOptions) {
      teamMembers += staffSelection.consultants?.length ?? 0;
      groups.push("eine:n Berater:in");
    }
    if (teamMembers === 0) {
      snackbar.notification(
        `Bitte mindestens ${groups.join(" oder ")} für die Validierung auswählen`,
      );
      return;
    }
    const result = await queryClient.fetchQuery(
      props.getCheckAvailabilityQuery(),
    );
    setFreeStaff(result.userIdsWithoutEventConflicts);
    setBlockedStaff(result.userIdsWithEventConflicts);
  }

  const size = props.singleColumn ? 12 : 6;

  return (
    <FormGroupGrid>
      {props.physicianOptions && (
        <Grid xs={size}>
          <UserField
            name="physicians"
            label="Arzt/Ärztin"
            placeholder="auswählen"
            options={props.physicianOptions}
            required={props.physicianRequired}
            freeStaff={freeStaff}
            blockedStaff={blockedStaff}
          />
        </Grid>
      )}
      {props.medicalAssistantOptions && (
        <Grid xs={size}>
          <UserField
            name="mfas"
            label="MFA"
            placeholder="auswählen"
            options={props.medicalAssistantOptions}
            freeStaff={freeStaff}
            blockedStaff={blockedStaff}
          />
        </Grid>
      )}
      {props.consultantOptions && (
        <Grid xs={size}>
          <UserField
            name="consultants"
            label="Berater:in"
            placeholder="auswählen"
            options={props.consultantOptions}
            freeStaff={freeStaff}
            blockedStaff={blockedStaff}
          />
        </Grid>
      )}
      <Grid xs={size}>
        <Button
          variant="outlined"
          sx={BUTTON_STYLES}
          onClick={() => validateAvailability()}
        >
          Verfügbarkeit prüfen
        </Button>
      </Grid>
    </FormGroupGrid>
  );
}
