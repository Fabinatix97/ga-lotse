/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Chip, Sheet, styled } from "@mui/joy";

import { DetailsItem, DetailsSection } from "@eshg/lib-employee-portal";
import { DetailsColumn, DetailsList } from "@eshg/lib-portal";
import { ApiStiProtectionProcedure } from "@eshg/sti-protection-api";

import { CONCERN_VALUES } from "@/lib/businessModules/stiProtection/shared/constants";

const dateFormatter = new Intl.DateTimeFormat("de-DE", { dateStyle: "medium" });
const timeFormatter = new Intl.DateTimeFormat("de-DE", { timeStyle: "short" });

export function formatAppointmentTime(date?: Date) {
  if (date === undefined) {
    return "-";
  }
  return `${dateFormatter.format(date)}, ${timeFormatter.format(date)} Uhr`;
}

export function AdditionalDataSection({
  procedure,
}: Readonly<{
  procedure: ApiStiProtectionProcedure;
}>) {
  return (
    <Sheet>
      <DetailsSection title="Zusatzinfos">
        <DetailsList>
          <DetailsColumn>
            {procedure.isFollowUp ? <FollowUpProcedureChip /> : null}
            <DetailsItem
              label="Art"
              value={CONCERN_VALUES[procedure.concern]}
            />
            <DetailsItem
              label="Nächster Termin"
              value={formatAppointmentTime(procedure?.appointment?.start)}
            />
          </DetailsColumn>
        </DetailsList>
      </DetailsSection>
    </Sheet>
  );
}

const FollowUpChip = styled(Chip)(({ theme }) => ({
  backgroundColor: theme.palette.primary.softBg,
  color: theme.palette.text.primary,
}));

function FollowUpProcedureChip() {
  return <FollowUpChip>Folgevorgang</FollowUpChip>;
}
