/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { InputField } from "@eshg/lib-portal/components/formFields/InputField";
import { SelectField } from "@eshg/lib-portal/components/formFields/SelectField";
import {
  validateLength,
  validatePipe,
} from "@eshg/lib-portal/helpers/validators";
import { Chip, Grid } from "@mui/joy";
import { Formik } from "formik";
import { useRef } from "react";

import { useSuggestUser } from "@/lib/baseModule/api/mutations/users";
import { useConfirmationDialog } from "@/lib/shared/components/confirmationDialog/ConfirmationDialogProvider";
import { FormButtonBar } from "@/lib/shared/components/form/FormButtonBar";
import {
  SidebarForm,
  SidebarFormHandle,
} from "@/lib/shared/components/form/SidebarForm";
import { EmailField } from "@/lib/shared/components/formFields/EmailField";
import { Sidebar } from "@/lib/shared/components/sidebar/Sidebar";
import { SidebarActions } from "@/lib/shared/components/sidebar/SidebarActions";
import { SidebarContent } from "@/lib/shared/components/sidebar/SidebarContent";
import { translateUserGroup } from "@/lib/shared/helpers/users";

function initialInputs() {
  return {
    username: "",
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
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
  groups: string[];
}

interface SuggestNewUserFormSidebarProps {
  open: boolean;
  onClose: () => void;
  availableGroups: string[];
}

export function SuggestNewUserFormSidebar({
  open,
  onClose,
  availableGroups,
}: SuggestNewUserFormSidebarProps) {
  const { openCancelDialog } = useConfirmationDialog();
  const formRef = useRef<SidebarFormHandle>(null);

  function closeAndReset() {
    onClose();
    formRef.current?.resetForm();
  }

  const suggestUser = useSuggestUser();

  function handleClose() {
    if (formRef.current?.dirty) {
      openCancelDialog({
        onConfirm: () => {
          closeAndReset();
        },
      });
    } else {
      closeAndReset();
    }
  }

  async function handleSubmit(values: UserAddFormInputs) {
    await suggestUser
      .mutateAsync(values, {
        onSuccess: closeAndReset,
      })
      .catch();
  }

  return (
    <Sidebar open={open} onClose={handleClose}>
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
                  <InputField name={"phoneNumber"} label={"Telefonnummer"} />
                </Grid>
                <Grid xxs={12}>
                  <InputField
                    name={"externalChatUsername"}
                    label={"Chat Benutzername"}
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
                onCancel={handleClose}
              />
            </SidebarActions>
          </SidebarForm>
        )}
      </Formik>
    </Sidebar>
  );
}
