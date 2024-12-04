/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  ApiBaseFeature,
  ApiSalutation,
  ApiUser,
  ApiUserGroup,
} from "@eshg/employee-portal-api/base";
import { InputField } from "@eshg/lib-portal/components/formFields/InputField";
import { SelectField } from "@eshg/lib-portal/components/formFields/SelectField";
import {
  createFieldNameMapper,
  mapOptionalValue,
} from "@eshg/lib-portal/helpers/form";
import { Divider, Stack } from "@mui/joy";
import { Formik } from "formik";
import { isDefined } from "remeda";

import { useUpdateSelfUser } from "@/lib/baseModule/api/mutations/users";
import { useIsNewFeatureEnabled } from "@/lib/baseModule/api/queries/feature";
import { GroupList } from "@/lib/baseModule/components/users/GroupList";
import { UserSidebarHeader } from "@/lib/baseModule/components/users/userSidebar/UserSidebarHeader";
import { phoneNumberValidator } from "@/lib/baseModule/components/users/validation";
import { ChatUserId } from "@/lib/businessModules/chat/components/ChatUserId";
import { DetailsCell } from "@/lib/shared/components/detailsSection/DetailsCell";
import { MultiFormButtonBar } from "@/lib/shared/components/form/MultiFormButtonBar";
import { SidebarForm } from "@/lib/shared/components/form/SidebarForm";
import { PhoneNumberField } from "@/lib/shared/components/formFields/PhoneNumberField";
import {
  SALUTATION_OPTIONS,
  TITLE_OPTIONS,
} from "@/lib/shared/components/personSidebar/constants";
import { SidebarActions } from "@/lib/shared/components/sidebar/SidebarActions";
import { SidebarContent } from "@/lib/shared/components/sidebar/SidebarContent";
import {
  SidebarWithFormRefProps,
  useSidebarWithFormRef,
} from "@/lib/shared/hooks/useSidebarWithFormRef";

interface UserEditFormInputs {
  email: string;
  phoneNumber: string;
  externalChatUsername: string;
  salutation: ApiSalutation;
  title: string;
}

interface UserProfileEditSidebarProps extends SidebarWithFormRefProps {
  selfUser: ApiUser;
  selfGroups: ApiUserGroup[];
  selfSalutation: ApiSalutation | undefined;
  selfTitle: string | undefined;
}

export function useUserProfileEditSidebar() {
  return useSidebarWithFormRef({
    component: UserProfileEditSidebar,
  });
}

function UserProfileEditSidebar({
  selfUser,
  selfGroups,
  selfSalutation,
  selfTitle,
  formRef,
  onClose,
}: UserProfileEditSidebarProps) {
  const showChatUsername = useIsNewFeatureEnabled(ApiBaseFeature.ChatUsername);
  const updateSelfUser = useUpdateSelfUser();

  async function handleSubmit(values: UserEditFormInputs) {
    await updateSelfUser.mutateAsync(
      {
        externalChatUsername: mapOptionalValue(values.externalChatUsername),
        phoneNumber: mapOptionalValue(values.phoneNumber),
        salutation: mapOptionalValue(values.salutation),
        title: mapOptionalValue(values.title),
      },
      {
        onSuccess: () => onClose(true),
      },
    );
  }

  const initialValues: UserEditFormInputs = {
    externalChatUsername: selfUser.externalChatUsername ?? "",
    phoneNumber: selfUser.phoneNumber ?? "",
    email: selfUser.email ?? "",
    salutation: selfSalutation ?? ApiSalutation.NotSpecified,
    title: selfTitle ?? "",
  };

  const fieldName = createFieldNameMapper<UserEditFormInputs>();

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={handleSubmit}
      enableReinitialize
    >
      {({ isSubmitting }) => (
        <SidebarForm ref={formRef}>
          <SidebarContent header={<UserSidebarHeader selfUser={selfUser} />}>
            <Stack gap={2}>
              <Divider />

              <Stack gap="inherit" direction="row">
                <SelectField
                  name={fieldName("salutation")}
                  label="Anrede"
                  options={SALUTATION_OPTIONS}
                  sx={{ flex: 1 }}
                />

                <SelectField
                  name={fieldName("title")}
                  label="Titel"
                  options={TITLE_OPTIONS}
                  sx={{ flex: 1 }}
                />
              </Stack>

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

              {showChatUsername && selfUser.externalChatUsername && (
                <>
                  <Divider />
                  <DetailsCell
                    name={"externalChatUsername"}
                    label={"Chat-ID"}
                    valueIsDiv
                    value={
                      <ChatUserId
                        userId={selfUser.externalChatUsername}
                        noLabel
                      />
                    }
                  />
                </>
              )}
            </Stack>
          </SidebarContent>

          <SidebarActions>
            <MultiFormButtonBar
              submitting={isSubmitting}
              submitLabel={"Speichern"}
              onCancel={() => onClose(false)}
            />
          </SidebarActions>
        </SidebarForm>
      )}
    </Formik>
  );
}
