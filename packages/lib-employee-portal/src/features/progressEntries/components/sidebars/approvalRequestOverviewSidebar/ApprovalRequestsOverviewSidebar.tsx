/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

"use client";

import { Button, Stack } from "@mui/joy";

import { ButtonBar } from "../../../../../components/buttons/ButtonBar";
import { Sidebar } from "../../../../drawer/components/Sidebar";
import { SidebarActions } from "../../../../drawer/components/SidebarActions";
import { SidebarContent } from "../../../../drawer/components/SidebarContent";
import { useGrantDeletionForAllRequests } from "../../../api/mutations/approvalRequest";
import { useProgressEntriesContext } from "../../../contexts/progressEntries";

import { ApprovalRequestCard } from "./ApprovalRequestCard";

interface ApprovalRequestOverviewProps {
  open: boolean;
  onClose: () => void;
}

export function ApprovalRequestsOverviewSidebar({
  open,
  onClose,
}: ApprovalRequestOverviewProps) {
  const progressEntriesContext = useProgressEntriesContext();
  const { approvalRequestApi, approvalRequestsResponse } =
    progressEntriesContext.config;
  const grantDeletionForAll =
    useGrantDeletionForAllRequests(approvalRequestApi);
  const { approvalRequests } = approvalRequestsResponse!;

  function deleteAll() {
    grantDeletionForAll.mutate(approvalRequests);
  }

  return (
    <Sidebar open={open} onClose={onClose}>
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
            <Button color="neutral" variant="soft" onClick={onClose}>
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
    </Sidebar>
  );
}
