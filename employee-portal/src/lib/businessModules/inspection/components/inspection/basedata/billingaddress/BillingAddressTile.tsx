/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { ApiAddFacilityFileStateRequestContactAddress } from "@eshg/employee-portal-api/base";
import { Grid } from "@mui/joy";
import { isNonNullish } from "remeda";

import { DetailsCell } from "@/lib/shared/components/detailsSection/DetailsCell";
import { InfoTile } from "@/lib/shared/components/infoTile/InfoTile";
import { InfoTileAddButton } from "@/lib/shared/components/infoTile/InfoTileAddButton";

export interface BillingAddressTileProps {
  billingAddress?: ApiAddFacilityFileStateRequestContactAddress;
  readonly?: boolean;
  setOpen: (initialState: boolean) => void;
}

export function BillingAddressTile({
  billingAddress,
  readonly,
  setOpen,
}: Readonly<BillingAddressTileProps>) {
  function handleEdit() {
    setOpen(true);
  }

  function handleAddButton() {
    setOpen(true);
  }

  return (
    <InfoTile
      name="billingAddress"
      title="Abweichende Rechnungsadresse"
      onEdit={
        isNonNullish(billingAddress) && !readonly ? handleEdit : undefined
      }
    >
      <Grid container direction="column" sx={{ gap: 2 }}>
        {!isNonNullish(billingAddress) && (
          <InfoTileAddButton onClick={handleAddButton}>
            Hinzufügen
          </InfoTileAddButton>
        )}
        <DetailsCell
          name="differentName"
          label="Abweichender Name"
          value={billingAddress?.differentName}
        />
        {billingAddress?.type === "DomesticAddress" && (
          <DetailsCell
            name="address"
            label="Straße und Haus Nr."
            value={`${billingAddress.street} ${billingAddress.houseNumber}`}
          />
        )}
        {billingAddress?.type === "PostboxAddress" && (
          <DetailsCell
            name="postbox"
            label="Postbox"
            value={billingAddress.postbox}
          />
        )}
        <Grid container direction="row" sx={{ gap: 3 }}>
          <DetailsCell
            name="postalCode"
            label="Postleitzahl"
            value={billingAddress?.postalCode}
          />
          <DetailsCell name="city" label="Ort" value={billingAddress?.city} />
        </Grid>
        <DetailsCell
          name="country"
          label="Land"
          value={billingAddress?.country}
        />
      </Grid>
    </InfoTile>
  );
}
