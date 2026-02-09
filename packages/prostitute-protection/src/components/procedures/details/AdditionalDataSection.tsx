/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Stack } from "@mui/joy";

import {
  ContentPanel,
  DetailsItem,
  DetailsSection,
  EditButton,
  ResponsiveDivider,
} from "@eshg/lib-employee-portal";
import {
  DetailsColumn,
  DetailsList,
  OPTIONAL_FALLBACK_VALUE,
  formatOptionalKey,
  formatPersonName,
} from "@eshg/lib-portal";
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
              <DetailsItem
                label={ADDITIONAL_DATA_FIELD_NAME.consultationType}
                value={formatOptionalKey(
                  procedure.consultationType,
                  CONSULTATION_TYPE_VALUES,
                )}
              />
              <DetailsItem
                label={ADDITIONAL_DATA_FIELD_NAME.appointment}
                value={formatAppointmentWithDuration(
                  procedure.appointment?.start,
                  procedure.appointment?.end,
                )}
              />
              <DetailsItem
                label={
                  procedure.appointmentFromAppointmentBlock
                    ? ADDITIONAL_DATA_FIELD_NAME.consultantOfAppointmentBlock
                    : ADDITIONAL_DATA_FIELD_NAME.consultant
                }
                value={formatPersonName(
                  procedure.consultant,
                  OPTIONAL_FALLBACK_VALUE,
                )}
              />
              <DetailsItem
                label={ADDITIONAL_DATA_FIELD_NAME.createdBy}
                value={formatPersonName(
                  procedure.creator,
                  OPTIONAL_FALLBACK_VALUE,
                )}
              />
            </DetailsColumn>
          </DetailsList>
        </Stack>
      </DetailsSection>
    </ContentPanel>
  );
}
