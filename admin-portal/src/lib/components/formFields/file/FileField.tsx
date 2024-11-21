/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useBaseField } from "@eshg/lib-portal/components/formFields/BaseField";
import { validatePipe } from "@eshg/lib-portal/helpers/validators";
import { FieldProps } from "@eshg/lib-portal/types/form";
import {
  FormControl,
  FormHelperText,
  FormLabel,
  FormLabelProps,
  Stack,
  styled,
} from "@mui/joy";
import { ChangeEvent, ReactNode, useId, useRef } from "react";
import { isDefined } from "remeda";

import { useValidateFileType } from "@/lib/helpers/validators";
import { useDragAndDrop } from "@/lib/hooks/useDragAndDrop";
import { useTranslation } from "@/lib/i18n/client";
import { FileType } from "@/lib/types/FileType";

import { FileInputButton } from "./FileInputButton";

const HiddenInput = styled("input")({ display: "hidden" });

function resolveAcceptedFileTypes(
  accept: FileType | FileType[] | undefined,
): FileType[] {
  if (accept === undefined) {
    return [];
  }

  if (Array.isArray(accept)) {
    return accept;
  }

  return [accept];
}

function renderLabel(
  label: string | ((labelProps: FileLabelProps) => ReactNode),
  labelProps: FileLabelProps,
) {
  if (typeof label === "function") {
    return label(labelProps);
  }

  return <FormLabel {...labelProps}>{label}</FormLabel>;
}

export interface FileFieldProps extends Omit<FieldProps<File | null>, "label"> {
  label: string | ((labelProps: FileLabelProps) => ReactNode);
  accept?: FileType | FileType[];
  placeholder?: string;
}

type FileLabelProps = Pick<FormLabelProps, "htmlFor">;

export function FileField(props: Readonly<FileFieldProps>) {
  const { i18n } = useTranslation();
  const acceptedFileTypes = resolveAcceptedFileTypes(props.accept);
  const fileTypeErrorVal = useValidateFileType(
    acceptedFileTypes,
    i18n.resolvedLanguage ?? "de-DE",
  );
  const acceptedMimeTypes =
    acceptedFileTypes.length > 0
      ? acceptedFileTypes.flatMap((fileType) => [fileType.mimeType]).join(", ")
      : undefined;
  const validate = validatePipe(fileTypeErrorVal, props.validate);
  const field = useBaseField<File | null>({ ...props, validate });
  const fileName = field.input.value?.name;
  const fileInputRef = useRef<HTMLInputElement>(null);
  const fileInputId = useId();

  async function handleChange(event: ChangeEvent<HTMLInputElement>) {
    await field.helpers.setValue(event.target.files?.[0] ?? null);
    await field.helpers.setTouched(true);
  }

  const { dropState, handleFileDrag, handleFileDrop, handleFileDragLeave } =
    useDragAndDrop({
      validateType: fileTypeErrorVal,
      onChange: field.helpers.setValue,
    });

  return (
    <FormControl error={field.error} required={field.required}>
      <Stack flexDirection="column" alignItems="flex-start">
        {renderLabel(props.label, { htmlFor: fileInputId })}
        <FileInputButton
          sx={{ marginBottom: 2 }}
          activeDragOver={dropState === "copy"}
          error={field.error || dropState === "no-drop"}
          onClick={() => fileInputRef.current?.click()}
          aria-controls={fileInputId}
          onDragOver={handleFileDrag}
          onDrop={handleFileDrop}
          onDragLeave={handleFileDragLeave}
        >
          {fileName ?? props.placeholder}
        </FileInputButton>
        <HiddenInput
          ref={fileInputRef}
          id={fileInputId}
          type="file"
          name={props.name}
          placeholder={props.placeholder}
          accept={acceptedMimeTypes}
          required={field.required}
          onChange={handleChange}
          tabIndex={-1}
        />
        {isDefined(field.helperText) && (
          <FormHelperText>{field.helperText}</FormHelperText>
        )}
      </Stack>
    </FormControl>
  );
}
