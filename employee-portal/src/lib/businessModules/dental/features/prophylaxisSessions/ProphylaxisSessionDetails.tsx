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
import { useProphylaxisSessionStore } from "@/lib/businessModules/dental/features/prophylaxisSessions/store/ProphylaxisSessionStoreProvider";
import {
  PROPHYLAXIS_TYPES,
  fluoridationDescription,
} from "@/lib/businessModules/dental/features/prophylaxisSessions/translations";
import { ContentPanel } from "@/lib/shared/components/contentPanel/ContentPanel";
import { DetailsCell } from "@/lib/shared/components/detailsSection/DetailsCell";
import { DetailsColumn } from "@/lib/shared/components/detailsSection/DetailsColumn";
import { DetailsRow } from "@/lib/shared/components/detailsSection/DetailsRow";
import { DetailsSection } from "@/lib/shared/components/detailsSection/DetailsSection";
import { displayBoolean } from "@/lib/shared/helpers/booleans";

export function ProphylaxisSessionDetails() {
  const prophylaxisSession = useProphylaxisSessionStore((state) => state);

  return (
    <Stack gap={4}>
      <ContentPanel testId="prophylaxis-session-panel">
        <DetailsSection
          title="Allgemeine Informationen"
          data-testid="prophylaxis-details"
        >
          <DetailsRow>
            <DetailsColumn>
              <DetailsCell
                label="Datum"
                value={formatDateTime(prophylaxisSession.dateAndTime)}
              />
              <DetailsCell
                label="Einrichtung"
                value={prophylaxisSession.institution.name}
              />
              <DetailsCell
                label="Gruppe"
                value={prophylaxisSession.groupName}
              />
            </DetailsColumn>
            <DetailsColumn>
              <DetailsCell
                label="Typ"
                value={PROPHYLAXIS_TYPES[prophylaxisSession.type]}
              />
              <DetailsCell
                label="Reihenuntersuchung"
                value={displayBoolean(prophylaxisSession.screening)}
              />
              <DetailsCell
                label="Teilnehmer"
                value={prophylaxisSession.participants.length}
              />
              <DetailsCell
                label="Fluoridierung"
                value={fluoridationDescription(
                  prophylaxisSession.fluoridationVarnish,
                )}
              />
            </DetailsColumn>
            <DetailsColumn>
              <DetailsCell
                label="Zahnarzt/-ärztin"
                value={
                  <PerformingPersons persons={prophylaxisSession.dentists} />
                }
              />
              <DetailsCell
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
