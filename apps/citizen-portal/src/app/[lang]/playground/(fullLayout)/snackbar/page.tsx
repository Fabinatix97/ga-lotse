/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import {
  Button,
  Checkbox,
  FormControl,
  FormLabel,
  Input,
  Option,
  Select,
} from "@mui/joy";
import { useState } from "react";

import { isNonEmptyString, useSnackbar } from "@eshg/lib-portal";

import { PageContent } from "@/lib/shared/components/layout/PageContent";
import { ContentSheet } from "@/lib/shared/components/layout/contentSheet";
import { PageLayout, PageTitle } from "@/lib/shared/components/layout/page";

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
    <PageLayout>
      <PageContent>
        <PageTitle>Snackbar</PageTitle>
        <ContentSheet>
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
        </ContentSheet>
      </PageContent>
    </PageLayout>
  );
}
