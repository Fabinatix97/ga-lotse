/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Grid, Stack, Typography } from "@mui/joy";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Formik } from "formik";
import { Ref } from "react";
import { unique } from "remeda";

import {
  FormButtonBar,
  SidebarActions,
  SidebarContent,
  SidebarForm,
  SidebarFormHandle,
  TimeField,
  calculateAppointmentsPerBlock,
  getAppointmentDurationInMinutes,
  toLocalDateTime,
} from "@eshg/lib-employee-portal";
import {
  ApiAppointmentBlock,
  ApiAppointmentType,
} from "@eshg/school-entry-api";

import { useAppointmentStandardDurationsApi } from "@/lib/businessModules/schoolEntry/api/clients";
import { useUpdateAppointmentBlock } from "@/lib/businessModules/schoolEntry/api/mutations/appointmentBlockApi";
import { useGetAppointmentStandardDurationsQuery } from "@/lib/businessModules/schoolEntry/api/queries/appointmentStandardDuration";
import {
  formatDateInput,
  formatTimeInput,
  isAfterTime,
  isBeforeTime,
  parseTime,
} from "@/lib/shared/helpers/dateTime";

interface UpdateAppointmentBlockProps {
  appointmentBlock: ApiAppointmentBlock;
  formRef: Ref<SidebarFormHandle>;
  onCancel: () => void;
  onClose: (force?: boolean) => void;
  refetchEvents: () => void;
}

interface UpdateAppointmentBlockValues {
  startTime: string;
  endTime: string;
}

export function UpdateAppointmentBlockSidebar(
  props: UpdateAppointmentBlockProps,
) {
  const { appointmentBlock, onCancel } = props;
  const updateAppointmentBlock = useUpdateAppointmentBlock();
  const standardDurationApi = useAppointmentStandardDurationsApi();
  const { data: standardDurations } = useSuspenseQuery(
    useGetAppointmentStandardDurationsQuery(standardDurationApi),
  );

  async function handleUpdate(values: UpdateAppointmentBlockValues) {
    await updateAppointmentBlock.mutateAsync({
      appointmentBlockId: appointmentBlock.id,
      apiUpdateAppointmentBlockRequest: {
        start: toLocalDateTime(
          formatDateInput(appointmentBlock.start),
          values.startTime,
        ),
        end: toLocalDateTime(
          formatDateInput(appointmentBlock.end),
          values.endTime,
        ),
      },
    });

    props.onClose(true);
    props.refetchEvents();
  }

  return (
    <Formik
      initialValues={{
        startTime: formatTimeInput(appointmentBlock.start),
        endTime: formatTimeInput(appointmentBlock.end),
      }}
      onSubmit={handleUpdate}
    >
      {({ values, isSubmitting }) => (
        <SidebarForm ref={props.formRef}>
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
                        values.startTime,
                        appointmentBlock,
                        standardDurations,
                      )
                    }
                  />
                </Grid>
              </Grid>
            </Stack>
          </SidebarContent>
          <SidebarActions>
            <FormButtonBar
              submitLabel="Speichern"
              submitting={isSubmitting}
              onCancel={onCancel}
            />
          </SidebarActions>
        </SidebarForm>
      )}
    </Formik>
  );
}

function validateAppointmentStartTime(
  value: string,
  appointmentBlock: ApiAppointmentBlock,
) {
  if (isBeforeTime(value, formatTimeInput(appointmentBlock.start))) {
    return "Die Startzeit muss im Terminblock liegen.";
  }
  const bookedAppointments = appointmentBlock.bookedAppointments;
  if (bookedAppointments.length > 0) {
    const earliestBookedAppointment = bookedAppointments.toSorted(
      (a, b) => a.start.getTime() - b.start.getTime(),
    )[0];

    if (isAfterTime(value, formatTimeInput(earliestBookedAppointment!.start))) {
      return "Es sind bereits Termine vor dieser Zeit gebucht.";
    }
  }
  return undefined;
}

function validateAppointmentEndTime(
  value: string,
  startTime: string,
  appointmentBlock: ApiAppointmentBlock,
  standardDurations: Partial<Record<ApiAppointmentType, number>>,
) {
  if (!isAfterTime(value, startTime)) {
    return "Die Endzeit muss nach der Startzeit liegen.";
  }

  if (isAfterTime(value, formatTimeInput(appointmentBlock.end))) {
    return "Die Endzeit muss im Terminblock liegen.";
  }

  const bookedAppointments = appointmentBlock.bookedAppointments;
  if (bookedAppointments.length > 0) {
    const latestBookedAppointment = bookedAppointments.toSorted(
      (a, b) => b.end.getTime() - a.end.getTime(),
    )[0];

    if (isBeforeTime(value, formatTimeInput(latestBookedAppointment!.end))) {
      return "Es sind bereits Termine nach dieser Zeit gebucht.";
    }
  }

  if (
    appointmentBlock.types.every(
      (type) =>
        calculateAppointmentsPerBlock(
          type,
          parseTime(startTime, appointmentBlock.start),
          parseTime(value, appointmentBlock.end),
          standardDurations,
        ) === 0,
    )
  ) {
    const appointmentDurationInMinutes =
      unique(
        appointmentBlock.types.map((type) =>
          getAppointmentDurationInMinutes(type, standardDurations),
        ),
      ).join(", ") + " Minuten";
    return `Die Dauer ist nicht teilbar durch die Terminlängen: ${appointmentDurationInMinutes}.`;
  }
  return undefined;
}
