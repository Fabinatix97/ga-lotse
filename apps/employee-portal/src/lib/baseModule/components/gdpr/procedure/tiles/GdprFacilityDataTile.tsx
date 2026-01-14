/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import VerifiedIcon from "@mui/icons-material/VerifiedOutlined";
import { Stack } from "@mui/joy";

import { ApiGdprFacility } from "@eshg/base-api";
import {
  BaseAddressDetailsColumn,
  DetailsItem,
  ExternalLinkDetailsItem,
  ResponsiveDivider,
} from "@eshg/lib-employee-portal";
import { DetailsColumn, DetailsList, isNonEmptyString } from "@eshg/lib-portal";

import { InfoTile } from "@/lib/shared/components/infoTile/InfoTile";

export function GdprFacilityDataTile({
  identity,
}: {
  identity: ApiGdprFacility;
}) {
  return (
    <DetailsList>
      <InfoTile name="procedure-identity-details" title="Antragsteller">
        <Stack
          direction={{ xxs: "column", md: "row" }}
          gap={3}
          divider={<ResponsiveDivider />}
        >
          <DetailsColumn>
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

          <BaseAddressDetailsColumn address={identity.address} />

          {(isNonEmptyString(identity.emailAddress) ||
            isNonEmptyString(identity.phoneNumber)) && (
            <DetailsColumn>
              <ExternalLinkDetailsItem
                label="E-Mail-Adresse"
                value={identity.emailAddress}
                href={(value) => `mailto:${value}`}
              />
              <DetailsItem label="Telefonnummer" value={identity.phoneNumber} />
            </DetailsColumn>
          )}
        </Stack>
      </InfoTile>
    </DetailsList>
  );
}
