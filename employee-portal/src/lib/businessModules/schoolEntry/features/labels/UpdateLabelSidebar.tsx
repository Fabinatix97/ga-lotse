/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { UpdateLabelRequest } from "@eshg/employee-portal-api/schoolEntry";
import {
  mapOptionalValue,
  parseOptionalValue,
} from "@eshg/lib-portal/helpers/form";
import { Formik } from "formik";

import { Label } from "@/lib/businessModules/schoolEntry/api/models/Label";
import { useUpdateLabel } from "@/lib/businessModules/schoolEntry/api/mutations/labelsApi";
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

export function useUpdateLabelSidebar(): UseSidebarResult<UpdateLabelProps> {
  return useSidebar({
    component: UpdateLabelSidebar,
  });
}

interface UpdateLabelProps extends DrawerProps {
  label: Label;
}

function mapToLabelForm(label: Label): LabelValues {
  return {
    name: label.name,
    description: parseOptionalValue(label.description),
  };
}

function UpdateLabelSidebar(props: UpdateLabelProps) {
  const updateLabel = useUpdateLabel();

  async function handleSubmit(labelFormValues: LabelValues) {
    const labelId = props.label.id;
    const labelVersion = props.label.version;
    await updateLabel.mutateAsync(
      mapToRequest(labelId, labelFormValues, labelVersion),
      {
        onSuccess: () => props.onClose(),
      },
    );
  }

  return (
    <>
      <Formik
        initialValues={mapToLabelForm(props.label)}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <SidebarForm>
            <SidebarContent title="Kennung bearbeiten">
              <LabelFormFields />
            </SidebarContent>

            <SidebarActions>
              <FormButtonBar
                submitLabel="Speichern"
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
  labelsId: string,
  values: LabelValues,
  version: number,
): UpdateLabelRequest {
  return {
    id: labelsId,
    apiUpdateLabelRequest: {
      name: values.name,
      description: mapOptionalValue(values.description),
      version: version,
    },
  };
}
