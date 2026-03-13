/**
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { DrawerProps, useSidebar } from "@eshg/lib-employee-portal";

import { useImportProcess } from "@/lib/businessModules/inspection/api/mutations/processImport";
import { PotentialDuplicatesFilterProps } from "@/lib/businessModules/inspection/components/facility/pending/PotentialDuplicatesWarning";
import {
  ProcessImportForm,
  ProcessImportFormValues,
} from "@/lib/businessModules/inspection/components/processImport/ProcessImportForm";
import { ProcessImportPending } from "@/lib/businessModules/inspection/components/processImport/ProcessImportPending";
import { ProcessImportResult } from "@/lib/businessModules/inspection/components/processImport/ProcessImportResult";

export function useImportSamplingPointsSidebar({
  onFilterForDuplicates,
}: PotentialDuplicatesFilterProps) {
  return useSidebar({
    component: (props) => (
      <ImportSamplingPointsSidebarWithQueriesAndMutations
        onFilterForDuplicates={onFilterForDuplicates}
        {...props}
      />
    ),
  });
}

function ImportSamplingPointsSidebarWithQueriesAndMutations({
  onClose,
  onFilterForDuplicates,
}: DrawerProps & PotentialDuplicatesFilterProps) {
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

  function handleFilterForDuplicates() {
    handleClose();
    onFilterForDuplicates();
  }

  async function handleSubmit({ file }: ProcessImportFormValues) {
    if (!file) {
      throw new Error("No file selected");
    }
    await importProcess({ file });
  }

  switch (status) {
    case "pending":
      return <ProcessImportPending />;
    case "success":
      return (
        <ProcessImportResult
          result={result}
          onClose={handleClose}
          onFilterForDuplicates={handleFilterForDuplicates}
        />
      );
    default:
      return (
        <ProcessImportForm onSubmit={handleSubmit} onClose={handleClose} />
      );
  }
}
