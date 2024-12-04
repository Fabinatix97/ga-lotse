/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { formatDateTime } from "@eshg/lib-portal/formatters/dateTime";

import { ProphylaxisSessionDetails as ProphylaxisSessionDetailsType } from "@/lib/businessModules/dental/api/models/ProphylaxisSessionDetails";
import { PROPHYLAXIS_TYPES } from "@/lib/businessModules/dental/features/prophylaxisSessions/translations";
import { ContentPanel } from "@/lib/shared/components/contentPanel/ContentPanel";
import { DetailsCell } from "@/lib/shared/components/detailsSection/DetailsCell";
import { DetailsColumn } from "@/lib/shared/components/detailsSection/DetailsColumn";
import { DetailsSection } from "@/lib/shared/components/detailsSection/DetailsSection";

interface ProphylaxisSessionDetailsProps {
  prophylaxisSession: ProphylaxisSessionDetailsType;
}

export function ProphylaxisSessionDetails(
  props: ProphylaxisSessionDetailsProps,
) {
  return (
    <ContentPanel testId="prophylaxis-session-panel">
      <DetailsSection
        title="Allg. Informationen"
        data-testid="prophylaxis-details"
      >
        <DetailsColumn>
          <DetailsCell
            label="Datum"
            value={formatDateTime(props.prophylaxisSession.dateAndTime)}
          />
          <DetailsCell
            label="Einrichtung"
            value={props.prophylaxisSession.institution.name}
          />
          <DetailsCell
            label="Gruppe"
            value={props.prophylaxisSession.groupName}
          />
          <DetailsCell
            label="Typ"
            value={PROPHYLAXIS_TYPES[props.prophylaxisSession.type]}
          />
        </DetailsColumn>
      </DetailsSection>
    </ContentPanel>
  );
}
