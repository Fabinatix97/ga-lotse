/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { ApiAddContact200Response } from "@eshg/employee-portal-api/base";
import { downloadFileAndOpen } from "@eshg/lib-portal/api/files/download";
import { HiddenContainer } from "@eshg/lib-portal/components/HiddenContainer";
import { mapRequiredValue } from "@eshg/lib-portal/helpers/form";
import type { OptionalFieldValue } from "@eshg/lib-portal/types/form";
import { Formik } from "formik";
import { useRef } from "react";

import { useImportData } from "@/lib/businessModules/schoolEntry/api/mutations/importApi";
import {
  useGetLocationSelectionMode,
  useIsDirectProcedureTypeAssignmentOnImport,
} from "@/lib/businessModules/schoolEntry/api/queries/configApi";
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
  school: null,
  location: null,
  schoolYear: "",
};

export interface ImportDataValues {
  listType: ImportListType;
  file: File | null;
  school: ApiAddContact200Response | null;
  location: ApiAddContact200Response | null;
  schoolYear: OptionalFieldValue<number>;
}

function ImportDataSidebar(props: SidebarWithFormRefProps) {
  const locationSelectionMode = useGetLocationSelectionMode();
  const isDirectProcedureTypeAssignmentOnImport =
    useIsDirectProcedureTypeAssignmentOnImport();
  const {
    mutateAsync: importData,
    data: importResult,
    isSuccess,
  } = useImportData();
  const downloadContainerRef = useRef<HTMLDivElement>(null);

  async function handleSubmit(values: ImportDataValues) {
    await importData(
      {
        file: mapRequiredValue(values.file),
        schoolYear: mapRequiredValue(values.schoolYear),
        listType: mapRequiredValue(values.listType),
        school: values.school,
        location: values.location,
      },
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

  return (
    <>
      <Formik initialValues={INITIAL_VALUES} onSubmit={handleSubmit}>
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
      <HiddenContainer ref={downloadContainerRef} />
    </>
  );
}
