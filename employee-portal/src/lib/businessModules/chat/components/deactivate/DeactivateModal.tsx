/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { BaseModal } from "@eshg/lib-portal/components/BaseModal";
import { Stack, Typography } from "@mui/joy";
import { AuthDict, AuthType } from "matrix-js-sdk";
import { useEffect, useRef } from "react";

import { SSOAuth } from "@/lib/businessModules/chat/components/deactivate/SSOAuth";
import { MakeRequest } from "@/lib/businessModules/chat/components/secureBackup/CreateBackupSidebar";
import { useChatClientContext } from "@/lib/businessModules/chat/shared/ChatClientProvider";
import { logger } from "@/lib/businessModules/chat/shared/helpers";

export interface DeactivateModalProps {
  makeRequest: MakeRequest | undefined;
  session: string | undefined;
  onFinished: ((confirmed: boolean) => void) | undefined;
  authData: AuthDict | undefined;
}

export function DeactivateModal({
  onFinished,
  session,
  makeRequest,
  authData,
}: DeactivateModalProps) {
  const { matrixClient } = useChatClientContext();
  const popup = useRef<Window | null>(null);

  function handleSSOClick() {
    if (!session) return;
    const ssoUrl = matrixClient.getFallbackAuthUrl(AuthType.Sso, session);
    popup.current = window.open(ssoUrl);
    logger.debug(popup.current);
  }

  function handleCancel() {
    onFinished?.(false);
  }

  useEffect(() => {
    function onMessage() {
      popup.current?.close();
    }

    window.addEventListener("message", onMessage);
    return () => {
      window.removeEventListener("message", onMessage);
    };
  }, []);

  return (
    <BaseModal
      modalTitle="Account deaktivieren"
      key="sso-auth-modal"
      onClose={handleCancel}
      open={!!makeRequest}
    >
      <>
        <Typography textColor="text.secondary">
          Wenn Sie Ihren Account deaktivieren, ist keine weitere Nutzung des
          Chats möglich. Eine Reaktivierung ist nicht möglich. Sie können weder
          Nachrichten senden noch empfangen und haben keinen Zugriff mehr auf
          Ihre bestehende Kommunikation. Für Ihre Chatpartner bleiben Ihre
          gesendeten Nachrichten erhalten. Nutzen Sie bei Bedarf die Funktion,
          einzelne Nachrichten zu löschen, bevor Sie Ihren Account deaktivieren.
        </Typography>
        <Stack
          direction="row"
          spacing={2}
          sx={{ marginLeft: "auto", paddingTop: 2 }}
        >
          {authData && makeRequest && session && (
            <SSOAuth
              matrixClient={matrixClient}
              authData={authData}
              makeRequest={makeRequest}
              handleCancel={handleCancel}
              handleSSOClick={handleSSOClick}
              session={session}
              onFinished={onFinished}
            />
          )}
        </Stack>
      </>
    </BaseModal>
  );
}
