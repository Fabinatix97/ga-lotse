/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { DownloadLink } from "@eshg/lib-portal/api/files/DownloadLink";
import { Sheet, Stack } from "@mui/joy";
import { useRef } from "react";

import { DetailsCell } from "@/lib/shared/components/detailsSection/DetailsCell";
import { DetailsColumn } from "@/lib/shared/components/detailsSection/DetailsColumn";
import { DetailsSection } from "@/lib/shared/components/detailsSection/DetailsSection";

export function AnonIdentityDocumentCard() {
  const downloadContainerRef = useRef<HTMLDivElement>(null);

  return (
    <Sheet>
      <DetailsSection title="Dokument zur anonymen Identifizierung">
        <DetailsColumn>
          <DetailsCell label="Anmeldecode" value="ABCDEFG1234567890" />
          <DetailsCell
            label="Identifizierungs-Dokument als PDF"
            valueIsDiv
            value={
              <Stack direction="row" gap={1}>
                <DownloadLink
                  downloadContainerRef={downloadContainerRef}
                  onDownload={() => Promise.resolve()}
                >
                  PDF auf Deutsch
                </DownloadLink>
                <DownloadLink
                  downloadContainerRef={downloadContainerRef}
                  onDownload={() => Promise.resolve()}
                >
                  PDF auf Englisch
                </DownloadLink>
              </Stack>
            }
          />
        </DetailsColumn>
      </DetailsSection>
    </Sheet>
  );
}
