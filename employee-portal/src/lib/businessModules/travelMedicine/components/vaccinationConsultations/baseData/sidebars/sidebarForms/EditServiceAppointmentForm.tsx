/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  SidebarActions,
  SidebarContent,
  SidebarForm,
  SidebarFormHandle,
} from "@eshg/lib-employee-portal";
import { SelectField } from "@eshg/lib-portal/components/formFields/SelectField";
import {
  formatDate,
  formatDateTime,
} from "@eshg/lib-portal/formatters/dateTime";
import {
  ApiAppointmentBookingType,
  ApiAppointmentType,
  ApiProcedureStepService,
} from "@eshg/travel-medicine-api";
import { Chip, List, ListItem, Sheet, Stack, Typography } from "@mui/joy";
import { Formik, FormikErrors } from "formik";
import { Ref, useId } from "react";

import { theme } from "@/lib/baseModule/theme/theme";
import { Appointment } from "@/lib/businessModules/travelMedicine/api/models/Appointment";
import { AppointmentRadioGroup } from "@/lib/businessModules/travelMedicine/components/vaccinationConsultations/shared/AppointmentRadioGroup";
import { MultiFormButtonBar } from "@/lib/shared/components/form/MultiFormButtonBar";

export interface EditServiceAppointmentFormValues {
  procedureId: string;
  bookingType?: ApiAppointmentBookingType;
  appointmentBlockDate?: { start: Date; end: Date };
  userDefinedAppointmentDate?: string;
  procedureStepId: string;
  appointmentType?: ApiAppointmentType;
  appointmentTypeStandardDuration: number;
  appointmentDate: Date | undefined;
  earliestDate: Date | undefined;
}

interface EditServiceAppointmentFormProps {
  initialValues: EditServiceAppointmentFormValues;
  isInitialStep: boolean;
  procedureStepServices: ApiProcedureStepService[];
  freeConsultationBlockAppointments: Appointment[];
  freeVaccinationBlockAppointments: Appointment[];
  formRef: Ref<SidebarFormHandle>;
  onCancel: () => void;
  onSubmit: (values: EditServiceAppointmentFormValues) => Promise<void>;
  title: string;
  submitLabel: string;
}

function formatAppointmentInfo(
  earliestDate: Date | undefined,
  appointmentDate: Date,
  bookingType: ApiAppointmentBookingType | undefined,
) {
  return (
    <Stack gap={2} data-testid="booking-status">
      {earliestDate && (
        <Typography sx={{ margin: 0 }}>
          Selbstbuchung ab: {formatDate(earliestDate)}
        </Typography>
      )}
      {bookingType === "SELF_BOOKING" ? (
        <Typography sx={{ margin: 0 }}>
          {formatBookingType(bookingType)}
        </Typography>
      ) : (
        <Typography sx={{ margin: 0 }}>
          {`${formatDateTime(appointmentDate)} Uhr `}
          {formatBookingType(bookingType)}
        </Typography>
      )}
    </Stack>
  );
}

function formatBookingType(bookingType: ApiAppointmentBookingType | undefined) {
  if (
    bookingType === ApiAppointmentBookingType.UserDefined ||
    bookingType === ApiAppointmentBookingType.AppointmentBlock
  ) {
    return (
      <Chip color={"primary"} size="md" component={"span"}>
        Gebucht
      </Chip>
    );
  } else if (bookingType === ApiAppointmentBookingType.Cancelled) {
    return (
      <Chip color={"danger"} size="md">
        Abgesagt
      </Chip>
    );
  } else {
    return (
      <Chip color={"neutral"} size="md">
        Nicht gebucht
      </Chip>
    );
  }
}

export function EditServiceAppointmentForm(
  props: Readonly<EditServiceAppointmentFormProps>,
) {
  function validateForm(values: EditServiceAppointmentFormValues) {
    const errors: FormikErrors<EditServiceAppointmentFormValues> = {};
    if (
      values.bookingType === ApiAppointmentBookingType.AppointmentBlock &&
      values.appointmentBlockDate?.start === undefined
    ) {
      errors.appointmentBlockDate = "Bitte einen Termin auswählen";
    } else if (values.bookingType === ApiAppointmentBookingType.UserDefined) {
      if (values.userDefinedAppointmentDate === "") {
        errors.userDefinedAppointmentDate =
          "Bitte eine Datum und eine Uhrzeit auswählen";
      }
      if (values.appointmentTypeStandardDuration < 1) {
        errors.appointmentTypeStandardDuration =
          "Bitte eine positive Zahl eingeben";
      }
    } else if (
      values.bookingType === ApiAppointmentBookingType.Cancelled ||
      values.bookingType === ApiAppointmentBookingType.SelfBooking
    ) {
      errors.bookingType = "Bitte einen Termintyp auswählen";
    }

    return errors;
  }

  const vaccinationLabelId = useId();

  return (
    <Formik
      initialValues={props.initialValues}
      onSubmit={props.onSubmit}
      enableReinitialize
      validate={validateForm}
    >
      {({ isSubmitting, setFieldValue, values }) => (
        <SidebarForm ref={props.formRef}>
          <SidebarContent title={props.title}>
            <Stack spacing={2}>
              <Stack gap={2}>
                <Typography
                  id={vaccinationLabelId}
                  level="body-md"
                  component="label"
                  sx={(theme) => ({
                    fontWeight: theme.fontWeight.md,
                    mt: 2,
                  })}
                >
                  Impfungen
                </Typography>
                {props.procedureStepServices && (
                  <List
                    sx={{ padding: 0 }}
                    aria-labelledby={vaccinationLabelId}
                  >
                    {props.procedureStepServices.map((service) => (
                      <ListItem key={service.serviceId} sx={{ padding: 0 }}>
                        {`${service.serviceDescription}${service.vaccinationNumber ? ` - Nr. ${service.vaccinationNumber}` : ""}`}
                      </ListItem>
                    ))}
                  </List>
                )}
              </Stack>
              {props.isInitialStep && (
                <Sheet>
                  <SelectField
                    label="Terminart"
                    name="appointmentType"
                    options={[
                      {
                        value: ApiAppointmentType.Consultation,
                        label: "Beratung",
                      },
                      {
                        value: ApiAppointmentType.Vaccination,
                        label: "Impfung",
                      },
                    ]}
                    onChange={async () => {
                      await setFieldValue("bookingType", "");
                      await setFieldValue("appointmentBlockDate", "");
                    }}
                    sx={{ flexGrow: 1 }}
                  />
                </Sheet>
              )}
              <AppointmentRadioGroup
                label={
                  <Typography
                    level="body-md"
                    sx={{ fontWeight: theme.fontWeight.lg }}
                  >
                    Termin
                  </Typography>
                }
                appointmentInfo={formatAppointmentInfo(
                  props.initialValues.earliestDate,
                  props.initialValues.appointmentDate!,
                  props.initialValues.bookingType,
                )}
                name="bookingType"
                type={values.appointmentType}
                freeConsultationBlockAppointments={
                  props.freeConsultationBlockAppointments
                }
                freeVaccinationBlockAppointments={
                  props.freeVaccinationBlockAppointments
                }
              />
            </Stack>
          </SidebarContent>
          <SidebarActions>
            <MultiFormButtonBar
              submitLabel={props.submitLabel}
              submitting={isSubmitting}
              onCancel={props.onCancel}
            />
          </SidebarActions>
        </SidebarForm>
      )}
    </Formik>
  );
}
