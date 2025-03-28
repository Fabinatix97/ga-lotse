/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useConfirmationDialog } from "@eshg/lib-employee-portal";
import { InputField } from "@eshg/lib-portal/components/formFields/InputField";
import { NumberField } from "@eshg/lib-portal/components/formFields/NumberField";
import { RadioGroupField } from "@eshg/lib-portal/components/formFields/RadioGroupField";
import { Delete, Download } from "@mui/icons-material";
import { Radio, Stack } from "@mui/joy";
import { FormikValues } from "formik";

import { OpeningHoursField } from "@/lib/configurator/components/shared/OpeningHoursField";
import { FileCard, FileCardProps } from "@/lib/shared/components/FileCard";
import { InfoIconTooltipButton } from "@/lib/shared/components/buttons/IconTooltipButton";
import { CheckboxField } from "@/lib/shared/components/formFields/CheckboxField";
import { FileField } from "@/lib/shared/components/formFields/file/FileField";

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
  flex?: number;
}

interface NumberFormField extends BaseFormField {
  type: "number";
  readonly?: boolean;
  flex?: number;
}

interface UploadFormField extends BaseFormField {
  type: "upload";
  flex?: number;
}

interface CheckboxFormField extends BaseFormField {
  type: "checkbox";
  readonly?: boolean;
}

interface RadioFormField extends BaseFormField {
  type: "radio";
  readonly?: boolean;
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
          sx={{
            flex: field.flex ?? 1,
          }}
          type="text"
          name={field.name}
          label={field.label}
          placeholder={field.placeholder}
          readOnly={field.readonly}
          required={field.required}
        />
      );
    case "number":
      return (
        <NumberField
          fieldSx={{
            flex: field.flex ?? 1,
          }}
          name={field.name}
          label={field.label}
          readOnly={field.readonly}
          required={field.required}
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
              sx={{
                flex: field.flex ?? 1,
              }}
              label={field.label}
              name={field.name}
              required={field.required}
            />
          )}
          {isCard && (
            <FileCard
              sx={{
                flex: field.flex ?? 1,
              }}
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
        >
          <Stack gap={2}>
            {field.options.map((option) => (
              <Stack direction="row" gap={1} key={option.value}>
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
