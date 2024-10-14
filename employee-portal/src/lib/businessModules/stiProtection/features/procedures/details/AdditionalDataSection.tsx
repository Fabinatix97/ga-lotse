/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiStiProtectionProcedure } from "@eshg/employee-portal-api/stiProtection";

import { CONCERN_VALUES } from "@/lib/businessModules/stiProtection/shared/constants";
import { EditButton } from "@/lib/shared/components/buttons/EditButton";
import { ContentPanel } from "@/lib/shared/components/contentPanel/ContentPanel";
import { DetailsCell } from "@/lib/shared/components/detailsSection/DetailsCell";
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
  return (
    <ContentPanel>
      <DetailsSection
        name="additionalData"
        title="Zusatzinfos"
        buttons={<EditButton aria-label="Zusatzinfos bearbeiten" />}
      >
        <DetailsCell
          name="type"
          label="Art"
          value={CONCERN_VALUES[procedure.concern]}
        />
        <DetailsCell
          name="nextAppointment"
          label="Nächster Termin"
          value={formatAppointmentTime(procedure?.appointment?.start)}
        />
      </DetailsSection>
    </ContentPanel>
  );
}
