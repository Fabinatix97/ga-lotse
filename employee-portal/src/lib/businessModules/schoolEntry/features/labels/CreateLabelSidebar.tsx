/**
 * Copyright 2024 cronn GmbH
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
import { FormButtonBar } from "@/lib/shared/components/form/FormButtonBar";
import { SidebarForm } from "@/lib/shared/components/form/SidebarForm";
import { Sidebar } from "@/lib/shared/components/sidebar/Sidebar";
import { SidebarActions } from "@/lib/shared/components/sidebar/SidebarActions";
import { SidebarContent } from "@/lib/shared/components/sidebar/SidebarContent";

interface CreateLabelProps {
  onClose: () => void;
}

const INITIAL_VALUES: LabelValues = {
  name: "",
  description: "",
};

export function CreateLabelSidebar(props: CreateLabelProps) {
  const createLabel = useCreateLabel();

  async function handleSubmit(data: LabelValues) {
    await createLabel
      .mutateAsync(mapToRequest(data), { onSuccess: props.onClose })
      .catch();
  }

  return (
    <Sidebar open onClose={props.onClose}>
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
    </Sidebar>
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
