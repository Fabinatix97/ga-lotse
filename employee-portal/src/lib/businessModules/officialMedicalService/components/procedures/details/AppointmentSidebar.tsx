/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  ApiAppointment,
  ApiAppointmentType,
  ApiBookingType,
  ApiOmsAppointment,
  ApiUser,
} from "@eshg/employee-portal-api/officialMedicalService";
import { SubmitButton } from "@eshg/lib-portal/components/buttons/SubmitButton";
import { NumberField } from "@eshg/lib-portal/components/formFields/NumberField";
import {
  AppointmentPickerField,
  FIELD_LABELS_DE,
} from "@eshg/lib-portal/components/formFields/appointmentPicker/AppointmentPickerField";
import { assertNever } from "@eshg/lib-portal/helpers/assertions";
import { toDateTimeString } from "@eshg/lib-portal/helpers/dateTime";
import {
  validateIntegerAnd,
  validateRange,
} from "@eshg/lib-portal/helpers/validators";
import { Box, Button, Sheet, Stack, Typography } from "@mui/joy";
import { addMinutes, isEqual } from "date-fns";
import { Formik, useFormikContext } from "formik";
import { useMemo, useState } from "react";
import { isEmpty, prop, sortBy } from "remeda";

import { useBookAppointment } from "@/lib/businessModules/officialMedicalService/api/mutations/appointmentApi";
import { usePostAppointment } from "@/lib/businessModules/officialMedicalService/api/mutations/employeeOmsProcedureApi";
import { useGetFreeAppointmentsQuery } from "@/lib/businessModules/officialMedicalService/api/queries/appointmentBlocksApi";
import { ButtonBar } from "@/lib/shared/components/buttons/ButtonBar";
import { SidebarForm } from "@/lib/shared/components/form/SidebarForm";
import { DateTimeField } from "@/lib/shared/components/formFields/DateTimeField";
import {
  RadioAccordionGroupField,
  RadioAccordionItem,
} from "@/lib/shared/components/formFields/RadioAccordionField";
import { SidebarActions } from "@/lib/shared/components/sidebar/SidebarActions";
import { SidebarContent } from "@/lib/shared/components/sidebar/SidebarContent";
import {
  SidebarWithFormRefProps,
  useSidebarWithFormRef,
} from "@/lib/shared/hooks/useSidebarWithFormRef";

interface Appointment {
  start: Date;
  end: Date;
}

interface AppointmentFormValues {
  bookingType: ApiBookingType | "SelfBooking";
  appointment?: Appointment;
  start: string;
  duration: number;
}

export function useCreateAppointmentSidebar(
  procedureId: string,
  physician?: ApiUser,
) {
  const { mutateAsync: createAppointment } = usePostAppointment();

  return useSidebarWithFormRef({
    component: (props: Readonly<SidebarWithFormRefProps>) => {
      async function handleSave(values: AppointmentFormValues) {
        await createAppointment({
          procedureId,
          request: {
            appointmentType: ApiAppointmentType.OfficialMedicalService,
            bookingInfo:
              values.bookingType === "SelfBooking"
                ? undefined
                : {
                    bookingType: values.bookingType,
                    start: new Date(values.start),
                    duration: values.duration,
                  },
          },
        });
      }

      return EmbeddedAppointmentSidebar({
        onSave: handleSave,
        allowSelfBooking: true,
        physician,
        ...props,
      });
    },
  });
}

export function useAppointmentSidebar(physician?: ApiUser) {
  const { mutateAsync: bookAppointment } = useBookAppointment();

  return useSidebarWithFormRef({
    component: (props: Readonly<ExternalAppointmentSidebarProps>) => {
      async function handleSave(values: AppointmentFormValues) {
        if (values.bookingType === "SelfBooking") {
          throw new Error("Unexpected SelfBooking");
        }
        await bookAppointment({
          appointmentId: props.appointment.appointmentId,
          request: {
            bookingType: values.bookingType,
            start: new Date(values.start),
            duration: values.duration,
          },
        });
      }

      return EmbeddedAppointmentSidebar({
        onSave: handleSave,
        allowSelfBooking: false,
        physician,
        ...props,
      });
    },
  });
}

interface ExternalAppointmentSidebarProps extends SidebarWithFormRefProps {
  appointment: ApiOmsAppointment;
}

interface AppointmentSidebarProps extends SidebarWithFormRefProps {
  onSave: (values: AppointmentFormValues) => Promise<void>;
  appointment?: ApiOmsAppointment;
  allowSelfBooking: boolean;
  physician?: ApiUser;
}

function EmbeddedAppointmentSidebar({
  formRef,
  onClose: handleClose,
  onSave,
  appointment,
  allowSelfBooking,
  physician,
}: Readonly<AppointmentSidebarProps>) {
  const { appointments, initialValues } = useAppointments(
    appointment,
    physician?.userId,
  );

  async function handleSubmit(values: AppointmentFormValues) {
    if (values.bookingType === ApiBookingType.AppointmentBlock) {
      values = {
        bookingType: ApiBookingType.AppointmentBlock,
        start: toDateTimeString(values.appointment!.start),
        duration: Math.round(
          (values.appointment!.end.getTime() -
            values.appointment!.start.getTime()) /
            1000 /
            60,
        ),
      };
    }
    await onSave(values);
    handleClose(true);
  }

  return (
    <Formik initialValues={initialValues} onSubmit={handleSubmit}>
      {({ isSubmitting }) => (
        <SidebarForm ref={formRef}>
          <SidebarContent title="Termin buchen">
            <AssignedPhysician physician={physician} />
            <RadioAccordionGroupField
              name="bookingType"
              data-testid="booking-type-radio-control"
            >
              <RadioAccordionItem
                value={ApiBookingType.AppointmentBlock}
                label="Aus Terminblock"
              >
                {(isExpanded) => (
                  <AppointmentBlockForm
                    isExpanded={isExpanded}
                    appointments={appointments}
                    initialMonth={initialValues.appointment?.start}
                  />
                )}
              </RadioAccordionItem>
              <RadioAccordionItem
                value={ApiBookingType.UserDefined}
                label="Individueller Termin"
              >
                {(isExpanded) => (
                  <AppointmentUserDefinedForm isExpanded={isExpanded} />
                )}
              </RadioAccordionItem>
              {allowSelfBooking && (
                <RadioAccordionItem
                  sx={{ "& .MuiAccordionDetails-root": { height: 0 } }}
                  value={"SelfBooking"}
                  label="Selbstbuchung"
                />
              )}
            </RadioAccordionGroupField>
          </SidebarContent>
          <AppointmentSidebarActions
            isSubmitting={isSubmitting}
            onClose={handleClose}
            initialValues={initialValues}
          />
        </SidebarForm>
      )}
    </Formik>
  );
}

function AppointmentSidebarActions({
  isSubmitting,
  onClose,
  initialValues,
}: {
  isSubmitting: boolean;
  onClose: (force?: boolean) => void;
  initialValues: AppointmentFormValues;
}) {
  const { values } = useFormikContext<AppointmentFormValues>();
  const dirty = !isAppointmentFormValuesEqual(initialValues, values);

  return (
    <SidebarActions>
      <ButtonBar
        left={
          dirty && (
            <Button
              variant="plain"
              color="primary"
              onClick={() => onClose(true)}
            >
              Abbrechen
            </Button>
          )
        }
        right={
          dirty ? (
            <SubmitButton submitting={isSubmitting}>Buchen</SubmitButton>
          ) : (
            <Button onClick={() => onClose(true)}>Schließen</Button>
          )
        }
      />
    </SidebarActions>
  );
}

function isAppointmentFormValuesEqual(
  v1: AppointmentFormValues,
  v2: AppointmentFormValues,
) {
  if (v1.bookingType !== v2.bookingType) return false;
  switch (v1.bookingType) {
    case ApiBookingType.AppointmentBlock:
      if (!v1.appointment || !v2.appointment)
        return v1.appointment == v2.appointment;
      return (
        isEqual(v1.appointment.start, v2.appointment.start) &&
        isEqual(v1.appointment.end, v2.appointment.end)
      );
    case ApiBookingType.UserDefined:
      return v1.start === v2.start && v1.duration === v2.duration;
    case "SelfBooking":
      return true;
    default:
      assertNever(v1.bookingType);
  }
}

function useAppointments(
  appointment?: ApiOmsAppointment,
  physicianId?: string,
): {
  appointments: ApiAppointment[];
  initialValues: AppointmentFormValues;
} {
  const { data } = useGetFreeAppointmentsQuery(physicianId);

  const [appointments, setAppointments] = useState(data.appointments);

  return useMemo(() => {
    let blockAppointment: ApiAppointment | undefined = undefined;
    if (
      appointment?.bookingType === ApiBookingType.AppointmentBlock &&
      appointment?.start &&
      appointment?.duration
    ) {
      const start = new Date(appointment.start);
      const end = addMinutes(start, appointment.duration);
      blockAppointment = appointments.find(
        (apt) => isEqual(apt.start, start) && isEqual(apt.end, end),
      );
      if (!blockAppointment) {
        blockAppointment = {
          start,
          end,
        };
        setAppointments(
          sortBy([...appointments, blockAppointment], prop("start")),
        );
      }
    }
    const start =
      appointment?.bookingType === ApiBookingType.UserDefined
        ? appointment?.start
        : undefined;
    const duration =
      appointment?.bookingType === ApiBookingType.UserDefined
        ? appointment?.duration
        : undefined;
    return {
      appointments,
      initialValues: {
        bookingType:
          appointment?.bookingType ?? ApiBookingType.AppointmentBlock,
        appointment: blockAppointment,
        start: start ? toDateTimeString(start) : "",
        duration: duration ?? 30,
      },
    };
  }, [appointments, appointment]);
}

function AppointmentBlockForm({
  isExpanded = true,
  appointments,
  initialMonth,
}: Readonly<{
  isExpanded?: boolean;
  appointments: ApiAppointment[];
  initialMonth?: Date;
}>) {
  const [month, setMonth] = useState<Date>(initialMonth ?? new Date());

  return (
    <Sheet variant="plain" sx={{ borderRadius: "8px" }}>
      {isEmpty(appointments) ? (
        <Typography>Keine freien Terminblöcke verfügbar ☹</Typography>
      ) : (
        <AppointmentPickerField
          sx={{
            // just for aligning the separator line
            width: "min-content",
          }}
          name="appointment"
          currentMonth={month}
          setCurrentMonth={setMonth}
          monthAppointments={appointments}
          required={isExpanded}
          labels={FIELD_LABELS_DE}
          isAppointmentEqual={(apt1: ApiAppointment, apt2: ApiAppointment) =>
            isEqual(apt1.start, apt2.start) && isEqual(apt1.end, apt2.end)
          }
        />
      )}
    </Sheet>
  );
}

function AssignedPhysician({ physician }: { physician?: ApiUser }) {
  return (
    physician && (
      <Box component="dl">
        <Typography component="dt" my={2} level="title-md">
          Zugewiesene:r Arzt/Ärztin
        </Typography>
        <Typography component="dd" my={2}>
          {physician.firstName} {physician.lastName}
        </Typography>
      </Box>
    )
  );
}

function AppointmentUserDefinedForm({
  isExpanded = true,
}: Readonly<{
  isExpanded?: boolean;
}>) {
  return (
    <Stack gap={2}>
      <DateTimeField
        name="start"
        label="Datum und Zeit"
        required={isExpanded ? "Datum und Zeit sind erforderlich" : undefined}
      />
      <NumberField
        name="duration"
        label="Termindauer in Minuten"
        validate={validateIntegerAnd(validateRange(0, 1440))}
        required={isExpanded ? "Termindauer ist erforderlich" : undefined}
      />
    </Stack>
  );
}
