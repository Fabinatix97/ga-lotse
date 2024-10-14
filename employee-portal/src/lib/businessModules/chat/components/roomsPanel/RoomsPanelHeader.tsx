/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import CloseIcon from "@mui/icons-material/Close";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import SearchIcon from "@mui/icons-material/Search";
import { Dropdown, Input, Menu, MenuButton, MenuItem, Stack } from "@mui/joy";

import { ChatColumnHeaderWrapper } from "@/lib/businessModules/chat/components/ChatColumnHeaderWrapper";
import { ChatPanelView } from "@/lib/businessModules/chat/shared/enums";

interface RoomsPanelHeaderProps {
  setChatPanelView: (viewType: ChatPanelView) => void;
  searchQuery: string;
  setSearchQuery: (searchQuery: string) => void;
}
export function RoomsPanelHeader({
  setChatPanelView,
  setSearchQuery,
  searchQuery,
}: Readonly<RoomsPanelHeaderProps>) {
  function handleClose() {
    setSearchQuery("");
  }

  return (
    <ChatColumnHeaderWrapper>
      <Stack direction="row" spacing={2}>
        <Input
          startDecorator={<SearchIcon size="sm" />}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          endDecorator={
            !!searchQuery?.length && (
              <CloseIcon onClick={handleClose} size="sm" />
            )
          }
        />
        <Dropdown>
          <MenuButton
            aria-label="Open new chat window"
            variant="solid"
            color="primary"
            sx={{ p: "0.5rem" }}
          >
            <OpenInNewIcon size="sm" />
          </MenuButton>
          <Menu>
            <MenuItem
              onClick={() => setChatPanelView(ChatPanelView.NewDirectChat)}
            >
              Direktnachricht
            </MenuItem>
            <MenuItem
              onClick={() => setChatPanelView(ChatPanelView.NewGroupChat)}
            >
              Gruppe erstellen
            </MenuItem>
          </Menu>
        </Dropdown>
      </Stack>
    </ChatColumnHeaderWrapper>
  );
}
