/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { useAlert } from "@eshg/lib-portal/errorHandling/AlertContext";
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

import { PageContent } from "@/lib/shared/components/layout/PageContent";
import { ContentSheet } from "@/lib/shared/components/layout/contentSheet";
import { PageLayout, PageTitle } from "@/lib/shared/components/layout/page";

const DEFAULT_TYPE = "error";
const TYPES = ["error", "warning", "notification"] as const;

export default function AlertPlaygroundPage() {
  const alert = useAlert();
  const [type, setType] = useState<(typeof TYPES)[number]>(DEFAULT_TYPE);
  const [title, setTitle] = useState("Title");
  const [message, setMessage] = useState("Message");
  const [closeable, setCloseable] = useState(false);
  const [action, setAction] = useState("");

  function openAlert() {
    alert[type]({
      title,
      message,
      action: isNonEmptyString(action)
        ? { text: action, onClick: () => window.alert("Action clicked") }
        : undefined,
      closeable,
    });
  }

  return (
    <PageLayout>
      <PageContent>
        <PageTitle>Alert</PageTitle>
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
            <FormLabel>Title</FormLabel>
            <Input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
            />
          </FormControl>
          <FormControl>
            <FormLabel>Message</FormLabel>
            <Input
              value={message}
              onChange={(event) => setMessage(event.target.value)}
            />
          </FormControl>
          <Checkbox
            label="Closeable"
            checked={closeable}
            onChange={(event) => setCloseable(event.target.checked)}
          />
          <FormControl>
            <FormLabel>Action</FormLabel>
            <Input
              value={action}
              onChange={(event) => setAction(event.target.value)}
            />
          </FormControl>
          <Stack direction="row" gap={3}>
            <Button onClick={openAlert}>Open Alert</Button>
            <Button
              color="danger"
              onClick={() => alert.close()}
              disabled={!alert.isOpen}
            >
              Close Alert
            </Button>
          </Stack>
        </ContentSheet>
      </PageContent>
    </PageLayout>
  );
}
