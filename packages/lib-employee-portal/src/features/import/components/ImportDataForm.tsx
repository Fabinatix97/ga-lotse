/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { CircularProgress, Stack, Typography, styled } from "@mui/joy";
import { useFormikContext } from "formik";
import { Ref } from "react";

import { RequiresChildren } from "@eshg/lib-portal";

import { FormButtonBar } from "../../../components/form/FormButtonBar";
import { SidebarActions } from "../../drawer/components/SidebarActions";
import { SidebarContent } from "../../drawer/components/SidebarContent";
import {
  SidebarForm,
  useSidebarFormHandle,
} from "../../drawer/components/SidebarForm";
import { SidebarFormHandle } from "../../drawer/types/sidebar";
import { ImportStatistics } from "../types/ImportStatistics";
import { ImportDataResult } from "../utils/parseImportResult";

import { ImportResult } from "./ImportResult";

interface ImportDataFormProps extends RequiresChildren {
  title: string;
  formRef: Ref<SidebarFormHandle>;
  onClose: () => Promise<void> | void;
  isImportWithMerge?: boolean;
  wasImportSuccessful: boolean;
  importResult: ImportDataResult<ImportStatistics> | undefined;
}

export function ImportDataForm({
  title,
  formRef,
  onClose,
  children,
  isImportWithMerge,
  wasImportSuccessful,
  importResult,
}: ImportDataFormProps) {
  const { handleSubmit, isSubmitting, dirty, resetForm } = useFormikContext();

  useSidebarFormHandle(formRef, {
    dirty: wasImportSuccessful ? false : dirty,
    resetForm,
  });

  return (
    <SidebarForm ref={formRef} onSubmit={handleSubmit}>
      <SidebarContent title={title}>
        {wasImportSuccessful && importResult !== undefined ? (
          <ImportResult
            file={importResult.file}
            statistics={importResult.statistics}
            isImportWithMerge={isImportWithMerge ?? false}
          />
        ) : (
          children
        )}
        {isSubmitting && <ImportPendingOverlay />}
      </SidebarContent>
      {!isSubmitting && (
        <SidebarActions>
          <FormButtonBar
            submitLabel="Importieren"
            submitting={isSubmitting}
            size="sm"
            onCancel={wasImportSuccessful ? undefined : onClose}
            onFinish={wasImportSuccessful ? onClose : undefined}
          />
        </SidebarActions>
      )}
    </SidebarForm>
  );
}

const OverlayStack = styled(Stack)(({ theme }) => ({
  background: theme.palette.background.body,
  userSelect: "none", // disable interactions
  position: "absolute",
  top: 0,
  right: 0,
  bottom: 0,
  left: 0,
  alignItems: "center",
  padding: theme.spacing(12),
}));

function ImportPendingOverlay() {
  return (
    <OverlayStack data-testid="importPending" spacing={2}>
      <CircularProgress
        variant="plain"
        size="md"
        sx={{ "--CircularProgress-size": "100px" }}
      />
      <Typography level="body-md" textAlign="center">
        Der Import kann einige Zeit in Anspruch nehmen. Bitte schließen Sie
        dieses Fenster nicht.
      </Typography>
    </OverlayStack>
  );
}
