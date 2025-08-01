/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Sheet, Stack } from "@mui/joy";

import {
  DetailsItem,
  DetailsSection,
  EditButton,
  ResponsiveDivider,
  useSearchParam,
} from "@eshg/lib-employee-portal";
import { DetailsColumn, GENDER_VALUES } from "@eshg/lib-portal";
import { ApiStiProtectionProcedure } from "@eshg/sti-protection-api";

import { createOnlyIfProcedureOpen } from "@/lib/businessModules/stiProtection/shared/helpers";
import { sufficientText } from "@/lib/businessModules/stiProtection/shared/procedure/helpers";

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
            <DetailsItem
              label="Geburtsjahr"
              value={procedure.person.yearOfBirth}
            />
            <DetailsItem
              label="Biologisches Geschlecht"
              value={GENDER_VALUES[procedure.person.gender]}
            />
            <DetailsItem label="Pronomen" value={procedure.person.pronouns} />
          </DetailsColumn>
          <DetailsColumn>
            <DetailsItem
              label="Deutschkenntnisse"
              value={sufficientText(
                procedure.person.hasSufficientGermanLanguageSkills,
              )}
            />
            <DetailsItem
              label="Weitere Sprachen"
              value={procedure.person.otherKnownLanguages}
            />
          </DetailsColumn>
        </Stack>
      </DetailsSection>
    </Sheet>
  );
}
