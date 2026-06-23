# **Especificaciones Funcionales: CicloRitmo**

Este documento detalla el comportamiento, las reglas de negocio, el flujo de usuario y la experiencia de diseño de la aplicación **CicloRitmo** (Asistente Virtual para Entrenamiento en Bicicleta Estática). Está redactado con un enfoque 100% funcional para describir *qué hace* la aplicación y cómo interactúa con el usuario.

## **1\. Propósito de la Aplicación**

**CicloRitmo** es un asistente visual y auditivo interactivo diseñado para guiar a los usuarios durante sus entrenamientos en bicicleta estática en casa. Su objetivo principal es facilitar el seguimiento de rutinas de ejercicio de manera cómoda, eliminando la necesidad de tocar constantemente el dispositivo durante el entrenamiento, garantizando una visibilidad clara a distancia y sincronizando ritmos de pedaleo mediante guías sensoriales (audio y movimiento visual).

## **2\. Biblioteca de Rutinas e Intervalos**

### **2.1 El Concepto de "Intervalo"**

Toda rutina se compone de una secuencia cronológica de bloques temporales llamados intervalos. Cada intervalo cuenta con las siguientes propiedades funcionales para el usuario:

* **Nombre de la fase**: Describe la actividad (ej. "Calentamiento Suave", "Sprint Final").  
* **Duración**: Tiempo asignado a la actividad medido en minutos y segundos.  
* **Resistencia sugerida**: Nivel de dureza que el usuario debe configurar manualmente en la perilla de su bicicleta estática (en una escala del 1 al 10).  
* **Cadencia sugerida (RPM)**: El ritmo de pedaleo recomendado, expresado en Revoluciones Por Minuto (pedaladas completas por minuto).  
* **Tipo de Esfuerzo**: Clasificación visual del intervalo (Calentamiento, Trabajo/Intenso, Recuperación Activa, Enfriamiento).

### **2.2 Rutinas Integradas por Defecto**

La aplicación ofrece un catálogo de rutinas pre-diseñadas clasificadas en cuatro enfoques de entrenamiento:

#### **A. Categoría: Suave / Iniciación**

* **Iniciación al Cardio (15 minutos)**: Diseñada para personas que comienzan. Introduce picos de esfuerzo muy moderados con largos periodos de recuperación.  
* **Pirámide de Ritmo (18 minutos)**: Estructura de esfuerzo ascendente y descendente donde se sube la velocidad poco a poco y luego se disminuye con control.

#### **B. Categoría: HIIT / Tabata**

* **Tabata Quemagrasa (21 minutos)**: Entrenamiento de intervalos de alta intensidad (HIIT) clásicos. Consiste en breves picos de esfuerzo máximo (sprints rápidos a alta cadencia) seguidos de descansos activos muy cortos.  
* **Tabata Doble Explosivo (16 minutos)**: Una rutina avanzada con dos series de sprints intensos separadas por un bloque de rodaje plano a ritmo moderado.

#### **C. Categoría: Fuerza / Escalada**

* **Subida a la Montaña (23 minutos)**: Simula una ruta de ciclismo de montaña donde la resistencia de la bicicleta se incrementa progresivamente, obligando al usuario a pedalear con más fuerza física a menor velocidad.  
* **Picos Alpinos Extremos (29 minutos)**: Consiste en tres grandes subidas exigentes de gran carga muscular con descensos breves y rápidos para recuperar el aliento.

#### **D. Categoría: Fondo / Cardio**

* **Fondo Aeróbico / Resistencia (30 minutos)**: Un ritmo crucero constante y controlado en zona de confort aeróbica, ideal para entrenar resistencia de larga duración.  
* **Fondo Quema-Grasas Zona 2 (40 min)**: Sesión larga a velocidad e intensidad moderada-baja, óptima para entrenamientos prolongados de control de peso.  
* **Ondas Aeróbicas Dinámicas (30 minutos)**: Entrenamiento de resistencia dinámica que introduce variaciones constantes en el ritmo y la cadencia para mantener la sesión entretenida y evitar la fatiga mental.

## **3\. Creador de Rutinas Personalizadas**

La aplicación permite al usuario diseñar su propia sesión desde cero:

* El usuario puede añadir tantos intervalos como desee a una lista de reproducción.  
* Para cada intervalo nuevo, el usuario puede definir libremente el nombre, la duración en segundos, la resistencia (1-10), la cadencia (RPM sugeridas) y el tipo de esfuerzo.  
* Los intervalos agregados se muestran en una lista numerada donde se detalla el resumen de cada uno.  
* El usuario tiene la opción de eliminar cualquier intervalo de la lista si cambia de opinión antes de guardar la sesión.  
* Una vez finalizada la personalización, la rutina se almacena temporalmente y se puede iniciar exactamente igual que las rutinas integradas de la biblioteca.

## **4\. Experiencia de Usuario (UX) y Flujo de Pantallas**

La aplicación organiza su navegación en pantallas dedicadas para mantener la interfaz limpia y evitar que el usuario tenga que deslizar la pantalla de arriba a abajo (scroll) en su celular, garantizando que todo quepa en una sola vista física.

### **4.1 Pantalla de Selección de Rutina (Menú Principal)**

* **Pestañas de Categoría**: Permiten filtrar las rutinas mostradas según el objetivo del usuario (Todos, Suave, HIIT, Fuerza o Fondo) mediante botones táctiles rápidos.  
* **Tarjetas de Rutina**: Cada rutina se presenta en un recuadro interactivo que muestra de un vistazo rápido el título, la duración total estimada, una descripción sencilla de los beneficios y la dureza sugerida.

### **4.2 Pantalla de Pre-Entrenamiento y Configuración**

* Se muestra al seleccionar cualquier rutina. Presenta un resumen del entrenamiento con su duración total en formato Minutos:Segundos.  
* **Ajustes de Audio**: Permite al usuario activar o desactivar de forma independiente:  
  * *Metrónomo de Cadencia*: Sonido constante que marca el compás del pedaleo.  
  * *Avisos de Cuenta Regresiva*: Tonos de advertencia antes de cambiar de fase.  
* **Probar Sonido**: Un botón interactivo para reproducir una alerta rápida de prueba, asegurando que el volumen del dispositivo esté al nivel adecuado antes de empezar.

### **4.3 Pantalla de Entrenamiento Activo (Consola de Pedaleo)**

Esta es la interfaz principal durante el ejercicio. Está diseñada bajo el concepto **"Manos Libres"** y **"Cero Desplazamiento (No Scroll)"**:

* **Ocultamiento de distractores**: Al activarse, la cabecera y el pie de página de la aplicación desaparecen por completo para aprovechar al máximo la pantalla del teléfono celular en su orientación vertical.  
* **Zona Superior (Progreso y Salida)**: Muestra el nombre de la rutina en curso, el número de intervalo activo (ej. "3 de 10") y un botón destacado para detener la sesión si es necesario (el cual solicita confirmación para evitar toques accidentales con el sudor).  
* **Zona Media (Objetivos Gigantes)**: Muestra en tamaño de letra masivo y legible a gran distancia los dos valores que el usuario debe imitar: **Cadencia de Pedaleo (RPM)** y **Resistencia sugerida**.  
* **Zona Central (Fase de Tiempo y Metrónomo)**:  
  * *Lado izquierdo*: Muestra el nombre del intervalo actual (ej. "Sprints intensos") y un cronómetro gigante de cuenta regresiva en formato Minutos:Segundos.  
  * *Lado derecho*: Muestra la rueda del metrónomo visual interactivo.  
* **Zona Bajo-Media (Próximo Intervalo)**: Un banner horizontal de una sola línea que avisa al usuario qué ejercicio y RPM vendrán en la siguiente etapa para que pueda anticipar su esfuerzo.  
* **Zona Inferior (Controles Táctiles de Fácil Alcance)**:  
  * Barra de progreso y tiempo total transcurrido acumulado.  
  * Tres botones de tamaño extra grande para facilitar el toque con dedos húmedos: "Intervalo Anterior", un enorme botón central de "Play/Pause" para pausar momentáneamente el entrenamiento, e "Intervalo Siguiente" (para saltar etapas manualmente).  
* **Zona Base (Estadísticas en Vivo)**: Muestra estimaciones en tiempo real de calorías quemadas, distancia recorrida y nivel de esfuerzo percibido general de la sesión.

### **4.4 Pantalla de Resumen Final**

Se muestra automáticamente al terminar con éxito el entrenamiento. Presenta un informe de logros con los siguientes datos del entrenamiento completado:

* Tiempo total pedaleado.  
* Estimación de calorías totales quemadas.  
* Distancia aproximada recorrida en kilómetros.  
* Promedio del nivel de resistencia utilizado.  
* Botón destacado para regresar al menú principal.

## **5\. Sistema de Sonidos y Sincronización del Metrónomo**

El apartado acústico de la aplicación actúa como un asistente sensorial que guía al atleta sin necesidad de que mire la pantalla de forma constante.

### **5.1 El Metrónomo Acústico-Visual Sincronizado**

* **La Rueda Guía**: En la pantalla de entrenamiento, una rueda animada gira de manera continua. Para que el usuario pueda contar fácilmente las vueltas, la rueda cuenta con un radio destacado en color naranja y un reflector rojo neón en el extremo superior.  
* **Sincronización del Giro y el Sonido**: La velocidad de rotación de la rueda se adapta dinámicamente y de forma exacta a las RPM recomendadas para el intervalo actual.  
* **El "Tic" del Metrónomo**: Cada vez que el reflector rojo neón pasa exactamente por la **posición de las 12 en punto (la cima de la rueda)**, la aplicación emite un sonido seco, imitando el golpe de madera de un metrónomo musical profesional.  
* *Ejemplo funcional*: Si el objetivo es de ![][image1] (una vuelta por segundo), el usuario escuchará exactamente 1 "tic" cada segundo al compás del reflector. Si el objetivo sube a ![][image2] (dos vueltas por segundo), escuchará 2 "tics" por segundo. Esto permite al usuario igualar el ritmo de sus piernas con el sonido o el parpadeo de la rueda de forma intuitiva.

### **5.2 Sonidos de Transición**

* **Avisos de Cuenta Regresiva (3, 2, 1\)**: Durante los últimos tres segundos de cualquier intervalo, la aplicación emite tres tics consecutivos con un tono de advertencia distintivo para indicar que el tiempo está a punto de agotarse.  
* **Alerta de Cambio de Intervalo**: Al iniciar una nueva fase del entrenamiento, la aplicación emite una alarma de doble tono de alta frecuencia que se diferencia claramente de los "tics" comunes. Esto le indica al usuario que debe mirar rápidamente la pantalla para ajustar la resistencia de su bicicleta o cambiar su ritmo de pedaleo.

## **6\. Algoritmo de Estimación de Métricas en Vivo**

Durante el pedaleo, la aplicación actualiza automáticamente las estadísticas del usuario cada segundo utilizando un algoritmo interno basado en el esfuerzo teórico:

* **Estimación de Distancia**: La velocidad teórica se calcula combinando de forma proporcional las RPM recomendadas y el nivel de resistencia seleccionado en el intervalo actual. A mayor cadencia y mayor resistencia, la velocidad virtual del ciclista aumenta, acumulando más metros por cada segundo de ejercicio transcurrido.  
* **Estimación de Calorías**: Se calcula en base al consumo metabólico teórico (MET) que exige el tipo de ejercicio. Los intervalos de alta resistencia o velocidades extremas exigen un mayor gasto de energía por segundo, lo que incrementa el contador de calorías acumuladas de manera proporcional al esfuerzo real de la rutina.

## **7\. Prevención Inteligente de Suspensión de Pantalla**

Dado que un atleta monta su dispositivo en la bicicleta y pasa largos minutos pedaleando sin tocar la pantalla, la aplicación cuenta con un **sistema automático de mantenimiento de pantalla encendida**:

* Mientras una sesión de entrenamiento esté activa, la aplicación le indica de forma invisible al dispositivo que debe mantener la pantalla encendida y anular el apagado automático o bloqueo del teléfono.  
* Si el usuario pausa la sesión o decide abandonarla para volver al menú de selección de rutina, el bloqueo de suspensión se desactiva para permitir que la pantalla del móvil vuelva a su comportamiento de ahorro de energía habitual.  
* Si el usuario sale temporalmente de la aplicación (por ejemplo, para cambiar de canción o responder un mensaje rápido) y vuelve a ingresar con la sesión aún activa, la aplicación detecta automáticamente su regreso y reactiva la protección de la pantalla sin requerir ninguna acción adicional.

[image1]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEoAAAAYCAYAAABdlmuNAAAEKklEQVR4Xu1XW4hNYRQ+Y1xzyW2M5nL2njmjYVzC8EJe3MWL3B5GyBMSGeVWEkVqpmSGeSK5lEuETG5DkzHEpJByiye3lFIkNRLfN3v9Z9ZZ9jlm8qT2V6vz/9+31vr/vf7L3icWixAhQoT/BPn5+QWe59XE4/Fb+L0JqqvWfd/vCW0PtEbYA/SPFhQU5GsfjcLCwgnw+5XBXsN2IUeJjgNXGeKr7RusGXNZbOJOKp+P5eXl3bRukA2fNzqvdQgFHCfBPsDWSr8IE1nvdBYJXAO4IzKBLujXcEIoSF4yUQgQM9JNXqhsFhh8ObgDsO+wypSgWNuYqxmH39OaLykp6Qf+nOSs1hrnB+4VNbQXak0D2jzkbZIch6weCgRtkoC5ihuARGNdH9oD2BPXd4BPC/h7lteQncr8b6xGMK/o2wxfIfxxzTtwXNG3Ow7z2Y+5Twf3nFrYImKRBjKny88Y6xMKJL4vAb7VCNlNP2HNVkPsNcYWFRXlWs3hL4XiznxPHbmmaQH9pRJ3QvMOXrB4nPdexfHqmIHf7aJt1TEE9HXcUV77QtRYnzB0FWdOdDJ+b8Puwk46B6zAMPFp1IEEuEvUsHJTrOZQXFwcl/h3VsOD7BStzmqZClVaWtrXC+4qjj3R8Z4UClYssc90nPg0xIIF6nihMNGh4tzK3YF+f+G3+HL01KXMAVIAn4uiTbWaQyKRKBQf3kUNXrAYb4V7hnEX2RgiTaGysHvHgDsjWvLYEb4cPbah3aCPXkT0x8OqpN3xo4dBPRmQx2em48vKyrpjwKtsY6BR4vNHoeBzwU7GQhXqraKzMcFV4D7D5ig+CVUobe8Q1wLtFNrzbQy4WvccaK+UmORlzaK4DaDy1zo9LXJzc3u7SeAuGaQ1cnxIXojiw0+GFICrF22E1RwyHT0uBvjWsHhoyxjHXWu1dIB/LfxnsZ2Tk9MH/a80Pifelj2gNTnfThWKkGQ/QngmGecHlznbf7zdoF2nhknkWM0hzY5qA7g6ar66kB3+tVDSPyY5VsCWxNUnT6cLxbuJAfYDjRwfUnzuY6CXWhcfvnmeWl7jL4WqkgdJ+VYi3IPweFstHaRQs12fx1DGvgyr1wva6UIh8XIG4O022nEsGrhHro/2Gvrk5eUNdpwc229+yCtYQ30evLcaJrtDtMchWtuOgl2yWjr4wR2ULFSs/Qucx/uc4jt3mQuyEHAFdh7F6kUCk9yM/jjjc1wfERYI3EMXkw644xLywJ9CNN5/vND5QkiAynKa134Z39F8JvjBVVCHXTzEcejvljwLtK/Kf1DzGcGLHAHVXlD9F7Cz1icWfHOtQRH34fcwrIp/J6yTQ4b/eq3aLx58/J2HPfSCT4eNITG0uzrOIh68CbV/BXkUbzjaX/gml/4G49dmqdkiRIgQIUKECBEy4jczp7NAv11JSQAAAABJRU5ErkJggg==>

[image2]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFQAAAAYCAYAAABk8drWAAAERElEQVR4Xu1XbWiOURgeTRTykZnebe/Z9k6TzzLfFMIPtZRGUVZS/jD5gbRCPiIxFI2Vr5IIxQ8Km9pky59lLQslphjSwog1S3Nd73OfnN3OO8Pr33PV3fOc67rPfe5zv+ec5z0pKSFChAgRIqnIzMwcrTkiG4hGo7eMMR9hz2CnMzIyMrUffNbCtRJ6LawKNkv7aEjMLo99hpXD5us+WVlZUzz+1jphTchjJ2yA7QNunfKb6cbUgH5S+bdpHy9QhGEYeC6eFej0TReKbfCvYGvoyyesA/Ya/Ua5vuDqc3Jy0vkO32Vod2LyS1wfH+D3XJKezHZeXl4aftwJMlY77HJ+fv5gTz/2ea/ovuA2i3Y/Nzd3iCsi59WiHXd5FxwL+d8WvzegUrXPb4GOVxggFotlKb4Z9g6FmmY5DDZOBvuCyfcXv8P6xwC3l34skMtrwOcR/RB3rEc7KGPVejTyLZonuEJFr3N5tItMsPI53ipXs4B2jTlL/2at9womcUGfkEeCKyyHXz0qg3Wlp6cPFL/qtLS0QT97xrn4SkHixS6vYaSgWM3jPdo5GeuQRyPPFfQLMOY+0RtcHu0iaLNFq3I1AjsjD3w55jtUfF5on17BJCgoJhlDAssVt0QGe2g5vDfb1WqBfhvFb7fLaxgpKHbBRMXPMsGZ+EBvXdEZ+63mCfA3Rd+u+CJ5PqaOHHOVvhfFnJG0gupt6wP8rspg8eSEa01RZw2S3UA/JLff5TWMFBRWB6uGPTXBOd0G26ZXvoX06VZQLIiR4LaIVqN/ZCM5I6dS+uC5y5FTOb7otqDJ3fIaKNIC+uG5w+WN5/AGVyJJ9WqF8kNkOcSfA+4dbI/r60Jiu9YKa4RdR/+tBQUF/XQffiz5xC6LwO+7CQrWV7RC9uN70lYoz0etWbDY8GnBoEe0Br5JT8BueT5dXsMk3vKbZFIlLm8hWofme4ItqLzbL/litvG8zELz/b8XNBr8ZWrUK9MC/F0m4XJGtl40wdfUwnhWqPBLZVLdPiwWov1LQYslxvlIJDICzxtWS1pBsUqM1hB8ALQadd6wz7EU2eZ4L+MXUukHGFPzGiZBQTHhRTKpTy5vIVq75nuCW1CZFy8QX/FeClvpaMkpKAJlK6kP+Auwo4rnAd5kG9yubrJENLhdxQ/5nmB+bvlJip8pk+Jfqhg5fjSB4aJT63T7/A7G+ZBK+5TEecMCW94p6F9/lG4wgGdSu01wePMqeQfWAHsJ68CglcqXf77jKxbadLQ/+P5bapjgOsuiTfVoHLcLtp5tnt+wAtHIc2XHC9wbIK+dMsc+0p7HGIhZ4frxxifxvRcHLxBsDDrc48RtciYoVKn1YdvRtJW78ZBUIbgy2EW8n4h6bj4axnOX5yStzuMCcc6Cr+cPCLuU6C7fU2HNr3f5MyJxBzZjjIVsSE26xRXzHjshQoQIESJEiBAh/gg/AK8sx16P76gbAAAAAElFTkSuQmCC>