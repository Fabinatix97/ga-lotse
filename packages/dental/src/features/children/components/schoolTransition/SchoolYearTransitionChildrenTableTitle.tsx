/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { StopCircleOutlined, UploadOutlined } from "@mui/icons-material";
import { Divider } from "@mui/joy";
import { RowSelectionState } from "@tanstack/react-table";

import {
  RowSelectionTableToolbar,
  RowSelectionTableToolbarButton,
  mapRowSelectionToRowIds,
} from "@eshg/lib-employee-portal";

import { ChildForTransition } from "../../api/models/SchoolYearTransitionChildResult";

import { useDaycareLeavingSidebar } from "./DaycareLeavingSidebar";
import { useDaycarePromotionSidebar } from "./DaycarePromotionSidebar";

interface SchoolYearTransitionGroupsTableTitleProps {
  rowSelection: RowSelectionState;
  allChildren: ChildForTransition[];
  institutionName: string;
}

export function SchoolYearTransitionChildrenTableTitle(
  props: SchoolYearTransitionGroupsTableTitleProps,
) {
  const selectedChildren = mapRowSelectionToRowIds(props.rowSelection);
  const daycareLeavingSidebar = useDaycareLeavingSidebar();
  const daycarePromotionSidebar = useDaycarePromotionSidebar();

  function isSelectedChild(child: ChildForTransition): boolean {
    return selectedChildren.includes(child.id);
  }

  return (
    <RowSelectionTableToolbar
      rowSelection={props.rowSelection}
      elementName={{
        singular: "Kind ausgewählt",
        plural: "Kinder ausgewählt",
      }}
    >
      {selectedChildren.length > 0 && (
        <>
          <RowSelectionTableToolbarButton
            decorator={<UploadOutlined />}
            color="primary"
            onClick={() =>
              daycarePromotionSidebar.open({
                institutionName: props.institutionName,
                promotionChildren: props.allChildren.filter(isSelectedChild),
              })
            }
          >
            Bleibt in Kita
          </RowSelectionTableToolbarButton>
          <Divider orientation="vertical" sx={{ marginY: 1 }} />
          <RowSelectionTableToolbarButton
            decorator={<StopCircleOutlined />}
            color="primary"
            onClick={() =>
              daycareLeavingSidebar.open({
                institutionName: props.institutionName,
                leavingChildren: props.allChildren.filter(isSelectedChild),
              })
            }
          >
            Kita-Zeit beenden
          </RowSelectionTableToolbarButton>
        </>
      )}
    </RowSelectionTableToolbar>
  );
}
