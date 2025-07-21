/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";
import { Dropdown, Input, Menu, MenuButton, MenuItem, Stack } from "@mui/joy";

import { useIsMobile } from "@eshg/lib-portal";

import { ChatColumnHeaderWrapper } from "@/lib/businessModules/chat/components/ChatColumnHeaderWrapper";
import { useChatClientContext } from "@/lib/businessModules/chat/shared/ChatClientProvider";
import {
  ChatPanelView,
  ClientState,
  MobileView,
} from "@/lib/businessModules/chat/shared/enums";

interface RoomsPanelHeaderProps {
  setChatPanelView: (viewType: ChatPanelView) => void;
  setMobileView: (viewType: MobileView) => void;
  searchQuery: string;
  setSearchQuery: (searchQuery: string) => void;
  roomSearchDisabled: boolean;
}
export function RoomsPanelHeader({
  setChatPanelView,
  setMobileView,
  setSearchQuery,
  searchQuery,
  roomSearchDisabled,
}: Readonly<RoomsPanelHeaderProps>) {
  function handleClose() {
    setSearchQuery("");
  }
  const { clientState } = useChatClientContext();
  const isMobile = useIsMobile();

  function handleStartNewDirectChat() {
    setChatPanelView(ChatPanelView.NewDirectChat);
    setMobileView(MobileView.ChatMessages);
  }

  function handleStartNewGropChat() {
    setChatPanelView(ChatPanelView.NewGroupChat);
    setMobileView(MobileView.ChatMessages);
  }

  return (
    <ChatColumnHeaderWrapper>
      <Stack direction="row" spacing={2}>
        <Input
          startDecorator={
            <SearchIcon
              size="sm"
              sx={{
                color: roomSearchDisabled ? "neutral.300" : "neutral.700",
              }}
            />
          }
          value={searchQuery}
          endDecorator={
            !!searchQuery?.length && (
              <CloseIcon size="sm" onClick={handleClose} />
            )
          }
          placeholder="Suche nach Konversation..."
          disabled={roomSearchDisabled}
          fullWidth
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <Dropdown>
          <MenuButton
            aria-label="Open new chat window"
            variant="solid"
            color="primary"
            disabled={clientState !== ClientState.Ready}
            sx={{ p: "0.5rem" }}
          >
            <AddIcon size="sm" />
          </MenuButton>
          <Menu
            placement={isMobile ? "bottom-end" : "bottom"}
            variant={isMobile ? "soft" : "plain"}
            size={isMobile ? "lg" : "md"}
            color={isMobile ? "primary" : "neutral"}
          >
            <MenuItem onClick={handleStartNewDirectChat}>
              Direktnachricht
            </MenuItem>
            <MenuItem onClick={handleStartNewGropChat}>
              Gruppe erstellen
            </MenuItem>
          </Menu>
        </Dropdown>
      </Stack>
    </ChatColumnHeaderWrapper>
  );
}
