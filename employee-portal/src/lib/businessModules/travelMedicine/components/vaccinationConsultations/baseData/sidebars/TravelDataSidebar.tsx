/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { isDateString, toUtcDate } from "@eshg/lib-portal/helpers/dateTime";
import {
  ApiPatchVaccinationConsultationTravelDetailsRequest,
  ApiTravelType,
} from "@eshg/travel-medicine-api";
import { isEmpty } from "remeda";

import { useUpdateTravelDetails } from "@/lib/businessModules/travelMedicine/api/mutations/vaccinationConsultation";
import { CreateProcedureValues } from "@/lib/businessModules/travelMedicine/components/vaccinationConsultations/baseData/VaccinationConsultationDetails";
import {
  TravelDataForm,
  TravelDataFormValues,
} from "@/lib/businessModules/travelMedicine/components/vaccinationConsultations/baseData/sidebars/sidebarForms/TravelDataForm";
import { isInteger } from "@/lib/shared/helpers/guards";
import {
  SidebarWithFormRefProps,
  UseSidebarWithFormRefResult,
  useSidebarWithFormRef,
} from "@/lib/shared/hooks/useSidebarWithFormRef";

export function useTravelDataSidebar(): UseSidebarWithFormRefResult<TravelDataSidebarProps> {
  return useSidebarWithFormRef({
    component: TravelDataSidebar,
  });
}

function mapInitialTravelDataValues(
  travelData: CreateProcedureValues,
): TravelDataFormValues {
  return {
    travelDestinations: travelData.travelDestinations,
    travelStartDate: travelData.travelStartDate,
    travelTimeAmount: travelData.travelTimeAmount,
    travelTimeUnit: travelData.travelTimeUnit,
    travelType: travelData.travelType,
  };
}

function mapToApiPatchVaccinationConsultationTravelDetailsRequest(
  travelData: TravelDataFormValues,
  isRealTravel: boolean,
): ApiPatchVaccinationConsultationTravelDetailsRequest {
  return {
    travelType: travelData.travelType,
    travelDestinations:
      isRealTravel && !isEmpty(travelData.travelDestinations)
        ? travelData.travelDestinations
        : [],
    travelStartDate:
      isRealTravel && isDateString(travelData.travelStartDate ?? "")
        ? toUtcDate(travelData.travelStartDate ?? "")
        : undefined,
    travelTimeAmount:
      isRealTravel && travelData.travelTimeAmount
        ? getTravelTimeAmount(travelData.travelTimeAmount)
        : undefined,
    travelTimeUnit: isRealTravel ? travelData.travelTimeUnit : undefined,
  };
}

function getTravelTimeAmount(travelTimeAmount: number): number {
  return isInteger(travelTimeAmount)
    ? travelTimeAmount
    : Number.parseInt(travelTimeAmount);
}

interface TravelDataSidebarProps extends SidebarWithFormRefProps {
  initialValues: CreateProcedureValues;
}

function TravelDataSidebar(props: Readonly<TravelDataSidebarProps>) {
  const travelDetailsApi = useUpdateTravelDetails();

  async function handleSubmit(data: TravelDataFormValues) {
    const isRealTravel = data.travelType !== ApiTravelType.NoTravel;
    const apiRequest = mapToApiPatchVaccinationConsultationTravelDetailsRequest(
      data,
      isRealTravel,
    );
    const request = { id: props.initialValues.externalId, apiRequest };
    await travelDetailsApi.mutateAsync(request, {
      onSuccess: () => props.onClose(true),
    });
  }

  return (
    <TravelDataForm
      initialValues={mapInitialTravelDataValues(props.initialValues)}
      formRef={props.formRef}
      procedureId={props.initialValues.externalId}
      title={"Reisedaten"}
      onSubmit={handleSubmit}
      onCancel={props.onClose}
    />
  );
}
