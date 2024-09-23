/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Button } from "@mui/joy";

import { ContentPanel } from "@/lib/shared/components/contentPanel/ContentPanel";

export function CloseProcedurePanel() {
  return (
    <ContentPanel>
      <Button>Vorgang abschließen</Button>
    </ContentPanel>
  );
}
