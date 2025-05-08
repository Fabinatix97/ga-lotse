/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Grid } from "@mui/joy";
import { isDefined, isNonNullish } from "remeda";

import { ApiAddFacilityFileStateRequestContactAddress } from "@eshg/base-api";
import { BaseAddressDetailsColumn } from "@eshg/lib-employee-portal";

import { InfoTile } from "@/lib/shared/components/infoTile/InfoTile";
import { InfoTileAddButton } from "@/lib/shared/components/infoTile/InfoTileAddButton";

interface BillingAddressTileProps {
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
          <BaseAddressDetailsColumn address={billingAddress} />
        )}
      </Grid>
    </InfoTile>
  );
}
