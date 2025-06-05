/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { Stack } from "@mui/joy";
import { isEmpty } from "remeda";

import {
  DetailsItem,
  DetailsRow,
  DetailsSection,
} from "@eshg/lib-employee-portal";
import { formatDate, translateCountry } from "@eshg/lib-portal";
import { ApiTravelType } from "@eshg/travel-medicine-api";

import { CreateProcedureValues } from "@/lib/businessModules/travelMedicine/components/vaccinationConsultations/baseData/VaccinationConsultationDetails";
import { useTravelDataSidebar } from "@/lib/businessModules/travelMedicine/components/vaccinationConsultations/baseData/sidebars/TravelDataSidebar";
import {
  TRAVEL_TIME_UNITS,
  TRAVEL_TYPES,
} from "@/lib/businessModules/travelMedicine/components/vaccinationConsultations/shared/translations";

interface TravelDataTileProps {
  initialValues: CreateProcedureValues;
  isProcedureClosed: boolean;
}

export function TravelDataTile(procedure: Readonly<TravelDataTileProps>) {
  const travelDataSidebar = useTravelDataSidebar();

  return (
    <DetailsSection
      data-testid="travelData"
      title="Reisedaten"
      canEdit={!procedure.isProcedureClosed}
      onEdit={() => travelDataSidebar.open(procedure)}
    >
      <Stack direction={{ xxs: "column", md: "row" }} gap={3}>
        <Stack sx={{ flexGrow: 1, maxWidth: "calc(100%/2)" }} gap={1}>
          <DetailsRow>
            <DetailsItem
              label="Reiseart"
              value={
                procedure.initialValues.travelType &&
                TRAVEL_TYPES[procedure.initialValues.travelType]
              }
            />
            {procedure.initialValues.travelType !== ApiTravelType.NoTravel && (
              <DetailsItem
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
              <DetailsItem
                label="Reisebeginn"
                value={
                  procedure.initialValues.travelStartDate
                    ? formatDate(
                        new Date(procedure.initialValues.travelStartDate),
                      )
                    : "-"
                }
              />
              <DetailsItem
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
  );
}
