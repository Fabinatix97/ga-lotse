/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import type { SvgIconComponent } from "@mui/icons-material";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import FileDownloadOutlined from "@mui/icons-material/FileDownloadOutlined";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import {
  Alert,
  Button,
  ColorPaletteProp,
  Sheet,
  Stack,
  Typography,
} from "@mui/joy";
import { PropsWithChildren } from "react";

import {
  ButtonBar,
  SidebarActions,
  SidebarContent,
  formatDuplicatedRecordCount,
  formatFaultyRecordCount,
  formatTotalRecordCount,
} from "@eshg/lib-employee-portal";
import { downloadFileAndOpen } from "@eshg/lib-portal/api/files/download";

import { ImportProcessResult } from "@/lib/businessModules/inspection/api/mutations/processImport";
import { PotentialDuplicatesFilterProps } from "@/lib/businessModules/inspection/components/facility/pending/PotentialDuplicatesWarning";
import { formatImportedCount } from "@/lib/businessModules/inspection/components/processImport/formatters";

export interface ProcessImportResultProps
  extends PotentialDuplicatesFilterProps {
  result: ImportProcessResult;
  onClose: () => void;
}

export function ProcessImportResult({
  result,
  onClose,
  onFilterForDuplicates,
}: Readonly<ProcessImportResultProps>) {
  const { file, statistics } = result;

  return (
    <>
      <SidebarContent title="Daten Importieren">
        <Stack spacing={3}>
          <Typography color="success" fontWeight="md" data-testid="statusText">
            Import erfolgreich
          </Typography>
          <InfoSheet>
            <InfoText iconComponent={InfoOutlinedIcon} iconColor="primary">
              {formatTotalRecordCount(statistics.total)}
            </InfoText>
            <InfoText
              iconComponent={ErrorOutlineOutlinedIcon}
              iconColor="danger"
            >
              {formatDuplicatedRecordCount(statistics.duplicated)}
            </InfoText>
            <InfoText
              iconComponent={ErrorOutlineOutlinedIcon}
              iconColor="danger"
            >
              {formatFaultyRecordCount(statistics.failed)}
            </InfoText>
          </InfoSheet>
          <Section title="Vorgänge und Einrichtungen">
            <Alert variant="soft" color="primary">
              {formatImportedCount(statistics.created)} neu angelegt
            </Alert>
          </Section>
          <Section title="Bitte laden Sie die Ergebnis-Datei herunter.">
            <FileDownload file={file} />
          </Section>
        </Stack>
      </SidebarContent>
      <SidebarActions>
        <ButtonBar
          right={
            <>
              <Button
                onClick={onFilterForDuplicates}
                variant="soft"
                color="neutral"
              >
                Duplikate prüfen
              </Button>
              <Button onClick={onClose}>Fertig</Button>
            </>
          }
        />
      </SidebarActions>
    </>
  );
}

function InfoSheet({ children }: Readonly<PropsWithChildren>) {
  return (
    <Sheet variant="soft" sx={{ p: 3 }} data-testid="summary">
      <Stack spacing={3}>{children}</Stack>
    </Sheet>
  );
}

function InfoText({
  iconComponent: IconComponent,
  iconColor,
  children,
}: Readonly<
  PropsWithChildren<{
    iconComponent: SvgIconComponent;
    iconColor: ColorPaletteProp;
  }>
>) {
  return (
    <Typography
      startDecorator={<IconComponent color={iconColor} size="sm" />}
      gap={2}
      fontWeight="md"
    >
      {children}
    </Typography>
  );
}

function Section({
  title,
  children,
}: Readonly<PropsWithChildren<{ title: string }>>) {
  return (
    <Stack gap={1}>
      <Typography fontWeight="md">{title}</Typography>
      {children}
    </Stack>
  );
}

function FileDownload({ file }: Readonly<{ file: File }>) {
  function handleDownload() {
    downloadFileAndOpen(file);
  }

  return (
    <Button
      onClick={handleDownload}
      variant="soft"
      color="warning"
      startDecorator={<FileDownloadOutlined />}
      sx={{ justifyContent: "flex-start" }}
    >
      {file.name}
    </Button>
  );
}
