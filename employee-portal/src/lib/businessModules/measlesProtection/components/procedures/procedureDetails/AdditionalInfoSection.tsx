/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  ApiMeaslesProtectionProcedure,
  ApiReportingReason,
} from "@eshg/employee-portal-api/measlesProtection";
import { useSnackbar } from "@eshg/lib-portal/components/snackbar/SnackbarProvider";
import { formatDate } from "@eshg/lib-portal/formatters/dateTime";
import { EditOutlined } from "@mui/icons-material";
import { Button, IconButton, Sheet, Stack } from "@mui/joy";
import { useState } from "react";

import { useCloseProcedure } from "@/lib/businessModules/measlesProtection/api/mutations/statusTransitionApi";
import {
  reportingReasonNames,
  roleStatusNames,
} from "@/lib/businessModules/measlesProtection/components/procedures/constants";
import { ReopenProcedureModal } from "@/lib/businessModules/measlesProtection/components/procedures/proceduresTable/ReopenProcedureModal";
import { useProceduresContext } from "@/lib/businessModules/measlesProtection/shared/ProceduresContext";
import { ConfirmationDialog } from "@/lib/shared/components/confirmationDialog/ConfirmationDialog";
import { useSearchParam } from "@/lib/shared/hooks/searchParams/useSearchParam";

import { AdditionalInfoUpdateSidebar } from "./AdditionalInfoUpdateSidebar";
import { DetailCard } from "./DetailCard";
import { LabeledValue, ValueList } from "./LabeledValue";
import { CLOSE_PROCEDURE_SUCCESS_MESSAGE } from "./helpers";

type AdditionalInfoSectionProps = Readonly<{
  procedure: ApiMeaslesProtectionProcedure;
}>;

export function AdditionalInfoSection({
  procedure,
}: AdditionalInfoSectionProps) {
  const snackbar = useSnackbar();
  const proceduresContext = useProceduresContext();
  const { openProcedureReopenModal } = proceduresContext.action;
  const [isRequestingFinalize, setIsRequestingFinalize] = useState(false);
  const closeProcedure = useCloseProcedure({
    onSuccess: () => {
      snackbar.confirmation(CLOSE_PROCEDURE_SUCCESS_MESSAGE);
    },
  });
  const [_isEditOpen, setEditOpen] = useSearchParam("edit-info", "boolean");

  function handleFinalizeProcedure() {
    setIsRequestingFinalize(false);
    const procedureId = procedure.id;
    closeProcedure.mutate({ procedureId });
  }

  function handleReopenProcedure() {
    const { id, affectedPerson } = procedure;
    openProcedureReopenModal({ id, affectedPerson });
  }

  const editAction = procedure.isOpen ? (
    <IconButton
      color="primary"
      variant="outlined"
      onClick={() => setEditOpen(true)}
      aria-label={"Zusatzinfos bearbeiten"}
    >
      <EditOutlined />
    </IconButton>
  ) : undefined;

  return (
    <Stack rowGap={2}>
      <DetailCard title={"Zusatzinfos"} actionButton={editAction}>
        <ValueList>
          <LabeledValue
            label="Personenstatus"
            value={
              procedure.affectedPerson.roleStatus
                ? roleStatusNames[procedure.affectedPerson.roleStatus]
                : "-"
            }
          />
          <LabeledValue
            label="Meldedatum"
            value={formatDate(procedure.reportData?.reportingDate)}
          />
          <LabeledValue
            label="Meldegrund"
            value={
              procedure.reportData?.reportingReason
                ? reportingReasonNames[procedure.reportData?.reportingReason]
                : "-"
            }
          />
          {procedure.reportData?.reportingReason == ApiReportingReason.Other ? (
            <LabeledValue
              label="Kommentar zum Meldegrund"
              value={procedure.reportData?.commentReportingReason}
            />
          ) : null}
        </ValueList>
      </DetailCard>
      <Sheet component="section">
        {!procedure.isOpen ? (
          <Button color="danger" onClick={handleReopenProcedure} fullWidth>
            Vorgang wiedereröffnen
          </Button>
        ) : (
          <Button
            onClick={() => setIsRequestingFinalize(true)}
            disabled={closeProcedure.isPending}
            loading={closeProcedure.isPending}
            fullWidth
          >
            Vorgang abschließen
          </Button>
        )}
      </Sheet>
      <ConfirmationDialog
        title={"Vorgang abschließen?"}
        description={"Möchten Sie diesen Vorgang wirklich abschließen?"}
        confirmLabel={"Abschließen"}
        color="primary"
        open={isRequestingFinalize}
        onClose={() => setIsRequestingFinalize(false)}
        onConfirm={handleFinalizeProcedure}
      />
      <AdditionalInfoUpdateSidebar
        isOpen={_isEditOpen}
        onClose={() => setEditOpen(false)}
        procedure={procedure}
      />
      <ReopenProcedureModal />
    </Stack>
  );
}
