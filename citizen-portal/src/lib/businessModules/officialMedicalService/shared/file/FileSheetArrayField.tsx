/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { FormControl } from "@mui/joy";
import { isDefined, splice } from "remeda";

import {
  FieldProps,
  isNonEmptyArray,
  useBaseField,
  useValidateFileType,
} from "@eshg/lib-portal";

import {
  FileSheetArray,
  FileSheetArrayProps,
} from "@/lib/businessModules/officialMedicalService/shared/file/FileSheetArray";
import {
  fileToFileDescriptor,
  toArray,
} from "@/lib/businessModules/officialMedicalService/shared/file/helpers";

interface FileSheetArrayFieldProps
  extends Omit<FieldProps<File[] | null>, "label" | "validate">,
    Pick<FileSheetArrayProps, "accept" | "labels" | "mode"> {
  handleFileUpload?: (files: File[]) => void;
}

export function FileSheetArrayField({
  accept: acceptProp,
  labels,
  ...props
}: Readonly<FileSheetArrayFieldProps>) {
  const accept = toArray(acceptProp);

  const field = useBaseField<File[] | null>({
    ...props,
  });

  const validateFileType = useValidateFileType();
  const validateType = validateFileType(accept);

  async function handleChange(files: File[]) {
    await field.helpers.setTouched(true);

    for (const file of files) {
      const error = validateType(file);

      if (isDefined(error)) {
        field.helpers.setError(error);
        return;
      }
    }

    if (isNonEmptyArray(files)) {
      const newArray = [...(field.input.value ?? []), ...files];
      await field.helpers.setValue(newArray);
    }
  }

  async function handleRemove(index: number) {
    const newArray = field.input.value
      ? splice(field.input.value, index, 1, [])
      : null;
    await field.helpers.setValue(newArray);
  }

  async function handleRemoveAll() {
    await field.helpers.setValue([]);
  }

  const displayFiles = field.input.value?.map(fileToFileDescriptor) ?? [];

  const splitHelperText = field.helperText?.split("\n");
  const helperText = splitHelperText ? splitHelperText[0] : "";
  const helperTexts = splitHelperText
    ? splitHelperText.slice(1, splitHelperText.length)
    : [];

  return (
    <FormControl error={field.error} required={field.required}>
      <FileSheetArray
        files={displayFiles}
        accept={accept}
        error={field.error}
        required={field.required}
        helperText={helperText}
        helperTexts={helperTexts}
        labels={labels}
        mode={props.mode}
        onChange={handleChange}
        onRemove={handleRemove}
        onRemoveAll={handleRemoveAll}
        onFileUpload={() => props.handleFileUpload?.(field.input.value ?? [])}
      />
    </FormControl>
  );
}
