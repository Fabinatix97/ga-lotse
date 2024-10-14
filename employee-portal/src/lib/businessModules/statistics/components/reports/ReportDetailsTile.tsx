/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { formatDate } from "@eshg/lib-portal/formatters/dateTime";
import { Divider, Sheet, Stack, Typography } from "@mui/joy";
import { useState } from "react";
import { doNothing, isNonNullish } from "remeda";

import {
  headerHeightDesktop,
  simpleToolbarHeight,
} from "@/lib/baseModule/components/layout/sizes";
import { SeriesInfo } from "@/lib/businessModules/statistics/api/models/reportDetailsViewTypes";
import { useDeleteReportWithConfirmation } from "@/lib/businessModules/statistics/components/reports/useDeleteReportWithConfirmation";
import {
  UpdateReportSidebar,
  UpdateReportSidebarReportInfo,
} from "@/lib/businessModules/statistics/components/statistics/details/reports/UpdateReportSidebar/UpdateReportSidebar";
import { useStatisticRoleChecks } from "@/lib/businessModules/statistics/components/statistics/useStatisticRoleChecks";
import { routes } from "@/lib/businessModules/statistics/shared/routes";
import { OverlayBoundary } from "@/lib/shared/components/boundaries/OverlayBoundary";
import { ActionsMenu } from "@/lib/shared/components/buttons/ActionsMenu";
import { LabelValuePair } from "@/lib/shared/components/infoTile/LabelValuePair";
import { formatDateRangeNumeric } from "@/lib/shared/helpers/dateTime";
import { useCopy } from "@/lib/shared/hooks/useCopy";

import { getReportActionItems } from "./getReportActionItems";

export interface ReportDetailsTileProps {
  id: string;
  seriesId: string;
  title: string;
  description?: string;
  series?: SeriesInfo;
  start: Date;
  end: Date;
  createdAt: Date;
  createdBy?: string;
  dataSource: string;
  datasetAmount: number;
  attributeLabels: string[];
  userId: string;
}

export function ReportDetailsTile(props: ReportDetailsTileProps) {
  const [openUpdateReportSidebar, setOpenUpdateReportSidebar] =
    useState<UpdateReportSidebarReportInfo | null>(null);
  const canWrite = useStatisticRoleChecks().canWrite();
  const canDelete = useStatisticRoleChecks().canDelete(props.userId);
  const deleteReportWithConfirmation = useDeleteReportWithConfirmation({
    redirectRoute: routes.reports.index,
  });

  function updateReport() {
    setOpenUpdateReportSidebar({
      seriesId: props.seriesId,
      name: props.title,
      description: props.description,
    });
  }

  const copy = useCopy();

  return (
    <>
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
        {/* Uncomment in  https://cronn-gmbh.atlassian.net/browse/ISSUE-5001
      <Stack gap={2} direction={"row"}>
        {isNonNullish(props.series) && (
          <Button variant="outlined" startDecorator={<BookmarksOutlined />}>
            Serie abonnieren
          </Button>
        )}
        <Button startDecorator={<BookmarkAddOutlined />}>Report merken</Button>
      </Stack> */}
        <Sheet sx={{ padding: 3 }} data-testid="report-details-tile">
          <Stack gap={3}>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography level="h3">Report-Details</Typography>
              <ActionsMenu
                actionItems={getReportActionItems(
                  [
                    { type: "remember", action: doNothing },
                    {
                      type: "update",
                      action: updateReport,
                    },
                  ],
                  isNonNullish(props.series),
                  props.seriesId,
                  props.id,
                  copy,
                  deleteReportWithConfirmation,
                  canWrite,
                  canDelete,
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
              {isNonNullish(props.series) && (
                <LabelValuePair
                  label="Ausgabe"
                  value={`${props.series.index} von ${props.series.length}`}
                />
              )}
              {isNonNullish(props.createdBy) && (
                <LabelValuePair
                  label="Erstellt von"
                  value={`${props.createdBy}${isNonNullish(props.series) ? " (automatisiert)" : ""}`}
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
