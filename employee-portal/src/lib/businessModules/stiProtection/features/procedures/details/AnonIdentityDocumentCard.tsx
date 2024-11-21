/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiStiProtectionProcedure } from "@eshg/employee-portal-api/stiProtection";
import { DownloadLink } from "@eshg/lib-portal/api/files/DownloadLink";
import { Sheet, Stack } from "@mui/joy";

import { useAnonymousIdentificationDocumentQuery } from "@/lib/businessModules/stiProtection/api/queries/procedures";
import { DetailsCell } from "@/lib/shared/components/detailsSection/DetailsCell";
import { DetailsColumn } from "@/lib/shared/components/detailsSection/DetailsColumn";
import { DetailsSection } from "@/lib/shared/components/detailsSection/DetailsSection";

export function AnonIdentityDocumentCard({
  procedure,
}: Readonly<{ procedure: ApiStiProtectionProcedure }>) {
  const anonymousIdentificationDocument =
    useAnonymousIdentificationDocumentQuery(procedure.id);

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
                  downloadContainerRef={
                    anonymousIdentificationDocument.downloadContainerRef
                  }
                  onDownload={() => anonymousIdentificationDocument.download()}
                >
                  PDF auf Deutsch
                </DownloadLink>
                <DownloadLink
                  downloadContainerRef={
                    anonymousIdentificationDocument.downloadContainerRef
                  }
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
