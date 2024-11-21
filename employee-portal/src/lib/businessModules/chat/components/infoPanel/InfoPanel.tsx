/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useEffect } from "react";

import { AddChatMember } from "@/lib/businessModules/chat/components/infoPanel/AddChatMember";
import { AdminSettings } from "@/lib/businessModules/chat/components/infoPanel/AdminSettings";
import { AssignAdminView } from "@/lib/businessModules/chat/components/infoPanel/AssignAdminView";
import { MemberInfoView } from "@/lib/businessModules/chat/components/infoPanel/MemberInfoView";
import { RenameChat } from "@/lib/businessModules/chat/components/infoPanel/RenameChat";
import { RoomAvatar } from "@/lib/businessModules/chat/components/infoPanel/RoomAvatar";
import { RoomInfoView } from "@/lib/businessModules/chat/components/infoPanel/RoomInfoView";
import { useInfoPanelContext } from "@/lib/businessModules/chat/shared/InfoPanelProvider";
import { InfoPanelView } from "@/lib/businessModules/chat/shared/enums";

export function InfoPanel() {
  const { closeInfoPanel, infoPanelState, setInfoPanelView } =
    useInfoPanelContext();

  useEffect(() => {
    if (!infoPanelState.payload) {
      closeInfoPanel();
    }
  }, [closeInfoPanel, infoPanelState.payload]);

  if (!infoPanelState.payload) {
    return null;
  }

  switch (infoPanelState.view) {
    case InfoPanelView.RoomInfo:
      return (
        <RoomInfoView
          roomId={infoPanelState.payload}
          onClose={closeInfoPanel}
        />
      );
    case InfoPanelView.UserInfo:
      return (
        <MemberInfoView
          userId={infoPanelState.payload}
          onClose={closeInfoPanel}
        />
      );
    case InfoPanelView.AddChatMember:
      return (
        <AddChatMember
          roomId={infoPanelState.payload}
          onClose={closeInfoPanel}
          onCancel={() =>
            setInfoPanelView(InfoPanelView.RoomInfo, infoPanelState.payload)
          }
        />
      );
    case InfoPanelView.AdminSettings:
      return (
        <AdminSettings
          roomId={infoPanelState.payload}
          onClose={closeInfoPanel}
        />
      );
    case InfoPanelView.AssignAdminLevel:
      return (
        <AssignAdminView
          roomId={infoPanelState.payload}
          onClose={closeInfoPanel}
          onCancel={() =>
            setInfoPanelView(InfoPanelView.RoomInfo, infoPanelState.payload)
          }
        />
      );
    case InfoPanelView.RenameGroupChat:
      return (
        <RenameChat
          roomId={infoPanelState.payload}
          onClose={closeInfoPanel}
          onCancel={() =>
            setInfoPanelView(
              InfoPanelView.AdminSettings,
              infoPanelState.payload,
            )
          }
        />
      );
    case InfoPanelView.RoomAvatar:
      return (
        <RoomAvatar
          roomId={infoPanelState.payload}
          onClose={closeInfoPanel}
          onCancel={() =>
            setInfoPanelView(
              InfoPanelView.AdminSettings,
              infoPanelState.payload,
            )
          }
        />
      );
    default:
      return null;
  }
}
