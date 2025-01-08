/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { ApiInspectionPhase } from "@eshg/employee-portal-api/inspection";
import { FormPlus } from "@eshg/lib-portal/components/form/FormPlus";
import { InputField } from "@eshg/lib-portal/components/formFields/InputField";
import { Button, FormControl, FormHelperText, Sheet, Stack } from "@mui/joy";
import { type Drauu, createDrauu } from "drauu";
import { Formik } from "formik";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { useFinalizeInspection } from "@/lib/businessModules/inspection/api/mutations/inspection";
import { FinalizeInspectionModalProps } from "@/lib/businessModules/inspection/components/inspection/execution/FinalizeInspectionModal";
import { inspectionIsBeforePhase } from "@/lib/businessModules/inspection/shared/enums";
import { routes } from "@/lib/businessModules/inspection/shared/routes";
import { FormButtonBar } from "@/lib/shared/components/form/FormButtonBar";

export function FinalizeInspectionModalContent({
  inspectionId,
  ...props
}: Readonly<FinalizeInspectionModalProps>) {
  const initialValues = { signer: "" };
  const { mutateAsync: finalizeInspection } = useFinalizeInspection();
  const router = useRouter();
  const [drauu, setDrauu] = useState<Drauu>();
  const svgRef = useRef<SVGSVGElement>(null);
  const [signatureMissing, setSignatureMissing] = useState<boolean | null>(
    null,
  );

  useEffect(() => {
    const el = svgRef?.current;
    if (!el) return;

    const drauuInstance = createDrauu({
      el,
      brush: {
        mode: "stylus", // 'line', 'rectangle', 'ellipse'
        color: "black",
        size: 5,
      },
    });

    setDrauu(drauuInstance);
    setSignatureMissing(null);

    return () => {
      drauuInstance.unmount();
    };
  }, [svgRef]);

  function handleClear() {
    drauu?.clear();
    setSignatureMissing(null);
  }

  function handleSubmitSuccess(phase: ApiInspectionPhase) {
    props.onClose();
    if (
      !inspectionIsBeforePhase(
        phase,
        ApiInspectionPhase.CreatingReportAndInvoice,
      )
    ) {
      router.push(routes.procedures.reportResult(inspectionId));
    }
    router.refresh(); // to update disabled tabs
  }

  async function handleSubmit({ signer }: typeof initialValues) {
    if (!drauu) return; // shouldn't happen, just narrowing
    if (!drauu.el) return;

    const svgPath = drauu.dump();

    if (svgPath.trim().length === 0) {
      setSignatureMissing(true);
    } else {
      setSignatureMissing(false);

      const signatureBlob = await pathToPngBlob(svgPath, {
        height: 1024,
        width: 768,
      });

      const signatureFileName = `signature_${inspectionId}.png`;
      const signature = new File([signatureBlob], signatureFileName, {
        type: signatureBlob.type,
        lastModified: new Date().getTime(),
      });

      const { phase } = await finalizeInspection({
        id: inspectionId,
        finalizeInspectionRequest: { signer },
        signature,
      });

      handleSubmitSuccess(phase);
    }
  }

  async function handleSubmitWithoutSignature() {
    const { phase } = await finalizeInspection({
      id: inspectionId,
      finalizeInspectionRequest: {},
    });
    handleSubmitSuccess(phase);
  }

  return (
    <Stack spacing={3}>
      <FormControl error={signatureMissing === true}>
        <Sheet
          role="application"
          variant="soft"
          aria-label="Bereich zum Zeichnen der Signatur"
          sx={{
            p: 0,
            height: 240,
            overflow: "hidden",
            // prevent any browser default actions that could cause pointercancel to be fired
            touchAction: "none",
          }}
        >
          <svg ref={svgRef} style={{ width: "100%", height: "100%" }} />
        </Sheet>
        <FormHelperText>Bitte Signatur zeichnen.</FormHelperText>
      </FormControl>

      <Formik initialValues={initialValues} onSubmit={handleSubmit}>
        {({ isSubmitting }) => (
          <FormPlus>
            <InputField
              name="signer"
              label="Name des Unterzeichnenden"
              required="Bitte den Namen des Unterzeichnenden eintragen"
              sx={{ mb: 3 }}
            />
            <FormButtonBar
              submitting={isSubmitting}
              submitLabel="Abschließen"
              onCancel={props.onClose}
              left={
                <>
                  <Button onClick={handleClear} variant="plain">
                    Unterschrift leeren
                  </Button>
                  <Button
                    onClick={handleSubmitWithoutSignature}
                    variant="plain"
                  >
                    Weiter ohne Unterschrift
                  </Button>
                </>
              }
            />
          </FormPlus>
        )}
      </Formik>
    </Stack>
  );
}

function pathToPngBlob(
  svgPath: string,
  options: {
    width: number;
    height: number;
    scale?: number;
  },
) {
  const { width, height, scale = 1 } = options;
  const svgDocument = getSvgDocument(svgPath, width, height);
  return svgToPng(svgDocument, scale);
}

async function svgToPng(svgDocument: string, scale: number) {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    throw new Error("Could not create canvas context");
  }

  const img = await getSvgImage(svgDocument);

  canvas.width = img.width * scale;
  canvas.height = img.height * scale;

  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

  return getBlob(canvas);
}

async function getSvgImage(svgDocument: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = "data:image/svg+xml;base64," + btoa(svgDocument);
  });
}

async function getBlob(canvas: HTMLCanvasElement) {
  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        reject(new Error("Could not create blob"));
      } else {
        resolve(blob);
      }
    }, "image/png");
  });
}

function getSvgDocument(svgPath: string, width: number, height: number) {
  return (
    '<?xml version="1.0" encoding="UTF-8"?>\n' +
    `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" width="${width}px" height="${height}px">\n${svgPath}\n</svg>`
  );
}
