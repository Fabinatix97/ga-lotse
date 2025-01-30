/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

"use client";

import { Button, Stack } from "@mui/joy";
import { useContext } from "react";

import { ButtonBar } from "@/lib/shared/components/buttons/ButtonBar";
import { ProgressEntriesContext } from "@/lib/shared/components/procedures/progress-entries/ProgressEntriesContext";
import { useGrantDeletionForAllRequests } from "@/lib/shared/components/procedures/progress-entries/mutations/approvalRequestApi";
import { ApprovalRequestCard } from "@/lib/shared/components/procedures/progress-entries/sidebars/approvalRequestOverviewSidebar/ApprovalRequestCard";
import { Sidebar } from "@/lib/shared/components/sidebar/Sidebar";
import { SidebarActions } from "@/lib/shared/components/sidebar/SidebarActions";
import { SidebarContent } from "@/lib/shared/components/sidebar/SidebarContent";

interface ApprovalRequestOverviewProps {
  open: boolean;
  onClose: () => void;
}

export function ApprovalRequestsOverviewSidebar({
  open,
  onClose,
}: ApprovalRequestOverviewProps) {
  const progressEntriesContext = useContext(ProgressEntriesContext);
  const { approvalRequestApi, approvalRequestsResponse } =
    progressEntriesContext.config;
  const grantDeletionForAll =
    useGrantDeletionForAllRequests(approvalRequestApi);
  const { approvalRequests } = approvalRequestsResponse!;

  function deleteAll() {
    grantDeletionForAll.mutate(approvalRequests);
  }

  return (
    <>
      <Sidebar open={open} onClose={onClose}>
        <SidebarContent title={`Löschanfragen (${approvalRequests.length})`}>
          <Stack spacing={1}>
            {approvalRequests.map((approvalRequest) => (
              <ApprovalRequestCard
                data-testid="approvalRequestCard"
                key={approvalRequest.approvalRequestId}
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
    </>
  );
}
