/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  PersonSearchForm,
  PersonSearchFormValues,
  usePersonSearchFromURL,
} from "@eshg/lib-employee-portal";

export function ProstituteProtectionPersonSearch({
  onChange,
}: {
  onChange: (v: PersonSearchFormValues) => void;
}) {
  const personSearch = usePersonSearchFromURL();
  return (
    <PersonSearchForm
      {...personSearch.formProps}
      onChange={(v) => {
        personSearch.setValues(v);
        onChange(v);
      }}
    />
  );
}
