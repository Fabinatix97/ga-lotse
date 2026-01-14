/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { Button } from "@mui/joy";
import { addMinutes } from "date-fns";
import { useFormikContext } from "formik";

import { Row, toDateTimeString } from "@eshg/lib-portal";

export function CustomAppointmentQuickButtons<TForm>() {
  const { setFieldValue } = useFormikContext<TForm>();
  function setCustomAppointment(inMinutes: number) {
    const now = new Date();
    const roundTo = 5;
    const roundMinutes = now.getMinutes() % roundTo;
    const minutesToAdd =
      inMinutes > 0 ? inMinutes - roundMinutes : roundTo - roundMinutes;
    const customTime = addMinutes(now, minutesToAdd);
    void setFieldValue("customAppointmentDate", toDateTimeString(customTime));
  }

  return (
    <Row mb={2} justifyContent="right">
      <Button
        title="Individueller Termin in den nächsten Minuten setzen"
        size="sm"
        variant="soft"
        onClick={() => setCustomAppointment(0)}
      >
        Jetzt
      </Button>
      <Button
        title="Individueller Termin in ca. 10 Minuten setzen"
        size="sm"
        variant="soft"
        onClick={() => setCustomAppointment(10)}
      >
        in 10m
      </Button>
      <Button
        title="Individueller Termin in ca. 20 Minuten setzen"
        size="sm"
        variant="soft"
        onClick={() => setCustomAppointment(20)}
      >
        in 20m
      </Button>
      <Button
        title="Individueller Termin in ca. 30 Minuten setzen"
        size="sm"
        variant="soft"
        onClick={() => setCustomAppointment(30)}
      >
        in 30m
      </Button>
    </Row>
  );
}
