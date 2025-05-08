/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

"use client";

import DeleteIcon from "@mui/icons-material/Delete";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { useContext } from "react";
import { isDefined } from "remeda";

import { FileCard, FileCardActionProps } from "@eshg/lib-employee-portal";
import { useFileDownload } from "@eshg/lib-portal/api/files/download";
import { ApiAbstractFile } from "@eshg/lib-procedures-api";

import { useDeletionProps } from "@/lib/shared/components/procedures/progress-entries/hooks/useDeletionProps";

import {
  ProgressEntriesContext,
  useIsReadOnly,
} from "./ProgressEntriesContext";
import { mapToFileCardProps } from "./mapper";

interface FileCardWithActionsProps {
  /** if set, includes an additional 'Details' link in actions menu */
  detailsProgressEntryId?: string;
  /** the file to display */
  file: ApiAbstractFile;
}

interface FileCardWithDownloadProps {
  file: ApiAbstractFile;
}

export function FileCardWithActions(props: FileCardWithActionsProps) {
  const isReadOnly = useIsReadOnly();
  const isDeletable = props.file.deletable;

  return isReadOnly || !isDeletable ? (
    <FileCardWithOptionalDetailsLinkAndDownload {...props} />
  ) : (
    <FileCardWithOptionalDetailsLinkAndDeleteAndDownload {...props} />
  );
}

export function FileCardWithDownload({ file }: FileCardWithDownloadProps) {
  return <FileCardWithOptionalDetailsLinkAndDownload file={file} />;
}

function FileCardWithOptionalDetailsLinkAndDownload({
  detailsProgressEntryId,
  file,
  additionalAction,
}: FileCardWithActionsProps & {
  additionalAction?: FileCardActionProps;
}) {
  const progressEntriesContext = useContext(ProgressEntriesContext);
  const { fileApi } = progressEntriesContext.config;
  const { openEntryDetailsSidebar } = progressEntriesContext.action;
  const { download } = useFileDownload((fileId: string) =>
    fileApi.downloadFileRaw({ fileId }),
  );

  const actions: FileCardActionProps[] = [];

  const hasDetailsAction = isDefined(detailsProgressEntryId);
  if (hasDetailsAction) {
    actions.push({
      onClick: () => openEntryDetailsSidebar(detailsProgressEntryId),
      indicator: <InfoOutlinedIcon />,
      name: "Details",
      color: "neutral",
    });
  }

  const hasAdditionalAction = isDefined(additionalAction);
  if (hasAdditionalAction) {
    actions.push(additionalAction);
  }

  actions.push({
    onClick: () => download(file.fileId),
    indicator: <FileDownloadOutlinedIcon />,
    name: "Download",
    color: "neutral",
  });

  return <FileCard {...mapToFileCardProps(file)} actions={actions} />;
}

function FileCardWithOptionalDetailsLinkAndDeleteAndDownload({
  detailsProgressEntryId,
  file,
}: FileCardWithActionsProps) {
  const { name } = useDeletionProps();
  const { openFileDeletionModal } = useContext(ProgressEntriesContext).action;

  const deleteActionProps: FileCardActionProps = {
    onClick: () => {
      openFileDeletionModal(file.fileId);
    },
    indicator: <DeleteIcon />,
    name,
    color: "danger",
    disabled: file.locked,
  };

  return (
    <FileCardWithOptionalDetailsLinkAndDownload
      detailsProgressEntryId={detailsProgressEntryId}
      file={file}
      additionalAction={deleteActionProps}
    />
  );
}
