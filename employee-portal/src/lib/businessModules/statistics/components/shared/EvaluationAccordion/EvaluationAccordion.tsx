/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Delete, Edit } from "@mui/icons-material";
import { CircularProgress, Stack } from "@mui/joy";
import { Suspense, useState } from "react";

import { FlatAttribute } from "@/lib/businessModules/statistics/api/models/flatAttribute";
import { Evaluation } from "@/lib/businessModules/statistics/api/models/statisticDetailsViewTypes";
import { useDeleteEvaluation } from "@/lib/businessModules/statistics/api/mutations/useDeleteEvaluation";
import { UpdateEvaluationSidebar } from "@/lib/businessModules/statistics/components/statistics/details/UpdateEvaluationSidebar/UpdateEvaluationSidebar";
import { useStatisticRoleChecks } from "@/lib/businessModules/statistics/components/statistics/useStatisticRoleChecks";
import { NoSearchResults } from "@/lib/shared/components/NoSearchResult";
import { OverlayBoundary } from "@/lib/shared/components/boundaries/OverlayBoundary";
import { ActionsMenu } from "@/lib/shared/components/buttons/ActionsMenu";
import { useConfirmationDialog } from "@/lib/shared/components/confirmationDialog/ConfirmationDialogProvider";

import { AccordionSheet } from "./AccordionSheet";
import { EvaluationAccordionDetails } from "./EvaluationAccordionDetails";
import { EvaluationAccordionSummary } from "./EvaluationAccordionSummary";
import {
  EvaluationSortOrder,
  EvaluationSortOrderSelect,
  sortEvaluations,
} from "./EvaluationSortOrderSelect";
import { ToggleExpandedButton } from "./ToggleExpandedButton";

export interface EvaluationAccordionProps {
  evaluations: Evaluation[];
  attributes: FlatAttribute[];
  evaluatedDataAmountTotal: number;
  onDiagramCreateClicked?: (evaluationId: string) => void;
  isReport?: boolean;
  anonymized: boolean;
}

export function EvaluationAccordion(props: EvaluationAccordionProps) {
  const isReport = props.isReport ?? false;
  const [sortOrder, setSortOrder] = useState<EvaluationSortOrder>(
    EvaluationSortOrder.NameAscending,
  );
  const [expandedAccordions, setExpandedAccordions] = useState<
    Record<string, boolean>
  >({});

  const sortedEvaluations = sortEvaluations(props.evaluations, sortOrder);

  function handleAccordionExpand(evaluationId: string, expanded: boolean) {
    setExpandedAccordions((prevExpandedAccordions) => ({
      ...prevExpandedAccordions,
      [evaluationId]: expanded,
    }));
  }

  return (
    <Stack gap={3} data-testid="evaluation-accordion-group">
      <Stack direction="row" justifyContent="space-between">
        <EvaluationSortOrderSelect
          sortOrder={sortOrder}
          onSortOrderChange={setSortOrder}
        />
        {!isReport && (
          <ToggleExpandedButton
            someExpanded={props.evaluations.some(
              (evaluation) => expandedAccordions[evaluation.id] ?? false,
            )}
            onExpandAll={() => {
              props.evaluations.forEach((evaluation) => {
                handleAccordionExpand(evaluation.id, true);
              });
            }}
            onCollapseAll={() => {
              setExpandedAccordions({});
            }}
          />
        )}
      </Stack>

      {sortedEvaluations.length === 0 && (
        <NoSearchResults info="Keine Analysen vorhanden" />
      )}

      {sortedEvaluations.map((evaluation) => (
        <EvaluationAccordionItem
          key={evaluation.id}
          evaluation={evaluation}
          expanded={expandedAccordions[evaluation.id] ?? false}
          onExpand={(expanded) => {
            handleAccordionExpand(evaluation.id, expanded);
          }}
          attributes={props.attributes}
          evaluatedDataAmountTotal={props.evaluatedDataAmountTotal}
          onDiagramCreateClicked={props.onDiagramCreateClicked}
          isReport={isReport}
          anonymized={props.anonymized}
        />
      ))}
    </Stack>
  );
}

interface EvaluationAccordionItemProps {
  evaluation: Evaluation;
  expanded: boolean;
  onExpand: (expanded: boolean) => void;
  attributes: FlatAttribute[];
  evaluatedDataAmountTotal: number;
  onDiagramCreateClicked?: (evaluationId: string) => void;
  isReport: boolean;
  anonymized: boolean;
}

function EvaluationAccordionItem(props: EvaluationAccordionItemProps) {
  const [isUpdateEvaluationSidebarOpen, setIsUpdateEvaluationSidebarOpen] =
    useState(false);
  const canWrite = useStatisticRoleChecks().canWrite();
  const { openConfirmationDialog } = useConfirmationDialog();
  const deleteEvaluation = useDeleteEvaluation();

  function handleEvaluationDelete(evaluationId: string, name: string) {
    openConfirmationDialog({
      onConfirm: () => deleteEvaluation(evaluationId),
      title: "Analyse löschen?",
      description: `Die Analyse “${name}” und alle darin enthaltenen Diagramme werden dann unwiderruflich gelöscht.`,
      cancelLabel: "Abbrechen",
      confirmLabel: "Löschen",
      color: "danger",
    });
  }

  return (
    <>
      {isUpdateEvaluationSidebarOpen && (
        <OverlayBoundary>
          <UpdateEvaluationSidebar
            open={isUpdateEvaluationSidebarOpen}
            onClose={() => setIsUpdateEvaluationSidebarOpen(false)}
            evaluationId={props.evaluation.id}
            name={props.evaluation.name}
          />
        </OverlayBoundary>
      )}
      <AccordionSheet
        key={props.evaluation.id}
        expanded={props.expanded}
        onExpand={props.onExpand}
        summary={<EvaluationAccordionSummary evaluation={props.evaluation} />}
        controls={
          canWrite &&
          !props.isReport && (
            <ActionsMenu
              actionItems={[
                {
                  label: "Anpassen",
                  onClick: () => {
                    setIsUpdateEvaluationSidebarOpen(true);
                  },
                  startDecorator: <Edit />,
                },
                {
                  label: "Löschen",
                  onClick: () => {
                    handleEvaluationDelete(
                      props.evaluation.id,
                      props.evaluation.name,
                    );
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
              <EvaluationAccordionDetails
                evaluation={props.evaluation}
                attributes={props.attributes}
                evaluatedDataAmountTotal={props.evaluatedDataAmountTotal}
                onDiagramCreateClicked={props.onDiagramCreateClicked}
                isReport={props.isReport}
                anonymized={props.anonymized}
              />
            )}
          </Suspense>
        }
      />
    </>
  );
}
