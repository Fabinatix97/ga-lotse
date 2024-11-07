/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Box, Stack, Typography } from "@mui/joy";
import { useLayoutEffect, useRef, useState } from "react";

import { OnlineStatus } from "@/lib/businessModules/chat/components/OnlineStatus";
import { ChatRoomMember } from "@/lib/businessModules/chat/shared/types";

const SAFE_MARGIN_WIDTH = 90;

export function UserList({
  users,
  isGroupRoom,
}: {
  users: ChatRoomMember[];
  isGroupRoom: boolean;
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [visibleCount, setVisibleCount] = useState(users.length);
  const [hiddenCount, setHiddenCount] = useState(0);

  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const containerWidth = entry.contentRect.width;

        let accumulatedWidth = 0;
        let newVisibleCount = users.length;

        for (let i = 0; i < users.length; i++) {
          accumulatedWidth += container.children[i]?.clientWidth ?? 0;
          if (accumulatedWidth > containerWidth - SAFE_MARGIN_WIDTH) {
            newVisibleCount = i;
            break;
          }
        }
        setVisibleCount(newVisibleCount);
        setHiddenCount(users.length - newVisibleCount);
      }
    });

    if (container && users.length > 1) {
      resizeObserver.observe(container);
    }

    return () => {
      if (container) {
        resizeObserver.unobserve(container);
      }
    };
  }, [users]);

  return (
    <Box sx={{ position: "relative" }}>
      <Stack direction="row" spacing={2}>
        {users.slice(0, visibleCount).map((item, index) => (
          <OnlineStatus
            key={item.member.userId + index.toString()}
            userId={item.member.userId}
            name={isGroupRoom ? item.member.name : undefined}
          />
        ))}
        {!!hiddenCount && (
          <Typography noWrap>+{hiddenCount} weitere</Typography>
        )}
      </Stack>

      {/* Use a hidden list to calculate the total width
      without changing the original user count */}

      <Stack
        ref={containerRef}
        direction="row"
        spacing={2}
        sx={{ position: "absolute", visibility: "hidden", inset: 0 }}
      >
        {users.map((item, index) => (
          <OnlineStatus
            key={item.member.userId + index.toString()}
            userId={item.member.userId}
            name={isGroupRoom ? item.member.name : undefined}
          />
        ))}
      </Stack>
    </Box>
  );
}
