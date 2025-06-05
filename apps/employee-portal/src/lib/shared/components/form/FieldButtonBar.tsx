/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { Stack, styled } from "@mui/joy";

import { RequiresChildren } from "@eshg/lib-portal";

const ButtonStack = styled(Stack)({
  marginTop: "27px",
});

export function FieldButtonBar(props: RequiresChildren) {
  return (
    <ButtonStack direction="row" gap={2}>
      {props.children}
    </ButtonStack>
  );
}
