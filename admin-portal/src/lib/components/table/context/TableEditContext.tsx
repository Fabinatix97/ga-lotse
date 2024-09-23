/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ReactNode, createContext, useContext } from "react";

const TableEditContext = createContext<boolean>(false);

export function TableContextProvider({
  children,
  editable,
}: Readonly<{
  children: ReactNode;
  editable: boolean;
}>) {
  return (
    <TableEditContext.Provider value={editable}>
      {children}
    </TableEditContext.Provider>
  );
}

export function useEditableTable() {
  return useContext(TableEditContext);
}
