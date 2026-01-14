/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import Button from "@mui/joy/Button";
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
import { usePromoteChildrenInBulk } from "../../api/mutations/schoolYearTransition";

import { SchoolYearTransitionChildrenList } from "./SchoolYearTransitionChildrenList";

export function useDaycarePromotionSidebar(): UseSidebarResult<DaycarePromotionSidebarProps> {
  return useSidebar({
    component: DaycarePromotionSidebar,
  });
}

interface DaycarePromotionSidebarProps extends DrawerProps {
  institutionName: string;
  promotionChildren: ChildForTransition[];
}

function DaycarePromotionSidebar({
  institutionName,
  promotionChildren,
  onClose,
}: DaycarePromotionSidebarProps) {
  const { mutateAsync, data, isSuccess } = usePromoteChildrenInBulk();

  async function handlePromotionDaycare() {
    await mutateAsync({
      childIdsAndVersion: Object.fromEntries(
        promotionChildren.map((child) => [child.id, child.version]),
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
            info="Folgende Kinder bleiben in der Kita"
            infoColor="primary"
            rows={promotionChildren}
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
                <Button onClick={handlePromotionDaycare}>Durchführen</Button>
              </>
            }
          />
        )}
      </SidebarActions>
    </>
  );
}
