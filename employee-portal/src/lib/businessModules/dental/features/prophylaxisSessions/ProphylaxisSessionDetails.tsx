/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { PROPHYLAXIS_TYPES } from "@eshg/dental";
import { ApiExistingUser, ApiPerformingPerson } from "@eshg/dental-api";
import {
  ContentPanel,
  DetailsColumn,
  DetailsItem,
  DetailsRow,
  DetailsSection,
} from "@eshg/lib-employee-portal";
import { formatDateTime } from "@eshg/lib-portal/formatters/dateTime";
import { formatPersonName } from "@eshg/lib-portal/formatters/person";
import { Stack, Typography } from "@mui/joy";

import { ProphylaxisSessionParticipantsTable } from "@/lib/businessModules/dental/features/prophylaxisSessions/ProphylaxisSessionParticipantsTable";
import { useUpdateProphylaxisSessionSidebar } from "@/lib/businessModules/dental/features/prophylaxisSessions/UpdateProphylaxisSessionSidebar";
import { useProphylaxisSessionStore } from "@/lib/businessModules/dental/features/prophylaxisSessions/prophylaxisSessionStore/ProphylaxisSessionStoreProvider";
import {
  DENTITION_TYPES,
  fluoridationDescription,
} from "@/lib/businessModules/dental/features/prophylaxisSessions/translations";
import { displayBoolean } from "@/lib/shared/helpers/booleans";

export function ProphylaxisSessionDetails() {
  const prophylaxisSession = useProphylaxisSessionStore((state) => state);
  const updateProphylaxisSidebar = useUpdateProphylaxisSessionSidebar();
  const detentionType = prophylaxisSession.dentitionType
    ? DENTITION_TYPES[prophylaxisSession.dentitionType]
    : "";

  return (
    <Stack gap={4}>
      <ContentPanel testId="prophylaxis-session-panel">
        <DetailsSection
          title="Allgemeine Informationen"
          onEdit={() =>
            updateProphylaxisSidebar.open({
              prophylaxisSession: prophylaxisSession,
            })
          }
          data-testid="prophylaxis-details"
        >
          <DetailsRow>
            <DetailsColumn>
              <DetailsItem
                label="Datum"
                value={formatDateTime(prophylaxisSession.dateAndTime)}
              />
              <DetailsItem
                label="Einrichtung"
                value={prophylaxisSession.institution.name}
              />
              <Stack direction="row" gap={3}>
                <DetailsItem
                  label="Gruppe"
                  value={prophylaxisSession.groupName}
                />
                <DetailsItem
                  label="Teilnehmer"
                  value={prophylaxisSession.participants.length}
                />
              </Stack>
            </DetailsColumn>
            <DetailsColumn>
              <DetailsItem
                label="Typ"
                value={PROPHYLAXIS_TYPES[prophylaxisSession.type]}
              />
              <DetailsItem
                label="Reihenuntersuchung"
                value={displayBoolean(prophylaxisSession.isScreening)}
              />
              <DetailsItem label="Gebisstyp" value={detentionType} />
              <DetailsItem
                label="Fluoridierung"
                value={fluoridationDescription(
                  prophylaxisSession.fluoridationVarnish,
                )}
              />
            </DetailsColumn>
            <DetailsColumn>
              <DetailsItem
                label="Zahnarzt/-ärztin"
                value={
                  <PerformingPersons persons={prophylaxisSession.dentists} />
                }
              />
              <DetailsItem
                label="ZFA"
                value={<PerformingPersons persons={prophylaxisSession.zfas} />}
              />
            </DetailsColumn>
          </DetailsRow>
        </DetailsSection>
      </ContentPanel>
      <ContentPanel>
        <ProphylaxisSessionParticipantsTable />
      </ContentPanel>
    </Stack>
  );
}

function PerformingPersons(props: { persons: ApiPerformingPerson[] }) {
  return (
    <Stack>
      {props.persons.map((person) =>
        isExistingUser(person) ? (
          <Typography key={person.id}>{formatPersonName(person)}</Typography>
        ) : (
          <Typography key={person.id} color="neutral">
            Gelöschter Nutzer
          </Typography>
        ),
      )}
    </Stack>
  );
}

function isExistingUser(
  person: ApiPerformingPerson,
): person is ApiExistingUser {
  return person.type === "ExistingUser";
}
