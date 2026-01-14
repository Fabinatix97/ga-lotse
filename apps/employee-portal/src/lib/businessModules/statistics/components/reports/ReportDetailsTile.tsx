/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Divider, Sheet, Stack, Typography } from "@mui/joy";
import { isNonNullish } from "remeda";

import {
  ActionsMenu,
  useHeaderHeights,
  useLayoutConfig,
} from "@eshg/lib-employee-portal";
import { formatDate } from "@eshg/lib-portal";

import { useExportReportData } from "@/lib/businessModules/statistics/api/downloads/useExportReportData";
import {
  DataSourceSensitivity,
  translateDataSourceSensitivity,
} from "@/lib/businessModules/statistics/api/models/dataSourceSensitivity";
import { ReportDataType } from "@/lib/businessModules/statistics/api/models/evaluationReports";
import { useUpdateReportSidebar } from "@/lib/businessModules/statistics/components/evaluations/details/reports/UpdateReportSidebar/UpdateReportSidebar";
import { useDeleteWithConfirmation } from "@/lib/businessModules/statistics/components/reports/useDeleteWithConfirmation";
import { getSharedURL } from "@/lib/businessModules/statistics/components/shared/getSharedURL";
import { useDataExportGuard } from "@/lib/businessModules/statistics/components/shared/hooks/useDataExportGuard";
import { useStatisticsRoleChecks } from "@/lib/businessModules/statistics/permissions/useStatisticsRoleChecks";
import { routes } from "@/lib/businessModules/statistics/shared/routes";
import { LabelValuePair } from "@/lib/shared/components/infoTile/LabelValuePair";
import { formatDateRangeNumeric } from "@/lib/shared/helpers/dateTime";
import { useCopy } from "@/lib/shared/hooks/useCopy";

import { DeleteReport, getReportActionItems } from "./getReportActionItems";

export interface ReportDetailsTileProps {
  id: string;
  seriesId: string;
  title: string;
  description?: string;
  numberInSeries?: string;
  start: Date;
  end: Date;
  createdAt: Date;
  createdBy: string;
  dataSource: string;
  datasetAmount: number;
  attributeLabels: string[];
  userId: string | undefined;
  tooMuchDataForExport: boolean;
  dataSourceSensitivity: DataSourceSensitivity;
}

export function ReportDetailsTile(props: ReportDetailsTileProps) {
  const { simpleToolbarHeight } = useLayoutConfig();
  const updateReportSidebar = useUpdateReportSidebar();
  const canWrite = useStatisticsRoleChecks().canWrite();
  const canDelete = useStatisticsRoleChecks().canDelete(props.userId);
  const { deleteReportWithConfirmation } = useDeleteWithConfirmation({
    redirectRoute: routes.reports.index,
  });

  const { download: exportData } = useExportReportData();
  const dataExportGuard = useDataExportGuard();
  const { headerHeightDesktop } = useHeaderHeights();

  function openUpdateReportSidebar() {
    updateReportSidebar.open({
      report: {
        seriesId: props.seriesId,
        name: props.title,
        description: props.description,
        type: ReportDataType.Single,
      },
    });
  }

  const copy = useCopy();

  return (
    <Stack
      gap={3}
      flex={1}
      alignSelf="start"
      alignItems="end"
      position="sticky"
      top={`calc(${headerHeightDesktop} + ${simpleToolbarHeight} + 1.5rem)`}
      role="region"
      aria-labelledby="details-label"
    >
      <Sheet sx={{ padding: 3 }} data-testid="report-details-tile">
        <Stack gap={3}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography level="h3" component="h2" id="details-label">
              Report-Details
            </Typography>
            <ActionsMenu
              actionItems={getReportActionItems(
                [
                  {
                    type: "update",
                    action: openUpdateReportSidebar,
                  },
                  {
                    type: "share",
                    action: async () =>
                      await copy(
                        getSharedURL({
                          detailLinkId: props.id,
                          statisticsSubRoute: "reports",
                        }),
                      ),
                  },
                  {
                    type: "export",
                    action: async () =>
                      dataExportGuard(props.dataSourceSensitivity, () =>
                        exportData(
                          { reportId: props.id },
                          {
                            tooMuchDataForExport: props.tooMuchDataForExport,
                          },
                        ),
                      ),
                  },
                ],
                isNonNullish(props.numberInSeries) ? "CHILD" : "SINGLE",
                {
                  deleteReportWithConfirmation: deleteReportWithConfirmation,
                  reportId: props.id,
                } satisfies DeleteReport,
                canWrite,
                canDelete,
                false,
              )}
              slotProps={{ root: { variant: "outlined", color: "primary" } }}
            />
          </Stack>
          {isNonNullish(props.description) && (
            <Stack gap={3}>
              <Typography level="body-md">{props.description}</Typography>
              <Divider />
            </Stack>
          )}
          <Stack gap={1}>
            <LabelValuePair
              label="Betrachtungszeitraum"
              value={formatDateRangeNumeric(props.start, props.end)}
            />
            <LabelValuePair
              label="Erstellungsdatum"
              value={formatDate(props.createdAt, "DE")}
            />
            {isNonNullish(props.numberInSeries) && (
              <LabelValuePair label="Ausgabe" value={props.numberInSeries} />
            )}
            <LabelValuePair
              label="Erstellt von"
              value={`${props.createdBy}${isNonNullish(props.numberInSeries) ? " (automatisiert)" : ""}`}
            />
          </Stack>
          <Divider />
          <Stack gap={1}>
            <LabelValuePair label="Datenquelle" value={props.dataSource} />
            <LabelValuePair
              label="Sensibilität"
              value={translateDataSourceSensitivity(
                props.dataSourceSensitivity,
              )}
            />
            <LabelValuePair
              label="Datensätze"
              value={props.datasetAmount.toString()}
            />
            <LabelValuePair
              label="Attribute"
              value={props.attributeLabels.join(", ")}
            />
          </Stack>
        </Stack>
      </Sheet>
    </Stack>
  );
}
