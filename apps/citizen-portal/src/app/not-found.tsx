/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Typography } from "@mui/joy";

import { AppLayout } from "@/lib/baseModule/components/layout/AppLayout";

export default function NotFound() {
  return (
    <AppLayout lang="de">
      <h1>Seite nicht gefunden.</h1>
      <Typography>
        Leider konnten wir die gesuchte Seite für Sie nicht finden.
      </Typography>
    </AppLayout>
  );
}
