/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { ApiSchoolEntryFeature } from "@eshg/employee-portal-api/schoolEntry";
import type { OptionalFieldValue } from "@eshg/lib-portal/types/form";
import { CircularProgress, Stack, Typography, styled } from "@mui/joy";
import { Formik } from "formik";
import { useRouter } from "next/navigation";

import { useImportData } from "@/lib/businessModules/schoolEntry/api/mutations/schoolEntryApi";
import {
  useGetLocationSelectionMode,
  useIsDirectProcedureTypeAssignmentOnImport,
} from "@/lib/businessModules/schoolEntry/api/queries/configApi";
import { useIsNewFeatureEnabled } from "@/lib/businessModules/schoolEntry/api/queries/featureTogglesApi";
import { ImportListType } from "@/lib/businessModules/schoolEntry/features/procedures/importData/importTypes";
import { routes } from "@/lib/businessModules/schoolEntry/shared/routes";
import { FormButtonBar } from "@/lib/shared/components/form/FormButtonBar";
import { SidebarForm } from "@/lib/shared/components/form/SidebarForm";
import { SidebarActions } from "@/lib/shared/components/sidebar/SidebarActions";
import { SidebarContent } from "@/lib/shared/components/sidebar/SidebarContent";
import {
  SidebarWithFormRefProps,
  useSidebarWithFormRef,
} from "@/lib/shared/hooks/useSidebarWithFormRef";

import { ImportDataFields } from "./ImportDataFields";
import { ImportResult } from "./ImportResult";

export function useImportDataSidebar() {
  return useSidebarWithFormRef({
    component: ImportDataSidebar,
  });
}

const INITIAL_VALUES: ImportDataValues = {
  listType: ImportListType.SchoolList,
  file: null,
  schoolId: "",
  locationId: "",
  schoolYear: "",
};

export interface ImportDataValues {
  listType: ImportListType;
  file: File | null;
  schoolId: OptionalFieldValue<string>;
  locationId: OptionalFieldValue<string>;
  schoolYear: OptionalFieldValue<number>;
}

function ImportDataSidebar(props: SidebarWithFormRefProps) {
  const router = useRouter();
  const isPastProcedureImportEnabled = useIsNewFeatureEnabled(
    ApiSchoolEntryFeature.ImportPastProcedures,
  );
  const locationSelectionMode = useGetLocationSelectionMode();
  const isDirectProcedureTypeAssignmentOnImport =
    useIsDirectProcedureTypeAssignmentOnImport();
  const importData = useImportData();

  async function handleSubmit(values: ImportDataValues) {
    await importData.mutateAsync(values);
  }

  function handleClose() {
    router.push(routes.procedures.overview);
    props.onClose(true);
  }

  return (
    <>
      <Formik initialValues={INITIAL_VALUES} onSubmit={handleSubmit}>
        {({
          values,
          setFieldValue,
          setTouched,
          isSubmitting,
          handleSubmit,
        }) => (
          <SidebarForm ref={props.formRef} onSubmit={handleSubmit}>
            <SidebarContent title="Daten importieren">
              {importData.isSuccess ? (
                <ImportResult
                  file={importData.data.file}
                  statistics={importData.data.statistics}
                  isImportWithMerge={
                    !(
                      isDirectProcedureTypeAssignmentOnImport ||
                      values.listType === ImportListType.PastProcedureList
                    )
                  }
                />
              ) : (
                <ImportDataFields
                  listType={values.listType}
                  isPastProcedureImportEnabled={isPastProcedureImportEnabled}
                  locationSelectionMode={locationSelectionMode}
                  isDirectProcedureTypeAssignmentOnImport={
                    isDirectProcedureTypeAssignmentOnImport
                  }
                  setFieldValue={setFieldValue}
                  setTouched={setTouched}
                />
              )}
              {isSubmitting && <ImportPendingOverlay />}
            </SidebarContent>
            {!isSubmitting && (
              <SidebarActions>
                <FormButtonBar
                  submitLabel="Importieren"
                  submitting={isSubmitting}
                  onCancel={importData.isSuccess ? undefined : handleClose}
                  onFinish={importData.isSuccess ? handleClose : undefined}
                  size="sm"
                />
              </SidebarActions>
            )}
          </SidebarForm>
        )}
      </Formik>
    </>
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
