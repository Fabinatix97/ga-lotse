# GDT Library

A Java library for encoding and decoding GDT (Gerätedatentransfer) 3.5 data streams.

## About GDT

**GDT** is a German standard for data exchange between medical practice management systems (AIS) and medical devices or laboratories. It uses a line-based format with length prefixes and numeric tags to structure patient data, examination requests, and results.

GDT (**G**eräte-**D**aten-**T**ransfer) files follow a very rigid and standardized schema. It was developed by the **QMS (Qualitätsring Medizinische Software)** to facilitate data exchange between Medical Practice Management Systems (PVS) and medical devices (e.g., ECG, spirometers) in Germany.

### Technical Format: The LOB Principle

GDT files are plain text files (often using the `.gdt` or `.dat` extension) based on the **LOB format** (Length-Object-Identification). Every single line must follow a strict character-count structure:

* **Positions 1–3:** The length of the line (including the carriage return/line feed ).
* **Positions 4–7:** The Field ID (GDT-Feldkennung).
* **Position 8 onwards:** The actual data payload.

---

### Essential Field Identifiers

The schema uses specific four-digit IDs to categorize data. For a file to be valid, certain fields are mandatory:

| Field ID | Meaning | Example |
| --- | --- | --- |
| **8000** | Record length (Total length of the data set) | `0108000...` |
| **8100** | Record Type (e.g., "Submit master data") | `01081006301` |
| **8315** | Receiver GDT ID | `0138315DEVICE1` |
| **8316** | Sender GDT ID | `0118316PVS01` |
| **9206** | Character Set (e.g., 0 for IBM CP437, 3 for ANSI/ISO-8859-1) | `00992063` |

### Common Record Types (Satzarten)

The context of the data transfer is defined by the "Record Type" (Field 8100). The most common ones include:

* **6301:** Transfer patient master data (PVS  Device).
* **6302:** Request an examination (PVS  Device).
* **6310:** Transmit examination findings (Device  PVS).
* **6311:** Show/Display examination data (Device  PVS).

## Resources

### Official Specifications
The GDT standard can be downloaded from the [QMS Standards website](https://www.qms-standards.de/standards/standards-zum-download/).

### Sources

**QMS (Qualitätsring Medizinische Software):** *GDT-Schnittstellenbeschreibung Version 3.x*. URL: [https://www.qms-standards.de/standards/gdt/](https://www.google.com/search?q=https://www.qms-standards.de/standards/gdt/)
> "The GDT interface serves the data exchange between medical practice systems and medical technical devices."


**Kassenärztliche Bundesvereinigung (KBV):** *Technical Annex for IT-Interfaces*. URL: [https://www.kbv.de/](https://www.kbv.de/)
> Documentation regarding the interoperability and standardized data fields (Feldkennung) used in German medical software.