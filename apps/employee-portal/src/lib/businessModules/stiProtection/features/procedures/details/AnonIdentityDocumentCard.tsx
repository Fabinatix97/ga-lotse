/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Sheet, Stack } from "@mui/joy";
import { isDefined } from "remeda";

import { DetailsItem, DetailsSection } from "@eshg/lib-employee-portal";
import { ButtonLink, DetailsColumn, DetailsList } from "@eshg/lib-portal";
import { ApiStiProtectionProcedure } from "@eshg/sti-protection-api";

import { useAnonymousIdentificationDocumentQuery } from "@/lib/businessModules/stiProtection/api/queries/procedures";
import { DisplayAccessCode } from "@/lib/businessModules/stiProtection/features/procedures/DisplayAccessCode";

export function AnonIdentityDocumentCard({
  procedure,
}: Readonly<{
  procedure: ApiStiProtectionProcedure;
}>) {
  const anonymousIdentificationDocument =
    useAnonymousIdentificationDocumentQuery(procedure.id);
  const hasAppointment = isDefined(procedure.appointment);

  return (
    <Sheet>
      <DetailsSection title="Dokument zur anonymen Identifizierung">
        <DetailsList>
          <DetailsColumn>
            <DetailsItem
              label="Anmeldecode"
              value={
                <DisplayAccessCode code={procedure.person.accessCode} bold />
              }
            />
            {hasAppointment ? (
              <DetailsItem
                label="Identifizierungs-Dokument als PDF"
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
            ) : (
              <DetailsItem
                label="Identifizierungs-Dokument als PDF"
                value="Zum Download des Dokuments ist ein aktueller Termin erforderlich."
              />
            )}
          </DetailsColumn>
        </DetailsList>
      </DetailsSection>
    </Sheet>
  );
}
