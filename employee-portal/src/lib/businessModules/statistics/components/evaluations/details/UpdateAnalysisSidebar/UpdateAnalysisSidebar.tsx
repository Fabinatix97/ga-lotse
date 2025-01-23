/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useUpdateAnalysis } from "@/lib/businessModules/statistics/api/mutations/useUpdateAnalysis";
import { SaveAnalysisStep } from "@/lib/businessModules/statistics/components/evaluations/details/CreateAnalysisSidebar/SaveAnalysisStep/SaveAnalysisStep";
import {
  SidebarStepper,
  createStepContent,
} from "@/lib/shared/components/SidebarStepper/SidebarStepper";
import {
  SidebarWithFormRefProps,
  UseSidebarWithFormRefResult,
  useSidebarWithFormRef,
} from "@/lib/shared/hooks/useSidebarWithFormRef";

export function useUpdateAnalysisSidebar(): UseSidebarWithFormRefResult<UpdateAnalysisSidebarProps> {
  return useSidebarWithFormRef({
    component: UpdateAnalysisSidebar,
  });
}

interface UpdateAnalysisSidebarProps extends SidebarWithFormRefProps {
  analysisId: string;
  name: string;
}

function UpdateAnalysisSidebar(props: UpdateAnalysisSidebarProps) {
  const updateAnalysis = useUpdateAnalysis(props.analysisId, () =>
    props.onClose(true),
  );

  return (
    <SidebarStepper
      onClose={props.onClose}
      formRef={props.formRef}
      onSubmit={updateAnalysis}
      steps={[
        () => ({
          title: "Anpassung speichern",
          content: createStepContent({
            component: SaveAnalysisStep,
          }),
          initialValues: { name: props.name },
        }),
      ]}
    />
  );
}
