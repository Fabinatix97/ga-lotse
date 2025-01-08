/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { CreateLabelRequest } from "@eshg/employee-portal-api/schoolEntry";
import { mapOptionalValue } from "@eshg/lib-portal/helpers/form";
import { Formik } from "formik";

import { useCreateLabel } from "@/lib/businessModules/schoolEntry/api/mutations/labelsApi";
import {
  LabelFormFields,
  LabelValues,
} from "@/lib/businessModules/schoolEntry/features/labels/LabelFormFields";
import { DrawerProps } from "@/lib/shared/components/drawer/drawerContext";
import {
  UseSidebarResult,
  useSidebar,
} from "@/lib/shared/components/drawer/useSidebar";
import { FormButtonBar } from "@/lib/shared/components/form/FormButtonBar";
import { SidebarForm } from "@/lib/shared/components/form/SidebarForm";
import { SidebarActions } from "@/lib/shared/components/sidebar/SidebarActions";
import { SidebarContent } from "@/lib/shared/components/sidebar/SidebarContent";

export function useCreateLabelSidebar(): UseSidebarResult {
  return useSidebar({
    component: CreateLabelSidebar,
  });
}

const INITIAL_VALUES: LabelValues = {
  name: "",
  description: "",
};

function CreateLabelSidebar(props: DrawerProps) {
  const createLabel = useCreateLabel();

  async function handleSubmit(data: LabelValues) {
    await createLabel.mutateAsync(mapToRequest(data), {
      onSuccess: () => props.onClose(),
    });
  }

  return (
    <>
      <Formik initialValues={INITIAL_VALUES} onSubmit={handleSubmit}>
        {({ isSubmitting }) => (
          <SidebarForm>
            <SidebarContent title="Kennung hinzufügen">
              <LabelFormFields />
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

function mapToRequest(values: LabelValues): CreateLabelRequest {
  return {
    apiCreateLabelRequest: {
      name: values.name,
      description: mapOptionalValue(values.description),
    },
  };
}
