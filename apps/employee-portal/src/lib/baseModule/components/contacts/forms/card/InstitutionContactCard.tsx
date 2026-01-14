/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Stack, Typography } from "@mui/joy";
import { isDefined } from "remeda";

import { ApiInstitutionContact } from "@eshg/base-api";

import { getContactAddressLine } from "@/lib/baseModule/components/contacts/helpers";

export function InstitutionContactCard({
  contact,
}: {
  contact: ApiInstitutionContact;
}) {
  return (
    <Stack sx={{ minWidth: 0 }}>
      <Typography level="title-md" noWrap>
        {contact.name}
      </Typography>
      {isDefined(contact.contactAddress) && (
        <Typography noWrap>
          {getContactAddressLine(contact.contactAddress)}
        </Typography>
      )}
    </Stack>
  );
}
