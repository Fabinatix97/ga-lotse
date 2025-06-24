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
  const promoteChildrenInBulk = usePromoteChildrenInBulk();

  async function handlePromotionDaycare() {
    await promoteChildrenInBulk.mutateAsync(
      {
        childIds: promotionChildren.map(getEntityId),
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
          info="Folgende Kinder bleiben in der Kita"
          infoColor="primary"
          rows={promotionChildren}
        />
      </SidebarContent>
      <SidebarActions>
        <ButtonBar
          right={
            <>
              <Button color="neutral" variant="soft" onClick={() => onClose()}>
                Abbrechen
              </Button>
              <Button onClick={handlePromotionDaycare}>Durchführen</Button>
            </>
          }
        />
      </SidebarActions>
    </>
  );
}
