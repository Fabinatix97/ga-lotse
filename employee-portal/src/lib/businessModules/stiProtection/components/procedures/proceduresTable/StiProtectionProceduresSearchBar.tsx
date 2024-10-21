/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { Row } from "@eshg/lib-portal/components/Row";
import { NavigationLink } from "@eshg/lib-portal/components/navigation/NavigationLink";
import { Add } from "@mui/icons-material";
import { Button } from "@mui/joy";

import { FilterButton } from "@/lib/shared/components/buttons/FilterButton";
import { useSearchParamLink } from "@/lib/shared/hooks/searchParams/useSearchParam";

export function StiProtectionProceduresSearchBar() {
  const openNewProcedureSidebarLink = useSearchParamLink("add-procedure", true);

  return (
    <Row justifyContent="space-between">
      <FilterButton isFilterVisible={false} activeFilters={0} disabled />

      <NavigationLink href={openNewProcedureSidebarLink} passHref>
        <Button startDecorator={<Add />}>Neuen Vorgang anlegen</Button>
      </NavigationLink>
    </Row>
  );
}
