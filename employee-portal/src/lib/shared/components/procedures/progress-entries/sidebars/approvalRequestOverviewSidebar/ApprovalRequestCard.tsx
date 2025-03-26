/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { ButtonBar } from "@eshg/lib-employee-portal";
import { ApiAbstractFile, ApiApprovalRequest } from "@eshg/lib-procedures-api";
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Sheet,
  Stack,
  Typography,
} from "@mui/joy";
import { useContext } from "react";
import { isDefined } from "remeda";

import { ProgressEntriesContext } from "@/lib/shared/components/procedures/progress-entries/ProgressEntriesContext";
import { useDecideApprovalRequest } from "@/lib/shared/components/procedures/progress-entries/mutations/approvalRequestApi";
import { FileAsApprovalRequestEntity } from "@/lib/shared/components/procedures/progress-entries/sidebars/approvalRequestOverviewSidebar/FileAsApprovalRequestEntity";
import { ProgressEntryAsApprovalRequestEntity } from "@/lib/shared/components/procedures/progress-entries/sidebars/approvalRequestOverviewSidebar/ProgressEntryAsApprovalRequestEntity";
import { fullName } from "@/lib/shared/components/users/userFormatter";

export function ApprovalRequestCard(request: ApiApprovalRequest) {
  const progressEntriesContext = useContext(ProgressEntriesContext);
  const { approvalRequestApi, approvalRequestsResponse } =
    progressEntriesContext.config;
  const decideApprovalRequest = useDecideApprovalRequest(approvalRequestApi);
  const { resolvedUsers } = approvalRequestsResponse!;

  function decideRequest(decision: string) {
    return function () {
      decideApprovalRequest.mutate({
        approvalRequestId: request.approvalRequestId,
        decision,
      });
    };
  }

  return (
    <Card
      orientation="horizontal"
      sx={{ backgroundColor: "white", "--Card-padding": "1rem" }}
      size="sm"
      data-testid="approvalRequestCard"
    >
      <CardContent>
        <Stack spacing={1}>
          <Chip color="primary" variant="soft" data-testid="entityType">
            {request.entity?.type === "ManualProgressEntry"
              ? "Verlaufseintrag"
              : "Datei"}
          </Chip>
          <Typography
            level="title-md"
            color="danger"
            data-testid="requestTitle"
          >
            Löschanfrage von {fullName(resolvedUsers[request.createdBy])}
          </Typography>
          <div data-testid="requestEntity">
            {isDefined(request.entity) &&
              (request.entity?.type === "ManualProgressEntry" ? (
                <ProgressEntryAsApprovalRequestEntity
                  approvalRequestEntity={request.entity}
                />
              ) : (
                <FileAsApprovalRequestEntity
                  approvalRequestEntity={request.entity as ApiAbstractFile}
                />
              ))}
          </div>
          <Sheet sx={{ mt: 1 }} variant="soft" color="neutral">
            <Typography level="title-sm" fontSize="0.75rem">
              Begründung
            </Typography>
            <Typography
              level="body-xs"
              whiteSpace="pre-wrap"
              data-testid="reason"
            >
              {request.reason}
            </Typography>
          </Sheet>
          <Box sx={{ mt: 2 }}>
            <ButtonBar
              left={
                <Button
                  color="neutral"
                  variant="outlined"
                  onClick={decideRequest("DENIED")}
                >
                  Ablehnen
                </Button>
              }
              right={
                <Button
                  color="danger"
                  variant="solid"
                  onClick={decideRequest("GRANTED")}
                >
                  Löschen
                </Button>
              }
            />
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}
