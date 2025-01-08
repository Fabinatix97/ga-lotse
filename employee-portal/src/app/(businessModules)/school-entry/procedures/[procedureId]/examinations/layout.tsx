/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { ApiRequiredProcedureData } from "@eshg/employee-portal-api/schoolEntry";
import { Button, Grid, Stack } from "@mui/joy";
import { PropsWithChildren, useState } from "react";

import { SchoolEntryProcedurePageProps } from "@/app/(businessModules)/school-entry/procedures/[procedureId]/layout";
import { useSchoolEntryApi } from "@/lib/businessModules/schoolEntry/api/clients";
import { useGetProcedure } from "@/lib/businessModules/schoolEntry/api/queries/schoolEntryApi";
import { RequiredProcedureDataDialog } from "@/lib/businessModules/schoolEntry/features/procedures/examinations/RequiredProcedureDataModal";
import { useMedicalReportSidebar } from "@/lib/businessModules/schoolEntry/features/procedures/reports/MedicalReportSidebar";
import { useSchoolInfoLetterSidebar } from "@/lib/businessModules/schoolEntry/features/procedures/reports/SchoolInfoLetterSidebar";
import { routes } from "@/lib/businessModules/schoolEntry/shared/routes";
import { PageGrid } from "@/lib/shared/components/page/PageGrid";
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
  props: PropsWithChildren<SchoolEntryProcedurePageProps>,
) {
  const procedureId = props.params.procedureId;
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
                <SidePanelNavLink href={navItem.href} key={navItem.name}>
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
  const [requiredProcedureData, setRequiredProcedureData] = useState<
    ApiRequiredProcedureData[]
  >([]);
  const schoolEntryApi = useSchoolEntryApi();

  async function handleSchoolInfoLetterClick() {
    const data = await schoolEntryApi.validateCompleteness(props.procedureId);
    const invalidAreas = data.invalidAreas;
    if (invalidAreas?.length === 0) {
      schoolInfoLetterSidebar.open({ procedureId: props.procedureId });
      setRequiredProcedureData([]);
    } else {
      setRequiredProcedureData(invalidAreas);
    }
  }

  return (
    <SidePanel data-testid="reportsPanel">
      <SidePanelTitle>Berichte erstellen</SidePanelTitle>
      <Button variant="solid" onClick={handleSchoolInfoLetterClick}>
        Schulinfobrief erstellen
      </Button>
      <RequiredProcedureDataDialog
        open={requiredProcedureData.length > 0}
        onClose={() => setRequiredProcedureData([])}
        requiredProcedureData={requiredProcedureData}
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
