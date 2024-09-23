/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { ApiGetReferencePersonResponse } from "@eshg/employee-portal-api/base";
import { ComponentType, Ref, useEffect, useState } from "react";
import { isDefined } from "remeda";

import { useSearchReferencePersonsQuery } from "@/lib/baseModule/api/queries/persons";
import { SidebarFormHandle } from "@/lib/shared/components/form/SidebarForm";
import { PersonDetailsSidebar } from "@/lib/shared/components/personSidebar/PersonDetailsSidebar";
import {
  DefaultPersonForm,
  DefaultPersonFormValues,
  defaultPersonFormValues,
} from "@/lib/shared/components/personSidebar/form/DefaultPersonForm";
import {
  PersonFormProps,
  PersonFormValues,
  PersonSidebarForm,
} from "@/lib/shared/components/personSidebar/form/PersonSidebarForm";
import {
  DefaultSearchPersonForm,
  defaultSearchPersonValues,
} from "@/lib/shared/components/personSidebar/search/DefaultSearchPersonForm";
import { PersonSearchResults } from "@/lib/shared/components/personSidebar/search/PersonSearchResults";
import {
  SearchPersonFormProps,
  SearchPersonFormValues,
  SearchPersonSidebar,
} from "@/lib/shared/components/personSidebar/search/SearchPersonSidebar";

type CreatePersonStateMapper<TSearchValues, TCreateValues> = (props: {
  inputs: TSearchValues;
  addressRequired?: boolean;
}) => TCreateValues;

type SearchFormProps<TSearchValues> =
  | {
      initialSearchState: TSearchValues;
      searchFormComponent: ComponentType<SearchPersonFormProps<TSearchValues>>;
    }
  | {
      initialSearchState?: never;
      searchFormComponent?: never;
    };

type CreateFormProps<TSearchValues, TCreateValues> =
  | {
      initialCreateState: CreatePersonStateMapper<TSearchValues, TCreateValues>;
      createFormComponent: ComponentType<SearchPersonFormProps<TCreateValues>>;
    }
  | {
      initialCreateState?: never;
      createFormComponent?: never;
    };

export type PersonSidebarProps<
  TSearchValues extends SearchPersonFormValues = SearchPersonFormValues,
  TCreateValues extends PersonFormValues = DefaultPersonFormValues,
> = SearchFormProps<TSearchValues> &
  CreateFormProps<TSearchValues, TCreateValues> & {
    onCancel: () => void;
    onBack?: () => void;
    onCreate: (props: {
      searchInputs: TSearchValues;
      createInputs: TCreateValues;
    }) => Promise<void>;
    onSelect: (props: {
      searchInputs: TSearchValues;
      person: ApiGetReferencePersonResponse;
    }) => Promise<void>;
    sidebarFormRef: Ref<SidebarFormHandle>;
    title: string;
    submitLabel: string;
    addressRequired?: boolean;
  };

type SidebarMode = "search" | "create" | "search_results" | "display";

interface SidebarState<TSearchValues, TCreateValues> {
  mode: SidebarMode;
  createState: TCreateValues;
  searchState: TSearchValues;
  searchResult: ApiGetReferencePersonResponse[];
  selectedPerson: ApiGetReferencePersonResponse | undefined;
}

export function PersonSidebar<
  TSearchValues extends SearchPersonFormValues = SearchPersonFormValues,
  TCreateValues extends PersonFormValues = DefaultPersonFormValues,
>(props: PersonSidebarProps<TSearchValues, TCreateValues>) {
  const SearchFormComponent = (props.searchFormComponent ??
    DefaultSearchPersonForm) as ComponentType<
    SearchPersonFormProps<TSearchValues>
  >;
  const CreateFormComponent = (props.createFormComponent ??
    DefaultPersonForm) as ComponentType<PersonFormProps<TCreateValues>>;

  const initialSearchState = (props.initialSearchState ??
    defaultSearchPersonValues()) as TSearchValues;
  const mapCreateState = (props.initialCreateState ??
    defaultPersonFormValues) as CreatePersonStateMapper<
    TSearchValues,
    TCreateValues
  >;

  function getInitialState(): SidebarState<TSearchValues, TCreateValues> {
    return {
      mode: "search",
      createState: mapCreateState({
        inputs: initialSearchState,
        addressRequired: props.addressRequired,
      }),
      searchState: initialSearchState,
      searchResult: [],
      selectedPerson: undefined,
    };
  }

  const [state, setState] = useState(getInitialState);

  const query = useSearchReferencePersonsQuery(
    {
      firstName: state.searchState.firstName.trim(),
      lastName: state.searchState.lastName.trim(),
      dateOfBirth: new Date(state.searchState.dateOfBirth),
    },
    {
      enabled: state.mode === "search_results",
    },
  );

  useEffect(() => {
    setState((previous) => {
      if (query.data) {
        return { ...previous, searchResult: query.data.persons };
      } else {
        return previous;
      }
    });
  }, [query.data]);

  let activeMode: SidebarMode;
  if (state.mode === "display" && isDefined(state.selectedPerson)) {
    activeMode = "display";
  } else if (state.mode === "create") {
    activeMode = "create";
  } else if (state.mode === "search_results" && query.isSuccess) {
    activeMode = "search_results";
  } else {
    activeMode = "search";
  }

  return (
    <>
      {activeMode === "search" && (
        <SearchPersonSidebar<TSearchValues>
          searchFormTitle={props.title}
          sidebarFormRef={props.sidebarFormRef}
          onCancel={props.onCancel}
          onBack={props.onBack}
          initialValues={state.searchState}
          searchFormComponent={SearchFormComponent}
          searching={state.mode === "search_results" && query.isLoading}
          onSearch={(values) =>
            setState((previous) => ({
              ...previous,
              searchState: values,
              mode: "search_results",
            }))
          }
        />
      )}
      {activeMode === "search_results" && (
        <PersonSearchResults
          title={props.title}
          sidebarFormRef={props.sidebarFormRef}
          onCancel={props.onCancel}
          onBack={() =>
            setState((previous) => ({ ...previous, mode: "search" }))
          }
          inputs={state.searchState}
          persons={state.searchResult}
          onSelectPerson={(person) =>
            setState((previous) => ({
              ...previous,
              mode: "display",
              selectedPerson: person,
            }))
          }
          onCreatePerson={() =>
            setState((previous) => ({
              ...previous,
              mode: "create",
              createState: mapCreateState({
                inputs: previous.searchState,
                addressRequired: props.addressRequired,
              }),
              selectedPerson: undefined,
            }))
          }
        />
      )}
      {activeMode === "create" && (
        <PersonSidebarForm<TCreateValues>
          title={props.title}
          subtitle={"Person anlegen"}
          submitLabel={props.submitLabel}
          sidebarFormRef={props.sidebarFormRef}
          onCancel={props.onCancel}
          onBack={() =>
            setState((previous) => ({
              ...previous,
              mode: "search_results",
            }))
          }
          onSubmit={async (values) =>
            await props.onCreate({
              searchInputs: state.searchState,
              createInputs: values,
            })
          }
          addressRequired={props.addressRequired}
          initialValues={state.createState}
          component={CreateFormComponent}
        />
      )}
      {activeMode === "display" && isDefined(state.selectedPerson) && (
        <PersonDetailsSidebar
          title={props.title}
          person={state.selectedPerson}
          submitLabel={props.submitLabel}
          onCancel={props.onCancel}
          onBack={() =>
            setState((previous) => ({
              ...previous,
              mode: "search_results",
            }))
          }
          onSubmit={(person) =>
            props.onSelect({
              searchInputs: state.searchState,
              person: person,
            })
          }
        />
      )}
    </>
  );
}
