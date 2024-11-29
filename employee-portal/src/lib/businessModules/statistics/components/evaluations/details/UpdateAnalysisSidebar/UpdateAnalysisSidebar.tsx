/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useUpdateAnalysis } from "@/lib/businessModules/statistics/api/mutations/useUpdateAnalysis";
import { SaveAnalysisStep } from "@/lib/businessModules/statistics/components/evaluations/details/CreateAnalysisSidebar/SaveAnalysisStep/SaveAnalysisStep";
import { UpdateAnalysisFormModel } from "@/lib/businessModules/statistics/components/evaluations/details/UpdateAnalysisSidebar/updateAnalysisFormModel";
import { SidebarStepper } from "@/lib/shared/components/SidebarStepper/SidebarStepper";
import { SidebarStep } from "@/lib/shared/components/SidebarStepper/sidebarStep";

export function UpdateAnalysisSidebar(props: {
  open: boolean;
  onClose: () => void;
  analysisId: string;
  name: string;
}) {
  const updateAnalysis = useUpdateAnalysis(props.analysisId, props.onClose);

  return (
    <SidebarStepper
      open={props.open}
      onClose={props.onClose}
      onSubmit={updateAnalysis}
      initialValues={{
        name: props.name,
      }}
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
