/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { Button, Grid, Typography } from "@mui/joy";
import { Formik } from "formik";
import { useRouter } from "next/navigation";

import { ContentPanel } from "@eshg/lib-employee-portal";
import { FormPlus, InputField } from "@eshg/lib-portal";

import {
  useCreateWebSearch,
  useUpdateWebSearch,
} from "@/lib/businessModules/inspection/api/mutations/webSearch";
import { routes } from "@/lib/businessModules/inspection/shared/routes";

export interface WebSearch {
  name: string;
  basicURL: string;
  searchCity: string;
}

interface FacilityWebSearchFormProps {
  initialValues: WebSearch;
  id?: string;
}

export function FacilityWebSearchForm(
  props: Readonly<FacilityWebSearchFormProps>,
) {
  const router = useRouter();
  const { mutateAsync: createWebSearch } = useCreateWebSearch();
  const { mutateAsync: updateWebSearch } = useUpdateWebSearch();

  function redirectToSearch() {
    router.push(routes.facilities.webSearch.index);
  }

  async function onSubmit(values: WebSearch) {
    if (props.id) {
      await updateWebSearch(
        {
          id: props.id,
          apiWebSearchRequest: values,
        },
        {
          onSuccess: redirectToSearch,
        },
      );
    } else {
      await createWebSearch(values, {
        onSuccess: redirectToSearch,
      });
    }
  }

  return (
    <ContentPanel>
      <Typography role="note">
        Sie können eine Websuche nach neuen Einrichtungen anlegen. Es werden{" "}
        <a href="https://www.openstreetmap.de/">OpenStreetMap</a>-Daten
        durchsucht. Geben Sie bitte eine URL ein, die auf OpenStreetMap-Daten im
        sogenannten <strong>PBF-Format</strong> (Dateiendung *.osm.pbf)
        verweist. Eine Liste verfügbarer PBF-Dateien mit URLs befindet sich{" "}
        <a href="https://download.geofabrik.de/europe/germany.html">
          auf geofabrik.de
        </a>
        .
      </Typography>
      <Formik initialValues={props.initialValues} onSubmit={onSubmit}>
        {({ isSubmitting }) => (
          <Grid container columnSpacing={2} rowSpacing={3} component={FormPlus}>
            <Grid xs={12}>
              <InputField
                name="name"
                label="Name"
                placeholder="Name"
                required="Bitte einen Namen angeben."
              />
            </Grid>
            <Grid xs={12}>
              <InputField
                name="basicURL"
                label="URL"
                placeholder="URL"
                required="Bitte eine OpenStreetMap-URL angeben (Endung *.osm.pbz)."
              />
            </Grid>
            <Grid xs={12}>
              <InputField
                name="searchCity"
                label="Stadt"
                required="Bitte eine Stadt angeben."
                hint="Nur nach Einrichtungen innerhalb dieser Stadt suchen."
              />
            </Grid>
            <Grid xs={12} display="flex" justifyContent="flex-end">
              <Button type="submit" disabled={isSubmitting}>
                {props.id ? "Suche aktualisieren" : "Suche anlegen"}
              </Button>
            </Grid>
          </Grid>
        )}
      </Formik>
    </ContentPanel>
  );
}
