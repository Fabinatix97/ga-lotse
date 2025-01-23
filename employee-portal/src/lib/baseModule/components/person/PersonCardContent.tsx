/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import type {
  ApiAddFacilityFileStateRequestContactAddress,
  ApiGetReferencePersonResponse,
} from "@eshg/base-api";
import { formatDate } from "@eshg/lib-portal/formatters/dateTime";
import { formatPersonName } from "@eshg/lib-portal/formatters/person";
import { Stack, Typography } from "@mui/joy";
import { SxProps } from "@mui/joy/styles/types";

import { join } from "@/lib/shared/helpers/strings";

function getAddress(
  address: ApiAddFacilityFileStateRequestContactAddress,
): string {
  if (address.type === "DomesticAddress") {
    return `Straße: ${join([address.street, address.houseNumber], " ")}`;
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
