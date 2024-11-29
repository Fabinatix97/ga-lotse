/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { mapRequiredValue } from "@eshg/lib-portal/helpers/form";
import { Formik } from "formik";
import { forwardRef, useCallback, useImperativeHandle, useRef } from "react";

import { useImportData } from "@/lib/businessModules/medicalRegistry/api/mutations/import";
import { ImportDataErrorSidebar } from "@/lib/businessModules/medicalRegistry/components/procedures/import/ImportDataErrorSidebar";
import { ImportDataFormSidebar } from "@/lib/businessModules/medicalRegistry/components/procedures/import/ImportDataFormSidebar";
import { ImportDataPendingSidebar } from "@/lib/businessModules/medicalRegistry/components/procedures/import/ImportDataPendingSidebart";
import { ImportDataSummarySidebar } from "@/lib/businessModules/medicalRegistry/components/procedures/import/ImportDataSummarySidebar";
import { useConfirmationDialog } from "@/lib/shared/components/confirmationDialog/ConfirmationDialogProvider";
import { DrawerProps } from "@/lib/shared/components/drawer/drawerContext";
import { useSidebar } from "@/lib/shared/components/drawer/useSidebar";

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
            "Möglicherweise wurden bereits Daten übermittelt. Bereits hochgeladene Daten können nicht entfernt werden.",
          confirmLabel: "Import abbrechen",
          cancelLabel: "Mit Import fortfahren",
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
      importData.mutate({ file: mapRequiredValue(values.importFile) });
    }
    function handleReset() {
      importData.reset();
    }
    function handleAbort() {
      tryAbort(handleReset);
    }
    function handleClose() {
      onClose();
    }

    if (status === "error") {
      return (
        <ImportDataErrorSidebar
          error={importData.error}
          onReset={handleReset}
          onClose={handleClose}
        />
      );
    } else if (status === "success") {
      return (
        <ImportDataSummarySidebar
          file={importData.data.file}
          statistics={importData.data.statistics}
          onClose={handleClose}
        />
      );
    } else if (status === "pending") {
      return <ImportDataPendingSidebar onAbort={handleAbort} />;
    }

    return (
      <Formik onSubmit={handleSubmit} initialValues={{ importFile: null }}>
        <ImportDataFormSidebar onClose={handleClose} />
      </Formik>
    );
  },
);
