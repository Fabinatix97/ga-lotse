/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ButtonLink } from "@eshg/lib-portal/components/buttons/ButtonLink";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import { Stack } from "@mui/joy";
import { useState } from "react";

import { LeaveChatConfirmation } from "@/lib/businessModules/chat/components/LeaveChatConfirmation";
import { InfoPanelHeader } from "@/lib/businessModules/chat/components/infoPanel/InfoPanelHeader";
import {
  clearSearchParams,
  leaveRoom,
} from "@/lib/businessModules/chat/shared//utils";
import { useChatClientContext } from "@/lib/businessModules/chat/shared/ChatClientProvider";
import { useInfoPanelContext } from "@/lib/businessModules/chat/shared/InfoPanelProvider";
import { chatSearchParamNames } from "@/lib/businessModules/chat/shared/constants";
import { InfoPanelView } from "@/lib/businessModules/chat/shared/enums";

export interface AdminSettingsProps {
  roomId: string;
  onClose: () => void;
}

export function AdminSettings({
  roomId,
  onClose,
}: Readonly<AdminSettingsProps>) {
  const { matrixClient } = useChatClientContext();
  const { closeInfoPanel, setInfoPanelView } = useInfoPanelContext();
  const [leaveModalOpen, setLeaveModalOpen] = useState(false);

  function handleLeaveRoomClick() {
    setLeaveModalOpen(false);
    clearSearchParams(chatSearchParamNames.userId, chatSearchParamNames.roomId);
    closeInfoPanel();
    void leaveRoom(matrixClient, roomId);
  }

  return (
    <>
      <InfoPanelHeader close={onClose} roomId={roomId} />
      <Stack gap={2} sx={{ overflowY: "auto", padding: 2, marginTop: 2 }}>
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
