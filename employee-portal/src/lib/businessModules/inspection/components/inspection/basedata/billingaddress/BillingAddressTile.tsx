/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiAddFacilityFileStateRequestContactAddress } from "@eshg/base-api";
import { Grid } from "@mui/joy";
import { isDefined, isNonNullish } from "remeda";

import { BaseAddressDetails } from "@/lib/shared/components/address/BaseAddressDetails";
import { InfoTile } from "@/lib/shared/components/infoTile/InfoTile";
import { InfoTileAddButton } from "@/lib/shared/components/infoTile/InfoTileAddButton";

export interface BillingAddressTileProps {
  billingAddress?: ApiAddFacilityFileStateRequestContactAddress;
  readonly?: boolean;
  onEdit: () => void;
}

export function BillingAddressTile({
  billingAddress,
  readonly,
  onEdit,
}: Readonly<BillingAddressTileProps>) {
  return (
    <InfoTile
      name="billingAddress"
      title="Abweichende Rechnungsadresse"
      onEdit={isNonNullish(billingAddress) && !readonly ? onEdit : undefined}
    >
      <Grid container direction="column" sx={{ gap: 2 }}>
        {!isNonNullish(billingAddress) && (
          <InfoTileAddButton onClick={onEdit}>Hinzufügen</InfoTileAddButton>
        )}
        {isDefined(billingAddress) && (
          <BaseAddressDetails address={billingAddress} />
        )}
      </Grid>
    </InfoTile>
  );
}
