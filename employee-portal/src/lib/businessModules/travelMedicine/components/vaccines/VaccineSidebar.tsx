/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  ApiDisease,
  ApiInventoryVaccineWithoutRmbiVaccine,
  ApiPostPutVaccineRequest,
  ApiVaccine,
} from "@eshg/employee-portal-api/travelMedicine";

import {
  usePostVaccine,
  usePutVaccine,
} from "@/lib/businessModules/travelMedicine/api/mutations/vaccines";
import {
  VaccineForm,
  VaccineFormValues,
} from "@/lib/businessModules/travelMedicine/components/vaccines/VaccineForm";
import {
  SidebarWithFormRefProps,
  UseSidebarWithFormRefResult,
  useSidebarWithFormRef,
} from "@/lib/shared/hooks/useSidebarWithFormRef";

export function useVaccineSidebar(): UseSidebarWithFormRefResult<VaccineSidebarProps> {
  return useSidebarWithFormRef({
    component: VaccineSidebar,
  });
}

interface VaccineSidebarProps extends SidebarWithFormRefProps {
  vaccine?: ApiVaccine;
  unusedInventoryVaccines: ApiInventoryVaccineWithoutRmbiVaccine[];
  allDiseases: ApiDisease[];
  defaultBatchIdEnabled: boolean;
}

function VaccineSidebar(props: Readonly<VaccineSidebarProps>) {
  const createVaccine = usePostVaccine();
  const updateVaccine = usePutVaccine();

  function mapInitialVaccineFormValues(
    currentVaccine?: ApiVaccine,
  ): VaccineFormValues {
    return {
      name: currentVaccine?.name ?? "",
      diseaseId: currentVaccine?.disease.id ?? "",
      fee: currentVaccine?.fee ?? 0.0,
      inventoryVaccineId: currentVaccine?.inventoryVaccineId ?? "",
      offsets: currentVaccine?.offsets ?? [],
      currentBatchId: currentVaccine?.currentBatchId ?? "",
      loadings: {
        currentInventoryVaccineId:
          currentVaccine?.inventoryVaccineId ?? undefined,
        diseases: props.allDiseases,
        unusedInventoryVaccines: props.unusedInventoryVaccines,
      },
      currentVaccineId: currentVaccine?.id,
    };
  }

  async function handleSubmit(values: VaccineFormValues) {
    const request: ApiPostPutVaccineRequest = {
      name: values.name,
      diseaseId: values.diseaseId,
      inventoryVaccineId: values.inventoryVaccineId,
      fee: values.fee,
      offsets: values.offsets,
      currentBatchId: props.defaultBatchIdEnabled
        ? values.currentBatchId
        : undefined,
    };
    const reaction = {
      onSuccess: () => {
        props.onClose(true);
      },
    };
    if (props.vaccine) {
      await updateVaccine.mutateAsync(
        {
          id: props.vaccine.id,
          values: request,
        },
        reaction,
      );
    } else {
      await createVaccine.mutateAsync(request, reaction);
    }
  }

  return (
    <VaccineForm
      initialValues={mapInitialVaccineFormValues(props.vaccine)}
      formRef={props.formRef}
      title={props.vaccine ? "Impfstoff bearbeiten" : "Impfstoff hinzufügen"}
      defaultBatchIdEnabled={props.defaultBatchIdEnabled}
      submitButtonLabel={props.vaccine ? "Speichern" : "Hinzufügen"}
      onSubmit={handleSubmit}
      onCancel={props.onClose}
    />
  );
}
