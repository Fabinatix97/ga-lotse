/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { formatDate } from "@eshg/lib-portal/formatters/dateTime";
import { Delete, Edit } from "@mui/icons-material";
import { Divider, Sheet, Stack, Typography } from "@mui/joy";
import { useState } from "react";
import { isNonNullish } from "remeda";

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
import { routes } from "@/lib/businessModules/statistics/shared/routes";
import { OverlayBoundary } from "@/lib/shared/components/boundaries/OverlayBoundary";
import {
  ActionsItem,
  ActionsMenu,
} from "@/lib/shared/components/buttons/ActionsMenu";
import { LabelValuePair } from "@/lib/shared/components/infoTile/LabelValuePair";
import { formatDateRangeNumeric } from "@/lib/shared/helpers/dateTime";

export interface ReportDetailsTileProps {
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
}

// Uncomment in https://cronn-gmbh.atlassian.net/browse/ISSUE-5001
function getActionItems(
  _isSeries: boolean,
  name: string,
  seriesId: string,
  description: string | undefined,
  updateReport: (report: UpdateReportSidebarReportInfo) => void,
  deleteReportWithConfirmation: (
    reportId: string,
    name: string,
    redirectRoute: string,
  ) => void,
) {
  // Uncomment in https://cronn-gmbh.atlassian.net/browse/ISSUE-5001
  // const rememberReport = {
  //   label: "Report merken",
  //   onClick: doNothing,
  //   startDecorator: <BookmarkAdd />,
  // };
  // const subscribeSeries = {
  //   label: "Serie abonnieren",
  //   onClick: doNothing,
  //   startDecorator: <Bookmarks />,
  // };
  const staticActionItems: ActionsItem[] = [
    // Uncomment in https://cronn-gmbh.atlassian.net/browse/ISSUE-5002
    // {
    //   label: "Teilen",
    //   onClick: doNothing,
    //   startDecorator: <Share />,
    // },
    {
      label: "Bearbeiten",
      onClick: () =>
        updateReport({
          seriesId: seriesId,
          name: name,
          description: description,
        }),
      startDecorator: <Edit />,
    },
    {
      label: "Report löschen",
      onClick: () =>
        deleteReportWithConfirmation(seriesId, name, routes.reports.index),
      startDecorator: <Delete />,
      color: "danger",
    },
  ];
  // Uncomment in https://cronn-gmbh.atlassian.net/browse/ISSUE-5001
  // if (isSeries) {
  //   return [rememberReport, subscribeSeries].concat(staticActionItems);
  // } else {
  //   return [rememberReport].concat(staticActionItems);
  // }
  return staticActionItems;
}

export function ReportDetailsTile(props: ReportDetailsTileProps) {
  const [openUpdateReportSidebar, setOpenUpdateReportSidebar] =
    useState<UpdateReportSidebarReportInfo | null>(null);
  const deleteReportWithConfirmation = useDeleteReportWithConfirmation();

  function updateReport(report: UpdateReportSidebarReportInfo) {
    setOpenUpdateReportSidebar({ ...report });
  }

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
                actionItems={getActionItems(
                  isNonNullish(props.series),
                  props.title,
                  props.seriesId,
                  props.description,
                  updateReport,
                  deleteReportWithConfirmation,
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
