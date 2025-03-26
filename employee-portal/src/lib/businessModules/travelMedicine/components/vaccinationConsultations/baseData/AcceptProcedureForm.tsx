/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiGetReferencePersonResponse } from "@eshg/base-api";
import {
  DefaultPersonFormValues,
  PersonFormValues,
  SidebarFormHandle,
} from "@eshg/lib-employee-portal";
import { ApiPatient } from "@eshg/travel-medicine-api";
import { ComponentType, Ref, useState } from "react";
import { isDefined } from "remeda";

import { PatientDetails } from "@/lib/businessModules/travelMedicine/components/vaccinationConsultations/baseData/PatientDetails";
import { defaultPersonFormValues } from "@/lib/shared/components/personSidebar/form/DefaultPersonForm";
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
    onSelect: (props: {
      person: ApiGetReferencePersonResponse | ApiPatient;
    }) => Promise<void>;
    sidebarFormRef: Ref<SidebarFormHandle>;
    title: string;
    submitLabel: string;
    addressRequired?: boolean;
    queryResults?: ApiGetReferencePersonResponse[];
    initialPatient: ApiPatient;
  };

type SidebarMode = "create" | "search_results" | "display";

interface SidebarState<TSearchValues, TCreateValues> {
  mode: SidebarMode;
  createState: TCreateValues;
  searchState: TSearchValues;
  searchResult: ApiGetReferencePersonResponse[];
  selectedPerson: ApiGetReferencePersonResponse | ApiPatient | undefined;
}

export function AcceptProcedureForm<
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
      selectedPerson: props.initialPatient,
    };
  }

  const [state, setState] = useState(getInitialState);

  let activeMode: SidebarMode;
  if (state.mode === "display" && isDefined(state.selectedPerson)) {
    activeMode = "display";
  } else {
    activeMode = "search_results";
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
              mode: "display",
              selectedPerson: props.initialPatient,
            }))
          }
        />
      )}
      {activeMode === "display" && isDefined(state.selectedPerson) && (
        <PatientDetails
          title={props.title}
          person={state.selectedPerson}
          initialPatient={props.initialPatient}
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
    </>
  );
}
