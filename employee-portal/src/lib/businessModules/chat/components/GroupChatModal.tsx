/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Alert } from "@eshg/lib-portal/components/Alert";
import { SubmitButton } from "@eshg/lib-portal/components/buttons/SubmitButton";
import { FormPlus } from "@eshg/lib-portal/components/form/FormPlus";
import { InputField } from "@eshg/lib-portal/components/formFields/InputField";
import { Box, Sheet } from "@mui/joy";
import { Formik } from "formik";
import { isEmpty } from "remeda";

import { GroupChatFormValues } from "@/lib/businessModules/chat/components/ChatsPane";
import { UsersAutocomplete } from "@/lib/businessModules/chat/components/UsersAutocomplete";
import {
  ApiUser,
  ChatBaseModal,
} from "@/lib/businessModules/chat/shared/types";
import { BaseModal } from "@/lib/shared/components/BaseModal";

interface GroupChatModalProps extends ChatBaseModal<GroupChatFormValues> {
  userList: ApiUser[] | undefined;
  getImageUrl: (url?: string) => string | null;
}

export function GroupChatModal({
  open,
  onClose,
  onSubmit,
  userList,
  validateForm,
  alertProps,
  getImageUrl,
}: Readonly<GroupChatModalProps>) {
  return (
    <BaseModal
      open={open}
      onClose={onClose}
      modalTitle="Neuen Gruppenchat erstellen"
    >
      <Sheet
        variant="soft"
        sx={{
          minHeight: "20rem",
          backgroundColor: "transparent",
        }}
      >
        {!userList?.length ? (
          alertProps && <Alert {...alertProps} />
        ) : (
          <Formik<GroupChatFormValues>
            initialValues={{ invite: [], name: "" }}
            onSubmit={onSubmit}
            validate={validateForm}
          >
            {({ isSubmitting, errors }) => (
              <FormPlus>
                <Sheet
                  variant="soft"
                  sx={{
                    backgroundColor: "transparent",
                    display: "flex",
                    flexDirection: "column",
                    p: 0,
                  }}
                >
                  <Box
                    sx={{
                      minHeight: "6.5rem",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "flex-end",
                    }}
                  >
                    <InputField type="text" name="name" label="Chat name" />
                    <UsersAutocomplete
                      name="invite"
                      label="Benutzer einladen"
                      usersList={userList}
                      multiple={true}
                      getImageUrl={getImageUrl}
                    />
                    <SubmitButton
                      submitting={isSubmitting}
                      disabled={!isEmpty(errors)}
                      sx={{ mt: 1 }}
                    >
                      Füge einen neuen Gruppenchat hinzu
                    </SubmitButton>
                  </Box>
                </Sheet>
              </FormPlus>
            )}
          </Formik>
        )}
      </Sheet>
    </BaseModal>
  );
}
