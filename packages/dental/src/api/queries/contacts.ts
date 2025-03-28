/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiContactSortKey } from "@eshg/base-api";
import { useSearchContactsQuery } from "@eshg/lib-employee-portal";
import { useDebounce } from "use-debounce";

import { SCHOOL_OR_DAYCARE_CONTACT } from "@/config/contacts";

export function useSearchSchoolOrDaycareContactQuery(institutionName: string) {
  const [debouncedInstitutionName] = useDebounce(
    institutionName,
    institutionName === "" ? 0 : 250,
    {
      trailing: true,
    },
  );

  return useSearchContactsQuery(
    {
      name: debouncedInstitutionName,
      categories: SCHOOL_OR_DAYCARE_CONTACT,
      sortKey: ApiContactSortKey.Relevance,
    },
    { enabled: debouncedInstitutionName.length >= 1 },
  );
}
