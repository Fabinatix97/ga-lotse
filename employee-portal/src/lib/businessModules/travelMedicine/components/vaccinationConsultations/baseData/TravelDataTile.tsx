/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import {
  ApiPatchVaccinationConsultationTravelDetailsRequest,
  ApiTravelType,
} from "@eshg/employee-portal-api/travelMedicine";
import { useAlertContext } from "@eshg/lib-portal/errorHandling/AlertContext";
import { formatDate } from "@eshg/lib-portal/formatters/dateTime";
import { isDateString, toUtcDate } from "@eshg/lib-portal/helpers/dateTime";
import { Stack } from "@mui/joy";
import { isEmpty } from "remeda";

import { useUpdateTravelDetails } from "@/lib/businessModules/travelMedicine/api/mutations/vaccinationConsultation";
import {
  TravelData,
  TravelDataForm,
} from "@/lib/businessModules/travelMedicine/components/vaccinationConsultations/baseData/TravelDataForm";
import { CreateProcedureValues } from "@/lib/businessModules/travelMedicine/components/vaccinationConsultations/baseData/VaccinationConsultationDetails";
import {
  TRAVEL_TIME_UNITS,
  TRAVEL_TYPES,
} from "@/lib/businessModules/travelMedicine/components/vaccinationConsultations/shared/translations";
import { DetailsCell } from "@/lib/shared/components/detailsSection/DetailsCell";
import { DetailsRow } from "@/lib/shared/components/detailsSection/DetailsRow";
import { DetailsSection } from "@/lib/shared/components/detailsSection/DetailsSection";
import { Sidebar } from "@/lib/shared/components/sidebar/Sidebar";
import { isInteger } from "@/lib/shared/helpers/guards";
import { translateCountry } from "@/lib/shared/helpers/i18n";
import { useSearchParam } from "@/lib/shared/hooks/searchParams/useSearchParam";

interface TravelDataTileProps {
  initialValues: CreateProcedureValues;
  isProcedureClosed: boolean;
}

export function TravelDataTile(procedure: Readonly<TravelDataTileProps>) {
  const [open, setOpen] = useSearchParam("edit-travel-data", "boolean");
  const alertContext = useAlertContext();

  function updateSidebar(sideBarState: boolean) {
    setOpen(sideBarState);
    resetAlertContext();
  }

  function resetAlertContext() {
    if (alertContext !== null) {
      alertContext.setAlert(null);
    }
  }

  return (
    <>
      <DetailsSection
        name="travelData"
        title="Reisedaten"
        onEdit={() => updateSidebar(true)}
        canEdit={!procedure.isProcedureClosed}
      >
        <Stack direction={{ xxs: "column", md: "row" }} gap={3}>
          <Stack sx={{ flexGrow: 1, maxWidth: "calc(100%/2)" }} gap={1}>
            <DetailsRow>
              <DetailsCell
                name="travelType"
                label="Reiseart"
                value={
                  procedure.initialValues.travelType &&
                  TRAVEL_TYPES[procedure.initialValues.travelType]
                }
              />
              {procedure.initialValues.travelType !==
                ApiTravelType.NoTravel && (
                <DetailsCell
                  name="travelDestinations"
                  label="Reiseziele"
                  value={
                    isEmpty(procedure.initialValues.travelDestinations)
                      ? "-"
                      : procedure.initialValues.travelDestinations
                          .map((cc) => translateCountry(cc))
                          .join(", ")
                  }
                />
              )}
            </DetailsRow>
          </Stack>

          <Stack sx={{ flexGrow: 1, maxWidth: "calc(100%/2)" }} gap={1}>
            {procedure.initialValues.travelType !== ApiTravelType.NoTravel ? (
              <DetailsRow>
                <DetailsCell
                  name="travelStartDate"
                  label="Reisebeginn"
                  value={
                    procedure.initialValues.travelStartDate
                      ? formatDate(
                          new Date(procedure.initialValues.travelStartDate),
                        )
                      : "-"
                  }
                />
                <DetailsCell
                  name="travelTimeAmount"
                  label="Reisedauer"
                  value={
                    procedure.initialValues.travelTimeAmount
                      ? procedure.initialValues.travelTimeAmount +
                        " " +
                        (procedure.initialValues.travelTimeUnit &&
                          TRAVEL_TIME_UNITS[
                            procedure.initialValues.travelTimeUnit
                          ])
                      : "-"
                  }
                />
              </DetailsRow>
            ) : null}
          </Stack>
        </Stack>
      </DetailsSection>
      <EditTravelDataSidebar
        procedure={procedure.initialValues}
        openState={open}
        onClose={() => updateSidebar(false)}
      />
    </>
  );
}

function EditTravelDataSidebar({
  procedure,
  openState,
  onClose,
}: Readonly<{
  procedure: CreateProcedureValues;
  openState: boolean;
  onClose: () => void;
}>) {
  const travelDetailsApi = useUpdateTravelDetails();

  async function handleSubmit(data: TravelData) {
    const isRealTravel = data.travelType !== ApiTravelType.NoTravel;
    const apiRequest = mapToApiPatchVaccinationConsultationTravelDetailsRequest(
      data,
      isRealTravel,
    );
    const request = { id: procedure.externalId, apiRequest };
    await travelDetailsApi.mutateAsync(request, { onSuccess: onClose });
  }

  return (
    <Sidebar open={openState} onClose={onClose}>
      <TravelDataForm
        title={"Reisedaten"}
        travelData={toTravelDataForm(procedure)}
        onSubmit={async (data) => await handleSubmit(data)}
        onCancel={onClose}
      />
    </Sidebar>
  );
}

function toTravelDataForm(travelData: CreateProcedureValues): TravelData {
  return {
    travelDestinations: travelData.travelDestinations,
    travelStartDate: travelData.travelStartDate,
    travelTimeAmount: travelData.travelTimeAmount,
    travelTimeUnit: travelData.travelTimeUnit,
    travelType: travelData.travelType,
  };
}

function mapToApiPatchVaccinationConsultationTravelDetailsRequest(
  travelData: TravelData,
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
