/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiUser, ApiUserGroup } from "@eshg/employee-portal-api/base";
import { Ref } from "react";

import { UserProfileEditForm } from "@/lib/baseModule/components/users/userSidebar/UserProfileEditForm";
import { SidebarFormHandle } from "@/lib/shared/components/form/SidebarForm";
import { Sidebar } from "@/lib/shared/components/sidebar/Sidebar";

interface UserProfileEditSidebarProps {
  selfUser: ApiUser;
  selfGroups: ApiUserGroup[];
  sidebarFormRef: Ref<SidebarFormHandle>;
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function UserProfileEditSidebar({
  selfUser,
  selfGroups,
  sidebarFormRef,
  open,
  onClose,
  onSuccess,
}: UserProfileEditSidebarProps) {
  return (
    <Sidebar open={open} onClose={onClose}>
      <UserProfileEditForm
        onCancel={onClose}
        onSuccess={onSuccess}
        selfGroups={selfGroups}
        selfUser={selfUser}
        sidebarFormRef={sidebarFormRef}
      />
    </Sidebar>
  );
}
