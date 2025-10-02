/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  Delete,
  Download,
  Edit,
  OpenInFullOutlined,
} from "@mui/icons-material";
import { Box, IconButton, Stack, Tooltip, Typography } from "@mui/joy";
import { useId, useState } from "react";
import { isNonNullish, isObjectType } from "remeda";

import { ActionsMenu, useConfirmationDialog } from "@eshg/lib-employee-portal";
import { BaseModal } from "@eshg/lib-portal";

import { DataSourceSensitivity } from "@/lib/businessModules/statistics/api/models/dataSourceSensitivity";
import {
  AnalysisDiagram,
  AnalysisDiagramBarChart,
  AnalysisDiagramChoroplethMap,
  AnalysisDiagramConfiguration,
  AnalysisDiagramHistogram,
  AnalysisDiagramLineChart,
  AnalysisDiagramPieChart,
  AnalysisDiagramScatterChart,
  DiagramType,
} from "@/lib/businessModules/statistics/api/models/evaluationDetailsViewTypes";
import { useDeleteDiagram } from "@/lib/businessModules/statistics/api/mutations/useDeleteDiagram";
import { useExportDiagramData } from "@/lib/businessModules/statistics/api/mutations/useExportDiagramData";
import { useUpdateDiagramSidebar } from "@/lib/businessModules/statistics/components/evaluations/details/UpdateDiagramSidebar/UpdateDiagramSidebar";
import { AnalysisDiagramBox } from "@/lib/businessModules/statistics/components/shared/AnalysisAccordion/AnalysisDiagramBox";
import { BarChart } from "@/lib/businessModules/statistics/components/shared/charts/BarChart";
import { ChoroplethMap } from "@/lib/businessModules/statistics/components/shared/charts/ChoroplethMap";
import { ChartApi } from "@/lib/businessModules/statistics/components/shared/charts/EChart";
import { Histogram } from "@/lib/businessModules/statistics/components/shared/charts/Histogram";
import { LineChart } from "@/lib/businessModules/statistics/components/shared/charts/LineChart";
import { PieChart } from "@/lib/businessModules/statistics/components/shared/charts/PieChart";
import { ScatterChart } from "@/lib/businessModules/statistics/components/shared/charts/ScatterChart";
import { ImageType } from "@/lib/businessModules/statistics/components/shared/charts/types";
import { useDataExportGuard } from "@/lib/businessModules/statistics/components/shared/hooks/useDataExportGuard";
import { canExportDataPermission } from "@/lib/businessModules/statistics/permissions/canExportDataPermission";
import { useStatisticsRoleChecks } from "@/lib/businessModules/statistics/permissions/useStatisticsRoleChecks";

export function AnalysisChartDiagram(props: {
  configuration: AnalysisDiagramConfiguration;
  analysisDiagram: AnalysisDiagram;
  evaluatedDataAmountTotal: number;
  isReport: boolean;
  dataSourceSensitivity: DataSourceSensitivity;
}) {
  const [eChartApi, setEChartApi] = useState<ChartApi | null>(null);
  const updateDiagramSidebar = useUpdateDiagramSidebar();
  const exportData = useExportDiagramData(props.analysisDiagram.diagramId);
  const dataExportGuard = useDataExportGuard();
  const deleteDiagram = useDeleteDiagram(props.analysisDiagram.diagramId);
  const { openConfirmationDialog } = useConfirmationDialog();
  const canWrite = useStatisticsRoleChecks().canWrite();

  function onExportAsImage(wantedImageType: ImageType) {
    if (!eChartApi) {
      return;
    }

    eChartApi.exportAsImage(wantedImageType);
  }

  function openUpdateDiagramSidebar() {
    updateDiagramSidebar.open({
      diagramId: props.analysisDiagram.diagramId,
      title: props.analysisDiagram.title,
      description: props.analysisDiagram.description,
    });
  }

  function getChart() {
    switch (props.configuration.type) {
      case DiagramType.PIE_CHART:
        return (
          <PieChart
            diagramData={
              props.analysisDiagram.data as AnalysisDiagramPieChart["data"]
            }
            eChartApi={setEChartApi}
          />
        );
      case DiagramType.LINE_CHART:
        return (
          <LineChart
            diagramData={
              (props.analysisDiagram as AnalysisDiagramLineChart).data
            }
            configuration={props.configuration}
            eChartApi={setEChartApi}
          />
        );
      case DiagramType.SCATTER_CHART:
        return (
          <ScatterChart
            diagramData={
              (props.analysisDiagram as AnalysisDiagramScatterChart).data
            }
            configuration={props.configuration}
            eChartApi={setEChartApi}
          />
        );
      case DiagramType.BAR_CHART:
        return (
          <BarChart
            diagramData={
              props.analysisDiagram.data as AnalysisDiagramBarChart["data"]
            }
            isDataGrouped={isNonNullish(props.configuration.secondaryAttribute)}
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
              props.analysisDiagram.data as AnalysisDiagramHistogram["data"]
            }
            isDataGrouped={isNonNullish(props.configuration.secondaryAttribute)}
            grouping={props.configuration.grouping}
            scaling={props.configuration.scaling}
            eChartApi={setEChartApi}
          />
        );
      case DiagramType.CHOROPLETH_CHART:
        return (
          <ChoroplethMap
            diagramData={
              props.analysisDiagram.data as AnalysisDiagramChoroplethMap["data"]
            }
            colorScheme={props.configuration.colorScheme}
            characteristicParameter={
              props.configuration.characteristicParameter
            }
            geoJson={
              (props.analysisDiagram as AnalysisDiagramChoroplethMap).geoJson
            }
            eChartApi={setEChartApi}
          />
        );
    }
  }

  const [openFullScreenChart, setOpenFullScreenChart] = useState(false);
  const canExportData = canExportDataPermission(props.dataSourceSensitivity);
  const titleId = useId();

  return (
    <Box display="contents" role="group" aria-labelledby={titleId}>
      <BaseModal
        open={openFullScreenChart}
        modalTitle={props.analysisDiagram.title}
        sx={{
          width: "95vw",
          height: "85vh",
          marginTop: "2.25rem",
        }}
        onClose={() => setOpenFullScreenChart(false)}
      >
        <AnalysisDiagramBox
          description={props.analysisDiagram.description}
          filterLabels={props.analysisDiagram.filterLabels}
          evaluatedDataAmount={props.analysisDiagram.evaluatedDataAmount}
          evaluatedDataAmountTotal={props.evaluatedDataAmountTotal}
          getChart={getChart}
        />
      </BaseModal>
      <AnalysisDiagramBox
        description={props.analysisDiagram.description}
        filterLabels={props.analysisDiagram.filterLabels}
        evaluatedDataAmount={props.analysisDiagram.evaluatedDataAmount}
        evaluatedDataAmountTotal={props.evaluatedDataAmountTotal}
        getChart={getChart}
        header={
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            minWidth={0}
          >
            <Tooltip title={props.analysisDiagram.title}>
              <Typography
                sx={{
                  height: "1.5rem",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  paddingRight: "1rem",
                }}
                level="title-md"
                id={titleId}
                data-testid="analysis-diagram-title"
              >
                {props.analysisDiagram.title}
              </Typography>
            </Tooltip>
            <Stack direction="row" gap={1}>
              <IconButton
                aria-label="Im Vollbildmodus anzeigen"
                variant="outlined"
                sx={{ background: "none" }}
                color="primary"
                onClick={() => setOpenFullScreenChart(true)}
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
                      onClick: openUpdateDiagramSidebar,
                    },
                  canExportData &&
                    props.analysisDiagram.evaluatedDataAmount > 0 && {
                      label: "Als PNG exportieren",
                      startDecorator: <Download />,
                      onClick: () => onExportAsImage?.(ImageType.PNG),
                    },
                  canExportData &&
                    props.analysisDiagram.evaluatedDataAmount > 0 && {
                      label: "Als SVG exportieren",
                      startDecorator: <Download />,
                      onClick: () => onExportAsImage?.(ImageType.SVG),
                    },
                  canExportData && {
                    label: "Als XLSX exportieren",
                    startDecorator: <Download />,
                    onClick: () =>
                      dataExportGuard(props.dataSourceSensitivity, exportData),
                  },
                  canWrite &&
                    !props.isReport && {
                      label: "Löschen",
                      onClick: () =>
                        openConfirmationDialog({
                          onConfirm: deleteDiagram,
                          title: "Diagramm löschen?",
                          description: `Das Diagramm „${props.analysisDiagram.title}” wird dann unwiderruflich gelöscht.`,
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
        onShowMoreDescription={() => setOpenFullScreenChart(true)}
      />
    </Box>
  );
}
