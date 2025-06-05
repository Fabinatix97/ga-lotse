/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Chip, Stack } from "@mui/joy";
import { parse } from "date-fns";
import { FormikErrors, useFormikContext } from "formik";
import { ReactNode } from "react";

import { ApiBusinessModule } from "@eshg/base-api";
import { FileField, validateURL } from "@eshg/lib-employee-portal";
import {
  DateField,
  InputField,
  SelectField,
  TextareaField,
  validateFileName,
} from "@eshg/lib-portal";

import { openDataFileTypes } from "@/lib/opendata/constants";
import { buildOptionsFromBusinessModules } from "@/lib/shared/components/procedures/helper";

interface OpenDataFormContentProps {
  children?: ReactNode;
  mode: "create" | "edit";
}

export interface OpenDataFormValues {
  resourceName: string;
  versionName: string;
  description: string;
  statisticStartDate: string;
  statisticEndDate: string;
  licence: string;
  sources: ApiBusinessModule[];
  file: File | null;
  fileName: string;
}

const fieldNames = {
  resourceName: "resourceName",
  versionName: "versionName",
  description: "description",
  statisticStartDate: "statisticStartDate",
  statisticEndDate: "statisticEndDate",
  licence: "licence",
  sources: "sources",
  file: "file",
  fileName: "fileName",
} satisfies Record<keyof OpenDataFormValues, string>;

export function OpenDataForm({ children, mode }: OpenDataFormContentProps) {
  const isCreateForm = mode === "create";
  const { initialValues } = useFormikContext<OpenDataFormValues>();

  return (
    <Stack spacing={2}>
      <InputField
        name={fieldNames.versionName}
        label="Name"
        required="Bitte einen Namen angeben."
      />
      <TextareaField name={fieldNames.description} label="Beschreibung" />
      <Stack direction="row" justifyContent="space-between" gap={3}>
        <DateField
          name={fieldNames.statisticStartDate}
          label="Startdatum"
          sx={{ flex: "1 1 0" }}
        />
        <DateField
          name={fieldNames.statisticEndDate}
          label="Enddatum"
          sx={{ flex: "1 1 0" }}
        />
      </Stack>
      <InputField
        name={fieldNames.licence}
        label="Lizenz URL"
        required="Bitte eine Lizenz URL angeben."
        validate={validateURL}
      />
      <SelectField
        multiple
        name={fieldNames.sources}
        label="Fachmodule"
        options={buildBusinessModuleOptions()}
        renderValue={(modules) => (
          <Stack direction="row" spacing={0.5} flexWrap="wrap">
            {modules.map(({ label, value }) => (
              <Chip key={value} color="primary">
                {label}
              </Chip>
            ))}
          </Stack>
        )}
      />
      {isCreateForm ? (
        <FileField
          name={fieldNames.file}
          label="Datei hochladen"
          accept={openDataFileTypes}
          required="Bitte eine Datei auswählen."
        />
      ) : (
        <InputField
          name={fieldNames.fileName}
          label="Dateiname"
          required="Bitte einen Dateinamen angeben."
          validate={validateFileName(initialValues.fileName)}
        />
      )}
      {children}
    </Stack>
  );
}

export function validateOpenDataForm(
  values: OpenDataFormValues,
): FormikErrors<OpenDataFormValues> | void {
  const { statisticStartDate, statisticEndDate } = values;
  if (statisticStartDate === "" && statisticEndDate === "") {
    return undefined;
  }

  if (statisticStartDate === "" || statisticEndDate === "") {
    return {
      statisticStartDate:
        "Bitte geben Sie sowohl ein Startdatum als auch ein Enddatum an.",
      statisticEndDate: "",
    };
  }

  const startDate = parse(statisticStartDate, "yyyy-MM-dd", new Date());
  const endDate = parse(statisticEndDate, "yyyy-MM-dd", new Date());

  if (endDate < startDate) {
    return {
      statisticEndDate: "Das Enddatum darf nicht vor dem Startdatum liegen.",
      statisticStartDate: "",
    };
  }

  return undefined;
}

function buildBusinessModuleOptions() {
  return buildOptionsFromBusinessModules(Object.values(ApiBusinessModule));
}
