/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  ApiInspection,
  ApiInspectionAvailableCLDVersionsResponse,
  ApiInspectionPhase,
} from "@eshg/employee-portal-api/inspection";
import { useWindowDimensions } from "@eshg/lib-portal/hooks/useWindowDimension";
import { Box, useTheme } from "@mui/joy";
import { useSuspenseQueries } from "@tanstack/react-query";

import { useUserApi } from "@/lib/baseModule/api/clients";
import { headerHeightDesktop } from "@/lib/baseModule/components/layout/sizes";
import { useInspectionApi } from "@/lib/businessModules/inspection/api/clients";
import {
  getAvailableCLDVsQuery,
  getInspectionQuery,
} from "@/lib/businessModules/inspection/api/queries/inspection";
import { getSelfUserQuery } from "@/lib/businessModules/inspection/api/queries/users";
import { AnnouncementTile } from "@/lib/businessModules/inspection/components/inspection/planning/announcement/AnnouncementTile";
import { AppointmentTile } from "@/lib/businessModules/inspection/components/inspection/planning/appointment/AppointmentTile";
import { ChecklistTile } from "@/lib/businessModules/inspection/components/inspection/planning/checklist/ChecklistTile";
import { InventoryTile } from "@/lib/businessModules/inspection/components/inspection/planning/inventory/InventoryTile";
import { PacklistTile } from "@/lib/businessModules/inspection/components/inspection/planning/packlist/PacklistTile";
import { ResourceTile } from "@/lib/businessModules/inspection/components/inspection/planning/resource/ResourceTile";
import { TravelTimeTile } from "@/lib/businessModules/inspection/components/inspection/planning/traveltime/TravelTimeTile";
import { inspectionIsBeforePhase } from "@/lib/businessModules/inspection/shared/enums";
import { useIsOffline } from "@/lib/shared/hooks/useIsOffline";

interface InspectionTabPlanningProps {
  inspectionId: string;
}

export function InspectionTabPlanning({
  inspectionId,
}: Readonly<InspectionTabPlanningProps>) {
  const inspectionApi = useInspectionApi();
  const userApi = useUserApi();

  const [{ data: inspection }, { data: selfUser }, { data: availableCldvs }] =
    useSuspenseQueries({
      queries: [
        getInspectionQuery(inspectionApi, inspectionId),
        getSelfUserQuery(userApi),
        getAvailableCLDVsQuery(inspectionApi, inspectionId),
      ],
    });

  const theme = useTheme();
  const { width } = useWindowDimensions();
  const isLargeLayout = width && width >= theme.breakpoints.values.lg;

  const isOffline = useIsOffline();

  // Disallow editing of appointment and checklists as soon as the execution has started
  const hasReachedExecuting = !inspectionIsBeforePhase(
    inspection.phase,
    ApiInspectionPhase.Executing,
  );

  // Disallow editing when the execution has been completed
  const hasReachedExecuted = !inspectionIsBeforePhase(
    inspection.phase,
    ApiInspectionPhase.Executed,
  );

  const lockedByDifferentUser =
    inspection.lockedByUser !== undefined &&
    selfUser.userId !== inspection.lockedByUser.userId;

  if (isLargeLayout) {
    return (
      <Box
        sx={{
          display: "grid",
          flexDirection: "column",
          gridTemplateColumns: "repeat(12, minmax(0, 1fr))",
          gap: 2,
          paddingBottom: 2,
        }}
      >
        <Box
          sx={{
            gridColumn: "span 8 / span 8",
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <Box
            sx={{
              gridColumn: "span 8 / span 8",
              display: "flex",
              flexDirection: "row",
              gap: 2,
              height: "min-content",
            }}
          >
            <TopTwinElements
              isOffline={isOffline}
              lockedByDifferentUser={lockedByDifferentUser}
              hasReachedExecuting={hasReachedExecuting}
              inspection={inspection}
              availableCldvs={availableCldvs}
            />
          </Box>
          <Box
            sx={{
              gridColumn: "span 8 / span 8",
              gap: 2,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <LeftColumnBottomElements
              isOffline={isOffline}
              lockedByDifferentUser={lockedByDifferentUser}
              hasReachedExecuted={hasReachedExecuted}
              inspection={inspection}
            />
          </Box>
        </Box>
        <Box
          sx={{
            gridColumn: "span 4 / span 4",
            gridRow: "span 2 / span 2", // allows the previous child to shrink
            gap: 2,
            display: "flex",
            flexDirection: "column",
            position: "sticky",
            top: `calc(${headerHeightDesktop} + 5.75rem + 24px)`,
            alignSelf: "flex-start", // required for stickiness
          }}
        >
          <RightColumnElements
            isOffline={isOffline}
            lockedByDifferentUser={lockedByDifferentUser}
            hasReachedExecuting={hasReachedExecuting}
            inspection={inspection}
          />
        </Box>
      </Box>
    );
  } else {
    return (
      <Box
        sx={{
          display: "grid",
          flexDirection: "column",
          gap: 2,
          paddingBottom: 2,
        }}
      >
        <TopTwinElements
          isOffline={isOffline}
          lockedByDifferentUser={lockedByDifferentUser}
          hasReachedExecuting={hasReachedExecuting}
          inspection={inspection}
          availableCldvs={availableCldvs}
        />
        <RightColumnElements
          isOffline={isOffline}
          lockedByDifferentUser={lockedByDifferentUser}
          hasReachedExecuting={hasReachedExecuting}
          inspection={inspection}
        />
        <LeftColumnBottomElements
          isOffline={isOffline}
          lockedByDifferentUser={lockedByDifferentUser}
          hasReachedExecuted={hasReachedExecuted}
          inspection={inspection}
        />
      </Box>
    );
  }
}

function TopTwinElements({
  isOffline,
  lockedByDifferentUser,
  hasReachedExecuting,
  inspection,
  availableCldvs,
}: {
  isOffline: boolean;
  lockedByDifferentUser: boolean;
  hasReachedExecuting: boolean;
  inspection: ApiInspection;
  availableCldvs: ApiInspectionAvailableCLDVersionsResponse;
}) {
  return (
    <>
      <Box sx={{ flex: 1, display: "flex" }}>
        <AppointmentTile
          readonly={isOffline || lockedByDifferentUser || hasReachedExecuting}
          inspection={inspection}
          appointment={inspection.plannedAppointment}
        />
      </Box>
      <Box sx={{ flex: 1, display: "flex" }}>
        <ChecklistTile
          readonly={isOffline || lockedByDifferentUser || hasReachedExecuting}
          inspection={inspection}
          availableCldvs={availableCldvs}
        />
      </Box>
    </>
  );
}

function LeftColumnBottomElements({
  isOffline,
  lockedByDifferentUser,
  hasReachedExecuted,
  inspection,
}: {
  isOffline: boolean;
  lockedByDifferentUser: boolean;
  hasReachedExecuted: boolean;
  inspection: ApiInspection;
}) {
  return (
    <>
      <InventoryTile
        readonly={isOffline || lockedByDifferentUser || hasReachedExecuted}
        procedureId={inspection.externalId}
        inspectionInventories={inspection.inventories}
      />
      <ResourceTile
        readonly={isOffline || lockedByDifferentUser || hasReachedExecuted}
        procedureId={inspection.externalId}
        inspectionResources={inspection.resources}
        plannedAppointment={inspection.plannedAppointment}
        standardBufferTime={inspection.facility.objectType?.standardBufferTime}
        travelTime={inspection.travelTime}
      />
    </>
  );
}

function RightColumnElements({
  isOffline,
  lockedByDifferentUser,
  hasReachedExecuting,
  inspection,
}: {
  isOffline: boolean;
  lockedByDifferentUser: boolean;
  hasReachedExecuting: boolean;
  inspection: ApiInspection;
}) {
  return (
    <>
      <AnnouncementTile
        readonly={isOffline || lockedByDifferentUser || hasReachedExecuting}
        procedureId={inspection.externalId}
        announcement={inspection.announcement}
      />
      <TravelTimeTile
        readonly={hasReachedExecuting}
        inspection={inspection}
        facilityAddress={inspection.facility.baseFacility.contactAddress}
      />
      <PacklistTile
        readonly={lockedByDifferentUser && !isOffline}
        isOffline={isOffline}
        inspection={inspection}
      />
    </>
  );
}
