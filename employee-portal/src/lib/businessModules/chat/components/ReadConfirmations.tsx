/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Avatar, Stack, Tooltip } from "@mui/joy";
import { User } from "matrix-js-sdk/lib/matrix";

interface ReadConfirmationsProps {
  receiptUsers: (User | null)[];
  getImageUrl: (url?: string) => string | null;
}

export function ReadConfirmations({
  receiptUsers,
  getImageUrl,
}: Readonly<ReadConfirmationsProps>) {
  return (
    <Stack direction="row">
      {receiptUsers.length > 0 &&
        receiptUsers.map(
          (receiptUser) =>
            receiptUser?.displayName && (
              <Tooltip
                key={receiptUser.userId}
                title={receiptUser.displayName}
                disablePortal
                placement="bottom-start"
                arrow
                sx={{
                  minHeight: "2.5rem",
                  minWidth: "6rem",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: "rgba(0, 0, 0, 0.7)",
                }}
              >
                <Avatar
                  src={getImageUrl(receiptUser.avatarUrl) ?? undefined}
                  variant="outlined"
                  sx={{
                    width: "1rem",
                    height: "1rem",
                    alignSelf: "flex-end",
                    flexDirection: "row",
                  }}
                >
                  {receiptUser.displayName.charAt(0)}
                </Avatar>
              </Tooltip>
            ),
        )}
    </Stack>
  );
}
