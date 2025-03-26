/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useBaseField } from "@eshg/lib-portal/components/formFields/BaseField";
import { validateFileType } from "@eshg/lib-portal/components/formFields/file/validators";
import { isNonEmptyArray } from "@eshg/lib-portal/helpers/guards";
import { FieldProps } from "@eshg/lib-portal/types/form";
import { FormControl } from "@mui/joy";
import { isDefined } from "remeda";

import {
  FileDescriptor,
  FileSheetArray,
  FileSheetArrayProps,
} from "@/lib/businessModules/officialMedicalService/shared/file/FileSheetArray";
import {
  fileToFileDescriptor,
  toArray,
} from "@/lib/businessModules/officialMedicalService/shared/file/helpers";
import { useTranslation } from "@/lib/i18n/client";

export interface FileSheetArrayFieldProps
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

  const { i18n } = useTranslation();
  const validateType = validateFileType(
    accept,
    i18n.resolvedLanguage ?? "de-DE",
  );

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

  async function handleRemove(file: FileDescriptor) {
    const newArray =
      field.input.value?.filter(
        (it) => it.name !== file.name || it.size !== file.size,
      ) ?? null;
    await field.helpers.setValue(newArray);
  }

  async function handleRemoveAll() {
    await field.helpers.setValue([]);
  }

  const displayFiles = field.input.value?.map(fileToFileDescriptor) ?? [];

  return (
    <FormControl error={field.error} required={field.required}>
      <FileSheetArray
        files={displayFiles}
        onChange={handleChange}
        onRemove={handleRemove}
        onRemoveAll={handleRemoveAll}
        accept={accept}
        error={field.error}
        required={field.required}
        helperText={field.helperText}
        labels={labels}
        mode={props.mode}
        onFileUpload={() => props.handleFileUpload?.(field.input.value ?? [])}
      />
    </FormControl>
  );
}
