/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiInspFacility } from "@eshg/inspection-api";
import { DetailsItem } from "@eshg/lib-employee-portal";

import { CentralFileFacilityDetails } from "@/lib/shared/components/centralFile/display/CentralFileFacilityDetails";
import { InfoTile } from "@/lib/shared/components/infoTile/InfoTile";

interface FacilityTileProps {
  facility: ApiInspFacility;
  readonly?: boolean;
  onEdit?: () => void;
}

export function FacilityTile({
  facility,
  readonly,
  onEdit,
}: Readonly<FacilityTileProps>) {
  return (
    <InfoTile
      name="facility"
      title="Einrichtung"
      onEdit={!readonly ? onEdit : undefined}
    >
      <CentralFileFacilityDetails facility={facility.baseFacility}>
        <DetailsItem label="Objekttyp" value={facility.objectType?.name} />
      </CentralFileFacilityDetails>
    </InfoTile>
  );
}
