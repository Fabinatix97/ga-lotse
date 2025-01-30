/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiGdprPerson, ApiSalutation } from "@eshg/base-api";
import {
  PERSON_FIELD_NAME,
  SALUTATION_VALUES,
} from "@eshg/lib-portal/components/formFields/constants";
import { formatDate } from "@eshg/lib-portal/formatters/dateTime";
import { isNonEmptyString } from "@eshg/lib-portal/helpers/guards";
import VerifiedIcon from "@mui/icons-material/VerifiedOutlined";
import { Stack, Typography } from "@mui/joy";
import { SxProps } from "@mui/joy/styles/types";

import {
  SectionTile,
  SectionTitle,
} from "@/lib/baseModule/components/gdpr/procedure/tiles/SectionTile";
import { ResponsiveDivider } from "@/lib/shared/components/ResponsiveDivider";
import { BaseAddressDetails } from "@/lib/shared/components/address/BaseAddressDetails";
import { DetailsCell } from "@/lib/shared/components/detailsSection/DetailsCell";
import { DetailsColumn } from "@/lib/shared/components/detailsSection/DetailsColumn";
import { DetailsRow } from "@/lib/shared/components/detailsSection/DetailsRow";
import { ExternalLinkDetailsCell } from "@/lib/shared/components/detailsSection/ExternalLinkDetailsCell";

export function GdprPersonDataTile({
  identity,
  columnSx,
}: {
  identity: ApiGdprPerson;
  columnSx: SxProps;
}) {
  return (
    <SectionTile id={"procedure-identity-details"}>
      <SectionTitle id={"procedure-identity-details"}>
        Antragsteller
      </SectionTitle>
      <Stack
        direction={{ xxs: "column", md: "row" }}
        gap={3}
        divider={<ResponsiveDivider />}
      >
        <DetailsColumn sx={columnSx}>
          <DetailsRow>
            {isNonEmptyString(identity.salutation) &&
              identity.salutation !== ApiSalutation.NotSpecified && (
                <DetailsCell
                  name={"salutation"}
                  label={PERSON_FIELD_NAME.salutation}
                  value={SALUTATION_VALUES[identity.salutation]}
                />
              )}
            <DetailsCell
              name={"title"}
              label={PERSON_FIELD_NAME.title}
              value={identity.title}
              avoidWrap
            />
          </DetailsRow>
          <DetailsCell
            name={"firstName"}
            label={PERSON_FIELD_NAME.firstName}
            value={identity.firstName}
          />
          <DetailsCell
            name={"lastName"}
            label={PERSON_FIELD_NAME.lastName}
            value={identity.lastName}
          />
          <DetailsCell
            name={"dateOfBirth"}
            label={PERSON_FIELD_NAME.dateOfBirth}
            value={formatDate(identity.dateOfBirth)}
          />
          {identity.bpk2 && (
            <DetailsCell
              name="bpk2"
              label="BundID"
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
              <ExternalLinkDetailsCell
                name={"emailAddress"}
                label={PERSON_FIELD_NAME.emailAddresses}
                value={identity.emailAddress}
                href={(value) => `mailto:${value}`}
              />
            )}
            <DetailsCell
              name={"phoneNumber"}
              label={PERSON_FIELD_NAME.phoneNumbers}
              value={identity.phoneNumber}
            />
          </DetailsColumn>
        )}
      </Stack>
    </SectionTile>
  );
}
