/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { Button, Stack } from "@mui/joy";

import {
  DefaultPersonFormValues,
  DefaultSearchPersonForm,
  DefaultSearchPersonFormFields,
  MainContentLayout,
  PersonSidebar,
  PersonSidebarProps,
  SearchPersonFormProps,
  SearchPersonFormValues,
  SidebarWithFormRefProps,
  StickyToolbarLayout,
  Toolbar,
  defaultSearchPersonValues,
  useSidebarWithFormRef,
} from "@eshg/lib-employee-portal";
import { OptionalFieldValue, SelectField, useSnackbar } from "@eshg/lib-portal";
import { ApiSchoolEntryProcedureType } from "@eshg/school-entry-api";

import { PROCEDURE_TYPE_OPTIONS_EXCLUDING_DRAFT } from "@/lib/businessModules/schoolEntry/features/procedures/options";

export default function PersonSidebarPage() {
  const personSidebar = useSidebarWithFormRef({
    component: ConfiguredDefaultPersonSidebar,
  });
  const esuPersonSidebar = useSidebarWithFormRef({
    component: ConfiguredEsuPersonSidebar,
  });

  return (
    <StickyToolbarLayout toolbar={<Toolbar title="Person Sidebar" />}>
      <MainContentLayout fullViewportHeight>
        <Stack gap={3}>
          <Button onClick={() => personSidebar.open()}>
            Open Default Sidebar
          </Button>
          <Button onClick={() => esuPersonSidebar.open()}>
            Open ESU Sidebar
          </Button>
        </Stack>
      </MainContentLayout>
    </StickyToolbarLayout>
  );
}

function ConfiguredDefaultPersonSidebar(props: SidebarWithFormRefProps) {
  const snackbar = useSnackbar();
  const personSidebarProps: PersonSidebarProps = {
    onSelect: (values) => {
      // eslint-disable-next-line no-console
      console.log(values);
      snackbar.confirmation("Vorgang wurde angelegt");
      return Promise.resolve();
    },
    onCreate: (values) => {
      // eslint-disable-next-line no-console
      console.log("Default Form Result", values);
      snackbar.confirmation("Vorgang wurde angelegt");
      return Promise.resolve();
    },
    title: "Vorgang anlegen",
    submitLabel: "Fertig",
    addressRequired: true,
    ...props,
  };

  return <PersonSidebar {...personSidebarProps} />;
}

function ConfiguredEsuPersonSidebar(props: SidebarWithFormRefProps) {
  const snackbar = useSnackbar();
  const personSidebarProps: PersonSidebarProps<
    EsuPersonSearchFormValues,
    EsuPersonCreateFormValues
  > = {
    title: "Vorgang anlegen",
    submitLabel: "Vorgang anlegen",
    onSelect: (values) => {
      // eslint-disable-next-line no-console
      console.log(values);
      snackbar.confirmation("Vorgang wurde angelegt");
      return Promise.resolve();
    },
    onCreate: ({ searchInputs, createInputs }) => {
      // eslint-disable-next-line no-console
      console.log("ESU Form Result", {
        // inputs on the search step
        searchInputs,
        // inputs on the create / edit step
        createInputs,
      });
      snackbar.confirmation("Vorgang wurde angelegt");
      return Promise.resolve();
    },
    searchFormComponent: EsuPersonSearchForm,
    initialSearchState: {
      ...defaultSearchPersonValues(),
      type: "REGULAR_EXAMINATION",
    },
    ...props,
  };

  return <PersonSidebar {...personSidebarProps} />;
}

interface EsuPersonCreateFormValues extends DefaultPersonFormValues {
  type: OptionalFieldValue<ApiSchoolEntryProcedureType>;
}

interface EsuPersonSearchFormValues extends SearchPersonFormValues {
  type: OptionalFieldValue<ApiSchoolEntryProcedureType>;
}

function EsuPersonSearchForm(
  props: SearchPersonFormProps<EsuPersonSearchFormValues>,
) {
  return (
    <DefaultSearchPersonForm {...props}>
      <SelectField
        name="type"
        label="Art"
        required="Bitte Vorgangsart auswählen."
        options={PROCEDURE_TYPE_OPTIONS_EXCLUDING_DRAFT}
      />
      <DefaultSearchPersonFormFields />
    </DefaultSearchPersonForm>
  );
}
