/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { Button, Grid, Stack } from "@mui/joy";
import { use, useState } from "react";

import { PageGrid } from "@eshg/lib-employee-portal";
import { DynamicLayoutProps } from "@eshg/lib-portal/types/pageParams";
import { ApiRequiredProcedureArea } from "@eshg/school-entry-api";

import { useSchoolEntryApi } from "@/lib/businessModules/schoolEntry/api/clients";
import { useGetProcedure } from "@/lib/businessModules/schoolEntry/api/queries/schoolEntryApi";
import { SchoolEntryProcedureRouteParamsSchema } from "@/lib/businessModules/schoolEntry/features/procedures/SchoolEntryProcedureRouteParamsSchema";
import { IncompleteProcedureAreasModal } from "@/lib/businessModules/schoolEntry/features/procedures/examinations/IncompleteProcedureAreasModal";
import { useMedicalReportSidebar } from "@/lib/businessModules/schoolEntry/features/procedures/reports/MedicalReportSidebar";
import { useSchoolInfoLetterSidebar } from "@/lib/businessModules/schoolEntry/features/procedures/reports/SchoolInfoLetterSidebar";
import { routes } from "@/lib/businessModules/schoolEntry/shared/routes";
import { SidePanel } from "@/lib/shared/components/sidePanel/SidePanel";
import { SidePanelNav } from "@/lib/shared/components/sidePanel/SidePanelNav";
import { SidePanelNavLink } from "@/lib/shared/components/sidePanel/SidePanelNavLink";
import { SidePanelTitle } from "@/lib/shared/components/sidePanel/SidePanelTitle";

interface NavItem {
  name: string;
  href: string;
}

function buildNavItems(procedureId: string): NavItem[] {
  return [
    {
      name: "Sehscreening",
      href: routes.procedures.byId(procedureId).examinations.eye,
    },
    {
      name: "Hörscreening",
      href: routes.procedures.byId(procedureId).examinations.ear,
    },
    {
      name: "S1 - SOPESS 2019",
      href: routes.procedures.byId(procedureId).examinations.sopess,
    },
    {
      name: "S1 - Befund",
      href: routes.procedures.byId(procedureId).examinations
        .developmentScreening,
    },
  ];
}

export default function SchoolEntryExaminationLayout(
  props: DynamicLayoutProps<SchoolEntryProcedureRouteParamsSchema>,
) {
  const { procedureId } = use(props.params);
  const navItems = buildNavItems(procedureId);
  const procedureDetails = useGetProcedure(procedureId).data;

  return (
    <PageGrid>
      <Grid xs={9}>{props.children}</Grid>
      <Grid xs={3}>
        <Stack gap={3}>
          <SidePanel>
            <SidePanelTitle>Untersuchungen</SidePanelTitle>
            <SidePanelNav>
              {navItems.map((navItem) => (
                <SidePanelNavLink key={navItem.name} href={navItem.href}>
                  {navItem.name}
                </SidePanelNavLink>
              ))}
            </SidePanelNav>
          </SidePanel>
          {!procedureDetails.isClosed && (
            <CreateReportsPanel procedureId={procedureId} />
          )}
        </Stack>
      </Grid>
    </PageGrid>
  );
}

interface CreateReportsPanelProps {
  procedureId: string;
}

function CreateReportsPanel(props: CreateReportsPanelProps) {
  const medicalReportSidebar = useMedicalReportSidebar();
  const schoolInfoLetterSidebar = useSchoolInfoLetterSidebar();
  const [incompleteProcedureAreas, setIncompleteProcedureAreas] = useState<
    ApiRequiredProcedureArea[]
  >([]);
  const schoolEntryApi = useSchoolEntryApi();

  async function handleSchoolInfoLetterClick() {
    const validationResponse = await schoolEntryApi.validateCompleteness(
      props.procedureId,
    );
    const incompleteAreas = validationResponse.incompleteAreas;
    if (incompleteAreas.length === 0) {
      schoolInfoLetterSidebar.open({ procedureId: props.procedureId });
    }
    setIncompleteProcedureAreas(incompleteAreas);
  }

  return (
    <SidePanel data-testid="reportsPanel">
      <SidePanelTitle>Berichte erstellen</SidePanelTitle>
      <Button variant="solid" onClick={handleSchoolInfoLetterClick}>
        Schulinfobrief erstellen
      </Button>
      <IncompleteProcedureAreasModal
        open={incompleteProcedureAreas.length > 0}
        incompleteProcedureAreas={incompleteProcedureAreas}
        onClose={() => setIncompleteProcedureAreas([])}
      />
      <Button
        variant="outlined"
        onClick={() =>
          medicalReportSidebar.open({ procedureId: props.procedureId })
        }
      >
        Arztbrief erstellen
      </Button>
    </SidePanel>
  );
}
