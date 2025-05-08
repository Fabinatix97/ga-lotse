/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Formik } from "formik";

import { ApiPromoteGroupsBulkRequest } from "@eshg/dental-api";
import {
  DrawerProps,
  FormButtonBar,
  SidebarActions,
  SidebarContent,
  SidebarForm,
  UseSidebarResult,
  useSidebar,
} from "@eshg/lib-employee-portal";

import { calculateGroupNameForNextSchoolYear } from "../../../schoolYearTransition/calculateGroupNameForNextSchoolYear";
import { usePromoteGroupsInBulk } from "../../api/mutations/schoolYearTransition";

import { SchoolYearTransitionGroupList } from "./SchoolYearTransitionGroupList";

export function useSchoolPromotionSidebar(): UseSidebarResult<SchoolPromotionSidebarProps> {
  return useSidebar({
    component: SchoolPromotionSidebar,
  });
}

export interface OriginAndTargetGroupNames {
  originGroupName: string;
  targetGroupName: string;
}

interface SchoolPromotionFormValues {
  groupNames: OriginAndTargetGroupNames[];
}

interface SchoolPromotionSidebarProps extends DrawerProps {
  institutionId: string;
  institutionName: string;
  groupNames: string[];
}

function SchoolPromotionSidebar({
  groupNames,
  institutionId,
  institutionName,
  onClose,
}: SchoolPromotionSidebarProps) {
  const promoteGroupsInBulk = usePromoteGroupsInBulk();
  const INITIAL_VALUES: SchoolPromotionFormValues = {
    groupNames: groupNames.map((groupName) => ({
      originGroupName: groupName,
      targetGroupName: calculateGroupNameForNextSchoolYear(groupName),
    })),
  };

  async function handleSchoolPromotion(values: SchoolPromotionFormValues) {
    await promoteGroupsInBulk.mutateAsync(mapToRequest(institutionId, values), {
      onSuccess: () => onClose(),
    });
  }

  return (
    <Formik initialValues={INITIAL_VALUES} onSubmit={handleSchoolPromotion}>
      {({ isSubmitting, isValid }) => (
        <SidebarForm>
          <SidebarContent title="Schuljahreswechsel">
            <SchoolYearTransitionGroupList
              institutionName={institutionName}
              info="Folgende Gruppen werden hochgestuft"
              infoColor="primary"
              rows={groupNames}
              nextYearAction
              warning={
                isValid
                  ? undefined
                  : "Bitte alle Felder für das nächste Schuljahr ausfüllen"
              }
            />
          </SidebarContent>
          <SidebarActions>
            <FormButtonBar
              submitLabel="Hochstufen durchführen"
              submitting={isSubmitting}
              onCancel={onClose}
            />
          </SidebarActions>
        </SidebarForm>
      )}
    </Formik>
  );
}

function mapToRequest(
  institutionId: string,
  values: SchoolPromotionFormValues,
): ApiPromoteGroupsBulkRequest {
  return {
    institutionId,
    groupPromotions: values.groupNames,
  };
}
