/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import {
  BaseAddressFormInputs,
  FormButtonBar,
  MainContentLayout,
  Sidebar,
  SidebarActions,
  SidebarContent,
  SidebarForm,
  StickyToolbarLayout,
  Toolbar,
  createEmptyAddress,
} from "@eshg/lib-employee-portal";
import { createFieldNameMapper } from "@eshg/lib-portal/helpers/form";
import { Button, Grid, Stack } from "@mui/joy";
import { Formik } from "formik";
import { useState } from "react";

import {
  BillingAddressForm,
  ContactAddressForm,
  OptionalBillingAddressForm,
} from "@/lib/shared/components/form/address/BaseAddressForm";

type SidebarState = "contact_only" | "billing_only" | "optional_billing";

export default function AddressFormExamplePage() {
  const [sidebarState, setSidebarState] = useState<SidebarState>();
  return (
    <StickyToolbarLayout
      toolbar={<Toolbar title="Beispiel Adressen Formulare" />}
    >
      <MainContentLayout>
        <Stack gap={3}>
          <Button onClick={() => setSidebarState("contact_only")}>
            Kontakt Adresse
          </Button>
          <Button onClick={() => setSidebarState("billing_only")}>
            Rechnungsadresse
          </Button>
          <Button onClick={() => setSidebarState("optional_billing")}>
            Optionale Abweichende Rechnungsadresse
          </Button>
        </Stack>

        <ContactOnlySidebar
          open={sidebarState === "contact_only"}
          onClose={() => setSidebarState(undefined)}
        />
        <BillingOnlySidebar
          open={sidebarState === "billing_only"}
          onClose={() => setSidebarState(undefined)}
        />
        <OptionalBillingSidebar
          open={sidebarState === "optional_billing"}
          onClose={() => setSidebarState(undefined)}
        />
      </MainContentLayout>
    </StickyToolbarLayout>
  );
}

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

function ContactOnlySidebar(props: SidebarProps) {
  return (
    <Sidebar {...props}>
      <Formik
        initialValues={createEmptyAddress()}
        onSubmit={(_values, helpers) => {
          helpers.resetForm();
          props.onClose();
        }}
      >
        {({ isSubmitting, values }) => (
          <SidebarForm>
            <SidebarContent title={"Kontaktadresse"}>
              <Grid container spacing={2}>
                <ContactAddressForm name={""} type={values.type} />
              </Grid>
            </SidebarContent>
            <SidebarActions>
              <FormButtonBar
                submitLabel={"Speichern"}
                submitting={isSubmitting}
              />
            </SidebarActions>
          </SidebarForm>
        )}
      </Formik>
    </Sidebar>
  );
}

function BillingOnlySidebar(props: SidebarProps) {
  return (
    <Sidebar {...props}>
      <Formik
        initialValues={createEmptyAddress()}
        onSubmit={(_values, helpers) => {
          helpers.resetForm();
          props.onClose();
        }}
      >
        {({ isSubmitting, values }) => (
          <SidebarForm>
            <SidebarContent title={"Kontaktadresse"}>
              <Grid container spacing={2}>
                <BillingAddressForm name={""} type={values.type} />
              </Grid>
            </SidebarContent>
            <SidebarActions>
              <FormButtonBar
                submitLabel={"Speichern"}
                submitting={isSubmitting}
              />
            </SidebarActions>
          </SidebarForm>
        )}
      </Formik>
    </Sidebar>
  );
}

function OptionalBillingSidebar(props: SidebarProps) {
  interface FormType {
    contact: BaseAddressFormInputs;
    billing?: BaseAddressFormInputs;
  }

  const fieldName = createFieldNameMapper<FormType>();

  return (
    <Sidebar {...props}>
      <Formik
        initialValues={
          {
            contact: createEmptyAddress(),
            billing: undefined,
          } as FormType
        }
        onSubmit={(_values, helpers) => {
          helpers.resetForm();
          props.onClose();
        }}
      >
        {({ isSubmitting, values }) => (
          <SidebarForm>
            <SidebarContent title={"Kontaktadresse"}>
              <Grid container spacing={2}>
                <ContactAddressForm
                  name={fieldName("contact")}
                  type={values.contact.type}
                />
                <OptionalBillingAddressForm
                  name={fieldName("billing")}
                  values={values.billing}
                />
              </Grid>
            </SidebarContent>
            <SidebarActions>
              <FormButtonBar
                submitLabel={"Speichern"}
                submitting={isSubmitting}
              />
            </SidebarActions>
          </SidebarForm>
        )}
      </Formik>
    </Sidebar>
  );
}
