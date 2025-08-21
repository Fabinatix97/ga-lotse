/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useTranslation } from "@/lib/i18n/client";
import { useGetDepartmentInfo } from "@/lib/shared/api/queries/department";
import { ContactAndAvailabilitySheet } from "@/lib/shared/components/ContactAndAvailabilitySheet";

export function ContactInformation() {
  const { t } = useTranslation(["contact"]);
  const { data: department } = useGetDepartmentInfo();

  return (
    <ContactAndAvailabilitySheet
      openingHoursSectionProps={{
        information: t("contact.opening_hours_section.information"),
      }}
      departmentInfo={department}
      internetLabel={t("contact.internetSection.healthDepartment")}
    />
  );
}
