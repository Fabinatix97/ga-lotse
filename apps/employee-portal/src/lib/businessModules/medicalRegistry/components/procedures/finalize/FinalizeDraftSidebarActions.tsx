/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Button } from "@mui/joy";

import { ButtonBar, SidebarActions } from "@eshg/lib-employee-portal";
import { SubmitButton } from "@eshg/lib-portal";

interface FinalizeDraftSidebarActionsProps {
  isSubmitting?: boolean;
  isInitialStep?: boolean;
  onBackButtonClick: () => void;
}
export function FinalizeDraftSidebarActions({
  isSubmitting,
  isInitialStep,
  onBackButtonClick,
}: FinalizeDraftSidebarActionsProps) {
  return (
    <SidebarActions>
      <ButtonBar
        left={
          <Button
            variant="plain"
            color="primary"
            disabled={isSubmitting}
            onClick={onBackButtonClick}
          >
            {isInitialStep ? "Abbrechen" : "Zurück"}
          </Button>
        }
        right={
          <SubmitButton
            submitting={isSubmitting ?? false}
            sx={{ minWidth: "fit-content" }}
          >
            Weiter
          </SubmitButton>
        }
      />
    </SidebarActions>
  );
}
