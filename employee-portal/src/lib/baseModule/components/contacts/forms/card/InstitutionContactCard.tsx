/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiInstitutionContact } from "@eshg/employee-portal-api/base";
import { Stack, Typography } from "@mui/joy";
import { isNonNullish } from "remeda";

import { join } from "@/lib/shared/helpers/strings";

export function InstitutionContactCard({
  contact: element,
}: {
  contact: ApiInstitutionContact;
}) {
  return (
    <Stack>
      <Typography level={"title-md"}>{element.name}</Typography>
      {isNonNullish(element.contactAddress) && (
        <>
          <Typography>
            {element.contactAddress.type === "DomesticAddress"
              ? join(
                  [
                    element.contactAddress.street,
                    element.contactAddress.houseNumber,
                  ],
                  " ",
                )?.trim()
              : element.contactAddress.postbox}
            {", "}
            {element.contactAddress.postalCode} {element.contactAddress.city}
          </Typography>
        </>
      )}
    </Stack>
  );
}
