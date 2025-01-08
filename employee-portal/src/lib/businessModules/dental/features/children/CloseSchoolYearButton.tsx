/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { PublishedWithChanges } from "@mui/icons-material";
import { Button } from "@mui/joy";
import { useState } from "react";

import { useCloseSchoolYear } from "@/lib/businessModules/dental/api/mutations/childApi";
import { BUTTON_SIZE } from "@/lib/businessModules/schoolEntry/features/procedures/new/constants";
import { EmployeePortalConfirmationDialog } from "@/lib/shared/components/confirmationDialog/EmployeePortalConfirmationDialog";

export function CloseSchoolYearButton() {
  const [isInConfirmation, setInConfirmation] = useState(false);
  const closeSchoolYear = useCloseSchoolYear();

  function openConfirmation() {
    setInConfirmation(true);
  }

  async function confirm() {
    try {
      await closeSchoolYear.mutateAsync();
    } finally {
      closeConfirmation();
    }
  }

  function closeConfirmation() {
    setInConfirmation(false);
  }

  return (
    <>
      <Button
        size={BUTTON_SIZE}
        onClick={openConfirmation}
        variant="outlined"
        startDecorator={<PublishedWithChanges />}
      >
        Schuljahr abschließen
      </Button>
      <EmployeePortalConfirmationDialog
        title="Schuljahr abschließen?"
        description="Soll das aktuelle Schuljahr abgeschlossen werden?"
        confirmLabel="Abschließen"
        onConfirm={confirm}
        onClose={closeConfirmation}
        open={isInConfirmation}
      />
    </>
  );
}
