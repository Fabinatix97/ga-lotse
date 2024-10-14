/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ButtonLink } from "@eshg/lib-portal/components/buttons/ButtonLink";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
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
import { useChatSearchParams } from "@/lib/businessModules/chat/shared/hooks/useChatSearchParams";
import { useRoomInfo } from "@/lib/businessModules/chat/shared/hooks/useRoomInfo";

export interface RoomInfoViewProps {
  roomId: string;
  onClose: () => void;
}

export function RoomInfoView(props: RoomInfoViewProps) {
  const roomInfo = useRoomInfo(props.roomId);
  const { clearChatParams } = useChatSearchParams();
  const { closeInfoPanel } = useInfoPanelContext();
  const [isOpen, setIsOpen] = useState(false);

  if (!roomInfo) return null;

  const { room, communicationType, allRoomMembers, dmRoomMember, isAdmin } =
    roomInfo;

  const sortedMembers = [
    ...filter(allRoomMembers, (x) => x.isRoomCreator),
    ...filter(allRoomMembers, (x) => !x.isRoomCreator),
  ];

  function handleLeaveRoomClick() {
    setIsOpen(false);
    clearChatParams();
    closeInfoPanel();
    void leaveRoom(roomInfo.matrixClient, room?.roomId);
  }

  return (
    <>
      <InfoPanelHeader data={roomInfo} close={props.onClose} />
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
          <Stack
            spacing={2}
            sx={{
              padding: 3,
              overflowY: "auto",
            }}
          >
            {sortedMembers.map(({ member, isRoomCreator }) => {
              return (
                <GroupChatMember
                  key={member.userId}
                  member={member}
                  isRoomCreator={isRoomCreator}
                  isAdmin={isAdmin}
                />
              );
            })}
          </Stack>
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
        }}
      >
        <ButtonLink
          level="title-md"
          startDecorator={<LogoutOutlinedIcon />}
          onClick={() => setIsOpen(true)}
        >
          {isDMRoom(roomInfo.communicationType)
            ? "Verlassen"
            : "Gruppe verlassen"}
        </ButtonLink>
      </Stack>
      <LeaveChatConfirmation
        open={isOpen}
        onClose={() => setIsOpen(false)}
        onConfirm={handleLeaveRoomClick}
      />
    </>
  );
}
