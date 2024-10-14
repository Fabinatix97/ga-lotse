/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ErrorAlert } from "@eshg/lib-portal/errorHandling/ErrorAlert";
import { PropsWithChildren } from "react";

import { useChatClientContext } from "@/lib/businessModules/chat/shared/ChatClientProvider";
import { ClientState } from "@/lib/businessModules/chat/shared/enums";

export function ChatErrorBoundary({ children }: PropsWithChildren) {
  const { clientState, setClientState } = useChatClientContext();

  if (clientState === ClientState.Error) {
    return (
      <ErrorAlert
        error={"Chat Error"}
        onReset={() => {
          setClientState(ClientState.Restart);
        }}
      />
    );
  }
  return children;
}
