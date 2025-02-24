/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { InputField } from "@eshg/lib-portal/components/formFields/InputField";
import {
  ApiDocument,
  ApiDocumentStatus,
} from "@eshg/official-medical-service-api";
import { WarningAmber } from "@mui/icons-material";
import {
  Alert,
  Box,
  Chip,
  ChipProps,
  Divider,
  Stack,
  Typography,
} from "@mui/joy";
import { useField } from "formik";
import { ReactNode } from "react";
import { isEmpty } from "remeda";

import { FilesSection } from "@/lib/businessModules/officialMedicalService/components/procedures/details/documents/FilesSection";
import { statusColorsDocumentStatus } from "@/lib/businessModules/officialMedicalService/shared/constants";
import { STATUS_NAMES_DOCUMENT_STATUS } from "@/lib/businessModules/officialMedicalService/shared/translations";
import { EditButton } from "@/lib/shared/components/buttons/EditButton";
import { DetailsItem } from "@/lib/shared/components/detailsSection/items/DetailsItem";
import { SidebarContent } from "@/lib/shared/components/sidebar/SidebarContent";

export function DocumentFormContent(props: {
  title: string;
  document: ApiDocument;
  onEditInformation?: () => void;
  onEditNote?: () => void;
  isProcedureFinalized: boolean;
}) {
  const [{ value: files }] = useField<File[]>("files");

  const canAddFiles =
    (props.document.documentStatus === ApiDocumentStatus.Missing ||
      props.document.documentStatus === ApiDocumentStatus.Rejected) &&
    !props.isProcedureFinalized;

  const showNoteField = !isEmpty(files) && canAddFiles;

  return (
    <SidebarContent title={props.title}>
      <Stack rowGap={3}>
        <Stack
          gap={3}
          direction="row"
          flexWrap="wrap"
          width={"90%"}
          data-testid="core-data"
        >
          <ChipItem
            label="Status"
            color={statusColorsDocumentStatus[props.document.documentStatus]}
            value={STATUS_NAMES_DOCUMENT_STATUS[props.document.documentStatus]}
          />
          <ChipItem
            label="Pflichtdokument"
            color={props.document.mandatoryDocument ? "danger" : "neutral"}
            value={props.document.mandatoryDocument ? "Ja" : "Nein"}
          />
          {props.document.documentStatus !== ApiDocumentStatus.Missing && (
            <ChipItem
              label="Hochgeladen von"
              color={
                props.document.uploadedBy === "EXTERN" ? "warning" : "primary"
              }
              value={
                props.document.uploadedBy === "EXTERN" ? "Extern" : "Intern"
              }
            />
          )}
          <ChipItem
            label={"Upload-Option"}
            color={props.document.uploadInCitizenPortal ? "warning" : "neutral"}
            value={
              props.document.uploadInCitizenPortal
                ? "Intern und Extern"
                : "Intern"
            }
          />
        </Stack>
        <Divider orientation="horizontal" />
        {props.document.documentStatus !== ApiDocumentStatus.Submitted &&
          props.document.reasonForRejection && (
            <>
              <DetailsItem
                label="Ablehnungsgrund"
                value={props.document.reasonForRejection}
                slotProps={{
                  label: { level: "title-md", textColor: "text.primary" },
                  value: { level: "body-md" },
                }}
              />
              <Divider orientation="horizontal" />
            </>
          )}
        <Stack gap={2}>
          <Typography level={"title-md"}>Dateien</Typography>
          {props.document.documentStatus === ApiDocumentStatus.Submitted &&
            props.document.reasonForRejection && (
              <>
                <Alert color={"warning"} startDecorator={<WarningAmber />}>
                  Neu hochgeladene Dateien nach Ablehnung
                </Alert>
                <DetailsItem
                  label="Ablehnungsgrund"
                  value={props.document.reasonForRejection}
                />
              </>
            )}
          <FilesSection
            name="files"
            canAdd={canAddFiles}
            withInitialField={false}
            addLabel="Datei hinzufügen"
            files={props.document.files}
          />
          {showNoteField ? (
            <Box data-testid="noteSection">
              <InputField name="note" label="Stichwörter" />
            </Box>
          ) : (
            <Stack
              direction="row"
              gap={2}
              justifyContent="space-between"
              alignItems="start"
              data-testid="noteSection"
            >
              <DetailsItem
                label="Stichwörter"
                value={
                  !isEmpty(props.document.note) ? props.document.note : "-"
                }
                slotProps={{ value: { pt: 1 } }}
              />
              {!isEmpty(props.document.files) &&
                !props.isProcedureFinalized && (
                  <EditButton
                    aria-label="Stichwörter bearbeiten"
                    onClick={props.onEditNote}
                  />
                )}
            </Stack>
          )}
        </Stack>

        <Divider orientation="horizontal" />
        <Stack direction="column" gap={2} data-testid="additional-info">
          <Stack direction={"row"} gap={2} justifyContent={"space-between"}>
            <Typography level="title-md">Dokument-Angaben</Typography>
            {props.document.documentStatus === ApiDocumentStatus.Missing &&
              !props.isProcedureFinalized && (
                <EditButton
                  aria-label={"Dokument-Angaben bearbeiten"}
                  onClick={props.onEditInformation}
                />
              )}
          </Stack>
          <DetailsItem
            label="Dokumentenart (EN)"
            value={props.document.documentTypeEn ?? "-"}
          />
          <DetailsItem
            label="Hilfstext"
            value={
              !isEmpty(props.document.helpTextDe)
                ? props.document.helpTextDe
                : "-"
            }
          />
          <DetailsItem
            label="Hilfstext (EN)"
            value={props.document.helpTextEn ?? "-"}
          />
        </Stack>
      </Stack>
    </SidebarContent>
  );
}

function ChipItem({
  label,
  color,
  value,
}: {
  label: string;
  color: ChipProps["color"];
  value: ReactNode;
}) {
  return (
    <DetailsItem
      label={label}
      value={
        <Chip color={color} size="md">
          {value}
        </Chip>
      }
      slots={{ value: Box }}
      slotProps={{ value: { sx: { pt: 1 } } }}
    />
  );
}
