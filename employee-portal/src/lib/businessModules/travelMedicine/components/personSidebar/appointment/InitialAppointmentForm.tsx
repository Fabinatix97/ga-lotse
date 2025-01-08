/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  ApiAppointmentBookingType,
  ApiAppointmentType,
} from "@eshg/employee-portal-api/travelMedicine";
import { SelectField } from "@eshg/lib-portal/components/formFields/SelectField";
import { SelectOption } from "@eshg/lib-portal/components/formFields/SelectOptions";
import { RefObject } from "@fullcalendar/core/preact.js";
import { Sheet, Stack } from "@mui/joy";
import { format } from "date-fns";
import { Formik, FormikErrors } from "formik";
import { useState } from "react";

import { LegacyAppointmentRadioGroup } from "@/lib/businessModules/travelMedicine/components/vaccinationConsultations/shared/LegacyAppointmentRadioGroup";
import { MultiFormButtonBar } from "@/lib/shared/components/form/MultiFormButtonBar";
import {
  SidebarForm,
  SidebarFormHandle,
} from "@/lib/shared/components/form/SidebarForm";
import { LegacyPerson } from "@/lib/shared/components/legacyPersonSidebar/form/LegacyPersonForm";
import { SidebarActions } from "@/lib/shared/components/sidebar/SidebarActions";
import { SidebarContent } from "@/lib/shared/components/sidebar/SidebarContent";

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
  appointmentBlockDateOption?: SelectOption;
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
      onSubmit={onSubmit}
      enableReinitialize
      validate={validateForm}
    >
      {({ isSubmitting }) => (
        <SidebarForm ref={sidebarFormRef}>
          <SidebarContent title={"Termin"}>
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
                  onChange={(type) => updateSelectOptions(type)}
                  sx={{ flexGrow: 1 }}
                />
              </Sheet>
              <LegacyAppointmentRadioGroup
                type={type}
                appointmentBlockDateOption={
                  initialValues.appointmentBlockDateOption
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
