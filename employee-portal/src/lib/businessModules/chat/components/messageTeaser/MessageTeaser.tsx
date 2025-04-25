/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import CloseIcon from "@mui/icons-material/Close";
import { Box, Button, IconButton, Snackbar, Stack, Typography } from "@mui/joy";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

import { InternalLinkButton } from "@eshg/lib-portal/components/navigation/InternalLinkButton";

import { ChatSnackbarValues } from "@/lib/businessModules/chat/components/messageTeaser/MessageTeaserProvider";
import { useChat } from "@/lib/businessModules/chat/shared/ChatProvider";
import { routes } from "@/lib/businessModules/chat/shared/routes";
import { Presence } from "@/lib/businessModules/chat/shared/types";
import { getStatusColor } from "@/lib/businessModules/chat/shared/utils";

export interface BaseSnackbarProps {
  snackbar: ChatSnackbarValues | undefined;
  onClose: () => void;
}

export function MessageTeaser({
  snackbar,
  onClose,
}: Readonly<BaseSnackbarProps>) {
  const pathname = usePathname();
  const { userSettings, messagesSidebar } = useChat();

  const isInfoType = snackbar?.type === "info";
  const link = snackbar?.link ?? routes.index;

  useEffect(() => {
    if (pathname === routes.index || messagesSidebar.isOpen) {
      onClose();
    }
  }, [onClose, pathname, messagesSidebar.isOpen]);

  function toggleMessagesSidebar(): void {
    if (messagesSidebar.isOpen) {
      messagesSidebar.close();
    } else {
      messagesSidebar.open();
    }
  }

  return (
    <Snackbar
      open={!!snackbar}
      variant="outlined"
      size="md"
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      autoHideDuration={5000}
      key={snackbar?.key}
      onClose={(_event, reason) => {
        if (reason !== "clickaway") {
          onClose();
        }
      }}
      slotProps={{
        root: {
          sx: {
            borderRadius: "md",
            backgroundColor: "common.white",
            top: {
              xxs: "4rem",
              sm: "5rem",
            },
          },
        },
      }}
    >
      {snackbar && (
        <Stack sx={{ maxWidth: "21.5rem", maxHeight: "11.375rem" }}>
          <Stack direction="row">
            <Stack
              direction="row"
              sx={{
                width: "100%",
                boxSizing: "content-box",
                alignItems: "center",
              }}
            >
              {userSettings.sharePresence && snackbar.userPresence && (
                <Box
                  sx={{
                    width: "0.625rem",
                    height: "0.625rem",
                    borderRadius: "100%",
                    backgroundColor: getStatusColor(
                      snackbar.userPresence as Presence,
                    ),
                    marginRight: 0.8,
                  }}
                ></Box>
              )}
              <Typography
                level="title-md"
                fontWeight={600}
                noWrap
                sx={{
                  fontWeight: "bold",
                  maxWidth: "15rem",
                  textOverflow: "ellipsis",
                }}
              >
                {snackbar.title}
              </Typography>
            </Stack>
            <IconButton
              aria-label="Schließen"
              onClick={onClose}
              color="primary"
            >
              <CloseIcon />
            </IconButton>
          </Stack>
          <Typography
            level="body-md"
            maxWidth="18rem"
            textColor="common.black"
            noWrap={true}
            sx={{
              display: "-webkit-box",
              overflow: "hidden",
              WebkitBoxOrient: "vertical",
              WebkitLineClamp: 3,
              whiteSpace: "normal",
            }}
          >
            {snackbar.text}
          </Typography>
          <Stack
            spacing={2}
            display="flex"
            flexDirection="row"
            marginTop="1rem"
            justifyContent="space-between"
            sx={{ width: "100%" }}
          >
            <InternalLinkButton
              href={link}
              variant="outlined"
              size="sm"
              sx={{
                borderRadius: "sm",
              }}
            >
              Zum Chatbereich
            </InternalLinkButton>
            {!isInfoType && (
              <Button
                variant="soft"
                size="sm"
                color="primary"
                sx={{
                  border: "1px",
                  borderRadius: "sm",
                }}
                onClick={() => {
                  toggleMessagesSidebar();
                  onClose();
                }}
              >
                Antworten
              </Button>
            )}
          </Stack>
        </Stack>
      )}
    </Snackbar>
  );
}
