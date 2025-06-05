/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

"use client";

import { Button, Stack } from "@mui/joy";

import { ButtonBar } from "../../../../../components/buttons/ButtonBar";
import { SidebarActions } from "../../../../drawer/components/SidebarActions";
import { SidebarContent } from "../../../../drawer/components/SidebarContent";
import {
  UseSidebarResult,
  useSidebar,
} from "../../../../drawer/hooks/useSidebar";
import { DrawerProps } from "../../../../drawer/types/drawer";
import { useGrantDeletionForAllRequests } from "../../../api/mutations/approvalRequest";
import { useProgressEntriesConfig } from "../../../contexts/progressEntries";

import { ApprovalRequestCard } from "./ApprovalRequestCard";

export function useApprovalRequestsOverviewSidebar(): UseSidebarResult {
  return useSidebar({
    component: ApprovalRequestsOverviewSidebar,
  });
}

function ApprovalRequestsOverviewSidebar(props: DrawerProps) {
  const { approvalRequestApi, approvalRequestsResponse } =
    useProgressEntriesConfig();
  const grantDeletionForAll =
    useGrantDeletionForAllRequests(approvalRequestApi);
  const { approvalRequests } = approvalRequestsResponse!;

  function deleteAll() {
    grantDeletionForAll.mutate(approvalRequests);
  }

  return (
    <>
      <SidebarContent title={`Löschanfragen (${approvalRequests.length})`}>
        <Stack spacing={1}>
          {approvalRequests.map((approvalRequest) => (
            <ApprovalRequestCard
              key={approvalRequest.approvalRequestId}
              data-testid="approvalRequestCard"
              {...approvalRequest}
            />
          ))}
        </Stack>
      </SidebarContent>
      <SidebarActions>
        <ButtonBar
          left={
            <Button
              color="neutral"
              variant="soft"
              onClick={() => props.onClose()}
            >
              Schließen
            </Button>
          }
          right={
            <Button color="danger" variant="solid" onClick={deleteAll}>
              Alle löschen
            </Button>
          }
        />
      </SidebarActions>
    </>
  );
}
