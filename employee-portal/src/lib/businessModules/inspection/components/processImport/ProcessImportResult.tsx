/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { downloadFileAndOpen } from "@eshg/lib-portal/api/files/download";
import { HiddenContainer } from "@eshg/lib-portal/components/HiddenContainer";
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
import { PropsWithChildren, useRef } from "react";

import { ImportProcessResult } from "@/lib/businessModules/inspection/api/mutations/processImport";
import {
  formatDuplicatedCount,
  formatFailedCount,
  formatImportedCount,
  formatTotalCount,
} from "@/lib/businessModules/inspection/components/processImport/formatters";
import { ButtonBar } from "@/lib/shared/components/buttons/ButtonBar";
import { SidebarActions } from "@/lib/shared/components/sidebar/SidebarActions";
import { SidebarContent } from "@/lib/shared/components/sidebar/SidebarContent";

export interface ProcessImportResultProps {
  result: ImportProcessResult;
  onClose: () => void;
}

export function ProcessImportResult({
  result,
  onClose: handleClose,
}: Readonly<ProcessImportResultProps>) {
  const { file, statistics } = result;

  return (
    <>
      <SidebarContent title="Daten Importieren">
        <Stack spacing={3}>
          <Typography color="success" fontWeight="md">
            Import erfolgreich
          </Typography>
          <InfoSheet>
            <InfoText iconComponent={InfoOutlinedIcon} iconColor="primary">
              {formatTotalCount(statistics.total)}
            </InfoText>
            <InfoText
              iconComponent={ErrorOutlineOutlinedIcon}
              iconColor="danger"
            >
              {formatDuplicatedCount(statistics.duplicated)}
            </InfoText>
            <InfoText
              iconComponent={ErrorOutlineOutlinedIcon}
              iconColor="danger"
            >
              {formatFailedCount(statistics.failed)}
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
              <Button onClick={handleClose} variant="soft" color="neutral">
                Duplikate prüfen
              </Button>
              <Button onClick={handleClose}>Fertig</Button>
            </>
          }
        />
      </SidebarActions>
    </>
  );
}

function InfoSheet({ children }: Readonly<PropsWithChildren>) {
  return (
    <Sheet variant="soft" sx={{ p: 3 }}>
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
  const downloadContainerRef = useRef<HTMLDivElement>(null);

  function handleDownload() {
    const downloadContainer = downloadContainerRef.current;
    if (downloadContainer === null) {
      throw new Error("Download container is not initialized");
    }
    downloadFileAndOpen(file, downloadContainer);
  }

  return (
    <>
      <Button
        onClick={handleDownload}
        variant="soft"
        color="warning"
        startDecorator={<FileDownloadOutlined />}
        sx={{ justifyContent: "flex-start" }}
      >
        {file.name}
      </Button>
      <HiddenContainer ref={downloadContainerRef} />
    </>
  );
}
