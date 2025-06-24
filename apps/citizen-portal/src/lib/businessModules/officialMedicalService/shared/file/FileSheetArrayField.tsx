/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { FormControl } from "@mui/joy";
import {
  ArrayHelpers,
  FieldArray,
  FieldConfig,
  useField,
  useFormikContext,
} from "formik";
import { isDefined } from "remeda";

import {
  FieldProps,
  Validator,
  isNonEmptyArray,
  isNonEmptyString,
  useBaseField,
  useValidateFile,
  useValidateFileType,
  validatePipe,
} from "@eshg/lib-portal";

import {
  FileDescriptor,
  FileSheetArray,
  FileSheetArrayProps,
} from "@/lib/businessModules/officialMedicalService/shared/file/FileSheetArray";
import {
  fileToFileDescriptor,
  toArray,
} from "@/lib/businessModules/officialMedicalService/shared/file/helpers";

const BYTES_PER_MB = 1048576;
const MAX_FILE_SIZE = 10 * BYTES_PER_MB;

interface FileSheetArrayFieldProps
  extends Omit<FieldProps<File[] | null>, "label" | "validate">,
    Omit<
      FileSheetArrayProps,
      | "files"
      | "onChange"
      | "onRemove"
      | "onRemoveAll"
      | "name"
      | "required"
      | "error"
      | "helperText"
    > {
  // include files that are already uploaded to the server.
  //  these files will not be included in the field value but are visually shown above them.
  initialFiles?: FileDescriptor[];
  validate?: Validator<File>;
  maxFileSize?: number;
}

export function FileSheetArrayField(props: Readonly<FileSheetArrayFieldProps>) {
  return (
    <FieldArray name={props.name}>
      {(fieldArrayProps) => (
        <FileSheetArrayFieldInner {...{ ...props, ...fieldArrayProps }} />
      )}
    </FieldArray>
  );
}

function FileSheetArrayFieldInner({
  accept: acceptProp,
  labels,
  initialFiles = [],
  validate: validateProp,
  maxFileSize = MAX_FILE_SIZE,
  ...props
}: Readonly<FileSheetArrayFieldProps & ArrayHelpers<File[]>>) {
  const accept = toArray(acceptProp);

  const ctx = useFormikContext();
  const field = useBaseField<File[] | null>({
    ...props,
  });

  const validateFileType = useValidateFileType();
  const validateType = validateFileType(accept);

  const validateFile = useValidateFile();
  const validateSize = validateFile({ maxFileSize });

  const validate = validatePipe(
    // when removing an item formik tries to validate undefined?
    (file) => (!!file ? undefined : ""),
    validateType,
    validateSize,
    validateProp,
  );

  async function handleChange(files: File[]) {
    if (!isNonEmptyArray(files)) {
      return;
    }

    await ctx.setFieldTouched(props.name);

    // We are in a FieldArray, so normally we would use the push helper,
    //  but for some reason, that doesn't work with File objects.
    const initialLength = field.input.value?.length ?? 0;
    await Promise.all(
      files.map(async (file, index) => {
        const fieldName = `${props.name}[${initialLength + index}]`;
        await ctx.setFieldValue(fieldName, file);
        await ctx.setFieldTouched(fieldName, true, true);
      }),
    );
  }

  function handleRemove(index: number) {
    // the index from the FileSheetArray's point of view includes the initialFiles
    //  but field value doesn't include those, so subtract that length
    const actualIndex = index - initialFiles?.length;
    props.remove(actualIndex);
  }

  async function handleRemoveAll() {
    await field.helpers.setValue([]);
  }

  const fieldHelperText = (field.meta.error ?? props.hint) as
    | string
    | string[]
    | undefined;
  // helper text is a single string and will be displayed below the field
  const helperText = isNonEmptyString(fieldHelperText) ? fieldHelperText : "";
  // helper text is an array, errors will be displayed below each file sheet
  const helperTexts =
    typeof fieldHelperText !== "string" && isNonEmptyArray(fieldHelperText)
      ? fieldHelperText
      : [];

  const displayFiles = [
    ...initialFiles,
    ...(field.input.value?.map((file, index) =>
      fileToFileDescriptor(file, helperTexts[index]),
    ) ?? []),
  ];

  return (
    <FormControl error={isDefined(field.meta.error)} required={field.required}>
      <FileSheetArray
        files={displayFiles}
        accept={accept}
        error={field.error}
        required={field.required}
        helperText={helperText}
        labels={labels}
        indicator={props.indicator}
        showUploadButton={props.showUploadButton}
        showRemoveButtons={props.showRemoveButtons}
        showPdfaConvertLink={props.showPdfaConvertLink}
        extraInfo={props.extraInfo}
        extraButton={props.extraButton}
        onChange={handleChange}
        onRemove={handleRemove}
        onRemoveAll={handleRemoveAll}
      />
      {field.input.value?.map((_, index) => (
        <FakeField
          key={index}
          name={`${props.name}[${index}]`}
          validate={validate}
        />
      ))}
    </FormControl>
  );
}

function FakeField(props: FieldConfig<File>) {
  // Registers and unregisters the validation for the individual files.

  // Using ctx.registerField doesn't disable the validation when the field isn't rendered,
  //  making it impossible to continue after going back on a
  //  multistep form page containing the field with an error.

  // Keeping useField out of FileSheetArray lets it still be usable without
  //  being wrapped in a form.

  useField(props);

  return null;
}
