/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

"use client";

import { usePathname } from "next/navigation";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { isDefined } from "remeda";

import { RequiresChildren } from "../types/react";

import { LiveAnnouncer } from "./liveAnnouncer/LiveAnnouncer";

interface DocumentTitleContextValue {
  updateTitle: (title: string) => void;
}

const DocumentTitleContext = createContext<DocumentTitleContextValue | null>(
  null,
);

interface DocumentTitleProps extends RequiresChildren {
  defaultTitle: string;
}

export function DocumentTitleProvider(props: DocumentTitleProps) {
  const [newDocumentTitle, setNewDocumentTitel] = useState(props.defaultTitle);
  const [customDocumentTitle, setCustomDocumentTitel] = useState<
    { title: string; path: string } | undefined
  >();
  const path = usePathname();

  const updateTitle = useCallback(
    (title: string) => {
      setCustomDocumentTitel({
        title: `${title} - ${props.defaultTitle}`,
        path,
      });
    },
    [path, props.defaultTitle],
  );

  const contextValue = useMemo<DocumentTitleContextValue>(
    () => ({ updateTitle }),
    [updateTitle],
  );

  useEffect(() => {
    const observer = new MutationObserver(() => {
      let h1Text;
      const h1Element = document.querySelector("main h1");
      if (h1Element) {
        if (h1Element.childElementCount === 0) {
          h1Text = h1Element.textContent;
        } else {
          const firstElementChild = h1Element?.firstElementChild;
          if (firstElementChild?.childElementCount === 0) {
            h1Text = firstElementChild.textContent;
          } else {
            h1Text = h1Element?.firstElementChild?.firstChild?.textContent;
          }
        }
      }
      if (h1Text) {
        setNewDocumentTitel(`${h1Text} - ${props.defaultTitle}`);
      }
    });
    observer.observe(document.querySelector("body")!, {
      childList: true,
      subtree: true,
    });
    return () => observer.disconnect();
  }, [props.defaultTitle]);

  useEffect(() => {
    if (isDefined(customDocumentTitle) && customDocumentTitle.path !== path) {
      setCustomDocumentTitel(undefined);
    }
  }, [customDocumentTitle, path]);

  return (
    <DocumentTitleContext value={contextValue}>
      <title>{customDocumentTitle?.title ?? newDocumentTitle}</title>
      <LiveAnnouncer
        active
        message={customDocumentTitle?.title ?? newDocumentTitle}
      />
      {props.children}
    </DocumentTitleContext>
  );
}

/**
 * Update customized document title
 */
export function useUpdateDocumentTitle(title: string) {
  const context = useContext(DocumentTitleContext);
  if (context === null) {
    throw new Error(
      "useUpdateDocumentTitle was called outside DocumentTitleProvider",
    );
  }
  const { updateTitle } = context;

  useEffect(() => {
    updateTitle(title);
  }, [title, updateTitle]);
}
