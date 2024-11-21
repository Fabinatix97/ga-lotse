/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { BaseModal } from "@eshg/lib-portal/components/BaseModal";
import SettingsIcon from "@mui/icons-material/Settings";
import {
  Avatar,
  Badge,
  Button,
  Divider,
  Sheet,
  Switch,
  Typography,
} from "@mui/joy";
import { User } from "matrix-js-sdk/lib/matrix";
import { useState } from "react";

import { useChat } from "@/lib/businessModules/chat/shared/ChatProvider";
import { useUserSettings } from "@/lib/businessModules/chat/shared/hooks/useUserSettings";

interface UserPanelProps {
  loggedInUser: User;
  getImageUrl: (url?: string) => string | null;
}

export function UserPanel({
  loggedInUser,
  getImageUrl,
}: Readonly<UserPanelProps>) {
  const [modalOpen, setModalOpen] = useState(false);
  const {
    userSettings: {
      sharePresence,
      showReadConfirmation,
      showTypingNotification,
    },
  } = useChat();
  const {
    togglePresenceStatus,
    toggleReadConfirmation,
    toggleTypingNotifications,
  } = useUserSettings();

  return (
    <>
      <Sheet sx={{ px: 1, borderRadius: 0 }}>
        <Button
          aria-label="Benutzereinstellungen"
          onClick={() => setModalOpen(true)}
          variant="soft"
          sx={{
            backgroundColor: "transparent",
            p: 0,
            borderRadius: "50%",
            "&:hover": {
              backgroundColor: "transparent",
            },
          }}
        >
          <Badge
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            badgeInset="18%"
            variant="plain"
            size="lg"
            badgeContent={<SettingsIcon color="neutral" />}
            sx={{
              backgroundColor: "transparent",
              "--Badge-ring": "none",
            }}
            slotProps={{
              badge: {
                sx: { px: 0, border: "none" },
              },
            }}
          >
            <Avatar
              src={getImageUrl(loggedInUser?.avatarUrl) ?? undefined}
              variant="outlined"
            />
          </Badge>
        </Button>
      </Sheet>
      <BaseModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        modalTitle={loggedInUser.displayName ?? ""}
      >
        <Sheet
          variant="soft"
          sx={{
            minHeight: "9rem",
            backgroundColor: "transparent",
            p: 0,
            mt: 0,
          }}
        >
          <Typography level="body-md" color="primary" mb={2}>
            {loggedInUser.userId}
          </Typography>
          <Divider />
          <Typography
            component="label"
            mt={2}
            endDecorator={
              <Switch
                checked={sharePresence}
                onChange={() => togglePresenceStatus(sharePresence)}
              />
            }
          >
            Online-Status senden
          </Typography>
          <Typography
            component="label"
            mt={2}
            endDecorator={
              <Switch
                checked={showReadConfirmation}
                onChange={() => toggleReadConfirmation(showReadConfirmation)}
              />
            }
          >
            Lesebestätigungen anzeigen
          </Typography>
          <Typography
            component="label"
            mt={2}
            endDecorator={
              <Switch
                checked={showTypingNotification}
                onChange={() =>
                  toggleTypingNotifications(showTypingNotification)
                }
              />
            }
          >
            Eingabebenachrichtigungen anzeigen
          </Typography>
        </Sheet>
      </BaseModal>
    </>
  );
}
