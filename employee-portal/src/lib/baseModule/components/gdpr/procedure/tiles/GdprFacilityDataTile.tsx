/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiGdprFacility } from "@eshg/base-api";
import { ExternalLink } from "@eshg/lib-portal/components/navigation/ExternalLink";
import { isNonEmptyString } from "@eshg/lib-portal/helpers/guards";
import VerifiedIcon from "@mui/icons-material/VerifiedOutlined";
import { Stack, Typography } from "@mui/joy";
import { SxProps } from "@mui/joy/styles/types";

import { ResponsiveDivider } from "@/lib/shared/components/ResponsiveDivider";
import { BaseAddressDetails } from "@/lib/shared/components/address/BaseAddressDetails";
import { DetailsCell } from "@/lib/shared/components/detailsSection/DetailsCell";
import { DetailsColumn } from "@/lib/shared/components/detailsSection/DetailsColumn";
import { InfoTile } from "@/lib/shared/components/infoTile/InfoTile";

export function GdprFacilityDataTile({
  identity,
  columnSx,
}: {
  identity: ApiGdprFacility;
  columnSx: SxProps;
}) {
  return (
    <InfoTile name={"procedure-identity-details"} title={"Antragsteller"}>
      <Stack
        direction={{ xxs: "column", md: "row" }}
        gap={3}
        divider={<ResponsiveDivider />}
      >
        <DetailsColumn sx={columnSx}>
          <DetailsCell name="name" label="Name" value={identity.name} />
          {identity.dataTransmitterPseudonymId && (
            <DetailsCell
              name="dataTransmitterPseudonymId"
              label="Mein Unternehmenskonto"
              value={
                <Typography
                  startDecorator={<VerifiedIcon color="success" />}
                  noWrap
                >
                  Authentifiziert
                </Typography>
              }
            />
          )}
        </DetailsColumn>

        <BaseAddressDetails address={identity.address} sx={columnSx} />

        {(isNonEmptyString(identity.emailAddress) ||
          isNonEmptyString(identity.phoneNumber)) && (
          <DetailsColumn sx={columnSx}>
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
          </DetailsColumn>
        )}
      </Stack>
    </InfoTile>
  );
}
