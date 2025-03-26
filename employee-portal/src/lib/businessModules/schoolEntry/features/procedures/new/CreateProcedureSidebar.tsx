/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import {
  DefaultPersonFormValues,
  SidebarWithFormRefProps,
  mapToPersonAddRequest,
  useSidebarWithFormRef,
} from "@eshg/lib-employee-portal";
import { SelectField } from "@eshg/lib-portal/components/formFields/SelectField";
import { mapRequiredValue } from "@eshg/lib-portal/helpers/form";
import { OptionalFieldValue } from "@eshg/lib-portal/types/form";
import {
  ApiCreatePerson,
  ApiCreateProcedureRequest,
  ApiProcedureDetails,
  ApiSchoolEntryProcedureType,
} from "@eshg/school-entry-api";
import { Add } from "@mui/icons-material";
import { Button } from "@mui/joy";
import { useRouter } from "next/navigation";

import { useSchoolEntryApi } from "@/lib/businessModules/schoolEntry/api/clients";
import { useCreateProcedure } from "@/lib/businessModules/schoolEntry/api/mutations/schoolEntryApi";
import { getProceduresByPersonQuery } from "@/lib/businessModules/schoolEntry/api/queries/schoolEntryApi";
import { ProcedureCard } from "@/lib/businessModules/schoolEntry/features/procedures/new/ProcedureCard";
import { BUTTON_SIZE } from "@/lib/businessModules/schoolEntry/features/procedures/new/constants";
import { PROCEDURE_TYPE_OPTIONS_EXCLUDING_DRAFT } from "@/lib/businessModules/schoolEntry/features/procedures/options";
import { routes } from "@/lib/businessModules/schoolEntry/shared/routes";
import {
  PersonSidebar,
  PersonSidebarProps,
} from "@/lib/shared/components/personSidebar/PersonSidebar";
import {
  DefaultSearchPersonForm,
  defaultSearchPersonValues,
} from "@/lib/shared/components/personSidebar/search/DefaultSearchPersonForm";
import { DefaultSearchPersonFormFields } from "@/lib/shared/components/personSidebar/search/DefaultSearchPersonFormFields";
import {
  SearchPersonFormProps,
  SearchPersonFormValues,
} from "@/lib/shared/components/personSidebar/search/SearchPersonSidebar";

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
  const personSidebar = useSidebarWithFormRef({
    component: ConfiguredPersonSidebar,
  });

  return (
    <Button
      startDecorator={<Add />}
      onClick={() => personSidebar.open()}
      size={BUTTON_SIZE}
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
        mapToPersonAddRequest(createInputs),
        searchInputs.type,
      );
    },
    onSelect: async ({ searchInputs, person }) => {
      await handleCreate(mapToPersonAddRequest(person), searchInputs.type);
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
