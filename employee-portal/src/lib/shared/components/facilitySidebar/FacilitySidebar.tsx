/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { ApiGetReferenceFacilityResponse } from "@eshg/employee-portal-api/base";
import { LoadingIndicator } from "@eshg/lib-portal/components/LoadingIndicator";
import { FormikProps } from "formik";
import { ComponentType, ReactNode, Ref } from "react";
import { isDefined } from "remeda";

import { FacilityDetailsSidebar } from "@/lib/shared/components/facilitySidebar/FacilityDetailsSidebar";
import {
  DefaultFacilityFormValues,
  FacilityForm,
  getInitialFacilityFormValues,
} from "@/lib/shared/components/facilitySidebar/create/FacilityForm";
import { DefaultFacilitySearchForm } from "@/lib/shared/components/facilitySidebar/search/DefaultFacilitySearchForm";
import {
  FacilitySearchForm,
  FacilitySearchFormValues,
} from "@/lib/shared/components/facilitySidebar/search/FacilitySearchForm";
import { FacilitySearchResults } from "@/lib/shared/components/facilitySidebar/search/FacilitySearchResults";
import { useFacilitySidebarState } from "@/lib/shared/components/facilitySidebar/useFacilitySidebarState";
import { MultiFormButtonBar } from "@/lib/shared/components/form/MultiFormButtonBar";
import {
  SidebarFormHandle,
  useSidebarFormHandle,
} from "@/lib/shared/components/form/SidebarForm";
import { Sidebar } from "@/lib/shared/components/sidebar/Sidebar";
import { SidebarActions } from "@/lib/shared/components/sidebar/SidebarActions";
import { SidebarContent } from "@/lib/shared/components/sidebar/SidebarContent";

type OptionalSearchFormComponent<TSearchValues> =
  | {
      initialSearchInputs: TSearchValues;
      searchFormComponent: ComponentType<FormikProps<TSearchValues>>;
    }
  | {
      initialSearchInputs?: FacilitySearchFormValues;
      searchFormComponent?: never;
    };

export type FacilitySidebarProps<TSearchValues> = {
  title: string;
  submitLabel?: string;
  searchResultHeaderComponent?: ReactNode;
  mode?: "import" | "default";
  getInitialCreateInputs?: (
    searchInputs: TSearchValues,
  ) => Partial<DefaultFacilityFormValues>;

  sidebarFormRef: Ref<SidebarFormHandle>;
  onCreateNew: (props: {
    searchInputs: FacilitySearchFormValues;
    createInputs: DefaultFacilityFormValues;
  }) => Promise<void>;
  onSelect: (props: {
    searchInputs: FacilitySearchFormValues;
    facility: ApiGetReferenceFacilityResponse;
  }) => Promise<void>;
  onClose: () => void;
  open: boolean;
} & OptionalSearchFormComponent<TSearchValues>;

export function FacilitySidebar<
  TSearchValues extends FacilitySearchFormValues = FacilitySearchFormValues,
>(props: FacilitySidebarProps<TSearchValues>) {
  return (
    <Sidebar open={props.open} onClose={props.onClose}>
      <EmbeddedFacilitySidebar
        {...props}
        searchFormComponent={
          isDefined(props.searchFormComponent)
            ? (props.searchFormComponent as ComponentType<
                FormikProps<TSearchValues>
              >)
            : undefined
        }
        initialSearchInputs={props.initialSearchInputs as TSearchValues}
      />
    </Sidebar>
  );
}

export function EmbeddedFacilitySidebar<
  TSearchValues extends FacilitySearchFormValues,
>(props: FacilitySidebarProps<TSearchValues>) {
  const SearchFormComponent = (props.searchFormComponent ??
    DefaultFacilitySearchForm) as ComponentType<FormikProps<TSearchValues>>;

  const { state, dispatch } = useFacilitySidebarState(props);

  function resetForm() {
    dispatch({ type: "RESET" });
  }

  useSidebarFormHandle(props.sidebarFormRef, {
    dirty: state.dirty,
    resetForm,
  });

  return (
    <>
      {state.stage === "loading" && (
        <LoadingStage onCancel={props.onClose} title={props.title} />
      )}
      {state.stage === "search" && (
        <FacilitySearchForm
          title={props.title}
          loading={state.queryEnabled}
          initialValues={state.searchState}
          formFieldsComponent={SearchFormComponent}
          onCancel={props.onClose}
          onSearch={(inputs) =>
            dispatch({
              type: "SEARCH_START",
              inputs,
            })
          }
        />
      )}
      {state.stage === "search_results" && (
        <FacilitySearchResults
          title={props.title}
          inputs={state.searchState}
          facilities={state.searchResult}
          header={props.searchResultHeaderComponent}
          onBack={
            state.backEnabled ? () => dispatch({ type: "BACK" }) : undefined
          }
          onCancel={props.onClose}
          onSelect={(facility) => {
            dispatch({
              type: "SELECTED",
              facility,
            });
          }}
          onCreateNew={() => dispatch({ type: "CREATE" })}
        />
      )}
      {(state.stage === "create" || state.stage === "edit") && (
        <FacilityForm
          title={props.title}
          submitLabel={props.submitLabel ?? "Vorgang anlegen"}
          searchInputs={state.searchState}
          initialValues={
            (state.createState ?? isDefined(props.getInitialCreateInputs))
              ? getInitialFacilityFormValues(
                  state.searchState,
                  false,
                  props.getInitialCreateInputs!(state.searchState),
                )
              : undefined
          }
          mode={state.stage}
          onCancel={props.onClose}
          onBack={
            state.backEnabled
              ? (values) =>
                  dispatch({
                    type: "BACK",
                    createState: values,
                  })
              : undefined
          }
          onSubmit={(values) => {
            return props.onCreateNew({
              searchInputs: state.searchState,
              createInputs: normalizeValues(values),
            });
          }}
        />
      )}
      {state.stage === "display" && isDefined(state.selectedFacility) && (
        <FacilityDetailsSidebar
          title={props.title}
          submitLabel={props.submitLabel ?? "Vorgang anlegen"}
          facility={state.selectedFacility}
          onSubmit={(facility) =>
            props.onSelect({
              searchInputs: state.searchState,
              facility,
            })
          }
          onBack={
            state.backEnabled ? () => dispatch({ type: "BACK" }) : undefined
          }
          onCancel={props.onClose}
        />
      )}
    </>
  );
}

function LoadingStage(props: { title: string; onCancel: () => void }) {
  return (
    <>
      <SidebarContent title={props.title} verticallyCenterContent>
        <LoadingIndicator />
      </SidebarContent>
      <SidebarActions>
        <MultiFormButtonBar
          submitLabel={undefined}
          submitting={false}
          onCancel={props.onCancel}
        />
      </SidebarActions>
    </>
  );
}

function normalizeValues(
  values: DefaultFacilityFormValues,
): DefaultFacilityFormValues {
  return {
    ...values,
    emailAddresses: values.emailAddresses.filter((s) => s.length > 0),
    phoneNumbers: values.phoneNumbers.filter((s) => s.length > 0),
  };
}
