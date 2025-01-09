/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import {
  ApiCreatePerson,
  ApiCreateProcedureRequest,
  ApiSchoolEntryProcedureType,
} from "@eshg/employee-portal-api/schoolEntry";
import { SelectField } from "@eshg/lib-portal/components/formFields/SelectField";
import { mapRequiredValue } from "@eshg/lib-portal/helpers/form";
import { OptionalFieldValue } from "@eshg/lib-portal/types/form";
import { Add } from "@mui/icons-material";
import { Button } from "@mui/joy";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";

import { useSchoolEntryApi } from "@/lib/businessModules/schoolEntry/api/clients";
import { useCreateProcedure } from "@/lib/businessModules/schoolEntry/api/mutations/schoolEntryApi";
import { getProceduresByPersonQuery } from "@/lib/businessModules/schoolEntry/api/queries/schoolEntryApi";
import { ProcedureCard } from "@/lib/businessModules/schoolEntry/features/procedures/new/ProcedureCard";
import { BUTTON_SIZE } from "@/lib/businessModules/schoolEntry/features/procedures/new/constants";
import { PROCEDURE_TYPE_OPTIONS_EXCLUDING_DRAFT } from "@/lib/businessModules/schoolEntry/features/procedures/options";
import { routes } from "@/lib/businessModules/schoolEntry/shared/routes";
import { SidebarFormHandle } from "@/lib/shared/components/form/SidebarForm";
import { PersonSidebar } from "@/lib/shared/components/personSidebar/PersonSidebar";
import { mapToPersonAddRequest } from "@/lib/shared/components/personSidebar/helpers";
import {
  DefaultSearchPersonForm,
  defaultSearchPersonValues,
} from "@/lib/shared/components/personSidebar/search/DefaultSearchPersonForm";
import { DefaultSearchPersonFormFields } from "@/lib/shared/components/personSidebar/search/DefaultSearchPersonFormFields";
import {
  SearchPersonFormProps,
  SearchPersonFormValues,
} from "@/lib/shared/components/personSidebar/search/SearchPersonSidebar";
import { Sidebar } from "@/lib/shared/components/sidebar/Sidebar";
import { useConfirmationDialog } from "@/lib/shared/hooks/useConfirmationDialog";

interface EsuSearchForm extends SearchPersonFormValues {
  type: OptionalFieldValue<ApiSchoolEntryProcedureType>;
}

const personSearchFormInitialValues: EsuSearchForm = {
  ...defaultSearchPersonValues(),
  type: "",
};

function ProcedureTypeField() {
  return (
    <SelectField
      name="type"
      label="Art"
      options={PROCEDURE_TYPE_OPTIONS_EXCLUDING_DRAFT}
      required="Bitte die Art des Vorgangs auswählen."
    />
  );
}

function EsuSearchFormComponent(props: SearchPersonFormProps<EsuSearchForm>) {
  return (
    <DefaultSearchPersonForm {...props}>
      <ProcedureTypeField />
      <DefaultSearchPersonFormFields />
    </DefaultSearchPersonForm>
  );
}

export function CreateProcedureSidebar() {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const createProcedure = useCreateProcedure();
  const sidebarFormRef = useRef<SidebarFormHandle>(null);
  const { openCancelDialog } = useConfirmationDialog();

  function closeSidebar() {
    setOpen(false);
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

  async function handleCreate(
    child: ApiCreatePerson,
    type: OptionalFieldValue<ApiSchoolEntryProcedureType>,
  ) {
    await createProcedure.mutateAsync(
      mapToCreateProcedureRequest(child, type),
      {
        onSuccess: (response) => {
          closeSidebar();
          router.push(routes.procedures.byId(response.procedureId).details);
        },
      },
    );
  }
  const schoolEntryApi = useSchoolEntryApi();
  return (
    <>
      <Button
        startDecorator={<Add />}
        onClick={() => setOpen(true)}
        size={BUTTON_SIZE}
      >
        Neuen Vorgang anlegen
      </Button>

      <Sidebar open={open} onClose={handleClose}>
        {open && (
          <PersonSidebar
            title={"Neuen Vorgang anlegen"}
            onCancel={handleClose}
            onCreate={async ({ searchInputs, createInputs }) => {
              await handleCreate(
                mapToPersonAddRequest(createInputs),
                searchInputs.type,
              );
            }}
            onSelect={async ({ searchInputs, person }) => {
              await handleCreate(
                mapToPersonAddRequest(person),
                searchInputs.type,
              );
            }}
            submitLabel={"Vorgang anlegen"}
            sidebarFormRef={sidebarFormRef}
            searchFormComponent={EsuSearchFormComponent}
            initialSearchState={personSearchFormInitialValues}
            addressRequired
            associatedProcedures={{
              getQuery: (personId) =>
                getProceduresByPersonQuery(schoolEntryApi, personId),
              cardComponent: ProcedureCard,
            }}
          />
        )}
      </Sidebar>
    </>
  );
}

function mapToCreateProcedureRequest(
  child: ApiCreatePerson,
  procedureType: OptionalFieldValue<ApiSchoolEntryProcedureType>,
): ApiCreateProcedureRequest {
  return {
    type: mapRequiredValue(procedureType),
    child,
  };
}
