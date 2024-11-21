/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiInformationStatementSummary } from "@eshg/citizen-portal-api/travelMedicine";

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
