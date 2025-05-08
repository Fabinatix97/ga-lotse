/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { AddOutlined } from "@mui/icons-material";
import { Button } from "@mui/joy";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { useSaveVaccinationConsultation } from "@/lib/businessModules/travelMedicine/api/mutations/vaccinationConsultation";
import { PersonSidebar } from "@/lib/businessModules/travelMedicine/components/personSidebar/PersonSidebar";
import { InitialAppointmentFormValuesProps } from "@/lib/businessModules/travelMedicine/components/personSidebar/appointment/InitialAppointmentForm";
import {
  TRAVEL_MEDICINE_PERSON_CONFIG,
  mapToApiPostVaccinationConsultationRequest,
} from "@/lib/businessModules/travelMedicine/components/personSidebar/personSidebarHelper";
import { routes } from "@/lib/businessModules/travelMedicine/shared/routes";
import { LegacyPerson } from "@/lib/shared/components/legacyPersonSidebar/form/LegacyPersonForm";

export function NewPerson() {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const saveVaccinationConsultation = useSaveVaccinationConsultation();

  function handleClose() {
    setOpen(false);
  }

  async function handleSubmit(
    data: InitialAppointmentFormValuesProps | LegacyPerson,
  ) {
    const request = mapToApiPostVaccinationConsultationRequest(
      data as InitialAppointmentFormValuesProps,
    );

    await saveVaccinationConsultation.mutateAsync(request, {
      onSuccess: (response) => {
        if (response) {
          router.push(routes.procedures.baseData(response));
        }
        handleClose();
      },
    });
  }

  return (
    <>
      <Button startDecorator={<AddOutlined />} onClick={() => setOpen(true)}>
        Neuen Vorgang anlegen
      </Button>
      <PersonSidebar
        searchFormTitle="Neuen Vorgang anlegen"
        personFormTitle="Person anlegen"
        config={TRAVEL_MEDICINE_PERSON_CONFIG}
        open={open}
        skipEditPersonAfterSearch
        showPostalAddress
        skipInitialAppointmentSelection={false}
        onSubmit={handleSubmit}
        onClose={handleClose}
      />
    </>
  );
}
