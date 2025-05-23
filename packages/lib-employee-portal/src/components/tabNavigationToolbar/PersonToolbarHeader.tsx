/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { calculateAge, formatDate, formatPersonName } from "@eshg/lib-portal";

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
