/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { ApiFileType } from "@eshg/employee-portal-api/inspection";
import { FormPlus } from "@eshg/lib-portal/components/form/FormPlus";
import { DeleteOutlined, OpenInNew } from "@mui/icons-material";
import { Stack, Typography } from "@mui/joy";
import { useId } from "react";

import { useServerConfig } from "@/lib/baseModule/api/queries/config";
import { useConfiguration } from "@/lib/businessModules/inspection/api/clients";
import { useDeleteChecklistFile } from "@/lib/businessModules/inspection/api/mutations/checklist";
import { ChecklistLabel } from "@/lib/businessModules/inspection/components/inspection/execution/checklist/form/ChecklistLabel";
import { CLFormElement } from "@/lib/businessModules/inspection/components/inspection/execution/checklist/form/helpers";
import {
  CustomFileType,
  FileCard,
  FileCardActionProps,
} from "@/lib/shared/components/FileCard";
import { InfoIconTooltipButton } from "@/lib/shared/components/buttons/IconTooltipButton";
import { FileField } from "@/lib/shared/components/formFields/file/FileField";
import { FileType } from "@/lib/shared/components/formFields/file/FileType";
import { FileLike } from "@/lib/shared/components/formFields/file/validators";
import { formatFileSize } from "@/lib/shared/helpers/file";
import { validateFile } from "@/lib/shared/helpers/validators";

interface ChecklistFileElementProps {
  inspectionExternalId: string;
  element: CLFormElement;
  label: string;
  incident?: boolean;
  name: string;
  onChange?: (file: FileLike | null) => void;
  readOnly?: boolean;
}

interface FileMetaData {
  fileID: string;
  fileName: string;
  fileDate: Date;
  fileSize: number;
}

export function ChecklistFileElement({
  inspectionExternalId,
  element,
  label,
  name,
  onChange,
  readOnly = false,
}: Readonly<ChecklistFileElementProps>) {
  const { data: config } = useServerConfig();
  const uploadTooltipTitleId = useId();
  if (element.type !== "IMAGE" && element.type !== "AUDIO") {
    return;
  }

  const requiredType =
    element.type === "IMAGE" ? "ein Foto" : "eine Audiodatei";

  const requiredText = element.context.mandatory
    ? `Bitte ${requiredType} auswählen.`
    : undefined;

  const placeholderText =
    element.type === "IMAGE" ? "Bild auswählen" : "Audiodatei auswählen";

  const accept =
    element.type === "IMAGE"
      ? [FileType.Jpeg, FileType.Png]
      : [FileType.Mp3, FileType.Wav];

  const metaData: FileMetaData[] =
    element.type === "IMAGE"
      ? element.imageMetaData.map(({ imageID, ...rest }) => ({
          fileID: imageID,
          ...rest,
        }))
      : element.audioMetaData.map(({ audioID, ...rest }) => ({
          fileID: audioID,
          ...rest,
        }));

  const uploadTooltipTitle = "Hinweise für Datei Upload ";
  const uploadTooltipText = (
    <div>
      <div>
        Es werden folgende Formate unterstützt:{" "}
        {accept?.flatMap((fileType) => fileType.extensions).join(", ")}
      </div>
      <div>
        Die Dateigröße darf maximal {formatFileSize(config.maxFileSize)}{" "}
        betragen.
      </div>
      <div>Der Dateiname darf maximal 128 Zeichen lang sein.</div>
      <div>Der Dateiname unterstützt folgende Zeichen: A-Z a-z 0-9 - _</div>
    </div>
  );

  return (
    <FormPlus aria-label={element.type}>
      <Stack direction="column" gap={1}>
        <ChecklistLabel
          incident={false}
          required={element.context.mandatory}
          tooltipText={element.context.help}
          note={element.context.note}
        >
          {label}
        </ChecklistLabel>
        {!readOnly && (
          <>
            <Typography level="body-sm">
              <label id={uploadTooltipTitleId}>{uploadTooltipTitle}</label>
              <InfoIconTooltipButton
                size="sm"
                iconLabelledBy={uploadTooltipTitleId}
                title={uploadTooltipText}
              />
            </Typography>
            <FileField
              name={name}
              label=""
              placeholder={placeholderText}
              accept={accept}
              required={requiredText}
              variant="button"
              validate={validateFile(
                accept?.flatMap((fileType) => fileType.extensions),
                config.maxFileSize,
              )}
              onChange={onChange}
            />
          </>
        )}
        <Stack direction="row" flexWrap="wrap" gap={1} mt={1}>
          {metaData.map((file) => (
            <ClFileCard
              key={file.fileID}
              type={element.type}
              file={file}
              inspectionExternalId={inspectionExternalId}
            />
          ))}
          {metaData.length === 0 && (
            <Typography level="body-sm" textColor="text.secondary">
              Keine Datei vorhanden
            </Typography>
          )}
        </Stack>
      </Stack>
    </FormPlus>
  );
}

function ClFileCard({
  type,
  file,
  inspectionExternalId,
}: Readonly<{
  type: "AUDIO" | "IMAGE";
  file: FileMetaData;
  inspectionExternalId: string;
}>) {
  const { basePath } = useConfiguration();
  const url = `${basePath}/checklists/file/${file.fileID}`;

  const { mutateAsync: deleteChecklistFile } = useDeleteChecklistFile();

  function openFile() {
    window.open(url, "_blank");
  }

  async function deleteFile() {
    await deleteChecklistFile({
      externalId: file.fileID,
      fileName: file.fileName,
      inspectionExternalId,
    }).catch();
  }

  const fileType = type === "AUDIO" ? CustomFileType.Audio : ApiFileType.Jpeg;

  const actions: FileCardActionProps[] = [
    {
      name: type === "IMAGE" ? "Anzeigen" : "Öffnen",
      onClick: openFile,
      indicator: <OpenInNew />,
      color: "neutral",
    },
    {
      name: "Löschen",
      onClick: deleteFile,
      indicator: <DeleteOutlined />,
      color: "danger",
    },
  ];

  return (
    <FileCard
      name={file.fileName}
      type={fileType}
      creationDate={file.fileDate}
      size={file.fileSize ?? 0}
      actions={actions}
    />
  );
}
