/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  DrawerProps,
  SIDEBAR_PADDING,
  SidebarActions,
  SidebarContent,
  UseSidebarResult,
  useSidebar,
} from "@eshg/lib-employee-portal";
import { BaseModal } from "@eshg/lib-portal/components/BaseModal";
import { useNavigation } from "@eshg/lib-portal/components/navigation/NavigationContext";
import { useSnackbar } from "@eshg/lib-portal/components/snackbar/SnackbarProvider";
import { OpenInNew } from "@mui/icons-material";
import ChatOutlinedIcon from "@mui/icons-material/ChatOutlined";
import { Box, Button, Divider, Stack, Switch, Typography } from "@mui/joy";
import { AuthDict, IAuthData, UIAResponse } from "matrix-js-sdk";
import { useCallback, useContext, useMemo, useState } from "react";
import { isObjectType } from "remeda";

import { ChatDeviceId } from "@/lib/baseModule/components/layout/sideNavigation/ChatDeviceId";
import { routes } from "@/lib/baseModule/shared/routes";
import { useUpdateSelfUserChatAttributes } from "@/lib/businessModules/chat/api/mutations/selfUserApi";
import { ChatUserId } from "@/lib/businessModules/chat/components/ChatUserId";
import {
  DeactivateModal,
  DeactivateModalProps,
} from "@/lib/businessModules/chat/components/deactivate/DeactivateModal";
import { clearAllStores } from "@/lib/businessModules/chat/matrix/tokens";
import { ChatClientContext } from "@/lib/businessModules/chat/shared/ChatClientProvider";
import { useChat } from "@/lib/businessModules/chat/shared/ChatProvider";
import { logger } from "@/lib/businessModules/chat/shared/helpers";
import { useBackupInfo } from "@/lib/businessModules/chat/shared/hooks/useBackupInfo";
import { useUserSettings } from "@/lib/businessModules/chat/shared/hooks/useUserSettings";
import { termsOfUseText } from "@/lib/businessModules/chat/shared/termsOfUseText";
import {
  setPresenceOffline,
  setPresenceOnline,
} from "@/lib/businessModules/chat/shared/utils";

export function useChatUserSidebar(): UseSidebarResult {
  return useSidebar({
    component: ChatSettingsSidebar,
  });
}

function ChatSettingsSidebar({ onClose }: DrawerProps) {
  const { matrixClient, isClientPrepared } =
    useContext(ChatClientContext) ?? {};
  const { tryNavigate } = useNavigation();
  const [modalValues, setModalValues] = useState<DeactivateModalProps>();
  const [termsOfUseModal, setTermsOfUseModal] = useState(false);
  const snackbar = useSnackbar();

  const chatUserId = matrixClient?.getUserId();

  const { mutateAsync: updateSelfUserChatAttributes } =
    useUpdateSelfUserChatAttributes();

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
  const { deactivateAccount } = useUserSettings();
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

  const handleStopChat = useCallback(async () => {
    if (!matrixClient) return;

    try {
      await updateSelfUserChatAttributes({
        externalChatUsername: "",
        chatCryptoStoreDeriveKeySecret: "",
      });
    } catch (e) {
      logger.error(e);
    }

    try {
      matrixClient.stopClient();
      await clearAllStores();
    } catch (error) {
      logger.error(error);
    }
  }, [matrixClient, updateSelfUserChatAttributes]);

  const showSSOModal = useCallback(
    (values: Omit<DeactivateModalProps, "onFinished" | "open">) => {
      return new Promise<{ confirmed: boolean }>((resolve) => {
        function onFinished(confirmed: boolean) {
          resolve({ confirmed });
          setModalValues(undefined);
          onClose();
          if (confirmed) {
            void handleStopChat();
          }
        }
        setModalValues({ ...values, onFinished });
      });
    },
    [handleStopChat, onClose],
  );

  const handleDeactivateClick = useCallback(async () => {
    if (!matrixClient) return;
    async function makeRequest(auth: AuthDict | null) {
      return matrixClient?.deactivateAccount(auth ?? undefined);
    }

    try {
      await matrixClient.deactivateAccount(undefined);
    } catch (error) {
      if (isObjectType(error) && "data" in error) {
        const { session } = error.data as IAuthData;

        if (!session) {
          throw new Error("Unable to receive session");
        }

        const modalPromise = showSSOModal({
          makeRequest: makeRequest as (
            auth: AuthDict | null,
          ) => Promise<UIAResponse<void>>,
          session: session,
          authData: error.data as AuthDict,
        });
        const { confirmed } = await modalPromise;
        if (confirmed) {
          deactivateAccount(true);
          snackbar.notification("Account Deactivated");
        }
      }
    }
  }, [deactivateAccount, matrixClient, showSSOModal, snackbar]);

  const deviceId = useMemo(() => matrixClient?.getDeviceId(), [matrixClient]);

  return (
    <>
      <SidebarContent
        title="Chat Einstellungen"
        header={
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
        }
      >
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
              onClick={() => setTermsOfUseModal(true)}
              variant="plain"
              sx={{
                paddingX: 1,
                "&:hover": { backgroundColor: "transparent" },
              }}
            >
              Nutzungsbedingungen
            </Button>
            zur Chatfunktion zugestimmt
          </Typography>
          <Button
            onClick={handleDeactivateClick}
            sx={{ alignSelf: "flex-start", mt: 2 }}
            color="danger"
          >
            Account deaktivieren
          </Button>
        </Stack>
      </SidebarContent>

      <SidebarActions>
        <Button
          sx={{ alignSelf: "end" }}
          onClick={() => {
            onClose();
            tryNavigate(routes.chat);
          }}
          endDecorator={<OpenInNew />}
        >
          Chatbereich
        </Button>
      </SidebarActions>
      <DeactivateModal
        onFinished={modalValues?.onFinished}
        makeRequest={modalValues?.makeRequest}
        session={modalValues?.session}
        authData={modalValues?.authData}
      />
      <BaseModal
        modalTitle="Nutzungsbedingungen"
        open={termsOfUseModal}
        onClose={() => setTermsOfUseModal(false)}
      >
        <Box sx={{ paddingY: 3 }}>{termsOfUseText}</Box>
      </BaseModal>
    </>
  );
}

export function ChatSettingsButton() {
  const chatSidebar = useChatUserSidebar();
  return (
    <Button
      variant={"plain"}
      size={"md"}
      startDecorator={<ChatOutlinedIcon />}
      onClick={chatSidebar.open}
      sx={{
        paddingInline: 1,
        justifyContent: "flex-start",
      }}
    >
      Chat Einstellungen
    </Button>
  );
}
