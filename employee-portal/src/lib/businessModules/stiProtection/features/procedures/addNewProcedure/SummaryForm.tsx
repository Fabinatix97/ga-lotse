/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  ApiAppointmentType,
  ApiConcern,
} from "@eshg/employee-portal-api/stiProtection";
import { GENDER_VALUES } from "@eshg/lib-portal/components/formFields/constants";
import { translateCountry } from "@eshg/lib-portal/helpers/countryOption";
import { mapOptionalValue } from "@eshg/lib-portal/helpers/form";
import { ifDefined } from "@eshg/lib-portal/helpers/ifDefined";
import { EditOutlined } from "@mui/icons-material";
import { Divider, IconButton, Stack, Typography } from "@mui/joy";
import { useFormikContext } from "formik";
import { ReactNode, useId } from "react";

import { APPOINTMENT_TYPES } from "@/lib/businessModules/stiProtection/shared/constants";
import { concernToAppointmentType } from "@/lib/businessModules/stiProtection/shared/helpers";

import { getAppointmentDate } from "./AddNewProcedureSidebar";
import { CombinedAppointmentForm } from "./AppointmentForm";

const germanDateFormatter = Intl.DateTimeFormat("de-DE", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
});
const germanTimeFormatter = Intl.DateTimeFormat("de-DE", {
  timeStyle: "short",
});

export interface AppointmentFieldSetProps {
  jumpToAppointmentSelection: () => void;
  jumpToPersonalData?: () => void;
  startingConcern?: ApiConcern;
  editAppointmentType?: ApiAppointmentType;
}

export interface SummaryFormProps extends AppointmentFieldSetProps {
  appointmentSummary?: {
    title: string;
  };
  show?: {
    appointment?: boolean;
    personalData?: boolean;
  };
}

function formatAppointmentDate(form: CombinedAppointmentForm) {
  const date = getAppointmentDate(form);
  if (!date) {
    return;
  }
  return `${germanDateFormatter.format(date)}, ${germanTimeFormatter.format(date)} Uhr`;
}

export function SummaryForm({
  jumpToPersonalData,
  jumpToAppointmentSelection,
  appointmentSummary = {
    title: "Termin",
  },
  startingConcern,
  editAppointmentType,
  show = {
    personalData: true,
  },
}: SummaryFormProps) {
  const { values } = useFormikContext<CombinedAppointmentForm>();
  const dateAndTime = formatAppointmentDate(values);
  const concern = mapOptionalValue(values.concern) ?? startingConcern;
  const appointmentType =
    editAppointmentType ?? ifDefined(concern, concernToAppointmentType);

  return (
    <Stack gap={2}>
      <ActionTitle
        action={{
          onClick: jumpToAppointmentSelection,
          icon: <EditOutlined />,
          label: "Termin ändern",
        }}
        title={appointmentSummary.title}
      />
      <LabelValuePair
        label="Terminart"
        value={ifDefined(appointmentType, (t) => APPOINTMENT_TYPES[t])}
      />
      <LabelValuePair label="Datum und Zeit" value={dateAndTime} />

      {show.personalData && "gender" in values && (
        <>
          <Divider orientation="horizontal" />

          <ActionTitle
            action={{
              onClick: () => {
                if (jumpToPersonalData) jumpToPersonalData();
              },
              icon: <EditOutlined />,
              label: "Bearbeiten",
            }}
            title="Persönliche Daten"
          />
          <LabelValuePair
            label="Geschlecht"
            value={values.gender && GENDER_VALUES[values.gender]}
          />
          <LabelValuePair
            label="Geburtsland"
            value={
              values.countryOfBirth && translateCountry(values.countryOfBirth)
            }
          />
          <LabelValuePair
            label="In Deutschland seit"
            value={values.inGermanySince}
          />
          <LabelValuePair label="Geburtsjahr" value={values.yearOfBirth} />
        </>
      )}
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
    <Stack direction="row" justifyContent="space-between">
      <Typography component="h4" level="body-md" id={labelId}>
        {label}
      </Typography>
      <Typography level="title-md" aria-describedby={labelId}>
        {value}
      </Typography>
    </Stack>
  );
}

function ActionTitle({
  action,
  title,
}: {
  action: {
    onClick: () => void;
    icon: ReactNode;
    label: string;
  };
  title: string;
}) {
  return (
    <Stack direction="row" justifyContent="space-between" mt={2}>
      <Typography component="h3" level="title-lg" alignSelf="center">
        {title}
      </Typography>
      <IconButton
        aria-label={action.label}
        variant="outlined"
        color="primary"
        onClick={action.onClick}
      >
        {action.icon}
      </IconButton>
    </Stack>
  );
}
