/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Stack } from "@mui/joy";

import { UserType } from "@/lib/baseModule/components/layout/types";
import { LanguagePicker } from "@/lib/i18n/components/LanguagePicker";

import { PageSwitchButtons } from "./PageSwitchButtons";

export function MainMenu({ userType }: { userType: UserType }) {
  return (
    <Stack
      flexDirection="row"
      justifyContent="space-between"
      alignItems="center"
      flex={1}
      paddingBlock={1}
    >
      <PageSwitchButtons userType={userType} />
      <Stack flexDirection="row">
        <LanguagePicker />
      </Stack>
    </Stack>
  );
}
