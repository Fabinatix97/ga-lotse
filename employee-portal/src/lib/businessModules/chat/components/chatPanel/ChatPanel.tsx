/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ChatPanelHeader } from "./ChatPanelHeader";

export interface ChatPanelProps {
  roomId: string;
  isOpenChatSettings: boolean;
  toggleChatSettingsView(): void;
}

export function ChatPanel(props: ChatPanelProps) {
  return (
    <>
      <ChatPanelHeader {...props} />
    </>
  );
}
