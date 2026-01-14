<#import "common/base.ftlh" as base />
<#import "common/letterhead.ftlh" as letterhead />
<#import "common/footer.ftlh" as footer />
<#import "common/checkbox.ftlh" as checkbox />
<#import "common/date_and_signature_line.ftlh" as date_and_signature />

<#macro additionalStyle>
  .headline {
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

  .right-half {
      width: 50%;
      margin-left: auto;
      margin-top: 6mm;
  }

</#macro>



<@base.document title="§ 10 mit Gesundheitsbescheinigung" styles=[
additionalStyle,
footer.style
]>
  <@footer.content department=department />
  <@letterhead.content person=person department=department extraLine="Ausgewiesen durch: ${idDocument}"/>

  <div class="body">
    <div>
      <div class="headline">Dokumentation über die gesundheitliche Beratung gemäß § 10</div>
      <div class="headline">Prostituiertenschutzgesetz (ProstSchG)</div>
    </div>

    <div style="margin-top: 3mm">
      Hiermit erkläre ich, dass ich gemäß § 10 Abs. 2 Prostituiertenschutzgesetz
      auf die Vertraulichkeit der Beratung hingewiesen wurde. Eine gesonderte
      Information zum Datenschutz nach § 34 ProstSchG, dem Umgang und
      Löschfristen meiner personenbezogenen Daten wurde mir vorgelegt/ auf
      Wunsch ausgehändigt
    </div>

    <@date_and_signature.content date=dateOfConsultation labelSignature="Unterschrift der/des Beratenden" />

    <div style="margin-top: 10mm">
      Ich bin mit dem Hinzuziehen einer Sprachmittlerin/eines Sprachmittlers
      einverstanden.
    </div>

    <@date_and_signature.content date=dateOfConsultation labelSignature="Unterschrift der/des Beratenden" />

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
          Weitere Anmerkungen des Beratenden:
        </td>
      </tr>

      <tr>
        <td>
          <@checkbox.content checked=true /><span class="italic">Fragen der Krankheitsverhütung</span>
        </td>
        <td>
          <@checkbox.content checked=referral /><span class="italic">Weiterverweis an Maßnahmen nach § 19 lfSG</span>
        </td>
      </tr>

      <tr>
        <td>
          <@checkbox.content checked=true /><span class="italic">Fragen der Empfängnisregelung</span>
        </td>
        <td>
          <@checkbox.content checked=clearing /><span class="italic">Offenbarung Zwangslage / Notlage</span>
        </td>
      </tr>

      <tr>
        <td>
          <@checkbox.content checked=true /><span class="italic">Fragen der Schwangerschaft</span>
        </td>
        <td>
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

    <div style="margin-top: 3mm">
      Die Bescheinigung über die gesundheitliche Beratung wurde ausgestellt.
    </div>

    <@date_and_signature.content date=dateOfConsultation labelSignature="Unterschrift der/des Beratenden" />


    <table class="right-half">
      <colgroup>
        <col style="width: 50%;"/>
        <col style="width: 50%;"/>
      </colgroup>

      <tr>
        <td colspan="2" class="small-font" style="text-align: center">
          ${department.name}
        </td>
      </tr>

      <tr>
        <td colspan="2" class="small-font" style="text-align: center">
          ${department.street}, ${department.zipCode} ${department.city}
        </td>
      </tr>

      <tr>
        <td colspan="2" class="font-bold-center">
          Bescheinigung
        </td>
      </tr>

      <tr>
        <td colspan="2" class="small-font" style="text-align: center">
          über die gesundheitliche Beratung nach § 10 ProstSchG
        </td>
      </tr>

      <tr>
        <td>
         <#if person.alias?has_content>
           ${person.alias}<br/>
           <span class="small-font">Alias</span>
           <#else>
           ${person.firstName}, ${person.lastName}<br/>
           <span class="small-font">Vorname, Nachname</span>
          </#if>
        </td>
        <td>${dateValidTo}<br/>
        <span class="small-font">Gültig bis</span>
        </td>
      </tr>

      <#if !person.alias?has_content>
        <tr>
          <td>
            ${person.dateOfBirth}<br/>
            <span class="small-font">Geburtsdatum</span>
          </td>
          <td>
          </td>
        </tr>
      </#if>

      <tr>
        <td>
          ${dateOfConsultation}<br/>
          <span class="small-font">Datum der Beratung</span>
        </td>
        <td class="small-font">
          <br/>
          <div style="width: 80%;" class="signature-line">&#160;</div>
                  Siegel + Unterschrift
        </td>
      </tr>
    </table>
  </div>
</@base.document>
