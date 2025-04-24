/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  RowSelectionTableToolbar,
  RowSelectionTableToolbarButton,
  mapRowSelectionToRowIds,
} from "@eshg/lib-employee-portal";
import { StopCircleOutlined, UploadOutlined } from "@mui/icons-material";
import { Button, Divider } from "@mui/joy";
import { RowSelectionState } from "@tanstack/react-table";

import { useCloseGroupsInBulk } from "@/features/children/api/mutations/schoolYearTransition";
import { useSchoolLeavingSidebar } from "@/features/children/components/schoolTransition/SchoolLeavingSidebar";

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
          <Button startDecorator={<UploadOutlined />} variant="plain">
            Gruppe hochstufen
          </Button>
          <Divider orientation={"vertical"} sx={{ marginY: 1 }} />
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
