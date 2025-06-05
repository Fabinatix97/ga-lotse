/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Typography } from "@mui/joy";

import { PageContent } from "@/lib/shared/components/layout/PageContent";
import { PageLayout } from "@/lib/shared/components/layout/page";

export default function NotFound() {
  return (
    <PageLayout>
      <PageContent>
        <h1>Seite nicht gefunden.</h1>
        <Typography>
          Leider konnten wir die gesuchte Seite für Sie nicht finden.
        </Typography>
      </PageContent>
    </PageLayout>
  );
}
