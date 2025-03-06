/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import {
  MainContentLayout,
  StickyToolbarLayout,
  Toolbar,
} from "@eshg/lib-employee-portal";
import { SelectField } from "@eshg/lib-portal/components/formFields/SelectField";
import { useSnackbar } from "@eshg/lib-portal/components/snackbar/SnackbarProvider";
import { OptionalFieldValue } from "@eshg/lib-portal/types/form";
import { ApiSchoolEntryProcedureType } from "@eshg/school-entry-api";
import { Button, Stack } from "@mui/joy";

import { PROCEDURE_TYPE_OPTIONS_EXCLUDING_DRAFT } from "@/lib/businessModules/schoolEntry/features/procedures/options";
import {
  PersonSidebar,
  PersonSidebarProps,
} from "@/lib/shared/components/personSidebar/PersonSidebar";
import { DefaultPersonFormValues } from "@/lib/shared/components/personSidebar/form/DefaultPersonForm";
import {
  DefaultSearchPersonForm,
  defaultSearchPersonValues,
} from "@/lib/shared/components/personSidebar/search/DefaultSearchPersonForm";
import { DefaultSearchPersonFormFields } from "@/lib/shared/components/personSidebar/search/DefaultSearchPersonFormFields";
import {
  SearchPersonFormProps,
  SearchPersonFormValues,
} from "@/lib/shared/components/personSidebar/search/SearchPersonSidebar";
import {
  SidebarWithFormRefProps,
  useSidebarWithFormRef,
} from "@/lib/shared/hooks/useSidebarWithFormRef";

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
        required={"Bitte Vorgangsart auswählen."}
        options={PROCEDURE_TYPE_OPTIONS_EXCLUDING_DRAFT}
      />
      <DefaultSearchPersonFormFields />
    </DefaultSearchPersonForm>
  );
}
