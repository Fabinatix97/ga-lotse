/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import ChatOutlinedIcon from "@mui/icons-material/ChatOutlined";
import { Box, Stack, Typography } from "@mui/joy";
import { useField } from "formik";
import { useMemo } from "react";
import { isObjectType } from "remeda";

import { ChatIllustrationBackground } from "@/lib/businessModules/chat/components/ChatIllustrationBackground";
import { ChatMessages } from "@/lib/businessModules/chat/components/chatPanel/ChatMessages";
import { useCreateNewChat } from "@/lib/businessModules/chat/shared/hooks/useCreateNewChat";

export function DirectChatContent() {
  const [field] = useField<string | string[] | null>("invite");
  const invite = field.value;
  const { findExisingRoom } = useCreateNewChat();

  const existingChat = useMemo(() => {
    if (!invite) return;
    if (Array.isArray(invite)) return;
    return findExisingRoom(invite);
  }, [findExisingRoom, invite]);

  return isObjectType(existingChat) && existingChat?.room.roomId ? (
    <ChatMessages room={existingChat} />
  ) : (
    <>
      <ChatIllustrationBackground />
      <Box sx={{ minHeight: "2rem" }}>
        {field.value && !isObjectType(existingChat) && (
          <Stack
            direction="row"
            spacing={1}
            alignItems="center"
            justifyContent="center"
            sx={{ width: "100%" }}
          >
            <ChatOutlinedIcon sx={{ color: "neutral.500" }} />
            <Typography
              level="title-sm"
              textColor="neutral.500"
              fontWeight="500"
            >
              Senden Sie eine Nachricht, um einen Chat zu starten!
            </Typography>
          </Stack>
        )}
      </Box>
    </>
  );
}
