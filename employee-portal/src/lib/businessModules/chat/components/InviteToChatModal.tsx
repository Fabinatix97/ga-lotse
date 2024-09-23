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

import { InviteFormValues } from "@/lib/businessModules/chat/components/ChatsPane";
import { UsersAutocomplete } from "@/lib/businessModules/chat/components/UsersAutocomplete";
import {
  ApiUser,
  ChatBaseModal,
} from "@/lib/businessModules/chat/shared/types";
import { BaseModal } from "@/lib/shared/components/BaseModal";

interface InviteToChatModalProps extends ChatBaseModal<InviteFormValues> {
  userList: ApiUser[] | undefined;
  getImageUrl: (url?: string) => string | null;
}

export function InviteToChatModal({
  open,
  onClose,
  onSubmit,
  userList,
  validateForm,
  alertProps,
  getImageUrl,
}: Readonly<InviteToChatModalProps>) {
  return (
    <BaseModal open={open} onClose={onClose} modalTitle="Zum Chat einladen">
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
          <Formik<InviteFormValues>
            initialValues={{ invite: [] }}
            onSubmit={onSubmit}
            validate={validateForm}
          >
            {({ isSubmitting, errors }) => (
              <FormPlus>
                <Box
                  sx={{
                    display: "flex",
                    minHeight: "18rem",
                    flexDirection: "column",
                    justifyContent: "space-between",
                  }}
                >
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
                  >
                    Invite
                  </SubmitButton>
                </Box>
              </FormPlus>
            )}
          </Formik>
        )}
      </Sheet>
    </BaseModal>
  );
}
