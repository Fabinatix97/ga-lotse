/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import Button from "@mui/joy/Button";

import {
  ButtonBar,
  DrawerProps,
  SidebarActions,
  SidebarContent,
  UseSidebarResult,
  getEntityId,
  useSidebar,
} from "@eshg/lib-employee-portal";

import { ChildForTransition } from "../../api/models/SchoolYearTransitionChildResult";
import { useCloseChildrenInBulk } from "../../api/mutations/schoolYearTransition";

import { SchoolYearTransitionChildrenList } from "./SchoolYearTransitionChildrenList";

export function useDaycareLeavingSidebar(): UseSidebarResult<DaycareLeavingSidebarProps> {
  return useSidebar({
    component: DaycareLeavingSidebar,
  });
}

interface DaycareLeavingSidebarProps extends DrawerProps {
  institutionName: string;
  leavingChildren: ChildForTransition[];
}

function DaycareLeavingSidebar({
  institutionName,
  leavingChildren,
  onClose,
}: DaycareLeavingSidebarProps) {
  const closeChildrenInBulk = useCloseChildrenInBulk();

  async function handleLeavingDaycare() {
    await closeChildrenInBulk.mutateAsync(
      {
        childIds: leavingChildren.map(getEntityId),
      },
      {
        onSuccess: () => onClose(),
      },
    );
  }
  return (
    <>
      <SidebarContent title="Schuljahreswechsel">
        <SchoolYearTransitionChildrenList
          institutionName={institutionName}
          info="Folgende Kinder verlassen die Kita und wechseln in den Status abgeschlossen"
          infoColor="success"
          rows={leavingChildren}
        />
      </SidebarContent>
      <SidebarActions>
        <ButtonBar
          right={
            <>
              <Button color="neutral" variant="soft" onClick={() => onClose()}>
                Abbrechen
              </Button>
              <Button onClick={handleLeavingDaycare}>Kita-Zeit beenden</Button>
            </>
          }
        />
      </SidebarActions>
    </>
  );
}
