/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiInspFacility } from "@eshg/inspection-api";

import { CentralFileFacilityDetails } from "@/lib/shared/components/centralFile/display/CentralFileFacilityDetails";
import { DetailsItem } from "@/lib/shared/components/detailsSection/items/DetailsItem";
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
