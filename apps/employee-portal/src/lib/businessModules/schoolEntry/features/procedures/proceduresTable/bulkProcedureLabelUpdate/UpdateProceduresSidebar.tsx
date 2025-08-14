/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Formik, useFormikContext } from "formik";
import { isDefined } from "remeda";

import {
  FormButtonBar,
  ProcedureLabel,
  ProcedureLabelSelection,
  SidebarActions,
  SidebarContent,
  SidebarForm,
  SidebarWithFormRefProps,
  UpdateResultSummary,
  UseSidebarWithFormRefResult,
  useSidebarFormHandle,
  useSidebarWithFormRef,
} from "@eshg/lib-employee-portal";
import { ApiUpdateProceduresBulkResponse } from "@eshg/school-entry-api";

import { useLabelApi } from "@/lib/businessModules/schoolEntry/api/clients";
import { useUpdateProceduresInBulk } from "@/lib/businessModules/schoolEntry/api/mutations/schoolEntryApi";
import { schoolEntryApiQueryKey } from "@/lib/businessModules/schoolEntry/api/queries/apiQueryKeys";
import { ProcedureIdVersion } from "@/lib/businessModules/schoolEntry/shared/types";

interface UpdateProceduresSidebarProps extends SidebarWithFormRefProps {
  procedureIdsAndVersion: ProcedureIdVersion;
}

export function useUpdateProceduresSidebar(): UseSidebarWithFormRefResult<UpdateProceduresSidebarProps> {
  return useSidebarWithFormRef({
    component: UpdateProceduresSidebar,
  });
}

interface UpdateProceduresValues {
  procedureLabels: ProcedureLabel[];
}

function UpdateProceduresSidebar(props: UpdateProceduresSidebarProps) {
  const { mutateAsync, data, isSuccess } = useUpdateProceduresInBulk();

  async function handleSubmit(values: UpdateProceduresValues) {
    await mutateAsync({
      procedureIdsAndVersion: props.procedureIdsAndVersion,
      procedureLabels: values.procedureLabels.map((label) => label.id),
    });
  }

  return (
    <Formik initialValues={{ procedureLabels: [] }} onSubmit={handleSubmit}>
      <EmbeddedSidebarForm {...props} isSuccess={isSuccess} data={data} />
    </Formik>
  );
}

interface EmbeddedSidebarFormProps extends UpdateProceduresSidebarProps {
  isSuccess: boolean;
  data: ApiUpdateProceduresBulkResponse | undefined;
}

function EmbeddedSidebarForm(props: EmbeddedSidebarFormProps) {
  const labelApi = useLabelApi();
  const { onClose, formRef, isSuccess, data } = props;
  const { isSubmitting, dirty, resetForm } = useFormikContext();
  useSidebarFormHandle(formRef, {
    dirty: isSuccess ? false : dirty,
    resetForm,
  });

  return (
    <SidebarForm ref={formRef}>
      <SidebarContent title="Kennungen zuweisen">
        {isSuccess && isDefined(data) ? (
          <UpdateResultSummary
            items={[
              {
                type: "success",
                value: `${data.numUpdated} erfolgreich geändert`,
              },
              {
                type: "warning",
                value: `${data.numUnmodified} nicht geändert`,
              },
              {
                type: "error",
                value: `${data.numError} fehlgeschlagen`,
              },
            ]}
          />
        ) : (
          <ProcedureLabelSelection
            procedureLabelApi={labelApi}
            procedureLabelApiQueryKey={schoolEntryApiQueryKey}
            required="Bitte mindestens eine Kennung angeben."
          />
        )}
      </SidebarContent>
      <SidebarActions>
        <FormButtonBar
          submitting={isSubmitting}
          submitLabel="Speichern"
          onCancel={isSuccess ? undefined : onClose}
          onFinish={isSuccess ? onClose : undefined}
        />
      </SidebarActions>
    </SidebarForm>
  );
}
