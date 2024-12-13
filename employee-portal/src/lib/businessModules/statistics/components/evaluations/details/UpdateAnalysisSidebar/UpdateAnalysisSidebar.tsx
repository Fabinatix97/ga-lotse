/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useUpdateAnalysis } from "@/lib/businessModules/statistics/api/mutations/useUpdateAnalysis";
import { SaveAnalysisStep } from "@/lib/businessModules/statistics/components/evaluations/details/CreateAnalysisSidebar/SaveAnalysisStep/SaveAnalysisStep";
import { UpdateAnalysisFormModel } from "@/lib/businessModules/statistics/components/evaluations/details/UpdateAnalysisSidebar/updateAnalysisFormModel";
import { SidebarStepper } from "@/lib/shared/components/SidebarStepper/SidebarStepper";
import { SidebarStep } from "@/lib/shared/components/SidebarStepper/sidebarStep";
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
      onSubmit={updateAnalysis}
      initialValues={{
        name: props.name,
      }}
      formRef={props.formRef}
      steps={
        [
          {
            type: "StandardStep",
            step: {
              title: "Anpassung speichern",
              content: <SaveAnalysisStep />,
            },
          },
        ] satisfies SidebarStep<UpdateAnalysisFormModel>[]
      }
    />
  );
}
