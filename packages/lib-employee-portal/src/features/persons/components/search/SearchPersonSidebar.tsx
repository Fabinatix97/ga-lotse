/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { Formik, FormikProps } from "formik";
import { ComponentType, Ref } from "react";

import { SidebarForm } from "../../../drawer/components/SidebarForm";
import { SidebarFormHandle } from "../../../drawer/types/sidebar";

import {
  DefaultSearchPersonForm,
  defaultSearchPersonValues,
} from "./DefaultSearchPersonForm";

export interface SearchPersonFormValues {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
}

export type SearchPersonFormProps<TValues> = FormikProps<TValues> & {
  onCreateWithoutSearch: (values: TValues) => void;
  title: string;
  onBack?: () => void;
  onCancel: () => void;
};

type SearchPersonSidebarProps<TValues extends SearchPersonFormValues> = {
  onCancel: () => void;
  onBack?: () => void;
  onSearch: (values: TValues) => void;
  onCreateWithoutSearch: (values: TValues) => void;
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
      enableReinitialize
      onSubmit={handleSearch}
    >
      {(formikProps) => (
        <SidebarForm ref={props.sidebarFormRef}>
          <SearchFormComponent
            {...formikProps}
            isSubmitting={formikProps.isSubmitting || props.searching}
            title={props.searchFormTitle}
            onBack={props.onBack}
            onCancel={props.onCancel}
            onCreateWithoutSearch={props.onCreateWithoutSearch}
          />
        </SidebarForm>
      )}
    </Formik>
  );
}
