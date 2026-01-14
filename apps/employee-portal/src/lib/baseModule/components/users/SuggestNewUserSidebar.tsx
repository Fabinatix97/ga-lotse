/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Chip, Grid } from "@mui/joy";
import { Formik } from "formik";

import { ApiSalutation } from "@eshg/base-api";
import {
  FormButtonBar,
  SidebarActions,
  SidebarContent,
  SidebarForm,
  SidebarWithFormRefProps,
  useSidebarWithFormRef,
} from "@eshg/lib-employee-portal";
import {
  EmailField,
  InputField,
  PhoneNumberField,
  SALUTATION_OPTIONS,
  SelectField,
  TITLE_OPTIONS,
  mapOptionalValue,
  useValidateLength,
  validatePipe,
} from "@eshg/lib-portal";

import { useSuggestUser } from "@/lib/baseModule/api/mutations/users";
import { usePhoneNumberValidator } from "@/lib/baseModule/components/users/validation";
import { translateUserGroup } from "@/lib/shared/helpers/users";

function initialInputs() {
  return {
    username: "",
    salutation: ApiSalutation.NotSpecified,
    title: "",
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    externalChatUsername: "",
    groups: [],
  } as const satisfies UserAddFormInputs;
}

function validateUsernameCharacters(input: string): string | undefined {
  if (/^[a-zA-Z0-9_.\-]+$/.test(input)) {
    return undefined;
  }

  return (
    "Gültige Benutzernamen benutzten ausschließlich: " +
    "Buchstaben, Zahlen, Bindestriche, Unterstriche und Punkte"
  );
}

interface UserAddFormInputs {
  username: string;
  salutation: ApiSalutation;
  title: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  externalChatUsername: string;
  groups: string[];
}

interface SuggestNewUserFormSidebarProps extends SidebarWithFormRefProps {
  availableGroups: string[];
}

export function useSuggestNewUserSidebar() {
  return useSidebarWithFormRef({
    component: SuggestNewUserFormSidebar,
  });
}

function SuggestNewUserFormSidebar({
  onClose,
  formRef,
  availableGroups,
}: SuggestNewUserFormSidebarProps) {
  const validateLength = useValidateLength();
  const phoneNumberValidator = usePhoneNumberValidator();
  const suggestUser = useSuggestUser();

  async function handleSubmit(values: UserAddFormInputs) {
    await suggestUser.mutateAsync(
      {
        username: values.username,
        salutation: mapOptionalValue(values.salutation),
        title: mapOptionalValue(values.title),
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        phoneNumber: mapOptionalValue(values.phoneNumber),
        externalChatUsername: mapOptionalValue(values.externalChatUsername),
        groups: values.groups,
      },
      {
        onSuccess: () => onClose(true),
      },
    );
  }

  return (
    <Formik
      initialValues={initialInputs()}
      onSubmit={async (values) => {
        await handleSubmit(values);
      }}
    >
      {({ isSubmitting }) => (
        <SidebarForm ref={formRef}>
          <SidebarContent title="Benutzer vorschlagen">
            <Grid container spacing={2}>
              <Grid xxs={12}>
                <InputField
                  name="username"
                  label="Benutzername"
                  placeholder="Beispielsweise erika.mustermann"
                  required="Bitte einen Benutzernamen angeben"
                  validate={validatePipe(
                    validateLength(3, 200),
                    validateUsernameCharacters,
                  )}
                />
              </Grid>
              <Grid xxs={12}>
                <EmailField
                  name="email"
                  label="E-Mail"
                  required="Bitte eine E-Mail angeben"
                />
              </Grid>
              <Grid xxs={6}>
                <SelectField
                  name="salutation"
                  label="Anrede"
                  options={SALUTATION_OPTIONS}
                  sx={{ flex: 1 }}
                />
              </Grid>
              <Grid xxs={6}>
                <SelectField
                  name="title"
                  label="Titel"
                  options={TITLE_OPTIONS}
                  sx={{ flex: 1 }}
                />
              </Grid>
              <Grid xxs={12} sm={6}>
                <InputField
                  name="firstName"
                  label="Vorname"
                  required="Bitte einen Vornamen angeben"
                  validate={validateLength(2, 200)}
                />
              </Grid>
              <Grid xxs={12} sm={6}>
                <InputField
                  name="lastName"
                  label="Nachname"
                  required="Bitte einen Nachnamen angeben"
                  validate={validateLength(2, 200)}
                />
              </Grid>
              <Grid xxs={12}>
                <PhoneNumberField
                  name="phoneNumber"
                  label="Telefonnummer"
                  validate={phoneNumberValidator}
                />
              </Grid>
              <Grid xxs={12}>
                <SelectField
                  multiple
                  name="groups"
                  label="Gruppen"
                  options={availableGroups.map((name) => ({
                    value: name,
                    label: translateUserGroup(name),
                  }))}
                  renderValue={(groups) =>
                    groups.map((group) => (
                      <Chip key={group.value} color="primary">
                        {group.label}
                      </Chip>
                    ))
                  }
                />
              </Grid>
            </Grid>
          </SidebarContent>
          <SidebarActions>
            <FormButtonBar
              submitLabel="Vorschlagen"
              submitting={isSubmitting}
              onCancel={() => onClose(false)}
            />
          </SidebarActions>
        </SidebarForm>
      )}
    </Formik>
  );
}
