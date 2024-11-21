/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  ApiDisease,
  ApiPostPutDiseaseRequest,
} from "@eshg/employee-portal-api/travelMedicine";

import {
  PutDiseaseRequest,
  usePostDisease,
  usePutDisease,
} from "@/lib/businessModules/travelMedicine/api/mutations/diseaseApi";
import {
  DiseaseForm,
  DiseaseFormValues,
} from "@/lib/businessModules/travelMedicine/components/diseases/DiseaseForm";
import {
  SidebarWithFormRefProps,
  UseSidebarWithFormRefResult,
  useSidebarWithFormRef,
} from "@/lib/shared/hooks/useSidebarWithFormRef";

export function useDiseaseSidebar(): UseSidebarWithFormRefResult<DiseaseSidebarProps> {
  return useSidebarWithFormRef({
    component: DiseaseSidebar,
  });
}

interface DiseaseSidebarProps extends SidebarWithFormRefProps {
  disease?: ApiDisease;
}

function DiseaseSidebar(props: Readonly<DiseaseSidebarProps>) {
  const createDisease = usePostDisease();
  const updateDisease = usePutDisease();

  function mapInitialDiseaseFormValues(
    currentDisease?: ApiDisease,
  ): DiseaseFormValues {
    return {
      currentDiseaseId: currentDisease?.id ?? undefined,
      diseaseName: currentDisease?.name ?? "",
      estimatedFee: currentDisease?.estimatedFee?.toString() ?? "",
      visibleToCitizenPortal: currentDisease?.visibleToCitizenPortal ?? false,
    };
  }

  async function handleSubmit(values: DiseaseFormValues) {
    const request: ApiPostPutDiseaseRequest = {
      diseaseName: values.diseaseName,
      estimatedFee: +values.estimatedFee || undefined,
      visibleToCitizenPortal: values.visibleToCitizenPortal,
    };
    if (values.currentDiseaseId) {
      const requestToSend: PutDiseaseRequest = {
        id: values.currentDiseaseId,
        request: request,
      };
      await updateDisease.mutateAsync(requestToSend, {
        onSuccess: () => {
          props.onClose(true);
        },
      });
    } else {
      await createDisease.mutateAsync(request, {
        onSuccess: () => {
          props.onClose(true);
        },
      });
    }
  }

  return (
    <DiseaseForm
      initialValues={mapInitialDiseaseFormValues(props.disease)}
      formRef={props.formRef}
      title={props.disease ? "Krankheit bearbeiten" : "Krankheit hinzufügen"}
      submitButtonLabel={props.disease ? "Speichern" : "Hinzufügen"}
      onSubmit={handleSubmit}
      onCancel={props.onClose}
    />
  );
}
