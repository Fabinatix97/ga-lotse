/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { formatPersonName } from "@eshg/lib-portal/formatters/person";
import { isNonEmptyString } from "@eshg/lib-portal/helpers/guards";
import { PersonSearchOutlined } from "@mui/icons-material";
import { isDefined } from "remeda";

import {
  ToggleExpandButton,
  ToggleExpandButtonProps,
} from "@/components/buttons/ToggleExpandButton";
import { PersonSearchParams } from "@/components/personSearch/PersonSearchForm";

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
