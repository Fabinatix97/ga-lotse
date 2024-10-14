/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  ApiBaseFeature,
  ApiUser,
  ApiUserGroup,
} from "@eshg/employee-portal-api/base";
import { InputField } from "@eshg/lib-portal/components/formFields/InputField";
import {
  createFieldNameMapper,
  mapOptionalValue,
} from "@eshg/lib-portal/helpers/form";
import { Divider, Stack } from "@mui/joy";
import { Formik } from "formik";
import { Ref } from "react";
import { isDefined } from "remeda";

import { useUpdateSelfUser } from "@/lib/baseModule/api/mutations/users";
import { useIsNewFeatureEnabled } from "@/lib/baseModule/api/queries/feature";
import { GroupList } from "@/lib/baseModule/components/users/GroupList";
import { UserSidebarHeader } from "@/lib/baseModule/components/users/userSidebar/UserSidebarHeader";
import {
  chatUsernameValidator,
  phoneNumberValidator,
} from "@/lib/baseModule/components/users/validation";
import { DetailsCell } from "@/lib/shared/components/detailsSection/DetailsCell";
import { MultiFormButtonBar } from "@/lib/shared/components/form/MultiFormButtonBar";
import {
  SidebarForm,
  SidebarFormHandle,
} from "@/lib/shared/components/form/SidebarForm";
import { PhoneNumberField } from "@/lib/shared/components/formFields/PhoneNumberField";
import { SidebarActions } from "@/lib/shared/components/sidebar/SidebarActions";
import { SidebarContent } from "@/lib/shared/components/sidebar/SidebarContent";

interface UserEditFormInputs {
  email: string;
  phoneNumber: string;
  externalChatUsername: string;
}

export function UserProfileEditForm({
  selfUser,
  selfGroups,
  onCancel,
  onSuccess,
  sidebarFormRef,
}: {
  selfUser: ApiUser;
  selfGroups: ApiUserGroup[];
  onCancel: () => void;
  onSuccess: () => void;
  sidebarFormRef?: Ref<SidebarFormHandle>;
}) {
  const showChatUsername = useIsNewFeatureEnabled(ApiBaseFeature.ChatUsername);
  const updateSelfUser = useUpdateSelfUser();

  async function handleSubmit(values: UserEditFormInputs) {
    await updateSelfUser
      .mutateAsync(
        {
          externalChatUsername: mapOptionalValue(values.externalChatUsername),
          phoneNumber: mapOptionalValue(values.phoneNumber),
        },
        {
          onSuccess,
        },
      )
      .catch();
  }

  const initialValues: UserEditFormInputs = {
    externalChatUsername: selfUser.externalChatUsername ?? "",
    phoneNumber: selfUser.phoneNumber ?? "",
    email: selfUser.email ?? "",
  };

  const fieldName = createFieldNameMapper<UserEditFormInputs>();

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={handleSubmit}
      enableReinitialize
    >
      {({ isSubmitting }) => (
        <SidebarForm ref={sidebarFormRef}>
          <SidebarContent header={<UserSidebarHeader selfUser={selfUser} />}>
            <Stack gap={2}>
              <Divider />

              {isDefined(selfUser.email) && (
                <InputField
                  name={fieldName("email")}
                  label={"E-Mail-Adresse"}
                  readOnly
                />
              )}

              <PhoneNumberField
                label={"Telefonnummer"}
                name={fieldName("phoneNumber")}
                validate={phoneNumberValidator}
              />

              {showChatUsername && (
                <InputField
                  label={"Chat Benutzername"}
                  name={fieldName("externalChatUsername")}
                  validate={chatUsernameValidator}
                />
              )}

              {selfGroups.length > 0 && (
                <>
                  <Divider />
                  <DetailsCell
                    name={"groups"}
                    label={"Abteilung"}
                    value={<GroupList groups={selfGroups} />}
                    valueIsDiv
                  />
                </>
              )}
            </Stack>
          </SidebarContent>

          <SidebarActions>
            <MultiFormButtonBar
              submitting={isSubmitting}
              submitLabel={"Speichern"}
              onCancel={onCancel}
            />
          </SidebarActions>
        </SidebarForm>
      )}
    </Formik>
  );
}
