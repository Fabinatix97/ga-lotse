/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useBaseField } from "@eshg/lib-portal/components/formFields/BaseField";
import { FileType } from "@eshg/lib-portal/components/formFields/file/FileType";
import { validateFileType } from "@eshg/lib-portal/components/formFields/file/validators";
import { isNonEmptyArray } from "@eshg/lib-portal/helpers/guards";
import { FieldProps } from "@eshg/lib-portal/types/form";
import { CheckOutlined, CloseOutlined } from "@mui/icons-material";
import {
  Box,
  FormControl,
  FormHelperText,
  FormLabel,
  FormLabelProps,
  Sheet,
  Stack,
  Typography,
  styled,
} from "@mui/joy";
import { ChangeEvent, PropsWithChildren, useId, useRef } from "react";
import { isDefined, isFunction, isString } from "remeda";

import { theme } from "@/lib/baseModule/theme/theme";
import { FileSheet } from "@/lib/businessModules/officialMedicalService/shared/file/FileSheet";
import { useDragAndDropMultiple } from "@/lib/businessModules/officialMedicalService/shared/file/useDragAndDropMultiple";
import { useTranslation } from "@/lib/i18n/client";
import { byBreakpoint } from "@/lib/shared/breakpoints";
import {
  FileButton,
  StyledRemoveButton,
} from "@/lib/shared/components/form/file/buttonVariants";

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

function renderLabel(label: string, labelProps: FileLabelProps) {
  return (
    <FormLabel {...labelProps}>
      <Typography sx={{ fontWeight: "bold" }}>{label}</Typography>
    </FormLabel>
  );
}

export interface FileArrayFieldProps
  extends Omit<FieldProps<File[] | null>, "label" | "validate"> {
  accept?: FileType | FileType[];
  labels: FileArrayFieldLabels;
  onChange?: (files: File[] | null) => void;
}

export interface FileArrayFieldLabels {
  label: string;
  placeholder: string;
  placeholderSelected: string;
  helperText: string;
  inputSummary: (count: number) => string;
  removeAllFiles: string;
  removeFile: string;
}

type FileLabelProps = Pick<FormLabelProps, "htmlFor">;

export function FileArrayField({
  labels,
  ...props
}: Readonly<FileArrayFieldProps>) {
  const { i18n } = useTranslation();
  const acceptedFileTypes = resolveAcceptedFileTypes(props.accept);
  const fileTypeErrorVal = validateFileType(
    acceptedFileTypes,
    i18n.resolvedLanguage ?? "de-DE",
  );
  const field = useBaseField<File[] | null>({
    ...props,
  });
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

  async function handleChange(event: ChangeEvent<HTMLInputElement>) {
    if (event.target.files !== null) {
      const newArray = Array.isArray(field.input.value)
        ? [...field.input.value]
        : [];
      const inputArray = [...event.target.files];
      inputArray.forEach((file) => {
        const error = fileTypeErrorVal(file);
        if (error) {
          return;
        } else newArray.push(file);
      });
      await field.helpers.setValue([...newArray]);
      await field.helpers.setTouched(true);
      if (isFunction(props.onChange)) {
        props.onChange(newArray);
      }
    }
  }

  function handleButtonClick() {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  }

  const { dropState, handleFileDrag, handleFileDrop, handleFileDragLeave } =
    useDragAndDropMultiple({
      validateType: fileTypeErrorVal,
      onChange: async (files) => {
        const newArray = Array.isArray(field.input.value)
          ? [...field.input.value]
          : [];
        await field.helpers.setValue([...newArray, ...files]);
      },
    });

  return (
    <FormControl error={field.error} required={field.required}>
      <Sheet
        variant="soft"
        sx={{
          borderRadius: byBreakpoint({
            mobile: theme.radius.xs,
            desktop: theme.radius.md,
          }),
          paddingX: byBreakpoint({ mobile: 0, desktop: 3 }),
        }}
      >
        <Stack direction="column" gap={2}>
          <ResponsiveGrid>
            {isNonEmptyArray(field.input.value) ? (
              <CheckOutlined
                color="success"
                sx={{ gridArea: "indicatorIcon" }}
              />
            ) : (
              <CloseOutlined
                color="danger"
                sx={{ gridArea: "indicatorIcon" }}
              />
            )}
            <Box sx={{ gridArea: "label" }}>
              {renderLabel(labels.label, { htmlFor: fileInputId })}
              {props.accept &&
                field.input.value !== null &&
                field.input.value.length === 0 && (
                  <Typography>{labels.helperText}</Typography>
                )}
              {isNonEmptyArray(field.input.value) && (
                <Typography>
                  {labels.inputSummary(field.input.value.length)}
                </Typography>
              )}
            </Box>
            <Box
              sx={{
                gridArea: "uploadButton",
                justifySelf: "end",
                width: byBreakpoint({
                  mobile: "100%",
                  desktop: "80%",
                }),
              }}
            >
              <FileButton
                activeDragOver={dropState === "copy"}
                error={field.error || dropState === "no-drop"}
                onClick={handleButtonClick}
                aria-controls={fileInputId}
                onDragOver={handleFileDrag}
                onDrop={handleFileDrop}
                onDragLeave={handleFileDragLeave}
                sx={{ backgroundColor: "white", minWidth: "100%" }}
              >
                {isNonEmptyArray(field.input.value)
                  ? labels.placeholderSelected
                  : labels.placeholder}
              </FileButton>
              <HiddenInput
                ref={fileInputRef}
                id={fileInputId}
                type="file"
                name={props.name}
                placeholder={labels.placeholder}
                accept={acceptedMimeTypes}
                required={field.required}
                onChange={handleChange}
                tabIndex={-1}
                multiple
              />
            </Box>
          </ResponsiveGrid>
          {isNonEmptyArray(field.input.value) && (
            <Stack direction="column" gap={2} sx={{ width: "100%" }}>
              {field.input.value.map((file, index) => (
                <FileSheet
                  key={`${file.name}.${index}`}
                  file={file}
                  removeLabel={`${labels.removeFile}.${index}`}
                  acceptedFileTypes={acceptedFileTypes}
                  onDelete={async () => {
                    if (field.input.value !== null) {
                      await field.helpers.setValue(
                        field.input.value.filter((item) => item !== file),
                      );
                    }
                  }}
                />
              ))}
              <StyledRemoveButton
                onClick={async () => {
                  fileInputRef.current!.value = "";
                  await field.helpers.setValue([]);
                }}
                sx={{
                  alignSelf: "end",
                  fontSize: theme.fontSize.md,
                  fontWeight: theme.fontWeight.md,
                  paddingX: byBreakpoint({ mobile: 2, desktop: 0 }),
                }}
              >
                {labels.removeAllFiles}
              </StyledRemoveButton>
            </Stack>
          )}
        </Stack>
      </Sheet>
      {isDefined(field.helperText) && (
        <FormHelperText id={`${fileInputId}-helper-text`}>
          {field.helperText}
        </FormHelperText>
      )}
    </FormControl>
  );
}

function ResponsiveGrid({ children }: Readonly<PropsWithChildren>) {
  return (
    <Box
      sx={{
        display: "grid",
        gap: 2,
        gridTemplateColumns: byBreakpoint({
          mobile: "max-content 1fr",
          desktop: "max-content 1fr 1fr",
        }),
        gridTemplateAreas: byBreakpoint({
          mobile: '"indicatorIcon label" "uploadButton uploadButton"',
          desktop: '"indicatorIcon label uploadButton"',
        }),
        paddingX: byBreakpoint({ mobile: 2, desktop: 0 }),
      }}
    >
      {children}
    </Box>
  );
}
