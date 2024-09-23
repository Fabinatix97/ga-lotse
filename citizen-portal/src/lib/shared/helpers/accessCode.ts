/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { useSearchParams } from "next/navigation";
import { isDefined } from "remeda";

const ACCESS_CODE_PARAM_NAME = "access_code";

export function useAccessCodeParam() {
  const searchParams = useSearchParams();
  return searchParams.get(ACCESS_CODE_PARAM_NAME) ?? undefined;
}

export function accessCodeRoute(path: string) {
  return function routeFactory(accessCode: string | undefined): string {
    const searchParams = isDefined(accessCode)
      ? `?${ACCESS_CODE_PARAM_NAME}=${accessCode}`
      : "";
    return `${path}${searchParams}`;
  };
}
