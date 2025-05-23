/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { RefObject } from "@fullcalendar/core/preact";
import { Sheet, Stack, Typography } from "@mui/joy";
import { useSuspenseQueries } from "@tanstack/react-query";
import { format } from "date-fns";
import { Formik, FormikErrors } from "formik";
import { useState } from "react";

import {
  MultiFormButtonBar,
  SidebarActions,
  SidebarContent,
  SidebarForm,
  SidebarFormHandle,
} from "@eshg/lib-employee-portal";
import { SelectField } from "@eshg/lib-portal";
import {
  ApiAppointmentBookingType,
  ApiAppointmentType,
} from "@eshg/travel-medicine-api";

import { theme } from "@/lib/baseModule/theme/theme";
import { useGetFreeAppointmentsQuery } from "@/lib/businessModules/travelMedicine/api/queries/appointmentBlocks";
import { AppointmentRadioGroup } from "@/lib/businessModules/travelMedicine/components/vaccinationConsultations/shared/AppointmentRadioGroup";
import { LegacyPerson } from "@/lib/shared/components/legacyPersonSidebar/form/LegacyPersonForm";

interface AppointmentFormProps {
  initialValues: InitialAppointmentFormValuesProps;
  onSubmit: (values: InitialAppointmentFormValuesProps) => Promise<unknown>;
  onCancel: () => void;
  sidebarFormRef?: RefObject<SidebarFormHandle>;
}

export interface InitialAppointmentFormValuesProps {
  selectedPerson?: LegacyPerson;
  initialStepAppointmentType: ApiAppointmentType;
  bookingType?: ApiAppointmentBookingType;
  appointmentBlockDate?: { start: Date; end: Date };
  userDefinedAppointmentDate?: string;
  appointmentTypeStandardDuration: number;
  isEditInitialAppointmentMode?: boolean;
}

export function InitialAppointmentForm({
  initialValues,
  onSubmit,
  onCancel,
  sidebarFormRef,
}: AppointmentFormProps) {
  const [type, setType] = useState<ApiAppointmentType>(
    initialValues.initialStepAppointmentType ?? ApiAppointmentType.Consultation,
  );

  const [
    { data: freeConsultationBlockAppointments },
    { data: freeVaccinationBlockAppointments },
  ] = useSuspenseQueries({
    queries: [
      useGetFreeAppointmentsQuery(ApiAppointmentType.Consultation),
      useGetFreeAppointmentsQuery(ApiAppointmentType.Vaccination),
    ],
  });

  function updateSelectOptions(type: string) {
    if (type == ApiAppointmentType.Consultation) {
      setType(ApiAppointmentType.Consultation);
    } else {
      setType(ApiAppointmentType.Vaccination);
    }
  }

  function validateForm(values: InitialAppointmentFormValuesProps) {
    const errors: FormikErrors<InitialAppointmentFormValuesProps> = {};

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
    }

    return errors;
  }

  return (
    <Formik
      initialValues={{
        ...initialValues,
        appointmentBlockDate: initialValues.appointmentBlockDate ?? undefined,
        userDefinedAppointmentDate:
          initialValues.userDefinedAppointmentDate ??
          format(new Date(), "yyyy-MM-dd'T'HH:mm"),
        isEditInitialAppointmentMode: false,
      }}
      enableReinitialize
      validate={validateForm}
      onSubmit={onSubmit}
    >
      {({ isSubmitting }) => (
        <SidebarForm ref={sidebarFormRef}>
          <SidebarContent title="Termin">
            <Stack gap={2} rowGap={2}>
              <Sheet>
                <SelectField
                  label="Terminart"
                  name="initialStepAppointmentType"
                  options={[
                    {
                      value: ApiAppointmentType.Consultation,
                      label: "Beratung",
                    },
                    { value: ApiAppointmentType.Vaccination, label: "Impfung" },
                  ]}
                  sx={{ flexGrow: 1 }}
                  onChange={(type) => updateSelectOptions(type)}
                />
              </Sheet>
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
                type={type}
                freeConsultationBlockAppointments={
                  freeConsultationBlockAppointments
                }
                freeVaccinationBlockAppointments={
                  freeVaccinationBlockAppointments
                }
              />
            </Stack>
          </SidebarContent>

          <SidebarActions>
            <MultiFormButtonBar
              submitLabel={
                initialValues.isEditInitialAppointmentMode
                  ? "Speichern"
                  : "Erstellen"
              }
              submitting={isSubmitting}
              onCancel={onCancel}
            />
          </SidebarActions>
        </SidebarForm>
      )}
    </Formik>
  );
}
