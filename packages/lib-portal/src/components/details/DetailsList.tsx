/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { styled } from "@mui/joy";
import { createContext, useContext } from "react";

import { RequiresChildren } from "../../types/react";

const UnstyledDescriptionList = styled("dl")({
  margin: 0,
});

const DetailsListContext = createContext(false);

export function DetailsList(props: RequiresChildren) {
  return (
    <UnstyledDescriptionList>
      <DetailsListContext value>{props.children}</DetailsListContext>
    </UnstyledDescriptionList>
  );
}

export function useInDetailsList() {
  return useContext(DetailsListContext);
}
