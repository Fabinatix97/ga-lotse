/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiGetReferencePersonResponse } from "@eshg/base-api";
import { ApiAffectedPerson } from "@eshg/official-medical-service-api";
import { ComponentType, Ref, useState } from "react";
import { isDefined } from "remeda";

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
import { PersonSearchResults } from "@/lib/shared/components/personSidebar/search/PersonSearchResults";
import {
  SearchPersonFormProps,
  SearchPersonFormValues,
} from "@/lib/shared/components/personSidebar/search/SearchPersonSidebar";

type CreatePersonStateMapper<TSearchValues, TCreateValues> = (props: {
  inputs: TSearchValues;
  addressRequired?: boolean;
}) => TCreateValues;

interface SearchFormProps<TSearchValues> {
  initialSearchState: TSearchValues;
}

type CreateFormProps<TSearchValues, TCreateValues> =
  | {
      initialCreateState: CreatePersonStateMapper<TSearchValues, TCreateValues>;
      createFormComponent?: ComponentType<SearchPersonFormProps<TCreateValues>>;
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
    onSelect: (props: {
      person: ApiGetReferencePersonResponse | ApiAffectedPerson | TCreateValues;
    }) => Promise<void>;
    sidebarFormRef: Ref<SidebarFormHandle>;
    title: string;
    submitLabel: string;
    addressRequired?: boolean;
    queryResults?: ApiGetReferencePersonResponse[];
    initialAffectedPerson: ApiAffectedPerson;
  };

type SidebarMode = "create" | "search_results" | "display";

interface SidebarState<TSearchValues, TCreateValues> {
  mode: SidebarMode;
  createState: TCreateValues;
  searchState: TSearchValues;
  searchResult: ApiGetReferencePersonResponse[];
  selectedPerson: ApiGetReferencePersonResponse | ApiAffectedPerson | undefined;
}

export function StartProcedureForm<
  TSearchValues extends SearchPersonFormValues = SearchPersonFormValues,
  TCreateValues extends PersonFormValues = DefaultPersonFormValues,
>(props: PersonSidebarProps<TSearchValues, TCreateValues>) {
  const initialSearchState = props.initialSearchState;
  const mapCreateState = (props.initialCreateState ??
    defaultPersonFormValues) as CreatePersonStateMapper<
    TSearchValues,
    TCreateValues
  >;

  function getInitialState(): SidebarState<TSearchValues, TCreateValues> {
    return {
      mode: "search_results",
      createState: mapCreateState({
        inputs: initialSearchState,
        addressRequired: props.addressRequired,
      }),
      searchState: initialSearchState,
      searchResult: props.queryResults ?? [],
      selectedPerson: props.initialAffectedPerson,
    };
  }

  const [state, setState] = useState(getInitialState);

  let activeMode: SidebarMode;
  if (state.mode === "display" && isDefined(state.selectedPerson)) {
    activeMode = "display";
  } else if (state.mode === "search_results") {
    activeMode = "search_results";
  } else {
    activeMode = "create";
  }

  return (
    <>
      {activeMode === "search_results" && (
        <PersonSearchResults
          title={props.title}
          sidebarFormRef={props.sidebarFormRef}
          onCancel={props.onCancel}
          inputs={state.searchState}
          persons={state.searchResult}
          onSelectPerson={(person) => {
            setState((previous) => ({
              ...previous,
              mode: "display",
              selectedPerson: person,
            }));
          }}
          onCreatePerson={() => {
            setState((previous) => ({
              ...previous,
              mode: "create",
              selectedPerson: props.initialAffectedPerson,
            }));
          }}
        />
      )}
      {activeMode === "display" && isDefined(state.selectedPerson) && (
        <PersonDetailsSidebar
          title={props.title}
          person={state.selectedPerson as ApiGetReferencePersonResponse}
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
              person: person,
            })
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
          onSubmit={(values) =>
            props.onSelect({
              person: values,
            })
          }
          addressRequired={props.addressRequired}
          initialValues={state.createState}
          component={
            DefaultPersonForm as ComponentType<PersonFormProps<TCreateValues>>
          }
        />
      )}
    </>
  );
}
