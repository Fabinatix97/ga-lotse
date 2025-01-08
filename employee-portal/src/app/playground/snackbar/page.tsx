/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { useSnackbar } from "@eshg/lib-portal/components/snackbar/SnackbarProvider";
import { isNonEmptyString } from "@eshg/lib-portal/helpers/guards";
import {
  Button,
  Checkbox,
  FormControl,
  FormLabel,
  Input,
  Option,
  Select,
  Stack,
} from "@mui/joy";
import { useState } from "react";

import { MainContentLayout } from "@/lib/shared/components/layout/MainContentLayout";
import { StickyToolbarLayout } from "@/lib/shared/components/layout/StickyToolbarLayout";
import { Toolbar } from "@/lib/shared/components/layout/Toolbar";

const DEFAULT_TYPE = "confirmation";
const TYPES = ["confirmation", "error", "notification"] as const;

export default function SnackbarPlaygroundPage() {
  const snackbar = useSnackbar();
  const [type, setType] = useState<(typeof TYPES)[number]>(DEFAULT_TYPE);
  const [text, setText] = useState("This is a snackbar");
  const [manualClose, setManualClose] = useState(false);
  const [action, setAction] = useState("");

  function openSnackbar() {
    snackbar[type](text, {
      action: isNonEmptyString(action)
        ? { name: action, onClick: () => alert("Action clicked") }
        : undefined,
      manualClose,
    });
  }

  return (
    <StickyToolbarLayout
      toolbar={<Toolbar title="Snackbar" backHref="/playground" />}
    >
      <MainContentLayout>
        <Stack gap={3}>
          <FormControl>
            <FormLabel>Type</FormLabel>
            <Select
              value={type}
              onChange={(_, value) => setType(value ?? DEFAULT_TYPE)}
            >
              {TYPES.map((type) => (
                <Option key={type} value={type}>
                  {type}
                </Option>
              ))}
            </Select>
          </FormControl>
          <FormControl>
            <FormLabel>Text</FormLabel>
            <Input
              value={text}
              onChange={(event) => setText(event.target.value)}
            />
          </FormControl>
          <Checkbox
            label="Manual close"
            checked={manualClose}
            onChange={(event) => setManualClose(event.target.checked)}
          />
          <FormControl>
            <FormLabel>Action</FormLabel>
            <Input
              value={action}
              onChange={(event) => setAction(event.target.value)}
            />
          </FormControl>
          <Button onClick={openSnackbar}>Snackbar öffnen</Button>
        </Stack>
      </MainContentLayout>
    </StickyToolbarLayout>
  );
}
