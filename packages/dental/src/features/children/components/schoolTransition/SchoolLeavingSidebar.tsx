/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Typography } from "@mui/joy";
import Button from "@mui/joy/Button";

import {
  ButtonBar,
  DrawerProps,
  SidebarActions,
  SidebarContent,
  UseSidebarResult,
  useSidebar,
} from "@eshg/lib-employee-portal";

import { useCloseGroupsInBulk } from "../../api/mutations/schoolYearTransition";

import { SchoolYearTransitionGroupList } from "./SchoolYearTransitionGroupList";

export function useSchoolLeavingSidebar(): UseSidebarResult<SchoolLeavingSidebarProps> {
  return useSidebar({
    component: SchoolLeavingSidebar,
  });
}

interface SchoolLeavingSidebarProps extends DrawerProps {
  institutionId: string;
  institutionName: string;
  leavingGroupNames: string[];
}

function SchoolLeavingSidebar({
  institutionId,
  institutionName,
  leavingGroupNames,
  onClose,
}: SchoolLeavingSidebarProps) {
  const closeGroupsInBulk = useCloseGroupsInBulk();

  async function handleLeavingSchool() {
    await closeGroupsInBulk.mutateAsync(
      {
        institutionId: institutionId,
        groupNames: leavingGroupNames.filter((groupName) => groupName !== ""),
        includeChildrenWithoutGroup: leavingGroupNames.includes(""),
      },
      {
        onSuccess: () => onClose(),
      },
    );
  }
  return (
    <>
      <SidebarContent title="Schuljahreswechsel">
        <SchoolYearTransitionGroupList
          institutionName={institutionName}
          info="Folgende Gruppen verlassen die Schule und wechseln in den Status abgeschlossen"
          infoColor="success"
          rows={leavingGroupNames}
          targetGroupComponent={() => (
            <Typography fontWeight={600}>Schulabgang</Typography>
          )}
        />
      </SidebarContent>
      <SidebarActions>
        <ButtonBar
          right={
            <>
              <Button color="neutral" variant="soft" onClick={() => onClose()}>
                Abbrechen
              </Button>
              <Button onClick={handleLeavingSchool}>
                Schulabgang durchführen
              </Button>
            </>
          }
        />
      </SidebarActions>
    </>
  );
}
