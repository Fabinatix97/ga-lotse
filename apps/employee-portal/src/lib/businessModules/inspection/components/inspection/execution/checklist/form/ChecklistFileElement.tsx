/**
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { DeleteOutlined, OpenInNew } from "@mui/icons-material";
import { Stack, Typography } from "@mui/joy";
import { useId } from "react";

import { ApiFileType, ApiInspectionFeature } from "@eshg/inspection-api";
import {
  CustomFileType,
  FileCard,
  FileCardActionProps,
  FileField,
  useGetPublicConfig,
} from "@eshg/lib-employee-portal";
import { FileLike, FileType, FormPlus, formatFileSize } from "@eshg/lib-portal";

import { useConfiguration } from "@/lib/businessModules/inspection/api/clients";
import { useDeleteChecklistFile } from "@/lib/businessModules/inspection/api/mutations/checklist";
import { useIsNewFeatureEnabled } from "@/lib/businessModules/inspection/api/queries/feature";
import { ChecklistLabel } from "@/lib/businessModules/inspection/components/inspection/execution/checklist/form/ChecklistLabel";
import { CLFormElement } from "@/lib/businessModules/inspection/components/inspection/execution/checklist/form/helpers";
import { InfoIconTooltipButton } from "@/lib/shared/components/buttons/IconTooltipButton";

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
  const featureToggleChecklistRequirementRemovalEnabled =
    useIsNewFeatureEnabled(ApiInspectionFeature.ChecklistRequirementRemoval);

  const { data: config } = useGetPublicConfig();
  const uploadTooltipTitleId = useId();
  const titleId = useId();
  if (element.type !== "IMAGE" && element.type !== "AUDIO") {
    return;
  }

  const isMandatory =
    !featureToggleChecklistRequirementRemovalEnabled &&
    element.context.mandatory;

  const requiredType =
    element.type === "IMAGE" ? "ein Foto" : "eine Audiodatei";

  const requiredText = isMandatory
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
    <FormPlus data-testid={element.type}>
      <Stack direction="column" gap={1} role="group" aria-labelledby={titleId}>
        <ChecklistLabel
          incident={false}
          required={isMandatory}
          tooltipText={element.context.help}
          note={element.context.note}
          label-id={titleId}
        >
          {label}
        </ChecklistLabel>
        {!readOnly && (
          <>
            <Typography level="body-sm">
              <label id={uploadTooltipTitleId}>{uploadTooltipTitle}</label>
              <InfoIconTooltipButton
                iconSize="sm"
                infoText={uploadTooltipText}
                title="Hinweise für Datei Upload"
              />
            </Typography>
            <FileField
              name={name}
              label=""
              placeholder={placeholderText}
              accept={accept}
              maxFileSize={config.maxFileSize}
              required={requiredText}
              variant="button"
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
    });
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
