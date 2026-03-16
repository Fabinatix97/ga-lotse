/**
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { Button, Sheet } from "@mui/joy";
import { useState } from "react";

import { ApiInspection } from "@eshg/inspection-api";

import { useCloseProcedure } from "@/lib/businessModules/inspection/api/mutations/inspection";

import { CloseProcedureSidebar } from "./CloseProcedureSidebar";

interface CloseProcedureTileProps {
  inspection: ApiInspection;
}

export function CloseProcedureTile({
  inspection,
}: Readonly<CloseProcedureTileProps>) {
  const closeProcedure = useCloseProcedure(inspection.externalId);

  const [closeProcedureSidebar, setCloseProcedureSidebar] = useState(false);

  async function handleClick(note: string) {
    setCloseProcedureSidebar(false);
    await closeProcedure.mutateAsync({
      note: note,
    });
  }

  return (
    <Sheet
      sx={{
        borderRadius: "lg",
        padding: 3,
        flex: 1,
        display: "flex",
        justifyContent: "center",
      }}
    >
      <>
        <CloseProcedureSidebar
          open={closeProcedureSidebar}
          handleClick={handleClick}
          onClose={() => setCloseProcedureSidebar(false)}
        />
        <Button
          color="danger"
          variant="solid"
          sx={{
            flex: 1,
          }}
          onClick={() => setCloseProcedureSidebar(true)}
        >
          Vorgang mit Vermerk schließen
        </Button>
      </>
    </Sheet>
  );
}
