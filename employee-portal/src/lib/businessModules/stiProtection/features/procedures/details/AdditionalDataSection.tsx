/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiStiProtectionProcedure } from "@eshg/employee-portal-api/stiProtection";

import { CONCERN_VALUES } from "@/lib/businessModules/stiProtection/shared/constants";
import { createOnlyIfProcedureOpen } from "@/lib/businessModules/stiProtection/shared/helpers";
import { EditButton } from "@/lib/shared/components/buttons/EditButton";
import { DetailsCard } from "@/lib/shared/components/detailsCard/DetailsCard";
import {
  LabeledValue,
  ValueList,
} from "@/lib/shared/components/detailsCard/LabeledValue";

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
    <DetailsCard
      title="Zusatzinfos"
      actionButton={onlyIfOpen(
        <EditButton aria-label="Zusatzinfos bearbeiten" />,
      )}
    >
      <ValueList>
        <LabeledValue label="Art" value={CONCERN_VALUES[procedure.concern]} />
        <LabeledValue
          label="Nächster Termin"
          value={formatAppointmentTime(procedure?.appointment?.start)}
        />
      </ValueList>
    </DetailsCard>
  );
}
