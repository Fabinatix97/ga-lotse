/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

"use client";

import { createContext, useContext } from "react";

import { RequiresChildren } from "../types/react";

type EnvironmentType = "local" | "dev" | "production";

const EnvironmentTypeContext = createContext<EnvironmentType | undefined>(
  undefined,
);

interface EnvironmentTypeProps extends RequiresChildren {
  environmentType: EnvironmentType;
}

export function EnvironmentTypeProvider(props: EnvironmentTypeProps) {
  return (
    <EnvironmentTypeContext value={props.environmentType}>
      {props.children}
    </EnvironmentTypeContext>
  );
}

function useEnvironmentType() {
  const environmentType = useContext(EnvironmentTypeContext);

  if (environmentType === undefined) {
    throw new Error("Environment type is not initialized");
  }

  return environmentType;
}

export function useIsDevEnvironment() {
  return useIsEnvironment("dev");
}

function useIsEnvironment(wantedEnvironmentType: EnvironmentType) {
  const environmentType = useEnvironmentType();
  return environmentType === wantedEnvironmentType;
}
