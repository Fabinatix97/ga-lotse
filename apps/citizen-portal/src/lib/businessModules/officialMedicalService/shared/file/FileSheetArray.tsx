/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  CheckOutlined,
  CloseOutlined,
  WatchLaterOutlined,
} from "@mui/icons-material";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import {
  Box,
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
  ReactNode,
  RefObject,
  useId,
  useRef,
} from "react";
import { isDefined } from "remeda";

import {
  ExternalLink,
  FileType,
  FormHelperTextWithIcon,
  isNonEmptyArray,
  isNonEmptyString,
  useApiConfigurationUrl,
  useValidateFileType,
} from "@eshg/lib-portal";

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

interface FileSheetArrayLabels {
  label: string;
  placeholder: string;
  helperText: string;
  inputSummary: (count: number) => string;
  removeAllFiles: string;
  removeFile: (fileName: string) => string;
}

export interface FileDescriptor {
  id?: string;
  name: string;
  fileType: string;
  size: number;
  creationDate?: Date;
  helperText?: string;
}

export const FileSheetIndicator = {
  Success: "success",
  Error: "error",
  Pending: "pending",
} as const;
export type FileSheetIndicator =
  (typeof FileSheetIndicator)[keyof typeof FileSheetIndicator];

export interface FileSheetArrayProps extends FooterGridProps {
  files: FileDescriptor[];
  onChange?: (files: File[]) => void;
  onRemove?: (index: number) => void;
  onRemoveAll?: () => void;
  showUploadButton?: boolean;
  showRemoveButtons?: boolean;
  accept?: FileType | FileType[];
  name?: string;
  required?: boolean;
  error?: boolean;
  helperText?: string;
  labels: FileSheetArrayLabels;
  indicator?: FileSheetIndicator;
}

export function FileSheetArray({
  files,
  onChange = () => undefined,
  onRemove,
  onRemoveAll,
  showUploadButton = true,
  showRemoveButtons = true,
  name,
  required,
  error,
  helperText,
  labels,
  indicator,
  showPdfaConvertLink: showPdfaConvertLinkProp,
  ...props
}: Readonly<FileSheetArrayProps>) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const fileInputId = useId();

  const accept = toArray(props.accept);
  const showPdfaConvertLink =
    showPdfaConvertLinkProp ??
    (accept.includes(FileType.Pdf) && showUploadButton);

  const iconType = isDefined(indicator)
    ? indicator
    : isNonEmptyArray(files)
      ? FileSheetIndicator.Success
      : FileSheetIndicator.Error;

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
              display: "flex",
              alignItems: "center",
              gridArea: "uploadButton",
              justifySelf: "end",
              width: byBreakpoint({
                mobile: "100%",
                desktop: "80%",
              }),
            }}
          >
            {showUploadButton && (
              <FileInput
                fileInputRef={fileInputRef}
                fileInputId={fileInputId}
                accept={accept}
                name={name}
                required={required}
                error={error}
                labels={labels}
                ariaDescribedBy={`${fileInputId}-helper-text`}
                onChange={onChange}
              />
            )}
          </Box>
        </HeaderGrid>
        <FileStack
          files={files}
          labels={labels}
          onRemove={showRemoveButtons ? onRemove : undefined}
        >
          {isDefined(onRemoveAll) && showRemoveButtons && (
            <StyledRemoveButton
              sx={{
                alignSelf: "end",
                fontSize: theme.fontSize.md,
                fontWeight: theme.fontWeight.md,
                paddingX: byBreakpoint({ mobile: 2, desktop: 0 }),
              }}
              onClick={() => onRemoveAll()}
            >
              {labels.removeAllFiles}
            </StyledRemoveButton>
          )}
        </FileStack>
      </Sheet>
      {isNonEmptyString(helperText) && (
        <FormHelperTextWithIcon
          id={`${fileInputId}-helper-text`}
          testId="file-array-helper-text"
          helperText={helperText}
        />
      )}
      <FooterGrid showPdfaConvertLink={showPdfaConvertLink} {...props} />
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

interface FooterGridProps {
  showPdfaConvertLink?: boolean;
  extraInfo?: ReactNode | undefined;
  extraButton?: ReactNode | undefined;
}

function FooterGrid({
  showPdfaConvertLink,
  extraInfo,
  extraButton,
}: Readonly<FooterGridProps>) {
  if (
    !isDefined(extraInfo) &&
    !isDefined(extraButton) &&
    !showPdfaConvertLink
  ) {
    return;
  }

  return (
    <Box
      sx={{
        pt: 3,
        display: "grid",
        gap: 2,
        gridTemplateRows: "min-content 1fr",
        gridTemplateColumns: byBreakpoint({
          mobile: "1fr",
          desktop: "max-content 1fr 1fr",
        }),
        gridTemplateAreas: byBreakpoint({
          mobile: '"info info" "extraButton extraButton"',
          desktop: '"info info info" "_ _ extraButton"',
        }),
        paddingX: byBreakpoint({ mobile: 2, desktop: 0 }),
      }}
    >
      {(isDefined(extraInfo) || showPdfaConvertLink) && (
        <Stack sx={{ gridArea: "info" }} gap={1}>
          {showPdfaConvertLink && <PdfaConverterPortalLink />}
          {extraInfo}
        </Stack>
      )}
      {isDefined(extraButton) && (
        <Box
          sx={{
            gridArea: "extraButton",
            display: "grid",
            justifySelf: "end",
            height: "40px",
            width: byBreakpoint({
              mobile: "100%",
              desktop: "80%",
            }),
          }}
        >
          {extraButton}
        </Box>
      )}
    </Box>
  );
}

export function IndicatorIcon({
  type,
  sx,
}: Readonly<{
  type: FileSheetIndicator;
  sx?: SxProps;
}>) {
  switch (type) {
    case FileSheetIndicator.Success:
      return <CheckOutlined color="success" sx={sx} />;
    case FileSheetIndicator.Error:
      return <CloseOutlined color="danger" sx={sx} />;
    case FileSheetIndicator.Pending:
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
  ariaDescribedBy?: string;
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
  ariaDescribedBy,
}: Readonly<FileInputProps>) {
  const acceptMimeTypes = accept.map((type) => type.mimeType).join(",");

  const validateFileType = useValidateFileType();
  const validateType = validateFileType(accept);

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
    if (event.target.files?.length) {
      onChange([...event.target.files]);
      // work-around for Chrome not allowing selecting the same file twice in a row:
      event.target.value = "";
    }
  }

  return (
    <>
      <FileButton
        activeDragOver={dropState === "copy"}
        error={error || dropState === "no-drop"}
        aria-controls={fileInputId}
        sx={{ backgroundColor: "white", height: "40px", minWidth: "100%" }}
        aria-describedby={ariaDescribedBy}
        onClick={handleButtonClick}
        onDragOver={handleFileDrag}
        onDrop={handleFileDrop}
        onDragLeave={handleFileDragLeave}
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
        tabIndex={-1}
        multiple
        onChange={handleInputChange}
      />
    </>
  );
}

type FileStackProps = PropsWithChildren<
  Pick<FileSheetArrayProps, "files" | "onRemove"> & {
    labels: Pick<FileSheetArrayLabels, "removeFile">;
  }
>;

function FileStack({
  files,
  onRemove,
  labels,
  children,
}: Readonly<FileStackProps>) {
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
          removeLabel={labels.removeFile(file.name)}
          onRemove={onRemove ? () => onRemove(index) : undefined}
        />
      ))}
      {children}
    </Stack>
  );
}

function PdfaConverterPortalLink() {
  const { t } = useTranslation(["officialMedicalService/personalArea"]);
  const pdfaConverterPortalUrl = useApiConfigurationUrl(
    "PUBLIC_PDF_CONVERTER_URL",
  );

  return (
    <ExternalLink
      href={pdfaConverterPortalUrl}
      openInNewTab
      startDecorator={
        <OpenInNewIcon aria-label={t("documents.files.openInNewTab")} />
      }
    >
      {t("documents.files.pdfaConverterPortalLinkText")}
    </ExternalLink>
  );
}
