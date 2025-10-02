/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Divider, Stack } from "@mui/joy";
import { isDefined } from "remeda";

import {
  ChipWithTooltip,
  ContentPanel,
  DetailsItem,
  DetailsSection,
  formatSchoolYear,
} from "@eshg/lib-employee-portal";
import {
  DetailsList,
  formatDate,
  formatWeekdayDateTime,
} from "@eshg/lib-portal";
import { ApiLocationSelectionMode } from "@eshg/school-entry-api";

import { ProcedureDetails } from "@/lib/businessModules/schoolEntry/api/models/ProcedureDetails";
import { useGetLocationSelectionMode } from "@/lib/businessModules/schoolEntry/api/queries/configApi";
import { InvitationDetails } from "@/lib/businessModules/schoolEntry/features/procedures/procedureDetails/InvitationDetails";
import { useUpdateProcedureSidebar } from "@/lib/businessModules/schoolEntry/features/procedures/procedureDetails/UpdateProcedureSidebar";
import {
  PROCEDURE_TYPES,
  REQUIRED_PROCEDURE_PROPERTIES,
} from "@/lib/businessModules/schoolEntry/features/procedures/translations";

interface ProcedureDetailsProps {
  procedure: ProcedureDetails;
}

export function ProcedureDetailsSection(props: ProcedureDetailsProps) {
  const locationSelectionMode = useGetLocationSelectionMode();
  const updateProcedureSidebar = useUpdateProcedureSidebar();

  return (
    <ContentPanel testId="child-details-panel">
      <DetailsSection
        data-testid="additional-infos"
        title="Zusatzinfos"
        canEdit={!props.procedure.isClosed}
        onEdit={() =>
          updateProcedureSidebar.open({
            procedure: props.procedure,
            locationSelectionMode,
          })
        }
      >
        <DetailsList>
          <Stack gap={2} divider={<Divider />}>
            <Stack gap={1}>
              <DetailsItem
                label="Art"
                value={PROCEDURE_TYPES[props.procedure.type]}
              />
              <DetailsItem
                label={REQUIRED_PROCEDURE_PROPERTIES.SCHOOL_YEAR}
                value={
                  isDefined(props.procedure.schoolYear)
                    ? formatSchoolYear(props.procedure.schoolYear)
                    : "Kein Schuljahr zugewiesen"
                }
              />
              {props.procedure.labels.length > 0 && (
                <DetailsItem
                  label="Kennungen"
                  value={
                    <Stack direction="row" gap={1} flexWrap="wrap">
                      {props.procedure.labels.map((label) => (
                        <ChipWithTooltip
                          key={label.id}
                          name={label.name}
                          hexColor={label.hexColor}
                          modalTitle="Kennung"
                        />
                      ))}
                    </Stack>
                  }
                />
              )}
            </Stack>
            <DetailsItem
              label={REQUIRED_PROCEDURE_PROPERTIES.SCHOOL_ID}
              value={
                isDefined(props.procedure.school)
                  ? props.procedure.school.name
                  : "Keine Schule zugewiesen"
              }
            />
            {locationSelectionMode ===
              ApiLocationSelectionMode.HealthDepartment && (
              <DetailsItem
                label="Gesundheitsamt"
                value={
                  isDefined(props.procedure.location)
                    ? props.procedure.location.name
                    : "Kein Gesundheitsamt zugewiesen"
                }
              />
            )}
            <Stack gap={1}>
              <DetailsItem
                label={REQUIRED_PROCEDURE_PROPERTIES.APPOINTMENT}
                value={
                  props.procedure.appointment
                    ? `${formatWeekdayDateTime(props.procedure.appointment.start)} Uhr`
                    : "Kein Termin gebucht"
                }
              />
              {isDefined(props.procedure.appointment) && (
                <InvitationDetails
                  procedureId={props.procedure.id}
                  isInvitationSend={props.procedure.isInvitationSent}
                />
              )}
            </Stack>
            {props.procedure.isDeceased && (
              <DetailsItem
                label="Kind verstorben"
                value={
                  props.procedure.deceased
                    ? formatDate(props.procedure.deceased)
                    : "Kein Datum angegeben"
                }
              />
            )}
          </Stack>
        </DetailsList>
      </DetailsSection>
    </ContentPanel>
  );
}
