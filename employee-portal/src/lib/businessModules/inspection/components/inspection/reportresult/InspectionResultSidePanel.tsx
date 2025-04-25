/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import ChevronRight from "@mui/icons-material/ChevronRight";
import NoteAltOutlined from "@mui/icons-material/NoteAltOutlined";
import { Button } from "@mui/joy";
import { useState } from "react";

import { ApiInspection, ApiInspectionPhase } from "@eshg/inspection-api";
import { DetailsItem } from "@eshg/lib-employee-portal";
import { InternalLink } from "@eshg/lib-portal/components/navigation/InternalLink";
import { formatDate } from "@eshg/lib-portal/formatters/dateTime";

import { InspectionResultSidebar } from "@/lib/businessModules/inspection/components/inspection/reportresult/InspectionResultSidebar";
import { inspectionHasResult } from "@/lib/businessModules/inspection/components/inspection/reportresult/reportutils";
import {
  inspectionIsBeforePhase,
  translateFollowupType,
  translateInspectionResult,
} from "@/lib/businessModules/inspection/shared/enums";
import { routes } from "@/lib/businessModules/inspection/shared/routes";
import { InfoTile } from "@/lib/shared/components/infoTile/InfoTile";
import { useIsOffline } from "@/lib/shared/hooks/useIsOffline";

export function InspectionResultSidePanel({
  inspection,
}: Readonly<{
  inspection: ApiInspection;
}>) {
  const [sidebar, setSidebar] = useState<boolean>(false);
  const hasResult = inspectionHasResult(inspection);
  const followupInfo = inspection.followupInfo;
  const isOffline = useIsOffline();
  const editable =
    !isOffline &&
    inspectionIsBeforePhase(inspection.phase, ApiInspectionPhase.Closed);

  return (
    <InfoTile
      name="result"
      title="Bewertung"
      onEdit={editable && hasResult ? () => setSidebar(true) : undefined}
      footer={
        editable &&
        !hasResult && (
          <Button
            variant="outlined"
            startDecorator={<NoteAltOutlined />}
            onClick={() => setSidebar(true)}
          >
            Bewertung abgeben
          </Button>
        )
      }
    >
      {hasResult && (
        <>
          <DetailsItem
            label="Ergebnis"
            value={translateInspectionResult(inspection.result)}
          />
          {followupInfo?.followupType && (
            <>
              <DetailsItem
                label="Folgebegehung"
                value={translateFollowupType(followupInfo.followupType)}
              />
              {followupInfo.followupDate && (
                <DetailsItem
                  label="Datum der Nachprüfung"
                  value={formatDate(followupInfo.followupDate)}
                />
              )}
              {followupInfo.followupId && (
                <DetailsItem
                  label=""
                  value={
                    <InternalLink
                      href={routes.procedures.details(followupInfo.followupId)}
                      endDecorator={<ChevronRight />}
                    >
                      zum Nachfolgevorgang
                    </InternalLink>
                  }
                />
              )}
            </>
          )}
        </>
      )}

      <InspectionResultSidebar
        open={sidebar}
        onClose={() => setSidebar(false)}
        procedureId={inspection.externalId}
        result={inspection.result}
        followupInfo={followupInfo}
        executedAppointment={inspection.executedAppointment!.start}
      />
    </InfoTile>
  );
}
