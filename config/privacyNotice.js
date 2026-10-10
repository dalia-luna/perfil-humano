const NOTICE_VERSION = '1.0';
const EFFECTIVE_DATE = '2026-10-10';

function env(name, fallback) {
  return process.env[name] || fallback;
}

function getNoticeData() {
  return {
    version: NOTICE_VERSION,
    effectiveDate: EFFECTIVE_DATE,

    // IMPORTANTE: configura estos tres valores antes de publicar en producción.
    responsibleName: env(
      'PRIVACY_RESPONSIBLE_NAME',
      '[CONFIGURAR NOMBRE DEL RESPONSABLE]'
    ),
    responsibleAddress: env(
      'PRIVACY_RESPONSIBLE_ADDRESS',
      '[CONFIGURAR DOMICILIO DEL RESPONSABLE]'
    ),
    arcoEmail: env(
      'PRIVACY_ARCO_EMAIL',
      '[CONFIGURAR CORREO PARA DERECHOS ARCO]'
    ),

    projectName: 'Perfil Humano Digital (PHD)',

    dataCategories: [
      'Datos de cuenta necesarios para identificar al usuario dentro de la plataforma.',
      'Características físicas y morfológicas proporcionadas mediante el cuestionario, tales como estatura, complexión o peso por rango, cabello, rostro, tez, ojos, nariz, boca y demás atributos incluidos en el instrumento.',
      'El vector categórico o perfil digital derivado de las respuestas al cuestionario.',
      'Resultados computacionales derivados del perfil, tales como medidas de similitud, distancias, agrupamientos y resultados de recuperación.'
    ],

    sensitiveDataStatement:
      'Determinados datos o combinaciones de atributos físicos pueden recibir tratamiento reforzado cuando, por su naturaleza o uso, puedan considerarse datos personales sensibles o sean utilizados para caracterización o individualización de una persona.',

    primaryPurposes: [
      'Realizar investigación científica relacionada con la caracterización computacional de rasgos físicos humanos.',
      'Construir y analizar perfiles digitales categóricos.',
      'Calcular medidas de similitud y distancia entre perfiles.',
      'Realizar agrupamiento, recuperación de perfiles y evaluación de métodos computacionales.',
      'Generar resultados estadísticos, académicos y científicos.',
      'Elaborar tesis, artículos, ponencias, informes y otros productos académicos procurando utilizar información disociada o presentada de forma que no identifique directamente a los participantes.'
    ],

    retention:
      'Los datos se conservarán únicamente durante el tiempo necesario para cumplir las finalidades de investigación y las obligaciones aplicables. Cuando dejen de ser necesarios, se aplicarán las medidas de bloqueo, supresión o disociación que correspondan.',

    security:
      'Se aplicarán medidas administrativas, técnicas y físicas razonables para proteger la información contra pérdida, alteración, destrucción, acceso, uso o divulgación no autorizados.',

    transfers:
      'Los datos personales no serán transferidos a terceros para finalidades distintas de las aquí descritas sin contar con una base jurídica aplicable y, cuando corresponda, con el consentimiento de la persona titular. Los resultados científicos procurarán presentarse de forma disociada.',

    arco:
      'La persona titular puede solicitar acceso, rectificación, cancelación u oposición al tratamiento de sus datos personales, así como solicitar la revocación de su consentimiento, mediante el correo indicado en este aviso. La solicitud deberá contener la información necesaria para identificar al titular y precisar el derecho que desea ejercer.',

    limitation:
      'La persona titular puede solicitar la limitación del uso o divulgación de sus datos mediante el mismo medio establecido para el ejercicio de derechos ARCO.',

    changes:
      'Las modificaciones al presente aviso se comunicarán mediante la propia plataforma. Cuando una modificación implique nuevas finalidades que requieran consentimiento, se solicitará nuevamente la aceptación de la persona titular.',

    voluntary:
      'La participación es voluntaria. Si la persona no otorga su consentimiento, no podrá continuar con el cuestionario de investigación.',

    consentStatement:
      'He leído el Aviso de Privacidad, entiendo las finalidades descritas y otorgo de manera libre, específica, informada y expresa mi consentimiento para el tratamiento de mis datos personales y, cuando corresponda por su naturaleza o utilización, de datos personales sensibles, para las finalidades de investigación del Perfil Humano Digital.'
  };
}

function noticeAsPlainText(data = getNoticeData()) {
  return [
    `AVISO DE PRIVACIDAD INTEGRAL - ${data.projectName}`,
    `Versión: ${data.version}`,
    `Vigencia: ${data.effectiveDate}`,
    '',
    `Responsable: ${data.responsibleName}`,
    `Domicilio: ${data.responsibleAddress}`,
    `Correo ARCO: ${data.arcoEmail}`,
    '',
    'DATOS TRATADOS',
    ...data.dataCategories.map(x => `- ${x}`),
    '',
    'DATOS SENSIBLES',
    data.sensitiveDataStatement,
    '',
    'FINALIDADES',
    ...data.primaryPurposes.map(x => `- ${x}`),
    '',
    'CONSERVACIÓN',
    data.retention,
    '',
    'SEGURIDAD',
    data.security,
    '',
    'TRANSFERENCIAS',
    data.transfers,
    '',
    'DERECHOS ARCO Y REVOCACIÓN',
    data.arco,
    '',
    'LIMITACIÓN DE USO O DIVULGACIÓN',
    data.limitation,
    '',
    'CAMBIOS AL AVISO',
    data.changes,
    '',
    'PARTICIPACIÓN VOLUNTARIA',
    data.voluntary,
    '',
    'DECLARACIÓN DE CONSENTIMIENTO',
    data.consentStatement
  ].join('\n');
}

module.exports = {
  NOTICE_VERSION,
  EFFECTIVE_DATE,
  getNoticeData,
  noticeAsPlainText
};
