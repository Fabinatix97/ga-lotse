/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { Grid } from "@mui/joy";
import { Formik } from "formik";

import { ApiUpdateInspectionModifyInventoryRequest } from "@eshg/inspection-api";
import {
  FormButtonBar,
  OverlayBoundary,
  Sidebar,
  SidebarActions,
  SidebarContent,
  SidebarForm,
} from "@eshg/lib-employee-portal";
import { NumberField } from "@eshg/lib-portal/components/formFields/NumberField";
import { SelectField } from "@eshg/lib-portal/components/formFields/SelectField";
import { validateRange } from "@eshg/lib-portal/helpers/validators";

import { useModifyInventory } from "@/lib/businessModules/inspection/api/mutations/inventory";
import { useGetInventoryItems } from "@/lib/businessModules/inspection/api/queries/inventory";

export interface InventorySidebarProps {
  open: boolean;
  onClose: () => void;
  procedureId: string;
}

type InventoryFormType = {
  [K in keyof ApiUpdateInspectionModifyInventoryRequest]:
    | ApiUpdateInspectionModifyInventoryRequest[K]
    | "";
};

const INITIAL_VALUES: InventoryFormType = { inventoryId: "", count: "" };

export function InventorySidebar(props: InventorySidebarProps) {
  return (
    <OverlayBoundary>
      <InventorySidebarWithQueryAndMutations {...props} />
    </OverlayBoundary>
  );
}

function InventorySidebarWithQueryAndMutations({
  open,
  onClose,
  procedureId,
}: Readonly<InventorySidebarProps>) {
  const { data: inventoryItems } = useGetInventoryItems();
  const { mutateAsync: modifyInventory } = useModifyInventory();

  const inventoryTypeOptions = inventoryItems.map((item) => {
    return { label: item.name + " - Bestand: " + item.count, value: item.id };
  });

  async function handleSubmit(values: InventoryFormType) {
    await modifyInventory(
      {
        id: procedureId,
        apiUpdateInspectionModifyInventoryRequest:
          values as ApiUpdateInspectionModifyInventoryRequest,
      },
      {
        onSuccess: onClose,
      },
    );
  }

  function getMaxCount(inventoryId: string) {
    return (
      inventoryItems.find((item) => item.id === inventoryId)?.count ?? Infinity
    );
  }

  return (
    <Sidebar open={open} onClose={onClose}>
      <Formik initialValues={INITIAL_VALUES} onSubmit={handleSubmit}>
        {({ isSubmitting, handleSubmit, values }) => (
          <SidebarForm onSubmit={handleSubmit}>
            <SidebarContent title={"Inventar hinzufügen"}>
              <Grid container columnSpacing={2} rowSpacing={3}>
                <Grid xs={12}>
                  <SelectField
                    name="inventoryId"
                    label="Inventar auswählen"
                    options={inventoryTypeOptions}
                    required="Bitte Inventar auswählen."
                  />
                </Grid>
                <Grid xs={12}>
                  <NumberField
                    name="count"
                    label="Anzahl"
                    required="Bitte Anzahl angeben"
                    sx={{ maxWidth: 100 }}
                    validate={validateRange(1, getMaxCount(values.inventoryId))}
                  />
                </Grid>
              </Grid>
            </SidebarContent>
            <SidebarActions>
              <FormButtonBar
                submitLabel="Hinzufügen"
                submitting={isSubmitting}
                onCancel={onClose}
              />
            </SidebarActions>
          </SidebarForm>
        )}
      </Formik>
    </Sidebar>
  );
}
