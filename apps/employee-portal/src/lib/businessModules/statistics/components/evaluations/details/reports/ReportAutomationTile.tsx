/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Button, Stack } from "@mui/joy";
import { isNonNullish } from "remeda";

import { Alert, formatDate } from "@eshg/lib-portal";

import {
  ActiveSeriesInfo,
  ReportDataType,
} from "@/lib/businessModules/statistics/api/models/evaluationReports";
import {
  INTERVAL_TRANSLATION,
  REPORTING_PERIOD_TRANSLATION,
  ReportSeriesState,
} from "@/lib/businessModules/statistics/api/models/reportSeriesTypes";
import { InfoTile } from "@/lib/shared/components/infoTile/InfoTile";
import { LabelValuePair } from "@/lib/shared/components/infoTile/LabelValuePair";

import { ReportSeriesStateChip } from "./ReportSeriesStateChip";
import { UpdateReportSidebarReportInfo } from "./UpdateReportSidebar/UpdateReportSidebar";

export function ReportAutomationTile({
  activeSeriesInfo,
  onClickAutomate,
  onClickDeactivate,
  updateReportSeries,
  canWrite,
}: {
  activeSeriesInfo?: ActiveSeriesInfo;
  onClickAutomate: () => void;
  onClickDeactivate: (seriesId: string) => void;
  updateReportSeries: (reportSeries: UpdateReportSidebarReportInfo) => void;
  canWrite: () => boolean;
}) {
  const isActiveSeries = isNonNullish(activeSeriesInfo);
  return (
    <Stack flex={0}>
      <InfoTile
        name="Automatisierung"
        title="Automatisierung"
        onEdit={
          canWrite() && isNonNullish(activeSeriesInfo)
            ? () =>
                updateReportSeries({
                  ...activeSeriesInfo,
                  type: ReportDataType.Series,
                })
            : undefined
        }
      >
        <Stack gap={5}>
          <Stack gap={3}>
            <LabelValuePair
              label="Status"
              value={
                <ReportSeriesStateChip
                  value={
                    isActiveSeries
                      ? ReportSeriesState.Activated
                      : ReportSeriesState.Deactivated
                  }
                />
              }
            />
            {isActiveSeries ? (
              <Stack gap={3}>
                <LabelValuePair
                  label="Intervall"
                  value={
                    isNonNullish(activeSeriesInfo.interval)
                      ? INTERVAL_TRANSLATION[activeSeriesInfo.interval]
                      : ""
                  }
                />
                <LabelValuePair
                  label="Betrachtungszeitraum"
                  value={
                    isNonNullish(activeSeriesInfo.reportingPeriod)
                      ? REPORTING_PERIOD_TRANSLATION[
                          activeSeriesInfo.reportingPeriod
                        ]
                      : ""
                  }
                />
                <LabelValuePair
                  label="Nächster Report am"
                  value={formatDate(activeSeriesInfo.nextReport, "DE")}
                />
              </Stack>
            ) : (
              <Alert
                message="Aktivieren Sie diese Option, um in regelmäßigen Abständen eine Report-Serie zu erstellen."
                color="primary"
              />
            )}
          </Stack>
          {canWrite() &&
            (isActiveSeries ? (
              <Button
                variant="outlined"
                onClick={() => onClickDeactivate(activeSeriesInfo.seriesId)}
              >
                Automatisierung deaktivieren
              </Button>
            ) : (
              <Button variant="outlined" onClick={onClickAutomate}>
                Report-Serie automatisieren
              </Button>
            ))}
        </Stack>
      </InfoTile>
    </Stack>
  );
}
