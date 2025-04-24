/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import {
  ButtonBar,
  DrawerProps,
  MainContentLayout,
  SidebarActions,
  SidebarContent,
  SidebarForm,
  SidebarWithFormRefProps,
  StickyToolbarLayout,
  Toolbar,
  ToolbarBackButton,
  useSidebar,
  useSidebarWithFormRef,
} from "@eshg/lib-employee-portal";
import { InputField } from "@eshg/lib-portal/components/formFields/InputField";
import { Button, Grid, Input, Typography } from "@mui/joy";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Formik } from "formik";
import { ReactNode, useState } from "react";

export default function SidebarPlaygroundPage() {
  const sidebarWithoutParameters = useSidebar({
    component: SidebarWithoutParameters,
    onClose: () => alert("Sidebar was closed"),
  });
  const [sidebarValue, setSidebarValue] = useState("sidebar value");
  const sidebarWithParameters = useSidebar({
    component: SidebarWithParameters,
  });
  const loadingSidebar = useSidebar({
    component: LoadingSidebar,
    fallbackTitle: "Loading sidebar",
  });
  const errorSidebar = useSidebar({
    component: ErrorSidebar,
    fallbackTitle: "Error sidebar",
  });
  const [formValue, setFormValue] = useState("form value");
  const sidebarWithFormRef = useSidebarWithFormRef({
    component: FormSidebar,
  });

  return (
    <StickyToolbarLayout
      toolbar={
        <Toolbar
          title="Sidebar"
          backButton={<ToolbarBackButton href="/playground" />}
        />
      }
    >
      <MainContentLayout>
        <Grid container spacing={3}>
          <Grid xs={12}>
            <Typography level="h2">Sidebar without Parameters</Typography>
          </Grid>
          <Grid xs={6}>
            <Button
              color={sidebarWithoutParameters.isOpen ? "primary" : "neutral"}
              variant="outlined"
              onClick={sidebarWithoutParameters.open}
            >
              Open Sidebar
            </Button>
          </Grid>
          <Grid xs={12}>
            <Typography level="h2">Sidebar with Parameters</Typography>
          </Grid>
          <Grid container xs={6}>
            <Grid xs={12}>
              <Input
                value={sidebarValue}
                onChange={(event) => setSidebarValue(event.target.value)}
              />
            </Grid>
            <Grid xs={12}>
              <Button
                color={sidebarWithParameters.isOpen ? "primary" : "neutral"}
                variant="outlined"
                onClick={() =>
                  sidebarWithParameters.open({ value: sidebarValue })
                }
              >
                Open Sidebar
              </Button>
            </Grid>
          </Grid>
          <Grid xs={12}>
            <Typography level="h2">Loading Sidebar</Typography>
          </Grid>
          <Grid xs={6}>
            <Button
              color={loadingSidebar.isOpen ? "primary" : "neutral"}
              variant="outlined"
              onClick={loadingSidebar.open}
            >
              Open Sidebar
            </Button>
          </Grid>
          <Grid xs={12}>
            <Typography level="h2">Error Sidebar</Typography>
          </Grid>
          <Grid xs={6}>
            <Button
              color={errorSidebar.isOpen ? "primary" : "neutral"}
              variant="outlined"
              onClick={errorSidebar.open}
            >
              Open Sidebar
            </Button>
          </Grid>
          <Grid xs={12}>
            <Typography level="h2">Sidebar with Form</Typography>
          </Grid>
          <Grid container xs={6}>
            <Grid xs={12}>
              <Input
                value={formValue}
                onChange={(event) => setFormValue(event.target.value)}
              />
            </Grid>
            <Grid xs={12}>
              <Button
                color={sidebarWithParameters.isOpen ? "primary" : "neutral"}
                variant="outlined"
                onClick={() => sidebarWithFormRef.open({ value: formValue })}
              >
                Open Sidebar
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </MainContentLayout>
    </StickyToolbarLayout>
  );
}

function SidebarWithoutParameters({ onClose }: DrawerProps): ReactNode {
  return (
    <>
      <SidebarContent>This sidebar has no dynamic parameters.</SidebarContent>
      <SidebarActions>
        <ButtonBar right={<Button onClick={() => onClose()}>Close</Button>} />
      </SidebarActions>
    </>
  );
}

interface SidebarWithParametersProps extends DrawerProps {
  value: string;
}

function SidebarWithParameters({
  value,
  onClose,
}: SidebarWithParametersProps): ReactNode {
  return (
    <>
      <SidebarContent>
        The parameter for this sidebar is {value}.
      </SidebarContent>
      <SidebarActions>
        <ButtonBar right={<Button onClick={() => onClose()}>Close</Button>} />
      </SidebarActions>
    </>
  );
}

function LoadingSidebar({ onClose }: DrawerProps): ReactNode {
  const { data } = useSuspenseQuery({
    queryKey: ["playground", "loadingSidebar"],
    queryFn: () =>
      new Promise<string>((resolve) => setTimeout(() => resolve("data"), 5000)),
  });

  return (
    <>
      <SidebarContent>The sidebar {data} was loaded.</SidebarContent>
      <SidebarActions>
        <ButtonBar right={<Button onClick={() => onClose()}>Close</Button>} />
      </SidebarActions>
    </>
  );
}

function ErrorSidebar(_props: DrawerProps): ReactNode {
  throw new Error();
}

interface FormSidebarProps extends SidebarWithFormRefProps {
  value: string;
}

function FormSidebar({ formRef, value, onClose }: FormSidebarProps): ReactNode {
  return (
    <Formik
      initialValues={{ value }}
      onSubmit={({ value }) => {
        alert(value);
        onClose(true);
      }}
    >
      <SidebarForm ref={formRef}>
        <SidebarContent>
          <InputField name="value" label="Value" />
        </SidebarContent>
        <SidebarActions>
          <ButtonBar right={<Button onClick={() => onClose()}>Close</Button>} />
        </SidebarActions>
      </SidebarForm>
    </Formik>
  );
}
