/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { ApiGetReferencePersonResponse } from "@eshg/base-api";
import {
  DefaultPersonFormValues,
  PersonSidebar,
  PersonSidebarProps,
  SidebarWithFormRefProps,
  useSidebarWithFormRef,
} from "@eshg/lib-employee-portal";
import { ApiPostEmployeeOmsProcedureRequest } from "@eshg/official-medical-service-api";
import { Add } from "@mui/icons-material";
import { Button } from "@mui/joy";
import { useRouter } from "next/navigation";

import { usePostEmployeeProcedure } from "@/lib/businessModules/officialMedicalService/api/mutations/employeeOmsProcedureApi";
import {
  mapToAffectedPerson,
  mapToCreateProcedureRequest,
} from "@/lib/businessModules/officialMedicalService/shared/helpers";
import { routes } from "@/lib/businessModules/officialMedicalService/shared/routes";

export function CreateProcedure() {
  const personSidebar = useSidebarWithFormRef({
    component: ConfiguredPersonSidebar,
  });

  return (
    <Button startDecorator={<Add />} onClick={() => personSidebar.open()}>
      Neuen Vorgang anlegen
    </Button>
  );
}

function ConfiguredPersonSidebar(props: SidebarWithFormRefProps) {
  const router = useRouter();
  const postEmployeeProcedure = usePostEmployeeProcedure();

  async function createProcedureWithNewPerson(person: DefaultPersonFormValues) {
    const request: ApiPostEmployeeOmsProcedureRequest =
      mapToCreateProcedureRequest(person);
    await postEmployeeProcedure.mutateAsync(request, {
      onSuccess: (response) => {
        if (response) {
          router.push(routes.procedures.byId(response).details);
        }
      },
    });
  }

  async function createProcedureWithExistingPerson(
    person: ApiGetReferencePersonResponse,
  ) {
    const request: ApiPostEmployeeOmsProcedureRequest = {
      affectedPerson: mapToAffectedPerson(person),
    };
    await postEmployeeProcedure.mutateAsync(request, {
      onSuccess: (response) => {
        if (response) {
          router.push(routes.procedures.byId(response).details);
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
    title: "Vorgang anlegen",
    submitLabel: "Vorgang anlegen",
    addressRequired: true,
    ...props,
  };

  return <PersonSidebar {...personSidebarProps} />;
}
