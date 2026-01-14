/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { EditOutlined } from "@mui/icons-material";
import { Divider, IconButton, Stack, Typography } from "@mui/joy";
import { useFormikContext } from "formik";
import { ReactNode } from "react";

import {
  DetailsItem,
  MultiFormButtonBar,
  SidebarActions,
  SidebarContent,
  SidebarForm,
} from "@eshg/lib-employee-portal";
import { DetailsList } from "@eshg/lib-portal";
import { ApiPersonLanguage } from "@eshg/prostitute-protection-api";

import {
  CONSULTATION_TYPE_VALUES,
  LANGUAGE_VALUE,
} from "../../../shared/constants";
import { getAppointmentDate } from "../../../shared/helpers";

import {
  AddNewProcedureForm,
  FieldProps,
  LayoutProps,
} from "./useAddNewProcedureSidebar";

const germanDateFormatter = Intl.DateTimeFormat("de-DE", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
});

const germanTimeFormatter = Intl.DateTimeFormat("de-DE", {
  timeStyle: "short",
});

function formatAppointmentDate(form: AddNewProcedureForm) {
  const date = getAppointmentDate(form);
  if (!date) {
    return;
  }
  return `${germanDateFormatter.format(date)}, ${germanTimeFormatter.format(date)} Uhr`;
}

export function SummaryFormStep(props: FieldProps) {
  return (
    <Layout {...props}>
      <SummaryForm {...props} />
    </Layout>
  );
}

function SummaryForm({
  jumpToAppointmentSelection,
  jumpToPersonalData,
}: FieldProps) {
  const { values } = useFormikContext<AddNewProcedureForm>();
  const dateAndTime = formatAppointmentDate(values);
  const filteredLanguages = [...values.languages].filter(
    (lang) => lang !== ApiPersonLanguage.German,
  );
  const hasSufficientLanguageSkills = values.languages.includes(
    ApiPersonLanguage.German,
  );
  const languagesMap = filteredLanguages
    .map((language) => LANGUAGE_VALUE[language])
    .join(", ");

  return (
    <Stack gap={2} mt={2}>
      <Stack gap={2}>
        <ActionTitle
          action={{
            onClick: jumpToAppointmentSelection,
            icon: <EditOutlined />,
            label: "Termin ändern",
          }}
          title="Termin"
        />
      </Stack>
      <DetailsList>
        <DetailsItem
          label="Terminart"
          value={
            values.consultationType
              ? `ProstSchG ${CONSULTATION_TYPE_VALUES[values.consultationType]}`
              : "-"
          }
        />
        <DetailsItem
          label="Datum und Zeit"
          value={`${dateAndTime}, ${values.duration} Min.`}
        />
      </DetailsList>

      <Divider orientation="horizontal" />

      <ActionTitle
        action={{
          onClick: jumpToPersonalData,
          icon: <EditOutlined />,
          label: "Person bearbeiten",
        }}
        title="Persönliche Daten"
      />
      <DetailsList>
        <DetailsItem
          label="Deutschkenntnisse"
          value={
            hasSufficientLanguageSkills ? "Ausreichend" : "Nicht ausreichend"
          }
        />
        <DetailsItem
          label="Weitere Sprachen"
          value={values.languages.length ? languagesMap : "-"}
        />
      </DetailsList>
    </Stack>
  );
}

function Layout<T>({
  children,
  handlePrev,
  isOnLastStep,
  isOnFirstStep,
  onClose,
  formRef,
  title,
  subTitle,
}: LayoutProps<T>) {
  const { isSubmitting } = useFormikContext<AddNewProcedureForm>();
  return (
    <SidebarForm ref={formRef}>
      <SidebarContent title={title} subtitle={subTitle}>
        {children}
      </SidebarContent>
      <SidebarActions>
        <MultiFormButtonBar
          submitting={isSubmitting}
          submitLabel={isOnLastStep ? "Erstellen" : "Weiter"}
          onCancel={() => onClose(true)}
          onBack={isOnFirstStep ? undefined : handlePrev}
        />
      </SidebarActions>
    </SidebarForm>
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
      <Typography component="h2" level="title-lg" alignSelf="center">
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
