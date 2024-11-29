/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiLocationSelectionMode } from "@eshg/employee-portal-api/schoolEntry";
import {
  formatDate,
  formatDateTime,
} from "@eshg/lib-portal/formatters/dateTime";
import { Divider, Stack } from "@mui/joy";
import { isDefined } from "remeda";

import { ProcedureDetails } from "@/lib/businessModules/schoolEntry/api/models/ProcedureDetails";
import { useGetLocationSelectionMode } from "@/lib/businessModules/schoolEntry/api/queries/configApi";
import { LabelChip } from "@/lib/businessModules/schoolEntry/features/labels/LabelChip";
import { InvitationDetails } from "@/lib/businessModules/schoolEntry/features/procedures/procedureDetails/InvitationDetails";
import { useUpdateProcedureSidebar } from "@/lib/businessModules/schoolEntry/features/procedures/procedureDetails/UpdateProcedureSidebar";
import { PROCEDURE_TYPES } from "@/lib/businessModules/schoolEntry/features/procedures/translations";
import { ContentPanel } from "@/lib/shared/components/contentPanel/ContentPanel";
import { DetailsCell } from "@/lib/shared/components/detailsSection/DetailsCell";
import { DetailsSection } from "@/lib/shared/components/detailsSection/DetailsSection";
import { formatSchoolYear } from "@/lib/shared/helpers/formatters";

interface ProcedureDetailsProps {
  procedure: ProcedureDetails;
}

export function ProcedureDetailsSection(props: ProcedureDetailsProps) {
  const locationSelectionMode = useGetLocationSelectionMode();
  const updateProcedureSidebar = useUpdateProcedureSidebar();

  return (
    <>
      <ContentPanel testId="child-details-panel">
        <DetailsSection
          name="additional-infos"
          title="Zusatzinfos"
          onEdit={() =>
            updateProcedureSidebar.open({
              procedure: props.procedure,
              locationSelectionMode,
            })
          }
          canEdit={!props.procedure.isClosed}
        >
          <Stack gap={2} divider={<Divider />}>
            <Stack gap={1}>
              <DetailsCell
                name="type"
                label="Art"
                value={PROCEDURE_TYPES[props.procedure.type]}
              />
              <DetailsCell
                name="schoolYear"
                label="Schuljahr"
                value={
                  isDefined(props.procedure.schoolYear)
                    ? formatSchoolYear(props.procedure.schoolYear)
                    : "Kein Schuljahr zugewiesen"
                }
              />
              {props.procedure.labels.length > 0 && (
                <DetailsCell
                  name="labels"
                  label="Kennungen"
                  value={
                    <Stack direction="row" gap={1} flexWrap="wrap">
                      {props.procedure.labels.map((label) => (
                        <LabelChip key={label.id} label={label} />
                      ))}
                    </Stack>
                  }
                />
              )}
            </Stack>
            <DetailsCell
              name="school"
              label="Schule"
              value={
                isDefined(props.procedure.school)
                  ? props.procedure.school.name
                  : "Keine Schule zugewiesen"
              }
            />
            {locationSelectionMode ===
              ApiLocationSelectionMode.HealthDepartment && (
              <DetailsCell
                name="location"
                label="Gesundheitsamt"
                value={
                  isDefined(props.procedure.location)
                    ? props.procedure.location.name
                    : "Kein Gesundheitsamt zugewiesen"
                }
              />
            )}
            <Stack gap={1}>
              <DetailsCell
                name="appointment"
                label="Termin"
                value={
                  props.procedure.appointment
                    ? `${formatDateTime(props.procedure.appointment.start)} Uhr`
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
              <DetailsCell
                name="deceased"
                label="Kind verstorben"
                value={
                  props.procedure.deceased
                    ? formatDate(props.procedure.deceased)
                    : "Kein Datum angegeben"
                }
              />
            )}
          </Stack>
        </DetailsSection>
      </ContentPanel>
    </>
  );
}
