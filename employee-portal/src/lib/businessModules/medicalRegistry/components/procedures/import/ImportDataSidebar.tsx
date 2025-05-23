/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { Formik } from "formik";
import { forwardRef, useCallback, useImperativeHandle, useRef } from "react";

import {
  DrawerProps,
  useConfirmationDialog,
  useSidebar,
} from "@eshg/lib-employee-portal";
import { downloadFileAndOpen, mapRequiredValue } from "@eshg/lib-portal";

import { useImportData } from "@/lib/businessModules/medicalRegistry/api/mutations/import";
import { ImportDataErrorSidebar } from "@/lib/businessModules/medicalRegistry/components/procedures/import/ImportDataErrorSidebar";
import { ImportDataFormSidebar } from "@/lib/businessModules/medicalRegistry/components/procedures/import/ImportDataFormSidebar";
import { ImportDataPendingSidebar } from "@/lib/businessModules/medicalRegistry/components/procedures/import/ImportDataPendingSidebar";
import { ImportDataSummarySidebar } from "@/lib/businessModules/medicalRegistry/components/procedures/import/ImportDataSummarySidebar";

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
            downloadFileAndOpen(file);
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
          <Formik initialValues={{ importFile: null }} onSubmit={handleSubmit}>
            <ImportDataFormSidebar onClose={handleClose} />
          </Formik>
        )}
      </>
    );
  },
);
