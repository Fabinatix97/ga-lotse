/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Stack, Typography } from "@mui/joy";

import { ChatUserId } from "@/lib/businessModules/chat/components/ChatUserId";

interface MemberInfoProps {
  userId: string;
  departmentName?: string;
}

export function MemberInfo({ userId, departmentName }: MemberInfoProps) {
  return (
    <Stack
      spacing={2}
      sx={{
        padding: 3,
        borderBottom: "1px solid",
        borderColor: "neutral.outlinedBorder",
      }}
    >
      <Typography
        sx={{ textWrap: "pretty" }}
        data-testid="chat-user-department"
      >
        {departmentName}
      </Typography>
      <ChatUserId userId={userId} />
    </Stack>
  );
}
