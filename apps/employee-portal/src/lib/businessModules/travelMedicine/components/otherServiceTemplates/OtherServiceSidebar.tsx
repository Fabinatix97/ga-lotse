/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  SidebarWithFormRefProps,
  UseSidebarWithFormRefResult,
  useSidebarWithFormRef,
} from "@eshg/lib-employee-portal";
import {
  ApiOtherServiceTemplate,
  ApiPostPutOtherServiceTemplateRequest,
} from "@eshg/travel-medicine-api";

import {
  OtherServiceFormValues,
  OtherServiceSidebarForm,
} from "@/lib/businessModules/travelMedicine/components/otherServiceTemplates/OtherServiceSidebarForm";

export function useOtherServiceSidebar(): UseSidebarWithFormRefResult<OtherServiceSidebarProps> {
  return useSidebarWithFormRef({
    component: OtherServiceSidebar,
  });
}

interface OtherServiceSidebarProps extends SidebarWithFormRefProps {
  otherService?: ApiOtherServiceTemplate;
  createOtherServiceTemplate: (
    request: ApiPostPutOtherServiceTemplateRequest,
    onSuccess?: () => void,
  ) => Promise<void>;
  updateOtherServiceTemplate: (
    id: string,
    request: ApiPostPutOtherServiceTemplateRequest,
    onSuccess?: () => void,
  ) => Promise<void>;
}

function OtherServiceSidebar(props: Readonly<OtherServiceSidebarProps>) {
  const initialFormValuesOtherServices: OtherServiceFormValues = {
    description: props.otherService?.description ?? "",
    fee: props.otherService?.fee ?? 0,
    id: props.otherService?.id ?? "",
  };

  async function handleSubmit(values: OtherServiceFormValues) {
    if (values.id) {
      await props.updateOtherServiceTemplate(
        values.id,
        {
          description: values.description,
          fee: values.fee,
        },
        () => props.onClose(true),
      );
    } else {
      await props.createOtherServiceTemplate(
        {
          description: values.description,
          fee: values.fee,
        },
        () => props.onClose(true),
      );
    }
  }

  return (
    <OtherServiceSidebarForm
      initialValues={initialFormValuesOtherServices}
      formRef={props.formRef}
      title={props.otherService ? "Leistung bearbeiten" : "Leistung hinzufügen"}
      submitButtonLabel={props.otherService ? "Speichern" : "Hinzufügen"}
      onSubmit={handleSubmit}
      onCancel={props.onClose}
    />
  );
}
