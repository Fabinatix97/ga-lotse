/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Sheet, Stack, Typography } from "@mui/joy";
import { addMinutes, isEqual } from "date-fns";
import { Formik, FormikHelpers, useFormikContext } from "formik";
import { useEffect, useMemo, useState } from "react";
import { isEmpty, prop, sortBy } from "remeda";

import {
  DateTimeField,
  DetailsItem,
  MultiFormButtonBar,
  SidebarActions,
  SidebarContent,
  SidebarForm,
  SidebarWithFormRefProps,
  useSidebarWithFormRef,
} from "@eshg/lib-employee-portal";
import { Alert } from "@eshg/lib-portal/components/Alert";
import { NumberField } from "@eshg/lib-portal/components/formFields/NumberField";
import { SelectField } from "@eshg/lib-portal/components/formFields/SelectField";
import {
  AppointmentPickerField,
  FIELD_LABELS_DE,
} from "@eshg/lib-portal/components/formFields/appointmentPicker/AppointmentPickerField";
import {
  isDateCurrentDateOrGreater,
  toDateTimeString,
} from "@eshg/lib-portal/helpers/dateTime";
import {
  validateIntegerAnd,
  validateRange,
} from "@eshg/lib-portal/helpers/validators";
import {
  ApiAppointment,
  ApiAppointmentType,
  ApiBookingType,
  ApiOmsAppointment,
  ApiUser,
} from "@eshg/official-medical-service-api";

import { useBookAppointment } from "@/lib/businessModules/officialMedicalService/api/mutations/appointmentApi";
import { usePostAppointment } from "@/lib/businessModules/officialMedicalService/api/mutations/employeeOmsProcedureApi";
import { useGetFreeAppointmentsQuery } from "@/lib/businessModules/officialMedicalService/api/queries/appointmentBlocksApi";
import { APPOINTMENT_TYPE_OPTIONS } from "@/lib/businessModules/officialMedicalService/components/appointmentBlocks/options";
import {
  RadioAccordionGroupField,
  RadioAccordionItem,
} from "@/lib/shared/components/formFields/RadioAccordionField";

interface Appointment {
  start: Date;
  end: Date;
}

type BookingType = ApiBookingType | "SelfBooking";

interface AppointmentFormValues {
  step: 0 | 1;
  appointmentType: ApiAppointmentType;
  bookingType: BookingType;
  appointment?: Appointment;
  start: string;
  duration: number;
}

export function useCreateAppointmentSidebar(
  procedureId: string,
  appointmentType: ApiAppointmentType,
  physician?: ApiUser,
) {
  const { mutateAsync: createAppointment } = usePostAppointment();

  return useSidebarWithFormRef({
    component: (props: Readonly<SidebarWithFormRefProps>) => {
      async function handleSave(values: AppointmentFormValues) {
        await createAppointment({
          procedureId,
          request: {
            appointmentType: values.appointmentType,
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
        appointmentType: appointmentType,
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
  appointmentType?: ApiAppointmentType;
  physician?: ApiUser;
}

function EmbeddedAppointmentSidebar({
  formRef,
  onClose: handleClose,
  onSave,
  appointment,
  allowSelfBooking,
  physician,
  appointmentType,
}: Readonly<AppointmentSidebarProps>) {
  const initialValues = useInitialValues(appointment, appointmentType);

  const lastStepIndex = appointment ? 0 : 1;

  async function handleSubmit(values: AppointmentFormValues) {
    if (values.bookingType === ApiBookingType.AppointmentBlock) {
      values = {
        step: values.step,
        appointmentType: values.appointmentType,
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

  async function handleNext(
    newValues: AppointmentFormValues,
    helpers: FormikHelpers<AppointmentFormValues>,
  ) {
    const isOnLastStep = newValues.step === lastStepIndex;

    if (isOnLastStep) {
      await handleSubmit(newValues);
      helpers.resetForm();
    } else {
      void helpers.setFieldValue("step", newValues.step + 1, false);
    }
  }
  return (
    <Formik initialValues={initialValues} onSubmit={handleNext}>
      {({ isSubmitting, values, setFieldValue }) => {
        const subTitle = appointment ? "" : `Schritt ${values.step + 1} von 2`;
        return (
          <SidebarForm ref={formRef}>
            <SidebarContent title="Termin buchen" subtitle={subTitle}>
              <Fields
                allowSelfBooking={allowSelfBooking}
                initialValues={initialValues}
                physician={physician}
                stepIndex={values.step}
                originalAppointment={appointment}
              />
            </SidebarContent>
            <AppointmentSidebarActions
              isSubmitting={isSubmitting}
              onClose={handleClose}
              stepIndex={values.step}
              changeToStep={(s) => setFieldValue("step", s, false)}
              lastStepIndex={lastStepIndex}
            />
          </SidebarForm>
        );
      }}
    </Formik>
  );
}

function Fields({
  stepIndex,
  ...props
}: Readonly<{
  allowSelfBooking: boolean;
  physician?: ApiUser;
  initialValues: AppointmentFormValues;
  stepIndex: 0 | 1;
  originalAppointment?: ApiOmsAppointment;
}>) {
  if (props.originalAppointment || stepIndex) {
    return <BookingForm {...props} />;
  }
  return (
    <SelectField
      name="appointmentType"
      label="Terminart"
      required="Bitte eine Terminart auswählen"
      options={APPOINTMENT_TYPE_OPTIONS}
    />
  );
}

function AppointmentSidebarActions({
  isSubmitting,
  onClose,
  stepIndex,
  changeToStep,
  lastStepIndex,
}: {
  isSubmitting: boolean;
  onClose: (force?: boolean) => void;
  stepIndex: number;
  changeToStep: (newStep: number) => void;
  lastStepIndex: number;
}) {
  const isOnFirstStep = stepIndex === 0;
  const isOnLastStep = stepIndex === lastStepIndex;

  let submitLabel;
  if (isOnLastStep) {
    submitLabel = "Buchen";
  } else {
    submitLabel = "Weiter";
  }

  return (
    <SidebarActions>
      <MultiFormButtonBar
        submitting={isSubmitting}
        onCancel={() => onClose(true)}
        onBack={isOnFirstStep ? undefined : () => changeToStep(stepIndex - 1)}
        submitLabel={submitLabel}
      />
    </SidebarActions>
  );
}

function BookingForm({
  allowSelfBooking,
  physician,
  initialValues,
  originalAppointment,
}: Readonly<{
  allowSelfBooking: boolean;
  physician?: ApiUser;
  initialValues: AppointmentFormValues;
  originalAppointment?: ApiOmsAppointment;
}>) {
  const appointments = useFreeAppointments(
    originalAppointment,
    physician?.userId,
  );

  return (
    <Stack gap={2}>
      {appointments.length === 0 && (
        <Alert
          color="warning"
          message="Es sind keine freien Terminblöcke verfügbar."
        />
      )}
      <AssignedPhysician physician={physician} />
      <RadioAccordionGroupField
        name="bookingType"
        data-testid="booking-type-radio-control"
      >
        <RadioAccordionItem
          value={ApiBookingType.AppointmentBlock}
          label="Aus Terminblock"
          disabled={appointments.length === 0}
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
    </Stack>
  );
}

function useFreeAppointments(
  originalAppointment?: ApiOmsAppointment,
  physicianId?: string,
): ApiAppointment[] {
  const {
    values: { appointment, appointmentType },
    setFieldValue,
  } = useFormikContext<AppointmentFormValues>();
  const {
    data: { appointments },
  } = useGetFreeAppointmentsQuery(appointmentType, physicianId);

  // set booking type depending on availability of appointment block elements
  const appointmentsAvailable = appointments.length > 0;
  useEffect(() => {
    const initialBookingType = appointmentsAvailable
      ? ApiBookingType.AppointmentBlock
      : ApiBookingType.UserDefined;
    void setFieldValue("bookingType", initialBookingType, false);
  }, [setFieldValue, appointmentsAvailable]);

  // if we can't find an appointment block element of an appointment we are editing, add one
  const result = useMemo(() => {
    if (
      originalAppointment?.bookingType === ApiBookingType.AppointmentBlock &&
      originalAppointment?.start &&
      originalAppointment?.duration
    ) {
      const start = new Date(originalAppointment.start);
      const end = addMinutes(start, originalAppointment.duration);
      const selectedAppointmentBlockExists = appointments.some(
        (apt) => isEqual(apt.start, start) && isEqual(apt.end, end),
      );
      if (!selectedAppointmentBlockExists) {
        const blockAppointment = {
          start,
          end,
        };
        return sortBy([...appointments, blockAppointment], prop("start"));
      }
    }
    return appointments;
  }, [appointments, originalAppointment]);

  // select appointment block element from appointment we're editing
  useEffect(() => {
    if (
      originalAppointment?.bookingType === ApiBookingType.AppointmentBlock &&
      originalAppointment?.start &&
      originalAppointment?.duration
    ) {
      const start = new Date(originalAppointment.start);
      const end = addMinutes(start, originalAppointment.duration);
      const blockAppointment = result.find(
        (apt) => isEqual(apt.start, start) && isEqual(apt.end, end),
      );
      if (blockAppointment) {
        void setFieldValue("appointment", blockAppointment, false);
      }
    }
  }, [setFieldValue, result, originalAppointment]);

  // deselect appointment if it does not exist (can happen if user switches appointment type after selecting appointment)
  useEffect(() => {
    const selectedAppointmentBlockExists =
      appointment &&
      result.some(
        (apt) =>
          isEqual(apt.start, appointment.start) &&
          isEqual(apt.end, appointment.end),
      );
    if (!selectedAppointmentBlockExists) {
      void setFieldValue("appointment", null, false);
    }
  }, [setFieldValue, result, appointment]);

  return result;
}

function useInitialValues(
  appointment?: ApiOmsAppointment,
  appointmentType?: ApiAppointmentType,
): AppointmentFormValues {
  return useMemo(() => {
    const start =
      appointment?.bookingType === ApiBookingType.UserDefined
        ? appointment?.start
        : undefined;
    const duration =
      appointment?.bookingType === ApiBookingType.UserDefined
        ? appointment?.duration
        : undefined;

    return {
      step: 0,
      appointmentType:
        appointmentType ??
        appointment?.appointmentType ??
        ApiAppointmentType.OfficialMedicalServiceShort,
      bookingType: appointment?.bookingType ?? ApiBookingType.UserDefined,
      appointment: undefined,
      start: start ? toDateTimeString(start) : "",
      duration: duration ?? 30,
    };
  }, [appointment, appointmentType]);
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

  const filteredAppointments = useMemo(
    () =>
      appointments.filter((appointment) =>
        isDateCurrentDateOrGreater(appointment.start),
      ),
    [appointments],
  );

  return (
    <Sheet variant="plain" sx={{ borderRadius: "8px" }}>
      {isEmpty(filteredAppointments) ? (
        <Typography>Keine freien Terminblöcke verfügbar ☹</Typography>
      ) : (
        <AppointmentPickerField
          name="appointment"
          currentMonth={month}
          setCurrentMonth={setMonth}
          monthAppointments={filteredAppointments}
          required={isExpanded}
          labels={FIELD_LABELS_DE}
          slotProps={{ list: { trimLeadingZero: true } }}
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
      <DetailsItem
        label="Zugewiesene:r Arzt/Ärztin"
        value={physician.firstName + " " + physician.lastName}
        slotProps={{
          label: { level: "title-md" },
          value: { level: "body-sm" },
        }}
      />
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
