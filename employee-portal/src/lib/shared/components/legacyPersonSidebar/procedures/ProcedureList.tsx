/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { Button, Stack, Typography } from "@mui/joy";

import { SidebarActions, SidebarContent } from "@eshg/lib-employee-portal";

import { ProcedureCard } from "@/lib/shared/components/cards/ProcedureCard";
import { ProcedureLiteItem } from "@/lib/shared/components/legacyPersonSidebar/LegacyPersonSidebar";

interface PersonSearchResultsProps {
  procedures: ProcedureLiteItem[];
  personName: string;
  onContinue: () => void;
  onCancel: () => void;
}

export function ProcedureList(props: PersonSearchResultsProps) {
  return (
    <>
      <SidebarContent title={`Vorgänge zu ${props.personName}`}>
        <Typography sx={{ marginBottom: 1 }}>
          Es sind bereits Vorgänge zu der gesuchten Person vorhanden.
        </Typography>
        {props.procedures.map((procedure, idx) => (
          <ProcedureCard key={idx} procedure={procedure}></ProcedureCard>
        ))}
      </SidebarContent>

      <SidebarActions>
        <Stack direction="row" gap={2} sx={{ justifyContent: "end" }}>
          <Button
            onClick={props.onCancel}
            color="neutral"
            variant="soft"
            sx={{ alignSelf: "end" }}
          >
            Abbrechen
          </Button>
          <Button onClick={props.onContinue} color="primary" variant="solid">
            Weiter
          </Button>
        </Stack>
      </SidebarActions>
    </>
  );
}
