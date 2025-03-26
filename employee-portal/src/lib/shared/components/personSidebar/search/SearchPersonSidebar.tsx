/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { SidebarForm, SidebarFormHandle } from "@eshg/lib-employee-portal";
import { Formik, FormikProps } from "formik";
import { ComponentType, Ref } from "react";

import {
  DefaultSearchPersonForm,
  defaultSearchPersonValues,
} from "@/lib/shared/components/personSidebar/search/DefaultSearchPersonForm";

export interface SearchPersonFormValues {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
}

export type SearchPersonFormProps<TValues> = FormikProps<TValues> & {
  title: string;
  onBack?: () => void;
  onCancel: () => void;
};

export type SearchPersonSidebarProps<TValues extends SearchPersonFormValues> = {
  onCancel: () => void;
  onBack?: () => void;
  onSearch: (values: TValues) => void;
  searching: boolean;
  searchFormTitle: string;
  sidebarFormRef: Ref<SidebarFormHandle>;
} & (
  | {
      initialValues: TValues;
      searchFormComponent: ComponentType<SearchPersonFormProps<TValues>>;
    }
  | {
      initialValues?: never;
      searchFormComponent?: never;
    }
);

export function SearchPersonSidebar<
  TValues extends SearchPersonFormValues = SearchPersonFormValues,
>(props: SearchPersonSidebarProps<TValues>) {
  const SearchFormComponent = (props.searchFormComponent ??
    DefaultSearchPersonForm) as ComponentType<SearchPersonFormProps<TValues>>;
  const initialValues = (props.initialValues ??
    defaultSearchPersonValues()) as TValues;

  function handleSearch(values: NonNullable<TValues>) {
    props.onSearch(values);
  }

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={handleSearch}
      enableReinitialize
    >
      {(formikProps) => (
        <SidebarForm ref={props.sidebarFormRef}>
          <SearchFormComponent
            {...formikProps}
            isSubmitting={formikProps.isSubmitting || props.searching}
            onBack={props.onBack}
            onCancel={props.onCancel}
            title={props.searchFormTitle}
          />
        </SidebarForm>
      )}
    </Formik>
  );
}
