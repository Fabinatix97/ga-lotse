/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { SelectField } from "@eshg/lib-portal/components/formFields/SelectField";
import { OptionalFieldValue } from "@eshg/lib-portal/types/form";
import { Button, Card, Stack, Typography } from "@mui/joy";
import { FormikProps } from "formik";
import { useRef, useState } from "react";

import { FacilitySidebar } from "@/lib/shared/components/facilitySidebar/FacilitySidebar";
import { DefaultFacilitySearchForm } from "@/lib/shared/components/facilitySidebar/search/DefaultFacilitySearchForm";
import { FacilitySearchFormValues } from "@/lib/shared/components/facilitySidebar/search/FacilitySearchForm";
import { SidebarFormHandle } from "@/lib/shared/components/form/SidebarForm";
import { createEmptyAddress } from "@/lib/shared/components/form/address/helpers";
import { MainContentLayout } from "@/lib/shared/components/layout/MainContentLayout";
import { StickyToolbarLayout } from "@/lib/shared/components/layout/StickyToolbarLayout";
import { Toolbar } from "@/lib/shared/components/layout/Toolbar";
import { useSidebarForm } from "@/lib/shared/hooks/useSidebarForm";

export default function FacilitySidebarPlaygroundPage() {
  const [sidebarState, setSidebarState] = useState("closed");

  const inactiveRef = useRef<SidebarFormHandle>(null);

  const { closeSidebar, sidebarFormRef, handleClose } = useSidebarForm({
    onClose: () => setSidebarState("closed"),
  });

  return (
    <StickyToolbarLayout
      toolbar={<Toolbar title={"Facility Sidebar playground"} />}
    >
      <MainContentLayout>
        <Stack gap={3}>
          <Button
            onClick={() => setSidebarState("default")}
            sx={{ width: "fit-content" }}
          >
            Default Sidebar
          </Button>
          <Button
            onClick={() => setSidebarState("extra search inputs")}
            sx={{ width: "fit-content" }}
          >
            Sidebar with extra search inputs
          </Button>
          <Button
            onClick={() => setSidebarState("import from OSM")}
            sx={{ width: "fit-content" }}
          >
            WebSuche Import Sidebar
          </Button>
        </Stack>

        <FacilitySidebar
          open={sidebarState === "default"}
          title={"Neuen Vorgang anlegen"}
          sidebarFormRef={
            sidebarState === "default" ? sidebarFormRef : inactiveRef
          }
          onClose={handleClose}
          onCreateNew={(values) => {
            // eslint-disable-next-line no-console
            console.log(values);
            closeSidebar();
            return Promise.resolve();
          }}
          onSelect={(values) => {
            // eslint-disable-next-line no-console
            console.log(values);
            closeSidebar();
            return Promise.resolve();
          }}
        />

        <FacilitySidebar
          open={sidebarState === "extra search inputs"}
          title={"Erweiterten Vorgang anlegen"}
          sidebarFormRef={
            sidebarState === "extra search inputs"
              ? sidebarFormRef
              : inactiveRef
          }
          onClose={handleClose}
          onCreateNew={(values) => {
            // eslint-disable-next-line no-console
            console.log(values);
            closeSidebar();
            return Promise.resolve();
          }}
          onSelect={(values) => {
            // eslint-disable-next-line no-console
            console.log(values);
            closeSidebar();
            return Promise.resolve();
          }}
          initialSearchInputs={{
            name: "",
            objectType: "",
          }}
          searchFormComponent={ExtendedSearchForm}
        />

        <FacilitySidebar
          open={sidebarState === "import from OSM"}
          title={"OSM Einrichtung Importieren"}
          sidebarFormRef={
            sidebarState === "import from OSM" ? sidebarFormRef : inactiveRef
          }
          onClose={handleClose}
          onCreateNew={(values) => {
            // eslint-disable-next-line no-console
            console.log(values);
            closeSidebar();
            return Promise.resolve();
          }}
          onSelect={(values) => {
            // eslint-disable-next-line no-console
            console.log(values);
            closeSidebar();
            return Promise.resolve();
          }}
          initialSearchInputs={{
            name: "Name der importierten Einrichtung",
          }}
          getInitialCreateInputs={(inputs) => ({
            ...inputs,
            contactAddress: {
              ...createEmptyAddress(),
              street: "Portlandweg",
              houseNumber: "4",
              postalCode: "53227",
              city: "Bonn",
            },
          })}
          searchResultHeaderComponent={
            <>
              <Card
                variant="soft"
                color="success"
                sx={{ border: "1px solid #A1E8A1" }}
              >
                <Typography level={"title-md"}>
                  Name der Importierten Einrichtung
                </Typography>
                <Typography>Portlandweg 4, 53227 Bonn</Typography>
              </Card>
              Ergebnisse:
            </>
          }
          mode={"import"}
        />
      </MainContentLayout>
    </StickyToolbarLayout>
  );
}

interface ExtendedSearchFormValues extends FacilitySearchFormValues {
  objectType: OptionalFieldValue<"SCHOOL" | "HOSPITAL">;
}

function ExtendedSearchForm(props: FormikProps<ExtendedSearchFormValues>) {
  return (
    <DefaultFacilitySearchForm {...props}>
      <SelectField
        name={"objectType"}
        label={"Objekttyp"}
        options={[
          {
            value: "SCHOOL",
            label: "Schule",
          },
          {
            value: "HOSPITAL",
            label: "Krankenhaus",
          },
        ]}
        required={"Bitte einen Objekttyp angeben"}
      />
    </DefaultFacilitySearchForm>
  );
}
