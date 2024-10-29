/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { FormPlus } from "@eshg/lib-portal/components/form/FormPlus";
import { useSnackbar } from "@eshg/lib-portal/components/snackbar/SnackbarProvider";
import { Box, Button, Stack, Typography } from "@mui/joy";
import { Formik, FormikErrors } from "formik";
import { useEffect, useState } from "react";
import { isEmpty } from "remeda";

import { UsersAutocomplete } from "@/lib/businessModules/chat/components/UsersAutocomplete";
import { InfoPanelHeader } from "@/lib/businessModules/chat/components/infoPanel/InfoPanelHeader";
import {
  getChatUserDirectory,
  getDepartmentNameFromUserId,
} from "@/lib/businessModules/chat/shared//utils";
import { useChatClientContext } from "@/lib/businessModules/chat/shared/ChatClientProvider";
import { logger } from "@/lib/businessModules/chat/shared/helpers";
import { useRoomInfo } from "@/lib/businessModules/chat/shared/hooks/useRoomInfo";
import { ApiUser } from "@/lib/businessModules/chat/shared/types";

export interface AddChatMemberProps {
  roomId: string;
  onClose: () => void;
  onCancel: () => void;
}

export function AddChatMember({
  roomId,
  onClose,
  onCancel,
}: Readonly<AddChatMemberProps>) {
  const roomInfo = useRoomInfo(roomId);
  const [userList, setUserList] = useState<
    (ApiUser & { department?: string })[]
  >([]);
  const { matrixClient } = useChatClientContext();
  const loggedInUserId = matrixClient.getUserId();
  const snackbar = useSnackbar();

  useEffect(() => {
    void (async () => {
      const data = await getChatUserDirectory(matrixClient);
      if (data.results.length) {
        const users = data.results.filter(
          (user) =>
            !!user && user.user_id !== loggedInUserId && !!user.display_name,
        );
        // Filter chat room members
        const room = matrixClient.getRoom(roomId);
        const roomMembers = room?.getMembers();
        const usersToInvite = users.filter(
          (apiUser) =>
            !roomMembers?.some(
              (roomMember) => roomMember.userId === apiUser.user_id,
            ),
        );
        const usersWithDepartment = await Promise.all(
          usersToInvite.map(async (user) => {
            const userInfo = await matrixClient.whoami();
            const department =
              getDepartmentNameFromUserId(userInfo.user_id)?.organisationName ??
              "";
            return {
              ...user,
              department,
            };
          }),
        );
        setUserList(usersWithDepartment);
      }
    })();
  }, [loggedInUserId, matrixClient, roomId]);

  async function handleAddRoomMember(values: { users?: string[] }) {
    if (!values?.users || isEmpty(values.users)) return;

    try {
      await Promise.all(
        values.users.map(
          async (user) => await matrixClient.invite(roomId, user),
        ),
      );
      onCancel();
    } catch (error) {
      logger.error(
        "Fehler beim Hinzufügen eines Mitglieds zum Chatroom",
        error,
      );
      snackbar.error("Benutzer konnte nicht eingeladen werden");
    }
  }

  function validateForm(values: {
    users?: string[];
  }): FormikErrors<{ users?: string[] }> {
    const errors: FormikErrors<{ users?: string[] }> = {};
    if (values.users?.length === 0) {
      errors.users = "Bitte wählen Sie mindestens einen Benutzer aus.";
    }

    return errors;
  }

  return (
    <>
      <InfoPanelHeader data={roomInfo} close={onClose} />
      <Box
        sx={{
          overflowY: "auto",
          padding: 2,
        }}
      >
        <Typography level="title-lg" sx={{ marginBottom: 2 }}>
          Mitglieder hinzufügen
        </Typography>
        <Formik
          initialValues={{ users: [] }}
          onSubmit={handleAddRoomMember}
          validate={validateForm}
        >
          <FormPlus>
            <UsersAutocomplete
              name="users"
              placeholder="Benutzer:in suchen"
              usersList={userList}
              multiple={true}
            />
            <Stack direction="row" spacing={2} marginTop={2}>
              <Button type="button" fullWidth variant="soft" onClick={onCancel}>
                Abbrechen
              </Button>
              <Button type="submit" fullWidth>
                Speichern
              </Button>
            </Stack>
          </FormPlus>
        </Formik>
      </Box>
    </>
  );
}
