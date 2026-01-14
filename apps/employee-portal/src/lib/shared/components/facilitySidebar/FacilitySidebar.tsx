/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { FormikProps } from "formik";
import { ComponentType, ReactNode } from "react";
import { isDefined } from "remeda";

import {
  MultiFormButtonBar,
  SidebarActions,
  SidebarContent,
  SidebarWithFormRefProps,
  useResetAlertContextOnChange,
  useSidebarFormHandle,
} from "@eshg/lib-employee-portal";
import { LoadingIndicator } from "@eshg/lib-portal";

import {
  FacilityDetailsSidebar,
  ReferenceFacilityWithOptionalMeaslesFacilityType,
} from "@/lib/shared/components/facilitySidebar/FacilityDetailsSidebar";
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
  onCreateNew: (props: {
    searchInputs: FacilitySearchFormValues;
    createInputs: DefaultFacilityFormValues;
  }) => Promise<void>;
  onSelect: (props: {
    searchInputs: FacilitySearchFormValues;
    facility: ReferenceFacilityWithOptionalMeaslesFacilityType;
  }) => Promise<void>;
  allowMainContactPerson?: boolean;
  requiresContactPerson?: boolean;
  showMeaslesFacilityType?: boolean;
} & SidebarWithFormRefProps &
  OptionalSearchFormComponent<TSearchValues>;

export function FacilitySidebar<
  TSearchValues extends FacilitySearchFormValues = FacilitySearchFormValues,
>(props: FacilitySidebarProps<TSearchValues>) {
  return (
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
  );
}

function EmbeddedFacilitySidebar<
  TSearchValues extends FacilitySearchFormValues,
>(props: FacilitySidebarProps<TSearchValues>) {
  const SearchFormComponent = (props.searchFormComponent ??
    DefaultFacilitySearchForm) as ComponentType<FormikProps<TSearchValues>>;

  const { state, dispatch } = useFacilitySidebarState(props);

  useResetAlertContextOnChange(state.stage);

  function resetForm() {
    dispatch({ type: "RESET" });
  }

  useSidebarFormHandle(props.formRef, {
    dirty: state.dirty,
    resetForm,
  });

  return (
    <>
      {state.stage === "loading" && (
        <LoadingStage
          title={props.title}
          onCancel={() => props.onClose(false)}
        />
      )}
      {state.stage === "search" && (
        <FacilitySearchForm
          title={props.title}
          loading={state.queryEnabled}
          initialValues={state.searchState}
          formFieldsComponent={SearchFormComponent}
          sidebarFormRef={props.formRef}
          onCancel={() => props.onClose(false)}
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
          sidebarFormRef={props.formRef}
          header={props.searchResultHeaderComponent}
          onBack={
            state.backEnabled ? () => dispatch({ type: "BACK" }) : undefined
          }
          onCancel={() => props.onClose(false)}
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
          sidebarFormRef={props.formRef}
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
          requiresContactPerson={props.requiresContactPerson}
          allowMainContactPerson={props.allowMainContactPerson}
          showMeaslesFacilityType={props.showMeaslesFacilityType}
          onCancel={() => props.onClose(false)}
          onBack={
            state.backEnabled
              ? (values) =>
                  dispatch({
                    type: "BACK",
                    createState: values,
                  })
              : undefined
          }
          onSubmit={async (values) => {
            await props.onCreateNew({
              searchInputs: state.searchState,
              createInputs: normalizeValues(values),
            });
            return props.onClose(true);
          }}
        />
      )}
      {state.stage === "display" && isDefined(state.selectedFacility) && (
        <FacilityDetailsSidebar
          title={props.title}
          submitLabel={props.submitLabel ?? "Vorgang anlegen"}
          facility={state.selectedFacility}
          showMeaslesFacilityType={props.showMeaslesFacilityType}
          onSubmit={(facility) =>
            props
              .onSelect({
                searchInputs: state.searchState,
                facility,
              })
              .then(() => props.onClose(true))
          }
          onBack={
            state.backEnabled ? () => dispatch({ type: "BACK" }) : undefined
          }
          onCancel={() => props.onClose(false)}
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
