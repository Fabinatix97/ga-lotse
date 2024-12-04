/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { HiddenContainer } from "@eshg/lib-portal/components/HiddenContainer";
import { toDateString } from "@eshg/lib-portal/helpers/dateTime";
import { Stack } from "@mui/joy";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { isDefined, isNonNull } from "remeda";

import { useExportEvaluationData } from "@/lib/businessModules/statistics/api/downloads/useExportEvaluationData";
import { EvaluationDetailsView } from "@/lib/businessModules/statistics/api/models/evaluationDetailsViewTypes";
import { GeoShapeInfo } from "@/lib/businessModules/statistics/api/models/geoShapesTableView";
import {
  DuplicateEvaluationSidebar,
  OriginalEvaluation,
} from "@/lib/businessModules/statistics/components/evaluations/DuplicateEvaluationSidebar/DuplicateEvaluationSidebar";
import { SaveAsEvaluationTemplateSidebar } from "@/lib/businessModules/statistics/components/evaluations/EvaluationTemplateSidebar/SaveAsEvaluationTemplateSidebar";
import { BusinessModuleInformationCardProps } from "@/lib/businessModules/statistics/components/evaluations/details/BusinessModuleInformationCard";
import { CreateAnalysisSidebar } from "@/lib/businessModules/statistics/components/evaluations/details/CreateAnalysisSidebar/CreateAnalysisSidebar";
import { CreateDiagramSidebar } from "@/lib/businessModules/statistics/components/evaluations/details/CreateDiagramSidebar/CreateDiagramSidebar";
import { DetailsInformationCardProps } from "@/lib/businessModules/statistics/components/evaluations/details/DetailsInformationCard";
import { EvaluationNameChangeModal } from "@/lib/businessModules/statistics/components/evaluations/details/EvaluationNameChangeModal";
import { InformationCards } from "@/lib/businessModules/statistics/components/evaluations/details/InformationCards";
import { UpdateEvaluationDataBasisSidebar } from "@/lib/businessModules/statistics/components/evaluations/details/UpdateEvaluationDataBasisSidebar/UpdateEvaluationDataBasisSidebar";
import { useDeleteEvaluationWithConfirmation } from "@/lib/businessModules/statistics/components/evaluations/useDeleteEvaluationWithConfirmation";
import { useStatisticsRoleChecks } from "@/lib/businessModules/statistics/components/evaluations/useStatisticsRoleChecks";
import { AnalysisAccordion } from "@/lib/businessModules/statistics/components/shared/AnalysisAccordion/AnalysisAccordion";
import { routes } from "@/lib/businessModules/statistics/shared/routes";
import { OverlayBoundary } from "@/lib/shared/components/boundaries/OverlayBoundary";
import { businessModuleNames } from "@/lib/shared/components/procedures/constants";

type SidebarState<T> = { open: false } | { open: true; data: T };

export function EvaluationDetails(
  props: EvaluationDetailsView & { choroplethMaps: GeoShapeInfo[] },
) {
  const [isCreateAnalysisSidebarOpen, setIsCreateAnalysisSidebarOpen] =
    useState(false);
  const [isUpdateDataBasisSidebarOpen, setIsUpdateDataBasisSidebarOpen] =
    useState(false);
  const [isNameChangeModalOpen, setIsNameChangeModalOpen] = useState(false);
  const [createDiagramSidebarState, setCreateDiagramSidebarState] = useState<
    SidebarState<{ analysisId: string }>
  >({ open: false });
  const [
    saveAsEvaluationTemplateSidebarEvaluationId,
    setSaveAsEvaluationTemplateSidebarEvaluationId,
  ] = useState<string | null>(null);

  const [duplicateEvaluationAction, setDuplicateEvaluationAction] =
    useState<OriginalEvaluation>();

  const router = useRouter();
  const deleteEvaluationWithConfirmationAndRedirect =
    useDeleteEvaluationWithConfirmation(() => {
      router.push(routes.evaluations.index);
    });

  const { download: exportData, downloadContainerRef } =
    useExportEvaluationData();

  const { canWrite, canDelete, canUpdateEvaluation } =
    useStatisticsRoleChecks();

  const detailsInformationCardProps: DetailsInformationCardProps = {
    canDelete: canDelete(props.userId),
    canUpdateEvaluation: canUpdateEvaluation(props.userId),
    canWrite: canWrite(),
    anonymized: props.anonymized,
    start: props.start,
    end: props.end,
    createdAt: props.createdAt,
    createdBy: props.createdBy,
    onAnalysisCreateClicked: () => setIsCreateAnalysisSidebarOpen(true),
    onDataBasisUpdateClicked: () => setIsUpdateDataBasisSidebarOpen(true),
    onNameChangeClicked: () => setIsNameChangeModalOpen(true),
    onEvaluationDeleteClicked: () =>
      deleteEvaluationWithConfirmationAndRedirect(
        props.evaluationId,
        props.title,
      ),
    onEvaluationDuplicateClicked: () =>
      setDuplicateEvaluationAction({
        id: props.evaluationId,
        name: props.title,
        timeRangeStart: props.start,
        timeRangeEnd: props.end,
      }),
    onSaveEvaluationTemplateClicked: () =>
      setSaveAsEvaluationTemplateSidebarEvaluationId(props.evaluationId),
    onDataExport: () =>
      exportData(
        { evaluationId: props.evaluationId },
        { tooMuchDataForExport: props.tooMuchDataForExport },
      ),
  };

  const businessModuleInformationCardsProps: BusinessModuleInformationCardProps[] =
    [
      {
        titleLabel: businessModuleNames[props.dataSource.module],
        dataSource: props.dataSource.name,
        datasetAmount: props.dataSource.datasetAmount,
        attributeLabels: props.dataSource.attributeLabels,
        anonymized: props.anonymized,
      },
    ];

  return (
    <Stack gap={6}>
      {isNonNull(saveAsEvaluationTemplateSidebarEvaluationId) && (
        <OverlayBoundary>
          <SaveAsEvaluationTemplateSidebar
            open={true}
            onClose={() => setSaveAsEvaluationTemplateSidebarEvaluationId(null)}
            evaluationId={saveAsEvaluationTemplateSidebarEvaluationId}
          />
        </OverlayBoundary>
      )}
      {isCreateAnalysisSidebarOpen && (
        <OverlayBoundary>
          <CreateAnalysisSidebar
            open={isCreateAnalysisSidebarOpen}
            onClose={() => setIsCreateAnalysisSidebarOpen(false)}
            evaluationId={props.evaluationId}
            attributes={props.attributes}
            choroplethMaps={props.choroplethMaps}
          />
        </OverlayBoundary>
      )}

      <HiddenContainer ref={downloadContainerRef} />

      {isUpdateDataBasisSidebarOpen && (
        <OverlayBoundary>
          <UpdateEvaluationDataBasisSidebar
            onClose={() => setIsUpdateDataBasisSidebarOpen(false)}
            initialValues={{
              timeSpan: {
                start: toDateString(detailsInformationCardProps.start),
                end: toDateString(detailsInformationCardProps.end),
              },
            }}
            evaluationId={props.evaluationId}
          />
        </OverlayBoundary>
      )}

      {createDiagramSidebarState.open && (
        <OverlayBoundary>
          <CreateDiagramSidebar
            open={createDiagramSidebarState.open}
            onClose={() => setCreateDiagramSidebarState({ open: false })}
            analysisId={createDiagramSidebarState.data.analysisId}
            attributes={props.attributes}
            evaluationId={props.evaluationId}
          />
        </OverlayBoundary>
      )}

      {isDefined(duplicateEvaluationAction) && (
        <OverlayBoundary>
          <DuplicateEvaluationSidebar
            onClose={() => setDuplicateEvaluationAction(undefined)}
            originalEvaluation={duplicateEvaluationAction}
          />
        </OverlayBoundary>
      )}

      <OverlayBoundary>
        <EvaluationNameChangeModal
          open={isNameChangeModalOpen}
          onClose={() => setIsNameChangeModalOpen(false)}
          initialName={props.title}
          evaluationId={props.evaluationId}
        />
      </OverlayBoundary>
      <InformationCards
        detailsInformationCardProps={detailsInformationCardProps}
        businessModuleInformationCardsProps={
          businessModuleInformationCardsProps
        }
      />
      <AnalysisAccordion
        analyses={props.analyses}
        attributes={props.attributes}
        evaluatedDataAmountTotal={props.dataSource.datasetAmount}
        onDiagramCreateClicked={(analysisId) =>
          setCreateDiagramSidebarState({ open: true, data: { analysisId } })
        }
        anonymized={props.anonymized}
      />
    </Stack>
  );
}
