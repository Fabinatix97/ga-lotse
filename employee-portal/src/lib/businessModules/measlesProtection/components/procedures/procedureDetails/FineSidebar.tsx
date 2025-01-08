/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { ApiCreateMonetaryFine } from "@eshg/employee-portal-api/measlesProtection";
import { useSnackbar } from "@eshg/lib-portal/components/snackbar/SnackbarProvider";
import { Stack } from "@mui/joy";
import { Formik, useFormikContext } from "formik";
import { useCallback } from "react";

import { useAddFineMutation } from "@/lib/businessModules/measlesProtection/api/mutations/procedures";
import { DateAndButtonRow } from "@/lib/businessModules/measlesProtection/components/procedures/procedureDetails/DateAndButtonRow";
import { FormButtonBar } from "@/lib/shared/components/form/FormButtonBar";
import { SidebarForm } from "@/lib/shared/components/form/SidebarForm";
import { Sidebar } from "@/lib/shared/components/sidebar/Sidebar";
import { SidebarActions } from "@/lib/shared/components/sidebar/SidebarActions";
import { SidebarContent } from "@/lib/shared/components/sidebar/SidebarContent";
import { useSearchParam } from "@/lib/shared/hooks/searchParams/useSearchParam";

const initialValues = {
  fineIssuedDate: "",
};

export function FineSidebar({ id }: { id: string }) {
  const [_openFine, setOpenFine] = useSearchParam("add-fine", "boolean");
  const snackbar = useSnackbar();

  const addFine = useAddFineMutation({
    onSuccess: () => {
      snackbar.confirmation("Bußgeld wurde erfolgreich erteilt.");
      setOpenFine(false);
    },
  });

  const handleSubmit = useCallback(
    (data: typeof initialValues) => {
      return addFine.mutateAsync({
        id,
        data: {
          fineIssuedDate: new Date(data.fineIssuedDate),
        } as ApiCreateMonetaryFine,
      });
    },
    [addFine, id],
  );

  return (
    <Formik initialValues={initialValues} onSubmit={handleSubmit}>
      <FineSidebarForm />
    </Formik>
  );
}

function FineSidebarForm() {
  const {
    isSubmitting,
    handleSubmit: handleRawSubmit,
    setFieldValue,
    resetForm,
  } = useFormikContext<typeof initialValues>();
  const [openFine, setOpenFine] = useSearchParam("add-fine", "boolean");
  const today = new Date().toISOString().slice(0, 10);

  const handleCancel = useCallback(() => {
    setOpenFine(false);
    resetForm();
  }, [resetForm, setOpenFine]);

  return (
    <Sidebar open={openFine} onClose={handleCancel}>
      <SidebarForm onSubmit={handleRawSubmit}>
        <SidebarContent title={"Bußgeld erteilen"}>
          <Stack gap={3}>
            <DateAndButtonRow
              buttonLabel="Heute"
              onButtonClick={() => setFieldValue("fineIssuedDate", today)}
              name="fineIssuedDate"
              label="Erteilungsdatum"
              required="Bitte ein Erteilungsdatum angeben."
            ></DateAndButtonRow>
          </Stack>
        </SidebarContent>
        <SidebarActions>
          <FormButtonBar
            submitLabel="Speichern"
            submitting={isSubmitting}
            onCancel={handleCancel}
          />
        </SidebarActions>
      </SidebarForm>
    </Sidebar>
  );
}
