/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { ApiImportStatistics } from "@eshg/employee-portal-api/medicalRegistry";
import { downloadFileAndOpen } from "@eshg/lib-portal/api/files/download";
import { HiddenContainer } from "@eshg/lib-portal/components/HiddenContainer";
import {
  ErrorOutlineOutlined,
  FileDownloadOutlined,
  InfoOutlined,
  WarningAmberOutlined,
} from "@mui/icons-material";
import {
  Button,
  List,
  ListItem,
  ListItemDecorator,
  Sheet,
  Stack,
  Typography,
} from "@mui/joy";
import { useRef } from "react";

import { ButtonBar } from "@/lib/shared/components/buttons/ButtonBar";
import { SidebarActions } from "@/lib/shared/components/sidebar/SidebarActions";
import { SidebarContent } from "@/lib/shared/components/sidebar/SidebarContent";

interface ImportDataSummarySidebarProps {
  onClose: () => void;
  file: File;
  statistics: ApiImportStatistics;
}

export function ImportDataSummarySidebar({
  file,
  statistics,
  onClose,
}: ImportDataSummarySidebarProps) {
  return (
    <>
      <SidebarContent title="Daten importieren">
        <Stack gap={3}>
          <Typography level="title-md" color="success">
            Import erfolgreich
          </Typography>
          <StatisticsList statistics={statistics} />
          <Stack gap={1}>
            <Typography>Bitte laden Sie die Datei herunter.</Typography>
            <DownloadFileButton file={file} />
          </Stack>
        </Stack>
      </SidebarContent>
      <SidebarActions>
        <ButtonBar right={<Button onClick={onClose}>Fertig</Button>} />
      </SidebarActions>
    </>
  );
}

function StatisticsList({ statistics }: { statistics: ApiImportStatistics }) {
  const { created, total, duplicated, failed } = statistics;

  return (
    <Sheet color="neutral" variant="soft">
      <List
        aria-label="Statistiken"
        sx={(theme) => ({
          "--List-padding": 0,
          "--List-gap": theme.spacing(3),
          "--ListItem-paddingX": theme.spacing(2),
          "--ListItem-paddingY": theme.spacing(2),
        })}
      >
        <ListItem>
          <ListItemDecorator>
            <InfoOutlined color="primary" size="sm" />
          </ListItemDecorator>
          <Typography fontWeight="lg">
            {total === 1
              ? `${created} von ${total} Datensatz neu angelegt`
              : `${created} von ${total} Datensätzen neu angelegt`}
          </Typography>
        </ListItem>
        <ListItem>
          <ListItemDecorator>
            <WarningAmberOutlined color="warning" size="sm" />
          </ListItemDecorator>
          <Typography fontWeight="lg">
            {duplicated === 1
              ? `${duplicated} doppelter Datensatz`
              : `${duplicated} doppelte Datensätze`}
          </Typography>
        </ListItem>
        <ListItem>
          <ListItemDecorator>
            <ErrorOutlineOutlined color="danger" size="sm" />
          </ListItemDecorator>
          <Typography fontWeight="lg">
            {failed === 1
              ? `${failed} fehlerhafter Datensatz`
              : `${failed} fehlerhafte Datensätze`}
          </Typography>
        </ListItem>
      </List>
    </Sheet>
  );
}

function DownloadFileButton({ file }: { file: File }) {
  const downloadContainerRef = useRef<HTMLDivElement>(null);

  function download() {
    const downloadContainer = downloadContainerRef.current;
    if (downloadContainer === null) {
      throw new Error("Download container is not initialized");
    }
    downloadFileAndOpen(file, downloadContainer);
  }

  return (
    <>
      <Button
        variant="soft"
        color="warning"
        startDecorator={<FileDownloadOutlined />}
        onClick={() => download()}
        sx={{ justifyContent: "flex-start" }}
      >
        {file.name}
      </Button>
      <HiddenContainer ref={downloadContainerRef} />
    </>
  );
}
