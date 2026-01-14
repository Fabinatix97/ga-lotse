/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { OpenInNew } from "@mui/icons-material";
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
import { isDefined, isFunction } from "remeda";

import {
  ExternalLink,
  FieldProps,
  FileLike,
  FileType,
  useApiConfigurationUrl,
  useBaseField,
  useDragAndDrop,
  useValidateFile,
  useValidateFileType,
  validatePipe,
} from "@eshg/lib-portal";

import { FileButton, FileInputButton } from "./buttonVariants";

const HiddenInput = styled("input")({ display: "none" });

const DEFAULT_PLACEHOLDER = "Datei auswählen";

function toArray<T>(value: T | T[] | undefined): T[] {
  if (value === undefined) {
    return [];
  }

  if (Array.isArray(value)) {
    return value;
  }

  return [value];
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
  ref?: (el: HTMLButtonElement | null) => void;
  autoFocus?: boolean;
}

type FileLabelProps = Pick<FormLabelProps, "htmlFor">;

export function FileField(props: Readonly<FileFieldProps>) {
  const UploadButton =
    props.variant === "button" ? FileButton : FileInputButton;

  const acceptsPdf = [props.accept].flat().includes(FileType.Pdf);
  const validateFileType = useValidateFileType();
  const validateFile = useValidateFile();
  const acceptedFileTypes = toArray(props.accept);
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
  const acceptString =
    acceptedFileTypes.length > 0
      ? [
          ...acceptedFileTypes.flatMap((fileType) =>
            toArray(fileType.mimeType),
          ),
          ...acceptedFileTypes.flatMap((fileType) =>
            fileType.extensions.map((it) => `.${it}`),
          ),
        ].join(", ")
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
            ref={props.ref}
            autoFocus={props.autoFocus}
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
            accept={acceptString}
            required={field.required}
            tabIndex={-1}
            onChange={handleChange}
          />
          {isDefined(field.helperText) && (
            <FormHelperText id={`${fileInputId}-helper-text`}>
              {field.helperText}
            </FormHelperText>
          )}
          {acceptsPdf && <PdfaConverterPortalLink />}
        </Stack>
      </FormControl>
    </Box>
  );
}

function PdfaConverterPortalLink() {
  const pdfaConverterPortalUrl = useApiConfigurationUrl(
    "PUBLIC_PDF_CONVERTER_URL",
  );
  return (
    <ExternalLink
      href={pdfaConverterPortalUrl}
      openInNewTab
      startDecorator={<OpenInNew aria-label="In neuem Tab öffnen" />}
    >
      Hier können Sie Ihre PDF-Dateien in PDF/A-Dateien umwandeln.
    </ExternalLink>
  );
}

// Windows doesn't always have the correct MIME-Type
// This function corrects for that
function supplimentFileType(file: File): File;
function supplimentFileType(file: File | null): File | null;
function supplimentFileType(file: File | null): File | null {
  if (file === null) {
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
