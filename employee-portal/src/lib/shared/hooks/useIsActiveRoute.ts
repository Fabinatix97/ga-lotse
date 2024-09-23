/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { usePathname } from "next/navigation";

export function useIsActiveRoute(index?: string) {
  const pathname = usePathname();
  return (route: string, exactMatch?: boolean) => {
    if (exactMatch) {
      return route === pathname;
    }

    return route === index ? route === pathname : pathname.startsWith(route);
  };
}
