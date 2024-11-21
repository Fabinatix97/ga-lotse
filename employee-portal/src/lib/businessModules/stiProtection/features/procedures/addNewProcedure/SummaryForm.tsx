/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { CalendarTodayOutlined, EditOutlined } from "@mui/icons-material";
import { Button, Stack, Typography } from "@mui/joy";
import { useFormikContext } from "formik";
import { useId } from "react";

import { CONCERN_VALUES } from "@/lib/businessModules/stiProtection/shared/constants";
import { COUNTRY_CODE_LABELS } from "@/lib/businessModules/stiProtection/shared/countryCodes";
import { GENDER_VALUES } from "@/lib/shared/components/personSidebar/constants";

import {
  AddNewProcedureForm,
  getAppointmentDate,
} from "./AddNewProcedureSidebar";

const germanDateFormatter = Intl.DateTimeFormat("de-DE", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
});
const germanTimeFormatter = Intl.DateTimeFormat("de-DE", {
  timeStyle: "short",
});
export interface SummaryFormProps {
  jumpToAppointmentSelection: () => void;
  jumpToPersonalData: () => void;
}

function formatAppointmentDate(form: AddNewProcedureForm) {
  const date = getAppointmentDate(form);
  if (!date) {
    return;
  }
  return `${germanDateFormatter.format(date)}, ${germanTimeFormatter.format(date)} Uhr`;
}

export function SummaryForm({
  jumpToPersonalData,
  jumpToAppointmentSelection,
}: SummaryFormProps) {
  const { values } = useFormikContext<AddNewProcedureForm>();
  const dateAndTime = formatAppointmentDate(values);

  return (
    <Stack gap={2}>
      <LabelValuePair
        label="Art des Termins"
        value={values.concern && CONCERN_VALUES[values.concern]}
      />
      <LabelValuePair label="Datum und Zeit" value={dateAndTime} />
      <div>
        <Button
          startDecorator={<CalendarTodayOutlined />}
          variant="plain"
          onClick={jumpToAppointmentSelection}
        >
          Termin ändern
        </Button>
      </div>

      <Typography component="h3" level="title-md" mt={4}>
        Persönliche Daten
      </Typography>
      <LabelValuePair
        label="Geschlecht"
        value={values.gender && GENDER_VALUES[values.gender]}
      />
      <LabelValuePair
        label="Geburtsland"
        value={
          values.countryOfBirth && COUNTRY_CODE_LABELS[values.countryOfBirth]
        }
      />
      <LabelValuePair
        label="In Deutschland seit"
        value={values.inGermanySince}
      />
      <LabelValuePair label="Geburtsjahr" value={values.yearOfBirth} />
      <div>
        <Button
          startDecorator={<EditOutlined />}
          variant="plain"
          onClick={jumpToPersonalData}
        >
          Bearbeiten
        </Button>
      </div>
    </Stack>
  );
}

function LabelValuePair({
  label,
  value,
}: {
  label: string;
  value: string | undefined | null;
}) {
  const labelId = useId();
  return (
    <div>
      <Typography component="h4" level="title-sm" id={labelId}>
        {label}
      </Typography>
      <Typography level="body-lg" aria-describedby={labelId}>
        {value}
      </Typography>
    </div>
  );
}
