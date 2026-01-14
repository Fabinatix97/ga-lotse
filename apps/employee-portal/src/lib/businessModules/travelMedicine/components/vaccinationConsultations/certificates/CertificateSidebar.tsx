/**
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import {
  SidebarWithFormRefProps,
  UseSidebarWithFormRefResult,
  useSidebarWithFormRef,
} from "@eshg/lib-employee-portal";
import {
  ApiCertificateType,
  ApiStepWithAppliedServices,
} from "@eshg/travel-medicine-api";

import {
  UsePostCertificateRequest,
  usePostCertificate,
} from "@/lib/businessModules/travelMedicine/api/mutations/vaccinationConsultation";
import {
  CertificateForm,
  CertificateFormValues,
} from "@/lib/businessModules/travelMedicine/components/vaccinationConsultations/certificates/CertificateForm";

interface CertificateSidebarProps extends SidebarWithFormRefProps {
  procedureId: string;
  stepsWithAppliedServices: ApiStepWithAppliedServices[];
}

export function useCertificateSidebar(): UseSidebarWithFormRefResult<CertificateSidebarProps> {
  return useSidebarWithFormRef({
    component: CertificateSidebar,
  });
}

function CertificateSidebar(props: Readonly<CertificateSidebarProps>) {
  const postCertificate = usePostCertificate();
  const initialValues: CertificateFormValues = {
    ...props,
    certificateType: ApiCertificateType.HealthInsurance,
    selectedProcedureStepId: "",
    appliedServices: [],
    allAppliedServices: [],
  };

  async function handleSubmit(sidebarFormData: CertificateFormValues) {
    const serviceIds = sidebarFormData.appliedServices.map(
      (service) => service.serviceId,
    );
    const request: UsePostCertificateRequest = {
      procedureId: props.procedureId,
      apiPostPutCertificateRequest: {
        procedureStepId: sidebarFormData.selectedProcedureStepId,
        serviceIds: serviceIds,
        type: sidebarFormData.certificateType,
      },
    };
    await postCertificate.mutateAsync(request, {
      onSuccess: () => {
        props.onClose(true);
      },
    });
  }

  return (
    <CertificateForm
      initialValues={initialValues}
      formRef={props.formRef}
      procedureId={props.procedureId}
      stepsWithAppliedServices={props.stepsWithAppliedServices}
      title="Bescheinigung erstellen"
      submitButtonLabel="Erstellen"
      onSubmit={handleSubmit}
      onCancel={props.onClose}
    />
  );
}
