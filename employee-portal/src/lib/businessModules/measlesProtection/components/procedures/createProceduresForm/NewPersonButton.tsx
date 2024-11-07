/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import type { ApiGetReferencePersonResponse } from "@eshg/employee-portal-api/base";
import { type ApiAffectedPersonDetails } from "@eshg/employee-portal-api/measlesProtection";
import { useSnackbar } from "@eshg/lib-portal/components/snackbar/SnackbarProvider";
import { mapOptionalValue } from "@eshg/lib-portal/helpers/form";
import { Add } from "@mui/icons-material";
import { Button } from "@mui/joy";
import { useRouter } from "next/navigation";
import { useState } from "react";

import {
  useCreateDraftProcedureMutation,
  useProceduresForPersonSearch,
} from "@/lib/businessModules/measlesProtection/api/mutations/procedures";
import { reportingReasonNames } from "@/lib/businessModules/measlesProtection/components/procedures/constants";
import { mapToApiPersonAddress } from "@/lib/businessModules/measlesProtection/shared/helpers";
import { routes } from "@/lib/businessModules/measlesProtection/shared/routes";
import { LegacyPersonSidebar } from "@/lib/shared/components/legacyPersonSidebar/LegacyPersonSidebar";
import {
  LegacyPerson,
  LegacyPersonFormConfig,
  PERSON_VALUES,
} from "@/lib/shared/components/legacyPersonSidebar/form/LegacyPersonForm";

export const MEASLES_PROTECTION_AFFECTED_PERSON_CONFIG: LegacyPersonFormConfig =
  {
    hiddenFields: ["billingAddress"],
    optionalFields: [
      "salutation",
      "title",
      "gender",
      "nameAtBirth",
      "placeOfBirth",
      "countryOfBirth",
      "phoneNumbers",
      "emailAddresses",
    ],
    disabledFields: ["firstName", "lastName", "dateOfBirth"],
  };

function mapToApiAffectedPersonDetails(
  basePerson: LegacyPerson,
): ApiAffectedPersonDetails {
  return {
    ...PERSON_VALUES,
    salutation: basePerson.salutation,
    title: basePerson.title,
    firstName: basePerson.firstName,
    lastName: basePerson.lastName,
    dateOfBirth: new Date(basePerson.dateOfBirth),
    gender: basePerson.gender,
    nameAtBirth: basePerson.nameAtBirth,
    placeOfBirth: basePerson.placeOfBirth,
    countryOfBirth: mapOptionalValue(basePerson.countryOfBirth),
    address: mapToApiPersonAddress(basePerson.postalAddress),
    phoneNumbers: excludeEmptyStrings(basePerson?.phoneNumbers),
    emailAddresses: excludeEmptyStrings(basePerson?.emailAddresses),
  };
}

function excludeEmptyStrings(strings?: string[]): string[] | undefined {
  return strings?.map((a) => a.trim()).filter((a) => a.length > 0);
}

export function NewPersonButton() {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const snackbar = useSnackbar();

  function handleClose() {
    setOpen(false);
  }

  const procedureSearch = useProceduresForPersonSearch();

  function listProceduresForPerson(person: ApiGetReferencePersonResponse) {
    return procedureSearch.mutateAsync(person).then(
      ({ procedures }) =>
        procedures.map((procedure) => {
          return {
            link: routes.procedures.details(procedure.externalId).index,
            reportingDate: procedure.reportingDate,
            reportingReason: procedure.reportingReason
              ? reportingReasonNames[procedure.reportingReason]
              : undefined,
            status: procedure.procedureStatus,
          };
        }) ?? [],
    );
  }

  const createDraftProcedureMutation = useCreateDraftProcedureMutation({
    onSuccess: (response) => {
      snackbar.confirmation("Vorgang erfolgreich angelegt.");
      // Todo: redirect is sluggish
      if (response) {
        router.push(routes.procedures.draft(response.id));
      }
      handleClose();
    },
  });

  function createDraftProcedure(person: LegacyPerson) {
    return createDraftProcedureMutation.mutateAsync({
      person: mapToApiAffectedPersonDetails(person),
    });
  }

  return (
    <>
      <Button startDecorator={<Add />} onClick={() => setOpen(true)}>
        Neuen Vorgang anlegen
      </Button>
      <LegacyPersonSidebar
        searchFormTitle={"Neuen Vorgang anlegen"}
        personFormTitle={"Person anlegen"}
        config={MEASLES_PROTECTION_AFFECTED_PERSON_CONFIG}
        open={open}
        onSubmit={createDraftProcedure}
        onClose={handleClose}
        listProcedures={listProceduresForPerson}
      />
    </>
  );
}
