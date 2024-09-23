/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useUpdateDiagram } from "@/lib/businessModules/statistics/api/mutations/useUpdateDiagram";
import { SidebarStepper } from "@/lib/businessModules/statistics/components/shared/SidebarStepper/SidebarStepper";
import { SidebarStep } from "@/lib/businessModules/statistics/components/shared/SidebarStepper/sidebarStep";
import { SaveDiagramStep } from "@/lib/businessModules/statistics/components/statistics/details/CreateDiagramSidebar/SaveDiagramStep/SaveDiagramStep";
import { UpdateDiagramFormModel } from "@/lib/businessModules/statistics/components/statistics/details/UpdateDiagramSidebar/updateDiagramFormModel";

export function UpdateDiagramSidebar(props: {
  open: boolean;
  onClose: () => void;
  diagramId: string;
  title: string;
  description: string | undefined;
}) {
  const updateDiagram = useUpdateDiagram(props.diagramId, props.onClose);

  return (
    <SidebarStepper
      open={props.open}
      onClose={props.onClose}
      onSubmit={updateDiagram}
      initialValues={{
        title: props.title,
        description: props.description ?? "",
      }}
      steps={
        [
          {
            type: "StandardStep",
            step: {
              title: "Änderungen speichern",
              content: <SaveDiagramStep />,
            },
          },
        ] satisfies SidebarStep<UpdateDiagramFormModel>[]
      }
    />
  );
}
