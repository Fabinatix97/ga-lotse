/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Divider, Grid, Stack, Typography } from "@mui/joy";
import { useFormikContext } from "formik";

import { ApiSalutation } from "@eshg/base-api";
import { DateField } from "@eshg/lib-portal/components/formFields/DateField";
import { InputField } from "@eshg/lib-portal/components/formFields/InputField";
import { SelectField } from "@eshg/lib-portal/components/formFields/SelectField";
import {
  AcademicTitle,
  SALUTATION_OPTIONS,
  TITLE_VALUES,
} from "@eshg/lib-portal/components/formFields/constants";
import {
  buildEnumOptions,
  createFieldNameMapper,
} from "@eshg/lib-portal/helpers/form";
import { validateDateOfBirth } from "@eshg/lib-portal/helpers/validators";
import {
  NestedFormProps,
  OptionalFieldValue,
} from "@eshg/lib-portal/types/form";
import { EnumMap } from "@eshg/lib-portal/types/helpers";
import { ApiContactType } from "@eshg/lib-procedures-api";

import {
  AddressForm,
  AddressValues,
  EMPTY_ADDRESS_VALUES,
} from "./AddressForm";
import { CreateInboxProcedureValues } from "./CreateInboxProcedureForm";

export const EMPTY_CONTACT_VALUES: ContactValues = {
  salutation: ApiSalutation.NotSpecified,
  type: "",
  facilityName: "",
  firstName: "",
  lastName: "",
  title: AcademicTitle.NotSpecified,
  dateOfBirth: "",
  address: EMPTY_ADDRESS_VALUES,
};

export interface ContactValues {
  type: OptionalFieldValue<ApiContactType>;
  salutation: ApiSalutation;
  facilityName: string;
  firstName: string;
  lastName: string;
  title: AcademicTitle;
  dateOfBirth: string;
  address: AddressValues;
}

const INBOX_PROCEDURE_CONTACT_TYPES: EnumMap<ApiContactType> = {
  [ApiContactType.Facility]: "Einrichtung",
  [ApiContactType.PrivatePerson]: "Privatperson",
};

export function ContactForm(props: NestedFormProps) {
  const fieldName = createFieldNameMapper(props.name);
  const { values } = useFormikContext<CreateInboxProcedureValues>();

  return (
    <>
      <Grid xs={12}>
        <Typography level="title-md">Kontakt Einrichtung/Person</Typography>
      </Grid>
      <Grid xs={6}>
        <Stack direction="column" gap={2}>
          <SelectField
            name={fieldName("type")}
            label="Typ"
            options={buildEnumOptions<ApiContactType>(
              INBOX_PROCEDURE_CONTACT_TYPES,
            )}
            required="Bitte einen Typ auswählen."
          />
          {values.contact.type == ApiContactType.Facility && (
            <InputField
              name={fieldName("facilityName")}
              label="Name der Einrichtung"
              required="Bitte den Namen der Einrichtung angeben."
            />
          )}
          <Stack direction="row" gap={2}>
            <Grid xs={6} padding={0}>
              <SelectField
                name={fieldName("salutation")}
                label="Anrede"
                options={SALUTATION_OPTIONS}
              />
            </Grid>
            <Grid xs={6} padding={0}>
              <SelectField
                name={fieldName("title")}
                label="Titel"
                options={buildEnumOptions(TITLE_VALUES)}
              />
            </Grid>
          </Stack>
          <InputField name={fieldName("firstName")} label="Vorname" />
          <InputField
            data-testid="last-name"
            name={fieldName("lastName")}
            label="Name"
            required={
              values.contact.type === ApiContactType.PrivatePerson
                ? "Bitte einen Nachnamen angeben."
                : undefined
            }
          />
          <DateField
            name={fieldName("dateOfBirth")}
            label="Geburtsdatum"
            validate={validateDateOfBirth}
          />
          <Divider />
          <AddressForm name={fieldName("address")} />
        </Stack>
      </Grid>
      <Grid xs={6} />
    </>
  );
}
