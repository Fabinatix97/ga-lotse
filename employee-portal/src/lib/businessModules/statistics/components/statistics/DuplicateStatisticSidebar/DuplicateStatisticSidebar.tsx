/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useDuplicateStatistic } from "@/lib/businessModules/statistics/api/mutations/useDuplicateStatistic";
import { SidebarStepper } from "@/lib/businessModules/statistics/components/shared/SidebarStepper/SidebarStepper";
import { SidebarStep } from "@/lib/businessModules/statistics/components/shared/SidebarStepper/sidebarStep";
import { DuplicateStatisticFormModel } from "@/lib/businessModules/statistics/components/statistics/DuplicateStatisticSidebar/duplicateStatisticFormModel";
import { UpdateDiagramFormModel } from "@/lib/businessModules/statistics/components/statistics/details/UpdateDiagramSidebar/updateDiagramFormModel";

import { DuplicateStatisticStep } from "./DuplicateStatisticStep";

export interface OriginalStatistic {
  id: string;
  name: string;
  timeRangeStart: Date;
  timeRangeEnd: Date;
}

export function DuplicateStatisticSidebar(props: {
  onClose: () => void;
  originalStatistic: OriginalStatistic;
}) {
  const duplicateStatistic = useDuplicateStatistic({
    onSuccess: props.onClose,
  });
  const defaultNewStatisticName = `${props.originalStatistic.name} - Kopie`;

  async function handleSubmit(model: DuplicateStatisticFormModel) {
    const newStatisticName =
      model.name === "" ? defaultNewStatisticName : model.name;
    await duplicateStatistic({
      originalStatisticId: props.originalStatistic.id,
      clonedStatisticName: newStatisticName,
    });
  }

  return (
    <SidebarStepper
      open={true}
      onClose={props.onClose}
      onSubmit={handleSubmit}
      initialValues={{
        name: "",
      }}
      steps={
        [
          {
            type: "StandardStep",
            step: {
              title: "Statistik duplizieren",
              content: (
                <DuplicateStatisticStep
                  originalStatistic={props.originalStatistic}
                  defaultNewStatisticName={defaultNewStatisticName}
                />
              ),
            },
          },
        ] satisfies SidebarStep<UpdateDiagramFormModel>[]
      }
    />
  );
}
