/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { HiddenContainer } from "@eshg/lib-portal/components/HiddenContainer";
import { formatDate } from "@eshg/lib-portal/formatters/dateTime";
import { Divider, Sheet, Stack, Typography } from "@mui/joy";
import { useState } from "react";
import { isNonNullish } from "remeda";

import {
  headerHeightDesktop,
  simpleToolbarHeight,
} from "@/lib/baseModule/components/layout/sizes";
import { useExportReportData } from "@/lib/businessModules/statistics/api/downloads/useExportReportData";
import { ReportDataType } from "@/lib/businessModules/statistics/api/models/evaluationReports";
import {
  UpdateReportSidebar,
  UpdateReportSidebarReportInfo,
} from "@/lib/businessModules/statistics/components/evaluations/details/reports/UpdateReportSidebar/UpdateReportSidebar";
import { useStatisticsRoleChecks } from "@/lib/businessModules/statistics/components/evaluations/useStatisticsRoleChecks";
import { useDeleteWithConfirmation } from "@/lib/businessModules/statistics/components/reports/useDeleteWithConfirmation";
import { routes } from "@/lib/businessModules/statistics/shared/routes";
import { OverlayBoundary } from "@/lib/shared/components/boundaries/OverlayBoundary";
import { ActionsMenu } from "@/lib/shared/components/buttons/ActionsMenu";
import { LabelValuePair } from "@/lib/shared/components/infoTile/LabelValuePair";
import { formatDateRangeNumeric } from "@/lib/shared/helpers/dateTime";
import { useCopy } from "@/lib/shared/hooks/useCopy";

import {
  DeleteReport,
  getReportActionItems,
  getSharedURL,
} from "./getReportActionItems";

export interface ReportDetailsTileProps {
  id: string;
  seriesId: string;
  title: string;
  description?: string;
  numberInSeries?: string;
  start: Date;
  end: Date;
  createdAt: Date;
  createdBy?: string;
  dataSource: string;
  datasetAmount: number;
  attributeLabels: string[];
  userId: string;
  tooMuchDataForExport: boolean;
}

export function ReportDetailsTile(props: ReportDetailsTileProps) {
  const [openUpdateReportSidebar, setOpenUpdateReportSidebar] =
    useState<UpdateReportSidebarReportInfo | null>(null);
  const canWrite = useStatisticsRoleChecks().canWrite();
  const canDelete = useStatisticsRoleChecks().canDelete(props.userId);
  const { deleteReportWithConfirmation } = useDeleteWithConfirmation({
    redirectRoute: routes.reports.index,
  });

  const { download: exportData, downloadContainerRef } = useExportReportData();

  function updateReport() {
    setOpenUpdateReportSidebar({
      seriesId: props.seriesId,
      name: props.title,
      description: props.description,
      type: ReportDataType.Single,
    });
  }

  const copy = useCopy();

  return (
    <>
      <HiddenContainer ref={downloadContainerRef} />

      {openUpdateReportSidebar && (
        <OverlayBoundary>
          <UpdateReportSidebar
            onClose={() => setOpenUpdateReportSidebar(null)}
            report={openUpdateReportSidebar}
          />
        </OverlayBoundary>
      )}

      <Stack
        gap={3}
        flex={1}
        alignSelf="start"
        alignItems="end"
        position="sticky"
        top={`calc(${headerHeightDesktop} + ${simpleToolbarHeight} + 1.5rem)`}
      >
        <Sheet sx={{ padding: 3 }} data-testid="report-details-tile">
          <Stack gap={3}>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography level="h3" component="h2">
                Report-Details
              </Typography>
              <ActionsMenu
                actionItems={getReportActionItems(
                  [
                    {
                      type: "update",
                      action: updateReport,
                    },
                    {
                      type: "share",
                      action: async () => await copy(getSharedURL(props.id)),
                    },
                    {
                      type: "export",
                      action: () =>
                        exportData(
                          { reportId: props.id },
                          { tooMuchDataForExport: props.tooMuchDataForExport },
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
              {isNonNullish(props.createdBy) && (
                <LabelValuePair
                  label="Erstellt von"
                  value={`${props.createdBy}${isNonNullish(props.numberInSeries) ? " (automatisiert)" : ""}`}
                />
              )}
            </Stack>
            <Divider />
            <Stack gap={1}>
              <LabelValuePair label="Datenquelle" value={props.dataSource} />
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
    </>
  );
}
