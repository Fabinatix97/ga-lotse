/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { translateCountry } from "@eshg/lib-portal/helpers/countryOption";
import { ApiStiProtectionProcedure } from "@eshg/sti-protection-api";
import { Sheet, Stack } from "@mui/joy";

import { GENDER_VALUES } from "@/lib/businessModules/stiProtection/shared/constants";
import { createOnlyIfProcedureOpen } from "@/lib/businessModules/stiProtection/shared/helpers";
import { ResponsiveDivider } from "@/lib/shared/components/ResponsiveDivider";
import { EditButton } from "@/lib/shared/components/buttons/EditButton";
import { DetailsCell } from "@/lib/shared/components/detailsSection/DetailsCell";
import { DetailsColumn } from "@/lib/shared/components/detailsSection/DetailsColumn";
import { DetailsSection } from "@/lib/shared/components/detailsSection/DetailsSection";
import { useSearchParam } from "@/lib/shared/hooks/searchParams/useSearchParam";

import { EDIT_PERSONAL_DATA_SEARCH_PARAM } from "./EditPersonalDataSidebar";

export function PersonDetails({
  procedure,
}: Readonly<{
  procedure: ApiStiProtectionProcedure;
}>) {
  const [_isOpenEditPersonDetails, setIsOpenEditPersonDetails] = useSearchParam(
    EDIT_PERSONAL_DATA_SEARCH_PARAM,
    "boolean",
  );
  const onlyIfOpen = createOnlyIfProcedureOpen(procedure);

  return (
    <Sheet>
      <DetailsSection
        title="Person"
        buttons={onlyIfOpen(
          <EditButton
            aria-label="Person bearbeiten"
            onClick={() => setIsOpenEditPersonDetails(true)}
          />,
        )}
      >
        <Stack
          direction={{ md: "row" }}
          gap={3}
          divider={<ResponsiveDivider breakpoint="md" />}
          width="100%"
        >
          <DetailsColumn>
            <DetailsCell
              label="Geburtsjahr"
              value={procedure.person.yearOfBirth.toString()}
            />
            <DetailsCell
              label="Geschlecht"
              value={GENDER_VALUES[procedure.person.gender]}
            />
          </DetailsColumn>
          <DetailsColumn>
            <DetailsCell
              label="Geburtsland"
              value={
                procedure.person.countryOfBirth
                  ? translateCountry(procedure.person.countryOfBirth)
                  : undefined
              }
            />
            <DetailsCell
              label="In Deutschland seit"
              value={procedure.person.inGermanySince?.toString()}
            />
          </DetailsColumn>
        </Stack>
      </DetailsSection>
    </Sheet>
  );
}
