/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { HiddenContainer } from "@eshg/lib-portal/components/HiddenContainer";
import { toDateString } from "@eshg/lib-portal/helpers/dateTime";
import { Stack } from "@mui/joy";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { useExportEvaluationData } from "@/lib/businessModules/statistics/api/downloads/useExportEvaluationData";
import { EvaluationDetailsView } from "@/lib/businessModules/statistics/api/models/evaluationDetailsViewTypes";
import { GeoShapeInfo } from "@/lib/businessModules/statistics/api/models/geoShapesTableView";
import {
  OriginalEvaluation,
  useDuplicateEvaluationSidebar,
} from "@/lib/businessModules/statistics/components/evaluations/DuplicateEvaluationSidebar/DuplicateEvaluationSidebar";
import { useSaveAsEvaluationTemplateSidebar } from "@/lib/businessModules/statistics/components/evaluations/EvaluationTemplateSidebar/SaveAsEvaluationTemplateSidebar";
import { BusinessModuleInformationCardProps } from "@/lib/businessModules/statistics/components/evaluations/details/BusinessModuleInformationCard";
import { useCreateAnalysisSidebar } from "@/lib/businessModules/statistics/components/evaluations/details/CreateAnalysisSidebar/CreateAnalysisSidebar";
import { useCreateDiagramSidebar } from "@/lib/businessModules/statistics/components/evaluations/details/CreateDiagramSidebar/CreateDiagramSidebar";
import { DetailsInformationCardProps } from "@/lib/businessModules/statistics/components/evaluations/details/DetailsInformationCard";
import { EvaluationNameChangeModal } from "@/lib/businessModules/statistics/components/evaluations/details/EvaluationNameChangeModal";
import { InformationCards } from "@/lib/businessModules/statistics/components/evaluations/details/InformationCards";
import { useUpdateEvaluationDataBasisSidebar } from "@/lib/businessModules/statistics/components/evaluations/details/UpdateEvaluationDataBasisSidebar/UpdateEvaluationDataBasisSidebar";
import { useDeleteEvaluationWithConfirmation } from "@/lib/businessModules/statistics/components/evaluations/useDeleteEvaluationWithConfirmation";
import { AnalysisAccordion } from "@/lib/businessModules/statistics/components/shared/AnalysisAccordion/AnalysisAccordion";
import { useStatisticsRoleChecks } from "@/lib/businessModules/statistics/permissions/useStatisticsRoleChecks";
import { routes } from "@/lib/businessModules/statistics/shared/routes";
import { OverlayBoundary } from "@/lib/shared/components/boundaries/OverlayBoundary";
import { businessModuleNames } from "@/lib/shared/components/procedures/constants";
import { useCopy } from "@/lib/shared/hooks/useCopy";

export function EvaluationDetails(
  props: EvaluationDetailsView & { choroplethMaps: GeoShapeInfo[] },
) {
  const [isNameChangeModalOpen, setIsNameChangeModalOpen] = useState(false);

  const createAnalysisSidebar = useCreateAnalysisSidebar();
  const updateEvaluationDataBasisSidebar =
    useUpdateEvaluationDataBasisSidebar();
  const createDiagramSidebar = useCreateDiagramSidebar();
  const saveAsEvaluationTemplateSidebar = useSaveAsEvaluationTemplateSidebar();
  const duplicateEvaluationSidebar = useDuplicateEvaluationSidebar();

  const router = useRouter();
  const deleteEvaluationWithConfirmationAndRedirect =
    useDeleteEvaluationWithConfirmation(() => {
      router.push(routes.evaluations.index);
    });

  const { download: exportData, downloadContainerRef } =
    useExportEvaluationData();

  const { canWrite, canDelete, canUpdateEvaluation } =
    useStatisticsRoleChecks();
  const copy = useCopy();

  function openCreateAnalysisSidebar() {
    createAnalysisSidebar.open({
      evaluationId: props.evaluationId,
      attributes: props.attributes,
      choroplethMaps: props.choroplethMaps,
    });
  }

  function openUpdateEvaluationDataBasisSidebar() {
    updateEvaluationDataBasisSidebar.open({
      evaluationId: props.evaluationId,
      initialValues: {
        timeSpan: {
          start: toDateString(props.start),
          end: toDateString(props.end),
        },
      },
    });
  }

  function openCreateDiagramSidebar(analysisId: string) {
    createDiagramSidebar.open({
      evaluationId: props.evaluationId,
      attributes: props.attributes,
      analysisId,
    });
  }

  function openSaveAsEvaluationTemplateSidebar() {
    saveAsEvaluationTemplateSidebar.open({ evaluationId: props.evaluationId });
  }

  function openDuplicateEvaluationSidebar(
    originalEvaluation: OriginalEvaluation,
  ) {
    duplicateEvaluationSidebar.open({ originalEvaluation });
  }

  const detailsInformationCardProps: DetailsInformationCardProps = {
    canDelete: canDelete(props.userId),
    canUpdateEvaluation: canUpdateEvaluation(props.userId),
    canWrite: canWrite(),
    dataSourceSensitivity: props.dataSource.sensitivity,
    start: props.start,
    end: props.end,
    createdAt: props.createdAt,
    createdBy: props.createdBy,
    onAnalysisCreateClicked: openCreateAnalysisSidebar,
    onDataBasisUpdateClicked: openUpdateEvaluationDataBasisSidebar,
    evaluationId: props.evaluationId,
    onShareClicked: copy,
    onNameChangeClicked: () => setIsNameChangeModalOpen(true),
    onEvaluationDeleteClicked: () =>
      deleteEvaluationWithConfirmationAndRedirect(
        props.evaluationId,
        props.title,
      ),
    onEvaluationDuplicateClicked: () =>
      openDuplicateEvaluationSidebar({
        id: props.evaluationId,
        name: props.title,
        timeRangeStart: props.start,
        timeRangeEnd: props.end,
      }),
    onSaveEvaluationTemplateClicked: openSaveAsEvaluationTemplateSidebar,
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
        dataSourceSensitivity: props.dataSource.sensitivity,
      },
    ];

  return (
    <Stack gap={6}>
      <HiddenContainer ref={downloadContainerRef} />

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
        onDiagramCreateClicked={openCreateDiagramSidebar}
        dataSourceSensitivity={props.dataSource.sensitivity}
      />
    </Stack>
  );
}
