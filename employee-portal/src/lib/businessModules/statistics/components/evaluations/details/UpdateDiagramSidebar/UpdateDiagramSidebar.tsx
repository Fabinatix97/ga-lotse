/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useUpdateDiagram } from "@/lib/businessModules/statistics/api/mutations/useUpdateDiagram";
import { SaveDiagramStep } from "@/lib/businessModules/statistics/components/evaluations/details/CreateDiagramSidebar/SaveDiagramStep/SaveDiagramStep";
import {
  SidebarStepper,
  createStepContent,
} from "@/lib/shared/components/SidebarStepper/SidebarStepper";
import {
  SidebarWithFormRefProps,
  UseSidebarWithFormRefResult,
  useSidebarWithFormRef,
} from "@/lib/shared/hooks/useSidebarWithFormRef";

export function useUpdateDiagramSidebar(): UseSidebarWithFormRefResult<UpdateDiagramSidebarProps> {
  return useSidebarWithFormRef({
    component: UpdateDiagramSidebar,
  });
}

interface UpdateDiagramSidebarProps extends SidebarWithFormRefProps {
  diagramId: string;
  title: string;
  description: string | undefined;
}

function UpdateDiagramSidebar(props: UpdateDiagramSidebarProps) {
  const updateDiagram = useUpdateDiagram(props.diagramId, () =>
    props.onClose(true),
  );

  return (
    <SidebarStepper
      onClose={props.onClose}
      formRef={props.formRef}
      onSubmit={updateDiagram}
      steps={[
        () => ({
          title: "Änderungen speichern",
          content: createStepContent({
            component: SaveDiagramStep,
          }),
          initialValues: {
            title: props.title,
            description: props.description ?? "",
          },
        }),
      ]}
    />
  );
}
