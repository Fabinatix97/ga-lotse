/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { Button, Stack, Switch, Typography } from "@mui/joy";
import { useState } from "react";

import {
  MainContentLayout,
  StickyToolbarLayout,
  Toolbar,
} from "@eshg/lib-employee-portal";

import { OfflineExistingPasswordDialog } from "@/lib/businessModules/inspection/shared/offline/password/OfflineExistingPasswordDialog";
import { OfflineNewPasswordDialog } from "@/lib/businessModules/inspection/shared/offline/password/OfflineNewPasswordDialog";

export default function PlaygroundOfflinePasswordPage() {
  const [openNewPasswordDialog, setOpenNewPasswordDialog] = useState(false);
  const [openExistingPasswordDialog, setOpenExistingPasswordDialog] =
    useState(false);

  const [waiting, setWaiting] = useState(false);
  const [retry, setRetry] = useState(false);

  return (
    <StickyToolbarLayout toolbar={<Toolbar title="Offline Password" />}>
      <MainContentLayout>
        <Stack gap={3}>
          <Stack gap={3} direction="row">
            <Button onClick={() => setOpenNewPasswordDialog(true)}>
              OfflineNewPasswordDialog
            </Button>
            <Button onClick={() => setOpenExistingPasswordDialog(true)}>
              OfflineExistingPasswordDialog
            </Button>
          </Stack>
          <Stack gap={3} direction="row">
            <Typography
              component="label"
              endDecorator={
                <Switch
                  checked={waiting}
                  onChange={() => setWaiting((old) => !old)}
                />
              }
            >
              waiting
            </Typography>
            <Typography
              component="label"
              endDecorator={
                <Switch
                  checked={retry}
                  onChange={() => setRetry((old) => !old)}
                />
              }
            >
              retry
            </Typography>
          </Stack>
        </Stack>
        {openNewPasswordDialog && (
          <OfflineNewPasswordDialog
            waiting={waiting}
            onPassword={() => {
              setOpenNewPasswordDialog(false);
              return Promise.resolve();
            }}
            onClear={() => {
              setOpenExistingPasswordDialog(false);
              return Promise.resolve();
            }}
          />
        )}
        {openExistingPasswordDialog && (
          <OfflineExistingPasswordDialog
            retry={retry}
            waiting={waiting}
            onClear={() => {
              setOpenExistingPasswordDialog(false);
              return Promise.resolve();
            }}
            onPassword={() => {
              setOpenExistingPasswordDialog(false);
              return Promise.resolve();
            }}
          />
        )}
      </MainContentLayout>
    </StickyToolbarLayout>
  );
}
