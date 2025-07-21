/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import AdminPanelSettingsOutlinedIcon from "@mui/icons-material/AdminPanelSettingsOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import PersonAddAltIcon from "@mui/icons-material/PersonAddAlt";
import { Box, Stack, Typography } from "@mui/joy";
import { useMemo, useState } from "react";
import { find } from "remeda";

import { ConfirmationDialog } from "@eshg/lib-employee-portal";
import { ButtonLink, useSnackbar } from "@eshg/lib-portal";

import { GroupChatMember } from "@/lib/businessModules/chat/components/GroupChatMember";
import { LeaveChatConfirmation } from "@/lib/businessModules/chat/components/LeaveChatConfirmation";
import { MemberInfo } from "@/lib/businessModules/chat/components/MemberInfo";
import {
  isDMRoom,
  isGroupRoom,
  leaveRoom,
} from "@/lib/businessModules/chat/shared//utils";
import { useChatClientContext } from "@/lib/businessModules/chat/shared/ChatClientProvider";
import { useInfoPanelContext } from "@/lib/businessModules/chat/shared/InfoPanelProvider";
import {
  InfoPanelView,
  MobileView,
} from "@/lib/businessModules/chat/shared/enums";
import { logger } from "@/lib/businessModules/chat/shared/helpers";
import { useChatSearchParams } from "@/lib/businessModules/chat/shared/hooks/useChatSearchParams";
import { useRoomInfo } from "@/lib/businessModules/chat/shared/hooks/useRoomInfo";
import { useRoomMembers } from "@/lib/businessModules/chat/shared/hooks/useRoomMembers";

interface MobileInfoViewProps {
  roomId: string;
  setMobileView: (mobileView: MobileView) => void;
}

export function MobileInfoView({
  roomId,
  setMobileView,
}: Readonly<MobileInfoViewProps>) {
  const { matrixClient, departmentInfo } = useChatClientContext();
  const { clearChatParams } = useChatSearchParams();
  const { closeInfoPanel, setInfoPanelView } = useInfoPanelContext();
  const [leaveDialogOpen, setLeaveDialogOpen] = useState(false);
  const [kickUserId, setKickUserId] = useState<string>();
  const snackbar = useSnackbar();

  const { communicationType, getDMRoomMember, checkIfAdmin } =
    useRoomInfo(roomId);
  const { invitedMembers, joinedMembers, allRoomMembers } =
    useRoomMembers(roomId);

  const isAdmin = useMemo(() => checkIfAdmin(), [checkIfAdmin]);

  function handleLeaveRoomClick() {
    setLeaveDialogOpen(false);
    clearChatParams();
    closeInfoPanel();
    setMobileView(MobileView.RoomList);
    void leaveRoom(matrixClient, roomId);
  }
  async function handleRemoveUser() {
    if (!kickUserId) return;
    if (kickUserId === matrixClient.getUserId()) return;
    try {
      await matrixClient.kick(roomId, kickUserId);
      setKickUserId(undefined);
    } catch (error) {
      logger.error("Removing the user failed", error);
      snackbar.error("Benutzer konnte nicht gelöscht werden");
    }
  }

  const userToRemove = find(
    allRoomMembers,
    ({ member }) => member.userId === kickUserId,
  )?.member;

  return (
    <>
      <Box
        data-testid="chat-room-info-panel"
        sx={{
          overflowY: "auto",
        }}
      >
        {/* Direct message room content */}
        {isDMRoom(communicationType) && (
          <MemberInfo
            userId={getDMRoomMember()?.userId ?? ""}
            departmentName={departmentInfo?.name}
          />
        )}

        {/* Group room content */}
        {isGroupRoom(communicationType) && (
          <>
            <Stack
              spacing={2}
              sx={{
                padding: 3,
                overflowY: "auto",
              }}
            >
              <Typography level="title-lg">
                {joinedMembers.length} Mitglieder
              </Typography>
              {joinedMembers.map(({ member, isRoomCreator, isAdmin }) => {
                return (
                  <GroupChatMember
                    key={member.userId}
                    member={member}
                    isRoomCreator={isRoomCreator}
                    isAdmin={isAdmin}
                    handleKick={() => setKickUserId(member.userId)}
                  />
                );
              })}
            </Stack>
            {!!invitedMembers?.length && (
              <Stack
                spacing={2}
                sx={{
                  padding: 3,
                  overflowY: "auto",
                }}
              >
                <Typography level="title-lg">Ausstehende Mitglieder</Typography>
                {invitedMembers.map(({ member, isRoomCreator, isAdmin }) => {
                  return (
                    <GroupChatMember
                      key={member.userId}
                      member={member}
                      isRoomCreator={isRoomCreator}
                      isAdmin={isAdmin}
                      handleKick={() => setKickUserId(member.userId)}
                    />
                  );
                })}
              </Stack>
            )}
          </>
        )}
      </Box>
      <Stack
        spacing={1}
        sx={{
          padding: 3,
          alignItems: "flex-start",
          borderTop: isDMRoom(communicationType) ? undefined : "1px solid",
          borderColor: "neutral.outlinedBorder",
          width: "100%",
          gap: 2,
        }}
      >
        {isAdmin && isGroupRoom(communicationType) && (
          <>
            <ButtonLink
              level="title-md"
              startDecorator={<PersonAddAltIcon />}
              onClick={() =>
                setInfoPanelView(InfoPanelView.AddChatMember, roomId)
              }
            >
              Mitglieder hinzufügen
            </ButtonLink>
            <ButtonLink
              level="title-md"
              startDecorator={<AdminPanelSettingsOutlinedIcon />}
              onClick={() =>
                setInfoPanelView(InfoPanelView.AssignAdminLevel, roomId)
              }
            >
              Admins bestimmen
            </ButtonLink>
            <ButtonLink
              level="title-md"
              startDecorator={<EditOutlinedIcon />}
              onClick={() =>
                setInfoPanelView(InfoPanelView.RenameGroupChat, roomId)
              }
            >
              Gruppe umbenennen
            </ButtonLink>
          </>
        )}
        {isGroupRoom(communicationType) && (
          <ButtonLink
            level="title-md"
            startDecorator={<LogoutOutlinedIcon />}
            onClick={() => setLeaveDialogOpen(true)}
          >
            Gruppe verlassen
          </ButtonLink>
        )}
      </Stack>
      <LeaveChatConfirmation
        open={leaveDialogOpen}
        onClose={() => setLeaveDialogOpen(false)}
        onConfirm={handleLeaveRoomClick}
      />
      <ConfirmationDialog
        key="kick-user-dialog"
        open={!!kickUserId}
        color="danger"
        title={
          userToRemove?.name
            ? `${userToRemove.name} aus Gruppe entfernen?`
            : "Benutzer aus der Gruppe entfernen?"
        }
        description={
          userToRemove?.name
            ? `Andere Gruppenmitglieder werden darüber informiert, dass ${userToRemove.name} aus der Gruppe entfernt wurde.`
            : `Andere Gruppenmitglieder werden darüber informiert, dass Benutzer aus der Gruppe entfernt wurde.`
        }
        confirmLabel="Entfernen"
        onClose={() => setKickUserId(undefined)}
        onConfirm={handleRemoveUser}
      />
    </>
  );
}
