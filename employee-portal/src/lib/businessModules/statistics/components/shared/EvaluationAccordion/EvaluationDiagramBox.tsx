/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  Delete,
  Download,
  Edit,
  OpenInFullOutlined,
} from "@mui/icons-material";
import { Box, Divider, IconButton, Stack, Typography } from "@mui/joy";
import { PropsWithChildren, useState } from "react";
import { isObjectType } from "remeda";

import { useDeleteDiagram } from "@/lib/businessModules/statistics/api/mutations/useDeleteDiagram";
import { useExportDiagramData } from "@/lib/businessModules/statistics/api/mutations/useExportDiagramData";
import { ImageType } from "@/lib/businessModules/statistics/components/shared/charts/types";
import { UpdateDiagramSidebar } from "@/lib/businessModules/statistics/components/statistics/details/UpdateDiagramSidebar/UpdateDiagramSidebar";
import { useStatisticRoleChecks } from "@/lib/businessModules/statistics/components/statistics/useStatisticRoleChecks";
import { OverlayBoundary } from "@/lib/shared/components/boundaries/OverlayBoundary";
import { ActionsMenu } from "@/lib/shared/components/buttons/ActionsMenu";
import { useConfirmationDialog } from "@/lib/shared/components/confirmationDialog/ConfirmationDialogProvider";

type EvaluationDiagramProps = PropsWithChildren<{
  diagramId: string;
  title: string;
  description: string | undefined;
  filterLabels: string[];
  evaluatedDataAmount: number;
  evaluatedDataAmountTotal: number;
  onExportAsImage?: (imageType: ImageType) => void;
  isReport: boolean;
  openChartInFullScreenDialog: () => void;
}>;

export function EvaluationDiagramBox({
  diagramId,
  title,
  description,
  filterLabels,
  evaluatedDataAmount,
  evaluatedDataAmountTotal,
  onExportAsImage,
  isReport,
  children,
  openChartInFullScreenDialog,
}: EvaluationDiagramProps) {
  const [isUpdateDiagramSidebarOpen, setIsUpdateDiagramSidebarOpen] =
    useState(false);
  const exportData = useExportDiagramData(diagramId);
  const deleteDiagram = useDeleteDiagram(diagramId);
  const { openConfirmationDialog } = useConfirmationDialog();
  const canWrite = useStatisticRoleChecks().canWrite();

  return (
    <>
      {isUpdateDiagramSidebarOpen && (
        <OverlayBoundary>
          <UpdateDiagramSidebar
            open={isUpdateDiagramSidebarOpen}
            onClose={() => setIsUpdateDiagramSidebarOpen(false)}
            diagramId={diagramId}
            title={title}
            description={description}
          />
        </OverlayBoundary>
      )}
      <Box
        flex="1"
        display="flex"
        minWidth={0}
        data-testid="evaluation-diagram"
        sx={{
          minHeight: "31rem",
          borderRadius: "sm",
          padding: 2,
          backgroundColor: "background.level1",
        }}
      >
        <Stack flex="1" minWidth={0}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            minWidth={0}
          >
            <Typography level="title-md" data-testid="evaluation-diagram-title">
              {title}
            </Typography>
            <Stack direction="row" gap={1}>
              <IconButton
                aria-label="Im Vollbildmodus anzeigen"
                onClick={() => openChartInFullScreenDialog()}
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
                    !isReport && {
                      label: "Anpassen",
                      startDecorator: <Edit />,
                      onClick: () => setIsUpdateDiagramSidebarOpen(true),
                    },
                  {
                    label: "Als PNG exportieren",
                    startDecorator: <Download />,
                    onClick: () => onExportAsImage?.(ImageType.PNG),
                  },
                  {
                    label: "Als SVG exportieren",
                    startDecorator: <Download />,
                    onClick: () => onExportAsImage?.(ImageType.SVG),
                  },
                  {
                    label: "Als XLSX exportieren",
                    startDecorator: <Download />,
                    onClick: exportData,
                  },
                  canWrite &&
                    !isReport && {
                      label: "Löschen",
                      onClick: () =>
                        openConfirmationDialog({
                          onConfirm: deleteDiagram,
                          title: "Diagramm löschen?",
                          description: `Das Diagramm “${title}” wird dann unwiderruflich gelöscht.`,
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
          <Stack flex="1" minWidth={0}>
            {children}
          </Stack>
          <Stack gap={2} marginTop={2}>
            <Divider />
            <Typography
              level="body-md"
              data-testid="evaluation-diagram-description"
            >
              {description}
            </Typography>
            <Stack gap={0.5}>
              <Typography
                level="body-xs"
                textColor="text.secondary"
                data-testid="evaluation-diagram-filter"
              >
                Filter: {filterLabels.join(" | ")}
              </Typography>
              <Typography
                level="body-xs"
                textColor="text.secondary"
                data-testid="evaluation-diagram-evaluated-data"
              >
                {`Ausgewertete Daten: ${evaluatedDataAmount} von ${evaluatedDataAmountTotal}`}
              </Typography>
            </Stack>
          </Stack>
        </Stack>
      </Box>
    </>
  );
}
