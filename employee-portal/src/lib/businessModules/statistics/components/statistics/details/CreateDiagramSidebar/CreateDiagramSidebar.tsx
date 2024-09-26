/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { FlatAttribute } from "@/lib/businessModules/statistics/api/models/flatAttribute";
import { useAddDiagram } from "@/lib/businessModules/statistics/api/mutations/useAddDiagram";
import { useAddFilterTemplate } from "@/lib/businessModules/statistics/api/mutations/useAddFilterTemplate";
import { useDeleteFilterTemplate } from "@/lib/businessModules/statistics/api/mutations/useDeleteFilterTemplate";
import { useGetFilterTemplateFilters } from "@/lib/businessModules/statistics/api/mutations/useGetFilterTemplateFilters";
import { useGetFilterTemplates } from "@/lib/businessModules/statistics/api/queries/useGetFilterTemplates";
import { SaveDiagramStep } from "@/lib/businessModules/statistics/components/statistics/details/CreateDiagramSidebar/SaveDiagramStep/SaveDiagramStep";
import { SetFiltersStep } from "@/lib/businessModules/statistics/components/statistics/details/CreateDiagramSidebar/SetFiltersStep/SetFiltersStep";
import { CreateDiagramFormModel } from "@/lib/businessModules/statistics/components/statistics/details/CreateDiagramSidebar/createDiagramFormModel";
import { SidebarStepper } from "@/lib/shared/components/SidebarStepper/SidebarStepper";
import { SidebarStep } from "@/lib/shared/components/SidebarStepper/sidebarStep";
import { UseFilterSettings } from "@/lib/shared/components/filterSettings/useFilterSettings";
import { UseFilterTemplateProps } from "@/lib/shared/components/filterSettings/useFilterTemplate";

export function CreateDiagramSidebar(props: {
  open: boolean;
  onClose: () => void;
  evaluationId: string;
  attributes: FlatAttribute[];
  statisticId: string;
}) {
  const initialValues: CreateDiagramFormModel = {
    title: "",
    description: "",
    filterValues: [],
  };

  const createDiagram = useAddDiagram();
  const addFilterTemplate = useAddFilterTemplate(props.attributes);
  const deleteFilterTemplate = useDeleteFilterTemplate();
  const filterTemplates = useGetFilterTemplates(props.statisticId);
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

  async function onSubmit(model: CreateDiagramFormModel): Promise<void> {
    await createDiagram(
      {
        evaluationId: props.evaluationId,
        attributes: props.attributes,
        ...model,
      },
      {
        onSuccess: props.onClose,
      },
    );
  }

  return (
    <SidebarStepper
      open={props.open}
      onClose={props.onClose}
      onSubmit={onSubmit}
      initialValues={initialValues}
      steps={
        [
          {
            type: "StandardStep",
            step: {
              title: "Filter für Diagramm festlegen",
              content: (
                <SetFiltersStep
                  attributes={props.attributes}
                  getUseFilterTemplateProps={getUseFilterTemplateProps}
                />
              ),
            },
          },
          {
            type: "StandardStep",
            step: {
              title: "Diagramm speichern",
              content: <SaveDiagramStep />,
            },
          },
        ] satisfies SidebarStep<CreateDiagramFormModel>[]
      }
    />
  );
}
