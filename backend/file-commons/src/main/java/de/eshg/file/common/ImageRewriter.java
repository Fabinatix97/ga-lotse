/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.file.common;

import de.eshg.rest.service.error.BadRequestException;
import de.eshg.rest.service.error.ErrorCode;
import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.Iterator;
import javax.imageio.IIOImage;
import javax.imageio.ImageIO;
import javax.imageio.ImageReader;
import javax.imageio.ImageWriteParam;
import javax.imageio.ImageWriter;
import javax.imageio.metadata.IIOMetadata;
import javax.imageio.plugins.jpeg.JPEGImageWriteParam;
import javax.imageio.stream.ImageInputStream;
import org.springframework.http.MediaType;
import org.springframework.web.multipart.MultipartFile;

public class ImageRewriter {

  private ImageRewriter() {}

  public static byte[] validateAndRewriteImageFile(
      MultipartFile file, MediaType mediaType, long maxImageSize) throws IOException {

    return validateAndRewriteImageFile(file.getInputStream(), mediaType, maxImageSize);
  }

  public static byte[] validateAndRewriteImageFile(
      InputStream inputStream, MediaType mediaType, long maxImageSize) throws IOException {
    try (ImageInputStream imageInputStream = ImageIO.createImageInputStream(inputStream)) {

      Iterator<ImageReader> imageReaders = ImageIO.getImageReaders(imageInputStream);

      if (!imageReaders.hasNext()) {
        throw new BadRequestException(ErrorCode.INVALID_FILE, "Unknown image file format.");
      }
      ImageReader imageReader = imageReaders.next();
      imageReader.setInput(imageInputStream);

      long width = imageReader.getWidth(0);
      if (width > maxImageSize) {
        throw new BadRequestException(
            ErrorCode.INVALID_FILE,
            "The image is too large.",
            "The image is too wide: expected: <=%d, got: %d".formatted(maxImageSize, width));
      }

      long height = imageReader.getHeight(0);
      if (height > maxImageSize) {
        throw new BadRequestException(
            ErrorCode.INVALID_FILE,
            "The image is too large.",
            "The image is too tall: expected: <=%d, got: %d".formatted(maxImageSize, height));
      }

      IIOMetadata metadata = imageReader.getImageMetadata(0);
      BufferedImage bufferedImage = imageReader.read(0);

      IIOImage iioImage = new IIOImage(bufferedImage, null, metadata);
      ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
      ImageWriter writer = ImageIO.getImageWritersByFormatName(mediaType.getSubtype()).next();
      writer.setOutput(ImageIO.createImageOutputStream(outputStream));

      if (mediaType.getSubtype().matches("jpe?g")) {
        JPEGImageWriteParam jpegParams = new JPEGImageWriteParam(null);
        jpegParams.setCompressionMode(ImageWriteParam.MODE_EXPLICIT);
        jpegParams.setCompressionQuality(1f);
        jpegParams.setOptimizeHuffmanTables(true);
        writer.write(null, iioImage, jpegParams);
      } else {
        writer.write(iioImage);
      }

      return outputStream.toByteArray();
    }
  }
}
