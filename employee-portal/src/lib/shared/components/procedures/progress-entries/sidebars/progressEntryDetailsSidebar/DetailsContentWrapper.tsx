/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { formatDateTime } from "@eshg/lib-portal/formatters/dateTime";
import {
  ApiGetFile200Response,
  ApiGetProgressEntryResponseRelatedKeyDocumentProgressEntriesInner,
  ApiInboxProgressEntryFileReference,
  ApiMail,
  ApiProgressEntry,
} from "@eshg/lib-procedures-api";
import DateRangeOutlinedIcon from "@mui/icons-material/DateRangeOutlined";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import WarningAmberOutlinedIcon from "@mui/icons-material/WarningAmberOutlined";
import {
  Accordion,
  AccordionDetails,
  AccordionGroup,
  AccordionSummary,
  Box,
  Divider,
  Sheet,
  Stack,
  Typography,
} from "@mui/joy";
import { PropsWithChildren, ReactNode } from "react";
import { isDefined } from "remeda";

import { FileCardWithActions } from "@/lib/shared/components/procedures/progress-entries/FileCardWithActions";
import { DeletionNote } from "@/lib/shared/components/procedures/progress-entries/FileOrDeletionNote";
import { LabelValueDisplay } from "@/lib/shared/components/procedures/progress-entries/sidebars/progressEntryDetailsSidebar/LabelValueDisplay";
import { SidebarContent } from "@/lib/shared/components/sidebar/SidebarContent";

type OneOrMoreNodes = ReactNode | ReactNode[];

interface AdditionalFileElements {
  start?: OneOrMoreNodes;
  end?: OneOrMoreNodes;
}

interface DetailsContentWrapperProps {
  entry: ApiProgressEntry;
  title: string;
  creatorName: string;
  additionalFileElements?: AdditionalFileElements;
  endSlot?: OneOrMoreNodes;
}

export function DetailsContentWrapper({
  entry,
  ...props
}: PropsWithChildren<DetailsContentWrapperProps>) {
  return (
    <SidebarContent title={props.title}>
      <Stack direction="row" justifyContent="space-between" marginBottom={1}>
        <Typography
          level="body-md"
          startDecorator={<PersonOutlineIcon />}
          data-testid="creator"
        >
          {props.creatorName}
        </Typography>
        <Typography
          level="body-md"
          startDecorator={<DateRangeOutlinedIcon />}
          data-testid="createdAt"
        >
          {formatDateTime(entry.createdAt)}
        </Typography>
      </Stack>
      <Divider sx={{ marginBottom: 3 }} />
      <Stack gap={2}>
        {entry.fileReference && (
          <FileSection
            fileReference={entry.fileReference}
            additionalElements={props.additionalFileElements}
          />
        )}
        {props.children}
        <Typography
          level="body-sm"
          textColor="text.secondary"
          textAlign="right"
          data-testid="lastModified"
        >
          {`letzte Änderung: ${formatDateTime(entry.modifiedAt)}`}
        </Typography>
        {isDefined(props.endSlot) && props.endSlot}
      </Stack>
    </SidebarContent>
  );
}

interface FileSectionProps {
  fileReference: ApiInboxProgressEntryFileReference;
  additionalElements?: AdditionalFileElements;
}

function FileSection({ fileReference, ...props }: FileSectionProps) {
  return fileReference.deleted ? (
    <DeletionNote />
  ) : fileReference.type === "GenericFileReference" ? (
    <></>
  ) : (
    <UndeletedFileSection file={fileReference} {...props} />
  );
}

interface UndeletedFileSectionProps
  extends Omit<FileSectionProps, "fileReference"> {
  file: ApiGetFile200Response;
}

interface EmailFieldsProps {
  file: ApiMail;
  subject?: string;
  message?: string;
}

function EmailFields({ file }: EmailFieldsProps) {
  return (
    <>
      <LabelValueDisplay
        label="Absender"
        value={file.metaData?.mailFrom ?? ""}
      />
      <LabelValueDisplay
        label="Empfänger"
        value={file.metaData?.mailTo ?? ""}
      />
      <LabelValueDisplay
        key="subject"
        label="Betreff"
        value={file.metaData?.subject ?? ""}
      />
      <LabelValueDisplay
        key="email-text"
        label="Email-Text"
        value={file.metaData?.messageText ?? ""}
      />
    </>
  );
}

function UndeletedFileSection({
  file,
  additionalElements,
}: UndeletedFileSectionProps) {
  return (
    <>
      <Typography level="title-md" marginBottom={1}>
        Datei
      </Typography>
      <FileCardWithActions file={file} />
      {additionalElements?.start}
      {file.type === "Mail" && <EmailFields file={file as ApiMail} />}
      {isDefined(additionalElements?.end) ? additionalElements.end : <></>}
    </>
  );
}

export function NewerVersionHint() {
  return (
    <Sheet variant="soft" color="neutral">
      <Typography
        level="body-sm"
        startDecorator={<WarningAmberOutlinedIcon color="warning" />}
      >
        Es existiert eine neuere Version dieser Datei.
      </Typography>
    </Sheet>
  );
}

export function AllKeyDocumentVersions({
  relatedEntries,
}: {
  relatedEntries: ApiGetProgressEntryResponseRelatedKeyDocumentProgressEntriesInner[];
}) {
  return (
    <AccordionGroup
      variant="soft"
      color="primary"
      size="sm"
      sx={{ borderRadius: "md" }}
    >
      <Accordion>
        <AccordionSummary
          color="primary"
          sx={{
            button: {
              color: "var(--joy-palette-primary-700)",
              borderRadius: "md",
            },
          }}
        >
          Alle Versionen anzeigen
        </AccordionSummary>
        <AccordionDetails>
          <Stack gap={1} padding={1}>
            {relatedEntries.map((entry) => (
              <Box key={entry.keyDocumentVersion} data-testid="relatedVersion">
                <Typography
                  level="body-sm"
                  fontWeight="500"
                >{`Version ${entry.keyDocumentVersion}`}</Typography>
                {isDefined(entry.fileReference) &&
                  entry.fileReference.type !== "GenericFileReference" && (
                    <FileCardWithActions
                      detailsProgressEntryId={entry.progressEntryId}
                      file={entry.fileReference}
                    />
                  )}
              </Box>
            ))}
          </Stack>
        </AccordionDetails>
      </Accordion>
    </AccordionGroup>
  );
}
