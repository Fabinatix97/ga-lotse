/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { formatDate } from "@eshg/lib-portal/formatters/dateTime";
import { formatPersonName } from "@eshg/lib-portal/formatters/person";
import { calculateAge } from "@eshg/lib-portal/helpers/dateTime";

import {
  TabNavigationHeader,
  TabNavigationHeaderTypography,
} from "./TabNavigationHeader";

interface Person {
  firstName: string;
  lastName: string;
  dateOfBirth: Date;
}

interface PersonToolbarHeaderProps {
  person: Person;
  showAge?: boolean;
}

export function PersonToolbarHeader(props: PersonToolbarHeaderProps) {
  const { person } = props;

  return (
    <TabNavigationHeader titleAsH1>
      <TabNavigationHeaderTypography>
        {formatPersonName(person)}
      </TabNavigationHeaderTypography>
      <TabNavigationHeaderTypography>
        Geb. {formatDate(person.dateOfBirth)}
      </TabNavigationHeaderTypography>
      {props.showAge && (
        <TabNavigationHeaderTypography>
          Alter: {calculateAge(person.dateOfBirth)}
        </TabNavigationHeaderTypography>
      )}
    </TabNavigationHeader>
  );
}
