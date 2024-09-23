/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  ApiGetFile200Response,
  ApiInboxProgressEntryFileReference,
  ApiMail,
  ApiProgressEntry,
} from "@eshg/employee-portal-api/businessProcedures";
import { formatDateTime } from "@eshg/lib-portal/formatters/dateTime";
import DateRangeOutlinedIcon from "@mui/icons-material/DateRangeOutlined";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import { Divider, Stack, Typography } from "@mui/joy";
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
  mail?: OneOrMoreNodes;
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
  additionalElements?: OneOrMoreNodes;
  subject?: string;
  message?: string;
}

function EmailFields({ file, additionalElements }: EmailFieldsProps) {
  return (
    <>
      <LabelValueDisplay
        label="Absender"
        value={isDefined(file.metaData) ? file.metaData.mailFrom : ""}
      />
      <LabelValueDisplay
        label="Empfänger"
        value={isDefined(file.metaData) ? file.metaData.mailTo : ""}
      />
      {isDefined(additionalElements) && additionalElements}
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
      {file.type === "Mail" && (
        <EmailFields
          file={file as ApiMail}
          additionalElements={additionalElements?.mail}
        />
      )}
      {isDefined(additionalElements?.end) ? additionalElements.end : <></>}
    </>
  );
}
