/**
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiInformationStatementSummary } from "@eshg/travel-medicine-api";

import { AppointmentDetailsInformationStatement } from "@/lib/businessModules/travelMedicine/components/viewAppointment/AppointmentDetailsInformationStatement";

interface AppointmentDetailsInformationStatementListProps {
  informationStatementSummaries: ApiInformationStatementSummary[];
}
export function AppointmentDetailsInformationStatementList(
  props: Readonly<AppointmentDetailsInformationStatementListProps>,
) {
  return (
    <>
      {props.informationStatementSummaries.map((infoStatement) => (
        <AppointmentDetailsInformationStatement
          key={infoStatement.id}
          summary={infoStatement}
        />
      ))}
    </>
  );
}
