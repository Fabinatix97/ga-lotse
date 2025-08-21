/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Stack, Typography } from "@mui/joy";
import { format, isAfter } from "date-fns";
import { Formik, FormikErrors } from "formik";
import { Ref } from "react";
import { isEmpty } from "remeda";

import {
  MultiFormButtonBar,
  SidebarActions,
  SidebarContent,
  SidebarForm,
  SidebarFormHandle,
} from "@eshg/lib-employee-portal";
import { DateField } from "@eshg/lib-portal";
import {
  ApiAppointmentBookingType,
  ApiAppointmentType,
  ApiAssignableService,
} from "@eshg/travel-medicine-api";

import { theme } from "@/lib/baseModule/theme/theme";
import { Appointment } from "@/lib/businessModules/travelMedicine/api/models/Appointment";
import { AppointmentRadioGroup } from "@/lib/businessModules/travelMedicine/components/vaccinationConsultations/shared/AppointmentRadioGroup";
import {
  CheckboxGroup,
  Mode as CheckboxGroupMode,
} from "@/lib/businessModules/travelMedicine/components/vaccinationConsultations/shared/CheckboxGroup";

export interface AddServiceAppointmentFormValues {
  procedureId: string;
  serviceChecks?: ApiAssignableService[];
  bookingType?: ApiAppointmentBookingType;
  blockAppointment?: { start: Date; end: Date };
  userDefinedAppointmentDate?: string;
  appointmentTypeStandardDuration: number;
  appointmentType?: ApiAppointmentType;
  earliestDate?: string | Date;
}

interface AddServiceAppointmentFormProps {
  initialValues: AddServiceAppointmentFormValues;
  allAssignableServices: ApiAssignableService[];
  isCitizenFollowUp: boolean;
  freeConsultationBlockAppointments: Appointment[];
  freeVaccinationBlockAppointments: Appointment[];
  formRef: Ref<SidebarFormHandle>;
  onCancel: () => void;
  onSubmit: (values: AddServiceAppointmentFormValues) => Promise<void>;
  title: string;
  submitLabel: string;
}

export function AddServiceAppointmentForm(
  props: Readonly<AddServiceAppointmentFormProps>,
) {
  function validateForm(values: AddServiceAppointmentFormValues) {
    const errors: FormikErrors<AddServiceAppointmentFormValues> = {};
    if (
      values.bookingType === ApiAppointmentBookingType.AppointmentBlock &&
      values.blockAppointment?.start === undefined
    ) {
      errors.blockAppointment = "Bitte einen Termin auswählen";
    } else if (values.bookingType === ApiAppointmentBookingType.UserDefined) {
      if (values.userDefinedAppointmentDate === "") {
        errors.userDefinedAppointmentDate =
          "Bitte ein Datum und eine Uhrzeit auswählen";
      }
      if (values.appointmentTypeStandardDuration < 1) {
        errors.appointmentTypeStandardDuration =
          "Bitte eine positive Zahl eingeben";
      }
    } else if (!props.isCitizenFollowUp && isEmpty(values.bookingType)) {
      errors.bookingType = "Bitte einen Termintyp auswählen";
    }
    return errors;
  }

  function handleServiceChecksChange(
    values: ApiAssignableService[],
    setFieldValue: (
      field: string,
      value: string,
    ) => Promise<void | FormikErrors<AddServiceAppointmentFormValues>>,
    setFieldTouched: (
      field: string,
      isTouched: boolean,
      shouldValidate: boolean,
    ) => Promise<void | FormikErrors<AddServiceAppointmentFormValues>>,
  ) {
    let earliestDate = new Date();
    void setFieldValue(
      "userDefinedAppointmentDate",
      format(earliestDate, "yyyy-MM-dd'T'HH:mm"),
    );
    void setFieldTouched("userDefinedAppointmentDate", false, true);
    if (props.isCitizenFollowUp) {
      void setFieldValue("earliestDate", format(earliestDate, "yyyy-MM-dd"));
      void setFieldTouched("earliestDate", false, true);
    }
    values.forEach((value) => {
      if (
        value.appointmentSuggestion !== undefined &&
        isAfter(value.appointmentSuggestion, earliestDate)
      ) {
        earliestDate = value.appointmentSuggestion;
        earliestDate.setUTCHours(9);
        void setFieldValue(
          "userDefinedAppointmentDate",
          earliestDate.toISOString().slice(0, 16),
        );
        if (props.isCitizenFollowUp) {
          void setFieldValue(
            "earliestDate",
            earliestDate.toISOString().slice(0, 10),
          );
        }
      }
    });
  }

  return (
    <Formik
      initialValues={props.initialValues}
      enableReinitialize
      validate={validateForm}
      onSubmit={props.onSubmit}
    >
      {({ isSubmitting, setFieldValue, setFieldTouched }) => (
        <SidebarForm ref={props.formRef}>
          <SidebarContent title={props.title}>
            <Stack spacing={2}>
              <Stack gap={2}>
                <CheckboxGroup
                  mode={CheckboxGroupMode.assignableService}
                  name="serviceChecks"
                  element={props.allAssignableServices}
                  label="Impfung"
                  onChange={(services) =>
                    handleServiceChecksChange(
                      services,
                      setFieldValue,
                      setFieldTouched,
                    )
                  }
                />
              </Stack>
              <AppointmentRadioGroup
                label={
                  <Typography
                    level="body-md"
                    sx={{ fontWeight: theme.fontWeight.lg }}
                  >
                    Termin
                  </Typography>
                }
                name="bookingType"
                type={props.initialValues.appointmentType}
                isCitizenFollowUp={props.isCitizenFollowUp}
                freeConsultationBlockAppointments={
                  props.freeConsultationBlockAppointments
                }
                freeVaccinationBlockAppointments={
                  props.freeVaccinationBlockAppointments
                }
              />
              {props.isCitizenFollowUp && (
                <Stack>
                  <Typography
                    level="body-md"
                    sx={{ fontWeight: "bold", mt: 2 }}
                  >
                    Selbstbucher über Bürgerportal
                  </Typography>
                  <DateField
                    name="earliestDate"
                    label="Buchbar ab"
                    required="Bitte ein Datum für die früheste Buchbarkeit eingeben"
                  />
                </Stack>
              )}
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
