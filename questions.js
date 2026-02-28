// questions.js

const { image } = require("pdfkit");

// Tipo 1: select (comboBox con muchas opciones)
// Tipo 2: radio (2 o 3 opciones)

// Por ahora: 10 preguntas de ejemplo.
// Después puedes seguir agregando hasta tener 256 preguntas en total.

const questions = [
  // 1) SELECT
  {
    id: 1,
    type: 'select',
    text: 'Selecciona en qué rango de estatura te encuentras.',
    image: '/img/questions/pregunta1.png',
    options: [
      'No disponible',
      'Menos de 70 cm',
      'De 71 cm a 80 cm',
      'De 81 cm a 90 cm',
      'De 91 cm a 100 cm',
      'De 101 cm a 110 cm',
      'De 111 cm a 120 cm',
      'De 121 cm a 130 cm',
      'De 131 cm a 140 cm',
      'De 141 cm a 150 cm',
      'De 151 cm a 160 cm',
      'De 161 cm a 170 cm',
      'De 171 cm a 180 cm',
      'De 181 cm a 190 cm',
      'De 191 cm a 200 cm',
      'Más de 201 cm'
    ]
  },
  {
    id: 2,
    type: 'select',
    text: 'Selecciona en qué rango de peso estás:',
    image: '/img/questions/pregunta2.png',
    options: [
      'No disponible',
      'Menos de 10 kg',
      'De 11 kg  a 20 kg',
      'De 21 kg a 30 kg',
      'De 31 kg a 40 kg',
      'De 41 kg a 50 kg',
      'De 51 kg a 60',
      'De 61 kg a 70 kg',
      'De 71 kg a 80 kg',
      'De 81 kg a 90 kg',
      'De 91 kg a 100 kg',
      'De 101 kg a 110 kg',
      'De 111 kg a 120 kg',
      'De 121 kg a 130 kg',
      'De 131 kg a 140 kg',
      'Más de 141 kg'
    ]
  },
  {
    id: 3,
    type: 'select',
    text: 'Selecciona el rango de edad en el que estás',
    options: [
      'No disponible',
      'Menos de 5 años',
      'De 6 años a 10 años',
      'De 11 años a 15 años',
      'De 16 años a 20 años',
      'De 21 años a 30 años',
      'De 31 años a 40 años',
      'De 41 años a 50 años',
      'De 51 años a 60 años',
      'De 61 años a 70 años',
      'De 71 años a 80 años',
      'De 81 años a 90 años',
      'De '

    ]
  },
  {
    id: 4,
    type: 'radio',
    text: 'Selecciona tu género',
    image: '/img/questions/pregunta4.png',
    options: [
      'No disponible',
      'Femenino',
      'Masculino'
    ]
  },
  {
    id: 5,
    type: 'select',
    text: 'Selecciona si te hace algún miembro o extremidad en tu cuerpo',
    options: [
      'Sin falta',
      'Mama',
      'Pene',
      'Testículos',
      'Hombro',
      'Brazo',
      'Antebrazo',
      'Mano',
      'Dedo Pulgar',
      'Dedo Indice',
      'Dedo Medio',
      'Dedo Anular',
      'Dedo Meñique',
      'Muslo',
      'Pierna',
      'Pie',
      'Dedo Gordo del Pie',
      'Segundo Dedo del Pie',
      'Tercer Dedo del Pie',
      'Cuarto Dedo del Pie',
      'Quinto Dedo del Pie',
      'Orejas',
      'Ojo',
      'Nariz',
      'Labio'
    ]
  },

  // 2) RADIO (2 o 3 opciones)
  {
    id: 6,
    type: 'select',
    text: 'Selecciona el largo de tu cabello',
    image: '/img/questions/pregunta6.png',
    options: [
      'Sin cabello',
      'Rasurado',
      '0.5 cm',
      '1.5 cm ',
      '4.5 cm',
      'Nuca',
      'Hombros',
      'A media espalda',
      'A la cintura'
    ]
  },
  {
    id: 7,
    type: 'select',
    text: 'Selecciona tu tipo de cabello',
    image: '/img/questions/pregunta7.png',
    options: [
      'No disponible',
      'Liso',
      'Ondulado',
      'Rizado',
      'Crespo',
      'Rastas',
      'Trenzas Africanas',
      'Dreadlocks'
    ]
  },
  {
    id: 8,
    type: 'select',
    text: 'Selecciona el color de tu cabello natural',
    image: '/img/questions/pregunta8.png',
    options: [
      'No disponible',
      'Negro',
      'Castaño Oscuro',
      'Castaño Claro',
      'Rubio',
      'Pelirojo',
      'Canoso'
    ]
  },
  {
    id: 9,
    type: 'select',
    text: 'Selecciona si tu cabello tiene un proceso de coloración artificial',
    image: '/img/questions/pregunta9.png',
    options: [
      'Sin Proceso',
      'Decolorado',
      'Negro',
      'Castaño Oscuro',
      'Castaño Claro',
      'Rubio',
      'Pelirojo',
      'Amarillo',
      'Verde',
      'Azul',
      'Rosa',
      'Morado',
      'Naranja',
      'Blanco'
    ]
  },
  {
    id: 10,
    type: 'select',
    text: 'Selecciona la forma de tu rostro',
    image: '/img/questions/pregunta10.png',
    options: [
      'No disponible',
      'Ovalado',
      'Redondo',
      'Cuadrado',
      'Rectangular',
      'Corazon',
      'Triangular',
      'Diamante',
      'Alargado'
    ]
  },
  {
    id: 11,
    type: 'select',
    text: 'Selecciona tu tez',
    image: '/img/questions/pregunta11.png',
    options: [
      'No disponible',
      'Muy Clara',
      'Clara',
      'Intermedia',
      'Morena',
      'Muy Morena'
    ]
  },
  {
    id: 12,
    type: 'select',
     text: 'Selecciona el tipo de neutralidad de tez',
    image: '/img/questions/pregunta12.png',
    options: [
      'No disponible',
      'Neutra',
      'Fría',
      'Cálida'
    ]
  },
  {
    id: 13,
    type: 'select',
    text: 'Selecciona el tipo del color de Tez',
    image: '/img/questions/pregunta13.jpg',
    options: [
      'No disponible',
      'Rosa',
      'Amarilla',
      'Durazno',
      'Oliva',
      'Cobriza',
      'Marrón',
      'Caramelo'
    ]
  },
  {
    id: 14,
    type: 'select',
    text: 'Selecciona si presenta pecas en el rostro',
    image: '/img/questions/pregunta14.jpg',
    options: [
      'No disponible',
      'Sin Pecas',
      'Pocas Pecas',
      'Muchas Pecas'
    ]
  },
  {
    id: 15,
    type: 'select',
    text: 'Selecciona si presenta lunares (Rostro)',
    image: '/img/questions/pregunta15.jpg',    
    options: [
      'No disponible',
      'Sin Lunares',
      'Pocos Lunares',
      'Muchos Lunares'
    ]
  },
  {
    id: 16,
    type: 'select',
    text: 'Selecciona el color de ojos',
    image: '/img/questions/pregunta16.jpg',    
    options: [
      'No disponible',
      'Negro',
      'Café Oscuro',
      'Café Claro',
      'Verde',
      'Azul',
      'Gris',
      'Miel',
      'Avellana',
      'Otro'
    ]
  },
  {
    id: 17,
    type: 'select',
    text: 'Selecciona la forma de los ojos',
    image: '/img/questions/pregunta17.jpg',
    options: [
      'No disponible',
      'Almendrados',
      'Redondos',
      'Rasgados',
      'Profundos',
      'Caídos',
      'Saltones',
      'Separados',
      'Juntos'
    ]
  },
  {
    id: 18,
    type: 'select',
    text: 'Seleccion el tipo de cejas',
    image: '/img/questions/pregunta18.jpg',
    options: [
      'No disponible',
      'Delgadas',
      'Gruesas',
      'Rectas',
      'Curvas',
      'Arqueadas',
      'Pobladas',
      'Escasas',
      'Sin Cejas'
    ]
  },
  {
    id: 19,
    type: 'select',
    text: 'Selecciona el tipo de pestañas',
    image: '/img/questions/pregunta19.jpg',
    options: [
      'No disponible',
      'Cortas',
      'Medianas',
      'Largas',
      'Rectas',
      'Rizadas',
      'Escasas',
      'Pobladas'
    ]
  },
  {
    id: 20,
    type: 'select',
    text: 'Selecciona el tipo de nariz',
    image:'/img/questions/pregunta20.jpg',
    options: [
      'No disponible',
      'Recta',
      'Aguileña',
      'Ancha',
      'Respingada',
      'Chata',
      'Curva',
      'Pequeña',
      'Grande'
    ]
  },
  {
    id: 21,
    type: 'select',
    text: 'Selecciona el tipo de Labios',
    image:'/img/questions/pregunta21.jpg',
    options: [
      'No disponible',
      'Delgados',
      'Gruesos',
      'Intermedios',
      'Superio grueso e inferior delgado',
      'Superior delgado e inferior grueso'
    ]
  },
  {
    id: 22,
    type: 'select',
    text: 'Selecciona el estilo de dientes',
    image:'/img/questions/pregunta22.jpg',
    options: [
      'No disponible',
      'Rectos',
      'Chuecos',
      'Separados',
      'Juntos',
      'Manchados',
      'Blancos',
      'Amarillos'
    ]
  },
  {
    id: 23,
    type: 'select',
    text: 'Selecciona el tipo de bello facil (Barba/Bigote)',
    image:'/img/questions/pregunta23.jpg',    
    options: [
      'No disponible',
      'Sin Barba/Bigote',
      'Barba Completa',
      'Bigote',
      'Barba de Candado',
      'Barba de Chiva',
      'Barba larga',
      'Barba muy larga'

    ]
  },
  {
    id: 24,
    type: 'select',
    text: 'Selecciona la forma de las orejas',
    image:'/img/questions/pregunta24.jpg', 
    options: [
      'No disponible',
      'Pequeñas',
      'Medianas',
      'Grandes',
      'Pegadas',
      'Despegadas'
    ]
  },
  {
    id: 25,
    type: 'select',
    text: 'Selecciona la forma del cuello',
    image:'/img/questions/pregunta25.jpg',
    options: [
      'No disponible',
      'Corto',
      'Largo',
      'Delgado',
      'Grueso'
    ]
  },
  {
    id: 26,
    type: 'select',
    text: 'Selecciona la forma de los hombros',
    image:'/img/questions/pregunta26.png',
    options: [
      'No disponible',
      'Angostos',
      'Intermedios',
      'Anchos',
      'Caídos',
      'Rectos'
    ]
  },
  {
    id: 27,
    type: 'select',
    text: 'Selecciona la forma de los brazos',
    image:'/img/questions/pregunta27.png',
    options: [
      'No disponible',
      'Delgados',
      'Intermedios',
      'Musculosos',
      'Largos',
      'Cortos'
    ]
  },
  {
    id: 28,
    type: 'select',
    text: 'Selecciona la forma de las manos',
    image:'/img/questions/pregunta28.png',
    options: [
      'No disponible',
      'Pequeñas',
      'Medianas',
      'Grandes',
      'Delgadas',
      'Gruesas'
    ]
  },
  {
    id: 29,
    type: 'select',
    text: 'Selecciona la forma de los dedos de la mano',
    image:'/img/questions/pregunta29.png',
    options: [
      'No disponible',
      'Cortos',
      'Largos',
      'Delgados',
      'Gruesos'
    ]
  },
  {
    id: 30,
    type: 'select',
    text: 'Selecciona la forma de las uñas (Manos)',
    image:'/img/questions/pregunta30.png',
    options: [
      'No disponible',
      'Cortas',
      'Largas',
      'Cuadradas',
      'Redondas',
      'Ovaladas',
      'Naturales',
      'Esmaltadas'
    ]
  },
  {
    id: 31,
    type: 'select',
    text: 'Selecciona el tipo de torso',
    image:'/img/questions/pregunta31.png',
    options: [
      'No disponible',
      'Delgado',
      'Intermedio',
      'Ancho',
      'Musculoso'
    ]
  },
  {
    id: 32,
    type: 'select',
    text: 'Selecciona la forma del pecho (general)',
    image:'/img/questions/pregunta32.png',
    options: [
      'No disponible',
      'Plano',
      'Intermedio',
      'Marcado',
      'Voluminoso'
    ]
  },
  {
    id: 33,
    type: 'select',
    text: 'Selecciona el tipo abdomen',
    image:'/img/questions/pregunta33.png',   
    options: [
      'No disponible',
      'Plano',
      'Intermedio',
      'Abultado'
    ]
  },
  {
    id: 34,
    type: 'select',
    text: 'Selecciona la forma de la cintura',
    image:'/img/questions/pregunta34.png',
    options: [
      'No disponible',
      'Marcada',
      'Poco Marcada',
      'No Marcada'
    ]
  },
  {
    id: 35,
    type: 'select',
    text: 'Selecciona la forma de las caderas',
    image:'/img/questions/pregunta35.png',  
    options: [
      'No disponible',
      'Angostas',
      'Intermedias',
      'Anchas'
    ]
  },
  {
    id: 36,
    type: 'select',
    text: 'Selecciona la forma de glúteos',
    image:'/img/questions/pregunta36.png',
    options: [
      'No disponible',
      'Planos',
      'Intermedios',
      'Voluminosos'
    ]
  },
  {
    id: 37,
    type: 'select',
    text: 'Selecciona la forma de las piernas',
    image:'/img/questions/pregunta37.png',
    options: [
      'No disponible',
      'Delgadas',
      'Intermedias',
      'Musculosas',
      'Cortas',
      'Largas'
    ]
  },
  {
    id: 38,
    type: 'select',
    text: 'Selecciona el tipo/forma de las rodillas',
    image:'/img/questions/pregunta38.png',
    options: [
      'No disponible',
      'Rectas',
      'Genu varo (piernas arqueadas)',
      'Genu valgo (rodillas juntas)'
    ]
  },
  {
    id: 39,
    type: 'select',
    text: 'Selecciona el tipo/forma de los tobillos',
    image:'/img/questions/pregunta39.png',
    options: [
      'No disponible',
      'Delgados',
      'Intermedios',
      'Gruesos'
    ]
  },
  {
    id: 40,
    type: 'select',
    text: 'Selecciona la forma de los pies',
    image:'/img/questions/pregunta40.png',
    options: [
      'No disponible',
      'Pequeños',
      'Medianos',
      'Grandes',
      'Delgados',
      'Anchos'
    ]
  },
  {
    id: 41,
    type: 'select',
    text: 'Selecciona la forma de las uñas (Pies)',
    image:'/img/questions/pregunta41.jpg',
    options: [
      'No disponible',
      'Cortas',
      'Largas',
      'Naturales',
      'Esmaltadas'
    ]
  },
  {
    id: 42,
    type: 'select',
    text: 'Selecciona la existencia de lunares (rostro)',
    image:'/img/questions/pregunta42.png',
    options: [
      'No disponible',
      'Sin Lunar',
      'En la Frente',
      'En la Mejilla Derecha',
      'En la Mejilla Izquierda',
      'En la Barbilla',
      'En la Nariz',
      'En el Labio Superior',
      'En otro lugar del rostro'
    ]
  },
  {
    id: 43,
    type: 'select',
    text: 'Selecciona la existencia de cicatrices (Rostro)',
    image:'/img/questions/pregunta43.jpg',
    options: [
      'No disponible',
      'Sin Cicatrices',
      'Cicatriz en la Frente',
      'Cicatriz en la Mejilla Derecha',
      'Cicatriz en la Mejilla Izquierda',
      'Cicatriz en la Barbilla',
      'Otras Cicatrices en el Rostro'
    ]
  },
  {
    id: 44,
    type: 'select',
    text: 'Selecciona la presencia de cicatrices (Cuerpo)',
    image:'/img/questions/pregunta44.jpg',
    options: [
      'No disponible',
      'Sin Cicatrices',
      'Cicatrices en Brazos',
      'Cicatrices en Piernas',
      'Cicatrices en Torso',
      'Cicatrices en Espalda',
      'Cicatrices en otras zonas'
    ]
  },
  {
    id: 45,
    type: 'select',
    text: 'Selecciona la presencia de tatuajes (Rostro)',
    image:'/img/questions/pregunta45.png',
    options: [
      'No disponible',
      'Sin Tatuajes',
      'Tatuaje Pequeño',
      'Tatuaje Mediano',
      'Tatuaje Grande'
    ]
  },
  {
    id: 46,
    type: 'select',
    text: 'Selecciona la presencia de tatuajes (Cuerpo)',
    image:'/img/questions/pregunta46.png',
    options: [
      'No disponible',
      'Sin Tatuajes',
      'Uno o dos tatuajes pequeños',
      'Varios tatuajes pequeños',
      'Tatuaje(s) mediano(s)',
      'Tatuaje(s) grande(s)',
      'Cuerpo muy tatuado'
    ]
  },
  {
    id: 47,
    type: 'select',
    text: 'Selecciona la presencia de perforaciones (Rostro)',
    image:'/img/questions/pregunta47.jpg',
    options: [
      'No disponible',
      'Sin Perforaciones',
      'Pantalla en la Nariz',
      'Pantallas en las Cejas',
      'Pantalla en el Labio'
    ]
  },
  {
    id: 48,
    type: 'select',
    text: 'Selecciona la presencia de perforaciones (Cuerpo)',
    image:'/img/questions/pregunta48.jpg',
    options: [
      'No disponible',
      'Sin Perforaciones',
      'Ombligo',
      'Pezones',
      'Genitales',
      'Otra zona del cuerpo'
    ]
  },
  {
    id: 49,
    type: 'select',
    text: 'Si posee accesorios, seleccione el tipo de material',
    image:'/img/questions/pregunta49.jpg',
    options: [
      'No disponible',
      'Fantasía',
      'Oro',
      'Plata'
    ]
  },

  {
    id: 50,
    type: 'select',
    text: 'Selecciona si existe accesorios en la cintura',
    image:'/img/questions/pregunta50.png',
    options: [
      'Sin Accesorios',
      'Cinturon',
      'Cinturilla',
      'Cadenas'
    ]
  },

  {
    id: 51,
    type: 'select',
    text: 'Si presenta accesorios y selecciona cuál es el material',
    image:'/img/questions/pregunta51.jpg',
    options: [
      'No disponible',
      'Cuero',
      'Tela',
      'Metal'
    ]
  },

  {
    id: 52,
    type: 'radio',
    text: 'Accesorios en tobillos',
    image:'/img/questions/pregunta52.jpg',
    options: [
      'Sin Accesorios',
      'Tobilleras',
      'Perforaciones'
    ]
  },

  {
    id: 53,
    type: 'select',
    text: 'Selecciona si presenta accesorios y el tipo de material',
    image:'/img/questions/pregunta53.jpg',
    options: [
      'No disponible',
      'Fantasía',
      'Oro',
      'Plata',
      'Hilo'
    ]
  },

  {
    id: 54,
    type: 'select',
    text: 'Selecciona si tiene una prótesis',
    image:'/img/questions/pregunta54.jpg',
    options: [
      'Sin prótesis',
      'Mama',
      'Pezón',
      'Oreja',
      'Nariz',
      'Ojo',
      'Brazo',
      'Mano',
      'Dedo Pulgar',
      'Dedo Indice',
      'Dedo Medio',
      'Dedo Anular',
      'Dedo Meñique',
      'Rodilla',
      'Pierna',
      'Pie',
      'Dedo Gordo del Pie',
      'Segundo Dedo del Pie',
      'Tercer Dedo del Pie',
      'Cuarto Dedo del Pie',
      'Quinto dedo del Pie',
      'Cadera'
    ]
  },

  {
    id: 55,
    type: 'radio',
    text: 'Selecciona el material de la prótesis',
    image:'/img/questions/pregunta55.jpg',
    options: [
      'No disponible',
      'Platino',
      'Titanio'
    ]
  },

  {
    id: 56,
    type: 'select',
    text: 'Selecciona si está usando Métodos Anticonceptivos',
    image:'/img/questions/pregunta56.jpg',
    options: [
      'Sin Método',
      'Implante subcutaneo',
      'DIU- hormonal',
      'DIU-Cobre'
    ]
  },

  {
    id: 57,
    type: 'select',
    text: 'Pieza dental 11',
    image:'/img/questions/pregunta57.jpg',
    options: [
      'Sin Pieza',
      'Sano',
      'Ausente',
      'Caries',
      'Amalgama',
      'Porcelana',
      'Implante',
      'Puente',
      'Incrustación',
      'Corona',
      'Fractura'
    ]
  },

  {
    id: 58,
    type: 'select',
    text: 'Pieza dental 12',
    image:'/img/questions/pregunta58.jpg',
    options: [
      'Sin Pieza',
      'Sano',
      'Ausente',
      'Caries',
      'Amalgama',
      'Porcelana',
      'Implante',
      'Puente',
      'Incrustación',
      'Corona',
      'Fractura'
    ]
  },

  {
    id: 59,
    type: 'select',
    text: 'Pieza dental 13',
    image:'/img/questions/pregunta59.jpg',
    options: [
      'Sin Pieza',
      'Sano',
      'Ausente',
      'Caries',
      'Amalgama',
      'Porcelana',
      'Implante',
      'Puente',
      'Incrustación',
      'Corona',
      'Fractura'
    ]
  },

  {
    id: 60,
    type: 'select',
    text: 'Pieza dental 14',
    image:'/img/questions/pregunta60.jpg',
    options: [
      'Sin Pieza',
      'Sano',
      'Ausente',
      'Caries',
      'Amalgama',
      'Porcelana',
      'Implante',
      'Puente',
      'Incrustación',
      'Corona',
      'Fractura'
    ]
  },

  {
    id: 61,
    type: 'select',
    text: 'Pieza dental 15',
    image:'/img/questions/pregunta61.jpg',
    options: [
      'Sin Pieza',
      'Sano',
      'Ausente',
      'Caries',
      'Amalgama',
      'Porcelana',
      'Implante',
      'Puente',
      'Incrustación',
      'Corona',
      'Fractura'
    ]
  },

  {
    id: 62,
    type: 'select',
    text: 'Pieza dental 16',
    image:'/img/questions/pregunta62.jpg',
    options: [
      'Sin Pieza',
      'Sano',
      'Ausente',
      'Caries',
      'Amalgama',
      'Porcelana',
      'Implante',
      'Puente',
      'Incrustación',
      'Corona',
      'Fractura'
    ]
  },

  {
    id: 63,
    type: 'select',
    text: 'Pieza dental 17',
    image:'/img/questions/pregunta63.jpg',
    options: [
      'Sin Pieza',
      'Sano',
      'Ausente',
      'Caries',
      'Amalgama',
      'Porcelana',
      'Implante',
      'Puente',
      'Incrustación',
      'Corona',
      'Fractura'
    ]
  },

  {
    id: 64,
    type: 'select',
    text: 'Pieza dental 18',
    image:'/img/questions/pregunta64.jpg',
    options: [
      'Sin Pieza',
      'Sano',
      'Ausente',
      'Caries',
      'Amalgama',
      'Porcelana',
      'Implante',
      'Puente',
      'Incrustación',
      'Corona',
      'Fractura'
    ]
  },

  {
    id: 65,
    type: 'select',
    text: 'Pieza dental 21',
    image:'/img/questions/pregunta65.jpg',
    options: [
      'Sin Pieza',
      'Sano',
      'Ausente',
      'Caries',
      'Amalgama',
      'Porcelana',
      'Implante',
      'Puente',
      'Incrustación',
      'Corona',
      'Fractura'
    ]
  },

  {
    id: 66,
    type: 'select',
    text: 'Pieza dental 22',
    image:'/img/questions/pregunta66.jpg',
    options: [
      'Sin Pieza',
      'Sano',
      'Ausente',
      'Caries',
      'Amalgama',
      'Porcelana',
      'Implante',
      'Puente',
      'Incrustación',
      'Corona',
      'Fractura'
    ]
  },

  {
    id: 67,
    type: 'select',
    text: 'Pieza dental 23',
    image:'/img/questions/pregunta67.jpg',
    options: [
      'Sin Pieza',
      'Sano',
      'Ausente',
      'Caries',
      'Amalgama',
      'Porcelana',
      'Implante',
      'Puente',
      'Incrustación',
      'Corona',
      'Fractura'
    ]
  },

  {
    id: 68,
    type: 'select',
    text: 'Pieza dental 24',
    image:'/img/questions/pregunta68.jpg',
    options: [
      'Sin Pieza',
      'Sano',
      'Ausente',
      'Caries',
      'Amalgama',
      'Porcelana',
      'Implante',
      'Puente',
      'Incrustación',
      'Corona',
      'Fractura'
    ]
  },

  {
    id: 69,
    type: 'select',
    text: 'Pieza dental 25',
    image:'/img/questions/pregunta69.jpg',
    options: [
      'Sin Pieza',
      'Sano',
      'Ausente',
      'Caries',
      'Amalgama',
      'Porcelana',
      'Implante',
      'Puente',
      'Incrustación',
      'Corona',
      'Fractura'
    ]
  },

  {
    id: 70,
    type: 'select',
    text: 'Pieza dental 26',
    image:'/img/questions/pregunta70.jpg',
    options: [
      'Sin Pieza',
      'Sano',
      'Ausente',
      'Caries',
      'Amalgama',
      'Porcelana',
      'Implante',
      'Puente',
      'Incrustación',
      'Corona',
      'Fractura'
    ]
  },

  {
    id: 71,
    type: 'select',
    text: 'Pieza dental 27',
    image:'/img/questions/pregunta71.jpg',
    options: [
      'Sin Pieza',
      'Sano',
      'Ausente',
      'Caries',
      'Amalgama',
      'Porcelana',
      'Implante',
      'Puente',
      'Incrustación',
      'Corona',
      'Fractura'
    ]
  },

  {
    id: 72,
    type: 'select',
    text: 'Pieza dental 28',
    image:'/img/questions/pregunta72.jpg',
    options: [
      'Sin Pieza',
      'Sano',
      'Ausente',
      'Caries',
      'Amalgama',
      'Porcelana',
      'Implante',
      'Puente',
      'Incrustación',
      'Corona',
      'Fractura'
    ]
  },

  {
    id: 73,
    type: 'select',
    text: 'Pieza dental 31',
    image:'/img/questions/pregunta73.jpg',
    options: [
      'Sin Pieza',
      'Sano',
      'Ausente',
      'Caries',
      'Amalgama',
      'Porcelana',
      'Implante',
      'Puente',
      'Incrustación',
      'Corona',
      'Fractura'
    ]
  },

  {
    id: 74,
    type: 'select',
    text: 'Pieza dental 32',
    image:'/img/questions/pregunta74.jpg',
    options: [
      'Sin Pieza',
      'Sano',
      'Ausente',
      'Caries',
      'Amalgama',
      'Porcelana',
      'Implante',
      'Puente',
      'Incrustación',
      'Corona',
      'Fractura'
    ]
  },

  {
    id: 75,
    type: 'select',
    text: 'Pieza dental 33',
    image:'/img/questions/pregunta75.jpg',
    options: [
      'Sin Pieza',
      'Sano',
      'Ausente',
      'Caries',
      'Amalgama',
      'Porcelana',
      'Implante',
      'Puente',
      'Incrustación',
      'Corona',
      'Fractura'
    ]
  },

  {
    id: 76,
    type: 'select',
    text: 'Pieza dental 34',
    image:'/img/questions/pregunta76.jpg',
    options: [
      'Sin Pieza',
      'Sano',
      'Ausente',
      'Caries',
      'Amalgama',
      'Porcelana',
      'Implante',
      'Puente',
      'Incrustación',
      'Corona',
      'Fractura'
    ]
  },

  {
    id: 77,
    type: 'select',
    text: 'Pieza dental 35',
    image:'/img/questions/pregunta77.jpg',
    options: [
      'Sin Pieza',
      'Sano',
      'Ausente',
      'Caries',
      'Amalgama',
      'Porcelana',
      'Implante',
      'Puente',
      'Incrustación',
      'Corona',
      'Fractura'
    ]
  },

  {
    id: 78,
    type: 'select',
    text: 'Pieza dental 36',
    image:'/img/questions/pregunta78.jpg',
    options: [
      'Sin Pieza',
      'Sano',
      'Ausente',
      'Caries',
      'Amalgama',
      'Porcelana',
      'Implante',
      'Puente',
      'Incrustación',
      'Corona',
      'Fractura'
    ]
  },

  {
    id: 79,
    type: 'select',
    text: 'Pieza dental 37',
    image:'/img/questions/pregunta79.jpg',
    options: [
      'Sin Pieza',
      'Sano',
      'Ausente',
      'Caries',
      'Amalgama',
      'Porcelana',
      'Implante',
      'Puente',
      'Incrustación',
      'Corona',
      'Fractura'
    ]
  },

  {
    id: 80,
    type: 'select',
    text: 'Pieza dental 38',
    image:'/img/questions/pregunta80.jpg',
    options: [
      'Sin Pieza',
      'Sano',
      'Ausente',
      'Caries',
      'Amalgama',
      'Porcelana',
      'Implante',
      'Puente',
      'Incrustación',
      'Corona',
      'Fractura'
    ]
  },

  {
    id: 81,
    type: 'select',
    text: 'Pieza dental 41',
    image:'/img/questions/pregunta81.jpg',
    options: [
      'Sin Pieza',
      'Sano',
      'Ausente',
      'Caries',
      'Amalgama',
      'Porcelana',
      'Implante',
      'Puente',
      'Incrustación',
      'Corona',
      'Fractura'
    ]
  },

  {
    id: 82,
    type: 'select',
    text: 'Pieza dental 42',
    image:'/img/questions/pregunta82.jpg',
    options: [
      'Sin Pieza',
      'Sano',
      'Ausente',
      'Caries',
      'Amalgama',
      'Porcelana',
      'Implante',
      'Puente',
      'Incrustación',
      'Corona',
      'Fractura'
    ]
  },

  {
    id: 83,
    type: 'select',
    text: 'Pieza dental 43',
    image:'/img/questions/pregunta83.jpg',
    options: [
      'Sin Pieza',
      'Sano',
      'Ausente',
      'Caries',
      'Amalgama',
      'Porcelana',
      'Implante',
      'Puente',
      'Incrustación',
      'Corona',
      'Fractura'
    ]
  },

  {
    id: 84,
    type: 'select',
    text: 'Pieza dental 44',
    image:'/img/questions/pregunta84.jpg',
    options: [
      'Sin Pieza',
      'Sano',
      'Ausente',
      'Caries',
      'Amalgama',
      'Porcelana',
      'Implante',
      'Puente',
      'Incrustación',
      'Corona',
      'Fractura'
    ]
  },

  {
    id: 85,
    type: 'select',
    text: 'Pieza dental 45',
    image:'/img/questions/pregunta85.jpg',
    options: [
      'Sin Pieza',
      'Sano',
      'Ausente',
      'Caries',
      'Amalgama',
      'Porcelana',
      'Implante',
      'Puente',
      'Incrustación',
      'Corona',
      'Fractura'
    ]
  },

  {
    id: 86,
    type: 'select',
    text: 'Pieza dental 46',
    image:'/img/questions/pregunta86.jpg',
    options: [
      'Sin Pieza',
      'Sano',
      'Ausente',
      'Caries',
      'Amalgama',
      'Porcelana',
      'Implante',
      'Puente',
      'Incrustación',
      'Corona',
      'Fractura'
    ]
  },

  {
    id: 87,
    type: 'select',
    text: 'Pieza dental 47',
    image:'/img/questions/pregunta87.jpg',
    options: [
      'Sin Pieza',
      'Sano',
      'Ausente',
      'Caries',
      'Amalgama',
      'Porcelana',
      'Implante',
      'Puente',
      'Incrustación',
      'Corona',
      'Fractura'
    ]
  },

  {
    id: 88,
    type: 'select',
    text: 'Pieza dental 48',
    image:'/img/questions/pregunta88.jpg',
    options: [
      'Sin Pieza',
      'Sano',
      'Ausente',
      'Caries',
      'Amalgama',
      'Porcelana',
      'Implante',
      'Puente',
      'Incrustación',
      'Corona',
      'Fractura'
    ]
  },

  // ⚠️ No hay fila con índice 88 en el Excel, por eso no hay pregunta con id: 89

  {
    id: 90,
    type: 'radio',
    text: 'R. Temporal - Tatuaje',
    options: [
      'No',
      'Si'
    ]
  },

  {
    id: 91,
    type: 'radio',
    text: 'R. Frontal - Tatuaje',
    options: [
      'No',
      'Si'
    ]
  },

  {
    id: 92,
    type: 'radio',
    text: 'R. Orbitaria - Tatuaje',
    options: [
      'No',
      'Si'
    ]
  },

  {
    id: 93,
    type: 'radio',
    text: 'R. Nasal - Tatuaje',
    options: [
      'No',
      'Si'
    ]
  },

  {
    id: 94,
    type: 'radio',
    text: 'R. Labial - Tatuaje',
    options: [
      'No',
      'Si'
    ]
  },

  {
    id: 95,
    type: 'radio',
    text: 'R. Mentoniana - Tatuaje',
    options: [
      'No',
      'Si'
    ]
  },

  {
    id: 96,
    type: 'radio',
    text: 'R. Esternocleidomastoidea - Tatuaje',
    options: [
      'No',
      'Si'
    ]
  },

  {
    id: 97,
    type: 'radio',
    text: 'R. Cervical Interior - Tatuaje',
    options: [
      'No',
      'Si'
    ]
  },

  {
    id: 98,
    type: 'radio',
    text: 'R. Cervical Lateral - Tatuaje',
    options: [
      'No',
      'Si'
    ]
  },

  {
    id: 99,
    type: 'radio',
    text: 'R. Cervical Posterior - Tatuaje',
    options: [
      'No',
      'Si'
    ]
  },

  {
    id: 100,
    type: 'radio',
    text: 'R. Deltoidea - Tatuaje',
    options: [
      'No',
      'Si'
    ]
  },
  {
    id: 101,
    type: 'radio',
    text: 'R. Infraclavicular - Tatuaje',
    options: [
      'No',
      'Si'
    ]
  },
  {
    id: 102,
    type: 'radio',
    text: 'R. Pectoral -  Tatuaje',
    options: [
      'No',
      'Si'
    ]
  },
  {
    id: 103,
    type: 'radio',
    text: 'R. Axilar - Tatuaje',
    options: [
      'No',
      'Si'
    ]
  },
  {
    id: 104,
    type: 'radio',
    text: 'R. Preesternal - Tatuaje',
    options: [
      'No',
      'Si'
    ]
  },
  {
    id: 105,
    type: 'radio',
    text: 'R. Mamaria - Tatuaje',
    options: [
      'No',
      'Si'
    ]
  },
  {
    id: 106,
    type: 'radio',
    text: 'R. Braquial Anterior - Tatuaje',
    options: [
      'No',
      'Si'
    ]
  },
  {
    id: 107,
    type: 'radio',
    text: 'R. Braquial Posterior -Tatuaje',
    options: [
      'No',
      'Si'
    ]
  },
  {
    id: 108,
    type: 'radio',
    text: 'R. Inframamaria - Tatuaje',
    options: [
      'No',
      'Si'
    ]
  },
  {
    id: 109,
    type: 'radio',
    text: 'R. Torácica - Tatuaje',
    options: [
      'No',
      'Si'
    ]
  },
  {
    id: 110,
    type: 'radio',
    text: 'R. Anterior del Codo - Tatuaje',
    options: [
      'No',
      'Si'
    ]
  },
  {
    id: 111,
    type: 'radio',
    text: 'R. Antecubital - Tatuaje',
    options: [
      'No',
      'Si'
    ]
  },
  {
    id: 112,
    type: 'radio',
    text: 'R. Hipocondríaca - Tatuaje',
    options: [
      'No',
      'Si'
    ]
  },
  {
    id: 113,
    type: 'radio',
    text: 'R. Epigástrica - Tatuaje',
    options: [
      'No',
      'Si'
    ]
  },
  {
    id: 114,
    type: 'radio',
    text: 'R. Antebraquial Anterior - Tatuaje',
    options: [
      'No',
      'Si'
    ]
  },
  {
    id: 115,
    type: 'radio',
    text: 'R. Antebraquial Posterior - Tatuaje',
    options: [
      'No',
      'Si'
    ]
  },
  {
    id: 116,
    type: 'radio',
    text: 'R. Umbilical - Tatuaje',
    options: [
      'No',
      'Si'
    ]
  },
  {
    id: 117,
    type: 'radio',
    text: 'R. Lateral - Tatuaje',
    options: [
      'No',
      'Si'
    ]
  },
  {
    id: 118,
    type: 'radio',
    text: 'R. Carpiana - Tatuaje',
    options: [
      'No',
      'Si'
    ]
  },
  {
    id: 119,
    type: 'radio',
    text: 'R. Palmar - Tatuaje',
    options: [
      'No',
      'Si'
    ]
  },
  {
    id: 120,
    type: 'radio',
    text: 'R. Dorsal de la mano -  Tatuaje',
    options: [
      'No',
      'Si'
    ]
  },
  {
    id: 121,
    type: 'radio',
    text: 'R. Inguinal - Tatuaje',
    options: [
      'No',
      'Si'
    ]
  },
  {
    id: 122,
    type: 'radio',
    text: 'R. Coxal - Tatuaje',
    options: [
      'No',
      'Si'
    ]
  },
  {
    id: 123,
    type: 'radio',
    text: 'R. Pélvica - Tatuaje',
    options: [
      'No',
      'Si'
    ]
  },
  {
    id: 124,
    type: 'radio',
    text: 'R. Púbica - Tatuaje',
    options: [
      'No',
      'Si'
    ]
  },
  {
    id: 125,
    type: 'radio',
    text: 'R. Triángulo Femoral - Tatuaje',
    options: [
      'No',
      'Si'
    ]
  },
  {
    id: 126,
    type: 'radio',
    text: 'R. Femoral Anterior - Tatuaje',
    options: [
      'No',
      'Si'
    ]
  },
  {
    id: 127,
    type: 'radio',
    text: 'R. Anterior de la  Rodilla - Tatuaje',
    options: [
      'No',
      'Si'
    ]
  },
  {
    id: 128,
    type: 'radio',
    text: 'R. Tibial Anterior - Tatuaje',
    options: [
      'No',
      'Si'
    ]
  },
  {
    id: 129,
    type: 'radio',
    text: 'R. Cara Dorsal del Pie - Tatuaje',
    options: [
      'No',
      'Si'
    ]
  },
  {
    id: 130,
    type: 'radio',
    text: 'R. Temporal - Tatuaje',
    options: [
      'No',
      'Si'
    ]
  },
  {
    id: 131,
    type: 'radio',
    text: 'R. Occipital - Tatuaje ',
    options: [
      'No',
      'Si'
    ]
  },
  {
    id: 132,
    type: 'radio',
    text: 'R. Parietal - Tatuaje ',
    options: [
      'No',
      'Si'
    ]
  },
  {
    id: 133,
    type: 'radio',
    text: 'R. Cervical - Tatuaje ',
    options: [
      'No',
      'Si'
    ]
  },
  {
    id: 134,
    type: 'radio',
    text: 'R. Cervical Posterior - Tatuaje',
    options: [
      'No',
      'Si'
    ]
  },
  {
    id: 135,
    type: 'radio',
    text: 'R. Deltoidea - Tatuaje ',
    options: [
      'No',
      'Si'
    ]
  },
  {
    id: 136,
    type: 'radio',
    text: 'R. Escapular - Tatuaje ',
    options: [
      'No',
      'Si'
    ]
  },
  {
    id: 137,
    type: 'radio',
    text: 'R. Interescapular - Tatuaje',
    options: [
      'No',
      'Si'
    ]
  },
  {
    id: 138,
    type: 'radio',
    text: 'R. Lumbar - Tatuaje',
    options: [
      'No',
      'Si'
    ]
  },
  {
    id: 139,
    type: 'radio',
    text: 'R. Posterior del Brazo - Tatuaje',
    options: [
      'No',
      'Si'
    ]
  },
  {
    id: 140,
    type: 'radio',
    text: 'R. Glútea - Tatuaje',
    options: [
      'No',
      'Si'
    ]
  },
  {
    id: 141,
    type: 'radio',
    text: 'R. Sacra - Tatuaje',
    options: [
      'No',
      'Si'
    ]
  },
  {
    id: 142,
    type: 'radio',
    text: 'R. Femoral Posterior - Tatuaje',
    options: [
      'No',
      'Si'
    ]
  },
  {
    id: 143,
    type: 'radio',
    text: 'R. Posterior de la Rodilla - Tatuaje',
    options: [
      'No',
      'Si'
    ]
  },
  {
    id: 144,
    type: 'radio',
    text: 'R. Posterior de la Pierna - Tatuaje',
    options: [
      'No',
      'Si'
    ]
  },
  {
    id: 145,
    type: 'radio',
    text: 'R. Calcánea - Tatuaje',
    options: [
      'No',
      'Si'
    ]
  },
  {
    id: 146,
    type: 'radio',
    text: 'R. Temporal - Cicatriz',
    options: [
      'No',
      'Si'
    ]
  },
  {
    id: 147,
    type: 'radio',
    text: 'R. Frontal - Cicatriz',
    options: [
      'No',
      'Si'
    ]
  },
  {
    id: 148,
    type: 'radio',
    text: 'R. Orbitaria - Cicatriz',
    options: [
      'No',
      'Si'
    ]
  },
  {
    id: 149,
    type: 'radio',
    text: 'R. Nasal - Cicatriz',
    options: [
      'No',
      'Si'
    ]
  },
  {
    id: 150,
    type: 'radio',
    text: 'R. Labial - Cicatriz',
    options: [
      'No',
      'Si'
    ]
  },
  {
    id: 151,
    type: 'radio',
    text: 'R. Mentoniana - Cicatriz',
    options: ['No', 'Si']
  },
  {
    id: 152,
    type: 'radio',
    text: 'R. Esternocleidomastoidea - Cicatriz',
    options: ['No', 'Si']
  },
  {
    id: 153,
    type: 'radio',
    text: 'R. Cervical Anterior - Cicatriz',
    options: ['No', 'Si']
  },
  {
    id: 154,
    type: 'radio',
    text: 'R. Cervical Lateral - Cicatriz',
    options: ['No', 'Si']
  },
  {
    id: 155,
    type: 'radio',
    text: 'R. Cervical Posterior - Cicatriz',
    options: ['No', 'Si']
  },
  {
    id: 156,
    type: 'radio',
    text: 'R. Deltoidea - Cicatriz',
    options: ['No', 'Si']
  },
  {
    id: 157,
    type: 'radio',
    text: 'R. Escapular - Cicatriz',
    options: ['No', 'Si']
  },
  {
    id: 158,
    type: 'radio',
    text: 'R. Interescapular - Cicatriz',
    options: ['No', 'Si']
  },
  {
    id: 159,
    type: 'radio',
    text: 'R. Lumbar - Cicatriz',
    options: ['No', 'Si']
  },
  {
    id: 160,
    type: 'radio',
    text: 'R. Braquial Posterior - Cicatriz',
    options: ['No', 'Si']
  },
  {
    id: 161,
    type: 'radio',
    text: 'R. Glútea - Cicatriz',
    options: ['No', 'Si']
  },
  {
    id: 162,
    type: 'radio',
    text: 'R. Sacra - Cicatriz',
    options: ['No', 'Si']
  },
  {
    id: 163,
    type: 'radio',
    text: 'R. Femoral Posterior - Cicatriz',
    options: ['No', 'Si']
  },
  {
    id: 164,
    type: 'radio',
    text: 'R. Posterior de la Rodilla - Cicatriz',
    options: ['No', 'Si']
  },
  {
    id: 165,
    type: 'radio',
    text: 'R. Posterior de la Pierna - Cicatriz',
    options: ['No', 'Si']
  },
  {
    id: 166,
    type: 'radio',
    text: 'R. Calcánea - Cicatriz',
    options: ['No', 'Si']
  },
  {
    id: 167,
    type: 'radio',
    text: 'R. Temporal - Lunar',
    options: ['No', 'Si']
  },
  {
    id: 168,
    type: 'radio',
    text: 'R. Frontal - Lunar',
    options: ['No', 'Si']
  },
  {
    id: 169,
    type: 'radio',
    text: 'R. Orbitaria - Lunar',
    options: ['No', 'Si']
  },
  {
    id: 170,
    type: 'radio',
    text: 'R. Nasal - Lunar',
    options: ['No', 'Si']
  },
  {
    id: 171,
    type: 'radio',
    text: 'R. Labial - Lunar',
    options: ['No', 'Si']
  },
  {
    id: 172,
    type: 'radio',
    text: 'R. Mentoniana - Lunar',
    options: ['No', 'Si']
  },
  {
    id: 173,
    type: 'radio',
    text: 'R. Esternocleidomastoidea - Lunar',
    options: ['No', 'Si']
  },
  {
    id: 174,
    type: 'radio',
    text: 'R. Cervical Anterior - Lunar',
    options: ['No', 'Si']
  },
  {
    id: 175,
    type: 'radio',
    text: 'R. Cervical Lateral - Lunar',
    options: ['No', 'Si']
  },
  {
    id: 176,
    type: 'radio',
    text: 'R. Cervical Posterior - Lunar',
    options: ['No', 'Si']
  },
  {
    id: 177,
    type: 'radio',
    text: 'R. Deltoidea - Lunar',
    options: ['No', 'Si']
  },
  {
    id: 178,
    type: 'radio',
    text: 'R. Escapular - Lunar',
    options: ['No', 'Si']
  },
  {
    id: 179,
    type: 'radio',
    text: 'R. Interescapular - Lunar',
    options: ['No', 'Si']
  },
  {
    id: 180,
    type: 'radio',
    text: 'R. Lumbar - Lunar',
    options: ['No', 'Si']
  },
  {
    id: 181,
    type: 'radio',
    text: 'R. Braquial Posterior - Lunar',
    options: ['No', 'Si']
  },
  {
    id: 182,
    type: 'radio',
    text: 'R. Glútea - Lunar',
    options: ['No', 'Si']
  },
  {
    id: 183,
    type: 'radio',
    text: 'R. Sacra - Lunar',
    options: ['No', 'Si']
  },
  {
    id: 184,
    type: 'radio',
    text: 'R. Femoral Posterior - Lunar',
    options: ['No', 'Si']
  },
  {
    id: 185,
    type: 'radio',
    text: 'R. Posterior de la Rodilla - Lunar',
    options: ['No', 'Si']
  },
  {
    id: 186,
    type: 'radio',
    text: 'R. Posterior de la Pierna - Lunar',
    options: ['No', 'Si']
  },
  {
    id: 187,
    type: 'radio',
    text: 'R. Calcánea - Lunar',
    options: ['No', 'Si']
  },
  {
    id: 188,
    type: 'select',
    text: 'Color natural del vello corporál',
    options: [
      'No disponible',
      'Negro',
      'Café oscuro',
      'Café claro',
      'Rubio',
      'Rojizo',
      'Canoso'
    ]
  },
  {
    id: 189,
    type: 'select',
    text: 'Color procesado del vello corporal',
    options: [
      'Sin proceso',
      'Decolorado',
      'Negro',
      'Café oscuro',
      'Café claro',
      'Rubio',
      'Rojo',
      'Verde',
      'Azul',
      'Rosa',
      'Morado',
      'Naranja',
      'Blanco'
    ]
  },
  {
    id: 190,
    type: 'radio',
    text: 'Presencia de vello facial',
    options: ['No', 'Si']
  },
  {
    id: 191,
    type: 'radio',
    text: 'Presencia de vello corporal abundante',
    options: ['No', 'Si']
  },
  {
    id: 192,
    type: 'select',
    text: 'Cantidad de vello corporal',
    options: [
      'Sin vello',
      'Poco vello',
      'Moderado',
      'Abundante',
      'Muy abundante'
    ]
  },
  {
    id: 193,
    type: 'select',
    text: 'Distribución del vello corporal',
    options: [
      'No disponible',
      'Localizado',
      'Disperso',
      'Uniforme'
    ]
  },
  {
    id: 194,
    type: 'radio',
    text: 'Vello en espalda',
    options: ['No', 'Si']
  },
  {
    id: 195,
    type: 'radio',
    text: 'Vello en pecho',
    options: ['No', 'Si']
  },
  {
    id: 196,
    type: 'radio',
    text: 'Vello en abdomen',
    options: ['No', 'Si']
  },
  {
    id: 197,
    type: 'radio',
    text: 'Vello en brazos',
    options: ['No', 'Si']
  },
  {
    id: 198,
    type: 'radio',
    text: 'Vello en piernas',
    options: ['No', 'Si']
  },
  {
    id: 199,
    type: 'radio',
    text: 'Vello en glúteos',
    options: ['No', 'Si']
  },
  {
    id: 200,
    type: 'radio',
    text: 'Vello en zona púbica',
    options: ['No', 'Si']
  },
  {
    id: 201,
    type: 'select',
    text: 'Vello púbico - Cantidad',
    options: [
      'Sin vello',
      'Poco vello',
      'Moderado',
      'Abundante',
      'Muy abundante'
    ]
  },
  {
    id: 202,
    type: 'select',
    text: 'Vello púbico - Forma',
    options: [
      'No disponible',
      'Recto',
      'Ondulado',
      'Rizado'
    ]
  },
  {
    id: 203,
    type: 'select',
    text: 'Vello púbico - Largo',
    options: [
      'Muy corto',
      'Corto',
      'Medio',
      'Largo'
    ]
  },
  {
    id: 204,
    type: 'radio',
    text: 'Vello púbico - Depilación',
    options: ['No', 'Si']
  },
  {
    id: 205,
    type: 'select',
    text: 'Vello púbico - Color',
    options: [
      'Negro',
      'Café oscuro',
      'Café claro',
      'Rubio',
      'Rojizo',
      'Canoso'
    ]
  },
  {
    id: 206,
    type: 'radio',
    text: 'Estrías en brazos',
    options: ['No', 'Si']
  },
  {
    id: 207,
    type: 'radio',
    text: 'Estrías en abdomen',
    options: ['No', 'Si']
  },
  {
    id: 208,
    type: 'radio',
    text: 'Estrías en glúteos',
    options: ['No', 'Si']
  },
  {
    id: 209,
    type: 'radio',
    text: 'Estrías en piernas',
    options: ['No', 'Si']
  },
  {
    id: 210,
    type: 'radio',
    text: 'Flacidez en brazos',
    options: ['No', 'Si']
  },
  {
    id: 211,
    type: 'radio',
    text: 'Flacidez en abdomen',
    options: ['No', 'Si']
  },
  {
    id: 212,
    type: 'radio',
    text: 'Flacidez en glúteos',
    options: ['No', 'Si']
  },
  {
    id: 213,
    type: 'radio',
    text: 'Flacidez en piernas',
    options: ['No', 'Si']
  },
  {
    id: 214,
    type: 'radio',
    text: 'Manchas en rostro',
    options: ['No', 'Si']
  },
  {
    id: 215,
    type: 'radio',
    text: 'Manchas en cuello',
    options: ['No', 'Si']
  },
  {
    id: 216,
    type: 'radio',
    text: 'Manchas en brazos',
    options: ['No', 'Si']
  },
  {
    id: 217,
    type: 'radio',
    text: 'Manchas en piernas',
    options: ['No', 'Si']
  },
  {
    id: 218,
    type: 'radio',
    text: 'Acné en rostro',
    options: ['No', 'Si']
  },
  {
    id: 219,
    type: 'radio',
    text: 'Acné en espalda',
    options: ['No', 'Si']
  },
  {
    id: 220,
    type: 'radio',
    text: 'Acné en pecho',
    options: ['No', 'Si']
  },
  {
    id: 221,
    type: 'radio',
    text: 'Acné en glúteos',
    options: ['No', 'Si']
  },
  {
    id: 222,
    type: 'radio',
    text: 'Piel grasa',
    options: ['No', 'Si']
  },
  {
    id: 223,
    type: 'radio',
    text: 'Piel seca',
    options: ['No', 'Si']
  },
  {
    id: 224,
    type: 'radio',
    text: 'Piel mixta',
    options: ['No', 'Si']
  },
  {
    id: 225,
    type: 'radio',
    text: 'Piel sensible',
    options: ['No', 'Si']
  },
  {
    id: 226,
    type: 'radio',
    text: 'Cicatrices de acné',
    options: ['No', 'Si']
  },
  {
    id: 227,
    type: 'radio',
    text: 'Ojeras marcadas',
    options: ['No', 'Si']
  },
  {
    id: 228,
    type: 'radio',
    text: 'Bolsas debajo de los ojos',
    options: ['No', 'Si']
  },
  {
    id: 229,
    type: 'radio',
    text: 'Arrugas en frente',
    options: ['No', 'Si']
  },
  {
    id: 230,
    type: 'radio',
    text: 'Arrugas en ojos (patas de gallo)',
    options: ['No', 'Si']
  },
  {
    id: 231,
    type: 'radio',
    text: 'Arrugas en boca',
    options: ['No', 'Si']
  },
  {
    id: 232,
    type: 'radio',
    text: 'Arrugas en cuello',
    options: ['No', 'Si']
  },
  {
    id: 233,
    type: 'radio',
    text: 'Cicatrices quirúrgicas visibles',
    options: ['No', 'Si']
  },
  {
    id: 234,
    type: 'radio',
    text: 'Cicatrices por accidentes',
    options: ['No', 'Si']
  },
  {
    id: 235,
    type: 'radio',
    text: 'Cicatrices antiguas',
    options: ['No', 'Si']
  },
  {
    id: 236,
    type: 'radio',
    text: 'Manchas solares',
    options: ['No', 'Si']
  },
  {
    id: 237,
    type: 'radio',
    text: 'Vitiligo',
    options: ['No', 'Si']
  },
  {
    id: 238,
    type: 'radio',
    text: 'Psoriasis',
    options: ['No', 'Si']
  },
  {
    id: 239,
    type: 'radio',
    text: 'Rosácea',
    options: ['No', 'Si']
  },
  {
    id: 240,
    type: 'radio',
    text: 'Líneas de expresión marcadas',
    options: ['No', 'Si']
  },
  {
    id: 241,
    type: 'select',
    text: 'Complexión general',
    options: [
      'Muy delgado',
      'Delgado',
      'Intermedio',
      'Atlético',
      'Robusto',
      'Obeso'
    ]
  },
  {
    id: 242,
    type: 'select',
    text: 'Postura corporal',
    options: [
      'Recta',
      'Levemente encorvada',
      'Muy encorvada'
    ]
  },
  {
    id: 243,
    type: 'radio',
    text: 'Escoliosis visible',
    options: ['No', 'Si']
  },
  {
    id: 244,
    type: 'radio',
    text: 'Marcha irregular',
    options: ['No', 'Si']
  },
  {
    id: 245,
    type: 'radio',
    text: 'Dificultad al caminar',
    options: ['No', 'Si']
  },
  {
    id: 246,
    type: 'radio',
    text: 'Dificultad para agacharse',
    options: ['No', 'Si']
  },
  {
    id: 247,
    type: 'radio',
    text: 'Dificultad para cargar peso',
    options: ['No', 'Si']
  },
  {
    id: 248,
    type: 'select',
    text: 'Nivel aproximado de fuerza física',
    options: [
      'Muy baja',
      'Baja',
      'Intermedia',
      'Alta',
      'Muy alta'
    ]
  },
  {
    id: 249,
    type: 'select',
    text: 'Condición física general',
    options: [
      'Muy mala',
      'Mala',
      'Regular',
      'Buena',
      'Muy buena'
    ]
  },
  {
    id: 250,
    type: 'radio',
    text: 'Usa lentes',
    options: ['No', 'Si']
  },
  {
    id: 251,
    type: 'radio',
    text: 'Usa aparato dental',
    options: ['No', 'Si']
  },
  {
    id: 252,
    type: 'radio',
    text: 'Usa prótesis auditiva',
    options: ['No', 'Si']
  },
  {
    id: 253,
    type: 'radio',
    text: 'Tiene tatuajes visibles',
    options: ['No', 'Si']
  },
  {
    id: 254,
    type: 'radio',
    text: 'Tiene perforaciones visibles',
    options: ['No', 'Si']
  },
  {
    id: 255,
    type: 'radio',
    text: 'Usa algún accesorio permanente',
    options: ['No', 'Si']
  },
  {
    id: 256,
    type: 'radio',
    text: 'Presencia de marca o señal corporal distintiva',
    options: ['No', 'Si']
  }



];

module.exports = questions;
