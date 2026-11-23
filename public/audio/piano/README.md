# Muestras del teclado

Dieciséis notas de piano, una cada tres semitonos, de Do2 a La5.

- **Origen:** VSCO 2 Community Edition (VS Chamber Orchestra: Community Edition), de
  Versilian Studios LLC. Grabado por Sam Gossner y Simon Dalzell.
- **Licencia:** CC0 1.0 Universal (dedicación al dominio público).
  <https://creativecommons.org/publicdomain/zero/1.0/>
- **Distribución de la que se descargaron los originales:**
  <https://github.com/nbrosowsky/tonejs-instruments> (`samples/piano`), que a su vez publica
  esta biblioteca.

La atribución no es obligatoria con CC0, pero se mantiene por respeto al trabajo original.

## Qué se ha modificado

Los ficheros originales eran MP3 estéreo de 192 kbps y unos 18 segundos. Para esta web se han
recortado a los primeros 6 segundos, se les ha aplicado una rampa de salida de 1,8 segundos para
evitar cortes secos, se han igualado de nivel a −1 dBFS conservando su dinámica relativa y se han
reconvertido a AAC mono de 80 kbps en contenedor `.m4a`. El resultado ocupa 800 KB en total.

Las conversiones se hicieron con herramientas del sistema (`afconvert`), sin procesado adicional
de tono ni de dinámica.

## Cómo se usan

`src/audio/piano.js` descarga las dieciséis con un `OfflineAudioContext` y las reproduce con
`AudioBufferSourceNode`. Las notas que no tienen muestra propia usan la más cercana y ajustan
`playbackRate`, con un desvío máximo de ±1,5 semitonos.
