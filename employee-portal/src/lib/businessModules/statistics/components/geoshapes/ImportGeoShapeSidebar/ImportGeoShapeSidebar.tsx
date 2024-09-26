/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useAddGeoShape } from "@/lib/businessModules/statistics/api/mutations/useAddGeoShape";
import { ImportGeoShapeStep } from "@/lib/businessModules/statistics/components/geoshapes/ImportGeoShapeSidebar/ImportGeoShapeStep";
import { SidebarStepper } from "@/lib/shared/components/SidebarStepper/SidebarStepper";

export interface AddGeoShapeValues {
  file: File | null;
  title: string;
}

export function ImportGeoShapeSidebar(props: {
  open: boolean;
  onClose: () => void;
}) {
  const initialValues: AddGeoShapeValues = {
    file: null,
    title: "",
  };

  const addGeoShape = useAddGeoShape();

  async function handleSubmit(values: AddGeoShapeValues) {
    await addGeoShape(values, {
      onSuccess: props.onClose,
    });
  }

  return (
    <SidebarStepper
      onClose={props.onClose}
      open={props.open}
      onSubmit={handleSubmit}
      initialValues={initialValues}
      steps={[
        {
          type: "StandardStep",
          step: {
            title: "Daten importieren",
            content: <ImportGeoShapeStep />,
          },
        },
      ]}
    />
  );
}
