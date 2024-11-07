/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useImportProcess } from "@/lib/businessModules/inspection/api/mutations/processImport";
import {
  ProcessImportForm,
  ProcessImportFormValues,
} from "@/lib/businessModules/inspection/components/processImport/ProcessImportForm";
import { ProcessImportPending } from "@/lib/businessModules/inspection/components/processImport/ProcessImportPending";
import { ProcessImportResult } from "@/lib/businessModules/inspection/components/processImport/ProcessImportResult";
import { DrawerProps } from "@/lib/shared/components/drawer/drawerContext";
import { useSidebar } from "@/lib/shared/components/drawer/useSidebar";

export function useProcessImportSidebar() {
  return useSidebar({
    component: ProcessImportSidebar,
  });
}

function ProcessImportSidebar({ onClose }: DrawerProps) {
  const {
    mutateAsync: importProcess,
    reset,
    status,
    data: result,
  } = useImportProcess();

  function handleClose() {
    reset();
    onClose();
  }

  async function handleSubmit({ file }: ProcessImportFormValues) {
    if (!file) {
      throw new Error("No file selected");
    }

    await importProcess({
      file,
    });
  }

  switch (status) {
    case "pending":
      return <ProcessImportPending />;
    case "success":
      return <ProcessImportResult result={result} onClose={handleClose} />;
    default:
      return (
        <ProcessImportForm onSubmit={handleSubmit} onClose={handleClose} />
      );
  }
}
