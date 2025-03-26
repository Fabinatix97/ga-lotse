/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { FormButtonBar } from "@eshg/lib-employee-portal";
import { FormPlus } from "@eshg/lib-portal/components/form/FormPlus";
import { Stack } from "@mui/joy";
import { Formik, useFormikContext } from "formik";
import { ReactNode } from "react";

import { CheckboxField } from "@/lib/shared/components/formFields/CheckboxField";
import { DateOrDateTimeField } from "@/lib/shared/components/formFields/DateOrDateTimeField";
import {
  handleWholeDayChange,
  validateEndAfterStart,
} from "@/lib/shared/components/formFields/dateOrDateTimeFieldHelper";

export interface EventFormValues {
  start: string;
  end: string;
  wholeDay: boolean;
}

const emptyValues: EventFormValues = {
  start: "",
  end: "",
  wholeDay: true,
};

export function EventFormInputs({ hideWholeDay }: { hideWholeDay?: boolean }) {
  const { values, setFieldValue } = useFormikContext<EventFormValues>();
  return (
    <Stack flexDirection="column" gap={2}>
      <DateOrDateTimeField
        wholeDay={values.wholeDay}
        name="start"
        label="Start"
        required="Bitte ein Startdatum auswählen"
      />
      <DateOrDateTimeField
        wholeDay={values.wholeDay}
        name="end"
        label="Ende"
        required="Bitte ein Enddatum auswählen"
      />
      {!hideWholeDay && (
        <CheckboxField
          name="wholeDay"
          label="Ganztägig"
          onChange={handleWholeDayChange(setFieldValue, values)}
        />
      )}
    </Stack>
  );
}

export function EventFormActions({ onCancel }: { onCancel: () => void }) {
  const { isSubmitting } = useFormikContext<EventFormValues>();
  return (
    <FormButtonBar
      submitLabel="Speichern"
      submitting={isSubmitting}
      onCancel={onCancel}
    />
  );
}

export function EventForm({
  initialValues = emptyValues,
  onSubmit,
  children,
}: {
  initialValues?: EventFormValues;
  onSubmit: (values: EventFormValues) => void;
  children: ReactNode;
}) {
  return (
    <Formik
      initialValues={initialValues}
      onSubmit={onSubmit}
      validate={validateEndAfterStart}
    >
      <FormPlus sx={{ display: "contents" }}>{children}</FormPlus>
    </Formik>
  );
}
