/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { InfoOutlined } from "@mui/icons-material";
import { Box, Button, Sheet, Stack, Typography } from "@mui/joy";
import { type Drauu, createDrauu } from "drauu";
import { useFormikContext } from "formik";
import { useEffect, useRef, useState } from "react";

import { InformationStatementFormValues } from "@/lib/businessModules/travelMedicine/components/informationStatement/InformationStatementStepper";
import { useTranslation } from "@/lib/i18n/client";

interface SignDocumentModalContentProp {
  closeModal: () => void;
}

export function SignDocumentModalContent({
  closeModal,
}: Readonly<SignDocumentModalContentProp>) {
  const { t } = useTranslation(["travelMedicine/signature"]);
  const [drauu, setDrauu] = useState<Drauu>();
  const svgRef = useRef<SVGSVGElement>(null);
  const { setFieldValue, setFieldTouched } =
    useFormikContext<InformationStatementFormValues>();

  const inputFieldName = "signature";

  useEffect(() => {
    void (async () => {
      await setFieldTouched(inputFieldName, true);
    });
  });

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

    return () => {
      drauuInstance.unmount();
    };
  }, [svgRef]);

  async function handleClear() {
    drauu?.clear();
    await setFieldValue(inputFieldName, undefined);
  }

  async function handleSubmit() {
    if (!drauu) return; // shouldn't happen, just narrowing
    if (!drauu.el) return;

    const svgPath = drauu.dump();

    if (svgPath.trim().length > 0) {
      const signatureBlob = await pathToPngBlob(svgPath, {
        ...getResolution(drauu.el),
        scale: 4,
      });

      const signatureFileName = `signature_.png`;
      const signature = new File([signatureBlob], signatureFileName, {
        type: signatureBlob.type,
        lastModified: new Date().getTime(),
      });

      await setFieldValue(inputFieldName, signature);
      closeModal();
    }
  }
  return (
    <>
      <Sheet
        role="application"
        variant="soft"
        aria-label="Bereich zum Zeichnen der Signatur"
        sx={{
          padding: 1,
          height: 240,
          overflow: "hidden",
          // prevent any browser default actions that could cause pointercancel to be fired
          touchAction: "none",
        }}
      >
        <Typography startDecorator={<InfoOutlined />}>
          {t("modal.sign")}
        </Typography>
        <Box
          component={"svg"}
          ref={svgRef}
          sx={{ width: "100%", height: "100%" }}
        />
      </Sheet>
      <Stack
        direction="row"
        spacing={1.5}
        sx={{
          width: "100%",
          justifyContent: "flex-end",
        }}
      >
        <Button color="primary" variant="outlined" onClick={handleClear}>
          {t("modal.deleteButton")}
        </Button>
        <Button color="primary" variant="solid" onClick={handleSubmit}>
          {t("modal.addButton")}
        </Button>
      </Stack>
    </>
  );
}

function getResolution(svg: SVGSVGElement) {
  const bbox = svg.getBoundingClientRect();
  const width = Math.round(bbox.width);
  const height = Math.round(bbox.height);
  return { width, height };
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
