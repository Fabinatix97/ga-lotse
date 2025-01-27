/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { useBaseField } from "@eshg/lib-portal/components/formFields/BaseField";
import { FileType } from "@eshg/lib-portal/components/formFields/file/FileType";
import { useDragAndDrop } from "@eshg/lib-portal/components/formFields/file/useDragAndDrop";
import {
  FileLike,
  validateFileType,
} from "@eshg/lib-portal/components/formFields/file/validators";
import { formatFileSize } from "@eshg/lib-portal/helpers/file";
import { validatePipe } from "@eshg/lib-portal/helpers/validators";
import { FieldProps } from "@eshg/lib-portal/types/form";
import { CheckOutlined, CloseOutlined } from "@mui/icons-material";
import {
  FormControl,
  FormHelperText,
  FormLabel,
  FormLabelProps,
  Stack,
  Typography,
  styled,
} from "@mui/joy";
import { ChangeEvent, ReactNode, useId, useRef } from "react";
import { isDefined, isFunction, isString } from "remeda";

import { useTranslation } from "@/lib/i18n/client";

import { FileButton, StyledRemoveButton } from "./buttonVariants";

const HiddenInput = styled("input")({ display: "none" });

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

  return (
    <FormLabel {...labelProps}>
      <Typography sx={{ fontWeight: "bold" }}>{label}</Typography>
    </FormLabel>
  );
}

export interface FileInformationTranslations {
  file: string;
  size: string;
}

export interface FileFieldProps extends Omit<FieldProps<File | null>, "label"> {
  label: string | ((labelProps: FileLabelProps) => ReactNode);
  accept?: FileType | FileType[];
  placeholder: string;
  placeholderSelected: string;
  helperText: string;
  removeFile: string;
  fileInformationTranslation: FileInformationTranslations;
  onChange?: (file: FileLike | null) => void;
}

type FileLabelProps = Pick<FormLabelProps, "htmlFor">;

export function FileField(props: Readonly<FileFieldProps>) {
  const { i18n } = useTranslation();
  const acceptedFileTypes = resolveAcceptedFileTypes(props.accept);
  const fileTypeErrorVal = validateFileType(
    acceptedFileTypes,
    i18n.resolvedLanguage ?? "de-DE",
  );
  const validate = validatePipe(fileTypeErrorVal, props.validate);
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
  const fileSize = field.input.value?.size;
  const isFileSelected = !!fileName;

  async function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] ?? null;
    await field.helpers.setValue(file);
    await field.helpers.setTouched(true);
    if (isFunction(props.onChange)) {
      props.onChange(file);
    }
  }

  function handleButtonClick() {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  }

  const { dropState, handleFileDrag, handleFileDrop, handleFileDragLeave } =
    useDragAndDrop({
      validateType: fileTypeErrorVal,
      onChange: field.helpers.setValue,
    });

  return (
    <FormControl error={field.error} required={field.required}>
      <Stack direction="row" flexWrap="wrap" gap={3} alignItems="center">
        <Stack direction="row" justifyContent="flex-start" flexGrow={1} gap={2}>
          {isFileSelected ? (
            <CheckOutlined color={"success"} />
          ) : (
            <CloseOutlined color={"danger"} />
          )}
          <Stack>
            {renderLabel(props.label, { htmlFor: fileInputId })}
            {props.accept && !isFileSelected && (
              <Typography>{props.helperText}</Typography>
            )}
            {isFileSelected && (
              <>
                <Typography>
                  {props.fileInformationTranslation.file}: {fileName}
                </Typography>
                <Typography>
                  {props.fileInformationTranslation.size}:{" "}
                  {formatFileSize(fileSize!)} Format: JPEG
                </Typography>
              </>
            )}
          </Stack>
        </Stack>

        <Stack direction="row" flexGrow={1} justifyContent="flex-end">
          <Stack alignItems="end">
            {isFileSelected && (
              <StyledRemoveButton
                onClick={async () => {
                  fileInputRef.current!.value = "";
                  await field.helpers.setValue(null);
                }}
                sx={{ marginBottom: 0.5 }}
              >
                {props.removeFile}
              </StyledRemoveButton>
            )}

            <FileButton
              activeDragOver={dropState === "copy"}
              error={field.error || dropState === "no-drop"}
              onClick={handleButtonClick}
              aria-controls={fileInputId}
              onDragOver={handleFileDrag}
              onDrop={handleFileDrop}
              onDragLeave={handleFileDragLeave}
            >
              {isFileSelected ? props.placeholderSelected : props.placeholder}
            </FileButton>
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
              <FormHelperText id={`${fileInputId}-helper-text`}>
                {field.helperText}
              </FormHelperText>
            )}
          </Stack>
        </Stack>
      </Stack>
    </FormControl>
  );
}
