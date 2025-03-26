/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  FormButtonBar,
  Sidebar,
  SidebarActions,
  SidebarContent,
  SidebarForm,
} from "@eshg/lib-employee-portal";
import { useSnackbar } from "@eshg/lib-portal/components/snackbar/SnackbarProvider";
import { Divider, Stack } from "@mui/joy";
import { Formik, useFormikContext } from "formik";
import { useCallback } from "react";

import { useAddAccessRestrictionMutation } from "@/lib/businessModules/measlesProtection/api/mutations/procedures";
import { DateAndButtonRow } from "@/lib/businessModules/measlesProtection/components/procedures/procedureDetails/DateAndButtonRow";
import { useSearchParam } from "@/lib/shared/hooks/searchParams/useSearchParam";

export const enum DateLabels {
  Today = "Heute",
}
export const ACCESS_RESTRICTION_FIELDS = {
  restrictionIssuedDate: {
    label: "Erteilungsdatum",
    requiredMessage: "Bitte ein Erteilungsdatum angeben.",
  },
  restrictionStartDate: {
    label: "Datum des Inkrafttretens",
    requiredMessage:
      "Bitte ein Datum angeben ab dem das Betretungsverbot wirksam wird.",
  },
  restrictionTerminationDate: {
    label: "Aufhebungsdatum",
  },
};
const fields = ACCESS_RESTRICTION_FIELDS;

export const initialValues = {
  restrictionIssuedDate: "",
  restrictionStartDate: "",
  restrictionTerminationDate: "",
} as const;

export function AccessRestrictionSidebar({ id }: { id: string }) {
  const snackbar = useSnackbar();
  const [_open, setOpen] = useSearchParam("add-access-restriction", "boolean");

  const addAccessRestriction = useAddAccessRestrictionMutation({
    onSuccess: () => {
      snackbar.confirmation("Betretungsverbot wurde erfolgreich angelegt.");
      setOpen(false);
    },
  });

  const handleSubmit = useCallback(
    (data: typeof initialValues) => {
      return addAccessRestriction.mutateAsync({
        id,
        data: {
          restrictionIssuedDate: new Date(data.restrictionIssuedDate),
          restrictionStartDate: new Date(data.restrictionStartDate),
          restrictionTerminationDate: data.restrictionTerminationDate
            ? new Date(data.restrictionTerminationDate)
            : undefined,
        },
      });
    },
    [addAccessRestriction, id],
  );

  return (
    <Formik initialValues={initialValues} onSubmit={handleSubmit}>
      <AccessRestrictionSidebarForm />
    </Formik>
  );
}

export function AccessRestrictionSidebarForm() {
  const {
    isSubmitting,
    handleSubmit: handleRawSubmit,
    setFieldValue,
    resetForm,
  } = useFormikContext<typeof initialValues>();
  const [open, setOpen] = useSearchParam("add-access-restriction", "boolean");
  const today = new Date().toISOString().slice(0, 10);

  const handleCancel = useCallback(() => {
    setOpen(false);
    resetForm();
  }, [resetForm, setOpen]);

  return (
    <Sidebar open={open} onClose={() => setOpen(false)}>
      <SidebarForm onSubmit={handleRawSubmit}>
        <SidebarContent title={"Betretungsverbot hinzufügen"}>
          <Stack gap={3}>
            <DateAndButtonRow
              onButtonClick={() =>
                setFieldValue("restrictionIssuedDate", today)
              }
              buttonLabel={DateLabels.Today}
              name="restrictionIssuedDate"
              label={fields.restrictionIssuedDate.label}
              required={fields.restrictionIssuedDate.requiredMessage}
            ></DateAndButtonRow>
            <DateAndButtonRow
              onButtonClick={() => setFieldValue("restrictionStartDate", today)}
              buttonLabel={DateLabels.Today}
              name="restrictionStartDate"
              label={fields.restrictionStartDate.label}
              required={fields.restrictionStartDate.requiredMessage}
            ></DateAndButtonRow>
            <Divider />
            <DateAndButtonRow
              onButtonClick={() =>
                setFieldValue("restrictionTerminationDate", today)
              }
              buttonLabel={DateLabels.Today}
              name="restrictionTerminationDate"
              label={fields.restrictionTerminationDate.label}
            ></DateAndButtonRow>
          </Stack>
        </SidebarContent>
        <SidebarActions>
          <FormButtonBar
            submitLabel="Hinzufügen"
            submitting={isSubmitting}
            onCancel={handleCancel}
          />
        </SidebarActions>
      </SidebarForm>
    </Sidebar>
  );
}
