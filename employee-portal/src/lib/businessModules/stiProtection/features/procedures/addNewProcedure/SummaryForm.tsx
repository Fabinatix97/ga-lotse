/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  ApiConcern,
  ApiStiProtectionProcedure,
} from "@eshg/employee-portal-api/stiProtection";
import { EditOutlined } from "@mui/icons-material";
import { Divider, IconButton, Stack, Typography } from "@mui/joy";
import { useFormikContext } from "formik";
import { ReactNode, useId, useMemo } from "react";

import { CreateAppointmentForm } from "@/lib/businessModules/stiProtection/features/procedures/details/CreateAppointmentSidebar";
import {
  APPOINTMENT_TYPES,
  CONCERN_VALUES,
} from "@/lib/businessModules/stiProtection/shared/constants";
import { COUNTRY_CODE_LABELS } from "@/lib/businessModules/stiProtection/shared/countryCodes";
import { getOpenAppointmentsFromProcedure } from "@/lib/businessModules/stiProtection/shared/helpers";
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
  jumpToPersonalData?: () => void;
  appointmentSummary?: {
    title: string;
  };
  mode?: "addNewProcedure" | "createAppointment" | "editAppointment";
  procedure?: ApiStiProtectionProcedure;
  show?: {
    appointment?: boolean;
    personalData?: boolean;
  };
}

function formatAppointmentDate(
  form: AddNewProcedureForm | CreateAppointmentForm,
) {
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
  mode = "addNewProcedure",
  procedure,
  show = {
    personalData: true,
  },
}: SummaryFormProps) {
  const { values } = useFormikContext<
    AddNewProcedureForm | CreateAppointmentForm
  >();
  const dateAndTime = formatAppointmentDate(values);
  const appointmentTypeValue = useMemo(() => {
    let appointmentType = "";

    if (procedure && mode !== "addNewProcedure") {
      if (values.appointmentType && mode === "createAppointment") {
        appointmentType = APPOINTMENT_TYPES[values.appointmentType];
      } else {
        const [openAppointment] = getOpenAppointmentsFromProcedure(procedure);

        if (openAppointment) {
          appointmentType = APPOINTMENT_TYPES[openAppointment?.appointmentType];
        }
      }
    } else if (values.concern) {
      appointmentType = CONCERN_VALUES[values.concern as ApiConcern];
    }
    return appointmentType;
  }, [mode, procedure, values.appointmentType, values.concern]);

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
      <LabelValuePair label="Terminart" value={appointmentTypeValue} />
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
              values.countryOfBirth &&
              COUNTRY_CODE_LABELS[values.countryOfBirth]
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
