/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useAddGeoShape } from "@/lib/businessModules/statistics/api/mutations/useAddGeoShape";
import { ImportGeoShapeStep } from "@/lib/businessModules/statistics/components/geoshapes/ImportGeoShapeSidebar/ImportGeoShapeStep";
import {
  SidebarStepper,
  createStepContent,
} from "@/lib/shared/components/SidebarStepper/SidebarStepper";
import {
  SidebarWithFormRefProps,
  UseSidebarWithFormRefResult,
  useSidebarWithFormRef,
} from "@/lib/shared/hooks/useSidebarWithFormRef";

export interface AddGeoShapeValues {
  file: File | null;
  title: string;
}

export function useImportGeoShapeSidebar(): UseSidebarWithFormRefResult<SidebarWithFormRefProps> {
  return useSidebarWithFormRef({
    component: ImportGeoShapeSidebar,
  });
}

function ImportGeoShapeSidebar(props: SidebarWithFormRefProps) {
  const initialValues: AddGeoShapeValues = {
    file: null,
    title: "",
  };

  const addGeoShape = useAddGeoShape();

  async function handleSubmit(values: [AddGeoShapeValues]) {
    await addGeoShape(values[0], {
      onSuccess: () => props.onClose(true),
    });
  }

  return (
    <SidebarStepper
      onClose={props.onClose}
      formRef={props.formRef}
      onSubmit={handleSubmit}
      steps={[
        () => ({
          title: "Daten importieren",
          content: createStepContent({
            component: ImportGeoShapeStep,
          }),
          initialValues,
        }),
      ]}
    />
  );
}
