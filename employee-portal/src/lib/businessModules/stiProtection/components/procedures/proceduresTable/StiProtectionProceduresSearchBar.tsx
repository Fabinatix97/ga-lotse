/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { Add } from "@mui/icons-material";
import { Button } from "@mui/joy";

import { Row } from "@eshg/lib-portal/components/Row";
import { NavigationLink } from "@eshg/lib-portal/components/navigation/NavigationLink";

import { useSearchParamLink } from "@/lib/shared/hooks/searchParams/useSearchParam";

import { StiProtectionProceduresTableFilterButton } from "./StiProtectionProceduresTableFilters";

export function StiProtectionProceduresSearchBar() {
  const openNewProcedureSidebarLink = useSearchParamLink("add-procedure", true);

  return (
    <Row justifyContent="space-between">
      <StiProtectionProceduresTableFilterButton />
      <NavigationLink href={openNewProcedureSidebarLink} passHref>
        <Button startDecorator={<Add />}>Neuen Vorgang anlegen</Button>
      </NavigationLink>
    </Row>
  );
}
