/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useEffect, useMemo, useRef } from "react";

import {
  SidebarWithFormRefProps,
  UseSidebarWithFormRefOptions,
  useSearchParam,
  useSidebarWithFormRef,
} from "@eshg/lib-employee-portal";

interface UseSidebarFromSearchParamOptions
  extends UseSidebarWithFormRefOptions<SidebarWithFormRefProps> {
  searchParam: string;
}
export function useSidebarFromSearchParam({
  searchParam,
  ...sidebarOptions
}: UseSidebarFromSearchParamOptions) {
  const [shouldBeOpen, setShouldBeOpen] = useSearchParam(
    searchParam,
    "boolean",
  );
  const { open, isOpen, close } = useSidebarWithFormRef({
    ...sidebarOptions,
    onClose() {
      setShouldBeOpen(false);
      sidebarOptions.onClose?.();
    },
  });
  const controlsRef = useRef({ open, close });
  controlsRef.current.open = open;
  controlsRef.current.close = close;

  useEffect(() => {
    if (isOpen === shouldBeOpen) {
      return;
    }
    if (isOpen) {
      controlsRef.current.close();
    } else {
      controlsRef.current.open();
    }
  }, [isOpen, shouldBeOpen]);

  return useMemo(
    () => ({
      isOpen: shouldBeOpen,
      open: () => {
        setShouldBeOpen(true);
      },
      close: () => {
        setShouldBeOpen(false);
      },
    }),
    [shouldBeOpen, setShouldBeOpen],
  );
}
