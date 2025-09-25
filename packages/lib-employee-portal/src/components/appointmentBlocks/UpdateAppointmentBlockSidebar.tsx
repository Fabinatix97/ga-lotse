/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { Grid, Stack, Typography } from "@mui/joy";
import { Formik } from "formik";
import { Ref } from "react";
import { isDefined, unique } from "remeda";

import {
  NumberField,
  OptionalFieldValue,
  QueryKeyFactory,
} from "@eshg/lib-portal";

import { AppointmentBlockApi } from "../../api/AppointmentBlockApi";
import { useUpdateAppointmentBlock } from "../../api/mutations/appointmentBlock";
import { useGetAppointmentBlock } from "../../api/queries/appointmentBlock";
import { SidebarActions } from "../../features/drawer/components/SidebarActions";
import { SidebarContent } from "../../features/drawer/components/SidebarContent";
import { SidebarForm } from "../../features/drawer/components/SidebarForm";
import {
  SidebarWithFormRefProps,
  UseSidebarWithFormRefResult,
  useSidebarWithFormRef,
} from "../../features/drawer/hooks/useSidebarWithFormRef";
import { SidebarFormHandle } from "../../features/drawer/types/sidebar";
import {
  formatDateInput,
  formatTimeInput,
  isAfterTime,
  isBeforeTime,
  parseTime,
  toLocalDateTime,
} from "../../utils/dateTime";
import { FormButtonBar } from "../form/FormButtonBar";
import { TimeField } from "../formFields/TimeField";

import { AppointmentBlock } from "./AppointmentBlockGroup";
import {
  calculateAppointmentsPerBlock,
  getAppointmentDurationInMinutes,
} from "./calculateAppointmentCount";
import { calculateMaxParallelBookings } from "./calculateMaxParallelBookings";
import { ApiAppointmentType } from "./types";

export function useUpdateAppointmentBlockSidebar(): UseSidebarWithFormRefResult<UpdateAppointmentBlockProps> {
  return useSidebarWithFormRef({ component: UpdateAppointmentBlockSidebar });
}

interface UpdateAppointmentBlockProps extends SidebarWithFormRefProps {
  appointmentBlockId: string;
  appointmentTypes: ApiAppointmentType[];
  formRef: Ref<SidebarFormHandle>;
  appointmentBlockApi: AppointmentBlockApi;
  appointmentBlockApiQueryKey: QueryKeyFactory;
  standardDurations: Partial<Record<ApiAppointmentType, number>>;
}

export interface UpdateAppointmentBlockValues {
  startTime: string;
  endTime: string;
  parallelExaminations?: number;
}

export function UpdateAppointmentBlockSidebar(
  props: UpdateAppointmentBlockProps,
) {
  const { appointmentBlockApi, appointmentBlockId } = props;
  const { data: appointmentBlock } = useGetAppointmentBlock(
    appointmentBlockId,
    appointmentBlockApi,
    props.appointmentBlockApiQueryKey,
  );

  const updateMutations = useUpdateAppointmentBlock(appointmentBlockApi);

  async function handleUpdate(values: UpdateAppointmentBlockValues) {
    await updateMutations.mutateAsync({
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
        parallelExaminations: values.parallelExaminations ?? 1,
        mfas: appointmentBlock.mfas ?? [],
        physicians: appointmentBlock.physicians ?? [],
        consultants: appointmentBlock.consultants ?? [],
      },
    });

    props.onClose(true);
  }
  return (
    <Formik
      initialValues={{
        startTime: formatTimeInput(appointmentBlock.start),
        endTime: formatTimeInput(appointmentBlock.end),
        parallelExaminations: appointmentBlock.parallelExaminations,
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
            </Stack>
          </SidebarContent>
          <SidebarActions>
            <FormButtonBar
              submitLabel="Speichern"
              submitting={isSubmitting}
              onCancel={() => props.onClose(true)}
            />
          </SidebarActions>
        </SidebarForm>
      )}
    </Formik>
  );
}

function validateAppointmentStartTime(
  value: string,
  appointmentBlock: AppointmentBlock,
) {
  if (isBeforeTime(value, formatTimeInput(appointmentBlock.start))) {
    return "Die Startzeit muss im Terminblock liegen.";
  }
  const bookedAppointments = appointmentBlock.bookedAppointments;
  if (isDefined(bookedAppointments) && bookedAppointments.length > 0) {
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
  appointmentBlock: AppointmentBlock,
  types: ApiAppointmentType[],
  standardDurations: Partial<Record<ApiAppointmentType, number>>,
) {
  if (!isAfterTime(value, startTime)) {
    return "Die Endzeit muss nach der Startzeit liegen.";
  }

  if (isAfterTime(value, formatTimeInput(appointmentBlock.end))) {
    return "Die Endzeit muss im Terminblock liegen.";
  }

  const bookedAppointments = appointmentBlock.bookedAppointments;
  if (isDefined(bookedAppointments) && bookedAppointments.length > 0) {
    const latestBookedAppointment = bookedAppointments.toSorted(
      (a, b) => b.end.getTime() - a.end.getTime(),
    )[0];

    if (isBeforeTime(value, formatTimeInput(latestBookedAppointment!.end))) {
      return "Es sind bereits Termine nach dieser Zeit gebucht.";
    }
  }

  if (
    types.every(
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
        types.map((type) =>
          getAppointmentDurationInMinutes(type, standardDurations),
        ),
      ).join(", ") + " Minuten";
    return `Die Dauer ist nicht teilbar durch die Terminlängen: ${appointmentDurationInMinutes}.`;
  }
  return undefined;
}

function validateParallelExaminations(
  value: OptionalFieldValue<number>,
  appointmentBlock: AppointmentBlock,
) {
  if (typeof value !== "number") {
    return "Bitte die Anzahl paralleler Untersuchungen angeben.";
  }
  if (value < 1) {
    return "Die Anzahl der parallelen Untersuchungen muss mindestens 1 betragen.";
  }
  if (value > 10) {
    return "Die Anzahl der parallelen Untersuchungen darf höchstens 10 betragen.";
  }
  if (value > appointmentBlock.parallelExaminations!) {
    return "Die Anzahl der parallelen Untersuchungen kann nicht erhöht werden.";
  }

  if (isDefined(appointmentBlock.bookedAppointments)) {
    const maxParallelBookings = calculateMaxParallelBookings(
      appointmentBlock.bookedAppointments,
    );
    if (value < maxParallelBookings) {
      return `Die Anzahl der parallelen Untersuchungen muss mindestens gleich der maximalen Anzahl der gleichzeitig gebuchten Termine (${maxParallelBookings}) sein.`;
    }
  }
  return undefined;
}
