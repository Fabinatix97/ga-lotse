/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import StarOutlined from "@mui/icons-material/StarOutlined";
import { Sheet, Stack, Typography } from "@mui/joy";
import { Formik } from "formik";

import {
  MainContentLayout,
  StickyToolbarLayout,
  Toolbar,
} from "@eshg/lib-employee-portal";
import { FormPlus, InputField } from "@eshg/lib-portal";

export default function DesignShowcasePage() {
  return (
    <StickyToolbarLayout toolbar={<Toolbar title="Design Showcase" />}>
      <MainContentLayout>
        <Formik
          initialValues={{ name: "Value", error: "" }}
          onSubmit={() => Promise.resolve()}
        >
          <FormPlus sx={{ display: "contents" }}>
            <Sheet sx={{ width: "fit-content" }}>
              <Stack
                gap={8}
                sx={{
                  ".MuiInput-root": {
                    width: "250px",
                  },
                }}
              >
                <Stack gap={8} direction="row">
                  <Stack gap={2}>
                    <Typography level="title-md">enable/primary</Typography>
                    <InputField name="name" label="Label" primary />
                  </Stack>
                  <Stack gap={2}>
                    <Typography level="title-md">focused/primary</Typography>
                    <InputField
                      name="name"
                      label="Label"
                      hint="Hint: Click to focus"
                    />
                  </Stack>
                  <Stack gap={2}>
                    <Typography level="title-md">read only</Typography>
                    <InputField name="name" label="Label" readOnly />
                  </Stack>
                  <Stack gap={2}>
                    <Typography level="title-md">disable</Typography>
                    <InputField name="name" label="Label" disabled />
                  </Stack>
                </Stack>
                <Stack gap={8} direction="row">
                  <Stack gap={2}>
                    <Typography level="title-md">
                      enable/primary/placeholder
                    </Typography>
                    <InputField
                      name="empty"
                      label="Label"
                      placeholder="Placeholder"
                      primary
                    />
                  </Stack>
                  <Stack gap={2}>
                    <Typography level="title-md">enable/danger</Typography>
                    <InputField
                      name="error"
                      label="Label"
                      placeholder="Placeholder"
                      validate={() => "Opps! something is wrong."}
                      hint="Hint: Click to trigger validation error"
                    />
                  </Stack>
                  <Stack gap={2}>
                    <Typography level="title-md">
                      enable/neutral/placeholder
                    </Typography>
                    <InputField
                      name="empty"
                      label="Label"
                      placeholder="Placeholder"
                    />
                  </Stack>
                  <Stack gap={2}>
                    <Typography level="title-md">start & end icon</Typography>
                    <InputField
                      name="name"
                      label="Label"
                      startDecorator={<StarOutlined />}
                      endDecorator={<StarOutlined />}
                      primary
                    />
                  </Stack>
                </Stack>
              </Stack>
            </Sheet>
          </FormPlus>
        </Formik>
      </MainContentLayout>
    </StickyToolbarLayout>
  );
}
