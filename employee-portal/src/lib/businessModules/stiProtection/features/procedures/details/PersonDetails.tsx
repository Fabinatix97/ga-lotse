/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiStiProtectionProcedure } from "@eshg/employee-portal-api/stiProtection";
import { Divider, Stack } from "@mui/joy";
import { SxProps } from "@mui/joy/styles/types";

import { GENDER_VALUES } from "@/lib/businessModules/stiProtection/shared/constants";
import { COUNTRY_CODE_LABELS } from "@/lib/businessModules/stiProtection/shared/countryCodes";
import { EditButton } from "@/lib/shared/components/buttons/EditButton";
import { ContentPanel } from "@/lib/shared/components/contentPanel/ContentPanel";
import { DetailsCell } from "@/lib/shared/components/detailsSection/DetailsCell";
import { DetailsSection } from "@/lib/shared/components/detailsSection/DetailsSection";

const COLUMN_STYLE: SxProps = { flexGrow: 1, maxWidth: "calc(100%/3)" };

export function PersonDetails({
  procedure,
}: Readonly<{ procedure: ApiStiProtectionProcedure }>) {
  return (
    <ContentPanel>
      <DetailsSection
        name="person"
        title="Person"
        buttons={<EditButton aria-label="Person bearbeiten" />}
      >
        <Stack
          direction="row"
          gap={3}
          divider={<Divider orientation="vertical" />}
        >
          <Stack gap={1} sx={COLUMN_STYLE}>
            <DetailsCell name="reference" label="Aktenzeichen" value="-" />
            <DetailsCell
              name="yearOfBirth"
              label="Geburtsjahr"
              value={procedure.person.yearOfBirth}
            />
            <DetailsCell
              name="gender"
              label="Geschlecht"
              value={GENDER_VALUES[procedure.person.gender]}
            />
          </Stack>
          <Stack gap={1} sx={COLUMN_STYLE}>
            <DetailsCell
              name="countryOfBirth"
              label="Geburtsland"
              value={
                procedure.person.countryOfBirth
                  ? COUNTRY_CODE_LABELS[procedure.person.countryOfBirth]
                  : "-"
              }
            />
            <DetailsCell
              name="inGermanySince"
              label="In Deutschland seit"
              value={procedure.person.inGermanySince ?? "-"}
            />
          </Stack>
        </Stack>
      </DetailsSection>
    </ContentPanel>
  );
}
