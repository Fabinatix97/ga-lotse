/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { toDateString } from "@eshg/lib-portal/helpers/dateTime";
import { Stack } from "@mui/joy";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { isDefined, isNonNull } from "remeda";

import { GeoShapeInfo } from "@/lib/businessModules/statistics/api/models/geoShapesTableView";
import { StatisticDetailsView } from "@/lib/businessModules/statistics/api/models/statisticDetailsViewTypes";
import {
  DuplicateStatisticSidebar,
  OriginalStatistic,
} from "@/lib/businessModules/statistics/components/evaluations/DuplicateStatisticSidebar/DuplicateStatisticSidebar";
import { SaveAsEvaluationTemplateSidebar } from "@/lib/businessModules/statistics/components/evaluations/EvaluationTemplateSidebar/SaveAsEvaluationTemplateSidebar";
import { BusinessModuleInformationCardProps } from "@/lib/businessModules/statistics/components/evaluations/details/BusinessModuleInformationCard";
import { CreateDiagramSidebar } from "@/lib/businessModules/statistics/components/evaluations/details/CreateDiagramSidebar/CreateDiagramSidebar";
import { CreateEvaluationSidebar } from "@/lib/businessModules/statistics/components/evaluations/details/CreateEvaluationSidebar/CreateEvaluationSidebar";
import { DetailsInformationCardProps } from "@/lib/businessModules/statistics/components/evaluations/details/DetailsInformationCard";
import { InformationCards } from "@/lib/businessModules/statistics/components/evaluations/details/InformationCards";
import { StatisticNameChangeModal } from "@/lib/businessModules/statistics/components/evaluations/details/StatisticNameChangeModal";
import { UpdateStatisticDataBasisSidebar } from "@/lib/businessModules/statistics/components/evaluations/details/UpdateStatisticDataBasisSidebar/UpdateStatisticDataBasisSidebar";
import { useDeleteStatisticWithConfirmation } from "@/lib/businessModules/statistics/components/evaluations/useDeleteStatisticWithConfirmation";
import { useStatisticRoleChecks } from "@/lib/businessModules/statistics/components/evaluations/useStatisticRoleChecks";
import { EvaluationAccordion } from "@/lib/businessModules/statistics/components/shared/EvaluationAccordion/EvaluationAccordion";
import { routes } from "@/lib/businessModules/statistics/shared/routes";
import { OverlayBoundary } from "@/lib/shared/components/boundaries/OverlayBoundary";
import { businessModuleNames } from "@/lib/shared/components/procedures/constants";

type SidebarState<T> = { open: false } | { open: true; data: T };

export function StatisticDetails(
  props: StatisticDetailsView & { choroplethMaps: GeoShapeInfo[] },
) {
  const [isCreateEvaluationSidebarOpen, setIsCreateEvaluationSidebarOpen] =
    useState(false);
  const [isUpdateDataBasisSidebarOpen, setIsUpdateDataBasisSidebarOpen] =
    useState(false);
  const [isNameChangeModalOpen, setIsNameChangeModalOpen] = useState(false);
  const [createDiagramSidebarState, setCreateDiagramSidebarState] = useState<
    SidebarState<{ evaluationId: string }>
  >({ open: false });
  const [
    saveAsEvaluationTemplateSidebarEvaluationId,
    setSaveAsEvaluationTemplateSidebarEvaluationId,
  ] = useState<string | null>(null);

  const [duplicateStatisticAction, setDuplicateStatisticAction] =
    useState<OriginalStatistic>();

  const router = useRouter();
  const deleteStatisticsWithConfirmationAndRedirect =
    useDeleteStatisticWithConfirmation(() => {
      router.push(routes.evaluations.index);
    });

  const { canWrite, canDelete, canUpdateStatistic } = useStatisticRoleChecks();

  const detailsInformationCardProps: DetailsInformationCardProps = {
    canDelete: canDelete(props.userId),
    canUpdateStatistic: canUpdateStatistic(props.userId),
    canWrite: canWrite(),
    canExportData: props.anonymized,
    start: props.start,
    end: props.end,
    createdAt: props.createdAt,
    createdBy: props.createdBy,
    onEvaluationCreateClicked: () => setIsCreateEvaluationSidebarOpen(true),
    onDataBasisUpdateClicked: () => setIsUpdateDataBasisSidebarOpen(true),
    onNameChangeClicked: () => setIsNameChangeModalOpen(true),
    onStatisticDeleteClicked: () =>
      deleteStatisticsWithConfirmationAndRedirect(
        props.statisticId,
        props.title,
      ),
    onStatisticDuplicateClicked: () =>
      setDuplicateStatisticAction({
        id: props.statisticId,
        name: props.title,
        timeRangeStart: props.start,
        timeRangeEnd: props.end,
      }),
    onSaveEvaluationTemplateClicked: () =>
      setSaveAsEvaluationTemplateSidebarEvaluationId(props.statisticId),
    onDataExport: () => Promise.resolve(),
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
      {isCreateEvaluationSidebarOpen && (
        <OverlayBoundary>
          <CreateEvaluationSidebar
            open={isCreateEvaluationSidebarOpen}
            onClose={() => setIsCreateEvaluationSidebarOpen(false)}
            statisticId={props.statisticId}
            attributes={props.attributes}
            choroplethMaps={props.choroplethMaps}
          />
        </OverlayBoundary>
      )}

      {isUpdateDataBasisSidebarOpen && (
        <OverlayBoundary>
          <UpdateStatisticDataBasisSidebar
            onClose={() => setIsUpdateDataBasisSidebarOpen(false)}
            initialValues={{
              timeSpan: {
                start: toDateString(detailsInformationCardProps.start),
                end: toDateString(detailsInformationCardProps.end),
              },
            }}
            statisticId={props.statisticId}
          />
        </OverlayBoundary>
      )}

      {createDiagramSidebarState.open && (
        <OverlayBoundary>
          <CreateDiagramSidebar
            open={createDiagramSidebarState.open}
            onClose={() => setCreateDiagramSidebarState({ open: false })}
            evaluationId={createDiagramSidebarState.data.evaluationId}
            attributes={props.attributes}
            statisticId={props.statisticId}
          />
        </OverlayBoundary>
      )}

      {isDefined(duplicateStatisticAction) && (
        <OverlayBoundary>
          <DuplicateStatisticSidebar
            onClose={() => setDuplicateStatisticAction(undefined)}
            originalStatistic={duplicateStatisticAction}
          />
        </OverlayBoundary>
      )}

      <OverlayBoundary>
        <StatisticNameChangeModal
          open={isNameChangeModalOpen}
          onClose={() => setIsNameChangeModalOpen(false)}
          initialName={props.title}
          statisticId={props.statisticId}
        />
      </OverlayBoundary>
      <InformationCards
        detailsInformationCardProps={detailsInformationCardProps}
        businessModuleInformationCardsProps={
          businessModuleInformationCardsProps
        }
      />
      <EvaluationAccordion
        evaluations={props.evaluations}
        attributes={props.attributes}
        evaluatedDataAmountTotal={props.dataSource.datasetAmount}
        onDiagramCreateClicked={(evaluationId) =>
          setCreateDiagramSidebarState({ open: true, data: { evaluationId } })
        }
        anonymized={props.anonymized}
      />
    </Stack>
  );
}
