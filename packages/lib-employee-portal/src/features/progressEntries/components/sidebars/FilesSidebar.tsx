/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

"use client";

import { Button, Stack } from "@mui/joy";

import { ButtonBar } from "../../../../components/buttons/ButtonBar";
import { Sidebar } from "../../../drawer/components/Sidebar";
import { SidebarActions } from "../../../drawer/components/SidebarActions";
import { SidebarContent } from "../../../drawer/components/SidebarContent";
import { useProgressEntriesConfig } from "../../contexts/progressEntries";
import { FileCardWithActions } from "../FileCardWithActions";

interface FilesSidebarProps {
  open: boolean;
  onClose: () => void;
}

export function FilesSidebar({ open, onClose }: FilesSidebarProps) {
  const { files } = useProgressEntriesConfig();
  return (
    <Sidebar open={open} onClose={onClose}>
      <SidebarContent title={`Alle Dateien(${files.length})`}>
        <Stack spacing={1}>
          {files.map(({ file, progressEntryId }) => (
            <FileCardWithActions
              key={`files-sidebar-${file.fileId}`}
              detailsProgressEntryId={progressEntryId}
              file={file}
            />
          ))}
        </Stack>
      </SidebarContent>
      <SidebarActions>
        <ButtonBar
          right={
            <Button color="neutral" variant="soft" onClick={onClose}>
              Schließen
            </Button>
          }
        />
      </SidebarActions>
    </Sidebar>
  );
}
