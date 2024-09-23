/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { SxProps } from "@mui/joy/styles/types/theme";
import { isNonNullish } from "remeda";

import { DetailsCell } from "@/lib/shared/components/detailsSection/DetailsCell";
import { DetailsColumn } from "@/lib/shared/components/detailsSection/DetailsColumn";
import { DetailsRow } from "@/lib/shared/components/detailsSection/DetailsRow";
import {
  BaseAddress,
  isDomesticAddress,
  isPostboxAddress,
} from "@/lib/shared/helpers/address";
import { translateCountry } from "@/lib/shared/helpers/i18n";

interface BaseAddressDetailsProps {
  address: BaseAddress;
  sx?: SxProps;
}

export function BaseAddressDetails({ address, sx }: BaseAddressDetailsProps) {
  return (
    <DetailsColumn sx={sx}>
      {isNonNullish(address.differentName) && (
        <DetailsCell
          label={"Abweichender Empfänger"}
          value={address.differentName}
          name={"differentName"}
        />
      )}
      {isPostboxAddress(address) && (
        <DetailsCell
          label={"Postfachnummer"}
          value={address.postbox}
          name={"postbox"}
        />
      )}
      {isDomesticAddress(address) && (
        <>
          <DetailsCell
            label={"Straße und Haus Nr."}
            value={[address.street, address.houseNumber].join(" ").trim()}
            name={"streetAndHousenumber"}
          />
          {isNonNullish(address.addressAddition) && (
            <DetailsCell
              label={"Adresszusatz"}
              value={address.addressAddition}
              name={"addressAddition"}
            />
          )}
        </>
      )}
      <DetailsRow>
        <DetailsCell
          label={"Postleitzahl"}
          value={address.postalCode}
          name={"postalCode"}
        />
        <DetailsCell
          label={"Ort"}
          value={address.city}
          name={"city"}
          avoidWrap
        />
      </DetailsRow>
      <DetailsCell
        label={"Land"}
        value={translateCountry(address.country)}
        name={"country"}
      />
    </DetailsColumn>
  );
}
