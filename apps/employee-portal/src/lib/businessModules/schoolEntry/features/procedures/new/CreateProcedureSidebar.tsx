/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { Add } from "@mui/icons-material";
import { Button } from "@mui/joy";
import { useRouter } from "next/navigation";

import {
  DefaultPersonFormValues,
  DefaultSearchPersonForm,
  DefaultSearchPersonFormFields,
  PersonSidebar,
  PersonSidebarProps,
  SearchPersonFormProps,
  SearchPersonFormValues,
  SidebarWithFormRefProps,
  defaultSearchPersonValues,
  mapToPersonAddRequest,
  useSidebarWithFormRef,
} from "@eshg/lib-employee-portal";
import {
  OptionalFieldValue,
  SelectField,
  mapRequiredValue,
} from "@eshg/lib-portal";
import {
  ApiCreatePerson,
  ApiCreateProcedureRequest,
  ApiProcedureDetails,
  ApiSchoolEntryProcedureType,
} from "@eshg/school-entry-api";

import { mapContactAndDifferentBillingAddressToSchoolEntry } from "@/lib/businessModules/schoolEntry/api/addressMapper";
import { useSchoolEntryApi } from "@/lib/businessModules/schoolEntry/api/clients";
import { useCreateProcedure } from "@/lib/businessModules/schoolEntry/api/mutations/schoolEntryApi";
import { getProceduresByPersonQuery } from "@/lib/businessModules/schoolEntry/api/queries/schoolEntryApi";
import { ProcedureCard } from "@/lib/businessModules/schoolEntry/features/procedures/new/ProcedureCard";
import { BUTTON_SIZE } from "@/lib/businessModules/schoolEntry/features/procedures/new/constants";
import { PROCEDURE_TYPE_OPTIONS_EXCLUDING_DRAFT } from "@/lib/businessModules/schoolEntry/features/procedures/options";
import { routes } from "@/lib/businessModules/schoolEntry/shared/routes";

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
      autoFocus
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
  const personSidebar = useSidebarWithFormRef({
    component: ConfiguredPersonSidebar,
  });

  return (
    <Button
      startDecorator={<Add />}
      size={BUTTON_SIZE}
      onClick={() => personSidebar.open()}
    >
      Neuen Vorgang anlegen
    </Button>
  );
}

function ConfiguredPersonSidebar(props: SidebarWithFormRefProps) {
  const router = useRouter();
  const createProcedure = useCreateProcedure();
  const schoolEntryApi = useSchoolEntryApi();

  async function handleCreate(
    child: ApiCreatePerson,
    type: OptionalFieldValue<ApiSchoolEntryProcedureType>,
  ) {
    await createProcedure.mutateAsync(
      mapToCreateProcedureRequest(child, type),
      {
        onSuccess: (response) => {
          router.push(routes.procedures.byId(response.procedureId).details);
        },
      },
    );
  }

  const personSidebarProps: PersonSidebarProps<
    EsuSearchForm,
    DefaultPersonFormValues,
    ApiProcedureDetails
  > = {
    title: "Neuen Vorgang anlegen",
    onCreate: async ({ searchInputs, createInputs }) => {
      await handleCreate(
        mapContactAndDifferentBillingAddressToSchoolEntry(
          mapToPersonAddRequest(createInputs),
        ),
        searchInputs.type,
      );
    },
    onSelect: async ({ searchInputs, person }) => {
      await handleCreate(
        mapContactAndDifferentBillingAddressToSchoolEntry(
          mapToPersonAddRequest(person),
        ),
        searchInputs.type,
      );
    },
    submitLabel: "Vorgang anlegen",
    searchFormComponent: EsuSearchFormComponent,
    initialSearchState: personSearchFormInitialValues,
    addressRequired: true,
    associatedProcedures: {
      getQuery: (personId) =>
        getProceduresByPersonQuery(schoolEntryApi, personId),
      cardComponent: ProcedureCard,
    },
    ...props,
  };

  return <PersonSidebar {...personSidebarProps} />;
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
