/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { SidebarActions, SidebarContent } from "@eshg/lib-employee-portal";
import { Stack } from "@mui/joy";
import { PropsWithChildren } from "react";

import { MultiFormButtonBar } from "@/lib/shared/components/form/MultiFormButtonBar";
import { DefaultSearchPersonFormFields } from "@/lib/shared/components/personSidebar/search/DefaultSearchPersonFormFields";
import {
  SearchPersonFormProps,
  SearchPersonFormValues,
} from "@/lib/shared/components/personSidebar/search/SearchPersonSidebar";

export function defaultSearchPersonValues(): SearchPersonFormValues {
  return {
    firstName: "",
    lastName: "",
    dateOfBirth: "",
  };
}

export function DefaultSearchPersonForm<
  TValues extends SearchPersonFormValues = SearchPersonFormValues,
>(props: PropsWithChildren<SearchPersonFormProps<TValues>>) {
  return (
    <>
      <SidebarContent title={props.title}>
        <Stack gap={2}>
          {props.children ?? <DefaultSearchPersonFormFields />}
        </Stack>
      </SidebarContent>
      <SidebarActions>
        <MultiFormButtonBar
          submitting={props.isSubmitting}
          submitLabel={"Weiter"}
          onBack={props.onBack}
          onCancel={props.onCancel}
        />
      </SidebarActions>
    </>
  );
}
