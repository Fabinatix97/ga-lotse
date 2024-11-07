/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { FormPlus } from "@eshg/lib-portal/components/form/FormPlus";
import { useSnackbar } from "@eshg/lib-portal/components/snackbar/SnackbarProvider";
import { Box, Button, Stack, Typography } from "@mui/joy";
import { Formik, FormikErrors } from "formik";
import { useCallback, useEffect, useState } from "react";
import {
  filter,
  isEmpty,
  isNonNullish,
  isStrictEqual,
  map,
  pipe,
} from "remeda";

import { UsersAutocomplete } from "@/lib/businessModules/chat/components/UsersAutocomplete";
import { InfoPanelHeader } from "@/lib/businessModules/chat/components/infoPanel/InfoPanelHeader";
import { logger } from "@/lib/businessModules/chat/shared/helpers";
import { useRoomInfo } from "@/lib/businessModules/chat/shared/hooks/useRoomInfo";
import { UserToInvite } from "@/lib/businessModules/chat/shared/types";
import {
  getChatUserDirectory,
  getDepartmentNameFromUserId,
} from "@/lib/businessModules/chat/shared/utils";

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
  const { matrixClient, getJoinedAndInvitedMembers } = roomInfo;
  const snackbar = useSnackbar();

  const [userList, setUserList] = useState<UserToInvite[]>([]);

  const getMembersToInvite = useCallback(async (): Promise<UserToInvite[]> => {
    const data = await getChatUserDirectory(matrixClient);
    const loggedInUserId = matrixClient.getUserId();

    if (data.results.length) {
      const roomMembers = getJoinedAndInvitedMembers();

      const usersToInvite = pipe(
        data.results,
        filter((user) => {
          const isLoggedInUser =
            isStrictEqual(user.user_id, loggedInUserId) &&
            isNonNullish(user.display_name);

          const isDuplicated = roomMembers?.some((i) =>
            isStrictEqual(i.member.userId, user.user_id),
          );

          return !isLoggedInUser && !isDuplicated;
        }),
        map((user) => ({
          ...user,
          department:
            getDepartmentNameFromUserId(loggedInUserId)?.organisationName,
        })),
      );

      return usersToInvite;
    }

    return [];
  }, [getJoinedAndInvitedMembers, matrixClient]);

  useEffect(() => {
    getMembersToInvite()
      .then((res) => {
        setUserList(res);
      })
      .catch((error) => {
        logger.error("Fetching users to invite to the chat failed", error);
      });
  }, [getMembersToInvite]);

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
      <InfoPanelHeader close={onClose} {...roomInfo} />
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
            <Stack direction="row" spacing={2} marginTop={1}>
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
