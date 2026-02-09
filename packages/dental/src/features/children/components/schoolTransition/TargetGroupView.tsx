/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useFormikContext } from "formik";
import { isEmptyish } from "remeda";

import { GroupView } from "./GroupView";
import { SchoolPromotionFormValues } from "./SchoolPromotionSidebar";

export function TargetGroupView({ row }: { row?: string }) {
  const { values } = useFormikContext<SchoolPromotionFormValues>();
  const groupName = values.groupNames.find((g) => g.originGroupName === row);
  const targetGroupName = isEmptyish(groupName?.targetGroupName)
    ? "keine Angabe"
    : groupName?.targetGroupName;
  return <GroupView row={targetGroupName} />;
}
