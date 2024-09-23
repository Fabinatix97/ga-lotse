/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { Add } from "@mui/icons-material";
import { Button } from "@mui/joy";

import { useSearchParam } from "@/lib/shared/hooks/searchParams/useSearchParam";

import { DetailCard } from "./DetailCard";

export function NewFacilityButton() {
  const [_open, setOpen] = useSearchParam("new-facility", "boolean");

  return (
    <DetailCard title="Einrichtung">
      <Button
        startDecorator={<Add />}
        variant="plain"
        onClick={() => setOpen(true)}
      >
        Hinzufügen
      </Button>
    </DetailCard>
  );
}
