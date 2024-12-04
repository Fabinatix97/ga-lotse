/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { PostEmployeeProcedureRequest } from "@eshg/employee-portal-api/officialMedicalService";
import { Add } from "@mui/icons-material";
import { Button } from "@mui/joy";
import { useRouter } from "next/navigation";

import { usePostEmployeeProcedure } from "@/lib/businessModules/officialMedicalService/api/mutations/employeeOmsProcedureApi";
import { routes } from "@/lib/businessModules/officialMedicalService/shared/routes";

export function CreateProcedure() {
  const router = useRouter();
  const postEmployeeProcedure = usePostEmployeeProcedure();

  async function createProcedure() {
    const request: PostEmployeeProcedureRequest = { body: {} };
    await postEmployeeProcedure.mutateAsync(request, {
      onSuccess: (response) => {
        if (response) {
          router.push(routes.procedures.byId(response).details);
        }
      },
    });
  }

  return (
    <Button startDecorator={<Add />} onClick={() => createProcedure()}>
      Neuen Vorgang anlegen
    </Button>
  );
}
