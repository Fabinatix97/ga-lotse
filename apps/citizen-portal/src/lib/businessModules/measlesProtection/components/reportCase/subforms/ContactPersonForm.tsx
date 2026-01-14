/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import AddIcon from "@mui/icons-material/AddOutlined";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import { Button, Divider, Grid, IconButton, Typography } from "@mui/joy";
import { FieldArray } from "formik";

import {
  InputField,
  SelectField,
  createFieldNameMapper,
  useValidateLength,
  validateEmail,
} from "@eshg/lib-portal";

import { FormSectionLabel } from "@/lib/businessModules/measlesProtection/components/reportCase/ReportCaseForm";
import {
  FacilityContactPersonFormInputs,
  FacilityFormInputs,
} from "@/lib/businessModules/measlesProtection/components/reportCase/types";
import { Row } from "@/lib/businessModules/measlesProtection/shared/components/Row";
import {
  FIRST_NAME_MAX_LENGTH,
  LAST_NAME_MAX_LENGTH,
} from "@/lib/businessModules/measlesProtection/shared/constants";
import {
  salutationOptions,
  titleOptions,
} from "@/lib/businessModules/measlesProtection/shared/translations";
import { useTranslation } from "@/lib/i18n/client";

import { NestedFormProps } from "./AffectedPersonForm";

export function createEmptyContactPerson(): FacilityContactPersonFormInputs {
  return {
    salutation: "NOT_SPECIFIED",
    title: "",
    role: "",
    firstName: "",
    lastName: "",
    emailAddress: "",
    phoneNumber: "",
  };
}

export function ContactPersonForm(props: NestedFormProps) {
  const { t } = useTranslation(["measlesProtection/forms"]);
  const validateLength = useValidateLength();
  const fieldName = createFieldNameMapper<FacilityContactPersonFormInputs>(
    props.name,
  );

  return (
    <>
      <FormSectionLabel value={t("facility.contactPerson")} />
      <Grid xxs={12} xs={6}>
        <SelectField
          name={fieldName("salutation")}
          label={t("common.personalDetails.salutation")}
          options={salutationOptions(t)}
        />
      </Grid>
      <Grid xxs={12} xs={6}>
        <SelectField
          name={fieldName("title")}
          label={t("common.personalDetails.title")}
          options={titleOptions(t)}
        />
      </Grid>
      <Grid xxs={12}>
        <InputField
          name={fieldName("role")}
          label={t("facility.fields.role")}
        />
      </Grid>
      <Grid xxs={12} xs={6}>
        <InputField
          name={fieldName("firstName")}
          label={t("common.personalDetails.firstName")}
          required={t("common.personalDetails.firstName_required")}
          validate={validateLength(1, FIRST_NAME_MAX_LENGTH)}
        />
      </Grid>
      <Grid xxs={12} xs={6}>
        <InputField
          name={fieldName("lastName")}
          label={t("common.personalDetails.lastName")}
          required={t("common.personalDetails.lastName_required")}
          validate={validateLength(1, LAST_NAME_MAX_LENGTH)}
        />
      </Grid>
      <Grid xxs={12} xs={6}>
        <InputField
          type="email"
          name={fieldName("emailAddress")}
          label={t("common.personalDetails.emailAddress")}
          required={t("common.personalDetails.emailAddress_required")}
          validate={validateEmail(
            t("common.personalDetails.emailAddress_required"),
          )}
        />
      </Grid>
      <Grid xxs={12} xs={6}>
        <InputField
          type="tel"
          name={fieldName("phoneNumber")}
          label={t("common.personalDetails.phoneNumber")}
          required={t("common.personalDetails.phoneNumber_required")}
        />
      </Grid>
    </>
  );
}

interface ContactPersonFieldArrayProps {
  values: FacilityFormInputs;
  contactPersonRequired?: boolean;
}

// eslint-disable-next-line unused-imports/no-unused-vars
function ContactPersonsFieldArray({
  values,
  contactPersonRequired,
}: ContactPersonFieldArrayProps) {
  return (
    <FieldArray name="contactPersons" validateOnChange={false}>
      {({ push, remove }) => (
        <>
          {values.contactPersons?.map((_contactPerson, index) => {
            // don't include any values in the key, as this would cause the input fields to lose focus
            const key = `contactPerson.${index}`;
            const sectionHeader = `Kontaktperson${index !== 0 ? " " + (index + 1) : ""}`;
            return (
              <section key={key}>
                <Divider />
                <Row justifyContent="space-between">
                  <Typography
                    level="body-md"
                    component="h2"
                    paddingTop={3}
                    paddingBottom={3}
                    fontWeight="bold"
                    alignSelf="center"
                  >
                    {sectionHeader}
                  </Typography>
                  {!(index === 0 && contactPersonRequired) && (
                    <IconButton
                      color="primary"
                      aria-label={`${sectionHeader} löschen`}
                      onClick={() => remove(index)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  )}
                </Row>
                <ContactPersonForm name={`contactPersons.${index}`} />
              </section>
            );
          })}
          <Button
            variant="plain"
            color="primary"
            startDecorator={<AddIcon />}
            size="sm"
            sx={{
              padding: 0,
              margin: 0,
              "--Button-minHeight": 0,
              alignSelf: "flex-start",
            }}
            onClick={() => push(createEmptyContactPerson())}
          >
            Kontaktperson hinzufügen
          </Button>
        </>
      )}
    </FieldArray>
  );
}
