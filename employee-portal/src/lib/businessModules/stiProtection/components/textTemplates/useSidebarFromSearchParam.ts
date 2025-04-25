/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useCallback, useEffect, useRef } from "react";

import {
  DrawerOpenOptions,
  DrawerProps,
  UseSidebarResult,
  useSidebar,
} from "@eshg/lib-employee-portal";

import { useSearchParam } from "@/lib/shared/hooks/searchParams/useSearchParam";

interface UseSidebarFromSearchParamOptionsBaseProps<
  TSidebarProps extends DrawerProps,
> extends DrawerOpenOptions<TSidebarProps> {
  paramName: string;
  paramValue?: string;
  afterClose?: () => void;
}

type CustomProps<TSidebarProps extends DrawerProps> =
  Omit<TSidebarProps, keyof DrawerProps> extends Record<string, never>
    ? never
    : Omit<TSidebarProps, keyof DrawerProps>;

interface UseSidebarFromSearchParamOptionsCustomProps<
  TSidebarProps extends DrawerProps,
> extends UseSidebarFromSearchParamOptionsBaseProps<TSidebarProps> {
  props: CustomProps<TSidebarProps>;
}

interface UseSidebarFromSearchParamResult
  extends Omit<UseSidebarResult<DrawerProps>, "open"> {
  open: () => void;
}

type UseSidebarFromSearchParamOptionsProps<TSidebarProps extends DrawerProps> =
  Omit<TSidebarProps, keyof DrawerProps> extends Record<string, never>
    ? UseSidebarFromSearchParamOptionsBaseProps<DrawerProps>
    : UseSidebarFromSearchParamOptionsCustomProps<TSidebarProps>;

export function useSidebarFromSearchParam<TSidebarProps extends DrawerProps>({
  paramName,
  paramValue,
  afterClose,
  ...options
}: UseSidebarFromSearchParamOptionsProps<TSidebarProps>): UseSidebarFromSearchParamResult {
  const [openName, setOpenName] = useSearchParam(paramName);

  const sidebar = useSidebar(options);
  // Sidebar is a new object every re-render
  const sidebarRef = useRef(sidebar);
  sidebarRef.current = sidebar;

  const isOpen = paramValue ? openName === paramValue : !!openName;
  const givenProps =
    "props" in options
      ? (options.props as CustomProps<TSidebarProps>)
      : undefined;
  const propsRef = useRef(givenProps);
  propsRef.current = givenProps;

  const open = useCallback(() => {
    setOpenName(paramValue ?? true);
    if (propsRef.current) {
      sidebarRef.current.open(propsRef.current);
    } else {
      (sidebarRef.current as { open: () => void }).open();
    }
  }, [paramValue, setOpenName]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }
    open();
  }, [isOpen, open]);

  const afterCloseRef = useRef(afterClose);
  afterCloseRef.current = afterClose;

  useEffect(() => {
    if (!sidebar.isOpen) {
      return;
    }
    return () => {
      setOpenName(null);
      afterCloseRef.current?.();
    };
  }, [sidebar.isOpen, setOpenName]);

  return { ...sidebar, open };
}
