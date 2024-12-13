/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiGetProcedureDraftResponse } from "@eshg/employee-portal-api/medicalRegistry";
import { Button, Card, Stack, Typography } from "@mui/joy";
import { useId } from "react";

import { ContactData } from "@/lib/businessModules/medicalRegistry/components/procedures/details/ContactData";
import { ButtonBar } from "@/lib/shared/components/buttons/ButtonBar";
import { DrawerProps } from "@/lib/shared/components/drawer/drawerContext";
import { useSidebar } from "@/lib/shared/components/drawer/useSidebar";
import { SidebarActions } from "@/lib/shared/components/sidebar/SidebarActions";
import { SidebarContent } from "@/lib/shared/components/sidebar/SidebarContent";

interface PartialEntryErrorSidebarProps extends DrawerProps {
  procedure: ApiGetProcedureDraftResponse;
}

export function usePartialEntryErrorSidebar() {
  return useSidebar({ component: PartialEntryErrorSidebar });
}

function PartialEntryErrorSidebar({
  procedure,
  onClose,
}: PartialEntryErrorSidebarProps) {
  const { applicant } = procedure;
  const titleId = useId();

  return (
    <>
      <SidebarContent title="Eintrag anlegen nicht möglich">
        <Stack spacing={5}>
          <Stack spacing={2}>
            <Typography level="body-md">
              Der Datensatz ist für die Anlage eines Eintrags unzureichend.
            </Typography>
            <Typography level="body-md">
              Bitte kontaktieren Sie den/die Antragsteller:in, um ein weiteres
              Prozedere abzuklären.
            </Typography>
          </Stack>

          <Card
            variant="soft"
            component="section"
            aria-labelledby={titleId}
            sx={{ gap: 2 }}
          >
            <Typography level="title-md" id={titleId}>
              Kontaktdaten Antragsteller:in
            </Typography>
            <ContactData subject={applicant} />
          </Card>
        </Stack>
      </SidebarContent>
      <SidebarActions>
        <ButtonBar
          right={<Button onClick={() => onClose(true)}>Schließen</Button>}
        />
      </SidebarActions>
    </>
  );
}
