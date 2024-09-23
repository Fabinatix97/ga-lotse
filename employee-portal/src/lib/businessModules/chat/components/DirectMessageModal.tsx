/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Alert } from "@eshg/lib-portal/components/Alert";
import { SubmitButton } from "@eshg/lib-portal/components/buttons/SubmitButton";
import { FormPlus } from "@eshg/lib-portal/components/form/FormPlus";
import { Box, Sheet } from "@mui/joy";
import { Formik } from "formik";
import { isEmpty } from "remeda";

import { DirectChatFormValues } from "@/lib/businessModules/chat/components/ChatsPane";
import { UsersAutocomplete } from "@/lib/businessModules/chat/components/UsersAutocomplete";
import {
  ApiUser,
  ChatBaseModal,
} from "@/lib/businessModules/chat/shared/types";
import { BaseModal } from "@/lib/shared/components/BaseModal";

interface DirectMessageModalProps extends ChatBaseModal<DirectChatFormValues> {
  userList: ApiUser[] | undefined;
  getImageUrl: (url?: string) => string | null;
}

export function DirectMessageModal({
  open,
  onClose,
  userList,
  validateForm,
  onSubmit,
  getImageUrl,
  alertProps,
}: Readonly<DirectMessageModalProps>) {
  return (
    <BaseModal
      open={open}
      onClose={onClose}
      modalTitle="Neue Direktnachricht erstellen"
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
          <Formik<DirectChatFormValues>
            initialValues={{ invite: [] }}
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
                  <UsersAutocomplete
                    name="invite"
                    label="Benutzer einladen"
                    usersList={userList}
                    multiple={true}
                    getImageUrl={getImageUrl}
                  />
                  <Box
                    sx={{
                      minHeight: "6.5rem",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "flex-end",
                    }}
                  >
                    <SubmitButton
                      submitting={isSubmitting}
                      disabled={!isEmpty(errors)}
                      sx={{ mt: 1 }}
                    >
                      Neue Nachricht
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
