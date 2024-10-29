/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ButtonLink } from "@eshg/lib-portal/components/buttons/ButtonLink";
import CameraAltOutlinedIcon from "@mui/icons-material/CameraAltOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import { Stack } from "@mui/joy";
import { useState } from "react";

import { LeaveChatConfirmation } from "@/lib/businessModules/chat/components/LeaveChatConfirmation";
import { InfoPanelHeader } from "@/lib/businessModules/chat/components/infoPanel/InfoPanelHeader";
import { leaveRoom } from "@/lib/businessModules/chat/shared//utils";
import { useInfoPanelContext } from "@/lib/businessModules/chat/shared/InfoPanelProvider";
import { InfoPanelView } from "@/lib/businessModules/chat/shared/enums";
import { useChatSearchParams } from "@/lib/businessModules/chat/shared/hooks/useChatSearchParams";
import { useRoomInfo } from "@/lib/businessModules/chat/shared/hooks/useRoomInfo";

export interface AdminSettingsProps {
  roomId: string;
  onClose: () => void;
}

export function AdminSettings({
  roomId,
  onClose,
}: Readonly<AdminSettingsProps>) {
  const roomInfo = useRoomInfo(roomId);
  const { closeInfoPanel, setInfoPanelView } = useInfoPanelContext();
  const [leaveModalOpen, setLeaveModalOpen] = useState(false);
  const { clearChatParams } = useChatSearchParams();

  function handleLeaveRoomClick() {
    setLeaveModalOpen(false);
    clearChatParams();
    closeInfoPanel();
    void leaveRoom(roomInfo.matrixClient, roomId);
  }

  return (
    <>
      <InfoPanelHeader data={roomInfo} close={onClose} />
      <Stack gap={2} sx={{ overflowY: "auto", padding: 2, marginTop: 2 }}>
        <ButtonLink
          level="title-md"
          startDecorator={<CameraAltOutlinedIcon />}
          onClick={() => setInfoPanelView(InfoPanelView.RoomAvatar, roomId)}
        >
          Profilbild ändern
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
        <ButtonLink
          level="title-md"
          startDecorator={<LogoutOutlinedIcon />}
          onClick={() => setLeaveModalOpen(true)}
        >
          Gruppe verlassen
        </ButtonLink>
      </Stack>
      <LeaveChatConfirmation
        open={leaveModalOpen}
        onClose={() => setLeaveModalOpen(false)}
        onConfirm={handleLeaveRoomClick}
      />
    </>
  );
}
