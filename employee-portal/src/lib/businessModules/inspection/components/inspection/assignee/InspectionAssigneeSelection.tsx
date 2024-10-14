/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiUser } from "@eshg/employee-portal-api/base";
import { ButtonLink } from "@eshg/lib-portal/components/buttons/ButtonLink";

import { useGetAllAssignableUsers } from "@/lib/businessModules/inspection/api/queries/users";
import { AssigneeAutocompleteField } from "@/lib/businessModules/inspection/components/inspection/assignee/AssigneeAutocompleteField";
import { AssigneeInfo } from "@/lib/businessModules/inspection/components/inspection/assignee/AssigneeInfo";
import { AutocompleteSelectOption } from "@/lib/shared/components/AutocompleteSelectOptions";
import { fullName } from "@/lib/shared/components/users/userFormatter";

export interface InspectionStaffSelectionProps {
  selfUser: ApiUser;
  onSelfAssign: () => void;
  currentAssigneeName: string | null;
  currentAssigneeId: string | null;
  onlySelfAssignable?: boolean;
  assigneeIdFieldValueName: string;
}

export function InspectionAssigneeSelection(
  props: Readonly<InspectionStaffSelectionProps>,
) {
  const allAssignableUsersQuery = useGetAllAssignableUsers();

  const assignableUsersOptions = allAssignableUsersQuery.data.map((option) => ({
    value: option.userId,
    label: fullName(option),
  }));

  const selfUserOption = getSelfUserOption(
    assignableUsersOptions,
    props.selfUser,
  );

  return (
    <>
      {props.onlySelfAssignable ? (
        <AssigneeInfo
          assigneeName={
            props.currentAssigneeName ?? selfUserOption?.label ?? ""
          }
        ></AssigneeInfo>
      ) : (
        <AssigneeAutocompleteField
          name={props.assigneeIdFieldValueName}
          options={assignableUsersOptions}
        />
      )}
      {!(props.onlySelfAssignable && props.currentAssigneeId == null) &&
        props.currentAssigneeId !== selfUserOption.value && (
          <ButtonLink onClick={props.onSelfAssign}>Mir zuweisen</ButtonLink>
        )}
    </>
  );
}

function getSelfUserOption(
  assignableUsersOptions: AutocompleteSelectOption[],
  user: ApiUser,
) {
  const selfUserFilteredFromOptions = assignableUsersOptions.find(
    (option) => option.value === user.userId,
  );
  if (selfUserFilteredFromOptions) {
    return selfUserFilteredFromOptions;
  }
  const selfUserCreated = {
    value: user.userId,
    label: fullName(user),
  };
  assignableUsersOptions.push(selfUserCreated);
  return selfUserCreated;
}
