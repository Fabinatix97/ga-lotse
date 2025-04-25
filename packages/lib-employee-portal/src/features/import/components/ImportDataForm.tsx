/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { CircularProgress, Stack, Typography, styled } from "@mui/joy";
import { useFormikContext } from "formik";
import { Ref } from "react";

import { RequiresChildren } from "@eshg/lib-portal/types/react";

import { FormButtonBar } from "@/components/form/FormButtonBar";
import { SidebarActions } from "@/features/drawer/components/SidebarActions";
import { SidebarContent } from "@/features/drawer/components/SidebarContent";
import { SidebarForm } from "@/features/drawer/components/SidebarForm";
import { SidebarFormHandle } from "@/features/drawer/types/sidebar";
import { ImportStatistics } from "@/features/import/types/ImportStatistics";
import { ImportDataResult } from "@/features/import/utils/parseImportResult";

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
  const { handleSubmit, isSubmitting } = useFormikContext();
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
            onCancel={wasImportSuccessful ? undefined : onClose}
            onFinish={wasImportSuccessful ? onClose : undefined}
            size="sm"
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
