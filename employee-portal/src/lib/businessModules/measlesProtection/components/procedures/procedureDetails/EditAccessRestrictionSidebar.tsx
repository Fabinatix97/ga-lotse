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
import { formatDate } from "@eshg/lib-portal/formatters/dateTime";
import { isDateString } from "@eshg/lib-portal/helpers/dateTime";
import {
  ApiAccessRestriction,
  ApiMeaslesProtectionProcedure,
} from "@eshg/measles-protection-api";
import { Divider, Stack } from "@mui/joy";
import { formatISO } from "date-fns";
import { Formik, useFormikContext } from "formik";
import { useCallback } from "react";

import { useUpdateAccessRestrictionMutation } from "@/lib/businessModules/measlesProtection/api/mutations/procedures";
import { DateAndButtonRow } from "@/lib/businessModules/measlesProtection/components/procedures/procedureDetails/DateAndButtonRow";
import { DetailsCell } from "@/lib/shared/components/detailsSection/DetailsCell";
import { useSearchParam } from "@/lib/shared/hooks/searchParams/useSearchParam";

import {
  ACCESS_RESTRICTION_FIELDS,
  DateLabels,
} from "./AccessRestrictionSidebar";

export const EDIT_ACCESS_RESTRICTION_SEARCH_PARAM = "edit-access-restriction";
export const initialValues = {
  restrictionTerminationDate: "",
} as const;
const fields = ACCESS_RESTRICTION_FIELDS;

export function EditAccessRestrictionSidebar({
  procedure: { accessRestriction, id },
}: {
  procedure: ApiMeaslesProtectionProcedure;
}) {
  const snackbar = useSnackbar();
  const [_open, setOpen] = useSearchParam(
    EDIT_ACCESS_RESTRICTION_SEARCH_PARAM,
    "boolean",
  );

  const updateAccessRestriction = useUpdateAccessRestrictionMutation({
    onSuccess: () => {
      snackbar.confirmation("Betretungsverbot wurde erfolgreich aktualisiert.");
      setOpen(false);
    },
  });

  const handleSubmit = useCallback(
    (data: typeof initialValues) => {
      return updateAccessRestriction.mutateAsync({
        id,
        data: {
          restrictionTerminationDate: new Date(data.restrictionTerminationDate),
        },
      });
    },
    [updateAccessRestriction, id],
  );

  if (!accessRestriction) return;

  return (
    <Formik initialValues={initialValues} onSubmit={handleSubmit}>
      <EditAccessRestrictionSidebarForm accessRestriction={accessRestriction} />
    </Formik>
  );
}

export function EditAccessRestrictionSidebarForm({
  accessRestriction,
}: {
  accessRestriction: ApiAccessRestriction;
}) {
  const {
    isSubmitting,
    handleSubmit: handleRawSubmit,
    setFieldValue,
    resetForm,
  } = useFormikContext<typeof initialValues>();
  const [open, setOpen] = useSearchParam(
    EDIT_ACCESS_RESTRICTION_SEARCH_PARAM,
    "boolean",
  );
  const today = formatISO(new Date(), { representation: "date" });

  const handleCancel = useCallback(() => {
    setOpen(false);
    resetForm();
  }, [resetForm, setOpen]);

  function validateDateString(value: string): string | undefined {
    if (value === undefined || value === "" || !isDateString(value)) {
      return "Bitte ein gültiges Datum angeben.";
    }
    return undefined;
  }

  return (
    <Sidebar open={open} onClose={() => setOpen(false)}>
      <SidebarForm onSubmit={handleRawSubmit}>
        <SidebarContent title={"Betretungsverbot bearbeiten"}>
          <Stack gap={3}>
            <DetailsCell
              label={fields.restrictionIssuedDate.label}
              value={formatDate(accessRestriction.restrictionIssuedDate)}
            />
            <DetailsCell
              label={fields.restrictionStartDate.label}
              value={formatDate(accessRestriction.restrictionStartDate)}
            />
            <Divider />
            <DateAndButtonRow
              onButtonClick={() =>
                setFieldValue("restrictionTerminationDate", today)
              }
              buttonLabel={DateLabels.Today}
              name="restrictionTerminationDate"
              label={fields.restrictionTerminationDate.label}
              validate={validateDateString}
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
