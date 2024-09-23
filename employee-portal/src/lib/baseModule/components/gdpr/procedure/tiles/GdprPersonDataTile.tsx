/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiGdprPerson, ApiSalutation } from "@eshg/employee-portal-api/base";
import { ExternalLink } from "@eshg/lib-portal/components/navigation/ExternalLink";
import { formatDate } from "@eshg/lib-portal/formatters/dateTime";
import { isNonEmptyString } from "@eshg/lib-portal/helpers/guards";
import { Stack } from "@mui/joy";

import { ResponsiveDivider } from "@/lib/baseModule/components/gdpr/procedure/tiles/ResponsiveDivider";
import { BaseAddressDetails } from "@/lib/shared/components/address/BaseAddressDetails";
import { DetailsCell } from "@/lib/shared/components/detailsSection/DetailsCell";
import { DetailsRow } from "@/lib/shared/components/detailsSection/DetailsRow";
import { InfoTile } from "@/lib/shared/components/infoTile/InfoTile";
import { SALUTATION_VALUES } from "@/lib/shared/components/personSidebar/constants";

export function GdprPersonDataTile({ identity }: { identity: ApiGdprPerson }) {
  return (
    <InfoTile name={"procedure-identity-details"} title={"Antragsteller"}>
      <Stack direction={{ xxs: "column", md: "row" }} gap={3}>
        <Stack sx={{ flex: 1 }} gap={1}>
          <DetailsRow>
            {isNonEmptyString(identity.salutation) &&
              identity.salutation !== ApiSalutation.NotSpecified && (
                <DetailsCell
                  name={"salutation"}
                  label={"Anrede"}
                  value={SALUTATION_VALUES[identity.salutation]}
                />
              )}
            <DetailsCell
              name={"title"}
              label={"Titel"}
              value={identity.title}
              avoidWrap
            />
          </DetailsRow>
          <DetailsCell
            name={"firstName"}
            label={"Vorname"}
            value={identity.firstName}
          />
          <DetailsCell
            name={"lastName"}
            label={"Name"}
            value={identity.lastName}
          />
          <DetailsCell
            name={"dateOfBirth"}
            label={"Geburtsdatum"}
            value={formatDate(identity.dateOfBirth)}
          />
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
