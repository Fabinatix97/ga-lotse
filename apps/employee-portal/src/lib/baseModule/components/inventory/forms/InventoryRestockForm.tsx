/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Stack } from "@mui/joy";
import { Formik } from "formik";
import { Ref } from "react";

import {
  MultiFormButtonBar,
  SidebarActions,
  SidebarContent,
  SidebarForm,
  SidebarFormHandle,
} from "@eshg/lib-employee-portal";
import {
  NumberField,
  OptionalFieldValue,
  validatePositiveInteger,
} from "@eshg/lib-portal";

import { DetailsCell } from "@/lib/shared/components/detailsSection/DetailsCell";

interface InventoryManagementValues {
  count: OptionalFieldValue<number>;
}

const emptyValues: InventoryManagementValues = {
  count: "",
};

interface InventoryRestockFormProps {
  onSubmit: (values: InventoryManagementValues) => Promise<void>;
  onClose: () => void;
  formRef: Ref<SidebarFormHandle>;
  minCount: number;
}

export function InventoryRestockForm(props: InventoryRestockFormProps) {
  return (
    <Formik
      initialValues={emptyValues}
      enableReinitialize
      onSubmit={props.onSubmit}
    >
      {({ isSubmitting }) => (
        <SidebarForm ref={props.formRef}>
          <SidebarContent title="Inventar auffüllen">
            <Stack gap={2}>
              <DetailsCell
                name="minCount"
                label="Mindestbestand"
                value={props.minCount}
              />
              <NumberField
                name="count"
                label="Menge"
                required="Bitte eine Menge angeben"
                validate={validatePositiveInteger}
              />
            </Stack>
          </SidebarContent>
          <SidebarActions>
            <MultiFormButtonBar
              submitLabel="Auffüllen"
              submitting={isSubmitting}
              onCancel={props.onClose}
            />
          </SidebarActions>
        </SidebarForm>
      )}
    </Formik>
  );
}
