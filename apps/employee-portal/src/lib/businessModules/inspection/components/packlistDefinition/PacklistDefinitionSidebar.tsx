/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useReducer } from "react";

import {
  SidebarWithFormRefProps,
  useSidebarWithFormRef,
} from "@eshg/lib-employee-portal";

import { CreatePacklistDefinitionSidebar } from "@/lib/businessModules/inspection/components/packlistDefinition/CreatePacklistDefinitionSidebar";
import { EditPacklistDefinitionSidebar } from "@/lib/businessModules/inspection/components/packlistDefinition/EditPacklistDefinitionSidebar";
import { PacklistRevisionsSidebarWithQuery } from "@/lib/businessModules/inspection/components/packlistDefinition/sidebars/PacklistRevisionsSidebar";

export const PacklistDefinitionSidebarMode = {
  CREATE: "create",
  VIEW: "view",
  EDIT: "edit",
  HISTORY: "history",
} as const;
export type PacklistDefinitionSidebarMode =
  (typeof PacklistDefinitionSidebarMode)[keyof typeof PacklistDefinitionSidebarMode];

interface PacklistDefinitionSidebarState {
  mode: PacklistDefinitionSidebarMode;
  props: {
    packlistDefinitionId: string;
    revisionId: string;
    version: number;
  };
  previous?: Omit<PacklistDefinitionSidebarState, "previous">;
}

interface PacklistDefinitionSidebarAction {
  action: PacklistDefinitionSidebarMode | "back";
  packlistDefinitionId?: string;
  revisionId?: string;
  version?: number;
}

interface PacklistDefinitionSidebarProps {
  mode: PacklistDefinitionSidebarMode;
  packlistDefinitionId?: string;
  revisionId?: string;
  version?: number;
}

export function usePacklistDefinitionSidebar() {
  return useSidebarWithFormRef({
    component: PacklistDefinitionSidebar,
  });
}

function transition(
  previous: PacklistDefinitionSidebarState,
  action: PacklistDefinitionSidebarAction,
): PacklistDefinitionSidebarState {
  if (action.action === "back") {
    return previous.previous ?? previous;
  }

  return { ...getInitialState({ mode: action.action, ...action }), previous };
}

function getInitialState(
  props: Readonly<PacklistDefinitionSidebarProps>,
): PacklistDefinitionSidebarState {
  return {
    mode: props.mode,
    props: {
      packlistDefinitionId: props.packlistDefinitionId ?? "",
      revisionId: props.revisionId ?? "",
      version: props.version ?? 0,
    },
  };
}

function PacklistDefinitionSidebar({
  onClose,
  formRef,
  ...props
}: Readonly<PacklistDefinitionSidebarProps & SidebarWithFormRefProps>) {
  const [state, dispatch] = useReducer(transition, getInitialState(props));

  function handleClickNewRevision(
    packlistDefinitionId: string,
    version: number,
    revisionId: string,
  ) {
    dispatch({
      action: PacklistDefinitionSidebarMode.EDIT,
      packlistDefinitionId,
      version,
      revisionId,
    });
  }

  function handleClickOnRevision(
    packlistDefinitionId: string,
    version: number,
    revisionId: string,
  ) {
    dispatch({
      action: PacklistDefinitionSidebarMode.VIEW,
      packlistDefinitionId,
      version,
      revisionId,
    });
  }

  function handleClose(force?: boolean) {
    if (!state.previous || force) {
      onClose(force);
      return;
    }

    dispatch({
      action: "back",
    });
  }

  const componentProps = {
    onClose: handleClose,
    formRef,
    ...state.props,
    onClickNewRevision: handleClickNewRevision,
    onClickOnRevision: handleClickOnRevision,
  };

  if (state.mode === PacklistDefinitionSidebarMode.CREATE) {
    return <CreatePacklistDefinitionSidebar {...componentProps} />;
  } else if (state.mode === PacklistDefinitionSidebarMode.VIEW) {
    return <EditPacklistDefinitionSidebar {...componentProps} readonly />;
  } else if (state.mode === PacklistDefinitionSidebarMode.EDIT) {
    return <EditPacklistDefinitionSidebar {...componentProps} />;
  } else if (state.mode === PacklistDefinitionSidebarMode.HISTORY) {
    return <PacklistRevisionsSidebarWithQuery {...componentProps} />;
  }
}
