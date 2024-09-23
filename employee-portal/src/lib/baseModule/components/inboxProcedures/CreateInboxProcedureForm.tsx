/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiProcedureType } from "@eshg/employee-portal-api/businessProcedures";
import { SubmitButton } from "@eshg/lib-portal/components/buttons/SubmitButton";
import { SelectField } from "@eshg/lib-portal/components/formFields/SelectField";
import { buildEnumOptions } from "@eshg/lib-portal/helpers/form";
import { OptionalFieldValue } from "@eshg/lib-portal/types/form";
import { Box, Grid, Typography } from "@mui/joy";
import { Formik } from "formik";
import { isEmpty } from "remeda";

import {
  InboxAwareBusinessModule,
  inboxAwareBusinessModuleNames,
} from "@/lib/baseModule/components/inboxProcedures/types";
import {
  getAllProcedureTypes,
  resolveProcedureTypes,
} from "@/lib/baseModule/moduleRegister/procedureTypesResolver";
import { FormGroupGrid } from "@/lib/shared/components/form/FormGroupGrid";
import { FormSheet } from "@/lib/shared/components/form/FormSheet";
import { buildOptionsFromProcedureTypes } from "@/lib/shared/components/procedures/helper";

import { ContactForm, ContactValues } from "./ContactForm";
import {
  InboxProgressEntryForm,
  InboxProgressEntryValues,
} from "./InboxProgressEntryForm";
import { validateForm } from "./validate";

export interface CreateInboxProcedureValues {
  businessModule: OptionalFieldValue<InboxAwareBusinessModule>;
  procedureType: OptionalFieldValue<ApiProcedureType>;
  inboxProgressEntry: InboxProgressEntryValues;
  contact: ContactValues;
}

interface CreateInboxProcedureFormProps {
  initialValues: CreateInboxProcedureValues;
  onSubmit: (values: CreateInboxProcedureValues) => Promise<void>;
}

function buildProcedureTypeOptions(
  businessModuleValue: OptionalFieldValue<InboxAwareBusinessModule>,
) {
  return isEmpty(businessModuleValue)
    ? buildOptionsFromProcedureTypes(getAllProcedureTypes())
    : buildOptionsFromProcedureTypes(
        resolveProcedureTypes(businessModuleValue),
      );
}

export function CreateInboxProcedureForm(props: CreateInboxProcedureFormProps) {
  return (
    <Formik
      initialValues={props.initialValues}
      onSubmit={props.onSubmit}
      validate={validateForm}
    >
      {({ handleSubmit, isSubmitting, values }) => (
        <FormSheet onSubmit={handleSubmit}>
          <Typography level="h3" component="h2">
            Neuen Posteingangsvorgang anlegen
          </Typography>
          <Grid container spacing={3} direction="row">
            <Grid xs={6}>
              <SelectField
                name="businessModule"
                label="Fachmodul"
                options={buildEnumOptions(inboxAwareBusinessModuleNames)}
                required="Bitte ein Fachmodul auswählen"
              />
            </Grid>
            <Grid xs={6}>
              <SelectField
                name="procedureType"
                label="Art"
                options={buildProcedureTypeOptions(values.businessModule)}
              />
            </Grid>
          </Grid>
          <FormGroupGrid data-testid="inboxProgressEntryForm">
            <InboxProgressEntryForm name="inboxProgressEntry" />
          </FormGroupGrid>
          <FormGroupGrid data-testid="inboxContactForm">
            <ContactForm name="contact" />
          </FormGroupGrid>
          <Box display="flex" justifyContent="flex-end">
            <SubmitButton submitting={isSubmitting}>
              Posteingangsobjekt anlegen
            </SubmitButton>
          </Box>
        </FormSheet>
      )}
    </Formik>
  );
}
