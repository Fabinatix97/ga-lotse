/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiStatisticsFeature } from "@eshg/employee-portal-api/statistics";
import {
  Delete,
  Download,
  Edit,
  OpenInFullOutlined,
} from "@mui/icons-material";
import { IconButton, Stack, Typography } from "@mui/joy";
import { useState } from "react";
import { isObjectType } from "remeda";

import {
  DiagramType,
  EvaluationDiagram,
  EvaluationDiagramBarChart,
  EvaluationDiagramChoroplethMap,
  EvaluationDiagramConfiguration,
  EvaluationDiagramHistogram,
  EvaluationDiagramLineChart,
  EvaluationDiagramPieChart,
  EvaluationDiagramScatterChart,
} from "@/lib/businessModules/statistics/api/models/statisticDetailsViewTypes";
import { useDeleteDiagram } from "@/lib/businessModules/statistics/api/mutations/useDeleteDiagram";
import { useExportDiagramData } from "@/lib/businessModules/statistics/api/mutations/useExportDiagramData";
import { useIsNewFeatureEnabled } from "@/lib/businessModules/statistics/api/queries/useStatisticsFeatureToggle";
import { EvaluationDiagramBox } from "@/lib/businessModules/statistics/components/shared/EvaluationAccordion/EvaluationDiagramBox";
import { BarChart } from "@/lib/businessModules/statistics/components/shared/charts/BarChart";
import { ChoroplethMap } from "@/lib/businessModules/statistics/components/shared/charts/ChoroplethMap";
import { ChartApi } from "@/lib/businessModules/statistics/components/shared/charts/EChart";
import { Histogram } from "@/lib/businessModules/statistics/components/shared/charts/Histogram";
import { LineChart } from "@/lib/businessModules/statistics/components/shared/charts/LineChart";
import { PieChart } from "@/lib/businessModules/statistics/components/shared/charts/PieChart";
import { ScatterChart } from "@/lib/businessModules/statistics/components/shared/charts/ScatterChart";
import { ImageType } from "@/lib/businessModules/statistics/components/shared/charts/types";
import { UpdateDiagramSidebar } from "@/lib/businessModules/statistics/components/statistics/details/UpdateDiagramSidebar/UpdateDiagramSidebar";
import { useStatisticRoleChecks } from "@/lib/businessModules/statistics/components/statistics/useStatisticRoleChecks";
import { BaseModal } from "@/lib/shared/components/BaseModal";
import { OverlayBoundary } from "@/lib/shared/components/boundaries/OverlayBoundary";
import { ActionsMenu } from "@/lib/shared/components/buttons/ActionsMenu";
import { useConfirmationDialog } from "@/lib/shared/components/confirmationDialog/ConfirmationDialogProvider";

export function EvaluationChartDiagram(props: {
  configuration: EvaluationDiagramConfiguration;
  evaluationDiagram: EvaluationDiagram;
  evaluatedDataAmountTotal: number;
  isReport: boolean;
  anonymized: boolean;
}) {
  const [eChartApi, setEChartApi] = useState<ChartApi | null>(null);
  const [isUpdateDiagramSidebarOpen, setIsUpdateDiagramSidebarOpen] =
    useState(false);
  const exportData = useExportDiagramData(props.evaluationDiagram.diagramId);
  const deleteDiagram = useDeleteDiagram(props.evaluationDiagram.diagramId);
  const { openConfirmationDialog } = useConfirmationDialog();
  const canWrite = useStatisticRoleChecks().canWrite();

  function onExportAsImage(wantedImageType: ImageType) {
    if (!eChartApi) {
      return;
    }

    eChartApi.exportAsImage(wantedImageType);
  }

  function getChart() {
    switch (props.configuration.type) {
      case DiagramType.PIE_CHART:
        return (
          <PieChart
            filterSetData={
              props.evaluationDiagram.data as EvaluationDiagramPieChart["data"]
            }
            eChartApi={setEChartApi}
          />
        );
      case DiagramType.LINE_CHART:
        return (
          <LineChart
            diagram={
              (props.evaluationDiagram as EvaluationDiagramLineChart).data
            }
            configuration={props.configuration}
            eChartApi={setEChartApi}
          />
        );
      case DiagramType.SCATTER_CHART:
        return (
          <ScatterChart
            filterSet={
              (props.evaluationDiagram as EvaluationDiagramScatterChart).data
            }
            configuration={props.configuration}
            eChartApi={setEChartApi}
          />
        );
      case DiagramType.BAR_CHART:
        return (
          <BarChart
            filterSetData={
              props.evaluationDiagram.data as EvaluationDiagramBarChart["data"]
            }
            grouping={props.configuration.grouping}
            scaling={props.configuration.scaling}
            orientation={props.configuration.orientation}
            eChartApi={setEChartApi}
          />
        );
      case DiagramType.HISTOGRAM_CHART:
        return (
          <Histogram
            diagramData={
              props.evaluationDiagram.data as EvaluationDiagramHistogram["data"]
            }
            grouping={props.configuration.grouping}
            scaling={props.configuration.scaling}
            eChartApi={setEChartApi}
          />
        );
      case DiagramType.CHOROPLETH_CHART:
        return (
          <ChoroplethMap
            diagramData={
              props.evaluationDiagram
                .data as EvaluationDiagramChoroplethMap["data"]
            }
            colorScheme={props.configuration.colorScheme}
            characteristicParameter={
              props.configuration.characteristicParameter
            }
            geoJson={
              (props.evaluationDiagram as EvaluationDiagramChoroplethMap)
                .geoJson
            }
            eChartApi={setEChartApi}
          />
        );
    }
  }

  const [openFullScreenChart, setOpenFullScreenChart] = useState(false);
  const chart = getChart();
  const exportDataFeatureToggle = useIsNewFeatureEnabled(
    ApiStatisticsFeature.FakeAnonymization,
  );
  const canExportData = props.anonymized && exportDataFeatureToggle;

  return (
    <>
      {isUpdateDiagramSidebarOpen && (
        <OverlayBoundary>
          <UpdateDiagramSidebar
            open={isUpdateDiagramSidebarOpen}
            onClose={() => setIsUpdateDiagramSidebarOpen(false)}
            diagramId={props.evaluationDiagram.diagramId}
            title={props.evaluationDiagram.title}
            description={props.evaluationDiagram.description}
          />
        </OverlayBoundary>
      )}
      <BaseModal
        open={openFullScreenChart}
        onClose={() => setOpenFullScreenChart(false)}
        modalTitle={props.evaluationDiagram.title}
        sx={{
          width: "95vw",
          height: "85vh",
          marginTop: "2.25rem",
        }}
      >
        <EvaluationDiagramBox
          description={props.evaluationDiagram.description}
          filterLabels={props.evaluationDiagram.filterLabels}
          evaluatedDataAmount={props.evaluationDiagram.evaluatedDataAmount}
          evaluatedDataAmountTotal={props.evaluatedDataAmountTotal}
          chart={chart}
        />
      </BaseModal>
      <EvaluationDiagramBox
        description={props.evaluationDiagram.description}
        filterLabels={props.evaluationDiagram.filterLabels}
        evaluatedDataAmount={props.evaluationDiagram.evaluatedDataAmount}
        evaluatedDataAmountTotal={props.evaluatedDataAmountTotal}
        chart={chart}
        header={
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            minWidth={0}
          >
            <Typography level="title-md" data-testid="evaluation-diagram-title">
              {props.evaluationDiagram.title}
            </Typography>
            <Stack direction="row" gap={1}>
              <IconButton
                aria-label="Im Vollbildmodus anzeigen"
                onClick={() => setOpenFullScreenChart(true)}
                variant="outlined"
                sx={{ background: "none" }}
                color="primary"
              >
                <OpenInFullOutlined />
              </IconButton>
              <ActionsMenu
                variant="outlined"
                sx={{ background: "none" }}
                color="primary"
                actionItems={[
                  canWrite &&
                    !props.isReport && {
                      label: "Anpassen",
                      startDecorator: <Edit />,
                      onClick: () => setIsUpdateDiagramSidebarOpen(true),
                    },
                  canExportData && {
                    label: "Als PNG exportieren",
                    startDecorator: <Download />,
                    onClick: () => onExportAsImage?.(ImageType.PNG),
                  },
                  canExportData && {
                    label: "Als SVG exportieren",
                    startDecorator: <Download />,
                    onClick: () => onExportAsImage?.(ImageType.SVG),
                  },
                  canExportData && {
                    label: "Als XLSX exportieren",
                    startDecorator: <Download />,
                    onClick: exportData,
                  },
                  canWrite &&
                    !props.isReport && {
                      label: "Löschen",
                      onClick: () =>
                        openConfirmationDialog({
                          onConfirm: deleteDiagram,
                          title: "Diagramm löschen?",
                          description: `Das Diagramm “${props.evaluationDiagram.title}” wird dann unwiderruflich gelöscht.`,
                          cancelLabel: "Abbrechen",
                          confirmLabel: "Löschen",
                          color: "danger",
                        }),
                      startDecorator: <Delete />,
                    },
                ].filter(isObjectType)}
              />
            </Stack>
          </Stack>
        }
      />
    </>
  );
}
