/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Button, Stack, Typography } from "@mui/joy";
import { AuthType, InteractiveAuth } from "matrix-js-sdk";
import { useEffect, useMemo, useRef } from "react";

import { BaseModal } from "@eshg/lib-portal/components/BaseModal";

import { SSOAuthModalValues } from "@/lib/businessModules/chat/components/secureBackup/CreateBackupSidebar";
import { useChatClientContext } from "@/lib/businessModules/chat/shared/ChatClientProvider";
import { logger } from "@/lib/businessModules/chat/shared/helpers";

type RequestEmailType = (
  email: string,
  secret: string,
  attempt: number,
  session: string,
) => Promise<{ sid: string }>;

interface SSOAuthModalProps {
  values?: SSOAuthModalValues;
}

export function SSOAuthModal({ values }: SSOAuthModalProps) {
  const { matrixClient } = useChatClientContext();
  const popup = useRef<Window | null>(null);

  const authLogic = useMemo(
    () =>
      values
        ? new InteractiveAuth({
            matrixClient: matrixClient,
            doRequest: values.makeRequest,
            sessionId: values.session,
            busyChanged(busy) {
              logger.debug({ busy });
            },
            stateUpdated(nextStage, status) {
              logger.debug({ nextStage, status });
            },
            // eslint-disable-next-line @typescript-eslint/no-empty-function
            requestEmailToken: (() => {}) as unknown as RequestEmailType,
          })
        : undefined,
    [matrixClient, values],
  );

  function handleSSOClick() {
    if (!values) return;

    const ssoUrl = matrixClient.getFallbackAuthUrl(
      AuthType.Sso,
      values.session,
    );

    popup.current = window.open(ssoUrl);
    logger.debug(popup.current);
  }

  function handleCancel() {
    values?.onFinished?.(false);
  }

  useEffect(() => {
    if (authLogic) {
      logger.debug("AttemptAuth Start");
      void authLogic
        .attemptAuth()
        .then((res) => {
          logger.debug("AttemptAuth Done", res);
          values?.onFinished?.(true);
        })
        .catch((e) => {
          logger.error("AttemptAuth Error", e);
        });
    }
  }, [authLogic, values]);

  useEffect(() => {
    const pollInterval = setInterval(() => {
      void authLogic?.poll();
    }, 2000);

    return () => {
      clearInterval(pollInterval);
    };
  }, [authLogic]);

  return (
    <BaseModal
      key="sso-auth-modal"
      modalTitle="Nutzen Sie Single Sign On um fortzufahren"
      open={!!values}
      onClose={handleCancel}
    >
      <>
        <Typography textColor="text.secondary">
          Um fortzufahren und Ihre Identität zu bestätigen, nutzen Sie Single
          Sign On.
        </Typography>
        <Stack
          direction="row"
          spacing={2}
          sx={{ marginLeft: "auto", paddingTop: 2 }}
        >
          <Button
            size="sm"
            variant="outlined"
            color="neutral"
            data-testid="ssoAuthDialogCancel"
            onClick={handleCancel}
          >
            Abbrechen
          </Button>
          <Button
            size="sm"
            color="primary"
            loadingPosition="start"
            data-testid="ssoAuthDialogStart"
            onClick={handleSSOClick}
          >
            Fortfahren
          </Button>
        </Stack>
      </>
    </BaseModal>
  );
}
