/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { EditOutlined } from "@mui/icons-material";
import { Button, IconButton, Sheet, Stack } from "@mui/joy";
import { useState } from "react";

import {
  ConfirmationDialog,
  DetailsItem,
  useSearchParam,
} from "@eshg/lib-employee-portal";
import { DetailsList, formatDate, useSnackbar } from "@eshg/lib-portal";
import {
  ApiMeaslesProtectionProcedure,
  ApiReportingReason,
} from "@eshg/measles-protection-api";

import { useCloseProcedure } from "@/lib/businessModules/measlesProtection/api/mutations/statusTransitionApi";
import {
  reportingReasonNames,
  roleStatusNames,
} from "@/lib/businessModules/measlesProtection/components/procedures/constants";
import { ReopenProcedureModal } from "@/lib/businessModules/measlesProtection/components/procedures/proceduresTable/ReopenProcedureModal";
import { useProceduresContext } from "@/lib/businessModules/measlesProtection/shared/ProceduresContext";
import { InfoTile } from "@/lib/shared/components/infoTile/InfoTile";

import { AdditionalInfoUpdateSidebar } from "./AdditionalInfoUpdateSidebar";
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
      aria-label="Zusatzinfos bearbeiten"
      onClick={() => setEditOpen(true)}
    >
      <EditOutlined />
    </IconButton>
  ) : undefined;

  return (
    <Stack rowGap={2}>
      <InfoTile title="Zusatzinfos" name="additionalInfo" controls={editAction}>
        <DetailsList>
          <Stack gap={1}>
            <DetailsItem
              label="Personenstatus"
              value={
                procedure.affectedPerson.roleStatus
                  ? roleStatusNames[procedure.affectedPerson.roleStatus]
                  : "-"
              }
            />
            <DetailsItem
              label="Meldedatum"
              value={formatDate(procedure.reportData?.reportingDate)}
            />
            <DetailsItem
              label="Meldegrund"
              value={
                procedure.reportData?.reportingReason
                  ? reportingReasonNames[procedure.reportData?.reportingReason]
                  : "-"
              }
            />
            {procedure.reportData?.reportingReason ===
            ApiReportingReason.Other ? (
              <DetailsItem
                label="Kommentar zum Meldegrund"
                value={procedure.reportData?.commentReportingReason}
              />
            ) : null}
          </Stack>
        </DetailsList>
      </InfoTile>
      <Sheet component="section">
        {!procedure.isOpen ? (
          <Button color="danger" fullWidth onClick={handleReopenProcedure}>
            Vorgang wiedereröffnen
          </Button>
        ) : (
          <Button
            disabled={closeProcedure.isPending}
            loading={closeProcedure.isPending}
            fullWidth
            onClick={() => setIsRequestingFinalize(true)}
          >
            Vorgang abschließen
          </Button>
        )}
      </Sheet>
      <ConfirmationDialog
        title="Vorgang abschließen?"
        description="Möchten Sie diesen Vorgang wirklich abschließen?"
        confirmLabel="Abschließen"
        color="primary"
        open={isRequestingFinalize}
        onClose={() => setIsRequestingFinalize(false)}
        onConfirm={handleFinalizeProcedure}
      />
      <AdditionalInfoUpdateSidebar
        isOpen={_isEditOpen}
        procedure={procedure}
        onClose={() => setEditOpen(false)}
      />
      <ReopenProcedureModal />
    </Stack>
  );
}
