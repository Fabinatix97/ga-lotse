/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Divider, Stack } from "@mui/joy";
import { useFormikContext } from "formik";
import { ReactNode } from "react";

import {
  CustomAppointmentQuickButtons,
  DateTimeField,
  MultiFormButtonBar,
  RadioSheetOption,
  RadioSheets,
  SidebarActions,
  SidebarContent,
  SidebarForm,
} from "@eshg/lib-employee-portal";
import {
  NumberField,
  SelectField,
  buildEnumOptions,
  validateIntegerAnd,
  validateRange,
} from "@eshg/lib-portal";
import { ApiAppointmentBookingType } from "@eshg/prostitute-protection-api";

import {
  APPOINTMENT_FORM_LABELS,
  CONSULTATION_TYPE_VALUES,
} from "../../../shared/constants";
import { validateDateTimeIsTodayOrFuture } from "../../../shared/helpers";

import { ConnectedAppointmentPicker } from "./ConnectedAppointmentPicker";
import { FieldProps } from "./useAddNewProcedureSidebar";

export function AppointmentStep(props: FieldProps) {
  return (
    <Layout {...props}>
      <Fields />
    </Layout>
  );
}

function Fields() {
  return (
    <Stack gap={2} mt={2}>
      <SelectField
        name="consultationType"
        label="Beratungstyp"
        options={buildEnumOptions(CONSULTATION_TYPE_VALUES)}
      />
      <Divider sx={{ marginBlock: 1 }} />
      <RadioSheets
        name="appointmentBookingType"
        required="Bitte eine Buchungsart auswählen"
      >
        <RadioSheetOption
          name="appointmentBookingType"
          value={ApiAppointmentBookingType.AppointmentBlock}
          label="Aus Terminblock"
        >
          <ConnectedAppointmentPicker name="blockAppointment" />
        </RadioSheetOption>
        <RadioSheetOption
          label="Individueller Termin"
          name="appointmentBookingType"
          value={ApiAppointmentBookingType.UserDefined}
        >
          <Stack gap={1} mt={2}>
            <DateTimeField
              name="customAppointmentDate"
              label={APPOINTMENT_FORM_LABELS.appointmentStart}
              required="Datum und Zeit sind erforderlich"
              validate={validateDateTimeIsTodayOrFuture}
            />
            <CustomAppointmentQuickButtons />
            <NumberField
              name="duration"
              label={APPOINTMENT_FORM_LABELS.appointmentDuration}
              required="Die Besuchsdauer ist erforderlich."
              validate={validateIntegerAnd(validateRange(1, 1440))}
            />
          </Stack>
        </RadioSheetOption>
      </RadioSheets>
    </Stack>
  );
}

interface LayoutProps<T> {
  children: ReactNode;
  handleNext: (newValues: T) => Promise<unknown> | void;
  handlePrev: () => void;
  isOnLastStep: boolean;
  isOnFirstStep: boolean;
  onClose: () => void;
  title: string;
  subTitle?: string;
}
function Layout<T>({
  children,
  handlePrev,
  isOnLastStep,
  isOnFirstStep,
  onClose,
  title,
  subTitle,
}: LayoutProps<T>) {
  const { isSubmitting } = useFormikContext();
  return (
    <SidebarForm>
      <SidebarContent title={title} subtitle={subTitle}>
        {children}
      </SidebarContent>
      <SidebarActions>
        <MultiFormButtonBar
          submitting={isSubmitting}
          submitLabel={isOnLastStep ? "Erstellen" : "Weiter"}
          onCancel={onClose}
          onBack={isOnFirstStep ? undefined : handlePrev}
        />
      </SidebarActions>
    </SidebarForm>
  );
}
