/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { FileType } from "@eshg/lib-portal/components/formFields/file/FileType";
import { validateFileType } from "@eshg/lib-portal/components/formFields/file/validators";
import { isNonEmptyArray } from "@eshg/lib-portal/helpers/guards";
import { CheckOutlined, CloseOutlined } from "@mui/icons-material";
import {
  Box,
  FormHelperText,
  FormLabel,
  FormLabelProps,
  Sheet,
  Stack,
  Typography,
  styled,
} from "@mui/joy";
import { SxProps } from "@mui/joy/styles/types";
import {
  ChangeEvent,
  PropsWithChildren,
  RefObject,
  useId,
  useRef,
} from "react";
import { isDefined } from "remeda";

import { theme } from "@/lib/baseModule/theme/theme";
import { FileSheet } from "@/lib/businessModules/officialMedicalService/shared/file/FileSheet";
import { toArray } from "@/lib/businessModules/officialMedicalService/shared/file/helpers";
import { useDragAndDropMultiple } from "@/lib/businessModules/officialMedicalService/shared/file/useDragAndDropMultiple";
import { useTranslation } from "@/lib/i18n/client";
import { byBreakpoint } from "@/lib/shared/breakpoints";
import {
  FileButton,
  StyledRemoveButton,
} from "@/lib/shared/components/form/file/buttonVariants";

export interface FileSheetArrayLabels {
  label: string;
  placeholder: string;
  helperText: string;
  inputSummary: (count: number) => string;
  removeAllFiles: string;
  removeFile: string;
}

export interface FileDescriptor {
  id?: string;
  name: string;
  fileType: string;
  size: number;
  creationDate?: Date;
}

export interface FileSheetArrayProps {
  files: FileDescriptor[];
  onChange?: (files: File[]) => void;
  onRemove?: (file: FileDescriptor) => void;
  onRemoveAll?: () => void;
  accept?: FileType | FileType[];
  name?: string;
  required?: boolean;
  error?: boolean;
  helperText?: string;
  labels: FileSheetArrayLabels;
}

export function FileSheetArray({
  files,
  onChange = () => undefined,
  onRemove,
  onRemoveAll,
  name,
  required,
  error,
  helperText,
  labels,
  ...props
}: Readonly<FileSheetArrayProps>) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const fileInputId = useId();

  const accept = toArray(props.accept);

  return (
    <>
      <Sheet
        variant="soft"
        sx={{
          borderRadius: byBreakpoint({
            mobile: theme.radius.xs,
            desktop: theme.radius.md,
          }),
          paddingX: byBreakpoint({ mobile: 0, desktop: 3 }),
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <HeaderGrid>
          <IndicatorIcon
            success={isNonEmptyArray(files)}
            sx={{ gridArea: "indicatorIcon" }}
          />
          <Box sx={{ gridArea: "label" }}>
            <StyledLabel htmlFor={fileInputId}>{labels.label}</StyledLabel>
            <Typography data-testid="uploadedFiles">
              {isNonEmptyArray(files)
                ? labels.inputSummary(files.length)
                : labels.helperText}
            </Typography>
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
            <FileInput
              fileInputRef={fileInputRef}
              fileInputId={fileInputId}
              onChange={onChange}
              accept={accept}
              name={name}
              required={required}
              error={error}
              labels={labels}
            />
          </Box>
        </HeaderGrid>
        <FileStack files={files} onRemove={onRemove} labels={labels}>
          {isDefined(onRemoveAll) && (
            <StyledRemoveButton
              onClick={() => onRemoveAll()}
              sx={{
                alignSelf: "end",
                fontSize: theme.fontSize.md,
                fontWeight: theme.fontWeight.md,
                paddingX: byBreakpoint({ mobile: 2, desktop: 0 }),
              }}
            >
              {labels.removeAllFiles}
            </StyledRemoveButton>
          )}
        </FileStack>
      </Sheet>
      {isDefined(helperText) && (
        <FormHelperText id={`${fileInputId}-helper-text`}>
          {helperText}
        </FormHelperText>
      )}
    </>
  );
}

function HeaderGrid({ children }: Readonly<PropsWithChildren>) {
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

function IndicatorIcon({
  success,
  sx,
}: Readonly<{
  success: boolean;
  sx?: SxProps;
}>) {
  return success ? (
    <CheckOutlined color="success" sx={sx} />
  ) : (
    <CloseOutlined color="danger" sx={sx} />
  );
}

function StyledLabel({
  children,
  ...props
}: Readonly<PropsWithChildren<FormLabelProps>>) {
  return (
    <FormLabel {...props}>
      <Typography sx={{ fontWeight: theme.fontWeight.lg }}>
        {children}
      </Typography>
    </FormLabel>
  );
}

const HiddenInput = styled("input")({ display: "none" });

interface FileInputProps {
  fileInputId: string;
  fileInputRef: RefObject<HTMLInputElement>;
  onChange: (files: File[]) => void;
  accept: FileType[];
  name?: string;
  required?: boolean;
  error?: boolean;
  labels: Pick<FileSheetArrayLabels, "placeholder">;
}

function FileInput({
  fileInputId,
  fileInputRef,
  onChange,
  accept,
  name,
  required = false,
  error = false,
  labels,
}: Readonly<FileInputProps>) {
  const acceptMimeTypes = accept.map((type) => type.mimeType).join(",");

  const { i18n } = useTranslation();
  const validateType = validateFileType(
    accept,
    i18n.resolvedLanguage ?? "de-DE",
  );

  const { dropState, handleFileDrag, handleFileDrop, handleFileDragLeave } =
    useDragAndDropMultiple({
      validateType,
      onChange,
    });

  function handleButtonClick() {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  }

  function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
    if (event.target.files !== null) {
      onChange([...event.target.files]);
    }
  }

  return (
    <>
      <FileButton
        activeDragOver={dropState === "copy"}
        error={error || dropState === "no-drop"}
        onClick={handleButtonClick}
        aria-controls={fileInputId}
        onDragOver={handleFileDrag}
        onDrop={handleFileDrop}
        onDragLeave={handleFileDragLeave}
        sx={{ backgroundColor: "white", minWidth: "100%" }}
      >
        {labels.placeholder}
      </FileButton>
      <HiddenInput
        ref={fileInputRef}
        id={fileInputId}
        type="file"
        name={name}
        placeholder={labels.placeholder}
        accept={acceptMimeTypes}
        required={required}
        onChange={handleInputChange}
        tabIndex={-1}
        multiple
      />
    </>
  );
}

function FileStack({
  files,
  onRemove,
  labels,
  children,
}: Readonly<
  PropsWithChildren<{
    files: FileDescriptor[];
    onRemove?: (file: FileDescriptor) => void;
    labels: Pick<FileSheetArrayLabels, "removeFile">;
  }>
>) {
  if (files.length === 0) {
    return null;
  }

  return (
    <Stack
      direction="column"
      gap={2}
      sx={{ width: "100%" }}
      data-testid="documents"
    >
      {files.map((file, index) => (
        <FileSheet
          key={`${file.name}.${index}`}
          file={file}
          removeLabel={`${labels.removeFile}.${index}`}
          onRemove={onRemove}
        />
      ))}
      {children}
    </Stack>
  );
}
