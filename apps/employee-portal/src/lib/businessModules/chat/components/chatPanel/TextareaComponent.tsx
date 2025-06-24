/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ClickAwayListener } from "@mui/base";
import SendOutlinedIcon from "@mui/icons-material/SendOutlined";
import {
  Box,
  IconButton,
  Menu,
  MenuItem,
  Stack,
  Textarea,
  Typography,
} from "@mui/joy";
import { useField, useFormikContext } from "formik";
import { RoomMember } from "matrix-js-sdk";
import {
  ChangeEvent,
  KeyboardEvent,
  RefObject,
  useEffect,
  useRef,
  useState,
} from "react";
import { useDebouncedCallback } from "use-debounce";

import { ChatAvatar } from "@/lib/businessModules/chat/components/ChatAvatar";
import { useChatClientContext } from "@/lib/businessModules/chat/shared/ChatClientProvider";
import { ClientState } from "@/lib/businessModules/chat/shared/enums";
import { logger } from "@/lib/businessModules/chat/shared/helpers";
import { getMemberAvatarUrl } from "@/lib/businessModules/chat/shared/utils";

interface MessageFormValues {
  message: string;
  mentionedUsers?: string[];
}
interface TextareaComponent {
  name: string;
  selectFieldName: string;
  handleUserTyping?: (roomId: string, isTyping: boolean) => Promise<void>;
  selectedRoomId?: string;
  roomMembers: RoomMember[];
  disabled?: boolean;
  ref?: RefObject<HTMLDivElement | null>;
}

export function TextareaComponent({
  name,
  selectFieldName,
  roomMembers,
  handleUserTyping,
  selectedRoomId,
  disabled,
  ref,
}: Readonly<TextareaComponent>) {
  const { matrixClient, departmentInfo, clientState } = useChatClientContext();
  const [filteredUsers, setFilteredUsers] = useState<RoomMember[]>([]);
  const [selectedUserIndex, setSelectedUserIndex] = useState<number>();
  const inputRef = useRef<HTMLDivElement | null>(null);

  const [field, _meta, helpers] = useField<string>(name);
  const [selectField, _metaField, selectHelpers] = useField<
    string[] | undefined
  >(selectFieldName);
  const { submitForm, resetForm, isSubmitting } =
    useFormikContext<MessageFormValues>();

  const debouncedHandleUserTyping = useDebouncedCallback(
    (isTyping: boolean) => handleUserTyping?.(selectedRoomId ?? "", isTyping),
    250,
  );
  useEffect(() => {
    if (!isSubmitting && field.value === "") {
      const innerTextareaElement = inputRef.current?.childNodes?.[0];
      if (innerTextareaElement instanceof HTMLTextAreaElement) {
        innerTextareaElement.focus();
      }
    }
  }, [field.value, isSubmitting]);
  useEffect(() => {
    resetForm();
  }, [resetForm, selectedRoomId]);

  async function handleTextareaChange(event: ChangeEvent<HTMLTextAreaElement>) {
    const { value } = event.target || {};
    await helpers.setValue(value);

    // // Check if we are currently mentioning someone
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

    void debouncedHandleUserTyping(true);
  }
  function handleUserModalClose() {
    setFilteredUsers([]);
    setSelectedUserIndex(undefined);
  }

  async function handleKeydown(event: KeyboardEvent<HTMLTextAreaElement>) {
    const inputValue = field.value;
    if (
      event.key === "@" &&
      (inputValue.length === 0 ||
        inputValue.endsWith(" ") ||
        inputValue.endsWith("\n"))
    ) {
      setFilteredUsers(roomMembers);
      setSelectedUserIndex(0);
      return;
    }
    if (event.key === "Enter" && !event.shiftKey && filteredUsers.length > 0) {
      event.preventDefault();
      await handleUserSelect(filteredUsers[selectedUserIndex ?? 0]);
      return;
    }
    if (event.key === "Enter" && !event.shiftKey) {
      try {
        event.preventDefault();
        await submitForm();
      } catch (error) {
        logger.warn("Sending message failed", error);
      }
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

  async function handleUserSelect(user: RoomMember | undefined) {
    const inputValue = field.value;
    if (!user) return;
    const mentionIndex = inputValue?.lastIndexOf("@");
    const newText =
      inputValue?.slice(0, (mentionIndex ?? 0) + 1) + user.name + " ";
    await helpers.setValue(newText);
    setFilteredUsers([]);
    setSelectedUserIndex(undefined);
    await selectHelpers.setValue([...(selectField.value ?? []), user.userId]);
    // Focus back to the input
    const inputNode = inputRef.current?.childNodes?.[0] as
      | HTMLTextAreaElement
      | undefined;
    if (inputNode) {
      inputNode.focus();
    }
  }
  const inputDisabled =
    isSubmitting || clientState === ClientState.Idle || disabled;
  const buttonDisabled = isSubmitting ?? inputDisabled ?? !!_meta.error;

  return (
    <Box sx={{ p: 2, pt: 0 }}>
      <ClickAwayListener onClickAway={handleUserModalClose}>
        <Menu
          disablePortal
          keepMounted
          open={filteredUsers.length > 0}
          anchorEl={inputRef.current}
        >
          <Typography level="title-sm" sx={{ padding: "0.5rem 1rem" }}>
            Person erwähnen
          </Typography>
          {filteredUsers.map((user, index) => (
            <MenuItem
              key={user.userId}
              selected={index === selectedUserIndex}
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
              onClick={() => handleUserSelect(user)}
            >
              <Stack
                direction="row"
                sx={{ alignItems: "center", gap: 1, marginRight: 3 }}
              >
                <ChatAvatar
                  userId={user.userId}
                  name={user.name}
                  avatarUrl={getMemberAvatarUrl(matrixClient, user)}
                  size="sm"
                />
                <Typography level="title-md">{user.name}</Typography>
              </Stack>
              <Typography
                level="body-md"
                textColor="neutral.400"
                sx={{ textTransform: "capitalize" }}
              >
                {departmentInfo?.name}
              </Typography>
            </MenuItem>
          ))}
        </Menu>
      </ClickAwayListener>
      <Textarea
        ref={(el) => {
          inputRef.current = el;
          if (!ref) return;
          ref.current = el;
        }}
        minRows={1}
        maxRows={5}
        placeholder="Nachricht schreiben"
        value={field.value}
        variant="plain"
        name={name}
        size="lg"
        sx={{
          flexDirection: "row",
          alignItems: "center",
          paddingRight: "0.75rem",
          backgroundColor: "background.level1",
          fontSize: "1rem",
          "--Textarea-paddingInline": "1rem",
          "--Textarea-paddingBlock": "1rem",
          "--Textarea-radius": "0.5rem",
          "& textarea": {
            "::-webkit-scrollbar": {
              display: "none",
            },
          },
          "& div": {
            margin: 0,
          },
        }}
        color="neutral"
        disabled={inputDisabled}
        endDecorator={
          <IconButton
            size="sm"
            color={buttonDisabled ? "neutral" : "primary"}
            type="submit"
            disabled={buttonDisabled}
          >
            <SendOutlinedIcon />
          </IconButton>
        }
        autoFocus
        onChange={handleTextareaChange}
        onKeyDown={handleKeydown}
      />
    </Box>
  );
}
