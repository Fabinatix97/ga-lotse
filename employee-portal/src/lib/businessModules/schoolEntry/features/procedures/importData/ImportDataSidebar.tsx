/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { ApiSchoolEntryFeature } from "@eshg/employee-portal-api/schoolEntry";
import type { OptionalFieldValue } from "@eshg/lib-portal/types/form";
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
import { Sidebar } from "@/lib/shared/components/sidebar/Sidebar";
import { SidebarActions } from "@/lib/shared/components/sidebar/SidebarActions";
import { SidebarContent } from "@/lib/shared/components/sidebar/SidebarContent";

import { ImportDataFields } from "./ImportDataFields";
import { ImportResult } from "./ImportResult";

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

export function ImportDataSidebar() {
  const router = useRouter();
  const isSchoolYearEnabled = useIsNewFeatureEnabled(
    ApiSchoolEntryFeature.SchoolYear,
  );
  const locationSelectionMode = useGetLocationSelectionMode();
  const isDirectProcedureTypeAssignmentOnImport =
    useIsDirectProcedureTypeAssignmentOnImport();
  const importData = useImportData(isSchoolYearEnabled);

  async function handleSubmit(values: ImportDataValues) {
    await importData.mutateAsync(values).catch();
  }

  function handleClose() {
    router.push(routes.procedures.overview);
    if (importData.isSuccess) {
      router.refresh();
    }
  }

  return (
    <Sidebar open onClose={handleClose}>
      <Formik initialValues={INITIAL_VALUES} onSubmit={handleSubmit}>
        {({ values, setFieldValue, isSubmitting, handleSubmit }) => (
          <SidebarForm onSubmit={handleSubmit}>
            <SidebarContent title="Daten importieren">
              {importData.isSuccess ? (
                <ImportResult
                  file={importData.data.file}
                  statistics={importData.data.statistics}
                  isDirectProcedureTypeAssignmentOnImport={
                    isDirectProcedureTypeAssignmentOnImport
                  }
                />
              ) : (
                <ImportDataFields
                  listType={values.listType}
                  requireSchoolYear={isSchoolYearEnabled}
                  locationSelectionMode={locationSelectionMode}
                  isDirectProcedureTypeAssignmentOnImport={
                    isDirectProcedureTypeAssignmentOnImport
                  }
                  setFieldValue={setFieldValue}
                />
              )}
            </SidebarContent>
            <SidebarActions>
              <FormButtonBar
                submitLabel="Importieren"
                submitting={isSubmitting}
                onCancel={handleClose}
                onFinish={importData.isSuccess ? handleClose : undefined}
                size="sm"
              />
            </SidebarActions>
          </SidebarForm>
        )}
      </Formik>
    </Sidebar>
  );
}
