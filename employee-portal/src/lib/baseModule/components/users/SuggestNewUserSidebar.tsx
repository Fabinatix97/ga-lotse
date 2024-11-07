/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { InputField } from "@eshg/lib-portal/components/formFields/InputField";
import { SelectField } from "@eshg/lib-portal/components/formFields/SelectField";
import { mapOptionalValue } from "@eshg/lib-portal/helpers/form";
import {
  validateLength,
  validatePipe,
} from "@eshg/lib-portal/helpers/validators";
import { Chip, Grid } from "@mui/joy";
import { Formik } from "formik";

import { useSuggestUser } from "@/lib/baseModule/api/mutations/users";
import {
  chatUsernameValidator,
  phoneNumberValidator,
} from "@/lib/baseModule/components/users/validation";
import { FormButtonBar } from "@/lib/shared/components/form/FormButtonBar";
import { SidebarForm } from "@/lib/shared/components/form/SidebarForm";
import { EmailField } from "@/lib/shared/components/formFields/EmailField";
import { PhoneNumberField } from "@/lib/shared/components/formFields/PhoneNumberField";
import { SidebarActions } from "@/lib/shared/components/sidebar/SidebarActions";
import { SidebarContent } from "@/lib/shared/components/sidebar/SidebarContent";
import { translateUserGroup } from "@/lib/shared/helpers/users";
import {
  SidebarWithFormRefProps,
  useSidebarWithFormRef,
} from "@/lib/shared/hooks/useSidebarWithFormRef";

function initialInputs() {
  return {
    username: "",
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
  const suggestUser = useSuggestUser();

  async function handleSubmit(values: UserAddFormInputs) {
    await suggestUser.mutateAsync(
      {
        username: values.username,
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
          <SidebarContent title={"Benutzer vorschlagen"}>
            <Grid container spacing={2}>
              <Grid xxs={12}>
                <InputField
                  name={"username"}
                  label={"Benutzername"}
                  placeholder={"Beispielsweise erika.mustermann"}
                  required={"Bitte einen Benutzernamen angeben"}
                  validate={validatePipe(
                    validateLength(3, 200),
                    validateUsernameCharacters,
                  )}
                />
              </Grid>
              <Grid xxs={12}>
                <EmailField
                  name={"email"}
                  label={"E-Mail"}
                  required={"Bitte eine E-Mail angeben"}
                />
              </Grid>
              <Grid xxs={12} sm={6}>
                <InputField
                  name={"firstName"}
                  label={"Vorname"}
                  required={"Bitte einen Vornamen angeben"}
                  validate={validateLength(2, 200)}
                />
              </Grid>
              <Grid xxs={12} sm={6}>
                <InputField
                  name={"lastName"}
                  label={"Nachname"}
                  required={"Bitte einen Nachnamen angeben"}
                  validate={validateLength(2, 200)}
                />
              </Grid>
              <Grid xxs={12}>
                <PhoneNumberField
                  name={"phoneNumber"}
                  label={"Telefonnummer"}
                  validate={phoneNumberValidator}
                />
              </Grid>
              <Grid xxs={12}>
                <InputField
                  name={"externalChatUsername"}
                  label={"Chat Benutzername"}
                  validate={chatUsernameValidator}
                />
              </Grid>
              <Grid xxs={12}>
                <SelectField
                  multiple
                  name={`groups`}
                  label={`Gruppen`}
                  options={availableGroups.map((name) => ({
                    value: name,
                    label: translateUserGroup(name),
                  }))}
                  renderValue={(groups) =>
                    groups.map((group) => (
                      <Chip key={group.value} color={"primary"}>
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
              submitLabel={"Vorschlagen"}
              submitting={isSubmitting}
              onCancel={() => onClose(false)}
            />
          </SidebarActions>
        </SidebarForm>
      )}
    </Formik>
  );
}
