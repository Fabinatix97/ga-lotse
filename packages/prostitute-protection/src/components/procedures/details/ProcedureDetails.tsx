/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Stack } from "@mui/joy";
import { isDefined } from "remeda";

import {
  ContentPanel,
  DetailsItem,
  DetailsSection,
  EditButton,
  PROCEDURE_STATUS_NAMES,
  ResponsiveDivider,
} from "@eshg/lib-employee-portal";
import { DetailsColumn } from "@eshg/lib-portal";
import { ApiProcedureDetails } from "@eshg/prostitute-protection-api";

import {
  CONSULTATION_TYPE_VALUES,
  PROCEDURE_FIELD_NAME,
} from "../../../shared/constants";
import { isProcedureFinalized } from "../../../shared/helpers";

import { useEditProcedureDetailsSidebar } from "./sidebar/EditProcedureDetailsSidebar";

export function ProcedureDetails({
  procedure,
}: Readonly<{ procedure: ApiProcedureDetails }>) {
  const consultant = undefined;
  const createdBy = undefined;

  const editProcedureInfoSidebar = useEditProcedureDetailsSidebar(procedure);

  return (
    <ContentPanel>
      <DetailsSection
        title="Vorgang"
        buttons={
          !isProcedureFinalized(procedure) && (
            <EditButton
              aria-label="Vorgang bearbeiten"
              onClick={() => editProcedureInfoSidebar.open()}
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
          <DetailsColumn>
            {isDefined(procedure.consultationType) && (
              <DetailsItem
                label={PROCEDURE_FIELD_NAME.consultationType}
                value={CONSULTATION_TYPE_VALUES[procedure.consultationType]}
              />
            )}
            <DetailsItem
              label={PROCEDURE_FIELD_NAME.procedureStatus}
              value={PROCEDURE_STATUS_NAMES[procedure.procedureStatus]}
            />
          </DetailsColumn>
          {isDefined(consultant ?? createdBy) && (
            <DetailsColumn>
              {isDefined(consultant) && (
                <DetailsItem
                  label={PROCEDURE_FIELD_NAME.consultant}
                  value={consultant}
                />
              )}
              {isDefined(createdBy) && (
                <DetailsItem
                  label={PROCEDURE_FIELD_NAME.createdBy}
                  value={createdBy}
                />
              )}
            </DetailsColumn>
          )}
        </Stack>
      </DetailsSection>
    </ContentPanel>
  );
}
