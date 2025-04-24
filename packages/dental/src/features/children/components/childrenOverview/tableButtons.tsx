/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { InternalLinkButton } from "@eshg/lib-portal/components/navigation/InternalLinkButton";
import { Add, Cached, PublishedWithChanges } from "@mui/icons-material";
import { Button } from "@mui/joy";

import { routes } from "@/config/routes";
import { useCreateChildSidebar } from "@/features/children/components/createChild/CreateChildSidebar";
import { useImportChildrenSidebar } from "@/features/children/components/import/ImportChildrenSidebar";

export function ImportChildrenButton() {
  const importChildrenSidebar = useImportChildrenSidebar();

  return (
    <Button
      size="sm"
      variant="outlined"
      startDecorator={<Cached />}
      onClick={importChildrenSidebar.open}
    >
      Daten importieren
    </Button>
  );
}

export function CreateChildButton() {
  const createChildSidebar = useCreateChildSidebar();

  return (
    <Button
      size="sm"
      startDecorator={<Add />}
      onClick={createChildSidebar.open}
    >
      Neues Kind anlegen
    </Button>
  );
}

export function SchoolYearTransitionButton() {
  return (
    <InternalLinkButton
      size="sm"
      variant="outlined"
      startDecorator={<PublishedWithChanges />}
      href={routes.children.schoolYearTransition.schools}
    >
      Schuljahreswechsel
    </InternalLinkButton>
  );
}
