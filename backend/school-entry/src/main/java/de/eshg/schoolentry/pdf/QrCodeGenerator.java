/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.schoolentry.pdf;

import com.google.zxing.BarcodeFormat;
import com.google.zxing.EncodeHintType;
import com.google.zxing.WriterException;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.qrcode.QRCodeWriter;
import com.google.zxing.qrcode.decoder.ErrorCorrectionLevel;
import java.awt.*;
import java.io.IOException;
import java.io.StringWriter;
import java.nio.charset.StandardCharsets;
import java.util.Map;
import javax.xml.transform.OutputKeys;
import javax.xml.transform.Transformer;
import javax.xml.transform.TransformerException;
import javax.xml.transform.TransformerFactory;
import javax.xml.transform.dom.DOMSource;
import javax.xml.transform.stream.StreamResult;
import org.apache.batik.dom.GenericDOMImplementation;
import org.apache.batik.svggen.SVGGraphics2D;
import org.apache.batik.util.SVGConstants;
import org.w3c.dom.DOMImplementation;
import org.w3c.dom.Document;

public final class QrCodeGenerator {

  private QrCodeGenerator() {}

  public static String createQrCode(String url) {
    try {
      QRCodeWriter qrCodeWriter = new QRCodeWriter();
      Map<EncodeHintType, Object> hints =
          Map.of(
              EncodeHintType.ERROR_CORRECTION,
              ErrorCorrectionLevel.H,
              EncodeHintType.CHARACTER_SET,
              StandardCharsets.UTF_8.name());
      int size = 50;
      BitMatrix bitMatrix = qrCodeWriter.encode(url, BarcodeFormat.QR_CODE, size, size, hints);
      return convertToSvg(bitMatrix);
    } catch (WriterException e) {
      throw new RuntimeException("Failed to generate QR code for invitation.", e);
    }
  }

  private static String convertToSvg(BitMatrix bitMatrix) {
    int[] enclosingRectangle = bitMatrix.getEnclosingRectangle();
    int left = enclosingRectangle[0];
    int top = enclosingRectangle[1];
    int width = enclosingRectangle[2];
    int height = enclosingRectangle[3];

    DOMImplementation domImpl = GenericDOMImplementation.getDOMImplementation();
    Document document = domImpl.createDocument(null, SVGConstants.SVG_SVG_TAG, null);
    SVGGraphics2D svgGenerator = new SVGGraphics2D(document);
    // We need to add an extra pixel to workaround a glitch in openhtmltopdf
    svgGenerator.setSVGCanvasSize(new Dimension(width + 1, height + 1));

    for (int y = 0; y < height; y++) {
      for (int x = 0; x < width; x++) {
        if (bitMatrix.get(x + left, y + top)) {
          svgGenerator.fillRect(x, y, 1, 1);
        }
      }
    }

    try (StringWriter writer = new StringWriter()) {
      TransformerFactory transformerFactory = TransformerFactory.newInstance();
      Transformer transformer = transformerFactory.newTransformer();
      transformer.setOutputProperty(OutputKeys.INDENT, "yes");

      DOMSource source = new DOMSource(svgGenerator.getRoot());
      StreamResult result = new StreamResult(writer);
      transformer.transform(source, result);
      return writer.toString();
    } catch (IOException | TransformerException e) {
      throw new RuntimeException(e);
    }
  }
}
