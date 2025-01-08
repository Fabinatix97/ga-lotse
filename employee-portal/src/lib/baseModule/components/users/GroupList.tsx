/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiUserGroup } from "@eshg/employee-portal-api/base";
import { Chip, Stack } from "@mui/joy";

import { translateUserGroup } from "@/lib/shared/helpers/users";

export function GroupList({ groups }: { groups: ApiUserGroup[] }) {
  return (
    <Stack direction={"row"} gap={1} flexWrap={"wrap"}>
      {groups.map((group) => (
        <Chip key={group.name} color={"primary"} variant={"soft"}>
          {translateUserGroup(group.name)}
        </Chip>
      ))}
    </Stack>
  );
}
