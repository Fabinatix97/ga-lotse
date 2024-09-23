/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiGdprFacility } from "@eshg/employee-portal-api/base";
import { ExternalLink } from "@eshg/lib-portal/components/navigation/ExternalLink";
import { isNonEmptyString } from "@eshg/lib-portal/helpers/guards";
import { Stack } from "@mui/joy";

import { ResponsiveDivider } from "@/lib/baseModule/components/gdpr/procedure/tiles/ResponsiveDivider";
import { BaseAddressDetails } from "@/lib/shared/components/address/BaseAddressDetails";
import { DetailsCell } from "@/lib/shared/components/detailsSection/DetailsCell";
import { InfoTile } from "@/lib/shared/components/infoTile/InfoTile";

export function GdprFacilityDataTile({
  identity,
}: {
  identity: ApiGdprFacility;
}) {
  return (
    <InfoTile name={"procedure-identity-details"} title={"Antragsteller"}>
      <Stack direction={{ xxs: "column", md: "row" }} gap={3}>
        <Stack sx={{ flex: 1 }} gap={1}>
          <DetailsCell name={"name"} label={"Name"} value={identity.name} />
        </Stack>

        <ResponsiveDivider />

        <BaseAddressDetails address={identity.address} sx={{ flex: 1 }} />

        {(isNonEmptyString(identity.emailAddress) ||
          isNonEmptyString(identity.phoneNumber)) && (
          <>
            <ResponsiveDivider />
            <Stack sx={{ flex: 1 }} gap={1}>
              {isNonEmptyString(identity.emailAddress) && (
                <DetailsCell
                  name={"emailAddress"}
                  label={"E-Mail-Adresse"}
                  value={
                    <ExternalLink href={`mailto:${identity.emailAddress}`}>
                      {identity.emailAddress}
                    </ExternalLink>
                  }
                />
              )}
              <DetailsCell
                name={"phoneNumber"}
                label={"Telefonnummer"}
                value={identity.phoneNumber}
              />
            </Stack>
          </>
        )}
      </Stack>
    </InfoTile>
  );
}
