/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { AlertProps } from "@eshg/lib-portal/components/Alert";
import { useSnackbar } from "@eshg/lib-portal/components/snackbar/SnackbarProvider";
import { Sheet } from "@mui/joy";
import { FormikErrors } from "formik";
import { logger } from "matrix-js-sdk/lib/logger";
import { HistoryVisibility } from "matrix-js-sdk/lib/matrix";
import { useMemo, useState } from "react";

import { ChatList } from "@/lib/businessModules/chat/components/ChatList";
import { ChatSettingsModal } from "@/lib/businessModules/chat/components/ChatSettingsModal";
import { DirectMessageModal } from "@/lib/businessModules/chat/components/DirectMessageModal";
import { GroupChatModal } from "@/lib/businessModules/chat/components/GroupChatModal";
import { InviteToChatModal } from "@/lib/businessModules/chat/components/InviteToChatModal";
import { useChatClientContext } from "@/lib/businessModules/chat/shared/ChatClientProvider";
import { CommunicationType } from "@/lib/businessModules/chat/shared/enums";
import { useChatRoomList } from "@/lib/businessModules/chat/shared/hooks/useChatRoomList";
import { useChatUtils } from "@/lib/businessModules/chat/shared/hooks/useChatUtils";
import { useCreateNewChat } from "@/lib/businessModules/chat/shared/hooks/useCreateNewChat";
import { ApiUser } from "@/lib/businessModules/chat/shared/types";
import { extractHomeserverNameFromUserMatrixID } from "@/lib/businessModules/chat/shared/utils";

export interface DirectChatFormValues {
  invite: string[];
}

export interface GroupChatFormValues {
  name: string;
  invite?: string[];
}

export interface InviteFormValues {
  invite: string[] | null;
}

export interface SettingsFormValues {
  historyVisibility?: HistoryVisibility;
}

export function ChatsPane() {
  const [usersModalOpen, setUsersModalOpen] = useState(false);
  const [groupChatModalOpen, setGroupModalOpen] = useState(false);
  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const [settingsModalOpen, setSettingsModalOpen] = useState(false);
  const [clickedRoomId, setClickedRoomId] = useState<string>();
  const [userList, setUserList] = useState<ApiUser[] | undefined>();
  const [alert, setAlert] = useState<AlertProps>();
  const snackbar = useSnackbar();
  const { matrixClient } = useChatClientContext();

  const { createNewChatRoom, createNewDirectMessage } = useCreateNewChat();
  const { getImageUrl, invite, handleChangeHistoryVisibility } = useChatUtils();
  const { roomList } = useChatRoomList();
  const loggedInUserId = matrixClient.getUserId();

  async function getUsers() {
    try {
      const data = await matrixClient.searchUserDirectory({
        term: extractHomeserverNameFromUserMatrixID(loggedInUserId),
      });
      if (data.results.length) {
        const users = data.results.filter(
          (user) =>
            !!user && user.user_id !== loggedInUserId && !!user.display_name,
        );
        setUserList(users);
        setAlert(undefined);
      }
    } catch (error) {
      setAlert({
        title: "Es hat nicht funktioniert, die Benutzer abzurufen.",
        color: "danger",
      });
      logger.warn("Search user directory failed", error);
    }
  }

  async function handleAddDirectMessage() {
    setUsersModalOpen(true);
    await getUsers();
  }

  async function handleAddGroupChat() {
    setGroupModalOpen(true);
    await getUsers();
  }

  async function inviteToRoom(roomId: string) {
    setInviteModalOpen(true);
    setClickedRoomId(roomId);
    await getUsers();
  }

  function handleRoomSettings(roomId: string) {
    setSettingsModalOpen(true);
    setClickedRoomId(roomId);
  }

  const initialSettingFormValues = useMemo<SettingsFormValues>(() => {
    const room = roomList.find((room) => room.room.roomId === clickedRoomId);
    return { historyVisibility: room?.room.getHistoryVisibility() };
  }, [clickedRoomId, roomList]);

  async function handleStartDirectMessage(values: DirectChatFormValues) {
    try {
      await createNewDirectMessage({
        invite: values.invite,
      });
    } catch {
      snackbar.error("Chat konnte nicht erstellt werden");
    }
    setUsersModalOpen(false);
  }

  async function handleStartGroupChat(values: GroupChatFormValues) {
    try {
      await createNewChatRoom(values);
    } catch {
      snackbar.error("Chat konnte nicht erstellt werden");
    }
    setGroupModalOpen(false);
  }

  async function handleInvite(formValues: InviteFormValues) {
    try {
      if (!formValues.invite) return;
      if (!clickedRoomId) return;
      await Promise.all(
        formValues.invite.map((userId) => invite(clickedRoomId, userId)),
      );
      setClickedRoomId(undefined);
      setInviteModalOpen(false);
      snackbar.confirmation("Die Einladung wurde gesendet.");
    } catch {
      snackbar.error("Benutzer könnte nicht eingeladen werden");
    }
  }

  async function submitSettings(formValues: SettingsFormValues) {
    try {
      if (!formValues.historyVisibility) return;
      if (!clickedRoomId) return;
      await handleChangeHistoryVisibility(
        clickedRoomId,
        formValues.historyVisibility,
      );
      setClickedRoomId(undefined);
      setSettingsModalOpen(false);
      snackbar.confirmation("Die Einstellungen wurden gespeichert.");
    } catch {
      snackbar.error(
        "Das Speichern der Einstellungen ist leider fehlgeschlagen.",
      );
    }
  }

  function validateDMForm(
    values: DirectChatFormValues,
  ): FormikErrors<DirectChatFormValues> {
    const errors: FormikErrors<DirectChatFormValues> = {};
    if (values.invite?.length > 0) {
      return errors;
    }
    errors.invite = "Bitte wählen Sie mindestens einen Benutzer aus.";
    return errors;
  }

  function validateGroupChatForm(
    values: GroupChatFormValues,
  ): FormikErrors<GroupChatFormValues> {
    const errors: FormikErrors<GroupChatFormValues> = {};
    if (values.name) {
      return errors;
    }
    errors.name = "Bitte fügen Sie den Chatnamen hinzu";
    return errors;
  }

  function validateInviteForm(
    values: InviteFormValues,
  ): FormikErrors<InviteFormValues> {
    const errors: FormikErrors<InviteFormValues> = {};
    if (values.invite?.length) {
      return errors;
    }
    errors.invite = "Wählen Sie einen Benutzer aus.";
    return errors;
  }

  function validateSettingsForm(
    values: SettingsFormValues,
  ): FormikErrors<SettingsFormValues> {
    const errors: FormikErrors<SettingsFormValues> = {};
    if (values.historyVisibility) {
      return errors;
    }
    errors.historyVisibility = "Wählen Sie einen Benutzer aus.";
    return errors;
  }

  const usersToInvite = useMemo(() => {
    const roomToInviteTo = roomList.find(
      (roomWithCommunicationType) =>
        roomWithCommunicationType.room.roomId === clickedRoomId,
    );
    const usersInRoom = roomToInviteTo?.room
      .getMembers()
      .filter((member) => member.membership === "join");
    const joinedUsers = usersInRoom?.map((joinedUser) => joinedUser.userId);
    if (!joinedUsers?.length) {
      return userList;
    }
    return userList?.filter(
      (apiUser) => !joinedUsers.includes(apiUser.user_id),
    );
  }, [clickedRoomId, roomList, userList]);

  return (
    <>
      <Sheet
        sx={{
          overflow: { sm: "hidden visible" },
          flex: 1,
          padding: 0,
          borderRadius: 0,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <ChatList
          handleAddChat={handleAddDirectMessage}
          buttonLabel="Private Nachricht"
          roomList={roomList.filter(
            (room) =>
              room.communicationType === CommunicationType.DirectMessage,
          )}
        />
        <ChatList
          handleAddChat={handleAddGroupChat}
          buttonLabel="Gruppenchat"
          roomList={roomList.filter(
            (room) => room.communicationType === CommunicationType.PublicRoom,
          )}
          handleInvite={inviteToRoom}
          handleSettings={handleRoomSettings}
        />
      </Sheet>
      <DirectMessageModal
        open={usersModalOpen}
        onClose={() => setUsersModalOpen(false)}
        userList={userList}
        onSubmit={handleStartDirectMessage}
        validateForm={validateDMForm}
        alertProps={alert}
        getImageUrl={getImageUrl}
      />
      <GroupChatModal
        open={groupChatModalOpen}
        onClose={() => setGroupModalOpen(false)}
        onSubmit={handleStartGroupChat}
        validateForm={validateGroupChatForm}
        getImageUrl={getImageUrl}
        userList={userList}
        alertProps={alert}
      />
      <InviteToChatModal
        open={inviteModalOpen}
        onClose={() => setInviteModalOpen(false)}
        userList={usersToInvite}
        onSubmit={handleInvite}
        validateForm={validateInviteForm}
        getImageUrl={getImageUrl}
        alertProps={alert}
      />
      <ChatSettingsModal
        open={settingsModalOpen}
        onClose={() => setSettingsModalOpen(false)}
        onSubmit={submitSettings}
        validateForm={validateSettingsForm}
        initialFormValues={initialSettingFormValues}
      />
    </>
  );
}
