/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Button } from "@mui/joy";
import { isDefined } from "remeda";

import {
  ButtonBar,
  DrawerProps,
  SidebarActions,
  SidebarContent,
  UpdateResultSummary,
  UseSidebarResult,
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
  const { mutateAsync, data, isSuccess } = useCloseChildrenInBulk();

  async function handleLeavingDaycare() {
    await mutateAsync({
      childIdsAndVersion: Object.fromEntries(
        leavingChildren.map((child) => [child.id, child.version]),
      ),
    });
  }

  return (
    <>
      <SidebarContent title="Schuljahreswechsel">
        {isSuccess && isDefined(data) ? (
          <UpdateResultSummary
            items={[
              {
                type: "success",
                value: `${data.numUpdated} erfolgreich geändert`,
              },
              {
                type: "error",
                value: `${data.numError} fehlgeschlagen`,
              },
            ]}
          />
        ) : (
          <SchoolYearTransitionChildrenList
            institutionName={institutionName}
            info="Folgende Kinder verlassen die Kita und wechseln in den Status abgeschlossen"
            infoColor="success"
            rows={leavingChildren}
          />
        )}
      </SidebarContent>
      <SidebarActions>
        {isSuccess && isDefined(data) ? (
          <ButtonBar
            right={<Button onClick={() => onClose()}>Fertig</Button>}
          />
        ) : (
          <ButtonBar
            right={
              <>
                <Button
                  color="neutral"
                  variant="soft"
                  onClick={() => onClose()}
                >
                  Abbrechen
                </Button>
                <Button onClick={handleLeavingDaycare}>
                  Kita-Zeit beenden
                </Button>
              </>
            }
          />
        )}
      </SidebarActions>
    </>
  );
}
