/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Button } from "@mui/joy";
import {
  AuthDict,
  IAuthData,
  InteractiveAuth,
  MatrixClient,
} from "matrix-js-sdk";
import { useEffect, useMemo } from "react";

import { MakeRequest } from "@/lib/businessModules/chat/components/secureBackup/CreateBackupSidebar";
import { logger } from "@/lib/businessModules/chat/shared/helpers";

type RequestEmailType = (
  email: string,
  secret: string,
  attempt: number,
  session: string,
) => Promise<{ sid: string }>;

interface SSOAuthProps {
  makeRequest: MakeRequest;
  session: string;
  handleCancel: () => void;
  authData: AuthDict;
  handleSSOClick: () => void;
  matrixClient: MatrixClient;
  onFinished?: (state: boolean) => void;
}

export function SSOAuth({
  makeRequest,
  session,
  handleCancel,
  authData,
  handleSSOClick,
  matrixClient,
  onFinished,
}: Readonly<SSOAuthProps>) {
  const authLogic = useMemo(() => {
    return new InteractiveAuth({
      matrixClient: matrixClient,
      doRequest: makeRequest,
      sessionId: session,
      authData: authData as IAuthData,
      busyChanged(busy) {
        logger.debug({ busy });
      },
      stateUpdated(nextStage, status) {
        logger.debug({ nextStage, status });
      },
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      requestEmailToken: (() => {}) as unknown as RequestEmailType,
    });
  }, [authData, makeRequest, matrixClient, session]);

  useEffect(() => {
    if (!authLogic) return;
    const pollInterval = setInterval(() => {
      void authLogic?.poll();
    }, 2000);

    return () => {
      clearInterval(pollInterval);
    };
  }, [authLogic]);

  useEffect(() => {
    void (async () => {
      if (authLogic) {
        try {
          logger.debug("AttemptAuth Start");
          const res = await authLogic.attemptAuth();
          logger.debug("AttemptAuth Done", res);
          onFinished?.(true);
        } catch (e) {
          logger.error("AttemptAuth Error", e);
        }
      }
    })();
  }, [authLogic, onFinished]);

  return (
    <>
      <Button
        size="sm"
        variant="outlined"
        color="neutral"
        onClick={handleCancel}
        data-testid="ssoAuthDialogCancel"
      >
        Abbrechen
      </Button>
      <Button
        size="sm"
        color={"primary"}
        loadingPosition={"start"}
        onClick={handleSSOClick}
        data-testid="ssoAuthDialogStart"
      >
        Fortfahren
      </Button>
    </>
  );
}
