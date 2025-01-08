/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { useHandledMutation } from "@eshg/lib-portal/api/useHandledMutation";
import {
  BaseModal,
  BaseModalProps,
} from "@eshg/lib-portal/components/BaseModal";
import { QueryBoundary } from "@eshg/lib-portal/components/boundaries/QueryBoundary";
import { Button, Stack } from "@mui/joy";

import { OpenModalButton } from "@/lib/shared/components/buttons/OpenModalButton";
import { MainContentLayout } from "@/lib/shared/components/layout/MainContentLayout";
import { StickyToolbarLayout } from "@/lib/shared/components/layout/StickyToolbarLayout";
import { Toolbar } from "@/lib/shared/components/layout/Toolbar";
import { Sidebar, SidebarProps } from "@/lib/shared/components/sidebar/Sidebar";
import { SidebarContent } from "@/lib/shared/components/sidebar/SidebarContent";

export default function MutationErrorsPage() {
  return (
    <StickyToolbarLayout toolbar={<Toolbar title="Page Boundary" />}>
      <MainContentLayout>
        <Stack gap={2}>
          <Mutation />
          <Stack direction="row" gap={2}>
            <OpenModalButton renderModal={MutationModal}>
              Open Modal
            </OpenModalButton>
            <OpenModalButton renderModal={MutationSidebar}>
              Open Sidebar
            </OpenModalButton>
          </Stack>
        </Stack>
      </MainContentLayout>
    </StickyToolbarLayout>
  );
}

function Mutation() {
  const mutation = useHandledMutation({
    mutationFn: async (variables: { throwError: boolean }) => {
      if (variables.throwError) {
        throw new Error("Page error");
      }

      return Promise.resolve(true);
    },
  });

  return (
    <Stack gap={2}>
      <Stack direction="row" gap={2}>
        <Button
          color="success"
          onClick={() => mutation.mutate({ throwError: false })}
        >
          Succeed mutation
        </Button>
        <Button
          color="danger"
          onClick={() => mutation.mutate({ throwError: true })}
        >
          Fail mutation
        </Button>
      </Stack>
      {mutation.isSuccess
        ? "Mutation succeeded."
        : mutation.isError
          ? "Mutation failed."
          : null}
    </Stack>
  );
}

function MutationModal(props: Omit<BaseModalProps, "children" | "modalTitle">) {
  return (
    <QueryBoundary>
      <BaseModal modalTitle="Modal Boundary" {...props}>
        <Mutation />
      </BaseModal>
    </QueryBoundary>
  );
}

function MutationSidebar(props: Omit<SidebarProps, "children">) {
  return (
    <QueryBoundary>
      <Sidebar {...props}>
        <SidebarContent title="Sidebar Boundary">
          <Mutation />
        </SidebarContent>{" "}
      </Sidebar>
    </QueryBoundary>
  );
}
