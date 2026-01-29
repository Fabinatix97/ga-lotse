/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useMemo, useRef } from "react";

import { useSearchParam } from "../../../hooks/useSearchParam";

import {
  SidebarWithFormRefProps,
  UseSidebarWithFormRefOptions,
  useSidebarWithFormRef,
} from "./useSidebarWithFormRef";

interface UseSidebarFromSearchParamOptions extends UseSidebarWithFormRefOptions<SidebarWithFormRefProps> {
  searchParam: string;
}
export function useSidebarFromSearchParam({
  searchParam,
  ...sidebarOptions
}: UseSidebarFromSearchParamOptions) {
  const pathname = useRef(getLocalPathname());
  const [shouldBeOpen, setShouldBeOpen] = useSearchParam(
    searchParam,
    "boolean",
  );
  const { open, isOpen, close } = useSidebarWithFormRef({
    ...sidebarOptions,
    onClose() {
      if (getLocalPathname() !== pathname.current) {
        return;
      }
      setShouldBeOpen(false);
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
      sidebarOptions.onClose?.();
    } else {
      controlsRef.current.open();
    }
  }, [isOpen, shouldBeOpen, sidebarOptions]);

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

function getLocalPathname() {
  return window.location.pathname;
}
