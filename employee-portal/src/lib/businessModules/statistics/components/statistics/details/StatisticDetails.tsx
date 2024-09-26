/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { toDateString } from "@eshg/lib-portal/helpers/dateTime";
import { Stack } from "@mui/joy";
import { useState } from "react";

import { GeoShapeInfo } from "@/lib/businessModules/statistics/api/models/geoShapesTableView";
import { StatisticDetailsView } from "@/lib/businessModules/statistics/api/models/statisticDetailsViewTypes";
import { EvaluationAccordion } from "@/lib/businessModules/statistics/components/shared/EvaluationAccordion/EvaluationAccordion";
import { BusinessModuleInformationCardProps } from "@/lib/businessModules/statistics/components/statistics/details/BusinessModuleInformationCard";
import { CreateDiagramSidebar } from "@/lib/businessModules/statistics/components/statistics/details/CreateDiagramSidebar/CreateDiagramSidebar";
import { CreateEvaluationSidebar } from "@/lib/businessModules/statistics/components/statistics/details/CreateEvaluationSidebar/CreateEvaluationSidebar";
import { DetailsInformationCardProps } from "@/lib/businessModules/statistics/components/statistics/details/DetailsInformationCard";
import { InformationCards } from "@/lib/businessModules/statistics/components/statistics/details/InformationCards";
import { StatisticNameChangeModal } from "@/lib/businessModules/statistics/components/statistics/details/StatisticNameChangeModal";
import { UpdateStatisticDataBasisSidebar } from "@/lib/businessModules/statistics/components/statistics/details/UpdateStatisticDataBasisSidebar/UpdateStatisticDataBasisSidebar";
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

  const detailsInformationCardProps: DetailsInformationCardProps = {
    start: props.start,
    end: props.end,
    createdAt: props.createdAt,
    createdBy: props.createdBy,
    onEvaluationCreateClicked: () => setIsCreateEvaluationSidebarOpen(true),
    onDataBasisUpdateClicked: () => setIsUpdateDataBasisSidebarOpen(true),
    onNameChangeClicked: () => setIsNameChangeModalOpen(true),
  };

  const businessModuleInformationCardsProps: BusinessModuleInformationCardProps[] =
    [
      {
        titleLabel: businessModuleNames[props.dataSource.module],
        dataSource: props.dataSource.name,
        datasetAmount: props.dataSource.datasetAmount,
        attributeLabels: props.dataSource.attributeLabels,
      },
    ];

  return (
    <Stack gap={6}>
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

      <OverlayBoundary>
        <StatisticNameChangeModal
          open={isNameChangeModalOpen}
          onClose={() => setIsNameChangeModalOpen(false)}
          initialName={props.title}
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
      />
    </Stack>
  );
}
