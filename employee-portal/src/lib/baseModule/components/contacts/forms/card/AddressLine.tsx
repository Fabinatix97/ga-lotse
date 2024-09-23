/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Typography } from "@mui/joy";

import {
  TaggedDomesticAddress,
  TaggedPostboxAddress,
} from "@/lib/shared/helpers/address";
import { join } from "@/lib/shared/helpers/strings";

type AddressLineType =
  | Pick<
      TaggedDomesticAddress,
      "type" | "street" | "houseNumber" | "postalCode" | "city"
    >
  | Pick<TaggedPostboxAddress, "type" | "postbox" | "postalCode" | "city">;

export function AddressLine(props: { address: AddressLineType }) {
  return (
    <Typography>
      {props.address.type === "DomesticAddress"
        ? join([props.address.street, props.address.houseNumber], " ")?.trim()
        : props.address.postbox}
      {", "}
      {props.address.postalCode} {props.address.city}
    </Typography>
  );
}
