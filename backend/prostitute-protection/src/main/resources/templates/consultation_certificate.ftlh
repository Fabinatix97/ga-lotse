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
    margin-top: 3mm;
  }

  .signature-line {
    border-bottom: 1px solid black;
    height: 1px;
    vertical-align: bottom;
  }

  .small-font {
    font-size: 7pt;
    font-weight: 400;
    line-height: 1.5em;
  }

  .font-bold-center {
    font-size: 9pt;
    font-weight: 700;
    line-height: 1.5em;
    text-align: center;
  }
</#macro>

<@base.document title="§ 10 mit Gesundheitsbescheinigung" styles=[
additionalStyle,
footer.style
]>
  <@footer.content department=department />

  <div class="body">
    <table style="width: 100%;">
      <colgroup>
        <col style="width: 35%;"/>
        <col style="width: 25%;"/>
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
          Name: ${person.lastName}
        </td>
        <td colspan="2">
          Geburtsdatum: ${person.dateOfBirth}
        </td>
      </tr>

      <tr>
        <td>
          Vorname: ${person.firstName}
        </td>
        <td colspan="2">
          ausgewiesen durch: ${idDocument}
        </td>
        <td>
        </td>
      </tr>

      <tr>
        <td>
          ggf. Alias: ${person.alias!""}
        </td>
        <td colspan="2">
        </td>
      </tr>
    </table>

    <div>
      <div class="headline">Dokumentation über die gesundheitliche Beratung
      </div>
      <div class="headline">gemäß § 10 Prostituiertenschutzgesetz (ProstSchG)
      </div>
    </div>

    <div style="margin-top: 3mm">
      Hiermit erkläre ich, dass ich gemäß § 10 Abs. 2 Prostituiertenschutzgesetz
      auf die Vertraulichkeit der Beratung hingewiesen wurde. Eine gesonderte
      Information zum Datenschutz nach § 34 ProstSchG, dem Umgang und
      Löschfristen meiner personenbezogenen Daten wurde mir vorgelegt/ auf
      Wunsch ausgehändigt
    </div>

    <@date_and_signature.content date=dateOfConsultation labelSignature="Unterschrift der beratenen Person" />

    <div style="margin-top: 10mm">
      Ich bin mit dem Hinzuziehen einer Sprachmittlerin/eines Sprachmittlers
      einverstanden.
    </div>

    <@date_and_signature.content date=dateOfConsultation labelSignature="Unterschrift der beratenen Person" />

    <table style="width: 100%; margin-top: 5mm">
      <colgroup>
        <col style="width: 50%;"/>
        <col style="width: 50%;"/>
      </colgroup>

      <tr>
        <td>
          Beratungsinhalte:
        </td>
        <td>
        </td>
      </tr>

      <tr>
        <td>
          <@checkbox.content checked=true /><span class="italic">Fragen der Krankheitsverhütung</span>
        </td>
        <td>
          Weitere Anmerkungen des Beratenden:
        </td>
      </tr>

      <tr>
        <td>
          <@checkbox.content checked=true /><span class="italic">Fragen der Empfängnisregelung</span>
        </td>
        <td>
          <@checkbox.content checked=true /><span class="italic">Weiterverweis an Maßnahmen nach § 19 lfSG</span>
        </td>
      </tr>

      <tr>
        <td>
          <@checkbox.content checked=true /><span class="italic">Fragen der Schwangerschaft</span>
        </td>
        <td>
          <@checkbox.content checked=true /><span class="italic">Offenbarung Zwangslage / Notlage</span>
        </td>
      </tr>

      <tr>
        <td>
          <@checkbox.content checked=true /><span class="italic">Risiken des Alkohol - und Drogengebrauchs</span>
        </td>
        <td>
        </td>
      </tr>
    </table>

    <div style="width: 100%; margin-top: 1mm;" class="signature-line">&#160;
    </div>
    <div style="width: 100%; margin-top: 5mm;" class="signature-line">&#160;
    </div>

    <div style="margin-top: 3mm">
      Die Bescheinigung über die gesundheitliche Beratung wurde ausgestellt.
    </div>

    <@date_and_signature.content date=dateOfConsultation labelSignature="Unterschrift des Beratenden" />

    <table style="width: 100%; margin-top: 2mm;">
      <colgroup>
        <col style="width: 35%;"/>
        <col style="width: 40%;"/>
        <col style="width: 25%;"/>
      </colgroup>

      <tr>
        <td></td>
        <td colspan="2" class="small-font" style="text-align: center">
          ${department.name}
        </td>
      </tr>

      <tr>
        <td></td>
        <td colspan="2" class="small-font" style="text-align: center">
          ${department.street}, ${department.zipCode} ${department.city}
        </td>
      </tr>

      <tr>
        <td></td>
        <td colspan="2" class="font-bold-center">
          Bescheinigung
        </td>
      </tr>

      <tr>
        <td></td>
        <td colspan="2" class="small-font" style="text-align: center">
          über die gesundheitliche Beratung nach § 10 ProstSchG
        </td>
      </tr>

      <tr>
        <td></td>
        <td style="text-align: center;">
          ${person.lastName}, ${person.firstName}
        </td>
        <td></td>
      </tr>

      <tr>
        <td></td>
        <td class="small-font" style="text-align: center; padding-top: 2px; padding-bottom: 8px;">
          Name, Vorname
        </td>
        <td></td>
      </tr>

      <tr>
        <td></td>
        <td style="text-align: center;">
          ${person.dateOfBirth}
        </td>
        <td>
          <div style="width: 100%;" class="signature-line">&#160;</div>
        </td>
      </tr>

      <tr>
        <td></td>
        <td class="small-font" style="text-align: center; padding-top: 2px; padding-bottom: 8px;">
          Geburtsdatum
        </td>
        <td class="small-font" style="text-align: center; padding-top: 2px; padding-bottom: 8px;">
          Siegel + Unterschrift
        </td>
      </tr>

      <tr>
        <td></td>
        <td style="text-align: center;">
          ${dateOfConsultation}
        </td>
        <td></td>
      </tr>

      <tr>
        <td></td>
        <td class="small-font" style="text-align: center; padding-top: 2px; padding-bottom: 8px;">
          Datum der Beratung
        </td>
        <td>
          <span style="font-size: 7pt;
            font-weight: 400;
            line-height: 1.5em;">Gültig bis &#160;</span>
          <span>${dateValidTo}</span>
        </td>
      </tr>
    </table>
  </div>
</@base.document>
