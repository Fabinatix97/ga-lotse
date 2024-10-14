/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { Box, List, ListItem, ListItemButton, Typography } from "@mui/joy";
import { useState } from "react";

import { RoomListItem } from "@/lib/businessModules/chat/components/roomList/RoomListItem";
import { ChatPanelView } from "@/lib/businessModules/chat/shared/enums";
import { RoomWithCommunicationType } from "@/lib/businessModules/chat/shared/types";

interface ExpandableRoomList {
  roomList: RoomWithCommunicationType[];
  setChatPanelView: (viewType: ChatPanelView) => void;
  buttonLabel: string;
  selectedRoomId: string;
  setRoomIdParam: (id: string) => void;
}

export function ExpandableRoomList({
  roomList,
  setChatPanelView,
  buttonLabel,
  setRoomIdParam,
  selectedRoomId,
}: Readonly<ExpandableRoomList>) {
  const [isOpen, setOpen] = useState(true);

  return (
    <ListItem
      sx={{
        display: "flex",
        flexDirection: "column",
        paddingX: 0,
        paddingY: 0,
        width: "100%",
        gap: 0,
      }}
    >
      <ListItemButton
        onClick={() => setOpen((prevState) => !prevState)}
        sx={{ paddingY: 1.875, paddingX: 2.5, marginTop: 0.5, marginX: 0 }}
      >
        <KeyboardArrowDownIcon
          sx={{
            transition: `transform 0.3s ease-in-out`,
            transform: isOpen ? "rotate(0deg)" : "rotate(-180deg)",
          }}
        />
        <Typography level="title-sm">
          {buttonLabel} ({roomList.length})
        </Typography>
      </ListItemButton>
      <Box
        sx={{
          paddingX: 0,
          paddingY: 0,
          margin: 0,
          width: "100%",
          display: "grid",
          visibility: isOpen ? "visible" : "hidden",
          gridTemplateRows: isOpen ? "1fr" : "0fr",
          transition: "grid-template-rows 0.3s ease",
          "@media (prefers-reduced-motion)": {
            transition: "none",
          },
          "& > *": {
            overflow: "hidden",
          },
        }}
      >
        <List
          sx={{
            width: "100%",
            paddingY: 0,
          }}
        >
          {roomList.map(({ room, communicationType, latestMessage }) => (
            <ListItem
              key={room.roomId}
              sx={{
                padding: 0,
                marginBlock: "0.125rem",
                "&:first-of-type": {
                  paddingTop: 0,
                  marginTop: 0.5,
                },
                "&:last-of-type": {
                  paddingBottom: 0,
                  marginBottom: 0.5,
                },
              }}
            >
              <ListItemButton
                onClick={() => {
                  setRoomIdParam(room.roomId);
                  setChatPanelView(ChatPanelView.ChatMessages);
                }}
                selected={selectedRoomId === room.roomId}
                color="neutral"
                sx={{
                  paddingX: 2.5,
                  paddingY: 1.5,
                  margin: 0,
                }}
              >
                <RoomListItem
                  room={room}
                  communicationType={communicationType}
                  latestMessage={latestMessage}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>
    </ListItem>
  );
}
