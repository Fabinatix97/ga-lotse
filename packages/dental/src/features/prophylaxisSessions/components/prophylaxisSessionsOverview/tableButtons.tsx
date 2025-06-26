/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Add } from "@mui/icons-material";
import { Button } from "@mui/joy";

import { useCreateProphylaxisSessionSidebar } from "./CreateProphylaxisSessionSidebar";

export function CreateProphylaxisSessionButton() {
  const createProphylaxisSessionSidebar = useCreateProphylaxisSessionSidebar();

  return (
    <Button
      startDecorator={<Add />}
      onClick={createProphylaxisSessionSidebar.open}
    >
      Maßnahme planen
    </Button>
  );
}
