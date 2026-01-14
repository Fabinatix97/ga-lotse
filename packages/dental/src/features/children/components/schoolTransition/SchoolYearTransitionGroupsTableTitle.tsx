/**
 * Copyright 2026 cronn GmbH
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

import { useCloseGroupsInBulk } from "../../api/mutations/schoolYearTransition";

import { useSchoolLeavingSidebar } from "./SchoolLeavingSidebar";
import { useSchoolPromotionSidebar } from "./SchoolPromotionSidebar";

interface SchoolYearTransitionGroupsTableTitleProps {
  rowSelection: RowSelectionState;
  institutionId: string;
  institutionName: string;
}

export function SchoolYearTransitionGroupsTableTitle(
  props: SchoolYearTransitionGroupsTableTitleProps,
) {
  const selectedGroups = mapRowSelectionToRowIds(props.rowSelection);
  const closeGroupsInBulk = useCloseGroupsInBulk();
  const schoolLeavingSidebar = useSchoolLeavingSidebar();
  const schoolPromotionSidebar = useSchoolPromotionSidebar();

  return (
    <RowSelectionTableToolbar
      rowSelection={props.rowSelection}
      elementName={{
        singular: "Gruppe ausgewählt",
        plural: "Gruppen ausgewählt",
      }}
    >
      {selectedGroups.length > 0 && (
        <>
          <RowSelectionTableToolbarButton
            decorator={<UploadOutlined />}
            color="primary"
            onClick={() =>
              schoolPromotionSidebar.open({
                institutionId: props.institutionId,
                institutionName: props.institutionName,
                groupNames: selectedGroups,
              })
            }
          >
            Gruppen hochstufen
          </RowSelectionTableToolbarButton>
          <Divider orientation="vertical" sx={{ marginY: 1 }} />
          <RowSelectionTableToolbarButton
            decorator={<StopCircleOutlined />}
            isPending={closeGroupsInBulk.isPending}
            color="primary"
            onClick={() =>
              schoolLeavingSidebar.open({
                institutionId: props.institutionId,
                institutionName: props.institutionName,
                leavingGroupNames: selectedGroups,
              })
            }
          >
            Schulabgang
          </RowSelectionTableToolbarButton>
        </>
      )}
    </RowSelectionTableToolbar>
  );
}
