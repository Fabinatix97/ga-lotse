/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { useRouter } from "next/navigation";
import {
  ReactNode,
  createContext,
  useCallback,
  useEffect,
  useRef,
} from "react";
import { isNonNullish } from "remeda";

type Router = ReturnType<typeof useRouter>;

interface TableNavigationContext {
  onCellClick: (route: string) => void;
  focusColumnAccessorKey: string | undefined;
}

function handleCallToAction(td: Element, router: Router) {
  const targetRoute = td.getAttribute("data-targetroute");
  if (isNonNullish(targetRoute)) {
    router.push(targetRoute);
  }
}

function handleArrowNavigation(
  rowElement: Element,
  key: "ArrowDown" | "ArrowUp",
) {
  switch (key) {
    case "ArrowDown": {
      const nextRow = rowElement.nextElementSibling as HTMLElement;
      nextRow?.focus();
      break;
    }
    case "ArrowUp": {
      const previousRow = rowElement.previousElementSibling as HTMLElement;
      previousRow?.focus();
      break;
    }
  }
}

export const TableNavigationContext = createContext<
  TableNavigationContext | undefined
>(undefined);

export function TableNavigationProvider({
  enabled,
  focusColumnAccessorKey,
  children,
}: {
  enabled: boolean;
  children: ReactNode;
  focusColumnAccessorKey: string | undefined;
}) {
  const tableRef = useRef<HTMLTableSectionElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (enabled) {
      function onKeydown(event: KeyboardEvent) {
        const activeElement = document.activeElement;
        if (activeElement === null) {
          return;
        }

        if (activeElement.tagName !== "TR") {
          return;
        }

        if (event.key === "Enter") {
          handleCallToAction(activeElement, router);
        } else if (event.key === "ArrowDown" || event.key === "ArrowUp") {
          handleArrowNavigation(activeElement, event.key);
        }
      }

      const current = tableRef.current;

      current?.addEventListener("keydown", onKeydown);
      return () => {
        current?.removeEventListener("keydown", onKeydown);
      };
    }
  }, [router, enabled]);

  const onCellClick = useCallback(
    (route: string) => {
      router.push(route);
    },
    [router],
  );

  return (
    <tbody ref={tableRef}>
      <TableNavigationContext.Provider
        value={{ onCellClick, focusColumnAccessorKey: focusColumnAccessorKey }}
      >
        {children}
      </TableNavigationContext.Provider>
    </tbody>
  );
}
