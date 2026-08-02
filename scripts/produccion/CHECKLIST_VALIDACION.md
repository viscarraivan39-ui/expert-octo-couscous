# Checklist de validación de contenido — AvíspateYa

Para el "encargado de contenido" (humano o IA) antes de aprobar un guion para
render. Estas reglas ya se venían aplicando caso a caso en el pipeline; acá
quedan escritas para que cualquiera (o cualquier sesión futura) las aplique
igual, sin depender de que alguien se acuerde.

## 0. Ventana "solo promocionar la web" (hasta el 2026-08-15)

- Mientras se espera la aprobación de Soicos (red de afiliados), el contenido
  **no** empuja un producto/afiliado puntual — el objetivo es que la gente
  conozca y visite avispateya.cl en general.
- Ángulos preferidos en esta ventana: tendencias, tips, recomendaciones,
  actualidad — contenido de valor que cierre invitando a conocer el sitio,
  no un "compra esto ya".
- Esto está codificado en `guionistas.mjs` (`modoActual()`) — se desactiva
  solo pasada la fecha, sin que haga falta acordarse de sacarlo a mano.

## 1. Urgencia y escasez

- **Permitido:** urgencia real (fluctuación real de precio, stock real,
  oferta con fecha de vencimiento real verificable en el sitio de origen).
- **Prohibido:** urgencia fabricada ("¡quedan 2 unidades!" cuando no es
  cierto), countdown falso, testimonios inventados. Esto ya se removió una
  vez del sitio (`427ef06 Remove placeholder offers...`) — no reintroducir
  bajo ningún formato, ni siquiera en video.

## 2. Datos de producto

- Todo dato de producto (precio, "más vendido", stock) tiene que verificarse
  contra la fuente real (Mercado Libre u otra) antes de publicarse. No
  inventar badges ni estadísticas.

## 3. Adaptación de guiones existentes

- Cuando se adapta un texto ya escrito (ej. `guiones-asistente-social/`),
  la adaptación es **verbatim** salvo que se pida explícitamente resumir.
  No recortar frases "porque no aportan" — eso lo decide quien pidió la
  adaptación, no el guionista.

## 4. Personas reales / temas sensibles

- No dramatizar tragedias reales o temas legalmente sensibles de personas
  reales para contenido de cahuín/entretenimiento.
- Si se usa un hecho real y autoreconocido por la persona (no trágico), debe
  quedar **fact-checked** (búsqueda web) antes de dramatizarlo.

## 5. Marca

- Máximo 2 menciones de marca/dominio por video (no repetir en cada bloque).
- Videos de prueba técnica (`sinMarca: true`) nunca se publican — son solo
  para validar una función nueva del pipeline.

## 6. Imágenes

- Fotos de personas reales: buscar primero en Wikimedia Commons con licencia
  reusable comercialmente (ver `licenciaUsable()` en `build.mjs`). Si no hay,
  recién ahí usar FLUX evitando rostros fotorrealistas cercanos.
- Contenido estilo cómic/Avispanovela: FLUX directo, respetando la cadena de
  fallback ya existente en `descargarImagen()`.

## 7. Antes de publicar

- ¿El video mide más de 60s si la historia lo requiere? (no forzar bajo 60s
  si se corta la historia).
- ¿Los subtítulos no se cortan en los bordes? (revisar visualmente al menos
  el primer y último bloque).
- ¿La marca de agua es la sutil fija, no el flash de "ÚLTIMA HORA"?
- ¿El archivo quedó guardado en `Downloads/contenido avispate/` con fecha y
  una línea en `registro.md`?

## 8. Transparencia de contenido generado con IA

- Todo el contenido de AvíspateYa (video, voz, imágenes) se genera con IA
  (FLUX + Edge TTS). Declarar esto donde la plataforma lo pida:
  - Instagram: activar "Creador de contenido con IA" en Configuración →
    Editar perfil (ya activado en @avispateyacl).
  - TikTok: activar el equivalente ("Contenido creado con IA") al publicar,
    si la plataforma lo pide en el flujo de subida.
  - No depende de que se note o no — es una declaración de política, no
    algo opcional según el video.

## 9. Registro de resultados (feedback loop)

- Después de publicar y tener datos reales (vistas, retención), anotar el
  resultado en `scripts/produccion/metricas.md` — qué funcionó y qué no, para
  que el próximo brief/guion lo tenga en cuenta. Sin esto, cada video vuelve
  a partir de cero.
