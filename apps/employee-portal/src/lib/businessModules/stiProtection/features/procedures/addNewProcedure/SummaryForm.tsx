/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { EditOutlined } from "@mui/icons-material";
import { Divider, IconButton, Stack, Typography } from "@mui/joy";
import { useFormikContext } from "formik";
import { ReactNode, useId } from "react";
import { isString } from "remeda";

import { GENDER_VALUES, ifDefined, mapOptionalValue } from "@eshg/lib-portal";
import { ApiAppointmentType, ApiConcern } from "@eshg/sti-protection-api";

import { APPOINTMENT_TYPES } from "@/lib/businessModules/stiProtection/shared/constants";
import {
  concernToAppointmentType,
  getPropertyIf,
} from "@/lib/businessModules/stiProtection/shared/helpers";
import { sufficientText } from "@/lib/businessModules/stiProtection/shared/procedure/helpers";
import { getAppointmentDate } from "@/lib/businessModules/stiProtection/shared/procedure/mappers";

import { CombinedAppointmentForm } from "./AddNewProcedureSidebar";

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

interface SummaryFormProps extends AppointmentFieldSetProps {
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
    editAppointmentType ??
    getPropertyIf(values, "appointmentType", isString) ??
    ifDefined(concern, concernToAppointmentType);

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
        value={ifDefined(
          appointmentType,
          (t) => APPOINTMENT_TYPES[t as ApiAppointmentType],
        )}
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
            label="Biologisches Geschlecht"
            value={values.gender && GENDER_VALUES[values.gender]}
          />
          <LabelValuePair label="Pronomen" value={values.pronouns} />
          <LabelValuePair
            label="Ausreichende Deutschkenntnisse"
            value={sufficientText(values.hasSufficientGermanLanguageSkills)}
          />
          <LabelValuePair
            label="Weitere Sprachen"
            value={values.otherKnownLanguages}
          />
          <LabelValuePair
            label="Geburtsjahr"
            value={values.yearOfBirth?.toString()}
          />
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
