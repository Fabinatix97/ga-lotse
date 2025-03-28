/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { FileType } from "@eshg/lib-portal/components/formFields/file/FileType";
import { validateFileType } from "@eshg/lib-portal/components/formFields/file/validators";
import { isNonEmptyArray } from "@eshg/lib-portal/helpers/guards";
import { ApiDocumentStatus } from "@eshg/official-medical-service-api";
import {
  CheckOutlined,
  CloseOutlined,
  InfoOutlined,
  WatchLaterOutlined,
} from "@mui/icons-material";
import {
  Box,
  Button,
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
  onFileUpload?: () => void;
  accept?: FileType | FileType[];
  name?: string;
  required?: boolean;
  error?: boolean;
  helperText?: string;
  labels: FileSheetArrayLabels;
  mode?: ApiDocumentStatus;
}

export function FileSheetArray({
  files,
  onChange = () => undefined,
  onRemove,
  onRemoveAll,
  onFileUpload,
  name,
  required,
  error,
  helperText,
  labels,
  mode,
  ...props
}: Readonly<FileSheetArrayProps>) {
  const { t } = useTranslation(["officialMedicalService/personalArea"]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const fileInputId = useId();

  const accept = toArray(props.accept);

  const showAddRemoveButtons = isDefined(mode)
    ? mode === ApiDocumentStatus.Missing || mode === ApiDocumentStatus.Rejected
    : true;

  const iconType: IndicatorIconValues =
    mode === ApiDocumentStatus.Accepted
      ? "check"
      : mode === ApiDocumentStatus.Missing ||
          mode === ApiDocumentStatus.Rejected
        ? "close"
        : mode === ApiDocumentStatus.Submitted
          ? "watch"
          : isNonEmptyArray(files)
            ? "check"
            : "close";

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
          <IndicatorIcon type={iconType} sx={{ gridArea: "indicatorIcon" }} />
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
            {showAddRemoveButtons && (
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
            )}
          </Box>
        </HeaderGrid>
        <FileStack
          files={files}
          onRemove={showAddRemoveButtons ? onRemove : undefined}
          labels={labels}
        >
          {isDefined(onRemoveAll) && showAddRemoveButtons && (
            <Stack gap={0}>
              {mode && (
                <Typography
                  startDecorator={<InfoOutlined />}
                  textColor="danger.500"
                >
                  {t("documents.files.saveDocumentsInfo")}
                </Typography>
              )}
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
            </Stack>
          )}
        </FileStack>
        {mode && files.length > 0 && showAddRemoveButtons && (
          <FooterGrid>
            <Button
              variant="soft"
              sx={{
                gridArea: "uploadButton",
                justifySelf: "end",
                width: byBreakpoint({
                  mobile: "100%",
                  desktop: "80%",
                }),
              }}
              onClick={onFileUpload}
            >
              {t("documents.files.save", {
                context: mode,
              })}
            </Button>
          </FooterGrid>
        )}
      </Sheet>
      {isDefined(helperText) && (
        <FormHelperText id={`${fileInputId}-helper-text`}>
          {helperText}
        </FormHelperText>
      )}
    </>
  );
}

export function HeaderGrid({ children }: Readonly<PropsWithChildren>) {
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

export function FooterGrid({ children }: Readonly<PropsWithChildren>) {
  return (
    <Box
      sx={{
        display: "grid",
        gap: 2,
        gridTemplateColumns: byBreakpoint({
          mobile: "1fr",
          desktop: "max-content 1fr 1fr",
        }),
        gridTemplateAreas: byBreakpoint({
          mobile: '"uploadButton uploadButton"',
          desktop: '"_ _ uploadButton"',
        }),
        paddingX: byBreakpoint({ mobile: 2, desktop: 0 }),
      }}
    >
      {children}
    </Box>
  );
}

type IndicatorIconValues = "check" | "close" | "watch";

export function IndicatorIcon({
  type,
  sx,
}: Readonly<{
  type: IndicatorIconValues;
  sx?: SxProps;
}>) {
  switch (type) {
    case "check":
      return <CheckOutlined color="success" sx={sx} />;
    case "close":
      return <CloseOutlined color="danger" sx={sx} />;
    case "watch":
      return <WatchLaterOutlined color="warning" sx={sx} />;
  }
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
  fileInputRef: RefObject<HTMLInputElement | null>;
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
