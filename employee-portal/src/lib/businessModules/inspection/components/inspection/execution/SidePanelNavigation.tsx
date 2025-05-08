/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { DeleteOutlined } from "@mui/icons-material";
import { Button, IconButton, Stack } from "@mui/joy";
import { ReactNode } from "react";

import {
  SidePanelNav,
  getSidePanelNavItemStyles,
} from "@/lib/shared/components/sidePanel/SidePanelNav";

export type SidePanelNavigationTab = {
  label: string;
  startDecorator: ReactNode;
  tabId: string;
  ariaLabel?: string;
} & ({ type: "CHECKLIST"; isCoreChecklist: boolean } | { type: "INCIDENTS" });

export type SidePanelEvent = Pick<SidePanelNavigationTab, "type" | "tabId">;

interface SidePanelNavigationProps {
  tabs: SidePanelNavigationTab[];
  activeTabId: string;
  onActiveTabChange: (tab: SidePanelEvent) => void;
  onDeleteClick?: (tab: SidePanelEvent) => void;
  readOnly?: boolean;
}

export function SidePanelNavigation({
  tabs,
  activeTabId,
  onActiveTabChange,
  onDeleteClick,
  readOnly,
}: Readonly<SidePanelNavigationProps>) {
  const checklistIsDeletable =
    tabs.filter((tab) => tab.type === "CHECKLIST").length > 1;

  return (
    <SidePanelNav>
      {tabs.map((tab) => (
        <Stack
          key={tab.type + "-" + tab.tabId}
          direction="row"
          gap={1}
          aria-label={tab.ariaLabel}
        >
          <Button
            {...getSidePanelNavItemStyles(tab.tabId === activeTabId)}
            startDecorator={tab.startDecorator}
            sx={{ flex: 1, justifyContent: "flex-start", textAlign: "left" }}
            onClick={() => onActiveTabChange(tab)}
          >
            {tab.label}
          </Button>
          {!readOnly &&
            tab.type === "CHECKLIST" &&
            !tab.isCoreChecklist &&
            checklistIsDeletable && (
              <IconButton
                aria-label="Löschen"
                variant="plain"
                color="danger"
                onClick={onDeleteClick ? () => onDeleteClick(tab) : undefined}
              >
                <DeleteOutlined />
              </IconButton>
            )}
        </Stack>
      ))}
    </SidePanelNav>
  );
}
