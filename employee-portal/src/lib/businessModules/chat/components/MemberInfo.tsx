/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Stack, Typography } from "@mui/joy";

import { ChatUserId } from "@/lib/businessModules/chat/components/ChatUserId";
import { getDepartmentNameFromUserId } from "@/lib/businessModules/chat/shared/utils";

interface MemberInfoProps {
  userId: string;
}

export function MemberInfo({ userId }: MemberInfoProps) {
  return (
    <Stack
      spacing={2}
      sx={{
        padding: 3,
        borderBottom: "1px solid",
        borderColor: "neutral.outlinedBorder",
      }}
    >
      <Typography sx={{ textTransform: "capitalize" }}>
        {getDepartmentNameFromUserId(userId)?.organisationName}
      </Typography>
      <ChatUserId userId={userId} />
    </Stack>
  );
}
