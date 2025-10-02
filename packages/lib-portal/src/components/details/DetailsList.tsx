/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { styled } from "@mui/joy";
import { createContext, useContext } from "react";

import { RequiresChildren } from "../../types/react";

const UnstyledDescriptionList = styled("dl")({
  margin: 0,
  display: "contents",
});

const DetailsListContext = createContext(false);

interface DetailsListProps extends RequiresChildren {
  "data-testid"?: string;
}

export function DetailsList(props: DetailsListProps) {
  return (
    <UnstyledDescriptionList data-testid={props["data-testid"]}>
      <DetailsListContext value>{props.children}</DetailsListContext>
    </UnstyledDescriptionList>
  );
}

export function useInDetailsList() {
  return useContext(DetailsListContext);
}
