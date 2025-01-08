/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiStiProtectionProcedure } from "@eshg/employee-portal-api/stiProtection";
import { Sheet } from "@mui/joy";

import { CONCERN_VALUES } from "@/lib/businessModules/stiProtection/shared/constants";
import { DetailsCell } from "@/lib/shared/components/detailsSection/DetailsCell";
import { DetailsColumn } from "@/lib/shared/components/detailsSection/DetailsColumn";
import { DetailsSection } from "@/lib/shared/components/detailsSection/DetailsSection";

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
