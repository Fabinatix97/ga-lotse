/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { Add } from "@mui/icons-material";
import { Button } from "@mui/joy";
import { useRouter } from "next/navigation";

import type { ApiGetReferencePersonResponse } from "@eshg/base-api";
import {
  DefaultPersonFormValues,
  PersonSidebar,
  PersonSidebarProps,
  SidebarWithFormRefProps,
  useSidebarWithFormRef,
} from "@eshg/lib-employee-portal";

import { useProtectionProcedureApi } from "@/lib/businessModules/measlesProtection/api/clients";
import { useCreateDraftProcedure } from "@/lib/businessModules/measlesProtection/api/mutations/procedures";
import { getProceduresByPersonQuery } from "@/lib/businessModules/measlesProtection/api/queries/procedures";
import { ProcedureCard } from "@/lib/businessModules/measlesProtection/components/procedures/createProceduresForm/ProcedureCard";
import {
  mapToAffectedPerson,
  mapToCreateProcedureRequest,
} from "@/lib/businessModules/measlesProtection/shared/helpers";
import { routes } from "@/lib/businessModules/measlesProtection/shared/routes";

export function NewPersonButton() {
  const personSidebar = useSidebarWithFormRef({
    component: ConfiguredPersonSidebar,
  });

  return (
    <Button startDecorator={<Add />} onClick={() => personSidebar.open()}>
      Neuen Vorgang anlegen
    </Button>
  );
}

function ConfiguredPersonSidebar(props: Readonly<SidebarWithFormRefProps>) {
  const router = useRouter();
  const protectionProcedureApi = useProtectionProcedureApi();
  const createDraftProcedure = useCreateDraftProcedure();

  async function createProcedureWithNewPerson(person: DefaultPersonFormValues) {
    const request = mapToCreateProcedureRequest(person);
    await createDraftProcedure.mutateAsync(request, {
      onSuccess: (response) => {
        if (response) {
          router.push(routes.procedures.draft(response.id).index);
        }
      },
    });
  }

  async function createProcedureWithExistingPerson(
    person: ApiGetReferencePersonResponse,
  ) {
    const request = { person: mapToAffectedPerson(person) };
    await createDraftProcedure.mutateAsync(request, {
      onSuccess: (response) => {
        if (response) {
          router.push(routes.procedures.draft(response.id).index);
        }
      },
    });
  }

  const personSidebarProps: PersonSidebarProps = {
    onSelect: async (values) => {
      await createProcedureWithExistingPerson(values.person);
    },
    onCreate: async (values) => {
      await createProcedureWithNewPerson(values.createInputs);
    },
    title: "Neuen Vorgang anlegen",
    submitLabel: "Anlegen",
    addressRequired: true,
    associatedProcedures: {
      getQuery: (personId) =>
        getProceduresByPersonQuery(protectionProcedureApi, personId),
      cardComponent: ProcedureCard,
      allowSaveWithExistingProcedures: true,
    },
    ...props,
  };

  return <PersonSidebar {...personSidebarProps} />;
}
