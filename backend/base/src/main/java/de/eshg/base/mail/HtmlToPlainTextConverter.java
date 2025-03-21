/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.mail;

import java.util.EmptyStackException;
import java.util.List;
import java.util.Stack;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.nodes.Node;
import org.jsoup.nodes.TextNode;
import org.jsoup.select.NodeVisitor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * convert HTML to plain-text roughly formatted like the rendered HTML limitations: - no CSS support
 * - no pre element support - only very rudimentary indentation support - only very rudimentary
 * table support - only very rudimentary list support - trailing whitespace at end of lines not
 * removed
 */
public class HtmlToPlainTextConverter implements NodeVisitor {

  private static final Logger logger = LoggerFactory.getLogger(HtmlToPlainTextConverter.class);

  private static final List<String> blockElements =
      List.of(
          "address",
          "blockquote",
          "dd",
          "div",
          "dl",
          "dt",
          "fieldset",
          "form",
          "h1",
          "h2",
          "h3",
          "h4",
          "h5",
          "h6",
          "li",
          "ol",
          "p",
          "pre",
          "ul");
  private static final List<String> extraVerticalSpaceElements =
      List.of("blockquote", "fieldset", "h1", "h2", "h3", "h4", "h5", "h6", "ol", "p", "ul");
  private static final List<String> indentedElements = List.of("blockquote", "dd");

  private final StringBuilder plainText = new StringBuilder();
  private final Stack<Integer> listIndices = new Stack<>();

  private HtmlToPlainTextConverter() {}

  public static String convert(String htmlFragment) {
    Document document = Jsoup.parse(htmlFragment.replaceAll("\\s+", " "));

    HtmlToPlainTextConverter nodeVisitor = new HtmlToPlainTextConverter();
    document.body().traverse(nodeVisitor);

    if (!nodeVisitor.listIndices.isEmpty()) {
      logger.warn("list stack not empty after traversal");
    }

    return nodeVisitor.plainText.toString().trim();
  }

  @Override
  public void head(Node node, int depth) {
    if (node instanceof TextNode textNode) {
      String text = textNode.text();
      if (isStartOfLine()) {
        text = text.replaceAll("^\\s+", "");
      }
      plainText.append(text);
    } else if (node instanceof Element element) {
      if (blockElements.contains(element.tagName())) {
        if (lastCharacterWasNoNewline()) {
          plainText.append("\n");
        }
        if (extraVerticalSpaceElements.contains(element.tagName())) {
          plainText.append("\n");
        }
        if (indentedElements.contains(element.tagName())) {
          plainText.append("\t");
        }
      } else if ("br".equals(element.tagName())) {
        plainText.append("\n");
      } else if ("hr".equals(element.tagName())) {
        plainText.append(
            "\n----------------------------------------------------------------------------\n");
      } else if ("table".equals(element.tagName())) {
        plainText.append("\n");
      }
      handleListStart(element);
      if ("li".equals(element.tagName())) {
        plainText.append(getListElementPrefix());
      }
    }
  }

  @Override
  public void tail(Node node, int depth) {
    if (node instanceof Element element) {
      if (blockElements.contains(element.tagName())) {
        plainText.append("\n");
      } else if ("tr".equals(element.tagName())) {
        plainText.append("\n");
      } else if ("td".equals(element.tagName())) {
        plainText.append("\t");
      }
      handleListEnd(element);
    }
  }

  private String getListElementPrefix() {
    try {
      Integer i = listIndices.pop();
      if (i > 0) {
        listIndices.push(i + 1);
        return String.format("%2d. ", i);
      } else {
        listIndices.push(i - 1);
        return "  - ";
      }
    } catch (EmptyStackException ese) {
      logger.warn("List stack underflow, returning empty prefix", ese);
      return "    ";
    }
  }

  private boolean lastCharacterWasNoNewline() {
    return plainText.isEmpty() || '\n' != (plainText.charAt(plainText.length() - 1));
  }

  private boolean isStartOfLine() {
    return plainText.isEmpty() || '\n' == (plainText.charAt(plainText.length() - 1));
  }

  private void handleListStart(Element element) {
    if ("ol".equals(element.tagName())) {
      listIndices.push(1);
    } else if ("ul".equals(element.tagName())) {
      listIndices.push(-1);
    }
  }

  private void handleListEnd(Element element) {
    try {
      if ("ol".equals(element.tagName())) {
        listIndices.pop();
      } else if ("ul".equals(element.tagName())) {
        listIndices.pop();
      }
    } catch (EmptyStackException ese) {
      logger.warn("List stack underflow", ese);
    }
  }
}
