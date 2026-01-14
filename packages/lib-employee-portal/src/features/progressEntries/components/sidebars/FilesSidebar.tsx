/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

"use client";

import { Button, Stack } from "@mui/joy";

import { ButtonBar } from "../../../../components/buttons/ButtonBar";
import { SidebarActions } from "../../../drawer/components/SidebarActions";
import { SidebarContent } from "../../../drawer/components/SidebarContent";
import { UseSidebarResult, useSidebar } from "../../../drawer/hooks/useSidebar";
import { DrawerProps } from "../../../drawer/types/drawer";
import { useProgressEntriesConfig } from "../../contexts/progressEntries";
import { FileCardWithActions } from "../FileCardWithActions";

export function useFilesSidebar(): UseSidebarResult {
  return useSidebar({
    component: FilesSidebar,
  });
}

function FilesSidebar(props: DrawerProps) {
  const { files } = useProgressEntriesConfig();
  return (
    <>
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
            <Button
              color="neutral"
              variant="soft"
              onClick={() => props.onClose()}
            >
              Schließen
            </Button>
          }
        />
      </SidebarActions>
    </>
  );
}
