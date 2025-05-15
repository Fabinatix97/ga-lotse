/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Delete, Download } from "@mui/icons-material";
import { Radio, Stack } from "@mui/joy";
import { FormikValues } from "formik";
import { isDefined } from "remeda";

import {
  FileCard,
  FileCardProps,
  FileField,
  useConfirmationDialog,
} from "@eshg/lib-employee-portal";
import { Alert, AlertProps } from "@eshg/lib-portal/components/Alert";
import { CheckboxField } from "@eshg/lib-portal/components/formFields/CheckboxField";
import { InputField } from "@eshg/lib-portal/components/formFields/InputField";
import { NumberField } from "@eshg/lib-portal/components/formFields/NumberField";
import { RadioGroupField } from "@eshg/lib-portal/components/formFields/RadioGroupField";
import { Validator } from "@eshg/lib-portal/types/form";

import { OpeningHoursField } from "@/lib/configurator/components/shared/OpeningHoursField";
import { InfoIconTooltipButton } from "@/lib/shared/components/buttons/IconTooltipButton";

interface Width {
  width: string;
  minWidth?: string;
  maxWidth?: string;
}

function widthSx(width?: Width) {
  if (!width) {
    return {
      flex: 1,
    };
  }
  return {
    width: width.width,
    minWidth: width.minWidth,
    maxWidth: width.maxWidth,
    flexShrink: "unset",
    flexGrow: "unset",
  };
}

export type FormFields =
  | TextFormField
  | NumberFormField
  | UploadFormField
  | CheckboxFormField
  | RadioFormField
  | OpeningHoursFormField;

interface BaseFormField {
  name: string;
  label: string;
  required?: string;
}

interface TextFormField extends BaseFormField {
  type: "text";
  placeholder?: string;
  readonly?: boolean;
  width?: Width;
  maxLength?: number;
  validate?: Validator<string>;
}

interface NumberFormField extends BaseFormField {
  type: "number";
  readonly?: boolean;
  width?: Width;
  min?: number;
  max?: number;
  placeholder?: string;
}

interface UploadFormField extends BaseFormField {
  type: "upload";
  width?: Width;
}

interface CheckboxFormField extends BaseFormField {
  type: "checkbox";
  readonly?: boolean;
}

interface RadioFormField extends BaseFormField {
  type: "radio";
  readonly?: boolean;
  alert?: Pick<AlertProps, "title" | "message" | "color">;
  options: {
    label: string;
    infoLabel?: string;
    value: string;
  }[];
}

interface OpeningHoursFormField {
  type: "openinghours";
  english?: boolean;
  name: string;
}

export type FileUploadValue = Pick<
  FileCardProps,
  "name" | "size" | "type" | "creationDate"
>;

export function RenderField({
  field,
  values,
  deleteFile,
  downloadFile,
}: {
  field: FormFields;
  values: FormikValues;
  deleteFile: (fileName: string) => void;
  downloadFile: (fileName: string) => void;
}) {
  const { openCancelDialog } = useConfirmationDialog();
  switch (field.type) {
    case "text":
      return (
        <InputField
          sx={widthSx(field.width)}
          type="text"
          name={field.name}
          label={field.label}
          placeholder={field.placeholder}
          readOnly={field.readonly}
          required={field.required}
          maxLength={field.maxLength}
          validate={field.validate}
        />
      );
    case "number":
      return (
        <NumberField
          fieldSx={widthSx(field.width)}
          name={field.name}
          label={field.label}
          readOnly={field.readonly}
          required={field.required}
          min={field.min}
          max={field.max}
          placeholder={field.placeholder}
        />
      );
    case "upload":
      const uploadValue = values[field.name] as FileUploadValue;
      const isCard =
        typeof uploadValue === "object" && !!uploadValue?.creationDate;
      return (
        <>
          {!isCard && (
            <FileField
              sx={widthSx(field.width)}
              label={field.label}
              name={field.name}
              required={field.required}
            />
          )}
          {isCard && (
            <FileCard
              sx={widthSx(field.width)}
              name={uploadValue.name}
              type={uploadValue.type}
              creationDate={uploadValue.creationDate}
              size={uploadValue.size}
              actionMenuButtonColor="primary"
              actions={[
                {
                  name: "Download",
                  onClick: () => downloadFile(uploadValue.name),
                  indicator: <Download />,
                },
                {
                  name: "Löschen",
                  color: "danger",
                  onClick: () =>
                    openCancelDialog({
                      color: "danger",
                      title: "Datei löschen?",
                      description: "Möchten Sie die Datei wirklich löschen?",
                      cancelLabel: "Abbrechen",
                      confirmLabel: "Löschen",
                      onConfirm: () => deleteFile(uploadValue.name),
                    }),
                  indicator: <Delete />,
                },
              ]}
            />
          )}
        </>
      );
    case "checkbox":
      return (
        <CheckboxField
          name={field.name}
          label={field.label}
          readonly={field.readonly}
          disabled={field.readonly}
          required={field.required}
        />
      );
    case "radio":
      return (
        <RadioGroupField
          label={field.label}
          name={field.name}
          required={field.required}
          sx={{ flex: 1 }}
        >
          <Stack gap={2}>
            {isDefined(field.alert) && (
              <Alert variant="soft" {...field.alert} />
            )}
            {field.options.map((option) => (
              <Stack key={option.value} direction="row" gap={1}>
                <Radio
                  value={option.value}
                  label={option.label}
                  readOnly={field.readonly}
                  disabled={field.readonly}
                />
                {option.infoLabel && (
                  <InfoIconTooltipButton
                    infoText={option.infoLabel}
                    title="Hinweis"
                    iconSize="sm"
                    tooltipSx={{ "--IconButton-size": "auto" }}
                  />
                )}
              </Stack>
            ))}
          </Stack>
        </RadioGroupField>
      );
    case "openinghours":
      return <OpeningHoursField name={field.name} english={field.english} />;
  }
}
