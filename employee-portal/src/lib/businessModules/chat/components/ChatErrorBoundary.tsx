/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ErrorAlert } from "@eshg/lib-portal/errorHandling/ErrorAlert";
import { useRouter } from "next/navigation";
import { PropsWithChildren } from "react";

import { useChatClientContext } from "@/lib/businessModules/chat/shared/ChatClientProvider";
import { ClientState } from "@/lib/businessModules/chat/shared/enums";
import { logger } from "@/lib/businessModules/chat/shared/helpers";

export function ChatErrorBoundary({ children }: PropsWithChildren) {
  const { refresh } = useRouter();
  const { clientState, setClientState } = useChatClientContext();

  if (clientState === ClientState.Error) {
    return (
      <ErrorAlert
        error={"Chat Error"}
        onReset={() => {
          try {
            refresh();
            setClientState(ClientState.HardReset);
          } catch (error) {
            logger.error("Chat reset error", error);
          }
        }}
      />
    );
  }
  return children;
}
