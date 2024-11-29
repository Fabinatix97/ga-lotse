/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { ApiSchoolEntryFeature } from "@eshg/employee-portal-api/schoolEntry";
import type { OptionalFieldValue } from "@eshg/lib-portal/types/form";
import { Formik } from "formik";

import { useImportData } from "@/lib/businessModules/schoolEntry/api/mutations/importApi";
import {
  useGetLocationSelectionMode,
  useIsDirectProcedureTypeAssignmentOnImport,
} from "@/lib/businessModules/schoolEntry/api/queries/configApi";
import { useIsNewFeatureEnabled } from "@/lib/businessModules/schoolEntry/api/queries/featureTogglesApi";
import { ImportDataFields } from "@/lib/businessModules/schoolEntry/features/procedures/importData/ImportDataFields";
import { ImportListType } from "@/lib/businessModules/schoolEntry/features/procedures/importData/importTypes";
import { ImportDataForm } from "@/lib/shared/components/import/ImportDataForm";
import {
  SidebarWithFormRefProps,
  useSidebarWithFormRef,
} from "@/lib/shared/hooks/useSidebarWithFormRef";

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
  const isPastProcedureImportEnabled = useIsNewFeatureEnabled(
    ApiSchoolEntryFeature.ImportPastProcedures,
  );
  const locationSelectionMode = useGetLocationSelectionMode();
  const isDirectProcedureTypeAssignmentOnImport =
    useIsDirectProcedureTypeAssignmentOnImport();
  const {
    mutateAsync: importData,
    data: importResult,
    isSuccess,
  } = useImportData();

  return (
    <Formik initialValues={INITIAL_VALUES} onSubmit={importData}>
      {({ values, setFieldValue, setTouched }) => (
        <ImportDataForm
          formRef={props.formRef}
          onClose={props.onClose}
          importResult={importResult}
          wasImportSuccessful={isSuccess}
          title={
            values.listType === ImportListType.PastProcedureList
              ? "Abgeschlossene Untersuchungen importieren"
              : "Daten importieren"
          }
          isImportWithMerge={
            !(
              isDirectProcedureTypeAssignmentOnImport ||
              values.listType === ImportListType.PastProcedureList
            )
          }
        >
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
        </ImportDataForm>
      )}
    </Formik>
  );
}
