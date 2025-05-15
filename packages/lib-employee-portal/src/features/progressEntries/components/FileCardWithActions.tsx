/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

"use client";

import {
  Delete,
  FileDownloadOutlined,
  InfoOutlined,
} from "@mui/icons-material";
import { isDefined } from "remeda";

import { useFileDownload } from "@eshg/lib-portal/api/files/download";
import { ApiAbstractFile } from "@eshg/lib-procedures-api";

import {
  FileCard,
  FileCardActionProps,
  mapToFileCardProps,
} from "../../../components/cards/FileCard";
import {
  useIsReadOnly,
  useProgressEntriesContext,
} from "../contexts/progressEntries";
import { useDeletionProps } from "../hooks/useDeletionProps";

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
  const progressEntriesContext = useProgressEntriesContext();
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
      indicator: <InfoOutlined />,
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
    indicator: <FileDownloadOutlined />,
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
  const { openFileDeletionModal } = useProgressEntriesContext().action;

  const deleteActionProps: FileCardActionProps = {
    onClick: () => {
      openFileDeletionModal(file.fileId);
    },
    indicator: <Delete />,
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
