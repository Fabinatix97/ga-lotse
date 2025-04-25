/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

"use client";

import { Formik } from "formik";

import { mapOptionalValue } from "@eshg/lib-portal/helpers/form";

import { FormButtonBar } from "@/components/form/FormButtonBar";
import { SidebarActions } from "@/features/drawer/components/SidebarActions";
import { SidebarContent } from "@/features/drawer/components/SidebarContent";
import { SidebarForm } from "@/features/drawer/components/SidebarForm";
import {
  UseSidebarResult,
  useSidebar,
} from "@/features/drawer/hooks/useSidebar";
import { DrawerProps } from "@/features/drawer/types/drawer";
import { useCreateProcedureLabel } from "@/features/procedureLabels/api/mutations";
import {
  ProcedureLabelFormFields,
  ProcedureLabelValues,
} from "@/features/procedureLabels/components/ProcedureLabelFormFields";
import {
  CreateProcedureLabelRequest,
  ProcedureLabelClient,
} from "@/features/procedureLabels/types/procedureLabelClient";

export function useCreateProcedureLabelSidebar(): UseSidebarResult<CreateProcedureLabelSidebarProps> {
  return useSidebar({
    component: CreateProcedureLabelSidebar,
  });
}

const INITIAL_VALUES: ProcedureLabelValues = {
  name: "",
  description: "",
};

interface CreateProcedureLabelSidebarProps extends DrawerProps {
  labelApi: ProcedureLabelClient;
}

function CreateProcedureLabelSidebar(props: CreateProcedureLabelSidebarProps) {
  const createProcedureLabel = useCreateProcedureLabel(props.labelApi);

  async function handleSubmit(data: ProcedureLabelValues) {
    await createProcedureLabel.mutateAsync(mapToRequest(data), {
      onSuccess: () => props.onClose(),
    });
  }

  return (
    <>
      <Formik initialValues={INITIAL_VALUES} onSubmit={handleSubmit}>
        {({ isSubmitting }) => (
          <SidebarForm>
            <SidebarContent title="Kennung hinzufügen">
              <ProcedureLabelFormFields />
            </SidebarContent>

            <SidebarActions>
              <FormButtonBar
                submitLabel="Hinzufügen"
                submitting={isSubmitting}
                onCancel={props.onClose}
              />
            </SidebarActions>
          </SidebarForm>
        )}
      </Formik>
    </>
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
