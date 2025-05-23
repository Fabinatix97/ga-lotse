/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import VerifiedIcon from "@mui/icons-material/VerifiedOutlined";
import { Stack } from "@mui/joy";
import { SxProps } from "@mui/joy/styles/types";

import { ApiGdprPerson, ApiSalutation } from "@eshg/base-api";
import {
  BaseAddressDetailsColumn,
  DetailsColumn,
  DetailsItem,
  DetailsRow,
  ExternalLinkDetailsItem,
  ResponsiveDivider,
} from "@eshg/lib-employee-portal";
import {
  PERSON_FIELD_NAME,
  SALUTATION_VALUES,
  formatDate,
  isNonEmptyString,
} from "@eshg/lib-portal";

import {
  SectionTile,
  SectionTitle,
} from "@/lib/baseModule/components/gdpr/procedure/tiles/SectionTile";

export function GdprPersonDataTile({
  identity,
  columnSx,
}: {
  identity: ApiGdprPerson;
  columnSx: SxProps;
}) {
  return (
    <SectionTile id="procedure-identity-details">
      <SectionTitle id="procedure-identity-details">Antragsteller</SectionTitle>
      <Stack
        direction={{ xxs: "column", md: "row" }}
        gap={3}
        divider={<ResponsiveDivider />}
      >
        <DetailsColumn sx={columnSx}>
          <DetailsRow>
            {isNonEmptyString(identity.salutation) &&
              identity.salutation !== ApiSalutation.NotSpecified && (
                <DetailsItem
                  label={PERSON_FIELD_NAME.salutation}
                  value={SALUTATION_VALUES[identity.salutation]}
                />
              )}
            <DetailsItem
              label={PERSON_FIELD_NAME.title}
              value={identity.title}
              avoidWrap
            />
          </DetailsRow>
          <DetailsItem
            label={PERSON_FIELD_NAME.firstName}
            value={identity.firstName}
          />
          <DetailsItem
            label={PERSON_FIELD_NAME.lastName}
            value={identity.lastName}
          />
          <DetailsItem
            label={PERSON_FIELD_NAME.dateOfBirth}
            value={formatDate(identity.dateOfBirth)}
          />
          {identity.bpk2 && (
            <DetailsItem
              label="BundID"
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

        <BaseAddressDetailsColumn address={identity.address} sx={columnSx} />

        {(isNonEmptyString(identity.emailAddress) ||
          isNonEmptyString(identity.phoneNumber)) && (
          <DetailsColumn sx={columnSx}>
            <ExternalLinkDetailsItem
              label={PERSON_FIELD_NAME.emailAddresses}
              value={identity.emailAddress}
              href={(value: string) => `mailto:${value}`}
            />
            <DetailsItem
              label={PERSON_FIELD_NAME.phoneNumbers}
              value={identity.phoneNumber}
            />
          </DetailsColumn>
        )}
      </Stack>
    </SectionTile>
  );
}
