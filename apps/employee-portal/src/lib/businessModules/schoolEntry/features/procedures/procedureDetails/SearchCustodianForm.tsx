/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Stack } from "@mui/joy";
import { useFormikContext } from "formik";
import { PropsWithChildren } from "react";

import {
  DefaultSearchPersonFormFields,
  MultiFormButtonBar,
  SearchPersonFormProps,
  SearchPersonFormValues,
  SidebarActions,
  SidebarContent,
} from "@eshg/lib-employee-portal";
import { ButtonLink } from "@eshg/lib-portal";

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
