/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

"use client";

import { Formik } from "formik";

import { mapOptionalValue } from "@eshg/lib-portal";

import { FormButtonBar } from "../../../components/form/FormButtonBar";
import { SidebarActions } from "../../drawer/components/SidebarActions";
import { SidebarContent } from "../../drawer/components/SidebarContent";
import { SidebarForm } from "../../drawer/components/SidebarForm";
import {
  SidebarWithFormRefProps,
  UseSidebarWithFormRefResult,
  useSidebarWithFormRef,
} from "../../drawer/hooks/useSidebarWithFormRef";
import { useCreateProcedureLabel } from "../api/mutations";
import {
  CreateProcedureLabelRequest,
  ProcedureLabelClient,
} from "../types/procedureLabelClient";

import {
  ProcedureLabelFormFields,
  ProcedureLabelValues,
} from "./ProcedureLabelFormFields";

export function useCreateProcedureLabelSidebar(): UseSidebarWithFormRefResult<CreateProcedureLabelSidebarProps> {
  return useSidebarWithFormRef({
    component: CreateProcedureLabelSidebar,
  });
}

const INITIAL_VALUES: ProcedureLabelValues = {
  name: "",
  description: "",
};

interface CreateProcedureLabelSidebarProps extends SidebarWithFormRefProps {
  labelApi: ProcedureLabelClient;
}

function CreateProcedureLabelSidebar(props: CreateProcedureLabelSidebarProps) {
  const createProcedureLabel = useCreateProcedureLabel(props.labelApi);

  async function handleSubmit(data: ProcedureLabelValues) {
    await createProcedureLabel.mutateAsync(mapToRequest(data), {
      onSuccess: () => props.onClose(true),
    });
  }

  return (
    <Formik initialValues={INITIAL_VALUES} onSubmit={handleSubmit}>
      {({ isSubmitting }) => (
        <SidebarForm ref={props.formRef}>
          <SidebarContent title="Kennung hinzufügen">
            <ProcedureLabelFormFields />
          </SidebarContent>

          <SidebarActions>
            <FormButtonBar
              submitLabel="Hinzufügen"
              submitting={isSubmitting}
              onCancel={() => props.onClose()}
            />
          </SidebarActions>
        </SidebarForm>
      )}
    </Formik>
  );
}

function mapToRequest(
  values: ProcedureLabelValues,
): CreateProcedureLabelRequest {
  return {
    name: values.name,
    description: mapOptionalValue(values.description),
  };
}
