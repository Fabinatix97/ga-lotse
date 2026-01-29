/**
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiUser } from "@eshg/base-api";
import { ButtonLink, formatUserName } from "@eshg/lib-portal";

import { AssigneeAutocompleteField } from "@/lib/businessModules/inspection/components/inspection/assignee/AssigneeAutocompleteField";
import { AssigneeInfo } from "@/lib/businessModules/inspection/components/inspection/assignee/AssigneeInfo";
import { AutocompleteSelectOption } from "@/lib/shared/components/AutocompleteSelectOptions";

interface InspectionAssigneeSelectionProps {
  selfUser: ApiUser;
  onSelfAssign: () => void;
  currentAssigneeName: string | null;
  currentAssigneeId: string | null;
  onlySelfAssignable?: boolean;
  assigneeIdFieldValueName: string;
  allAssignableUsers: ApiUser[];
}

export function InspectionAssigneeSelection(
  props: Readonly<InspectionAssigneeSelectionProps>,
) {
  const assignableUsersOptions = props.allAssignableUsers.map((option) => ({
    value: option.userId,
    label: formatUserName(option),
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
        />
      ) : (
        <AssigneeAutocompleteField
          name={props.assigneeIdFieldValueName}
          options={assignableUsersOptions}
          required="Bitte einen Bearbeiter auswählen"
        />
      )}
      {!(props.onlySelfAssignable && props.currentAssigneeId === null) &&
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
    label: formatUserName(user),
  };
  assignableUsersOptions.push(selfUserCreated);
  return selfUserCreated;
}
