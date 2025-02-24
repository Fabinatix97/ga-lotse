/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { NumberField } from "@eshg/lib-portal/components/formFields/NumberField";
import { SelectField } from "@eshg/lib-portal/components/formFields/SelectField";
import {
  AppointmentListForDate,
  AppointmentListProps,
} from "@eshg/lib-portal/components/formFields/appointmentPicker/AppointmentListForDate";
import {
  AppointmentPickerField,
  FIELD_LABELS_DE,
} from "@eshg/lib-portal/components/formFields/appointmentPicker/AppointmentPickerField";
import { toDateTimeString } from "@eshg/lib-portal/helpers/dateTime";
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
import { Sheet, Stack, Typography } from "@mui/joy";
import { addMinutes, isEqual } from "date-fns";
import { Formik, FormikHelpers, useFormikContext } from "formik";
import {
  Dispatch,
  ReactNode,
  SetStateAction,
  useEffect,
  useMemo,
  useReducer,
  useState,
} from "react";
import { clamp, isEmpty, prop, sortBy } from "remeda";

import { useBookAppointment } from "@/lib/businessModules/officialMedicalService/api/mutations/appointmentApi";
import { usePostAppointment } from "@/lib/businessModules/officialMedicalService/api/mutations/employeeOmsProcedureApi";
import { useGetFreeAppointmentsQuery } from "@/lib/businessModules/officialMedicalService/api/queries/appointmentBlocksApi";
import { APPOINTMENT_TYPE_OPTIONS } from "@/lib/businessModules/officialMedicalService/components/appointmentBlocks/options";
import { DetailsItem } from "@/lib/shared/components/detailsSection/items/DetailsItem";
import { MultiFormButtonBar } from "@/lib/shared/components/form/MultiFormButtonBar";
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
  appointmentType: ApiAppointmentType;
  bookingType: ApiBookingType | "SelfBooking";
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

export function useAppointmentSidebar(
  appointmentType: ApiAppointmentType,
  physician?: ApiUser,
) {
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
        appointmentType: appointmentType,
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
  appointmentType: ApiAppointmentType;
  physician?: ApiUser;
}

interface FieldsProps {
  allowSelfBooking: boolean;
  physician?: ApiUser;
  appointments: ApiAppointment[];
  initialValues: AppointmentFormValues;
}

interface SidebarStep {
  title: string;
  subTitle: string;
  fields: (props: Readonly<FieldsProps>) => ReactNode;
}

function getSteps(
  editingExistingAppointment: boolean,
  setCurrentAppointmentType: Dispatch<SetStateAction<ApiAppointmentType>>,
): SidebarStep[] {
  return editingExistingAppointment
    ? [
        {
          title: "Termin buchen",
          subTitle: "",
          fields: (props: Readonly<FieldsProps>) => <BookingForm {...props} />,
        },
      ]
    : [
        {
          title: "Termin buchen",
          subTitle: "Schritt 1 von 2",
          fields: () => (
            <SelectField
              name="appointmentType"
              label="Terminart"
              required="Bitte eine Terminart auswählen"
              options={APPOINTMENT_TYPE_OPTIONS}
              onChange={(value) =>
                setCurrentAppointmentType(value as ApiAppointmentType)
              }
            />
          ),
        },
        {
          title: "Termin buchen",
          subTitle: "Schritt 2 von 2",
          fields: (props: Readonly<FieldsProps>) => <BookingForm {...props} />,
        },
      ];
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
  const [currentAppointmentType, setCurrentAppointmentType] =
    useState(appointmentType);
  const { appointments, initialValues } = useAppointments(
    currentAppointmentType,
    appointment,
    physician?.userId,
  );

  const steps = getSteps(!!appointment, setCurrentAppointmentType);
  const lastStepIndex = steps.length - 1;
  const [stepIndex, changeToStep] = useReducer(
    (_index: number, newIndex: number) =>
      clamp(newIndex, { min: 0, max: lastStepIndex }),
    0,
  );
  const step = steps[stepIndex]!;
  const Fields = step.fields;

  async function handleSubmit(values: AppointmentFormValues) {
    if (values.bookingType === ApiBookingType.AppointmentBlock) {
      values = {
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
    const isOnLastStep = stepIndex === lastStepIndex;

    if (isOnLastStep) {
      await handleSubmit(newValues);
      helpers.resetForm();
      changeToStep(0);
    } else {
      changeToStep(stepIndex + 1);
    }
  }

  return (
    <Formik initialValues={initialValues} onSubmit={handleNext}>
      {({ isSubmitting }) => (
        <SidebarForm ref={formRef}>
          <SidebarContent title={step.title} subtitle={step.subTitle}>
            <Fields
              allowSelfBooking={allowSelfBooking}
              appointments={appointments}
              initialValues={initialValues}
              physician={physician}
            />
          </SidebarContent>
          <AppointmentSidebarActions
            isSubmitting={isSubmitting}
            onClose={handleClose}
            stepIndex={stepIndex}
            changeToStep={changeToStep}
            lastStepIndex={lastStepIndex}
          />
        </SidebarForm>
      )}
    </Formik>
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
  const { dirty } = useFormikContext<AppointmentFormValues>();
  const isOnFirstStep = stepIndex === 0;
  const isOnLastStep = stepIndex === lastStepIndex;

  let submitLabel;
  if (isOnLastStep) {
    submitLabel = dirty ? "Buchen" : "Schließen";
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
  appointments,
  initialValues,
}: Readonly<FieldsProps>) {
  return (
    <>
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
    </>
  );
}

function useAppointments(
  appointmentType: ApiAppointmentType,
  appointment?: ApiOmsAppointment,
  physicianId?: string,
): {
  appointments: ApiAppointment[];
  initialValues: AppointmentFormValues;
} {
  const { data } = useGetFreeAppointmentsQuery(appointmentType, physicianId);

  const [appointments, setAppointments] = useState(data.appointments);

  useEffect(() => {
    setAppointments(data.appointments);
  }, [data.appointments]);

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
        appointmentType: appointmentType,
        bookingType:
          appointment?.bookingType ?? ApiBookingType.AppointmentBlock,
        appointment: blockAppointment,
        start: start ? toDateTimeString(start) : "",
        duration: duration ?? 30,
      },
    };
  }, [appointments, appointment, appointmentType]);
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
          appointmentList={StyledAppointmentListForDate}
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

// AppointmentListForDate but with equal width chips and time labels with no leading zeros
export function StyledAppointmentListForDate<T extends Appointment>(
  props: AppointmentListProps<T>,
) {
  return (
    <AppointmentListForDate
      {...props}
      slotProps={{
        chip: {
          sx: {
            minWidth: "4rem",
            paddingX: 0,
          },
        },
      }}
      getLabel={(apt) =>
        apt.start.toLocaleTimeString("de-DE", {
          hour: "numeric",
          minute: "2-digit",
        })
      }
    />
  );
}
