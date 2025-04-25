/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import {
  AutorenewOutlined,
  Checklist as ChecklistIcon,
} from "@mui/icons-material";
import { Grid } from "@mui/joy";
import { useQueryClient, useSuspenseQueries } from "@tanstack/react-query";
import { useCallback, useEffect, useState } from "react";

import {
  ApiChecklist,
  ApiInspection,
  ApiInspectionPhase,
  ApiUpdateInspectionRequest,
} from "@eshg/inspection-api";
import { useConfirmationDialog } from "@eshg/lib-employee-portal";

import { useUserApi } from "@/lib/baseModule/api/clients";
import {
  useChecklistApi,
  useIncidentApi,
  useInspectionApi,
} from "@/lib/businessModules/inspection/api/clients";
import { useUpdateInspection } from "@/lib/businessModules/inspection/api/mutations/inspection";
import { getChecklistsQuery } from "@/lib/businessModules/inspection/api/queries/checklist";
import { getIncidentsQuery } from "@/lib/businessModules/inspection/api/queries/incidents";
import {
  getAvailableCLDVsQuery,
  inspectionGettersQueryKey,
} from "@/lib/businessModules/inspection/api/queries/inspection";
import { getSelfUserQuery } from "@/lib/businessModules/inspection/api/queries/users";
import { ExecutionSidePanel } from "@/lib/businessModules/inspection/components/inspection/execution/ExecutionSidePanel";
import {
  SidePanelEvent,
  SidePanelNavigationTab,
} from "@/lib/businessModules/inspection/components/inspection/execution/SidePanelNavigation";
import { Checklist } from "@/lib/businessModules/inspection/components/inspection/execution/checklist/Checklist";
import { ChecklistValidationProvider } from "@/lib/businessModules/inspection/components/inspection/execution/checklist/ChecklistValidateContext";
import { IncidentsPanel } from "@/lib/businessModules/inspection/components/inspection/execution/incident/IncidentsPanel";
import { ChecklistSelectSidebar } from "@/lib/businessModules/inspection/components/inspection/planning/checklist/ChecklistSelectSidebar";
import { inspectionIsBeforePhase } from "@/lib/businessModules/inspection/shared/enums";

export type InspectionExecutionTabType = "CHECKLIST" | "INCIDENTS";

type ActiveTabState = ({ tab: "CHECKLIST" } | { tab: "INCIDENTS" }) & {
  tabId: string;
  fallbackTabId: string; // in case tabId can not be found when tabs change, try a fallback to this id
};

type Tab = (
  | {
      checklist: ApiChecklist;
      type: "CHECKLIST";
      SidePanelProps: { type: "CHECKLIST" };
    }
  | {
      type: "INCIDENTS";
      SidePanelProps: { type: "INCIDENTS" };
    }
) & {
  fallbackTabId: string;
  SidePanelProps: SidePanelNavigationTab;
};

type Tabs = Record<string, Tab>;

type TabsList = Tab[];

export function InspectionTabExecution({
  inspection,
}: Readonly<{
  inspection: ApiInspection;
}>) {
  const queryClient = useQueryClient();

  const checklistApi = useChecklistApi();
  const inspectionApi = useInspectionApi();
  const incidentApi = useIncidentApi();
  const userApi = useUserApi();

  const inspectionId = inspection.externalId;

  const [{ data: checklists }, { data: incidents }, { data: selfUser }] =
    useSuspenseQueries({
      queries: [
        getChecklistsQuery(checklistApi, inspectionId),
        getIncidentsQuery(incidentApi, inspectionId),
        getSelfUserQuery(userApi),
        getAvailableCLDVsQuery(inspectionApi, inspectionId),
      ],
    });
  const { mutateAsync: updateInspection } = useUpdateInspection();
  const { openCancelDialog } = useConfirmationDialog();
  const currentSelectedNonCoreVersions =
    getCurrentSelectedNonCoreVersions(checklists);
  const { tabs, tabsList } = createTabs(checklists);
  const hasChecklists = checklists.length > 0;

  const lockedByDifferentUser =
    inspection.lockedByUser !== undefined &&
    selfUser.userId !== inspection.lockedByUser.userId;

  const readOnly =
    lockedByDifferentUser ||
    !inspectionIsBeforePhase(inspection.phase, ApiInspectionPhase.Executed);

  const [tabState, setTabState] = useState<ActiveTabState>(() => ({
    tab: hasChecklists ? "CHECKLIST" : "INCIDENTS",
    tabId: tabsList[0]!.SidePanelProps.tabId,
    fallbackTabId: tabsList[0]!.fallbackTabId,
  }));

  const [checklistSidebar, setChecklistSidebar] = useState(false);

  async function handleChecklistDelete(checklistVersionId: string) {
    const request: ApiUpdateInspectionRequest = {
      checklistDefinitionVersionIds: currentSelectedNonCoreVersions
        .filter((v) => v.versionId !== checklistVersionId)
        .map((v) => v.versionId),
    };

    if (tabState.fallbackTabId === checklistVersionId) {
      const currentIndex = tabsList.findIndex(
        (tab) => tab.SidePanelProps.tabId === tabState.tabId,
      );
      if (currentIndex === 0) {
        handleActiveTabChange(tabsList[1]!.SidePanelProps);
      } else {
        handleActiveTabChange(tabsList[currentIndex - 1]!.SidePanelProps);
      }
    }

    await updateInspection({
      id: inspectionId,
      apiUpdateInspectionRequest: request,
    });
  }

  async function handleAddClick() {
    // before opening the sidebar we must clear the query cache for inspection
    // and available CLDVs, because they could have changed from the outside.
    await queryClient.invalidateQueries({
      queryKey: inspectionGettersQueryKey(inspectionId),
    });
    setChecklistSidebar(true);
  }

  function handleDeleteClick(tab: SidePanelEvent) {
    if (tab.type === "CHECKLIST") {
      openCancelDialog({
        onConfirm: async () => {
          const clTab = tabs[tab.tabId];
          if (clTab && clTab.type === "CHECKLIST") {
            await handleChecklistDelete(clTab.checklist.context.id);
          }
        },
        title: "Checkliste löschen",
        description:
          "Möchten Sie diese Checkliste wirklich löschen? Ihre Änderungen in dieser Checkliste sowie alle assoziierten Vorkommnisse gehen hierbei verloren.",
      });
    }
  }

  const handleActiveTabChange = useCallback(
    (tab: SidePanelEvent) => {
      if (tab.tabId === tabState.tabId) {
        return;
      }
      if (tab.type === "CHECKLIST") {
        const clTab = tabs[tab.tabId];
        if (clTab && clTab.type === "CHECKLIST") {
          setTabState({
            tab: "CHECKLIST",
            tabId: clTab.checklist.id,
            fallbackTabId: clTab.checklist.context.id,
          });
        }
      } else if (tab.type === "INCIDENTS") {
        setTabState({
          tab: "INCIDENTS",
          fallbackTabId: "incidents",
          tabId: tab.tabId,
        });
      }
    },
    [tabState.tabId, tabs],
  );

  // when checklists/tabs are reloaded, we need to reset the active tab
  useEffect(() => {
    if (tabs[tabState.tabId] === undefined) {
      const fallbackTab = tabsList.find(
        (tab) => tab.fallbackTabId === tabState.fallbackTabId,
      );
      if (fallbackTab !== undefined) {
        handleActiveTabChange(fallbackTab.SidePanelProps);
      } else {
        handleActiveTabChange(tabsList[0]!.SidePanelProps);
      }
    }
  }, [
    handleActiveTabChange,
    tabState.fallbackTabId,
    tabState.tabId,
    tabs,
    tabsList,
  ]);

  return (
    <ChecklistValidationProvider>
      <Grid
        container
        spacing={2}
        sx={{
          overflow: { xxs: "auto", lg: "hidden" },
          flexDirection: { xxs: undefined, lg: "row" },
        }}
      >
        <Grid
          xxs={12}
          lg={8}
          sx={{
            overflow: { xxs: undefined, lg: "hidden" },
            display: { xxs: undefined, lg: "flex" },
            flexGrow: { xxs: undefined, lg: 1 },
            order: { xxs: 1, lg: 0 },
            maxHeight: "100%",
          }}
        >
          {tabState.tab === "CHECKLIST" && (
            <Checklist
              checklist={checklists.find((c) => c.id === tabState.tabId)}
              inspectionExternalId={inspectionId}
              readOnly={readOnly}
            />
          )}
          {tabState.tab === "INCIDENTS" && (
            <IncidentsPanel
              procedureId={inspectionId}
              incidents={incidents}
              readOnly={readOnly}
            />
          )}
        </Grid>
        <Grid
          xxs={12}
          lg={4}
          sx={{
            order: { xxs: 0, lg: 1 },
            maxHeight: { xxs: undefined, lg: "100%" },
            display: "flex",
            flexDirection: "column",
          }}
        >
          <ExecutionSidePanel
            tabs={tabsList.map((tab) => tab.SidePanelProps)}
            activeTabId={tabState.tabId}
            inspection={inspection}
            checklists={checklists}
            onActiveTabChange={handleActiveTabChange}
            onAddButtonClick={handleAddClick}
            onDeleteClick={handleDeleteClick}
            readOnly={readOnly}
          />
        </Grid>

        {checklistSidebar && (
          <ChecklistSelectSidebar
            open
            withCoreVersions={false}
            inspectionExternalId={inspectionId}
            currentSelectedNonCoreVersions={currentSelectedNonCoreVersions}
            onClose={() => setChecklistSidebar(false)}
          />
        )}
      </Grid>
    </ChecklistValidationProvider>
  );
}

function createTabs(checklists: ApiChecklist[]): {
  tabs: Tabs;
  tabsList: TabsList;
} {
  let tabsList: TabsList = checklists.map((checklist, index) => ({
    type: "CHECKLIST",
    checklist: checklist,
    fallbackTabId: checklist.context.id,
    SidePanelProps: {
      tabId: checklist.id,
      label: `${index + 1}. ${checklist.context.name}`,
      ariaLabel: `${checklist.context.name}`,
      startDecorator: <ChecklistIcon />,
      type: "CHECKLIST",
      isCoreChecklist: checklist.coreChecklist,
    },
  }));
  tabsList = tabsList.concat([
    {
      fallbackTabId: "incidents",
      type: "INCIDENTS",
      SidePanelProps: {
        type: "INCIDENTS",
        tabId: "incidents",
        label: "Vorkommnisse",
        startDecorator: <AutorenewOutlined />,
      },
    },
  ]);
  const tabs: Tabs = tabsList.reduce((acc: Tabs, curr: Tab) => {
    acc[curr.SidePanelProps.tabId] = curr;
    return acc;
  }, {});
  return {
    tabsList,
    tabs,
  };
}

function getCurrentSelectedNonCoreVersions(checklists: ApiChecklist[]) {
  return checklists
    .filter((cl) => !cl.coreChecklist)
    .map(({ context }) => ({
      ...context,
      definitionId: context.defId,
      isCoreChecklist: false,
      isExpandable: true,
      versionId: context.id,
    }));
}
