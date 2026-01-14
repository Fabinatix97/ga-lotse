/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  SidebarWithFormRefProps,
  UseFilterSettings,
  UseSidebarWithFormRefResult,
  useSidebarWithFormRef,
} from "@eshg/lib-employee-portal";

import { FlatAttribute } from "@/lib/businessModules/statistics/api/models/flatAttribute";
import { useAddDiagram } from "@/lib/businessModules/statistics/api/mutations/useAddDiagram";
import { useAddFilterTemplate } from "@/lib/businessModules/statistics/api/mutations/useAddFilterTemplate";
import { useDeleteFilterTemplate } from "@/lib/businessModules/statistics/api/mutations/useDeleteFilterTemplate";
import { useGetFilterTemplateFilters } from "@/lib/businessModules/statistics/api/mutations/useGetFilterTemplateFilters";
import { useGetFilterTemplates } from "@/lib/businessModules/statistics/api/queries/useGetFilterTemplates";
import { SaveDiagramStep } from "@/lib/businessModules/statistics/components/evaluations/details/CreateDiagramSidebar/SaveDiagramStep/SaveDiagramStep";
import { SetFiltersStep } from "@/lib/businessModules/statistics/components/evaluations/details/CreateDiagramSidebar/SetFiltersStep/SetFiltersStep";
import {
  SidebarStepper,
  createStepContent,
} from "@/lib/shared/components/SidebarStepper/SidebarStepper";
import { UseFilterTemplateProps } from "@/lib/shared/components/filterSettings/useFilterTemplate";

import { CreateDiagramFormModel } from "./createDiagramFormModel";

export function useCreateDiagramSidebar(): UseSidebarWithFormRefResult<CreateDiagramSidebarProps> {
  return useSidebarWithFormRef({
    component: CreateDiagramSidebar,
  });
}

interface CreateDiagramSidebarProps extends SidebarWithFormRefProps {
  analysisId: string;
  attributes: FlatAttribute[];
  evaluationId: string;
}

function CreateDiagramSidebar(props: CreateDiagramSidebarProps) {
  const createDiagram = useAddDiagram();
  const addFilterTemplate = useAddFilterTemplate(props.attributes);
  const deleteFilterTemplate = useDeleteFilterTemplate();
  const filterTemplates = useGetFilterTemplates(props.evaluationId);
  const getFilterTemplateFilters = useGetFilterTemplateFilters();

  function getUseFilterTemplateProps(
    filterSettings: UseFilterSettings,
  ): UseFilterTemplateProps {
    return {
      addFilterTemplate: addFilterTemplate,
      deleteFilterTemplate: deleteFilterTemplate,
      getFilterTemplateFilters: getFilterTemplateFilters,
      onActiveFilterValuesChanged: filterSettings.onActiveFilterValuesChanged,
      filterTemplates: filterTemplates,
      setOnActiveFilterValuesChangedCallback:
        filterSettings.setOnActiveFilterValuesChangedCallback,
    };
  }

  async function saveDiagramStepOnSubmit(
    model: CreateDiagramFormModel,
  ): Promise<void> {
    await createDiagram(
      {
        analysisId: props.analysisId,
        attributes: props.attributes,
        filterValues: model[0].filterValues,
        title: model[1].title,
        description: model[1].description,
      },
      {
        onSuccess: () => props.onClose(true),
      },
    );
  }

  return (
    <SidebarStepper
      formRef={props.formRef}
      steps={[
        () => ({
          title: "Filter für Diagramm festlegen",
          content: createStepContent({
            component: SetFiltersStep,
            componentProps: {
              attributes: props.attributes,
              getUseFilterTemplateProps,
            },
          }),
          initialValues: {
            filterValues: [],
          },
        }),
        () => ({
          title: "Diagramm speichern",
          content: createStepContent({
            component: SaveDiagramStep,
          }),
          initialValues: {
            title: "",
            description: "",
          },
        }),
      ]}
      onClose={props.onClose}
      onSubmit={saveDiagramStepOnSubmit}
    />
  );
}
