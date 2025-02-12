/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiExistingUser, ApiPerformingPerson } from "@eshg/dental-api";
import { formatDateTime } from "@eshg/lib-portal/formatters/dateTime";
import { formatPersonName } from "@eshg/lib-portal/formatters/person";
import { Person } from "@mui/icons-material";
import { Stack, Typography } from "@mui/joy";

import { ProphylaxisSessionParticipantsTable } from "@/lib/businessModules/dental/features/prophylaxisSessions/ProphylaxisSessionParticipantsTable";
import { useUpdateProphylaxisSessionSidebar } from "@/lib/businessModules/dental/features/prophylaxisSessions/UpdateProphylaxisSessionSidebar";
import { useProphylaxisSessionStore } from "@/lib/businessModules/dental/features/prophylaxisSessions/prophylaxisSessionStore/ProphylaxisSessionStoreProvider";
import {
  PROPHYLAXIS_TYPES,
  fluoridationDescription,
} from "@/lib/businessModules/dental/features/prophylaxisSessions/translations";
import { ContentPanel } from "@/lib/shared/components/contentPanel/ContentPanel";
import { DetailsColumn } from "@/lib/shared/components/detailsSection/DetailsColumn";
import { DetailsRow } from "@/lib/shared/components/detailsSection/DetailsRow";
import { DetailsSection } from "@/lib/shared/components/detailsSection/DetailsSection";
import { DetailsItem } from "@/lib/shared/components/detailsSection/items/DetailsItem";
import { displayBoolean } from "@/lib/shared/helpers/booleans";

export function ProphylaxisSessionDetails() {
  const prophylaxisSession = useProphylaxisSessionStore((state) => state);
  const updateProphylaxisSidebar = useUpdateProphylaxisSessionSidebar();

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
              <DetailsItem
                label="Gruppe"
                value={prophylaxisSession.groupName}
              />
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
              <DetailsItem
                label="Teilnehmer"
                value={prophylaxisSession.participants.length}
              />
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
      {props.persons.map((person, i) =>
        isExistingUser(person) ? (
          <Stack key={i} direction="row" gap={1}>
            <Person size="sm" />
            {formatPersonName(person)}
          </Stack>
        ) : (
          <Stack key={i} direction="row" gap={1}>
            <Person size="sm" color="neutral" />
            <Typography color="neutral">Gelöschter Nutzer</Typography>
          </Stack>
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
