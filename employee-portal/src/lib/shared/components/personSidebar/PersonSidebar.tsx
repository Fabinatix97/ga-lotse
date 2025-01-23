/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { ApiGetReferencePersonResponse } from "@eshg/base-api";
import { DefaultError, UseQueryOptions, useQuery } from "@tanstack/react-query";
import { ComponentType, ReactNode, Ref, useEffect, useState } from "react";
import { isDefined } from "remeda";

import { useSearchReferencePersonsQuery } from "@/lib/baseModule/api/queries/persons";
import { SidebarFormHandle } from "@/lib/shared/components/form/SidebarForm";
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
import { useResetAlertContextOnChange } from "@/lib/shared/hooks/useResetAlertContextOnChange";

import { PersonDetailsSidebar } from "./PersonDetailsSidebar";
import { AssociatedProceduresSearchResult } from "./search/AssociatedProceduresSearchResult";

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

interface AssociatedProceduresProps<TProcedure> {
  getQuery: (
    personId: string | undefined,
  ) => UseQueryOptions<any, DefaultError, TProcedure[], any>; // eslint-disable-line @typescript-eslint/no-explicit-any
  cardComponent: (props: { procedure: TProcedure }) => ReactNode;
}

const EMPTY_ASSOCIATED_PROCEDURES_QUERY = {
  queryKey: ["emptyGetAssociatedProcedures"],
  queryFn: () => [],
} satisfies UseQueryOptions<unknown[]>;

export type PersonSidebarProps<
  TSearchValues extends SearchPersonFormValues = SearchPersonFormValues,
  TCreateValues extends PersonFormValues = DefaultPersonFormValues,
  TProcedure = unknown,
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
    associatedProcedures?: AssociatedProceduresProps<TProcedure>;
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
  TProcedure = unknown,
>(props: PersonSidebarProps<TSearchValues, TCreateValues, TProcedure>) {
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
  const searchReferencePersonsQuery = useSearchReferencePersonsQuery(
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
      if (searchReferencePersonsQuery.data) {
        return {
          ...previous,
          searchResult: searchReferencePersonsQuery.data.persons,
        };
      } else {
        return previous;
      }
    });
  }, [searchReferencePersonsQuery.data]);

  const associatedProcedures = props.associatedProcedures;
  const getAssociatedProceduresQuery = useQuery<
    any, // eslint-disable-line @typescript-eslint/no-explicit-any
    DefaultError,
    TProcedure[],
    any // eslint-disable-line @typescript-eslint/no-explicit-any
  >(
    isDefined(associatedProcedures)
      ? associatedProcedures.getQuery(state.selectedPerson?.id)
      : EMPTY_ASSOCIATED_PROCEDURES_QUERY,
  );

  let activeMode: SidebarMode;
  if (
    state.mode === "display" &&
    isDefined(state.selectedPerson) &&
    (associatedProcedures === undefined ||
      getAssociatedProceduresQuery.isSuccess)
  ) {
    activeMode = "display";
  } else if (state.mode === "create") {
    activeMode = "create";
  } else if (
    state.mode === "search_results" &&
    searchReferencePersonsQuery.isSuccess
  ) {
    activeMode = "search_results";
  } else {
    activeMode = "search";
  }

  useResetAlertContextOnChange(activeMode);

  if (activeMode === "search") {
    return (
      <SearchPersonSidebar<TSearchValues>
        searchFormTitle={props.title}
        sidebarFormRef={props.sidebarFormRef}
        onCancel={props.onCancel}
        onBack={props.onBack}
        initialValues={state.searchState}
        searchFormComponent={SearchFormComponent}
        searching={
          state.mode === "search_results" &&
          searchReferencePersonsQuery.isLoading
        }
        onSearch={(values) =>
          setState((previous) => ({
            ...previous,
            searchState: values,
            mode: "search_results",
          }))
        }
      />
    );
  }

  if (activeMode === "search_results") {
    return (
      <PersonSearchResults
        title={props.title}
        sidebarFormRef={props.sidebarFormRef}
        loadingAssociatedProcedures={getAssociatedProceduresQuery.isLoading}
        onCancel={props.onCancel}
        onBack={() => setState((previous) => ({ ...previous, mode: "search" }))}
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
    );
  }

  if (activeMode === "create") {
    return (
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
    );
  }

  if (activeMode === "display" && isDefined(state.selectedPerson)) {
    if (
      isDefined(associatedProcedures) &&
      getAssociatedProceduresQuery.isSuccess &&
      getAssociatedProceduresQuery.data.length > 0
    ) {
      return (
        <AssociatedProceduresSearchResult<TProcedure>
          onCancel={props.onCancel}
          onBack={() =>
            setState((previous) => ({ ...previous, mode: "search_results" }))
          }
          inputs={state.selectedPerson}
          procedures={getAssociatedProceduresQuery.data}
          procedureCard={associatedProcedures.cardComponent}
        />
      );
    } else {
      return (
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
      );
    }
  }

  throw new Error("Invalid sidebar state");
}
