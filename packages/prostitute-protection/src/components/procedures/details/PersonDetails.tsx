/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Stack } from "@mui/joy";
import { isDefined, isNullish } from "remeda";

import {
  ContentPanel,
  DetailsItem,
  DetailsSection,
  EditButton,
  ResponsiveDivider,
} from "@eshg/lib-employee-portal";
import { DetailsColumn, DetailsList, formatDate } from "@eshg/lib-portal";
import { ApiProcedureDetails } from "@eshg/prostitute-protection-api";

import {
  DOCUMENT_TYPE_VALUES,
  NATIONALITY_VALUES,
  PERSON_FIELD_NAME,
} from "../../../shared/constants";
import { formatLanguages, isProcedureFinalized } from "../../../shared/helpers";

import { useEditPersonDetailsSidebar } from "./sidebar/EditPersonDetailsSidebar";

export function PersonDetails({
  procedure,
}: Readonly<{
  procedure: ApiProcedureDetails;
}>) {
  const editPersonDetailsSidebar = useEditPersonDetailsSidebar(procedure);

  return (
    <ContentPanel>
      <DetailsSection
        title="Antragsteller"
        buttons={
          !isProcedureFinalized(procedure) && (
            <EditButton
              aria-label="Person bearbeiten"
              onClick={() => editPersonDetailsSidebar.open()}
            />
          )
        }
      >
        <DetailsList>
          <Stack
            direction={{ md: "row" }}
            gap={3}
            divider={<ResponsiveDivider breakpoint="md" />}
            width="100%"
          >
            <DetailsColumn>
              {isDefined(procedure.firstName) && (
                <DetailsItem
                  label={PERSON_FIELD_NAME.firstName}
                  value={procedure.firstName}
                />
              )}
              <DetailsItem
                label={PERSON_FIELD_NAME.lastName}
                value={procedure.lastName}
              />
              {isDefined(procedure.dateOfBirth) && (
                <DetailsItem
                  label={PERSON_FIELD_NAME.dateOfBirth}
                  value={formatDate(procedure.dateOfBirth)}
                />
              )}
              {isDefined(procedure.alias) && (
                <DetailsItem
                  label={PERSON_FIELD_NAME.alias}
                  value={procedure.alias}
                />
              )}
            </DetailsColumn>
            <DetailsColumn>
              {isDefined(procedure.languages) && (
                <DetailsItem
                  label={PERSON_FIELD_NAME.languages}
                  value={formatLanguages(procedure.languages)}
                />
              )}
              {!isNullish(procedure.nationality) && (
                <DetailsItem
                  label={PERSON_FIELD_NAME.nationality}
                  value={NATIONALITY_VALUES[procedure.nationality]}
                />
              )}
              {!isNullish(procedure.documentTypeDto) && (
                <DetailsItem
                  label={PERSON_FIELD_NAME.documentType}
                  value={DOCUMENT_TYPE_VALUES[procedure.documentTypeDto]}
                />
              )}
            </DetailsColumn>
          </Stack>
        </DetailsList>
      </DetailsSection>
    </ContentPanel>
  );
}
