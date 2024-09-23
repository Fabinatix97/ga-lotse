/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

/* eslint-disable react/forbid-elements */
import { ClickAwayListener } from "@mui/base";
import SendRoundedIcon from "@mui/icons-material/SendRounded";
import {
  Box,
  Button,
  Menu,
  MenuItem,
  Stack,
  Textarea,
  Typography,
} from "@mui/joy";
import { RoomMember } from "matrix-js-sdk/lib/matrix";
import { ChangeEvent, FormEvent, KeyboardEvent, useRef, useState } from "react";
import { useDebouncedCallback } from "use-debounce";

interface MessageInput {
  handleUserTyping: (roomId: string, isTyping: boolean) => Promise<void>;
  selectedRoomId: string;
  onSubmit: (text: string, mentionedUser?: string[]) => Promise<void> | null;
  roomMembers: RoomMember[];
}
export function MessageInput({
  onSubmit,
  roomMembers,
  handleUserTyping,
  selectedRoomId,
}: Readonly<MessageInput>) {
  const [textareaValue, setTextareaValue] = useState("");
  const [filteredUsers, setFilteredUsers] = useState<RoomMember[]>([]);
  const [mentionedUsers, setMentionedUsers] = useState<string[]>([]);
  const [selectedUserIndex, setSelectedUserIndex] = useState<number>();
  const textareaRef = useRef<HTMLDivElement>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    await onSubmit(textareaValue, mentionedUsers);
    setTextareaValue("");
    setMentionedUsers([]);
  }

  const debouncedHandleUserTyping = useDebouncedCallback(
    (isTyping: boolean) => handleUserTyping(selectedRoomId, isTyping),
    500,
    { leading: true },
  );

  function handleTextareaChange(event: ChangeEvent<HTMLTextAreaElement>) {
    const { value } = event.target;
    setTextareaValue(value);

    // Check if we are currently mentioning someone
    const mentionIndex = value.lastIndexOf("@");
    if (
      mentionIndex !== -1 &&
      (mentionIndex === 0 ||
        value[mentionIndex - 1] === " " ||
        value[mentionIndex - 1] === "\n")
    ) {
      const currentMention = value.slice(mentionIndex + 1);
      const filtered = roomMembers.filter((user) =>
        user.name.toLowerCase().includes(currentMention.toLowerCase()),
      );
      setFilteredUsers(filtered);
      setSelectedUserIndex(0);
    } else {
      setFilteredUsers([]);
      setSelectedUserIndex(undefined);
    }

    if (value === "") {
      void debouncedHandleUserTyping(false);
    } else {
      void debouncedHandleUserTyping(true);
    }
  }
  function handleUserModalClose() {
    setFilteredUsers([]);
    setSelectedUserIndex(undefined);
  }

  async function handleKeydown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (
      event.key === "@" &&
      (textareaValue.length === 0 ||
        textareaValue.endsWith(" ") ||
        textareaValue.endsWith("\n"))
    ) {
      setFilteredUsers(roomMembers);
      setSelectedUserIndex(0);
      return;
    }
    if (event.key === "Enter" && !event.shiftKey && filteredUsers.length > 0) {
      event.preventDefault();
      handleUserSelect(filteredUsers[selectedUserIndex ?? 0]);
      return;
    }

    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      await onSubmit(textareaValue, mentionedUsers);
      setTextareaValue("");
      setMentionedUsers([]);
    }

    if (event.key === "ArrowDown" && filteredUsers.length > 0) {
      event.preventDefault();
      setSelectedUserIndex(
        (prevIndex) => ((prevIndex ?? 0) + 1) % filteredUsers.length,
      );
    }

    if (event.key === "ArrowUp" && filteredUsers.length > 0) {
      event.preventDefault();
      setSelectedUserIndex(
        (prevIndex) =>
          ((prevIndex ?? 0) - 1 + filteredUsers.length) % filteredUsers.length,
      );
    }
  }

  function handleUserSelect(user: RoomMember | undefined) {
    if (!user) return;
    const mentionIndex = textareaValue.lastIndexOf("@");
    const newText = textareaValue.slice(0, mentionIndex + 1) + user.name + " ";
    setTextareaValue(newText);
    setFilteredUsers([]);
    setSelectedUserIndex(undefined);
    setMentionedUsers((prev) => [...prev, user.userId]);
    // Focus back to the textarea
    const textareaNode = textareaRef.current?.childNodes?.[0] as
      | HTMLTextAreaElement
      | undefined;
    if (textareaNode) {
      textareaNode.focus();
    }
  }

  return (
    <Box sx={{ px: 2, pb: 3 }}>
      <form onSubmit={handleSubmit}>
        <ClickAwayListener onClickAway={handleUserModalClose}>
          <Menu
            disablePortal
            keepMounted
            open={filteredUsers.length > 0}
            anchorEl={textareaRef.current}
            sx={{ width: "calc(100% - 2rem)" }}
          >
            {filteredUsers.map((user, index) => (
              <MenuItem
                key={user.userId}
                selected={index === selectedUserIndex}
                onClick={() => handleUserSelect(user)}
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Typography level="body-sm">{user.name}</Typography>{" "}
                <Typography level="body-xs">{user.userId}</Typography>
              </MenuItem>
            ))}
          </Menu>
        </ClickAwayListener>
        <Textarea
          ref={textareaRef}
          placeholder="Geben Sie hier etwas ein ..."
          aria-label="Message"
          onChange={handleTextareaChange}
          onKeyDown={handleKeydown}
          minRows={2}
          maxRows={10}
          value={textareaValue}
          endDecorator={
            <Stack
              direction="row"
              justifyContent="flex-end"
              alignItems="center"
              flexGrow={1}
              sx={{
                pt: 1,
                pb: 0.5,
                borderTop: "1px solid",
                borderColor: "divider",
              }}
            >
              <Button
                size="sm"
                color="primary"
                sx={{ alignSelf: "center", borderRadius: "sm" }}
                endDecorator={<SendRoundedIcon />}
                type="submit"
              >
                Send
              </Button>
            </Stack>
          }
        />
      </form>
    </Box>
  );
}
