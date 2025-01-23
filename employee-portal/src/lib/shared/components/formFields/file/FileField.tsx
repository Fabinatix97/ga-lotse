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
import { isDefined, isFunction, isString } from "remeda";

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
}

type FileLabelProps = Pick<FormLabelProps, "htmlFor">;

export function FileField(props: Readonly<FileFieldProps>) {
  const UploadButton =
    props.variant === "button" ? FileButton : FileInputButton;

  const acceptedFileTypes = resolveAcceptedFileTypes(props.accept);
  const fileTypeErrorVal = validateFileType(acceptedFileTypes, "de-DE"); // TODO: use user's locale
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
  const placeholder = props.placeholder ?? DEFAULT_PLACEHOLDER;

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
    <FormControl error={field.error} required={field.required}>
      <Stack>
        {renderLabel(props.label, { htmlFor: fileInputId })}
        <UploadButton
          activeDragOver={dropState === "copy"}
          error={field.error || dropState === "no-drop"}
          onClick={handleButtonClick}
          aria-controls={fileInputId}
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
          onChange={handleChange}
          tabIndex={-1}
        />
        {isDefined(field.helperText) && (
          <FormHelperText id={`${fileInputId}-helper-text`}>
            {field.helperText}
          </FormHelperText>
        )}
      </Stack>
    </FormControl>
  );
}
