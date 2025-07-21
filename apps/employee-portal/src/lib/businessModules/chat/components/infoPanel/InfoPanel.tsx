/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useEffect } from "react";

import { useIsMobile } from "@eshg/lib-portal";

import { AddChatMember } from "@/lib/businessModules/chat/components/infoPanel/AddChatMember";
import { AdminSettings } from "@/lib/businessModules/chat/components/infoPanel/AdminSettings";
import { AssignAdminView } from "@/lib/businessModules/chat/components/infoPanel/AssignAdminView";
import { InfoPanelHeader } from "@/lib/businessModules/chat/components/infoPanel/InfoPanelHeader";
import { MemberInfoView } from "@/lib/businessModules/chat/components/infoPanel/MemberInfoView";
import { MobileInfoView } from "@/lib/businessModules/chat/components/infoPanel/MobileInfoPanelView";
import { RenameChat } from "@/lib/businessModules/chat/components/infoPanel/RenameChat";
import { RoomInfoView } from "@/lib/businessModules/chat/components/infoPanel/RoomInfoView";
import { useInfoPanelContext } from "@/lib/businessModules/chat/shared/InfoPanelProvider";
import {
  InfoPanelView,
  MobileView,
} from "@/lib/businessModules/chat/shared/enums";

interface InfoPanelProps {
  setMobileView: (viewType: MobileView) => void;
}

export function InfoPanel({ setMobileView }: Readonly<InfoPanelProps>) {
  const { closeInfoPanel, infoPanelState, setInfoPanelView } =
    useInfoPanelContext();
  const isMobile = useIsMobile();

  useEffect(() => {
    if (!infoPanelState.payload) {
      setMobileView(MobileView.ChatMessages);
      closeInfoPanel();
    }
  }, [closeInfoPanel, infoPanelState.payload, setMobileView]);

  function onClose() {
    closeInfoPanel();
    setMobileView(MobileView.ChatMessages);
  }

  function infoPanelHeader() {
    switch (infoPanelState.view) {
      case InfoPanelView.RoomInfo:
      case InfoPanelView.AdminSettings:
      case InfoPanelView.MobileView:
        return (
          <InfoPanelHeader
            close={onClose}
            roomId={infoPanelState.payload}
            onBackIconClick={() => setMobileView(MobileView.ChatMessages)}
          />
        );
      case InfoPanelView.RenameGroupChat:
      case InfoPanelView.AssignAdminLevel:
      case InfoPanelView.AddChatMember:
        return (
          <InfoPanelHeader
            close={onClose}
            roomId={infoPanelState.payload}
            onBackIconClick={() =>
              setInfoPanelView(InfoPanelView.MobileView, infoPanelState.payload)
            }
          />
        );
      case InfoPanelView.UserInfo:
        return null;
      default:
        return null;
    }
  }

  function infoPanelContent() {
    if (!infoPanelState.payload) {
      return null;
    }
    switch (infoPanelState.view) {
      case InfoPanelView.RoomInfo:
        return <RoomInfoView roomId={infoPanelState.payload} />;
      case InfoPanelView.UserInfo:
        return (
          <MemberInfoView
            userId={infoPanelState.payload}
            onBackIconClick={() => setMobileView(MobileView.ChatMessages)}
            onClose={onClose}
          />
        );
      case InfoPanelView.AddChatMember:
        return (
          <AddChatMember
            roomId={infoPanelState.payload}
            onCancel={() =>
              setInfoPanelView(
                isMobile ? InfoPanelView.MobileView : InfoPanelView.RoomInfo,
                infoPanelState.payload,
              )
            }
          />
        );
      case InfoPanelView.AdminSettings:
        return <AdminSettings roomId={infoPanelState.payload} />;
      case InfoPanelView.AssignAdminLevel:
        return (
          <AssignAdminView
            roomId={infoPanelState.payload}
            onCancel={() =>
              setInfoPanelView(
                isMobile ? InfoPanelView.MobileView : InfoPanelView.RoomInfo,
                infoPanelState.payload,
              )
            }
          />
        );
      case InfoPanelView.RenameGroupChat:
        return (
          <RenameChat
            roomId={infoPanelState.payload}
            onCancel={() =>
              setInfoPanelView(
                isMobile
                  ? InfoPanelView.MobileView
                  : InfoPanelView.AdminSettings,
                infoPanelState.payload,
              )
            }
          />
        );
      case InfoPanelView.MobileView:
        return (
          <MobileInfoView
            roomId={infoPanelState.payload}
            setMobileView={setMobileView}
          />
        );
      default:
        return null;
    }
  }

  return (
    <>
      {infoPanelHeader()}
      {infoPanelContent()}
    </>
  );
}
