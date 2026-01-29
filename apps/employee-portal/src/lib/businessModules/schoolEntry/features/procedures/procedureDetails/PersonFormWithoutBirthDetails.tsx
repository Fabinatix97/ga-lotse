/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Divider, Stack } from "@mui/joy";

import {
  AddressFormSection,
  ContactInfoFormSection,
  DefaultPersonFormValues,
  MultiFormButtonBar,
  PersonFormProps,
  PersonalFormSectionWithoutDateOfBirthDetails,
  SidebarActions,
  SidebarContent,
} from "@eshg/lib-employee-portal";
import { Alert } from "@eshg/lib-portal";

export function PersonFormWithoutBirthDetails(
  props: PersonFormProps<DefaultPersonFormValues>,
) {
  return (
    <>
      <SidebarContent title={props.title} subtitle={props.subtitle}>
        <Stack gap={3}>
          {props.mode === "create" && (
            <Alert
              color="primary"
              title="Fehlende Geburtsdaten"
              message="Personen ohne Geburtsdatum sind an einen Vorgang gebunden und erscheinen nicht in zukünftigen Suchen."
            />
          )}
          <PersonalFormSectionWithoutDateOfBirthDetails />
          <Divider />
          <AddressFormSection {...props} />
          <Divider />
          <ContactInfoFormSection />
        </Stack>
      </SidebarContent>
      <SidebarActions>
        <MultiFormButtonBar
          submitting={props.isSubmitting}
          submitLabel={props.submitLabel}
          onBack={props.onBack}
          onCancel={props.onCancel}
          onDelete={props.onDelete}
        />
      </SidebarActions>
    </>
  );
}
