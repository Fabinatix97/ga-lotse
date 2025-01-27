/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { ImportStatistics } from "@eshg/lib-employee-portal/api/models/import/ImportStatistics";
import { ImportDataResult } from "@eshg/lib-employee-portal/helpers/import";
import { RequiresChildren } from "@eshg/lib-portal/types/react";
import { CircularProgress, Stack, Typography, styled } from "@mui/joy";
import { useFormikContext } from "formik";
import { Ref } from "react";

import { FormButtonBar } from "@/lib/shared/components/form/FormButtonBar";
import {
  SidebarForm,
  SidebarFormHandle,
} from "@/lib/shared/components/form/SidebarForm";
import { ImportResult } from "@/lib/shared/components/import/ImportResult";
import { SidebarActions } from "@/lib/shared/components/sidebar/SidebarActions";
import { SidebarContent } from "@/lib/shared/components/sidebar/SidebarContent";

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
