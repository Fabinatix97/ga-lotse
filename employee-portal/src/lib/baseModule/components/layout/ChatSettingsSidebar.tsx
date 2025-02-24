/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { BaseModal } from "@eshg/lib-portal/components/BaseModal";
import { useNavigation } from "@eshg/lib-portal/components/navigation/NavigationContext";
import { useSnackbar } from "@eshg/lib-portal/components/snackbar/SnackbarProvider";
import { OpenInNew } from "@mui/icons-material";
import ChatOutlinedIcon from "@mui/icons-material/ChatOutlined";
import { Box, Button, Divider, Stack, Switch, Typography } from "@mui/joy";
import { AuthDict, IAuthData, UIAResponse } from "matrix-js-sdk";
import { useCallback, useContext, useState } from "react";
import { isObjectType } from "remeda";

import { useUpdateSelfUserChatUsername } from "@/lib/baseModule/api/mutations/users";
import {
  useGetSelfUser,
  useGetUserProfile,
} from "@/lib/baseModule/api/queries/users";
import { routes } from "@/lib/baseModule/shared/routes";
import { ChatUserId } from "@/lib/businessModules/chat/components/ChatUserId";
import {
  DeactivateModal,
  DeactivateModalProps,
} from "@/lib/businessModules/chat/components/deactivate/DeactivateModal";
import {
  clearCachedCredentials,
  clearMatrixStores,
} from "@/lib/businessModules/chat/matrix/tokens";
import { ChatClientContext } from "@/lib/businessModules/chat/shared/ChatClientProvider";
import { useChat } from "@/lib/businessModules/chat/shared/ChatProvider";
import { logger } from "@/lib/businessModules/chat/shared/helpers";
import { useUserSettings } from "@/lib/businessModules/chat/shared/hooks/useUserSettings";
import { termsOfUseText } from "@/lib/businessModules/chat/shared/termsOfUseText";
import {
  setPresenceOffline,
  setPresenceOnline,
} from "@/lib/businessModules/chat/shared/utils";
import { DrawerProps } from "@/lib/shared/components/drawer/drawerContext";
import {
  UseSidebarResult,
  useSidebar,
} from "@/lib/shared/components/drawer/useSidebar";
import { sidebarPadding } from "@/lib/shared/components/sidebar/Sidebar";
import { SidebarActions } from "@/lib/shared/components/sidebar/SidebarActions";
import { SidebarContent } from "@/lib/shared/components/sidebar/SidebarContent";

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
  const updateSelfUser = useUpdateSelfUserChatUsername();
  const { data: selfUser } = useGetSelfUser();
  const { data: userData } = useGetUserProfile(selfUser.userId);
  const { deactivateAccount } = useUserSettings();

  const handlePresenceStatusChange = useCallback(async () => {
    togglePresenceStatus(sharePresence);

    if (matrixClient && isClientPrepared) {
      if (!sharePresence) {
        await setPresenceOffline(matrixClient);
      } else {
        await setPresenceOnline(matrixClient);
      }
    }
  }, [isClientPrepared, matrixClient, sharePresence, togglePresenceStatus]);

  const handleStopChat = useCallback(async () => {
    if (!matrixClient) return;
    try {
      await updateSelfUser.mutateAsync({
        externalChatUsername: undefined,
        phoneNumber: userData.user.phoneNumber,
        salutation: userData.salutation,
        title: userData.title,
      });
    } catch (e) {
      logger.error(e);
    }
    try {
      clearCachedCredentials();
      await clearMatrixStores();
    } catch (error) {
      logger.error(error);
    }
  }, [matrixClient, updateSelfUser, userData]);

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

  return (
    <>
      <SidebarContent
        title="Chat Einstellungen"
        header={
          <Stack spacing={2} sx={{ paddingRight: sidebarPadding }}>
            <ChatUserId userId={chatUserId} />
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
            tryNavigate(routes.chat as string);
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
