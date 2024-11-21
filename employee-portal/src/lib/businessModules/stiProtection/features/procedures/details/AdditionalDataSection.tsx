/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiStiProtectionProcedure } from "@eshg/employee-portal-api/stiProtection";
import { Sheet } from "@mui/joy";

import { CONCERN_VALUES } from "@/lib/businessModules/stiProtection/shared/constants";
import { createOnlyIfProcedureOpen } from "@/lib/businessModules/stiProtection/shared/helpers";
import { EditButton } from "@/lib/shared/components/buttons/EditButton";
import { DetailsCell } from "@/lib/shared/components/detailsSection/DetailsCell";
import { DetailsColumn } from "@/lib/shared/components/detailsSection/DetailsColumn";
import { DetailsSection } from "@/lib/shared/components/detailsSection/DetailsSection";

const dateFormater = new Intl.DateTimeFormat("de-DE", { dateStyle: "medium" });
const timeFormater = new Intl.DateTimeFormat("de-DE", { timeStyle: "short" });
function formatAppointmentTime(date?: Date) {
  if (date == null) {
    return "-";
  }
  return `${dateFormater.format(date)}, ${timeFormater.format(date)} Uhr`;
}

export function AdditionalDataSection({
  procedure,
}: Readonly<{ procedure: ApiStiProtectionProcedure }>) {
  const onlyIfOpen = createOnlyIfProcedureOpen(procedure);
  return (
    <Sheet>
      <DetailsSection
        title="Zusatzinfos"
        buttons={onlyIfOpen(<EditButton aria-label="Zusatzinfos bearbeiten" />)}
      >
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
