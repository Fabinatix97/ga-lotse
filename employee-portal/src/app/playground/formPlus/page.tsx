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
import { FormPlus } from "@eshg/lib-portal/components/form/FormPlus";
import { InputField } from "@eshg/lib-portal/components/formFields/InputField";
import { useSnackbar } from "@eshg/lib-portal/components/snackbar/SnackbarProvider";
import { Button, CircularProgress, Grid, Stack } from "@mui/joy";
import { Formik } from "formik";

export default function PlaygroundFormPlusPage() {
  const snackbar = useSnackbar();

  return (
    <StickyToolbarLayout
      toolbar={<Toolbar title="Playground - Formik FormPlus Page" />}
    >
      <MainContentLayout>
        <h2>Form 1</h2>
        <Formik
          initialValues={{ firstName: "", lastName: "" }}
          onSubmit={() => {
            snackbar.confirmation("Schön!");
          }}
        >
          <FormPlus>
            <Stack maxHeight="200px" overflow="scroll" gap={2}>
              <LoremIpsum />
              <InputField label="Name" name="lastName" required="Bitte" />
              <InputField label="Vorname" name="firstName" required="Bitte" />
            </Stack>
            <Button type="submit">Los gehts!</Button>
          </FormPlus>
        </Formik>

        <h2>Form 2</h2>
        <Formik
          initialValues={{
            color: "",
            mobileNumber: "",
            telephoneNumber: "",
            telephoneNumberExt: "",
          }}
          onSubmit={async () => {
            await new Promise((resolve) => setTimeout(resolve, 1000));
            snackbar.confirmation("Toll!");
          }}
        >
          {({ isSubmitting }) => (
            <FormPlus>
              <Grid
                container
                maxHeight="200px"
                overflow="scroll"
                spacing={2}
                flexDirection="row-reverse"
              >
                <Grid xs={12}>
                  <InputField
                    label="Handynummer"
                    name="mobileNumber"
                    required="Bitte"
                  />
                </Grid>
                <Grid xs={8}>
                  <InputField
                    label="Festnetz"
                    name="telephoneNumber"
                    required="Bitte"
                  />
                </Grid>
                <Grid xs={4}>
                  <InputField label="Durchwahl" name="telephoneNumberExt" />
                </Grid>
                <Grid xs={12}>
                  <LoremIpsum />
                </Grid>
              </Grid>
              <Button
                type="submit"
                startDecorator={isSubmitting ? <CircularProgress /> : null}
                disabled={isSubmitting}
              >
                Weiter!
              </Button>
            </FormPlus>
          )}
        </Formik>
      </MainContentLayout>
    </StickyToolbarLayout>
  );
}

function LoremIpsum() {
  return (
    <p>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque in ornare
      nisl. Integer iaculis lorem id nisi porta convallis. Etiam ultricies,
      libero non ultricies molestie, lorem erat accumsan diam, ac malesuada
      tellus elit vitae ligula. Ut eu dolor nec eros fringilla placerat
      dignissim in urna. In hendrerit ligula metus, vitae varius est semper
      sollicitudin. In vehicula consectetur consequat. Proin ex est, blandit
      quis sollicitudin at, convallis in ante. Maecenas dictum cursus dapibus.
      Donec maximus, massa eget fringilla lacinia, nibh odio imperdiet dui, in
      congue dolor mauris non tellus. Proin commodo turpis ut nisl lobortis
      consequat vitae at urna. Phasellus eu commodo sapien. Cras eu congue ante.
      Suspendisse potenti. Praesent eget laoreet quam, eu accumsan libero. Etiam
      imperdiet efficitur ligula, vitae venenatis dui faucibus sed. Phasellus
      iaculis gravida dui, nec facilisis lectus gravida ac. Curabitur molestie
      dapibus dolor, et maximus felis consequat id. Curabitur ornare neque a
      commodo iaculis.
    </p>
  );
}
