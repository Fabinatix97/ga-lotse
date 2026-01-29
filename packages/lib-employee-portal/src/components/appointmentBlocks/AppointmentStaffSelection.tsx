/**
 * Copyright 2026 cronn GmbH
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
import { isEmpty } from "remeda";

import { useSnackbar } from "@eshg/lib-portal";

import { FormGroupGrid } from "../form/FormGroupGrid";
import { SingleUserField } from "../formFields/SingleUserField";
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
  sopasss?: string[];
}

interface BaseAppointmentStaffSelectionProps {
  physicianOptions?: NamedUser[];
  physicianRequired?: string;
  medicalAssistantOptions?: NamedUser[];
  consultantOptions?: NamedUser[];
  consultantRequired?: string;
  sopassOptions?: NamedUser[];
  singleColumn?: boolean;
  singleSelection?: boolean;
}

interface MultiAppointmentStaffSelectionProps extends BaseAppointmentStaffSelectionProps {
  singleSelection?: false;
  validateAppointmentBlocks: () => void;
  getCheckAvailabilityQuery: () => UndefinedInitialDataOptions<
    ValidateAppointmentBlockGroupsAvailabilityResponse,
    DefaultError,
    ValidateAppointmentBlockGroupsAvailabilityResponse,
    readonly unknown[]
  >;
}

interface SingleAppointmentStaffSelectionProps extends BaseAppointmentStaffSelectionProps {
  singleSelection: true;
}

type AppointmentStaffSelectionProps =
  | MultiAppointmentStaffSelectionProps
  | SingleAppointmentStaffSelectionProps;

export function AppointmentStaffSelection(
  props: Readonly<AppointmentStaffSelectionProps>,
) {
  const snackbar = useSnackbar();
  const queryClient = useQueryClient();

  const [freeStaff, setFreeStaff] = useState<string[]>([]);
  const [blockedStaff, setBlockedStaff] = useState<string[]>([]);
  const { values: staffSelection } = useFormikContext<StaffSelection>();

  async function validateAvailability() {
    if (props.singleSelection) {
      return;
    }

    try {
      props.validateAppointmentBlocks();
    } catch {
      snackbar.notification(
        "Bitte Terminblöcke für die Validierung konfigurieren",
      );
      return;
    }
    if (props.physicianRequired && isEmpty(staffSelection.physicians ?? [])) {
      snackbar.notification(props.physicianRequired);
      return;
    }
    if (props.consultantRequired && isEmpty(staffSelection.consultants ?? [])) {
      snackbar.notification(props.consultantRequired);
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
    if (props.sopassOptions) {
      teamMembers += staffSelection.sopasss?.length ?? 0;
      groups.push("ein:e SOPASS qualifizierte:r MFA");
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

  const validationProps = { freeStaff, blockedStaff };
  const physicianProps = {
    name: "physicians",
    label: "Arzt/Ärztin",
    placeholder: "auswählen",
    options: props.physicianOptions ?? [],
    required: props.physicianRequired,
  };

  const mfaProps = {
    name: "mfas",
    label: "MFA",
    placeholder: "auswählen",
    options: props.medicalAssistantOptions ?? [],
  };

  const consultantProps = {
    name: "consultants",
    label: "Berater:in",
    placeholder: "auswählen",
    options: props.consultantOptions ?? [],
    required: props.consultantRequired,
  };

  const sopassProps = {
    name: "sopasss",
    label: "SOPASS qualifizierte:r MFA",
    placeholder: "auswählen",
    options: props.sopassOptions ?? [],
  };

  return (
    <FormGroupGrid>
      {props.physicianOptions && (
        <Grid xs={size}>
          {props.singleSelection ? (
            <SingleUserField {...physicianProps} />
          ) : (
            <UserField {...physicianProps} {...validationProps} />
          )}
        </Grid>
      )}
      {props.medicalAssistantOptions && (
        <Grid xs={size}>
          {props.singleSelection ? (
            <SingleUserField {...mfaProps} />
          ) : (
            <UserField {...mfaProps} {...validationProps} />
          )}
        </Grid>
      )}
      {props.consultantOptions && (
        <Grid xs={size}>
          {props.singleSelection ? (
            <SingleUserField {...consultantProps} />
          ) : (
            <UserField {...consultantProps} {...validationProps} />
          )}
        </Grid>
      )}
      {props.sopassOptions && (
        <Grid xs={size}>
          {props.singleSelection ? (
            <SingleUserField {...sopassProps} />
          ) : (
            <UserField {...sopassProps} {...validationProps} />
          )}
        </Grid>
      )}
      {!props.singleSelection && (
        <Grid xs={size}>
          <Button
            variant="outlined"
            sx={BUTTON_STYLES}
            onClick={() => validateAvailability()}
          >
            Verfügbarkeit prüfen
          </Button>
        </Grid>
      )}
    </FormGroupGrid>
  );
}
