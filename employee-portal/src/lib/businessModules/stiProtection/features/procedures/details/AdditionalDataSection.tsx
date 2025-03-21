/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { DetailsColumn, DetailsSection } from "@eshg/lib-employee-portal";
import { ApiStiProtectionProcedure } from "@eshg/sti-protection-api";
import { Chip, Sheet, styled } from "@mui/joy";

import { CONCERN_VALUES } from "@/lib/businessModules/stiProtection/shared/constants";
import { DetailsCell } from "@/lib/shared/components/detailsSection/DetailsCell";

const dateFormatter = new Intl.DateTimeFormat("de-DE", { dateStyle: "medium" });
const timeFormatter = new Intl.DateTimeFormat("de-DE", { timeStyle: "short" });
export function formatAppointmentTime(date?: Date) {
  if (date == null) {
    return "-";
  }
  return `${dateFormatter.format(date)}, ${timeFormatter.format(date)} Uhr`;
}

export function AdditionalDataSection({
  procedure,
}: Readonly<{ procedure: ApiStiProtectionProcedure }>) {
  return (
    <Sheet>
      <DetailsSection title="Zusatzinfos">
        <DetailsColumn>
          {procedure.isFollowUp ? <FollowUpProcedureChip /> : null}
          <DetailsCell label="Art" value={CONCERN_VALUES[procedure.concern]} />
          <DetailsCell
            label="Nächster Termin"
            value={formatAppointmentTime(procedure?.appointment?.start)}
            showIfEmpty
          />
        </DetailsColumn>
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
