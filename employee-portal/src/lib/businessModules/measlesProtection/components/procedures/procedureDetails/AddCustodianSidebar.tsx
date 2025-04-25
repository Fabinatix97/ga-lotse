/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { FormikErrors } from "formik";

import { useSnackbar } from "@eshg/lib-portal/components/snackbar/SnackbarProvider";
import { isAdult } from "@eshg/lib-portal/helpers/dateTime";
import { ApiDraftMeaslesProcedure } from "@eshg/measles-protection-api";

import { useAddCustodianMutation } from "@/lib/businessModules/measlesProtection/api/mutations/procedures";
import { LegacyPersonSidebar } from "@/lib/shared/components/legacyPersonSidebar/LegacyPersonSidebar";
import { LegacyPerson } from "@/lib/shared/components/legacyPersonSidebar/form/LegacyPersonForm";
import { useSearchParam } from "@/lib/shared/hooks/searchParams/useSearchParam";

import {
  MEASLES_PROTECTION_CUSTODIAN_CONFIG,
  mapToAddCustodianRequest,
} from "./NewCustodianButton";

export function AddCustodianSidebar({
  procedure,
}: {
  procedure: ApiDraftMeaslesProcedure;
}) {
  const [open, setOpen] = useSearchParam("add-custodian", "boolean");
  const snackbar = useSnackbar();
  function handleClose() {
    setOpen(false);
  }

  function validateCustodianAge(person: LegacyPerson) {
    const errors: FormikErrors<LegacyPerson> = {};
    if (!isAdult(new Date(person.dateOfBirth))) {
      errors.dateOfBirth = "Personensorgeberechtigte müssen volljährig sein.";
    }
    return errors;
  }

  const addCustodian = useAddCustodianMutation({
    onSuccess: () => {
      setOpen(false);
      snackbar.confirmation("Personensorgeberechtigte:r erfolgreich angelegt.");
    },
  });

  return (
    <LegacyPersonSidebar
      searchFormTitle={"PSB hinzufügen"}
      personFormTitle={"PSB anlegen"}
      config={MEASLES_PROTECTION_CUSTODIAN_CONFIG}
      open={open}
      validate={validateCustodianAge}
      onSubmit={(data) =>
        addCustodian.mutateAsync({
          procedureId: procedure.id,
          data: mapToAddCustodianRequest(data),
        })
      }
      onClose={handleClose}
    />
  );
}
