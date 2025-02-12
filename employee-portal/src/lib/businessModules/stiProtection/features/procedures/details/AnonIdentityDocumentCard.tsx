/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ButtonLink } from "@eshg/lib-portal/components/buttons/ButtonLink";
import { ApiStiProtectionProcedure } from "@eshg/sti-protection-api";
import { Sheet, Stack } from "@mui/joy";

import { useAnonymousIdentificationDocumentQuery } from "@/lib/businessModules/stiProtection/api/queries/procedures";
import { DisplayAccessCode } from "@/lib/businessModules/stiProtection/features/procedures/DisplayAccessCode";
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
          <DetailsCell
            label="Anmeldecode"
            valueIsDiv
            value={
              <DisplayAccessCode code={procedure.person.accessCode} bold />
            }
          />
          <DetailsCell
            label="Identifizierungs-Dokument als PDF"
            valueIsDiv
            value={
              <Stack direction="row" gap={1}>
                <ButtonLink
                  onClick={() => anonymousIdentificationDocument.download()}
                >
                  PDF herunterladen
                </ButtonLink>
              </Stack>
            }
          />
        </DetailsColumn>
      </DetailsSection>
    </Sheet>
  );
}
