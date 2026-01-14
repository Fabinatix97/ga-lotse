/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Stack } from "@mui/joy";
import { isDefined } from "remeda";

import {
  ContentPanel,
  DetailsItem,
  DetailsSection,
  EditButton,
  ResponsiveDivider,
} from "@eshg/lib-employee-portal";
import { DetailsColumn, DetailsList } from "@eshg/lib-portal";
import { ApiProcedureDetails } from "@eshg/prostitute-protection-api";

import {
  ADDITIONAL_DATA_FIELD_NAME,
  CONSULTATION_TYPE_VALUES,
} from "../../../shared/constants";
import {
  formatAppointmentWithDuration,
  isProcedureFinalized,
} from "../../../shared/helpers";

import { useEditAdditionalDataSidebar } from "./sidebar/EditAdditionalDataSidebar";

export function AdditionalDataSection({
  procedure,
}: Readonly<{ procedure: ApiProcedureDetails }>) {
  const editAdditionalDataSidebar = useEditAdditionalDataSidebar(procedure);

  return (
    <ContentPanel>
      <DetailsSection
        title="Zusatzinfos"
        buttons={
          !isProcedureFinalized(procedure) && (
            <EditButton
              aria-label="Termin bearbeiten"
              onClick={() => editAdditionalDataSidebar.open()}
            />
          )
        }
      >
        <Stack
          direction={{ md: "row" }}
          gap={3}
          divider={<ResponsiveDivider breakpoint="md" />}
          width="100%"
        >
          <DetailsList>
            <DetailsColumn>
              {isDefined(procedure.consultationType) && (
                <DetailsItem
                  label={ADDITIONAL_DATA_FIELD_NAME.consultationType}
                  value={CONSULTATION_TYPE_VALUES[procedure.consultationType]}
                />
              )}
              <DetailsItem
                label={ADDITIONAL_DATA_FIELD_NAME.appointment}
                value={formatAppointmentWithDuration(
                  procedure.appointment?.start,
                  procedure.appointment?.end,
                )}
              />
            </DetailsColumn>
          </DetailsList>
        </Stack>
      </DetailsSection>
    </ContentPanel>
  );
}
