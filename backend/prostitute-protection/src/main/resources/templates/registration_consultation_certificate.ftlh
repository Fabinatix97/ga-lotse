<#import "common/base.ftlh" as base />
<#import "common/footer.ftlh" as footer />
<#import "common/checkbox.ftlh" as checkbox />
<#import "common/date_and_signature_line.ftlh" as date_and_signature />

<#macro additionalStyle>
  .headline {
    text-align: center;
    font-size: 14pt;
    font-weight: 800;
    margin-top: 3mm;
    margin-bottom: 3mm;
  }

  .italic {
    font-style: italic;
    font-size: 10pt;
  }

  .date-and-signature {
    width: 60%;
    margin-top: 8mm;
  }

  .signature-line {
    border-bottom: 1px solid black;
    height: 1px;
    vertical-align: bottom;
  }
</#macro>

<@base.document title="ProstSchG" styles=[
additionalStyle,
footer.style
]>
  <@footer.content department=department />

  <div class="body">
    <table style="width: 100%;">
      <colgroup>
        <col style="width: 20%;"/>
        <col style="width: 40%;"/>
        <col style="width: 40%;"/>
      </colgroup>

      <tr>
        <td>
        </td>
        <td>
        </td>
        <td>
          <img
            src="data:${department.contentType};base64,${department.contentAsBase64}"
            alt="logo"
            style="width: 130px; height: 2cm"/>
        </td>
      </tr>

      <tr>
        <td>
          Name:
        </td>
        <td>
          ${person.lastName}
        </td>
        <td>
        </td>
      </tr>

      <tr>
        <td>
          Vorname:
        </td>
        <td>
          ${person.firstName}
        </td>
        <td>
        </td>
      </tr>

      <tr>
        <td>
          ggf. Alias:
        </td>
        <td>
          ${person.alias!""}
        </td>
        <td>
        </td>
      </tr>

      <tr>
        <td>
          Geburtsdatum:
        </td>
        <td>
          ${person.dateOfBirth}
        </td>
        <td>
        </td>
      </tr>

      <tr>
        <td>
          Nationalität:
        </td>
        <td>
          ${person.nationality}
        </td>
        <td>
        </td>
      </tr>
    </table>

    <div style="margin-top: 25mm">
      <div class="headline">Dokumentation über die Informationsberatung</div>
      <div class="headline">gemäß § 7 Prostituiertenschutzgesetz (ProstSchG)
      </div>
    </div>

    <div style="margin-top: 20mm">
      Hiermit wird bescheinigt, dass o. g. Person am ${dateOfConsultation} gemäß
      § 7 Abs. 2 ProstSchG über die folgenden Inhaltspunkte informiert wurde:
    </div>


    <table style="width: 100%; margin-top: 5mm">
      <colgroup>
        <col style="width: 5%;"/>
        <col style="width: 95%;"/>
      </colgroup>

      <tr>
        <td>
          &#10004;
        </td>
        <td class="italic">
          Rechtslage nach Prostitutions- und Prostituiertenschutzgesetz
        </td>
      </tr>

      <tr>
        <td>
          &#10004;
        </td>
        <td class="italic">
          Absicherung im Krankheitsfall und soziale Absicherung im
          Beschäftigungsfall
        </td>
      </tr>

      <tr>
        <td>
          &#10004;
        </td>
        <td class="italic">
          gesundheitliche und soziale Beratungsangebote einschl. zur
          Schwangerschaft
        </td>
      </tr>

      <tr>
        <td>
          &#10004;
        </td>
        <td class="italic">
          Erreichbarkeit von Hilfen in Notsituationen
        </td>
      </tr>

      <tr>
        <td>
          &#10004;
        </td>
        <td class="italic">
          bestehende Steuerpflicht der aufgenommenen Tätigkeit
        </td>
      </tr>
    </table>

    <div style="margin-top: 10mm">
      Die Informationen wurden gemäß § 7 Abs. 3 ProstSchG übermittelt:
    </div>


    <table style="width: 100%; margin-top: 5mm">
      <colgroup>
        <col style="width: 5%;"/>
        <col style="width: 95%;"/>
      </colgroup>

      <tr>
        <td>
          <@checkbox.content checked=inLanguageOfConsultant />
        </td>
        <td class="italic">
          in einer vom/von Berater/in beherrschten Sprache
        </td>
      </tr>

      <tr>
        <td>
          <@checkbox.content checked=interpreterConsulted />
        </td>
        <td class="italic">
          mit Dolmetscher
        </td>
      </tr>
    </table>

    <@date_and_signature.content date=dateOfConsultation labelSignature="Unterschrift der/des Beratenden" />
  </div>
</@base.document>
