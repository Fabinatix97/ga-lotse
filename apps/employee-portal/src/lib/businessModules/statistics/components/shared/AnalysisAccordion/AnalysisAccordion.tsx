/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Delete, Edit } from "@mui/icons-material";
import { CircularProgress, Stack } from "@mui/joy";
import { Suspense, useState } from "react";

import {
  ActionsMenu,
  NoSearchResults,
  useConfirmationDialog,
} from "@eshg/lib-employee-portal";

import { DataSourceSensitivity } from "@/lib/businessModules/statistics/api/models/dataSourceSensitivity";
import { Analysis } from "@/lib/businessModules/statistics/api/models/evaluationDetailsViewTypes";
import { FlatAttribute } from "@/lib/businessModules/statistics/api/models/flatAttribute";
import { useDeleteAnalysis } from "@/lib/businessModules/statistics/api/mutations/useDeleteAnalysis";
import { useUpdateAnalysisSidebar } from "@/lib/businessModules/statistics/components/evaluations/details/UpdateAnalysisSidebar/UpdateAnalysisSidebar";
import { useStatisticsRoleChecks } from "@/lib/businessModules/statistics/permissions/useStatisticsRoleChecks";

import { AccordionSheet } from "./AccordionSheet";
import { AnalysisAccordionDetails } from "./AnalysisAccordionDetails";
import { AnalysisAccordionSummary } from "./AnalysisAccordionSummary";
import {
  AnalysisSortOrder,
  AnalysisSortOrderSelect,
  sortAnalyses,
} from "./AnalysisSortOrderSelect";
import { ToggleExpandedButton } from "./ToggleExpandedButton";

interface AnalysisAccordionProps {
  analyses: Analysis[];
  attributes: FlatAttribute[];
  evaluatedDataAmountTotal: number;
  onDiagramCreateClicked?: (analysisId: string) => void;
  isReport?: boolean;
  dataSourceSensitivity: DataSourceSensitivity;
}

export function AnalysisAccordion(props: AnalysisAccordionProps) {
  const isReport = props.isReport ?? false;
  const [sortOrder, setSortOrder] = useState<AnalysisSortOrder>(
    AnalysisSortOrder.NameAscending,
  );
  const [expandedAccordions, setExpandedAccordions] = useState<
    Record<string, boolean>
  >({});

  const sortedAnalyses = sortAnalyses(props.analyses, sortOrder);

  function handleAccordionExpand(analysisId: string, expanded: boolean) {
    setExpandedAccordions((prevExpandedAccordions) => ({
      ...prevExpandedAccordions,
      [analysisId]: expanded,
    }));
  }

  return (
    <Stack gap={3} data-testid="analysis-accordion-group">
      <Stack direction="row" justifyContent="space-between">
        <AnalysisSortOrderSelect
          sortOrder={sortOrder}
          onSortOrderChange={setSortOrder}
        />
        {!isReport && (
          <ToggleExpandedButton
            someExpanded={props.analyses.some(
              (analysis) => expandedAccordions[analysis.id] ?? false,
            )}
            onExpandAll={() => {
              props.analyses.forEach((analysis) => {
                handleAccordionExpand(analysis.id, true);
              });
            }}
            onCollapseAll={() => {
              setExpandedAccordions({});
            }}
          />
        )}
      </Stack>

      {sortedAnalyses.length === 0 && (
        <NoSearchResults info="Keine Analysen vorhanden" />
      )}

      {sortedAnalyses.map((analysis) => (
        <AnalysisAccordionItem
          key={analysis.id}
          analysis={analysis}
          expanded={expandedAccordions[analysis.id] ?? false}
          attributes={props.attributes}
          evaluatedDataAmountTotal={props.evaluatedDataAmountTotal}
          isReport={isReport}
          dataSourceSensitivity={props.dataSourceSensitivity}
          onExpand={(expanded) => {
            handleAccordionExpand(analysis.id, expanded);
          }}
          onDiagramCreateClicked={props.onDiagramCreateClicked}
        />
      ))}
    </Stack>
  );
}

interface AnalysisAccordionItemProps {
  analysis: Analysis;
  expanded: boolean;
  onExpand: (expanded: boolean) => void;
  attributes: FlatAttribute[];
  evaluatedDataAmountTotal: number;
  onDiagramCreateClicked?: (analysisId: string) => void;
  isReport: boolean;
  dataSourceSensitivity: DataSourceSensitivity;
}

function AnalysisAccordionItem(props: AnalysisAccordionItemProps) {
  const updateAnalysisSidebar = useUpdateAnalysisSidebar();
  const canWrite = useStatisticsRoleChecks().canWrite();
  const { openConfirmationDialog } = useConfirmationDialog();
  const deleteAnalysis = useDeleteAnalysis();

  function openUpdateAnalysisSidebar() {
    updateAnalysisSidebar.open({
      analysisId: props.analysis.id,
      name: props.analysis.name,
      diagramConfiguration: props.analysis.diagramConfiguration,
    });
  }

  function handleAnalysisDelete(analysisId: string, name: string) {
    openConfirmationDialog({
      onConfirm: () => deleteAnalysis(analysisId),
      title: "Analyse löschen?",
      description: `Die Analyse „${name}” und alle darin enthaltenen Diagramme werden dann unwiderruflich gelöscht.`,
      cancelLabel: "Abbrechen",
      confirmLabel: "Löschen",
      color: "danger",
    });
  }

  return (
    <AccordionSheet
      key={props.analysis.id}
      expanded={props.expanded}
      summary={<AnalysisAccordionSummary analysis={props.analysis} />}
      controls={
        canWrite &&
        !props.isReport && (
          <ActionsMenu
            actionItems={[
              {
                label: "Anpassen",
                onClick: openUpdateAnalysisSidebar,
                startDecorator: <Edit />,
              },
              {
                label: "Löschen",
                onClick: () => {
                  handleAnalysisDelete(props.analysis.id, props.analysis.name);
                },
                startDecorator: <Delete />,
              },
            ]}
          />
        )
      }
      details={
        <Suspense
          fallback={
            <Stack
              sx={{
                alignItems: "center",
                justifyContent: "center",
                height: "10rem",
              }}
            >
              <CircularProgress />
            </Stack>
          }
        >
          {props.expanded && (
            <AnalysisAccordionDetails
              analysis={props.analysis}
              attributes={props.attributes}
              evaluatedDataAmountTotal={props.evaluatedDataAmountTotal}
              isReport={props.isReport}
              dataSourceSensitivity={props.dataSourceSensitivity}
              onDiagramCreateClicked={props.onDiagramCreateClicked}
            />
          )}
        </Suspense>
      }
      onExpand={props.onExpand}
    />
  );
}
