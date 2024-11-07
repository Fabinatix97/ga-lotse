/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ButtonLink } from "@eshg/lib-portal/components/buttons/ButtonLink";
import { useSnackbar } from "@eshg/lib-portal/components/snackbar/SnackbarProvider";
import AdminPanelSettingsOutlinedIcon from "@mui/icons-material/AdminPanelSettingsOutlined";
import PersonAddAltIcon from "@mui/icons-material/PersonAddAlt";
import { Box, Stack, Typography } from "@mui/joy";
import { useState } from "react";
import { filter } from "remeda";

import { GroupChatMember } from "@/lib/businessModules/chat/components/GroupChatMember";
import { LeaveChatConfirmation } from "@/lib/businessModules/chat/components/LeaveChatConfirmation";
import { InfoPanelHeader } from "@/lib/businessModules/chat/components/infoPanel/InfoPanelHeader";
import {
  getDepartmentNameFromUserId,
  isDMRoom,
  isGroupRoom,
  leaveRoom,
} from "@/lib/businessModules/chat/shared//utils";
import { useInfoPanelContext } from "@/lib/businessModules/chat/shared/InfoPanelProvider";
import { InfoPanelView } from "@/lib/businessModules/chat/shared/enums";
import { logger } from "@/lib/businessModules/chat/shared/helpers";
import { useChatSearchParams } from "@/lib/businessModules/chat/shared/hooks/useChatSearchParams";
import { useRoomInfo } from "@/lib/businessModules/chat/shared/hooks/useRoomInfo";
import { ConfirmationDialog } from "@/lib/shared/components/confirmationDialog/ConfirmationDialog";

export interface RoomInfoViewProps {
  roomId: string;
  onClose: () => void;
}

export function RoomInfoView({ roomId, onClose }: Readonly<RoomInfoViewProps>) {
  const roomInfo = useRoomInfo(roomId);
  const { clearChatParams } = useChatSearchParams();
  const { closeInfoPanel, setInfoPanelView } = useInfoPanelContext();
  const [leaveDialogOpen, setLeaveDialogOpen] = useState(false);
  const [kickUserId, setKickUserId] = useState<string>();
  const snackbar = useSnackbar();

  const {
    room,
    communicationType,
    allRoomMembers,
    dmRoomMember,
    checkIfAdmin,
    matrixClient,
  } = roomInfo;

  const joinedMembers = [
    ...filter(allRoomMembers, (x) => x.isRoomCreator),
    ...filter(
      allRoomMembers,
      (x) => !x.isRoomCreator && x.member.membership === "join",
    ),
  ];
  const invitedMembers = [
    ...filter(allRoomMembers, (x) => x.member.membership === "invite"),
  ];
  const isAdmin = checkIfAdmin();

  function handleLeaveRoomClick() {
    setLeaveDialogOpen(false);
    clearChatParams();
    closeInfoPanel();
    void leaveRoom(matrixClient, room?.roomId);
  }
  async function handleRemoveUser() {
    if (!kickUserId) return;
    if (kickUserId === matrixClient.getUserId()) return;
    try {
      await matrixClient.kick(roomId, kickUserId);
      setKickUserId(undefined);
    } catch (error) {
      logger.error("Benutzer konnte nicht gelöscht werden", error);
      snackbar.error("Benutzer konnte nicht gelöscht werden");
    }
  }

  const userToRemove = kickUserId && matrixClient.getUser(kickUserId);

  return (
    <>
      <InfoPanelHeader close={onClose} {...roomInfo} />
      <Box
        sx={{
          overflowY: "auto",
        }}
      >
        {/* Direct message room content */}
        {isDMRoom(communicationType) && (
          <Stack
            sx={{
              padding: 3,
              borderBottom: "1px solid",
              borderColor: "neutral.outlinedBorder",
            }}
          >
            <Typography sx={{ textTransform: "capitalize" }}>
              {
                getDepartmentNameFromUserId(dmRoomMember?.member.userId)
                  ?.organisationName
              }
            </Typography>
          </Stack>
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
              {joinedMembers.map(({ member, isRoomCreator }) => {
                return (
                  <GroupChatMember
                    key={member.userId}
                    member={member}
                    isRoomCreator={isRoomCreator}
                    isAdmin={isAdmin}
                    handleKick={(userId: string) => setKickUserId(userId)}
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
                <Typography level="title-lg">
                  Offene Beitrittsanfragen
                </Typography>
                {invitedMembers.map(({ member, isRoomCreator }) => {
                  return (
                    <GroupChatMember
                      key={member.userId}
                      member={member}
                      isRoomCreator={isRoomCreator}
                      isAdmin={isAdmin}
                      handleKick={(userId: string) => setKickUserId(userId)}
                    />
                  );
                })}
              </Stack>
            )}
          </>
        )}
      </Box>
      {isAdmin && (
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
          {!isDMRoom(communicationType) && (
            <ButtonLink
              level="title-md"
              startDecorator={<PersonAddAltIcon />}
              onClick={() =>
                setInfoPanelView(InfoPanelView.AddChatMember, roomId)
              }
            >
              Mitglieder hinzufügen
            </ButtonLink>
          )}
          {!isDMRoom(communicationType) && (
            <ButtonLink
              level="title-md"
              startDecorator={<AdminPanelSettingsOutlinedIcon />}
              onClick={() =>
                setInfoPanelView(InfoPanelView.AssignAdminLevel, roomId)
              }
            >
              Admins bestimmen
            </ButtonLink>
          )}
        </Stack>
      )}
      <LeaveChatConfirmation
        open={leaveDialogOpen}
        onClose={() => setLeaveDialogOpen(false)}
        onConfirm={handleLeaveRoomClick}
      />
      <ConfirmationDialog
        open={!!kickUserId}
        onClose={() => setKickUserId(undefined)}
        onConfirm={handleRemoveUser}
        color="danger"
        title={
          userToRemove && userToRemove?.displayName
            ? `${userToRemove.displayName} aus Gruppe entfernen?`
            : "Benutzer aus der Gruppe entfernen?"
        }
        description="Andere Gruppenmitglieder werden darüber informiert, dass Marlon Peter aus der Gruppe entfernt wurde."
        key="kick-user-dialog"
        confirmLabel="Entfernen"
      />
    </>
  );
}
