/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";
import {
  Box,
  Dropdown,
  Input,
  Menu,
  MenuButton,
  MenuItem,
  Stack,
} from "@mui/joy";
import { useEffect, useRef } from "react";

import { useIsMobile } from "@eshg/lib-portal";

import { ChatColumnHeaderWrapper } from "@/lib/businessModules/chat/components/ChatColumnHeaderWrapper";
import { useChatClientContext } from "@/lib/businessModules/chat/shared/ChatClientProvider";
import {
  ChatPanelView,
  ClientState,
  MobileView,
} from "@/lib/businessModules/chat/shared/enums";

interface RoomsPanelHeaderProps {
  chatPanelView: ChatPanelView;
  mobileView: MobileView;
  setChatPanelView: (viewType: ChatPanelView) => void;
  setMobileView: (viewType: MobileView) => void;
  searchQuery: string;
  setSearchQuery: (searchQuery: string) => void;
}

export function RoomsPanelHeader({
  chatPanelView,
  mobileView,
  setChatPanelView,
  setMobileView,
  setSearchQuery,
  searchQuery,
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

  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    if (
      ref.current &&
      (chatPanelView === ChatPanelView.NoChatSelected ||
        mobileView === MobileView.RoomList)
    ) {
      ref.current.focus();
    }
  }, [chatPanelView, mobileView]);

  return (
    <ChatColumnHeaderWrapper>
      <Stack direction="row" spacing={2}>
        <Box display="contents" role="search" aria-label="Konversationen">
          <Input
            slotProps={{
              input: {
                ref: (el) => {
                  if (el) {
                    ref.current = el;
                  }
                },
              },
            }}
            startDecorator={<SearchIcon size="sm" />}
            type="search"
            value={searchQuery}
            endDecorator={
              !!searchQuery?.length && (
                <CloseIcon size="sm" onClick={handleClose} />
              )
            }
            placeholder="Konversationen suchen"
            aria-label="Suchen"
            fullWidth
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </Box>
        <Dropdown>
          <MenuButton
            aria-label="Neuen Chat öffnen"
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
