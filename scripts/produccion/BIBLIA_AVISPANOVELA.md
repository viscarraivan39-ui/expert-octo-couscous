# Biblia de "Avispanovela" — formato micro-drama vertical

Adaptación del formato real de micro-dramas verticales (ReelShort, DramaBox —
industria que facturó ~US$3.000 millones en 2025, +115% interanual) a
personajes insecto de AvíspateYa. Mismas reglas estructurales que usan ellos,
elenco y universo propios. Sin copiar nombres/tramas literales de series
existentes — se reformulan con vocabulario propio.

**Plan de publicación:** 80 capítulos por temporada, 4 subidos por día en
horarios distintos = contenido para 20 días por temporada. Una sola historia
con continuidad real de principio a fin — no capítulos sueltos.

Fuentes de la investigación de formato: [Filmustage — Vertical Drama
Explained 2026](https://filmustage.com/blog/vertical-drama-explained-what-you-need-to-know-in-2026/),
[Vitrina — What Is Micro Drama](https://vitrina.ai/blog/what-is-micro-drama-a-guide-to-the-new-short-form-sensation/),
[ShortDramaPicks — Hidden Identity Dramas](https://shortdramapicks.com/blog/reelshort-hidden-identity-dramas).

## 1. Formato / duración

- Cada capítulo: **1 a 2 minutos hablados** (más largo que el estándar de la
  industria de 60-90s — decisión del usuario, prioriza dejar la trama bien
  planteada por capítulo antes que la brevedad extrema).
- Una temporada: **80 capítulos**, con continuidad real de principio a fin
  (una sola historia, no episodios sueltos). A 4 subidas diarias en horarios
  distintos, una temporada da contenido para **20 días**.
- Estructura de cada capítulo, sin excepción:
  - Primer(os) bloque(s): resuelve o continúa el cliffhanger del capítulo anterior.
  - Último(s) bloque(s): cliffhanger nuevo — nunca termina "cerrado".
- Formato vertical 9:16, mismo motor que ya usa `build.mjs`.

## 2. Arco de temporada (80 capítulos)

| Tramo | Capítulos | Qué pasa |
|---|---|---|
| Planteamiento | 1-10 | se presenta el mundo y los personajes, arranca el conflicto central |
| Escalada | 11-38 | el conflicto central se profundiza, aparecen subtramas |
| "Todo empeora" | 39-66 | punto más bajo para el/la protagonista, antes de que cambie la marea |
| Resolución | 67-80 | clímax y cierre (o gancho a la temporada siguiente) |

Internamente esto se planifica como **16 beats** (uno cada ~5 capítulos) en
vez de 80 puntos de trama detallados de antemano — el detalle exacto de cada
capítulo se escribe cuando le toca, a partir del beat correspondiente + el
resumen acumulado real de la historia (no un plan rígido que se puede volver
inconsistente con lo que realmente se escribió).

## 3. Universo compartido: Avispateya

Todas las series giran, directa o indirectamente, en torno a **Avispa
Tella**, la multinacional (y la mansión de su dueño) — es el hilo que
conecta series distintas sin que dependan una de otra para entenderse.

- **Mención en pantalla, no en diálogo**: el nombre "Avispateya" aparece en
  un cartel, un logo de fondo, un packaging, un mail en una pantalla — nunca
  como línea hablada repetida. Regla dura: máximo 1 mención hablada por
  capítulo, y solo si la escena la pide de verdad (nunca forzada).
- Esto es intencional: mucha repetición hablada cansa y se siente publicidad;
  la marca ambientada en la escena se siente "mundo real", no auspicio.
- Personajes que trabajan en o están conectados a Avispateya pueden repetirse
  entre series distintas (mismo universo), pero cada serie es autoconclusiva.

## 4. Banco de tropos (adaptados, no copiados literal)

Cada serie combina 2-3 de estos, igual que hace la industria real:

1. **Matrimonio por conveniencia** — dos personajes se casan por plata/negocio/presión familiar y se enamoran de verdad.
2. **Identidad oculta** — alguien finge ser de bajo perfil mientras en secreto es dueño/heredero de Avispateya; la tensión es la espera del "reveal".
3. **Herencia/hijo secreto** — un encuentro pasado deriva en un hijo que el otro personaje descubre después.
4. **Enemigos a amantes** — rivalidad (de negocios, de familia) que se convierte en romance.
5. **Segunda oportunidad** — ex parejas que se reencuentran por trabajo/herencia.

### Regla de intercambio de género (obligatoria, mitad de las series)

Mitad de las series nuevas usan la trama de una serie anterior con los roles
de género invertidos (si antes el heredero rico era hombre, ahora es mujer,
y viceversa) — mismo mecanismo que usa la industria real para estirar el
mismo esqueleto de trama sin que se sienta repetido. Registrar en
`metricas.md` cuál versión (original o invertida) funcionó mejor.

## 5. Elenco base (se puede ampliar por serie)

- **Avispón Fernández** — voz `es-US-Chirp3-HD-Fenrir`
- **Avispa Dorada** — voz `es-US-Chirp3-HD-Laomedeia`
- **Reina Abeja** — voz `es-US-Chirp3-HD-Zephyr`
- **Libélula Montenegro** — voz `es-US-Chirp3-HD-Leda`
- Personajes nuevos por serie: asignar `es-US-Chirp3-HD-Puck` (masculino) o
  `es-US-Chirp3-HD-Sadachbia` (masculino) antes de reusar una voz ya asignada
  a otro personaje — cada personaje necesita una voz única y fija durante
  toda su serie (bug ya corregido una vez, no reintroducir).

## 6. Ejemplo de título de serie (no de capítulo)

Formato tipo "El/La [rol] de Avispateya" o "Casada/o con el/la
[apodo del mundo insecto]" — ej. "La Heredera Secreta de Avispateya",
"Casada con el Rey del Avispero". Nombres a definir por serie, evitando
coincidir literal con títulos reales de ReelShort/DramaBox.

## 7. Cómo funciona en código (`avispanovela.mjs`)

- `node avispanovela.mjs nueva "idea libre"` — arma la biblia completa (título,
  sinopsis de la historia completa, elenco, 16 beats) en una sola pasada, la
  guarda en `series_avispanovela.json`, y escribe el capítulo 1.
- `node avispanovela.mjs continuar "Título exacto"` — genera el próximo
  capítulo, a partir del beat que le corresponde + el resumen acumulado real
  de la historia + el cliffhanger pendiente (no un plan rígido).
- Después de generar cada capítulo corre un **chequeo de continuidad**
  automático (otra pasada de LLM, hace de "editor de continuidad"): compara
  el capítulo nuevo contra la biblia y el resumen acumulado, y marca
  contradicciones antes de guardarlo. No bloquea el guardado (para no trabar
  el flujo), pero deja el problema anotado en `series_avispanovela.json` para
  revisión humana.
- `node avispanovela.mjs listar` — lista las series existentes y en qué
  capítulo van.
