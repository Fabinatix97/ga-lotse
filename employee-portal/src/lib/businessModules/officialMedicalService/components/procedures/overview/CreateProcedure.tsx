/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import {
  ApiAddPersonFileStateRequest,
  ApiGetReferencePersonResponse,
} from "@eshg/employee-portal-api/base";
import {
  ApiAffectedPerson,
  ApiPostEmployeeOmsProcedureRequest,
} from "@eshg/employee-portal-api/officialMedicalService";
import { useSnackbar } from "@eshg/lib-portal/components/snackbar/SnackbarProvider";
import { Add } from "@mui/icons-material";
import { Button } from "@mui/joy";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";

import { usePostEmployeeProcedure } from "@/lib/businessModules/officialMedicalService/api/mutations/employeeOmsProcedureApi";
import { routes } from "@/lib/businessModules/officialMedicalService/shared/routes";
import { useConfirmationDialog } from "@/lib/shared/components/confirmationDialog/ConfirmationDialogProvider";
import { SidebarFormHandle } from "@/lib/shared/components/form/SidebarForm";
import { PersonSidebar } from "@/lib/shared/components/personSidebar/PersonSidebar";
import { DefaultPersonFormValues } from "@/lib/shared/components/personSidebar/form/DefaultPersonForm";
import { mapToPersonAddRequest } from "@/lib/shared/components/personSidebar/helpers";
import { Sidebar } from "@/lib/shared/components/sidebar/Sidebar";

export function CreateProcedure() {
  const router = useRouter();
  const postEmployeeProcedure = usePostEmployeeProcedure();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const sidebarFormRef = useRef<SidebarFormHandle>(null);
  const { openCancelDialog } = useConfirmationDialog();
  const snackbar = useSnackbar();

  async function createProcedureWithNewPerson(person: DefaultPersonFormValues) {
    const request: ApiPostEmployeeOmsProcedureRequest =
      mapToCreateProcedureRequest(person);
    await postEmployeeProcedure.mutateAsync(request, {
      onSuccess: (response) => {
        if (response) {
          snackbar.confirmation("Vorgang wurde angelegt");
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
          snackbar.confirmation("Vorgang wurde angelegt");
          router.push(routes.procedures.byId(response).details);
        }
      },
    });
  }

  function openSidebar() {
    setSidebarOpen(true);
  }

  function closeSidebar() {
    setSidebarOpen(false);
  }

  function handleClose() {
    if (sidebarFormRef.current?.dirty) {
      openCancelDialog({
        onConfirm: closeSidebar,
      });
    } else {
      closeSidebar();
    }
  }

  return (
    <>
      <Button startDecorator={<Add />} onClick={() => openSidebar()}>
        Neuen Vorgang anlegen
      </Button>
      <Sidebar open={sidebarOpen} onClose={handleClose}>
        <PersonSidebar
          onCancel={handleClose}
          onSelect={async (values) => {
            await createProcedureWithExistingPerson(values.person);
            closeSidebar();
            return Promise.resolve();
          }}
          onCreate={async (values) => {
            await createProcedureWithNewPerson(values.createInputs);
            closeSidebar();
            return Promise.resolve();
          }}
          sidebarFormRef={sidebarFormRef}
          title={"Vorgang anlegen"}
          submitLabel={"Vorgang anlegen"}
          addressRequired
        />
      </Sidebar>
    </>
  );
}

function mapToAffectedPerson(
  person: ApiAddPersonFileStateRequest,
): ApiAffectedPerson {
  return {
    ...person,
    contactAddress: person.contactAddress!,
  };
}

function mapToCreateProcedureRequest(
  values: DefaultPersonFormValues,
): ApiPostEmployeeOmsProcedureRequest {
  const person = mapToPersonAddRequest(values);
  return {
    affectedPerson: mapToAffectedPerson(person),
  };
}
