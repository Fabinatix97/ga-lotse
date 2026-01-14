/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Box, Grid, Typography } from "@mui/joy";
import { Formik } from "formik";
import { useMemo } from "react";
import { isEmpty } from "remeda";

import { ApiBaseFeature, ApiBusinessModule } from "@eshg/base-api";
import {
  FormSheet,
  buildOptionsFromProcedureTypes,
} from "@eshg/lib-employee-portal";
import {
  OptionalFieldValue,
  SelectField,
  SubmitButton,
  buildEnumOptions,
} from "@eshg/lib-portal";
import { ApiProcedureType } from "@eshg/lib-procedures-api";

import { useIsNewFeatureEnabled } from "@/lib/baseModule/api/queries/feature";
import { inboxAwareBusinessModuleNames } from "@/lib/baseModule/components/inboxProcedures/types";
import {
  getAllProcedureTypes,
  resolveProcedureTypes,
} from "@/lib/baseModule/moduleRegister/procedureTypesResolver";
import { FormGroupGrid } from "@/lib/shared/components/form/FormGroupGrid";
import { businessModuleNames } from "@/lib/shared/components/procedures/constants";

import { ContactForm, ContactValues } from "./ContactForm";
import {
  InboxProgressEntryForm,
  InboxProgressEntryValues,
} from "./InboxProgressEntryForm";
import { validateForm } from "./validate";

export interface CreateInboxProcedureValues {
  businessModule: OptionalFieldValue<ApiBusinessModule>;
  procedureType: OptionalFieldValue<ApiProcedureType>;
  inboxProgressEntry: InboxProgressEntryValues;
  contact: ContactValues;
}

interface CreateInboxProcedureFormProps {
  initialValues: CreateInboxProcedureValues;
  onSubmit: (values: CreateInboxProcedureValues) => Promise<void>;
}

function buildProcedureTypeOptions(
  businessModuleValue: OptionalFieldValue<ApiBusinessModule>,
) {
  return isEmpty(businessModuleValue)
    ? buildOptionsFromProcedureTypes(getAllProcedureTypes())
    : buildOptionsFromProcedureTypes(
        resolveProcedureTypes(businessModuleValue),
      );
}

export function CreateInboxProcedureForm(props: CreateInboxProcedureFormProps) {
  const isInboxEnabled = useIsNewFeatureEnabled(ApiBaseFeature.Inbox);

  const businessModuleOptions = useMemo(() => {
    return isInboxEnabled
      ? buildEnumOptions(inboxAwareBusinessModuleNames)
      : [
          {
            value: ApiBusinessModule.Inspection,
            label: businessModuleNames[ApiBusinessModule.Inspection],
          },
        ];
  }, [isInboxEnabled]);

  const initialValues = useMemo(() => {
    const initialValues = { ...props.initialValues };
    if (!isInboxEnabled) {
      initialValues.businessModule = ApiBusinessModule.Inspection;
      initialValues.procedureType = ApiProcedureType.Inspection;
    }
    return initialValues;
  }, [isInboxEnabled, props.initialValues]);

  return (
    <Formik
      initialValues={initialValues}
      validate={validateForm}
      onSubmit={props.onSubmit}
    >
      {({ handleSubmit, isSubmitting, values }) => {
        return (
          <FormSheet onSubmit={handleSubmit}>
            <Typography level="h3" component="h2">
              Neuen Posteingangsvorgang anlegen
            </Typography>
            <Grid container spacing={3} direction="row">
              <Grid xs={6}>
                <SelectField
                  name="businessModule"
                  label="Fachmodul"
                  options={businessModuleOptions}
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
        );
      }}
    </Formik>
  );
}
