/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { Add } from "@mui/icons-material";
import { Button, Sheet } from "@mui/joy";

import { DetailsSection } from "@/lib/shared/components/detailsSection/DetailsSection";
import { useSearchParam } from "@/lib/shared/hooks/searchParams/useSearchParam";

export function NewFacilityButton() {
  const [_open, setOpen] = useSearchParam("new-facility", "boolean");

  return (
    <Sheet>
      <DetailsSection title="Einrichtung">
        <div>
          <Button
            startDecorator={<Add />}
            variant="plain"
            onClick={() => setOpen(true)}
          >
            Hinzufügen
          </Button>
        </div>
      </DetailsSection>
    </Sheet>
  );
}
