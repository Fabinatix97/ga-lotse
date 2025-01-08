/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import {
  ApiChecklist,
  ApiInspection,
  ApiInspectionPhase,
} from "@eshg/employee-portal-api/inspection";
import { scrollToFirstFormError } from "@eshg/lib-portal/components/form/FormPlus";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/EditOutlined";
import { Button, Divider, IconButton, Stack } from "@mui/joy";
import { useState } from "react";

import { AppointmentSidebar } from "@/lib/businessModules/inspection/components/inspection/common/appointment/AppointmentSidebar";
import { getFormattedAppointmentParts } from "@/lib/businessModules/inspection/components/inspection/common/appointment/appointmentUtils";
import { FinalizeInspectionModal } from "@/lib/businessModules/inspection/components/inspection/execution/FinalizeInspectionModal";
import { InspectionExecutionTabType } from "@/lib/businessModules/inspection/components/inspection/execution/InspectionTabExecution";
import {
  SidePanelEvent,
  SidePanelNavigation,
  SidePanelNavigationTab,
} from "@/lib/businessModules/inspection/components/inspection/execution/SidePanelNavigation";
import { useChecklistValidateContext } from "@/lib/businessModules/inspection/components/inspection/execution/checklist/ChecklistValidateContext";
import { DetailsCell } from "@/lib/shared/components/detailsSection/DetailsCell";
import { SidePanel } from "@/lib/shared/components/sidePanel/SidePanel";
import { SidePanelTitle } from "@/lib/shared/components/sidePanel/SidePanelTitle";
import { UserLink } from "@/lib/shared/components/users/UserLink";
import { useConfirmationDialog } from "@/lib/shared/hooks/useConfirmationDialog";
import { useIsOffline } from "@/lib/shared/hooks/useIsOffline";

interface ExecutionSidePanelProps {
  tabs: SidePanelNavigationTab[];
  activeTabId: string;
  inspection: ApiInspection;
  checklists: ApiChecklist[];
  onActiveTabChange: (tab: SidePanelEvent) => void;
  onDeleteClick?: (tab: SidePanelEvent) => void;
  onAddButtonClick: () => void;
  readOnly: boolean;
}

export function ExecutionSidePanel({
  tabs,
  activeTabId,
  inspection,
  onActiveTabChange,
  onDeleteClick,
  onAddButtonClick,
  checklists,
  readOnly,
}: Readonly<ExecutionSidePanelProps>) {
  const [approvalSidebarOpen, setApprovalSidebarOpen] = useState(false);
  const [approveModalOpen, setApproveModalOpen] = useState(false);

  const { dateAndTime: plannedDateAndTime } = getFormattedAppointmentParts(
    inspection?.plannedAppointment,
  );
  const { dateAndTime: executedDateAndTime } = getFormattedAppointmentParts(
    inspection?.executedAppointment,
  );

  const { validateAllVisibleForms, validateAllModelValues } =
    useChecklistValidateContext();
  const { openConfirmationDialog } = useConfirmationDialog();

  const isOffline = useIsOffline();

  function showInvalidPhaseDialog() {
    openConfirmationDialog({
      title: "Falsche Phase",
      description:
        "Bitte erfassen Sie Änderungen bevor Sie die Begehung abschließen.",
      confirmLabel: "Verstanden",
      hideCancelButton: true,
      color: "danger",
      onConfirm: () => undefined,
    });
  }

  function showInvalidFieldsDialog() {
    openConfirmationDialog({
      title: "Unvollständige Eingaben",
      description: "Bitte füllen Sie erst alle Pflichtfelder aus.",
      confirmLabel: "Verstanden",
      hideCancelButton: true,
      color: "danger",
      onConfirm: () => undefined,
    });
  }

  /**
   * This is the handler for the button "Begehung abschließen". Note that we
   * allow clicking this button even in offline mode, so that all validations
   * are performed, but instead of opening the approval modal we will show a
   * hint that for real approval/submission you'll have to enter online mode
   * again.
   */
  async function handleApprove() {
    // Zeroth Step: Make sure the inspection is in the phase EXECUTING
    if (inspection.phase !== ApiInspectionPhase.Executing) {
      showInvalidPhaseDialog();
      return;
    }

    // First step: validate all fields of current displayed checklist
    // This check is made on the current form values.
    const error = await validateAllVisibleForms();
    if (error) {
      scrollToFirstFormError();
      showInvalidFieldsDialog();
      return;
    }

    // Second step: validate all other not visible checklists of currently
    // inactive tabs. This check is made on the model.
    const firstInvalidChecklistId = validateAllModelValues(checklists);
    if (firstInvalidChecklistId !== null) {
      // show the first invalid checklist tab
      onActiveTabChange({
        type: InspectionExecutionTabType.CHECKLIST,
        tabId: firstInvalidChecklistId,
      });
      showInvalidFieldsDialog();
      return;
    }

    // Everything is valid. Open the approval dialog.
    setApproveModalOpen(true);
  }

  return (
    <SidePanel>
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <SidePanelTitle component="h2">Aufgaben</SidePanelTitle>
        {!readOnly && !isOffline && (
          <IconButton
            aria-label="Checkliste hinzufügen"
            variant="outlined"
            color="primary"
            onClick={onAddButtonClick}
          >
            <AddIcon />
          </IconButton>
        )}
      </Stack>
      <Divider sx={{ marginY: 1 }} />
      <SidePanelNavigation
        tabs={tabs}
        activeTabId={activeTabId}
        onActiveTabChange={onActiveTabChange}
        onDeleteClick={onDeleteClick}
        readOnly={readOnly || isOffline}
      />

      <Divider sx={{ marginY: 1 }} />

      <DetailsCell
        name="user"
        label={"Durchführung durch"}
        value={
          inspection?.executedAppointment?.assignedTo && (
            <UserLink user={inspection?.executedAppointment?.assignedTo} />
          )
        }
        showIfEmpty
      />

      <DetailsCell
        name="date"
        label="Geplanter Termin"
        value={plannedDateAndTime}
      />
      <DetailsCell
        name="date"
        label="Tatsächlicher Begehungstermin"
        value={executedDateAndTime}
      >
        {!readOnly && (
          <IconButton
            aria-label={`Termin ändern`}
            color="primary"
            onClick={() => setApprovalSidebarOpen(true)}
            sx={{ p: 0, ml: 1, minHeight: 0 }}
          >
            <EditIcon />
          </IconButton>
        )}
      </DetailsCell>

      {!readOnly && (
        <>
          <Divider sx={{ mb: 1, mt: 1 }} />
          <Button onClick={handleApprove}>Begehung abschließen</Button>
        </>
      )}

      {inspection.phase === ApiInspectionPhase.Executed && (
        <>
          <Divider sx={{ mb: 1, mt: 1 }} />
          <DetailsCell
            name="phase-executed"
            label="Begehung abgeschlossen"
            value="Die Begehung ist abgeschlossen. Sie sind noch offline. Die eingegebenen Daten wurden gespeichert und werden übertragen, sobald Sie wieder online sind."
          />
        </>
      )}

      {approvalSidebarOpen && (
        <AppointmentSidebar
          open={true}
          onClose={() => setApprovalSidebarOpen(false)}
          procedureId={inspection.externalId}
          appointment={inspection.executedAppointment}
          forExecution={true}
        />
      )}

      {approveModalOpen && (
        <FinalizeInspectionModal
          open={true}
          onClose={() => setApproveModalOpen(false)}
          inspectionId={inspection.externalId}
        />
      )}
    </SidePanel>
  );
}
