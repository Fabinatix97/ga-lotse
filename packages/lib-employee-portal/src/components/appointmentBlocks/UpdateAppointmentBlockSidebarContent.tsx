/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { Grid, Stack, Typography } from "@mui/joy";
import { isDefined } from "remeda";

import { NumberField, QueryKeyFactory } from "@eshg/lib-portal";

import { AppointmentBlockApi } from "../../api/AppointmentBlockApi";
import { User } from "../../api/models/User";
import { getValidateUpdateAppointmentBlockQuery } from "../../api/queries/appointmentBlock";
import { SidebarContent } from "../../features/drawer/components/SidebarContent";
import { TimeField } from "../formFields/TimeField";

import { AppointmentBlock } from "./AppointmentBlockGroup";
import { AppointmentStaffSelection } from "./AppointmentStaffSelection";
import {
  UpdateAppointmentBlockValues,
  mapFormValuesToApiValues,
} from "./UpdateAppointmentBlockSidebar";
import { ApiAppointmentType } from "./types";
import {
  validateAppointmentEndTime,
  validateAppointmentStartTime,
  validateParallelExaminations,
} from "./validateAppointmentBlock";

export function UpdateAppointmentBlockSidebarContent(props: {
  appointmentBlock: AppointmentBlock;
  appointmentTypes: ApiAppointmentType[];
  withTeam?: boolean;
  physicians?: User[];
  mfas?: User[];
  consultants?: User[];
  appointmentBlockApi: AppointmentBlockApi;
  appointmentBlockApiQueryKey: QueryKeyFactory;
  standardDurations: Partial<Record<ApiAppointmentType, number>>;
  formValues: UpdateAppointmentBlockValues;
}) {
  const { appointmentBlock, formValues, withTeam = true } = props;

  return (
    <SidebarContent title="Terminblock bearbeiten">
      <Stack gap={2}>
        <Typography level="title-md">Termin:</Typography>
        <Grid container spacing={2}>
          <Grid xxs>
            <TimeField
              name="startTime"
              label="Startzeit"
              required="Bitte eine Startzeit angeben."
              validate={(value) =>
                validateAppointmentStartTime(value, appointmentBlock)
              }
            />
          </Grid>
          <Grid xxs>
            <TimeField
              name="endTime"
              label="Endzeit"
              required="Bitte eine Endzeit angeben."
              validate={(value) =>
                validateAppointmentEndTime(
                  value,
                  formValues.startTime,
                  appointmentBlock,
                  props.appointmentTypes,
                  props.standardDurations,
                )
              }
            />
          </Grid>
        </Grid>
        {isDefined(appointmentBlock.parallelExaminations) && (
          <NumberField
            name="parallelExaminations"
            label="Parallele Untersuchungen"
            required="Bitte die Anzahl paralleler Untersuchungen angeben."
            validate={(value) =>
              validateParallelExaminations(value, appointmentBlock)
            }
          />
        )}
        {withTeam && (
          <AppointmentStaffSelection
            physicianOptions={props.physicians}
            medicalAssistantOptions={props.mfas}
            consultantOptions={props.consultants}
            validateAppointmentBlocks={() =>
              mapFormValuesToApiValues(appointmentBlock, formValues)
            }
            getCheckAvailabilityQuery={() =>
              getValidateUpdateAppointmentBlockQuery(
                props.appointmentBlockApi,
                props.appointmentBlockApiQueryKey,
                mapFormValuesToApiValues(appointmentBlock, formValues),
              )
            }
            singleColumn
          />
        )}
      </Stack>
    </SidebarContent>
  );
}
