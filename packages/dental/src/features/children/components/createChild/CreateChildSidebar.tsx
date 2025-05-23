/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { useRouter } from "next/navigation";

import { ApiAddPersonFileStateRequest } from "@eshg/base-api";
import { ApiChild, ApiCreateChildRequest } from "@eshg/dental-api";
import {
  DefaultPersonFormValues,
  PersonSidebar,
  PersonSidebarProps,
  SidebarWithFormRefProps,
  UseSidebarWithFormRefResult,
  defaultSearchPersonValues,
  mapToPersonAddRequest,
  useSidebarWithFormRef,
} from "@eshg/lib-employee-portal";
import {
  OptionalFieldValue,
  mapOptionalValue,
  mapRequiredValue,
} from "@eshg/lib-portal";

import { routes } from "../../../../config/routes";
import { useDentalApi } from "../../../../contexts/dental";
import { useCreateChild } from "../../api/mutations/overview";
import { getChildrenByPersonQuery } from "../../api/queries/overview";

import { ChildProcedureCard } from "./ChildProcedureCard";
import { SearchChildForm, SearchChildFormValues } from "./SearchChildForm";

const INITIAL_SEARCH_VALUES: SearchChildFormValues = {
  ...defaultSearchPersonValues(),
  schoolYear: "",
  institution: null,
  groupName: "",
};

export function useCreateChildSidebar(): UseSidebarWithFormRefResult {
  return useSidebarWithFormRef({
    component: CreateChildSidebar,
  });
}

function CreateChildSidebar(props: SidebarWithFormRefProps) {
  const router = useRouter();
  const createChild = useCreateChild();
  const { childApi } = useDentalApi();

  async function handleCreate(
    child: ApiAddPersonFileStateRequest,
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
    SearchChildFormValues,
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
    searchFormComponent: SearchChildForm,
    initialSearchState: INITIAL_SEARCH_VALUES,
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
  child: ApiAddPersonFileStateRequest,
  schoolYear: OptionalFieldValue<number>,
  institutionId: OptionalFieldValue<string>,
  groupName: OptionalFieldValue<string>,
): ApiCreateChildRequest {
  return {
    ...child,
    year: mapRequiredValue(schoolYear),
    institutionId: mapRequiredValue(institutionId),
    groupName: mapOptionalValue(groupName),
  };
}
