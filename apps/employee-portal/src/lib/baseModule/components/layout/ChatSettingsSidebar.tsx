/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { OpenInNew } from "@mui/icons-material";
import ChatOutlinedIcon from "@mui/icons-material/ChatOutlined";
import { Button, Divider, Stack, Switch, Typography } from "@mui/joy";
import { useCallback, useContext, useMemo, useState } from "react";

import {
  DrawerProps,
  SIDEBAR_PADDING,
  SidebarActions,
  SidebarContent,
  UseSidebarResult,
  useSidebar,
} from "@eshg/lib-employee-portal";
import { BaseModal, useNavigation } from "@eshg/lib-portal";

import { ChatDeviceId } from "@/lib/baseModule/components/layout/sideNavigation/ChatDeviceId";
import { routes } from "@/lib/baseModule/shared/routes";
import { useUpdateSelfUserChatAttributes } from "@/lib/businessModules/chat/api/mutations/selfUserApi";
import { useDeactivateUserAccount } from "@/lib/businessModules/chat/api/mutations/userAccountApi";
import { ChatUserId } from "@/lib/businessModules/chat/components/ChatUserId";
import { TermsOfUse } from "@/lib/businessModules/chat/components/TermsOfUse";
import { DeactivateModal } from "@/lib/businessModules/chat/components/deactivate/DeactivateModal";
import { DoubleConfirmModal } from "@/lib/businessModules/chat/components/deactivate/DoubleConfirmModal";
import { clearAllStores } from "@/lib/businessModules/chat/matrix/tokens";
import { ChatClientContext } from "@/lib/businessModules/chat/shared/ChatClientProvider";
import { useChat } from "@/lib/businessModules/chat/shared/ChatProvider";
import { logger } from "@/lib/businessModules/chat/shared/helpers";
import { useBackupInfo } from "@/lib/businessModules/chat/shared/hooks/useBackupInfo";
import { useUserSettings } from "@/lib/businessModules/chat/shared/hooks/useUserSettings";
import {
  setPresenceOffline,
  setPresenceOnline,
} from "@/lib/businessModules/chat/shared/utils";

function useChatUserSidebar(): UseSidebarResult {
  return useSidebar({
    component: ChatSettingsSidebar,
  });
}

function ChatSettingsSidebar({ onClose }: DrawerProps) {
  const { matrixClient, isClientPrepared } =
    useContext(ChatClientContext) ?? {};
  const { tryNavigate } = useNavigation();
  const [deactivateModalOpen, setDeactivateModalOpen] = useState(false);
  const [doubleConfirmationModalOpen, setDoubleConfirmationModalOpen] =
    useState(false);
  const [termsOfUseModal, setTermsOfUseModal] = useState(false);

  const chatUserId = matrixClient?.getUserId();

  const { mutateAsync: updateKeycloakUserChatAttributes } =
    useUpdateSelfUserChatAttributes();

  const { mutateAsync: deactivateUserAccountInSynapseServer } =
    useDeactivateUserAccount();

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
  const { deactivateAccount: markUserAsDeactivatedInChatManagement } =
    useUserSettings();
  const { backupStatus } = useBackupInfo();

  const isEncryptionReady = useMemo(() => {
    return (
      backupStatus?.backupInfo &&
      backupStatus.backupKeyStored &&
      backupStatus.backupKeyCached &&
      backupStatus.secretStorageReady
    );
  }, [backupStatus]);

  const handlePresenceStatusChange = useCallback(async () => {
    togglePresenceStatus(sharePresence);

    if (matrixClient && isClientPrepared) {
      if (sharePresence) {
        await setPresenceOffline(matrixClient);
      } else {
        await setPresenceOnline(matrixClient);
      }
    }
  }, [isClientPrepared, matrixClient, sharePresence, togglePresenceStatus]);

  const handleDeleteUserAccount = useCallback(async () => {
    try {
      if (!matrixClient) {
        throw new Error("Unexpected error: matrixClient is not initialized");
      }
      const matrixUserId = matrixClient.getUserId();
      if (!matrixUserId) {
        throw new Error(
          "Unexpected error: Missing matrixClient has no userId defined",
        );
      }

      matrixClient.stopClient();
      await clearAllStores();

      await updateKeycloakUserChatAttributes({
        externalChatUsername: "",
        chatCryptoStoreDeriveKeySecret: "",
      });

      markUserAsDeactivatedInChatManagement();

      await deactivateUserAccountInSynapseServer({
        matrixUserId: matrixUserId,
      });

      setDeactivateModalOpen(false);
      setDoubleConfirmationModalOpen(false);
    } catch (error) {
      logger.error(error);
    }

    tryNavigate(routes.index);
  }, [
    markUserAsDeactivatedInChatManagement,
    setDeactivateModalOpen,
    setDoubleConfirmationModalOpen,
    matrixClient,
    deactivateUserAccountInSynapseServer,
    updateKeycloakUserChatAttributes,
    tryNavigate,
  ]);

  const deviceId = useMemo(() => matrixClient?.getDeviceId(), [matrixClient]);

  return (
    <>
      <SidebarContent title="Chat Einstellungen">
        <Stack spacing={2} sx={{ paddingRight: SIDEBAR_PADDING }}>
          <ChatUserId userId={chatUserId} />
          {deviceId && typeof deviceId === "string" && (
            <ChatDeviceId
              device={deviceId}
              isEncryptionReady={!!isEncryptionReady}
            />
          )}
          <Divider orientation="horizontal" sx={{ mt: 2 }} />
        </Stack>
        <Stack gap={2} height="100%" sx={{ mt: 1 }}>
          <Typography
            component="label"
            startDecorator={
              <Switch
                checked={sharePresence}
                onChange={handlePresenceStatusChange}
              />
            }
          >
            Online-Status sichtbar
          </Typography>
          <Typography
            component="label"
            startDecorator={
              <Switch
                checked={showReadConfirmation}
                onChange={() => toggleReadConfirmation(showReadConfirmation)}
              />
            }
          >
            Lesebestätigungen aktivieren
          </Typography>
          <Typography
            component="label"
            startDecorator={
              <Switch
                checked={showTypingNotification}
                onChange={() =>
                  toggleTypingNotifications(showTypingNotification)
                }
              />
            }
          >
            Schreibanzeige aktivieren
          </Typography>
          <Typography level="body-sm" mt={10}>
            Sie haben den
            <Button
              variant="plain"
              sx={{
                paddingX: 1,
                "&:hover": { backgroundColor: "transparent" },
              }}
              onClick={() => setTermsOfUseModal(true)}
            >
              Nutzungsbedingungen
            </Button>
            zur Chatfunktion zugestimmt
          </Typography>
          <Button
            sx={{ alignSelf: "flex-start", mt: 2 }}
            color="danger"
            onClick={() => setDeactivateModalOpen(true)}
          >
            Account deaktivieren
          </Button>
        </Stack>
      </SidebarContent>

      <SidebarActions>
        <Button
          sx={{ alignSelf: "end" }}
          endDecorator={<OpenInNew />}
          onClick={() => {
            onClose();
            tryNavigate(routes.chat);
          }}
        >
          Chatbereich
        </Button>
      </SidebarActions>
      <DeactivateModal
        open={deactivateModalOpen}
        onClose={() => setDeactivateModalOpen(false)}
        onConfirm={() => setDoubleConfirmationModalOpen(true)}
      />
      <DoubleConfirmModal
        open={doubleConfirmationModalOpen}
        onClose={() => setDoubleConfirmationModalOpen(false)}
        onConfirm={handleDeleteUserAccount}
        onCancel={() => setDoubleConfirmationModalOpen(false)}
      />
      <BaseModal
        modalTitle="Nutzungsbedingungen Chatmodul"
        open={termsOfUseModal}
        onClose={() => setTermsOfUseModal(false)}
      >
        <TermsOfUse />
      </BaseModal>
    </>
  );
}

export function ChatSettingsButton() {
  const chatSidebar = useChatUserSidebar();
  return (
    <Button
      variant="plain"
      size="md"
      startDecorator={<ChatOutlinedIcon />}
      sx={{
        paddingInline: 1,
        justifyContent: "flex-start",
      }}
      onClick={chatSidebar.open}
    >
      Chat Einstellungen
    </Button>
  );
}
