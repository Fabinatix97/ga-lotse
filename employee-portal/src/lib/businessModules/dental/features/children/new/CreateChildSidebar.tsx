/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { ApiAddContact200Response } from "@eshg/base-api";
import {
  getChildrenByPersonQuery,
  routes,
  useCreateChild,
  useDentalApi,
} from "@eshg/dental";
import { ApiChild, ApiCreateChildRequest } from "@eshg/dental-api";
import {
  DefaultPersonFormValues,
  SidebarWithFormRefProps,
  mapToPersonAddRequest,
  useSidebarWithFormRef,
} from "@eshg/lib-employee-portal";
import { mapRequiredValue } from "@eshg/lib-portal/helpers/form";
import { OptionalFieldValue } from "@eshg/lib-portal/types/form";
import { ApiCreatePerson } from "@eshg/school-entry-api";
import { Add } from "@mui/icons-material";
import { Button } from "@mui/joy";
import { useRouter } from "next/navigation";

import { SCHOOL_OR_DAYCARE } from "@/lib/baseModule/api/queries/contacts";
import { ChildProcedureCard } from "@/lib/businessModules/dental/features/children/new/ChildProcedureCard";
import { SearchGroupField } from "@/lib/businessModules/dental/features/prophylaxisSessions/SearchGroupField";
import { BUTTON_SIZE } from "@/lib/businessModules/schoolEntry/features/procedures/new/constants";
import { SelectContactField } from "@/lib/shared/components/formFields/SelectContactField";
import { SchoolYearField } from "@/lib/shared/components/formFields/schoolYear";
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
import { getInstitutionOptionLabel } from "@/lib/shared/helpers/selectOptionMapper";

interface DentalSearchForm extends SearchPersonFormValues {
  schoolYear: OptionalFieldValue<number>;
  institution: ApiAddContact200Response | null;
  groupName: OptionalFieldValue<string>;
}

const personSearchFormInitialValues: DentalSearchForm = {
  ...defaultSearchPersonValues(),
  schoolYear: "",
  institution: null,
  groupName: "",
};

function DentalSearchFormComponent(
  props: SearchPersonFormProps<DentalSearchForm>,
) {
  return (
    <DefaultSearchPersonForm {...props}>
      <SchoolYearField
        name="schoolYear"
        label="Wählen Sie ein Schuljahr aus"
        required="Bitte ein Schuljahr angeben."
        range={{
          numberOfYearsInPast: 1,
          numberOfYearsInFuture: 1,
        }}
      />
      <SelectContactField
        name="institution"
        label="Einrichtung"
        categories={SCHOOL_OR_DAYCARE}
        required="Bitte eine Schule/Kita angeben."
        placeholder="Schule/Kita suchen"
        getOptionLabel={getInstitutionOptionLabel}
      />
      <SearchGroupField
        name="groupName"
        label="Wählen Sie eine Gruppe aus"
        institutionId={props.values.institution?.id ?? ""}
        freeSolo
      />
      <DefaultSearchPersonFormFields />
    </DefaultSearchPersonForm>
  );
}

export function CreateChildSidebar() {
  const personSidebar = useSidebarWithFormRef({
    component: ConfiguredPersonSidebar,
  });

  return (
    <Button
      startDecorator={<Add />}
      onClick={() => personSidebar.open()}
      size={BUTTON_SIZE}
    >
      Neues Kind anlegen
    </Button>
  );
}

function ConfiguredPersonSidebar(props: SidebarWithFormRefProps) {
  const router = useRouter();
  const createChild = useCreateChild();
  const { childApi } = useDentalApi();

  async function handleCreate(
    child: ApiCreatePerson,
    schoolYear: OptionalFieldValue<number>,
    institutionId: OptionalFieldValue<string>,
    groupName: OptionalFieldValue<string>,
  ) {
    await createChild.mutateAsync(
      mapToCreateChildRequest(child, schoolYear, institutionId, groupName),
      {
        onSuccess: (response) => {
          router.push(routes.children.byId(response.id).details);
        },
      },
    );
  }

  const personSidebarProps: PersonSidebarProps<
    DentalSearchForm,
    DefaultPersonFormValues,
    ApiChild
  > = {
    title: "Neues Kind anlegen",
    onCreate: async ({ searchInputs, createInputs }) => {
      await handleCreate(
        mapToPersonAddRequest(createInputs),
        searchInputs.schoolYear,
        searchInputs.institution?.id ?? "",
        searchInputs.groupName,
      );
    },
    onSelect: async ({ searchInputs, person }) => {
      await handleCreate(
        mapToPersonAddRequest(person),
        searchInputs.schoolYear,
        searchInputs.institution?.id ?? "",
        searchInputs.groupName,
      );
    },
    submitLabel: "Kind anlegen",
    searchFormComponent: DentalSearchFormComponent,
    initialSearchState: personSearchFormInitialValues,
    addressRequired: true,
    associatedProcedures: {
      getQuery: (personId) => getChildrenByPersonQuery(childApi, personId),
      cardComponent: ChildProcedureCard,
    },
    ...props,
  };

  return <PersonSidebar {...personSidebarProps} />;
}

function mapToCreateChildRequest(
  child: ApiCreatePerson,
  schoolYear: OptionalFieldValue<number>,
  institutionId: OptionalFieldValue<string>,
  groupName: OptionalFieldValue<string>,
): ApiCreateChildRequest {
  return {
    ...child,
    year: mapRequiredValue(schoolYear),
    institutionId: mapRequiredValue(institutionId),
    groupName: mapRequiredValue(groupName),
  };
}
