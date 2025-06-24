/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { isDefined } from "remeda";

import { ApiInspection } from "@eshg/inspection-api";
import {
  DetailsItem,
  EditButton,
  SyncBarrier,
  useSyncBarrier,
} from "@eshg/lib-employee-portal";

import { routes } from "@/lib/businessModules/inspection/shared/routes";
import { CentralFileFacilityDetails } from "@/lib/shared/components/centralFile/display/CentralFileFacilityDetails";
import { InfoTile } from "@/lib/shared/components/infoTile/InfoTile";

interface FacilityTileProps {
  inspection: ApiInspection;
  readonly?: boolean;
  onEdit?: () => void;
  getSyncRoute?: (
    procedureId: string,
    fileStateId: string,
    facilityVersion: number,
  ) => string;
}

export function FacilityTile({
  inspection,
  readonly,
  onEdit,
  getSyncRoute = routes.procedures.syncFacility,
}: Readonly<FacilityTileProps>) {
  const facilitySync = {
    fileStateId: inspection.facility.baseFacility?.id ?? "",
    version: inspection.facility.baseFacility?.referenceVersion ?? 0,
    outdated: inspection.facility.baseFacility?.outdated ?? false,
  };

  const syncRoute = getSyncRoute(
    inspection.externalId,
    facilitySync.fileStateId,
    facilitySync.version,
  );

  const { syncBarrier } = useSyncBarrier(syncRoute, facilitySync);

  return (
    <InfoTile
      name="facility"
      title="Einrichtung"
      controls={
        !readonly &&
        isDefined(onEdit) && (
          <SyncBarrier outdated={facilitySync.outdated} syncHref={syncRoute}>
            <EditButton
              aria-label="Einrichtung ändern"
              onClick={syncBarrier(onEdit)}
            />
          </SyncBarrier>
        )
      }
    >
      <CentralFileFacilityDetails facility={inspection.facility.baseFacility}>
        <DetailsItem
          label="Objekttyp"
          value={inspection.facility.objectType?.name}
        />
      </CentralFileFacilityDetails>
    </InfoTile>
  );
}
