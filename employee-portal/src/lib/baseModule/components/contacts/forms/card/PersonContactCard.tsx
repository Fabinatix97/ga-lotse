/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiPersonContact } from "@eshg/employee-portal-api/base";
import { formatPersonName } from "@eshg/lib-portal/formatters/person";
import { Stack, Typography } from "@mui/joy";
import { isNonNullish } from "remeda";

import { getContactAddressLine } from "@/lib/baseModule/components/contacts/helpers";

export function PersonContactCard({ contact }: { contact: ApiPersonContact }) {
  return (
    <Stack sx={{ minWidth: 0 }}>
      <Typography level={"title-md"} noWrap>
        {formatPersonName({
          firstName: contact.firstName,
          lastName: contact.name,
        })}
      </Typography>
      {isNonNullish(contact.contactAddress) && (
        <Typography noWrap>
          {getContactAddressLine(contact.contactAddress)}
        </Typography>
      )}
    </Stack>
  );
}
