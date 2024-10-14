/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useEffect } from "react";

import { RoomInfoView } from "@/lib/businessModules/chat/components/infoPanel/RoomInfoView";
import { useInfoPanelContext } from "@/lib/businessModules/chat/shared/InfoPanelProvider";
import { InfoPanelView } from "@/lib/businessModules/chat/shared/enums";

import { MemberInfoView } from "./MemberInfoView";

export function InfoPanel() {
  const { closeInfoPanel, infoPanelState } = useInfoPanelContext();

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
    default:
      return null;
  }
}
