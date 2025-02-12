/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiGdprFacility } from "@eshg/base-api";
import { isNonEmptyString } from "@eshg/lib-portal/helpers/guards";
import VerifiedIcon from "@mui/icons-material/VerifiedOutlined";
import { Stack } from "@mui/joy";
import { SxProps } from "@mui/joy/styles/types";

import { ResponsiveDivider } from "@/lib/shared/components/ResponsiveDivider";
import { BaseAddressDetails } from "@/lib/shared/components/address/BaseAddressDetails";
import { DetailsColumn } from "@/lib/shared/components/detailsSection/DetailsColumn";
import { DetailsItem } from "@/lib/shared/components/detailsSection/items/DetailsItem";
import { ExternalLinkDetailsItem } from "@/lib/shared/components/detailsSection/items/ExternalLinkDetailsItem";
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
          <DetailsItem label="Name" value={identity.name} />
          {identity.dataTransmitterPseudonymId && (
            <DetailsItem
              label="Mein Unternehmenskonto"
              value="Authentifiziert"
              slotProps={{
                value: {
                  startDecorator: <VerifiedIcon color="success" />,
                  noWrap: true,
                },
              }}
            />
          )}
        </DetailsColumn>

        <BaseAddressDetails address={identity.address} sx={columnSx} />

        {(isNonEmptyString(identity.emailAddress) ||
          isNonEmptyString(identity.phoneNumber)) && (
          <DetailsColumn sx={columnSx}>
            <ExternalLinkDetailsItem
              label={"E-Mail-Adresse"}
              value={identity.emailAddress}
              href={(value) => `mailto:${value}`}
            />
            <DetailsItem label={"Telefonnummer"} value={identity.phoneNumber} />
          </DetailsColumn>
        )}
      </Stack>
    </InfoTile>
  );
}
