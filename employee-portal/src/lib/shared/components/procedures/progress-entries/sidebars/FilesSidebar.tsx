/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

"use client";

import { Button, Stack } from "@mui/joy";

import { ButtonBar } from "@/lib/shared/components/buttons/ButtonBar";
import { FileCardWithActions } from "@/lib/shared/components/procedures/progress-entries/FileCardWithActions";
import { useProgressEntriesConfig } from "@/lib/shared/components/procedures/progress-entries/ProgressEntriesContext";
import { Sidebar } from "@/lib/shared/components/sidebar/Sidebar";
import { SidebarActions } from "@/lib/shared/components/sidebar/SidebarActions";
import { SidebarContent } from "@/lib/shared/components/sidebar/SidebarContent";

interface FilesSidebarProps {
  open: boolean;
  onClose: () => void;
}

export function FilesSidebar({ open, onClose }: FilesSidebarProps) {
  const { files } = useProgressEntriesConfig();
  return (
    <>
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
    </>
  );
}
