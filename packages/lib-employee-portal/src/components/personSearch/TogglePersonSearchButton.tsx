/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { PersonSearchOutlined } from "@mui/icons-material";
import { isDefined } from "remeda";

import { formatPersonName, isNonEmptyString } from "@eshg/lib-portal";

import {
  ToggleExpandButton,
  ToggleExpandButtonProps,
} from "../buttons/ToggleExpandButton";

import { PersonSearchParams } from "./PersonSearchForm";

export interface TogglePersonSearchButtonProps extends ToggleExpandButtonProps {
  searchParams: PersonSearchParams | undefined;
}

export function TogglePersonSearchButton(props: TogglePersonSearchButtonProps) {
  const { searchParams, ...buttonProps } = props;
  const searchedPersonName = isDefined(searchParams)
    ? formatPersonName({
        firstName: searchParams.searchFirstName,
        lastName: searchParams.searchLastName,
      })
    : undefined;
  const nonEmptyPersonName = isNonEmptyString(searchedPersonName)
    ? searchedPersonName
    : undefined;

  return (
    <ToggleExpandButton
      startDecorator={<PersonSearchOutlined />}
      activeStateText={nonEmptyPersonName}
      {...buttonProps}
    >
      Personensuche
    </ToggleExpandButton>
  );
}
