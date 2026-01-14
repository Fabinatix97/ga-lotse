/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { Stack, Typography } from "@mui/joy";
import { SxProps } from "@mui/joy/styles/types";

import type {
  ApiAddFacilityFileStateRequestContactAddress,
  ApiGetReferencePersonResponse,
} from "@eshg/base-api";
import { formatDate, formatList, formatPersonName } from "@eshg/lib-portal";

function getAddress(
  address: ApiAddFacilityFileStateRequestContactAddress,
): string {
  if (address.type === "DomesticAddress") {
    return `Straße: ${formatList([address.street, address.houseNumber], " ")}`;
  }
  return `Postfach: ${address.postbox}`;
}

export function PersonCardContent({
  person,
  sx,
}: {
  person: ApiGetReferencePersonResponse;
  sx?: SxProps;
}) {
  const address = person.contactAddress
    ? getAddress(person.contactAddress)
    : undefined;
  return (
    <Stack gap={1} sx={sx}>
      <Typography sx={{ fontWeight: "bold" }}>
        {formatPersonName(person)}
      </Typography>
      <Typography>Geb.: {formatDate(person.dateOfBirth)}</Typography>
      {address && <Typography>{address}</Typography>}
    </Stack>
  );
}
