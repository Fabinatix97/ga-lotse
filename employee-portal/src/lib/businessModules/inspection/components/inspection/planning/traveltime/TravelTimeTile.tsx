/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import type {
  ApiAddFacilityFileStateRequestContactAddress,
  ApiDomesticAddress,
  ApiInspection,
  ApiInspectionTravelTime,
} from "@eshg/employee-portal-api/inspection";
import { useSnackbar } from "@eshg/lib-portal/components/snackbar/SnackbarProvider";
import { formatDateTime } from "@eshg/lib-portal/formatters/dateTime";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import CopyAllIcon from "@mui/icons-material/CopyAll";
import { Button, Grid, IconButton, Stack } from "@mui/joy";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { isNonNullish } from "remeda";

import { useInspectionGeoApi } from "@/lib/businessModules/inspection/api/clients";
import { useGetDepartment } from "@/lib/businessModules/inspection/api/queries/department";
import { getReverseGeoCode } from "@/lib/businessModules/inspection/api/queries/geo";
import { TravelTimeSidebar } from "@/lib/businessModules/inspection/components/inspection/planning/traveltime/TravelTimeSidebar";
import { DetailsCell } from "@/lib/shared/components/detailsSection/DetailsCell";
import { InfoTile } from "@/lib/shared/components/infoTile/InfoTile";
import { useIsOffline } from "@/lib/shared/hooks/useIsOffline";

const DATE_TIME_CLOCK_SUFFIX = " Uhr";

export interface TravelTimeTileProps {
  readonly?: boolean;
  inspection: ApiInspection;
  facilityAddress?: ApiAddFacilityFileStateRequestContactAddress;
}

export function TravelTimeTile({
  readonly,
  inspection,
  facilityAddress,
}: Readonly<TravelTimeTileProps>) {
  const snackbar = useSnackbar();
  const { data: department } = useGetDepartment();
  const isOffline = useIsOffline();
  const inspectionApi = useInspectionGeoApi();
  const queryClient = useQueryClient();

  async function reverseGeocode(
    address: ApiDomesticAddress,
  ): Promise<Location> {
    const { locations } = await getReverseGeoCode(
      inspectionApi,
      queryClient,
      address.country,
      address.city,
      address.postalCode,
      address.street + " " + address.houseNumber,
    );
    if (!locations?.length) {
      throw Error("Fehler beim Suchen der Koordinaten der Einrichtung!");
    }

    return {
      latitude: parseFloat(locations[0]!.latitude),
      longitude: parseFloat(locations[0]!.longitude),
    };
  }

  const {
    data: openStreetMapUrl,
    mutateAsync: computeOpenStreetMapUrl,
    isPending,
  } = useMutation({
    mutationFn: async () => {
      if (!facilityAddress) {
        throw new Error("Die Adresse der Einrichtung fehlt!");
      }
      if (facilityAddress.type !== "DomesticAddress") {
        throw new Error(
          "Die Adresse der Einrichtung ist keine Straßenadresse!",
        );
      }
      const result = await reverseGeocode(facilityAddress);
      const start: Location = {
        latitude: department.location.latitude,
        longitude: department.location.longitude,
      };
      return constructOpenStreetMapURL(start, result);
    },
    onError: (error) => {
      snackbar.error(error.message);
    },
  });

  const addressString = formatAddress(facilityAddress);

  const { startBuffer, startTime, endBuffer, endTime } = getTravelTimeParts(
    inspection.travelTime,
  );
  const [open, setOpen] = useState(false);
  const showEdit = isNonNullish(addressString) && !readonly;
  const showTravelStart = isNonNullish(
    inspection.travelTime?.startBufferInMinutes,
  );
  const showTravelEnd = isNonNullish(inspection.travelTime?.endBufferInMinutes);

  async function handleClickRoutePlanner() {
    const url = await computeOpenStreetMapUrl();
    window.open(url, "_blank", "noreferrer");
  }

  async function handleClickCopyAddress() {
    await navigator.clipboard.writeText(addressString);
    snackbar.confirmation("Die Adresse wurde in die Zwischenablage kopiert.");
  }

  return (
    <InfoTile
      name="travelTime"
      title="Fahrzeiten"
      onEdit={showEdit ? () => setOpen(true) : undefined}
      footer={
        !isOffline && (
          <Button
            onClick={handleClickRoutePlanner}
            loading={isPending}
            variant="outlined"
            endDecorator={<ArrowForwardIcon />}
            data-target={
              openStreetMapUrl ?? "https://routing.openstreetmap.de/"
            }
          >
            Routenplaner
          </Button>
        )
      }
    >
      {addressString && (
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          marginBottom={2}
        >
          {addressString}
          <IconButton
            onClick={handleClickCopyAddress}
            color="primary"
            variant="plain"
            size="sm"
            aria-label={`Copy: ${addressString}`}
          >
            <CopyAllIcon />
          </IconButton>
        </Stack>
      )}
      <TravelTimeSidebar
        open={open}
        onClose={() => setOpen(false)}
        procedureId={inspection.externalId}
        objectType={inspection.facility?.objectType}
        appointment={inspection.plannedAppointment}
        travelTime={inspection.travelTime}
      />
      <Grid container columnSpacing={2} rowSpacing={3}>
        {showTravelStart && (
          <Grid xs={6}>
            <DetailsCell
              name="startBuffer"
              label="Anfahrtszeit in Minuten"
              value={startBuffer}
            />
          </Grid>
        )}
        {showTravelStart && (
          <Grid xs={6}>
            <DetailsCell
              name="startTime"
              label="Zeitpunkt der Abfahrt"
              value={startTime}
            />
          </Grid>
        )}
        {showTravelEnd && (
          <Grid xs={6}>
            <DetailsCell
              name="endBuffer"
              label="Rückfahrzeit in Minuten"
              value={endBuffer}
            />
          </Grid>
        )}
        {showTravelEnd && (
          <Grid xs={6}>
            <DetailsCell
              name="endTime"
              label="Zeitpunkt der Rückkehr"
              value={endTime}
            />
          </Grid>
        )}
      </Grid>
    </InfoTile>
  );
}

function formatAddress(address?: ApiAddFacilityFileStateRequestContactAddress) {
  if (address?.type !== "DomesticAddress") {
    return "";
  }
  const streetPart = [address.street, address.houseNumber]
    .filter((it) => it)
    .join(" ");
  const areaPart = [address.postalCode, address.city]
    .filter((it) => it)
    .join(" ");
  return [streetPart, areaPart].filter((it) => it).join(", ");
}

interface Location {
  latitude: number;
  longitude: number;
}

function constructOpenStreetMapURL(start: Location, end: Location) {
  if (!start || !end) {
    return "https://routing.openstreetmap.de/";
  }
  const openStreetMapParams = new URLSearchParams();
  openStreetMapParams.append("loc", `${start.latitude},${start.longitude}`);
  openStreetMapParams.append("loc", `${end.latitude},${end.longitude}`);
  openStreetMapParams.append("hl", "de");
  openStreetMapParams.append("srv", "0");
  return "https://routing.openstreetmap.de/?" + openStreetMapParams.toString();
}

function getTravelTimeParts(travelTime: ApiInspectionTravelTime | undefined) {
  const startBuffer = isNonNullish(travelTime?.startBufferInMinutes)
    ? travelTime.startBufferInMinutes
    : undefined;
  const startTime = isNonNullish(travelTime?.startTime)
    ? formatDateTime(travelTime.startTime, "de") + DATE_TIME_CLOCK_SUFFIX
    : undefined;
  const endBuffer = isNonNullish(travelTime?.endBufferInMinutes)
    ? travelTime.endBufferInMinutes
    : undefined;
  const endTime = isNonNullish(travelTime?.endTime)
    ? formatDateTime(travelTime.endTime, "de") + DATE_TIME_CLOCK_SUFFIX
    : undefined;
  return { startBuffer, startTime, endBuffer, endTime };
}
