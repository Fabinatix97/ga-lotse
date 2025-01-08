/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { RequiresChildren } from "@eshg/lib-portal/types/react";
import { createContext, useContext, useMemo, useState } from "react";
import { isNullish } from "remeda";

import { InfoPanelView } from "@/lib/businessModules/chat/shared/enums";

interface InfoPanelState {
  isOpen: boolean;
  view?: InfoPanelView;
  payload?: string;
}

export interface InfoPanelContextType {
  infoPanelState: InfoPanelState;
  setInfoPanelView: (view: InfoPanelView, payload?: string) => void;
  closeInfoPanel: () => void;
}

export const InfoPanelContext = createContext<InfoPanelContextType | null>(
  null,
);

export function InfoPanelProvider({ children }: RequiresChildren) {
  const [infoPanel, setInfoPanel] = useState<InfoPanelState>({
    isOpen: false,
  });

  const contextValues = useMemo<InfoPanelContextType>(
    () => ({
      infoPanelState: infoPanel,
      setInfoPanelView: (view: InfoPanelView, payload?: string) =>
        setInfoPanel({
          isOpen: true,
          view,
          payload,
        }),
      closeInfoPanel: () => setInfoPanel({ isOpen: false }),
    }),
    [infoPanel],
  );

  return (
    <InfoPanelContext.Provider value={contextValues}>
      {children}
    </InfoPanelContext.Provider>
  );
}

export function useInfoPanelContext() {
  const context = useContext(InfoPanelContext);
  if (isNullish(context)) {
    throw new Error("useInfoPanelContext was called outside InfoPanelProvider");
  }
  return context;
}
