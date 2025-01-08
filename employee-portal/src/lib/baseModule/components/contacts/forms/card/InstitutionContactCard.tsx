/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiInstitutionContact } from "@eshg/employee-portal-api/base";
import { Stack, Typography } from "@mui/joy";
import { isDefined } from "remeda";

import { getContactAddressLine } from "@/lib/baseModule/components/contacts/helpers";

export function InstitutionContactCard({
  contact,
}: {
  contact: ApiInstitutionContact;
}) {
  return (
    <Stack sx={{ minWidth: 0 }}>
      <Typography level={"title-md"} noWrap>
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
