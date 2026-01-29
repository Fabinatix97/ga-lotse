/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { Stack } from "@mui/joy";
import { useFormikContext } from "formik";
import { PropsWithChildren } from "react";

import { ButtonLink } from "@eshg/lib-portal";

import { SidebarActions } from "../../features/drawer/components/SidebarActions";
import { SidebarContent } from "../../features/drawer/components/SidebarContent";
import { DefaultSearchPersonFormFields } from "../../features/persons/components/search/DefaultSearchPersonFormFields";
import {
  SearchPersonFormProps,
  SearchPersonFormValues,
} from "../../features/persons/components/search/SearchPersonSidebar";
import { MultiFormButtonBar } from "../form/MultiFormButtonBar";

export function SearchCustodianForm(
  props: PropsWithChildren<SearchPersonFormProps<SearchPersonFormValues>>,
) {
  const { values } = useFormikContext<SearchPersonFormValues>();
  return (
    <>
      <SidebarContent title={props.title}>
        <Stack gap={2}>
          {props.children ?? <DefaultSearchPersonFormFields />}
          <ButtonLink
            sx={{ alignSelf: "flex-end" }}
            underline="none"
            fontWeight="lg"
            onClick={() =>
              props.onCreateWithoutSearch({ ...values, dateOfBirth: "" })
            }
          >
            Geburtsdatum unbekannt?
          </ButtonLink>
        </Stack>
      </SidebarContent>
      <SidebarActions>
        <MultiFormButtonBar
          submitting={props.isSubmitting}
          submitLabel="Weiter"
          onBack={props.onBack}
          onCancel={props.onCancel}
        />
      </SidebarActions>
    </>
  );
}
