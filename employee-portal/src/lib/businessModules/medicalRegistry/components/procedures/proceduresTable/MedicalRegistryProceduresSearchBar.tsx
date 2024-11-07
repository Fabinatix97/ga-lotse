/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { Row } from "@eshg/lib-portal/components/Row";
import { NavigationLink } from "@eshg/lib-portal/components/navigation/NavigationLink";
import { Add } from "@mui/icons-material";
import { Button } from "@mui/joy";

import { useSearchParamLink } from "@/lib/shared/hooks/searchParams/useSearchParam";

export function MedicalRegistryProceduresSearchBar() {
  const openNewProcedureSidebarLink = useSearchParamLink("add-procedure", true);

  return (
    <Row justifyContent="flex-end">
      <NavigationLink href={openNewProcedureSidebarLink} passHref>
        <Button startDecorator={<Add />}>Eintrag erstellen</Button>
      </NavigationLink>
    </Row>
  );
}
