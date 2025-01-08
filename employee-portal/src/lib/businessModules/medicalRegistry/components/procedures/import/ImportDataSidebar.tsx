/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { downloadFileAndOpen } from "@eshg/lib-portal/api/files/download";
import { HiddenContainer } from "@eshg/lib-portal/components/HiddenContainer";
import { mapRequiredValue } from "@eshg/lib-portal/helpers/form";
import { Formik } from "formik";
import { forwardRef, useCallback, useImperativeHandle, useRef } from "react";

import { useImportData } from "@/lib/businessModules/medicalRegistry/api/mutations/import";
import { ImportDataErrorSidebar } from "@/lib/businessModules/medicalRegistry/components/procedures/import/ImportDataErrorSidebar";
import { ImportDataFormSidebar } from "@/lib/businessModules/medicalRegistry/components/procedures/import/ImportDataFormSidebar";
import { ImportDataPendingSidebar } from "@/lib/businessModules/medicalRegistry/components/procedures/import/ImportDataPendingSidebar";
import { ImportDataSummarySidebar } from "@/lib/businessModules/medicalRegistry/components/procedures/import/ImportDataSummarySidebar";
import { DrawerProps } from "@/lib/shared/components/drawer/drawerContext";
import { useSidebar } from "@/lib/shared/components/drawer/useSidebar";
import { useConfirmationDialog } from "@/lib/shared/hooks/useConfirmationDialog";

type TryAbortCallback = (onAbort: (close: boolean) => void) => void;

export function useImportDataSidebar() {
  const tryAbortRef = useRef<TryAbortCallback>(null);

  const importDataSidebar = useSidebar({
    component: ImportDataSidebar,
    onBeforeClose: (confirmClose) => {
      if (!tryAbortRef.current) {
        confirmClose(true);
        return;
      }
      tryAbortRef.current(confirmClose);
    },
  });

  return {
    open: () => importDataSidebar.open({ ref: tryAbortRef }),
  };
}

interface ImportDataFormValues {
  importFile: File | null;
}

const ImportDataSidebar = forwardRef<TryAbortCallback, DrawerProps>(
  function ImportDataSidebar({ onClose }, ref) {
    const { openConfirmationDialog } = useConfirmationDialog();
    const importData = useImportData();
    const downloadContainerRef = useRef<HTMLDivElement>(null);

    const { status, isPending, abort: abortImport } = importData;
    const tryAbort = useCallback<TryAbortCallback>(
      (onAbort) => {
        if (!isPending) {
          onAbort(true);
          return;
        }

        openConfirmationDialog({
          color: "danger",
          title: "Import wirklich abbrechen?",
          description:
            "Der Import Ihres Datensatzes läuft noch. Ein Abbruch führt zu unvollständigen Daten und nicht löschbaren Duplikaten.",
          confirmLabel: "Import abbrechen",
          cancelLabel: "Weiter importieren",
          onConfirm: () => {
            abortImport();
            onAbort(true);
          },
        });
      },
      [isPending, abortImport, openConfirmationDialog],
    );

    useImperativeHandle(ref, () => tryAbort, [tryAbort]);

    function handleSubmit(values: ImportDataFormValues) {
      importData.abort();
      importData.mutate(
        { file: mapRequiredValue(values.importFile) },
        {
          onSuccess: ({ file }) => {
            // Automatic download
            if (downloadContainerRef.current) {
              downloadFileAndOpen(file, downloadContainerRef.current);
            }
          },
        },
      );
    }
    function handleReset() {
      importData.reset();
    }
    function handleClose() {
      onClose();
    }

    return (
      <>
        {status === "pending" && <ImportDataPendingSidebar />}
        {status === "error" && (
          <ImportDataErrorSidebar
            error={importData.error}
            onReset={handleReset}
            onClose={handleClose}
          />
        )}
        {status === "success" && (
          <ImportDataSummarySidebar
            file={importData.data.file}
            statistics={importData.data.statistics}
            onReset={handleReset}
            onClose={handleClose}
          />
        )}
        {status === "idle" && (
          <Formik onSubmit={handleSubmit} initialValues={{ importFile: null }}>
            <ImportDataFormSidebar onClose={handleClose} />
          </Formik>
        )}
        <HiddenContainer ref={downloadContainerRef} />
      </>
    );
  },
);
