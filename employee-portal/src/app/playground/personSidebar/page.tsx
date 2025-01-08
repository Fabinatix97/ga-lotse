/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { ApiSchoolEntryProcedureType } from "@eshg/employee-portal-api/schoolEntry";
import { SelectField } from "@eshg/lib-portal/components/formFields/SelectField";
import { useSnackbar } from "@eshg/lib-portal/components/snackbar/SnackbarProvider";
import { OptionalFieldValue } from "@eshg/lib-portal/types/form";
import { Button, Stack } from "@mui/joy";
import { useRef, useState } from "react";

import { PROCEDURE_TYPE_OPTIONS_EXCLUDING_DRAFT } from "@/lib/businessModules/schoolEntry/features/procedures/options";
import { SidebarFormHandle } from "@/lib/shared/components/form/SidebarForm";
import { MainContentLayout } from "@/lib/shared/components/layout/MainContentLayout";
import { StickyToolbarLayout } from "@/lib/shared/components/layout/StickyToolbarLayout";
import { Toolbar } from "@/lib/shared/components/layout/Toolbar";
import { PersonSidebar } from "@/lib/shared/components/personSidebar/PersonSidebar";
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
import { Sidebar } from "@/lib/shared/components/sidebar/Sidebar";
import { useConfirmationDialog } from "@/lib/shared/hooks/useConfirmationDialog";

export default function PersonSidebarPage() {
  const [sidebarOpen, setSidebarOpen] = useState("none");
  const { openCancelDialog } = useConfirmationDialog();
  const snackbar = useSnackbar();

  const sidebarFormRef = useRef<SidebarFormHandle>(null);

  function closeSidebar() {
    setSidebarOpen("none");
  }

  function handleClose() {
    if (sidebarFormRef.current?.dirty) {
      openCancelDialog({
        onConfirm: closeSidebar,
      });
    } else {
      closeSidebar();
    }
  }

  return (
    <StickyToolbarLayout toolbar={<Toolbar title="Person Sidebar" />}>
      <MainContentLayout fullViewportHeight>
        <Stack gap={3}>
          <Button onClick={() => setSidebarOpen("default")}>
            Open Default Sidebar
          </Button>
          <Button onClick={() => setSidebarOpen("esu")}>
            Open ESU Sidebar
          </Button>
        </Stack>

        <Sidebar open={sidebarOpen !== "none"} onClose={handleClose}>
          {sidebarOpen === "default" && (
            <PersonSidebar
              onCancel={handleClose}
              onSelect={(values) => {
                // eslint-disable-next-line no-console
                console.log(values);
                snackbar.confirmation("Vorgang wurde angelegt");
                closeSidebar();
                return Promise.resolve();
              }}
              onCreate={(values) => {
                // eslint-disable-next-line no-console
                console.log("Default Form Result", values);
                snackbar.confirmation("Vorgang wurde angelegt");
                closeSidebar();
                return Promise.resolve();
              }}
              sidebarFormRef={sidebarFormRef}
              title={"Vorgang anlegen"}
              submitLabel={"Fertig"}
              addressRequired
            />
          )}
          {sidebarOpen === "esu" && (
            <PersonSidebar<EsuPersonSearchFormValues, EsuPersonCreateFormValues>
              title={"Vorgang anlegen"}
              submitLabel={"Vorgang anlegen"}
              sidebarFormRef={sidebarFormRef}
              onCancel={handleClose}
              onSelect={(values) => {
                // eslint-disable-next-line no-console
                console.log(values);
                snackbar.confirmation("Vorgang wurde angelegt");
                closeSidebar();
                return Promise.resolve();
              }}
              onCreate={({ searchInputs, createInputs }) => {
                // eslint-disable-next-line no-console
                console.log("ESU Form Result", {
                  // inputs on the search step
                  searchInputs,
                  // inputs on the create / edit step
                  createInputs,
                });
                snackbar.confirmation("Vorgang wurde angelegt");
                closeSidebar();
                return Promise.resolve();
              }}
              searchFormComponent={EsuPersonSearchForm}
              initialSearchState={{
                ...defaultSearchPersonValues(),
                type: "REGULAR_EXAMINATION",
              }}
            />
          )}
        </Sidebar>
      </MainContentLayout>
    </StickyToolbarLayout>
  );
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
