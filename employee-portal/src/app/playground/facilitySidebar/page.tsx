/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { Button, Card, Stack, Typography } from "@mui/joy";
import { FormikProps } from "formik";

import {
  MainContentLayout,
  SidebarWithFormRefProps,
  StickyToolbarLayout,
  Toolbar,
  createEmptyAddress,
  useSidebarWithFormRef,
} from "@eshg/lib-employee-portal";
import { OptionalFieldValue, SelectField } from "@eshg/lib-portal";

import {
  FacilitySidebar,
  FacilitySidebarProps,
} from "@/lib/shared/components/facilitySidebar/FacilitySidebar";
import { DefaultFacilityFormValues } from "@/lib/shared/components/facilitySidebar/create/FacilityForm";
import { DefaultFacilitySearchForm } from "@/lib/shared/components/facilitySidebar/search/DefaultFacilitySearchForm";
import { FacilitySearchFormValues } from "@/lib/shared/components/facilitySidebar/search/FacilitySearchForm";

export default function FacilitySidebarPlaygroundPage() {
  const facilitySidebar = useSidebarWithFormRef({
    component: ConfiguredDefaultFacilitySidebar,
  });
  const extraSearchInputsFacilitySidebar = useSidebarWithFormRef({
    component: ConfiguredExtraSearchInputsFacilitySidebar,
  });
  const importFromOsmFacilitySidebar = useSidebarWithFormRef({
    component: ConfiguredImportFromOsmFacilitySidebar,
  });

  return (
    <StickyToolbarLayout
      toolbar={<Toolbar title="Facility Sidebar playground" />}
    >
      <MainContentLayout>
        <Stack gap={3}>
          <Button
            sx={{ width: "fit-content" }}
            onClick={() => facilitySidebar.open()}
          >
            Default Sidebar
          </Button>
          <Button
            sx={{ width: "fit-content" }}
            onClick={() => extraSearchInputsFacilitySidebar.open()}
          >
            Sidebar with extra search inputs
          </Button>
          <Button
            sx={{ width: "fit-content" }}
            onClick={() => importFromOsmFacilitySidebar.open()}
          >
            WebSuche Import Sidebar
          </Button>
        </Stack>
      </MainContentLayout>
    </StickyToolbarLayout>
  );
}

function ConfiguredDefaultFacilitySidebar(props: SidebarWithFormRefProps) {
  const facilitySidebarProps: FacilitySidebarProps<DefaultFacilityFormValues> =
    {
      title: "Neuen Vorgang anlegen",
      onCreateNew: (values) => {
        // eslint-disable-next-line no-console
        console.log(values);
        return Promise.resolve();
      },
      onSelect: (values) => {
        // eslint-disable-next-line no-console
        console.log(values);
        return Promise.resolve();
      },
      ...props,
    };

  return <FacilitySidebar {...facilitySidebarProps} />;
}

function ConfiguredExtraSearchInputsFacilitySidebar(
  props: SidebarWithFormRefProps,
) {
  const facilitySidebarProps: FacilitySidebarProps<ExtendedSearchFormValues> = {
    title: "Erweiterten Vorgang anlegen",
    onCreateNew: (values) => {
      // eslint-disable-next-line no-console
      console.log(values);
      return Promise.resolve();
    },
    onSelect: (values) => {
      // eslint-disable-next-line no-console
      console.log(values);
      return Promise.resolve();
    },
    initialSearchInputs: {
      name: "",
      objectType: "",
    },
    searchFormComponent: ExtendedSearchForm,
    ...props,
  };

  return <FacilitySidebar {...facilitySidebarProps} />;
}

function ConfiguredImportFromOsmFacilitySidebar(
  props: SidebarWithFormRefProps,
) {
  const facilitySidebarProps: FacilitySidebarProps<DefaultFacilityFormValues> =
    {
      title: "OSM Einrichtung Importieren",
      onCreateNew: (values) => {
        // eslint-disable-next-line no-console
        console.log(values);
        return Promise.resolve();
      },
      onSelect: (values) => {
        // eslint-disable-next-line no-console
        console.log(values);
        return Promise.resolve();
      },
      initialSearchInputs: {
        name: "Name der importierten Einrichtung",
      },
      getInitialCreateInputs: (inputs) => ({
        ...inputs,
        contactAddress: {
          ...createEmptyAddress(),
          street: "Portlandweg",
          houseNumber: "4",
          postalCode: "53227",
          city: "Bonn",
        },
      }),
      searchResultHeaderComponent: (
        <>
          <Card
            variant="soft"
            color="success"
            sx={{ border: "1px solid #A1E8A1" }}
          >
            <Typography level="title-md">
              Name der Importierten Einrichtung
            </Typography>
            <Typography>Portlandweg 4, 53227 Bonn</Typography>
          </Card>
          Ergebnisse:
        </>
      ),
      mode: "import",
      ...props,
    };

  return <FacilitySidebar {...facilitySidebarProps} />;
}

interface ExtendedSearchFormValues extends FacilitySearchFormValues {
  objectType: OptionalFieldValue<"SCHOOL" | "HOSPITAL">;
}

function ExtendedSearchForm(props: FormikProps<ExtendedSearchFormValues>) {
  return (
    <DefaultFacilitySearchForm {...props}>
      <SelectField
        name="objectType"
        label="Objekttyp"
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
        required="Bitte einen Objekttyp angeben"
      />
    </DefaultFacilitySearchForm>
  );
}
