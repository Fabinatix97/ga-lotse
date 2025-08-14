/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import ChevronRight from "@mui/icons-material/ChevronRight";
import NoteAltOutlined from "@mui/icons-material/NoteAltOutlined";
import { Button } from "@mui/joy";

import { ApiInspection, ApiInspectionPhase } from "@eshg/inspection-api";
import { DetailsItem, useIsOffline } from "@eshg/lib-employee-portal";
import { DetailsList, InternalLink, formatDate } from "@eshg/lib-portal";

import { useInspectionResultSidebar } from "@/lib/businessModules/inspection/components/inspection/reportresult/InspectionResultSidebar";
import { inspectionHasResult } from "@/lib/businessModules/inspection/components/inspection/reportresult/reportutils";
import {
  inspectionIsBeforePhase,
  translateFollowupType,
  translateInspectionResult,
} from "@/lib/businessModules/inspection/shared/enums";
import { routes } from "@/lib/businessModules/inspection/shared/routes";
import { InfoTile } from "@/lib/shared/components/infoTile/InfoTile";

export function InspectionResultSidePanel({
  inspection,
}: Readonly<{
  inspection: ApiInspection;
}>) {
  const sidebar = useInspectionResultSidebar();
  const hasResult = inspectionHasResult(inspection);
  const followupInfo = inspection.followupInfo;
  const isOffline = useIsOffline();
  const editable =
    !isOffline &&
    inspectionIsBeforePhase(inspection.phase, ApiInspectionPhase.Closed);

  function openSidebar() {
    sidebar.open({
      procedureId: inspection.externalId,
      result: inspection.result,
      followupInfo: followupInfo,
      executedAppointment: inspection.executedAppointment!.start,
    });
  }

  return (
    <InfoTile
      name="result"
      title="Bewertung"
      footer={
        editable &&
        !hasResult && (
          <Button
            variant="outlined"
            startDecorator={<NoteAltOutlined />}
            onClick={openSidebar}
          >
            Bewertung abgeben
          </Button>
        )
      }
      onEdit={editable && hasResult ? openSidebar : undefined}
    >
      {hasResult && (
        <DetailsList>
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
        </DetailsList>
      )}
    </InfoTile>
  );
}
