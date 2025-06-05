/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Delete, Download } from "@mui/icons-material";
import { IconButton, Radio, Stack } from "@mui/joy";
import { FormikValues, useField } from "formik";
import { isDefined } from "remeda";

import {
  FileCard,
  FileCardProps,
  FileField,
  useConfirmationDialog,
} from "@eshg/lib-employee-portal";
import {
  Alert,
  AlertProps,
  CheckboxField,
  FileType,
  InputField,
  NumberField,
  RadioGroupField,
  Validator,
} from "@eshg/lib-portal";

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
  downloadFile: () => Promise<void> | void;
  type: "upload";
  accept?: FileType | FileType[];
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

export type FileUploadValue = Pick<FileCardProps, "name" | "size" | "type">;
export type ConfigFile = File | null | FileUploadValue;

export function RenderField({
  field,
  values,
}: {
  field: FormFields;
  values: FormikValues;
}) {
  const { openCancelDialog } = useConfirmationDialog();
  const fieldHelper = useField(field.name)[2];
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
      const uploadValue = values[field.name] as ConfigFile;
      const isFileUpload = !uploadValue || uploadValue instanceof File;
      const showDeleteButton = !isDefined(field.required) && uploadValue;
      const isCard = !isFileUpload && uploadValue?.name;
      return (
        <>
          {isFileUpload && (
            <Stack
              direction="row"
              gap={1}
              alignItems="flex-start"
              sx={widthSx(field.width)}
            >
              <FileField
                accept={field.accept}
                sx={{ width: "100%" }}
                label={field.label}
                name={field.name}
                required={field.required}
              />
              {showDeleteButton && (
                <IconButton
                  aria-label="Löschen"
                  component="button"
                  variant="plain"
                  color="danger"
                  sx={{
                    height: "36px",
                    marginTop: "27px",
                  }}
                  onClick={async () => {
                    await fieldHelper.setValue(null);
                    fieldHelper.setError(undefined);
                  }}
                >
                  <Delete />
                </IconButton>
              )}
            </Stack>
          )}
          {isCard && (
            <FileCard
              sx={widthSx(field.width)}
              name={uploadValue.name}
              type={uploadValue.type}
              size={uploadValue.size}
              actionMenuButtonColor="primary"
              actions={[
                {
                  name: "Download",
                  onClick: field.downloadFile,
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
                      onConfirm: async () => {
                        await fieldHelper.setValue(null);
                      },
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
