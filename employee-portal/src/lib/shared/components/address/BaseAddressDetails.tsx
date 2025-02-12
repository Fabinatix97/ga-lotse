/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { translateCountry } from "@eshg/lib-portal/helpers/countryOption";
import { SxProps } from "@mui/joy/styles/types/theme";
import { isNonNullish } from "remeda";

import { DetailsColumn } from "@/lib/shared/components/detailsSection/DetailsColumn";
import { DetailsRow } from "@/lib/shared/components/detailsSection/DetailsRow";
import { DetailsItem } from "@/lib/shared/components/detailsSection/items/DetailsItem";
import {
  BaseAddress,
  isDomesticAddress,
  isPostboxAddress,
} from "@/lib/shared/helpers/address";

interface BaseAddressDetailsProps {
  address: BaseAddress;
  sx?: SxProps;
}

export function BaseAddressDetails({ address, sx }: BaseAddressDetailsProps) {
  return (
    <DetailsColumn sx={sx}>
      {isNonNullish(address.differentName) && (
        <DetailsItem
          label="Abweichender Empfänger"
          value={address.differentName}
        />
      )}
      {isPostboxAddress(address) && (
        <DetailsItem label="Postfachnummer" value={address.postbox} />
      )}
      {isDomesticAddress(address) && (
        <>
          <DetailsItem
            label="Straße und Haus Nr."
            value={[address.street, address.houseNumber].join(" ").trim()}
          />
          {isNonNullish(address.addressAddition) && (
            <DetailsItem label="Adresszusatz" value={address.addressAddition} />
          )}
        </>
      )}
      <DetailsRow>
        <DetailsItem label="Postleitzahl" value={address.postalCode} />
        <DetailsItem label="Ort" value={address.city} avoidWrap />
      </DetailsRow>
      <DetailsItem label="Land" value={translateCountry(address.country)} />
    </DetailsColumn>
  );
}
