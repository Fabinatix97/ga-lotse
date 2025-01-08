/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiAffectedPerson } from "@eshg/employee-portal-api/measlesProtection";
import { formatDate } from "@eshg/lib-portal/formatters/dateTime";
import { formatPersonName } from "@eshg/lib-portal/formatters/person";

import {
  TabNavigationHeader,
  TabNavigationHeaderTypography,
} from "@/lib/shared/components/tabNavigationToolbar/TabNavigationHeader";

export function MeaslesProtectionTabHeader({
  person: affectedPerson,
}: {
  person: ApiAffectedPerson;
}) {
  const name = formatPersonName(affectedPerson);
  const birthday = "geb. " + formatDate(affectedPerson.dateOfBirth);

  return (
    <TabNavigationHeader titleAsH1>
      <TabNavigationHeaderTypography>{name}</TabNavigationHeaderTypography>
      <TabNavigationHeaderTypography>{birthday}</TabNavigationHeaderTypography>
    </TabNavigationHeader>
  );
}
