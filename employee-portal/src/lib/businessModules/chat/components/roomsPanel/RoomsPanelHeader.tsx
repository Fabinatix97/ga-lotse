/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";
import { Dropdown, Input, Menu, MenuButton, MenuItem, Stack } from "@mui/joy";

import { ChatColumnHeaderWrapper } from "@/lib/businessModules/chat/components/ChatColumnHeaderWrapper";
import { ChatPanelView } from "@/lib/businessModules/chat/shared/enums";

interface RoomsPanelHeaderProps {
  setChatPanelView: (viewType: ChatPanelView) => void;
  searchQuery: string;
  setSearchQuery: (searchQuery: string) => void;
  roomSearchDisabled: boolean;
}
export function RoomsPanelHeader({
  setChatPanelView,
  setSearchQuery,
  searchQuery,
  roomSearchDisabled,
}: Readonly<RoomsPanelHeaderProps>) {
  function handleClose() {
    setSearchQuery("");
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
          onChange={(e) => setSearchQuery(e.target.value)}
          endDecorator={
            !!searchQuery?.length && (
              <CloseIcon onClick={handleClose} size="sm" />
            )
          }
          placeholder="Suche nach Konversation..."
          disabled={roomSearchDisabled}
        />
        <Dropdown>
          <MenuButton
            aria-label="Open new chat window"
            variant="solid"
            color="primary"
            sx={{ p: "0.5rem" }}
          >
            <AddIcon size="sm" />
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
