/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { CheckOutlined, CloseOutlined } from "@mui/icons-material";
import {
  FormControl,
  FormLabel,
  FormLabelProps,
  Stack,
  Typography,
  styled,
} from "@mui/joy";
import { ChangeEvent, ReactNode, useId, useRef } from "react";
import { isDefined, isFunction, isString } from "remeda";

import {
  FieldProps,
  FileLike,
  FileType,
  FormHelperTextWithIcon,
  formatFileSize,
  useBaseField,
  useDragAndDrop,
  useValidateFile,
  useValidateFileType,
  validatePipe,
} from "@eshg/lib-portal";

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

interface FileInformationTranslations {
  file: string;
  size: string;
}

type FileLabelProps = Pick<FormLabelProps, "id">;

export interface FileFieldProps extends Omit<FieldProps<File | null>, "label"> {
  label: string | (() => ReactNode);
  accept?: FileType | FileType[];
  placeholder: string;
  placeholderSelected: string;
  helperText: string;
  removeFile: string;
  fileInformationTranslation: FileInformationTranslations;
  onChange?: (file: FileLike | null) => void;
  maxFileSize?: number;
}

export function FileField(props: Readonly<FileFieldProps>) {
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
  const fileLabelId = useId();
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
            <CheckOutlined color="success" />
          ) : (
            <CloseOutlined color="danger" />
          )}
          <Stack>
            {renderLabel(props.label, { id: fileLabelId })}
            {props.accept && !isFileSelected && (
              <Typography>{props.helperText}</Typography>
            )}
            {isFileSelected && (
              <>
                <Typography sx={{ wordBreak: "break-all" }}>
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
                sx={{ marginBottom: 0.5 }}
                onClick={async () => {
                  fileInputRef.current!.value = "";
                  await field.helpers.setValue(null);
                }}
              >
                {props.removeFile}
              </StyledRemoveButton>
            )}

            <FileButton
              activeDragOver={dropState === "copy"}
              error={field.error || dropState === "no-drop"}
              aria-controls={fileLabelId}
              aria-describedby={`${fileLabelId}-helper-text`}
              onClick={handleButtonClick}
              onDragOver={handleFileDrag}
              onDrop={handleFileDrop}
              onDragLeave={handleFileDragLeave}
            >
              {isFileSelected ? props.placeholderSelected : props.placeholder}
            </FileButton>
            <HiddenInput
              ref={fileInputRef}
              aria-labelledby={fileLabelId}
              type="file"
              name={props.name}
              placeholder={props.placeholder}
              accept={acceptedMimeTypes}
              required={field.required}
              tabIndex={-1}
              onChange={handleChange}
            />
            {isDefined(field.helperText) && (
              <FormHelperTextWithIcon
                id={`${fileLabelId}-helper-text`}
                helperText={field.helperText}
              />
            )}
          </Stack>
        </Stack>
      </Stack>
    </FormControl>
  );
}
