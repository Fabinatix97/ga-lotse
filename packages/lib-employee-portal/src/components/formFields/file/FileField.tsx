/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  Box,
  FormControl,
  FormHelperText,
  FormLabel,
  FormLabelProps,
  Stack,
  styled,
} from "@mui/joy";
import { SxProps } from "@mui/joy/styles/types";
import { ChangeEvent, ReactNode, useId, useRef } from "react";
import { isDefined, isFunction, isString } from "remeda";

import {
  FieldProps,
  FileLike,
  FileType,
  useBaseField,
  useDragAndDrop,
  useValidateFile,
  useValidateFileType,
  validatePipe,
} from "@eshg/lib-portal";

import { FileButton, FileInputButton } from "./buttonVariants";

const HiddenInput = styled("input")({ display: "none" });

const DEFAULT_PLACEHOLDER = "Datei auswählen";

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
  variant?: "input" | "button";
  onChange?: (file: FileLike | null) => void;
  sx?: SxProps;
  readonly?: boolean;
  maxFileSize?: number;
}

type FileLabelProps = Pick<FormLabelProps, "htmlFor">;

export function FileField(props: Readonly<FileFieldProps>) {
  const UploadButton =
    props.variant === "button" ? FileButton : FileInputButton;

  const validateFileType = useValidateFileType();
  const validateFile = useValidateFile();
  const acceptedFileTypes = resolveAcceptedFileTypes(props.accept);
  const fileTypeErrorVal = validateFileType(acceptedFileTypes);
  const validate = validatePipe(
    fileTypeErrorVal,
    validateFile({
      acceptedExtensions: acceptedFileTypes.flatMap((type) => type.extensions),
      maxFileSize: props.maxFileSize,
    }),
    props.validate,
  );
  const field = useBaseField<File | null>({ ...props, validate });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const fileInputId = useId();
  const acceptedMimeTypes =
    acceptedFileTypes.length > 0
      ? acceptedFileTypes
          .flatMap((fileType) =>
            isString(fileType.mimeType)
              ? [fileType.mimeType]
              : fileType.mimeType,
          )
          .join(", ")
      : undefined;
  const fileName = field.input.value?.name;
  const placeholder = props.placeholder ?? DEFAULT_PLACEHOLDER;

  async function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const file = supplimentFileType(event.target.files?.[0] ?? null);
    await field.helpers.setValue(file);
    await field.helpers.setTouched(true);
    if (isFunction(props.onChange)) {
      props.onChange(file);
    }
  }

  function handleButtonClick() {
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
      fileInputRef.current.click();
    }
  }

  const { dropState, handleFileDrag, handleFileDrop, handleFileDragLeave } =
    useDragAndDrop({
      validateType: fileTypeErrorVal,
      onChange: field.helpers.setValue,
    });

  return (
    <Box sx={props.sx}>
      <FormControl error={field.error} required={field.required}>
        <Stack>
          {renderLabel(props.label, { htmlFor: fileInputId })}
          <UploadButton
            activeDragOver={dropState === "copy"}
            error={field.error || dropState === "no-drop"}
            aria-controls={fileInputId}
            aria-describedby={`${fileInputId}-helper-text`}
            onClick={handleButtonClick}
            onDragOver={handleFileDrag}
            onDrop={handleFileDrop}
            onDragLeave={handleFileDragLeave}
          >
            {fileName ?? placeholder}
          </UploadButton>
          <HiddenInput
            ref={fileInputRef}
            id={fileInputId}
            type="file"
            name={props.name}
            placeholder={placeholder}
            accept={acceptedMimeTypes}
            required={field.required}
            tabIndex={-1}
            onChange={handleChange}
          />
          {isDefined(field.helperText) && (
            <FormHelperText id={`${fileInputId}-helper-text`}>
              {field.helperText}
            </FormHelperText>
          )}
        </Stack>
      </FormControl>
    </Box>
  );
}

// Windows doesn't always have the correct MIME-Type
// This function corrects for that
function supplimentFileType(file: File): File;
function supplimentFileType(file: File | null): File | null;
function supplimentFileType(file: File | null): File | null {
  if (file == null) {
    return null;
  }
  const extension = file.name.split(".").at(-1)?.toUpperCase();
  switch (extension) {
    case "MD":
      return changeFileType(file, "text/markdown");
    case "ZIP":
      return changeFileType(file, "application/zip");
    default:
      return file;
  }
}

function changeFileType(file: File, newType: string): File {
  return new File([file], file.name, {
    type: newType,
    lastModified: file.lastModified,
  });
}
