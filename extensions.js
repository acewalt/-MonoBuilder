(function () {
  const extraComponents = [
    {
      id: "ui-spinner", name: "UI Spinner", className: "UISpinner", category: "Animation", icon: "SP",
      description: "Rotates a UI Image continuously and can cycle its hue for a loading-spinner or reward effect.",
      features: ["UI Image rotation", "Optional rainbow color cycle", "Independent rotation and color speed", "No scene references beyond the Image"],
      setup: ["Add this component to a UI Image.", "Enable Rotation and/or Rainbow.", "Tune the two speeds.", "Use Random Phase when several spinners should not move identically."],
      fields: [
        { key: "rotation", label: "Rotation", type: "bool", default: true },
        { key: "rotationSpeed", label: "Rotation Speed", type: "range", min: -10, max: 10, step: 0.1, default: 1 },
        { key: "rainbow", label: "Rainbow", type: "bool", default: true },
        { key: "rainbowSpeed", label: "Rainbow Speed", type: "range", min: -10, max: 10, step: 0.1, default: 0.5 },
        { key: "saturation", label: "Saturation", type: "range", min: 0, max: 1, step: 0.01, default: 1 },
        { key: "randomPhase", label: "Random Phase", type: "bool", default: true }
      ]
    },
    {
      id: "infinite-rotation", name: "Infinite Rotation", className: "InfiniteRotation", category: "Animation", icon: "IR",
      description: "Loops a 360-degree rotation using LeanTween. Useful for coins, icons, pickups and presentation objects.",
      features: ["LeanTween loop", "Editable axis", "Rotation duration", "Local rotation"],
      setup: ["Install LeanTween in the Unity project.", "Add the component to the object to rotate.", "Set an axis such as 0,1,0.", "Set the duration of one complete revolution."],
      fields: [
        { key: "axis", label: "Axis", type: "Vector3", default: "0, 1, 0" },
        { key: "duration", label: "Revolution Duration", type: "range", min: 0.05, max: 20, step: 0.05, default: 2 }
      ]
    },
    {
      id: "random-levitation", name: "Random Levitation", className: "RandomLevitation", category: "Animation", icon: "LV",
      description: "Makes an object float up and down with slightly randomized timing using LeanTween.",
      features: ["LeanTween vertical loop", "Random descent time", "Configurable height", "Seed option"],
      setup: ["Install LeanTween.", "Add this component to the floating object.", "Set Height and Up Duration.", "Adjust Min/Max Down Duration for less mechanical movement."],
      fields: [
        { key: "height", label: "Height", type: "range", min: 0.01, max: 10, step: 0.05, default: 1 },
        { key: "upDuration", label: "Up Duration", type: "range", min: 0.05, max: 10, step: 0.05, default: 1.5 },
        { key: "minDownDuration", label: "Min Down Duration", type: "range", min: 0.05, max: 10, step: 0.05, default: 1.5 },
        { key: "maxDownDuration", label: "Max Down Duration", type: "range", min: 0.05, max: 10, step: 0.05, default: 3 },
        { key: "seed", label: "Seed", type: "int", default: 0 }
      ]
    },
    {
      id: "ui-slide-toggle", name: "UI Slide Toggle", className: "UISlideToggle", category: "Animation", icon: "SL",
      description: "Moves a target UI object away from its original local position and back again each time a Button is clicked.",
      features: ["Button-driven toggle", "X/Y/Z direction", "LeanTween easing", "Returns to original position"],
      setup: ["Install LeanTween.", "Put this component on a UI Button.", "Assign the target object to move.", "Choose axis, distance, duration and easing."],
      fields: [
        { key: "target", label: "Target", type: "GameObject", default: "Panel" },
        { key: "axis", label: "Axis", type: "string", default: "Y", options: ["X", "Y", "Z"] },
        { key: "distance", label: "Distance", type: "float", default: 250 },
        { key: "duration", label: "Duration", type: "range", min: 0.05, max: 3, step: 0.05, default: 0.2 },
        { key: "ease", label: "Ease", type: "string", default: "easeOutBack", options: ["easeOutBack", "easeInOutSine", "easeInOutQuad", "linear"] }
      ]
    },
    {
      id: "scale-bounce", name: "Scale Bounce Intro", className: "ScaleBounceIntro", category: "Animation", icon: "SB",
      description: "Starts at scale zero after an optional delay and bounces to a target scale with LeanTween.",
      features: ["Delayed entrance", "Scale 0 to target", "Multiple easing presets", "Good for menus and reward UI"],
      setup: ["Install LeanTween.", "Add this component to the object that should appear.", "Choose delay and duration.", "Select the easing style."],
      fields: [
        { key: "delay", label: "Delay", type: "range", min: 0, max: 10, step: 0.05, default: 0.2 },
        { key: "duration", label: "Duration", type: "range", min: 0.05, max: 5, step: 0.05, default: 0.6 },
        { key: "targetScale", label: "Target Scale", type: "Vector3", default: "1, 1, 1" },
        { key: "ease", label: "Ease", type: "string", default: "easeOutBounce", options: ["easeOutBounce", "easeInOutElastic", "easeInOutQuad", "easeOutBack"] }
      ]
    },
    {
      id: "button-bounce", name: "Button Bounce", className: "ButtonBounce", category: "Animation", icon: "BT",
      description: "Adds a quick scale punch animation whenever a Unity UI Button is clicked.",
      features: ["Automatic Button listener", "LeanTween scale animation", "Editable bounce amount", "Returns to original scale"],
      setup: ["Install LeanTween.", "Add this component to a Button.", "Assign the object that should bounce.", "Tune Scale Multiplier and Duration."],
      fields: [
        { key: "target", label: "Animated Object", type: "GameObject", default: "Button" },
        { key: "scaleMultiplier", label: "Scale Multiplier", type: "range", min: 1, max: 2, step: 0.01, default: 1.15 },
        { key: "duration", label: "Duration", type: "range", min: 0.03, max: 1, step: 0.01, default: 0.12 },
        { key: "ease", label: "Ease", type: "string", default: "easeOutBack", options: ["easeOutBack", "easeOutBounce", "easeInOutQuad"] }
      ]
    },
    {
      id: "ui-rotation-toggle", name: "UI Rotation Toggle", className: "UIRotationToggle", category: "Animation", icon: "RT",
      description: "Rotates a target to a chosen angle on click and restores the original rotation on the next click.",
      features: ["Button-driven rotation", "X/Y/Z axis", "LeanTween easing", "Original-state restore"],
      setup: ["Install LeanTween.", "Put this component on a Button.", "Assign the object to rotate.", "Choose axis, angle and duration."],
      fields: [
        { key: "target", label: "Target", type: "GameObject", default: "Arrow" },
        { key: "axis", label: "Axis", type: "string", default: "Z", options: ["X", "Y", "Z"] },
        { key: "angle", label: "Angle", type: "range", min: -360, max: 360, step: 1, default: 90 },
        { key: "duration", label: "Duration", type: "range", min: 0.05, max: 3, step: 0.05, default: 0.2 },
        { key: "ease", label: "Ease", type: "string", default: "easeOutBack", options: ["easeOutBack", "easeInOutSine", "easeInOutQuad", "linear"] }
      ]
    },
    {
      id: "multi-rotator", name: "Multi Object Rotator", className: "MultiObjectRotator", category: "Animation", icon: "MR",
      description: "Rotates several assigned objects indefinitely with DOTween. Built from the multi-object animation idea in your scripts.",
      features: ["DOTween loops", "Three independent object slots", "Shared speed and axis", "Automatic tween cleanup"],
      setup: ["Install DOTween.", "Assign one to three objects.", "Choose an axis.", "Set the duration of one complete rotation."],
      fields: [
        { key: "targetA", label: "Object A", type: "GameObject", default: "" },
        { key: "targetB", label: "Object B", type: "GameObject", default: "" },
        { key: "targetC", label: "Object C", type: "GameObject", default: "" },
        { key: "axis", label: "Axis", type: "Vector3", default: "0, 1, 0" },
        { key: "duration", label: "Revolution Duration", type: "range", min: 0.05, max: 20, step: 0.05, default: 2 }
      ]
    },
    {
      id: "trivia-quiz", name: "Trivia Quiz Manager", className: "TriviaQuizManager", category: "Quiz", icon: "QZ",
      description: "A four-answer trivia manager with TextMeshPro, answer buttons, score tracking and win/lose scenes.",
      features: ["Serializable question bank", "Four answers per question", "Correct / incorrect feedback", "Win and lose scene routing"],
      setup: ["Assign Question Text, four answer labels and four Buttons.", "Assign a Next Button.", "Create questions in the component's Questions list.", "Add win/lose scenes to Build Settings and set their indices."],
      fields: [
        { key: "questionText", label: "Question Text", type: "TMP_Text", default: "QuestionText" },
        { key: "answer1Text", label: "Answer 1 Text", type: "TMP_Text", default: "Answer1" },
        { key: "answer2Text", label: "Answer 2 Text", type: "TMP_Text", default: "Answer2" },
        { key: "answer3Text", label: "Answer 3 Text", type: "TMP_Text", default: "Answer3" },
        { key: "answer4Text", label: "Answer 4 Text", type: "TMP_Text", default: "Answer4" },
        { key: "answer1Button", label: "Answer 1 Button", type: "Button", default: "Answer1Button" },
        { key: "answer2Button", label: "Answer 2 Button", type: "Button", default: "Answer2Button" },
        { key: "answer3Button", label: "Answer 3 Button", type: "Button", default: "Answer3Button" },
        { key: "answer4Button", label: "Answer 4 Button", type: "Button", default: "Answer4Button" },
        { key: "nextButton", label: "Next Button", type: "Button", default: "NextButton" },
        { key: "questionsToFinish", label: "Questions To Finish", type: "int", default: 5 },
        { key: "winScene", label: "Win Scene Index", type: "int", default: 1 },
        { key: "loseScene", label: "Lose Scene Index", type: "int", default: 2 }
      ]
    },
    {
      id: "registration-form", name: "Registration Form POST", className: "RegistrationFormPost", category: "Network", icon: "RF",
      description: "Validates common registration fields and sends them as JSON with UnityWebRequest.",
      features: ["TMP input validation", "Phone and age checks", "Optional confirmation toggles", "HTTP POST JSON"],
      setup: ["Assign the four TMP_InputFields and Submit Button.", "Set an HTTPS API URL.", "Optionally assign two confirmation Toggles.", "Do not embed private API secrets in a shipped Unity client."],
      fields: [
        { key: "fullNameInput", label: "Full Name Input", type: "TMP_InputField", default: "FullNameInput" },
        { key: "emailInput", label: "Email Input", type: "TMP_InputField", default: "EmailInput" },
        { key: "phoneInput", label: "Phone Input", type: "TMP_InputField", default: "PhoneInput" },
        { key: "ageInput", label: "Age Input", type: "TMP_InputField", default: "AgeInput" },
        { key: "confirmA", label: "Confirmation A", type: "Toggle", default: "" },
        { key: "confirmB", label: "Confirmation B", type: "Toggle", default: "" },
        { key: "submitButton", label: "Submit Button", type: "Button", default: "SubmitButton" },
        { key: "requireConfirmations", label: "Require Confirmations", type: "bool", default: true },
        { key: "apiUrl", label: "API URL", type: "string", default: "https://example.com/register" },
        { key: "headerName", label: "Optional Header Name", type: "string", default: "" },
        { key: "headerValue", label: "Optional Public Header Value", type: "string", default: "" }
      ]
    },
    {
      id: "periodic-data-sender", name: "Periodic Data Sender", className: "PeriodicDataSender", category: "Network", icon: "DS",
      description: "Periodically sends selected TextMeshPro values to an HTTP endpoint while an Online toggle is enabled.",
      features: ["Online/offline toggle", "Editable send interval", "Three named text values", "UnityWebRequest POST"],
      setup: ["Assign Online Toggle and optional Interval Input.", "Assign up to three TMP text values and choose their JSON keys.", "Set the API URL.", "Only use a public/non-secret header value in a client build."],
      fields: [
        { key: "onlineToggle", label: "Online Toggle", type: "Toggle", default: "OnlineToggle" },
        { key: "intervalInput", label: "Interval Input", type: "TMP_InputField", default: "IntervalInput" },
        { key: "textA", label: "Text A", type: "TMP_Text", default: "" },
        { key: "keyA", label: "Key A", type: "string", default: "valueA" },
        { key: "textB", label: "Text B", type: "TMP_Text", default: "" },
        { key: "keyB", label: "Key B", type: "string", default: "valueB" },
        { key: "textC", label: "Text C", type: "TMP_Text", default: "" },
        { key: "keyC", label: "Key C", type: "string", default: "valueC" },
        { key: "sendIntervalMinutes", label: "Send Interval Minutes", type: "range", min: 0.1, max: 120, step: 0.1, default: 10 },
        { key: "apiUrl", label: "API URL", type: "string", default: "https://example.com/data" },
        { key: "headerName", label: "Optional Header Name", type: "string", default: "" },
        { key: "headerValue", label: "Optional Public Header Value", type: "string", default: "" }
      ]
    }
  ];

  extraComponents.forEach(function (component) {
    if (!builtins.some(function (item) { return item.id === component.id; })) builtins.push(component);
  });
  templates = builtins.concat(customTemplates);

  const originalReferenceType = isReferenceType;
  isReferenceType = function (type) {
    return originalReferenceType(type) || ["Image", "RectTransform", "CanvasGroup", "TMP_InputField", "Toggle"].indexOf(type) !== -1;
  };

  const spanish = {
    "player-movement": {
      name: "Movimiento del Jugador", description: "Movimiento con CharacterController usando Unity Input System, salto, gravedad y dirección relativa a cámara.",
      features: ["InputActionReference para mover y saltar", "Movimiento relativo a cámara opcional", "Basado en CharacterController", "Velocidad, salto y gravedad configurables"],
      setup: ["Añade un CharacterController al GameObject del jugador.", "Crea las acciones Move (Vector2) y Jump en un Input Actions asset.", "Asigna esas acciones en el componente.", "Opcionalmente asigna la cámara para mover según su orientación."],
      fields: { controller: "Controlador", moveAction: "Input de Movimiento", jumpAction: "Input de Salto", cameraTransform: "Cámara", speed: "Velocidad", jumpHeight: "Altura de Salto", gravity: "Gravedad" }
    },
    health: {
      name: "Salud", description: "Componente reutilizable de salud con daño, curación, evento de muerte y destrucción opcional.",
      features: ["Métodos de daño y curación", "UnityEvent al morir", "Límite entre 0 y salud máxima", "Destrucción opcional al morir"],
      setup: ["Añade Health a cualquier GameObject.", "Configura salud máxima e inicial.", "Llama TakeDamage(amount) desde armas o peligros.", "Opcionalmente conecta On Death en el Inspector."],
      fields: { maxHealth: "Salud Máxima", startingHealth: "Salud Inicial", destroyOnDeath: "Destruir al Morir", destroyDelay: "Retraso al Destruir" }
    },
    "camera-follow": {
      name: "Seguimiento de Cámara", description: "Cámara suave que sigue un objetivo con offset editable y LookAt opcional.",
      features: ["Seguimiento SmoothDamp", "Offset en espacio global", "Movimiento en LateUpdate", "LookAt opcional"],
      setup: ["Añade el componente a la cámara.", "Asigna el Transform objetivo, normalmente el jugador.", "Ajusta offset y suavizado.", "Activa Mirar Objetivo si debe orientarse siempre al objetivo."],
      fields: { target: "Objetivo", offset: "Desplazamiento", smoothTime: "Suavizado", lookAtTarget: "Mirar Objetivo" }
    },
    "tmp-counter": {
      name: "Contador TMP", description: "Controla un texto de TextMeshPro a partir de un valor numérico sin escribir código de UI.",
      features: ["Referencia TMP_Text", "Prefijo y sufijo", "Métodos Set y Add", "Actualización automática"],
      setup: ["Crea un TextMeshProUGUI en el Canvas.", "Asigna su TMP_Text.", "Define prefijo o sufijo si quieres.", "Llama SetValue o AddValue desde otros componentes."],
      fields: { targetText: "Texto", prefix: "Prefijo", suffix: "Sufijo", startingValue: "Valor Inicial" }
    },
    "trigger-message": {
      name: "Mensaje por Trigger", description: "Muestra un mensaje TextMeshPro mientras un objeto con la etiqueta indicada permanezca en un trigger.",
      features: ["OnTriggerEnter / Exit", "Salida TMP_Text", "Filtro por Tag", "Mensaje editable"],
      setup: ["Marca un Collider como Is Trigger.", "Asigna el texto TMP del mensaje.", "Asegura que el objeto entrante tenga el Tag requerido.", "Pon el componente en el objeto trigger."],
      fields: { messageText: "Texto del Mensaje", message: "Mensaje", requiredTag: "Tag Requerido", clearOnExit: "Limpiar al Salir" }
    },
    door: {
      name: "Puerta por Input", description: "Puerta de proximidad controlada con InputActionReference y rotación suave.",
      features: ["Unity Input System", "Detección por trigger", "Abrir/cerrar suave", "Ángulo configurable"],
      setup: ["Pon un Collider trigger en el objeto.", "Asigna el Tag Player al jugador.", "Asigna un InputActionReference de Interact.", "Asigna el Transform que girará como bisagra."],
      fields: { door: "Transform de Puerta", interactAction: "Input de Interacción", playerTag: "Tag del Jugador", openAngle: "Ángulo Abierto", openSpeed: "Velocidad de Apertura" }
    },
    pickup: {
      name: "Recogible", description: "Pickup genérico por trigger que ejecuta un UnityEvent y puede ocultarse o destruirse.",
      features: ["Filtro por Tag", "Callback UnityEvent", "Ocultar o destruir", "Sirve para monedas, llaves y powerups"],
      setup: ["Marca un Collider como Is Trigger.", "Asigna el Tag del jugador.", "Conecta On Picked a la acción deseada.", "Decide si se oculta o destruye al recogerlo."],
      fields: { requiredTag: "Tag Requerido", disableOnPickup: "Desactivar al Recoger", destroyOnPickup: "Destruir al Recoger" }
    },
    rotator: {
      name: "Rotador de Objeto", description: "Rota continuamente un GameObject sobre un eje y velocidad configurables.",
      features: ["Rotación local o global", "Eje Vector3", "Basado en DeltaTime", "Útil para pickups y exhibición"],
      setup: ["Añade el componente al objeto.", "Usa por ejemplo 0,1,0 para el eje Y.", "Define la velocidad.", "Activa Espacio Local para rotar sobre sus propios ejes."],
      fields: { axis: "Eje", degreesPerSecond: "Grados / Segundo", localSpace: "Espacio Local" }
    },
    "ui-spinner": {
      name: "Spinner UI", description: "Rota una Image de UI continuamente y opcionalmente cambia su tono para loaders o recompensas.",
      features: ["Rotación de Image UI", "Ciclo arcoíris opcional", "Velocidad independiente", "Sin referencias extra de escena"],
      setup: ["Añade el componente a una Image.", "Activa Rotación y/o Arcoíris.", "Ajusta ambas velocidades.", "Activa Fase Aleatoria para evitar movimientos idénticos."],
      fields: { rotation: "Rotación", rotationSpeed: "Velocidad de Rotación", rainbow: "Arcoíris", rainbowSpeed: "Velocidad de Color", saturation: "Saturación", randomPhase: "Fase Aleatoria" }
    },
    "infinite-rotation": {
      name: "Rotación Infinita", description: "Repite una rotación de 360 grados usando LeanTween para monedas, iconos y objetos.",
      features: ["Bucle LeanTween", "Eje editable", "Duración de giro", "Rotación local"],
      setup: ["Instala LeanTween.", "Añade el componente al objeto.", "Define el eje, por ejemplo 0,1,0.", "Configura la duración de una vuelta."],
      fields: { axis: "Eje", duration: "Duración de una Vuelta" }
    },
    "random-levitation": {
      name: "Levitación Aleatoria", description: "Hace flotar un objeto arriba y abajo con tiempos ligeramente aleatorios usando LeanTween.",
      features: ["Bucle vertical LeanTween", "Descenso aleatorio", "Altura configurable", "Semilla opcional"],
      setup: ["Instala LeanTween.", "Añade el componente al objeto.", "Configura Altura y Duración de Subida.", "Ajusta el rango de duración de bajada."],
      fields: { height: "Altura", upDuration: "Duración de Subida", minDownDuration: "Bajada Mínima", maxDownDuration: "Bajada Máxima", seed: "Semilla" }
    },
    "ui-slide-toggle": {
      name: "Desplazamiento UI Alterno", description: "Mueve un objeto UI desde su posición original y lo devuelve al hacer clic nuevamente.",
      features: ["Alterna con Button", "Dirección X/Y/Z", "Easing LeanTween", "Vuelve a posición original"],
      setup: ["Instala LeanTween.", "Pon el componente en un Button.", "Asigna el objeto a desplazar.", "Elige eje, distancia, duración y easing."],
      fields: { target: "Objetivo", axis: "Eje", distance: "Distancia", duration: "Duración", ease: "Easing" }
    },
    "scale-bounce": {
      name: "Aparición con Rebote", description: "Empieza en escala cero tras un retraso y rebota hasta la escala objetivo usando LeanTween.",
      features: ["Entrada con retraso", "Escala 0 a objetivo", "Varios easing", "Ideal para menús y recompensas"],
      setup: ["Instala LeanTween.", "Añade el componente al objeto.", "Elige retraso y duración.", "Selecciona el easing."],
      fields: { delay: "Retraso", duration: "Duración", targetScale: "Escala Objetivo", ease: "Easing" }
    },
    "button-bounce": {
      name: "Rebote de Botón", description: "Añade una animación rápida de escala cada vez que se pulsa un Button de Unity.",
      features: ["Listener automático", "Escala con LeanTween", "Rebote configurable", "Vuelve a escala original"],
      setup: ["Instala LeanTween.", "Añade el componente a un Button.", "Asigna el objeto a animar.", "Ajusta multiplicador y duración."],
      fields: { target: "Objeto Animado", scaleMultiplier: "Multiplicador de Escala", duration: "Duración", ease: "Easing" }
    },
    "ui-rotation-toggle": {
      name: "Rotación UI Alterna", description: "Rota un objetivo al hacer clic y restaura su rotación original con el siguiente clic.",
      features: ["Rotación por Button", "Eje X/Y/Z", "Easing LeanTween", "Restaura estado original"],
      setup: ["Instala LeanTween.", "Pon el componente en un Button.", "Asigna el objeto a rotar.", "Elige eje, ángulo y duración."],
      fields: { target: "Objetivo", axis: "Eje", angle: "Ángulo", duration: "Duración", ease: "Easing" }
    },
    "multi-rotator": {
      name: "Rotador de Varios Objetos", description: "Rota varios objetos asignados indefinidamente con DOTween.",
      features: ["Bucles DOTween", "Tres objetos independientes", "Velocidad y eje compartidos", "Limpieza automática de tweens"],
      setup: ["Instala DOTween.", "Asigna de uno a tres objetos.", "Elige un eje.", "Configura la duración de una vuelta."],
      fields: { targetA: "Objeto A", targetB: "Objeto B", targetC: "Objeto C", axis: "Eje", duration: "Duración de una Vuelta" }
    },
    "trivia-quiz": {
      name: "Gestor de Trivia", description: "Trivia de cuatro respuestas con TextMeshPro, botones, puntaje y escenas de victoria/derrota.",
      features: ["Banco de preguntas serializable", "Cuatro respuestas por pregunta", "Feedback correcto/incorrecto", "Escenas de victoria y derrota"],
      setup: ["Asigna el texto de pregunta, cuatro textos y cuatro botones.", "Asigna el botón Siguiente.", "Crea preguntas en la lista Questions del componente.", "Añade las escenas al Build Settings y define sus índices."],
      fields: { questionText: "Texto de Pregunta", answer1Text: "Texto Respuesta 1", answer2Text: "Texto Respuesta 2", answer3Text: "Texto Respuesta 3", answer4Text: "Texto Respuesta 4", answer1Button: "Botón Respuesta 1", answer2Button: "Botón Respuesta 2", answer3Button: "Botón Respuesta 3", answer4Button: "Botón Respuesta 4", nextButton: "Botón Siguiente", questionsToFinish: "Preguntas para Terminar", winScene: "Índice Escena Victoria", loseScene: "Índice Escena Derrota" }
    },
    "registration-form": {
      name: "Formulario de Registro POST", description: "Valida campos comunes de registro y los envía como JSON usando UnityWebRequest.",
      features: ["Validación TMP", "Validación de teléfono y edad", "Confirmaciones opcionales", "HTTP POST JSON"],
      setup: ["Asigna los cuatro TMP_InputField y el botón Enviar.", "Configura una URL HTTPS.", "Opcionalmente asigna dos Toggles de confirmación.", "No incrustes secretos privados de API en una aplicación Unity distribuida."],
      fields: { fullNameInput: "Input Nombre Completo", emailInput: "Input Correo", phoneInput: "Input Teléfono", ageInput: "Input Edad", confirmA: "Confirmación A", confirmB: "Confirmación B", submitButton: "Botón Enviar", requireConfirmations: "Exigir Confirmaciones", apiUrl: "URL de API", headerName: "Nombre Header Opcional", headerValue: "Valor Público Opcional" }
    },
    "periodic-data-sender": {
      name: "Envío Periódico de Datos", description: "Envía periódicamente valores TextMeshPro a un endpoint mientras el Toggle Online esté activo.",
      features: ["Modo online/offline", "Intervalo editable", "Tres valores con nombres", "POST con UnityWebRequest"],
      setup: ["Asigna Toggle Online e Input de intervalo.", "Asigna hasta tres textos TMP y sus claves JSON.", "Configura la URL de API.", "Usa solo valores públicos/no secretos en headers del cliente."],
      fields: { onlineToggle: "Toggle Online", intervalInput: "Input de Intervalo", textA: "Texto A", keyA: "Clave A", textB: "Texto B", keyB: "Clave B", textC: "Texto C", keyC: "Clave C", sendIntervalMinutes: "Intervalo en Minutos", apiUrl: "URL de API", headerName: "Nombre Header Opcional", headerValue: "Valor Público Opcional" }
    }
  };

  const base = {};
  templates.forEach(function (template) {
    base[template.id] = {
      name: template.name,
      description: template.description,
      features: (template.features || []).slice(),
      setup: (template.setup || []).slice(),
      fields: template.fields.map(function (field) {
        return { key: field.key, label: field.label, help: field.help || "" };
      })
    };
  });

  let lang = localStorage.getItem("monobuilder-lang") || (navigator.language && navigator.language.toLowerCase().startsWith("es") ? "es" : "en");

  const ui = {
    en: {
      library: "Library", components: "Components", search: "Search components", visualSetup: "Visual setup",
      browserOnly: "Browser only", gameObject: "GameObject", sceneObject: "Scene object", whatItDoes: "What it does",
      inspectorPreview: "Inspector Preview", mock: "Mock", generated: "Generated C#", unitySetup: "Unity setup",
      copy: "Copy", inspector: "Inspector", properties: "Properties",
      note: "Change values here. MonoBuilder updates the preview and generated C# instantly.",
      editableLibrary: "Editable library", createTemplate: "Create component template", name: "Name", className: "Class name",
      category: "Category", description: "Description", inspectorFields: "Inspector fields",
      fieldHint: "Add only the options a non-programmer should have to touch.", addField: "+ Field", cancel: "Cancel",
      saveLibrary: "Save to library", reset: "Reset", copyCs: "Copy C#", exportCs: "Export .cs", all: "All",
      custom: "CUSTOM", enabled: "Enabled", disabled: "Disabled"
    },
    es: {
      library: "Librería", components: "Componentes", search: "Buscar componentes", visualSetup: "Configuración visual",
      browserOnly: "Solo navegador", gameObject: "GameObject", sceneObject: "Objeto de escena", whatItDoes: "Qué hace",
      inspectorPreview: "Vista del Inspector", mock: "Simulación", generated: "C# generado", unitySetup: "Configuración en Unity",
      copy: "Copiar", inspector: "Inspector", properties: "Propiedades",
      note: "Cambia los valores aquí. MonoBuilder actualiza la vista y el C# generado al instante.",
      editableLibrary: "Librería editable", createTemplate: "Crear plantilla de componente", name: "Nombre", className: "Nombre de clase",
      category: "Categoría", description: "Descripción", inspectorFields: "Campos del Inspector",
      fieldHint: "Añade solo las opciones que una persona sin conocimientos de programación debería tocar.", addField: "+ Campo", cancel: "Cancelar",
      saveLibrary: "Guardar en librería", reset: "Reiniciar", copyCs: "Copiar C#", exportCs: "Exportar .cs", all: "Todos",
      custom: "PERSONAL", enabled: "Activado", disabled: "Desactivado"
    }
  };

  const categoryNames = {
    en: { Character: "Character", Camera: "Camera", UI: "UI", Interaction: "Interaction", Objects: "Objects", Animation: "Animation", Quiz: "Quiz", Network: "Network", Custom: "Custom" },
    es: { Character: "Personaje", Camera: "Cámara", UI: "UI", Interaction: "Interacción", Objects: "Objetos", Animation: "Animación", Quiz: "Trivia", Network: "Red / HTTP", Custom: "Personal" }
  };

  function applyTemplateLanguage() {
    templates.forEach(function (template) {
      const source = base[template.id];
      if (!source) return;
      template.name = source.name;
      template.description = source.description;
      template.features = source.features.slice();
      template.setup = source.setup.slice();
      template.fields.forEach(function (field) {
        const original = source.fields.find(function (item) { return item.key === field.key; });
        if (original) {
          field.label = original.label;
          if (original.help) field.help = original.help;
        }
      });
      if (lang === "es" && spanish[template.id]) {
        const tr = spanish[template.id];
        if (tr.name) template.name = tr.name;
        if (tr.description) template.description = tr.description;
        if (tr.features) template.features = tr.features.slice();
        if (tr.setup) template.setup = tr.setup.slice();
        if (tr.fields) template.fields.forEach(function (field) {
          if (tr.fields[field.key]) field.label = tr.fields[field.key];
        });
      }
    });
  }

  function localizeRenderedUI() {
    const t = ui[lang];
    document.documentElement.lang = lang;
    document.title = lang === "es" ? "MonoBuilder — Constructor visual para Unity" : "MonoBuilder — Visual Unity Component Builder";
    const langBtn = document.getElementById("languageBtn");
    if (langBtn) langBtn.textContent = lang === "es" ? "EN" : "ES";
    document.getElementById("resetProjectBtn").textContent = t.reset;
    document.getElementById("copyCodeBtn").textContent = t.copyCs;
    document.getElementById("downloadCodeBtn").textContent = t.exportCs;
    const lib = document.querySelector(".library-panel");
    if (lib) {
      lib.querySelector(".eyebrow").textContent = t.library;
      lib.querySelector("h2").textContent = t.components;
    }
    els.librarySearch.placeholder = t.search;
    const build = document.querySelector(".builder-panel");
    if (build) {
      build.querySelector(".panel-heading .eyebrow").textContent = t.visualSetup;
      build.querySelector(".status-pill").textContent = t.browserOnly;
      build.querySelector(".mini-label").textContent = t.gameObject;
      build.querySelector(".object-meta span").textContent = t.sceneObject;
      build.querySelector(".section-title h3").textContent = t.whatItDoes;
      build.querySelector(".preview-toolbar strong").textContent = t.inspectorPreview;
      build.querySelector(".preview-mode").textContent = t.mock;
    }
    const tabs = document.querySelectorAll(".code-tab");
    if (tabs[0]) tabs[0].textContent = t.generated;
    if (tabs[1]) tabs[1].textContent = t.unitySetup;
    const inlineCopy = document.getElementById("copyCodeInlineBtn");
    if (inlineCopy) inlineCopy.textContent = t.copy;
    const insp = document.querySelector(".inspector-panel");
    if (insp) {
      insp.querySelector(".eyebrow").textContent = t.inspector;
      insp.querySelector("h2").textContent = t.properties;
      insp.querySelector(".inspector-note").textContent = t.note;
    }
    const modal = document.getElementById("templateDialog");
    if (modal) {
      modal.querySelector(".modal-header .eyebrow").textContent = t.editableLibrary;
      modal.querySelector(".modal-header h2").textContent = t.createTemplate;
      const labels = modal.querySelectorAll(".modal-grid label > span");
      if (labels[0]) labels[0].textContent = t.name;
      if (labels[1]) labels[1].textContent = t.className;
      if (labels[2]) labels[2].textContent = t.category;
      if (labels[3]) labels[3].textContent = t.description;
      modal.querySelector(".field-builder-heading h3").textContent = t.inspectorFields;
      modal.querySelector(".field-builder-heading p").textContent = t.fieldHint;
      document.getElementById("addFieldBtn").textContent = t.addField;
      const actions = modal.querySelectorAll(".modal-actions .button");
      if (actions[0]) actions[0].textContent = t.cancel;
      if (actions[1]) actions[1].textContent = t.saveLibrary;
    }
    document.querySelectorAll(".category-chip").forEach(function (chip) {
      const raw = chip.dataset.rawCategory || chip.textContent;
      chip.dataset.rawCategory = raw;
      chip.textContent = raw === "All" ? t.all : (categoryNames[lang][raw] || raw);
    });
    document.querySelectorAll(".library-tag").forEach(function (tag) {
      const raw = tag.dataset.rawCategory || tag.textContent;
      tag.dataset.rawCategory = raw;
      tag.textContent = categoryNames[lang][raw] || raw;
    });
    document.querySelectorAll(".custom-tag").forEach(function (tag) { tag.textContent = t.custom; });
    document.querySelectorAll(".check-control span").forEach(function (caption) {
      if (caption.textContent === "Enabled" || caption.textContent === "Activado") caption.textContent = t.enabled;
      if (caption.textContent === "Disabled" || caption.textContent === "Desactivado") caption.textContent = t.disabled;
    });
  }

  const coreRenderAll = renderAll;
  renderAll = function () {
    applyTemplateLanguage();
    coreRenderAll();
    localizeRenderedUI();
  };

  const coreRenderCategories = renderCategories;
  renderCategories = function () {
    coreRenderCategories();
    localizeRenderedUI();
  };

  const coreRenderLibrary = renderLibrary;
  renderLibrary = function () {
    coreRenderLibrary();
    localizeRenderedUI();
  };

  renderProperties = function () {
    const template = currentTemplate();
    els.propertyForm.innerHTML = "";

    template.fields.forEach(function (field) {
      const group = document.createElement("div");
      group.className = "property-group";

      const label = document.createElement("label");
      label.innerHTML = "<span>" + field.label + "</span><span class=\"type-chip\">" + fieldTypeLabel(field) + "</span>";
      group.appendChild(label);

      let control;
      if (field.type === "bool") {
        control = document.createElement("div");
        control.className = "check-control";
        const input = document.createElement("input");
        input.type = "checkbox";
        input.checked = Boolean(values[field.key]);
        const caption = document.createElement("span");
        caption.textContent = input.checked ? ui[lang].enabled : ui[lang].disabled;
        input.addEventListener("change", function () {
          values[field.key] = input.checked;
          caption.textContent = input.checked ? ui[lang].enabled : ui[lang].disabled;
          updateOutputs();
        });
        control.append(input, caption);
      } else if (field.type === "range") {
        control = document.createElement("div");
        control.className = "range-control";
        const input = document.createElement("input");
        input.type = "range";
        input.min = field.min;
        input.max = field.max;
        input.step = field.step || 1;
        input.value = values[field.key];
        const valueLabel = document.createElement("div");
        valueLabel.className = "range-value";
        valueLabel.textContent = input.value;
        input.addEventListener("input", function () {
          values[field.key] = Number(input.value);
          valueLabel.textContent = input.value;
          updateOutputs();
        });
        control.append(input, valueLabel);
      } else if (field.options) {
        control = document.createElement("select");
        field.options.forEach(function (option) {
          const item = document.createElement("option");
          item.value = option;
          item.textContent = option;
          item.selected = values[field.key] === option;
          control.appendChild(item);
        });
        control.addEventListener("change", function () {
          values[field.key] = control.value;
          updateOutputs();
        });
      } else {
        control = field.type === "textarea" ? document.createElement("textarea") : document.createElement("input");
        if (control.tagName === "INPUT") {
          control.type = field.type === "int" || field.type === "float" ? "number" : "text";
          if (field.type === "float") control.step = "0.1";
        }
        control.value = values[field.key] == null ? "" : values[field.key];
        if (isReferenceType(field.type)) control.placeholder = lang === "es" ? "Referencia de escena / asset" : "Scene reference / asset";
        control.addEventListener("input", function () {
          values[field.key] = field.type === "int" ? parseInt(control.value, 10) || 0 :
            field.type === "float" ? Number(control.value) || 0 : control.value;
          updateOutputs();
        });
      }

      group.appendChild(control);
      if (field.help) {
        const help = document.createElement("div");
        help.className = "property-help";
        help.textContent = field.help;
        group.appendChild(help);
      }
      els.propertyForm.appendChild(group);
    });
  };

  const originalBuiltInCode = builtInCode;

  function v3(value) {
    const p = parseVector(value, 3);
    return "new Vector3(" + p[0] + "f, " + p[1] + "f, " + p[2] + "f)";
  }

  function q(value) {
    return '"' + escapeCs(value || "") + '"';
  }

  builtInCode = function (template) {
    const v = values;

    if (template.id === "ui-spinner") {
      return [
        "using UnityEngine;",
        "using UnityEngine.UI;",
        "",
        "[RequireComponent(typeof(Image))]",
        "public class UISpinner : MonoBehaviour",
        "{",
        "    [SerializeField] private bool rotation = " + (v.rotation ? "true" : "false") + ";",
        "    [SerializeField] private float rotationSpeed = " + Number(v.rotationSpeed) + "f;",
        "    [SerializeField] private bool rainbow = " + (v.rainbow ? "true" : "false") + ";",
        "    [SerializeField] private float rainbowSpeed = " + Number(v.rainbowSpeed) + "f;",
        "    [Range(0f, 1f), SerializeField] private float saturation = " + Number(v.saturation) + "f;",
        "    [SerializeField] private bool randomPhase = " + (v.randomPhase ? "true" : "false") + ";",
        "",
        "    private Image imageComponent;",
        "    private float phase;",
        "",
        "    private void Awake()",
        "    {",
        "        imageComponent = GetComponent<Image>();",
        "        phase = randomPhase ? Random.value : 0f;",
        "    }",
        "",
        "    private void Update()",
        "    {",
        "        if (rotation) transform.localEulerAngles = new Vector3(0f, 0f, -360f * ((rotationSpeed * Time.unscaledTime + phase) % 1f));",
        "        if (rainbow) imageComponent.color = Color.HSVToRGB((rainbowSpeed * Time.unscaledTime + phase) % 1f, saturation, 1f);",
        "    }",
        "}"
      ].join("\n");
    }

    if (template.id === "infinite-rotation") {
      return [
        "using UnityEngine;",
        "",
        "public class InfiniteRotation : MonoBehaviour",
        "{",
        "    [SerializeField] private Vector3 axis = " + v3(v.axis) + ";",
        "    [SerializeField] private float duration = " + Number(v.duration) + "f;",
        "",
        "    private void Start()",
        "    {",
        "        Vector3 delta = axis.normalized * 360f;",
        "        LeanTween.rotateAroundLocal(gameObject, axis.normalized, 360f, Mathf.Max(0.01f, duration)).setLoopClamp().setEaseLinear();",
        "    }",
        "",
        "    private void OnDisable() { LeanTween.cancel(gameObject); }",
        "}"
      ].join("\n");
    }

    if (template.id === "random-levitation") {
      return [
        "using UnityEngine;",
        "",
        "public class RandomLevitation : MonoBehaviour",
        "{",
        "    [SerializeField] private float height = " + Number(v.height) + "f;",
        "    [SerializeField] private float upDuration = " + Number(v.upDuration) + "f;",
        "    [SerializeField] private float minDownDuration = " + Number(v.minDownDuration) + "f;",
        "    [SerializeField] private float maxDownDuration = " + Number(v.maxDownDuration) + "f;",
        "    [SerializeField] private int seed = " + parseInt(v.seed, 10) + ";",
        "",
        "    private float originY;",
        "",
        "    private void Start()",
        "    {",
        "        Random.InitState(seed);",
        "        originY = transform.localPosition.y;",
        "        MoveUp();",
        "    }",
        "",
        "    private void MoveUp()",
        "    {",
        "        LeanTween.moveLocalY(gameObject, originY + height, upDuration).setEaseInOutSine().setOnComplete(MoveDown);",
        "    }",
        "",
        "    private void MoveDown()",
        "    {",
        "        float time = Random.Range(Mathf.Min(minDownDuration, maxDownDuration), Mathf.Max(minDownDuration, maxDownDuration));",
        "        LeanTween.moveLocalY(gameObject, originY, time).setEaseInOutSine().setOnComplete(MoveUp);",
        "    }",
        "",
        "    private void OnDisable() { LeanTween.cancel(gameObject); }",
        "}"
      ].join("\n");
    }

    if (template.id === "ui-slide-toggle") {
      return [
        "using UnityEngine;",
        "using UnityEngine.UI;",
        "",
        "[RequireComponent(typeof(Button))]",
        "public class UISlideToggle : MonoBehaviour",
        "{",
        "    [SerializeField] private GameObject target;",
        "    [SerializeField] private string axis = " + q(v.axis) + ";",
        "    [SerializeField] private float distance = " + Number(v.distance) + "f;",
        "    [SerializeField] private float duration = " + Number(v.duration) + "f;",
        "    [SerializeField] private LeanTweenType ease = LeanTweenType." + v.ease + ";",
        "",
        "    private Vector3 origin;",
        "    private bool expanded;",
        "",
        "    private void Start()",
        "    {",
        "        if (!target) target = gameObject;",
        "        origin = target.transform.localPosition;",
        "        GetComponent<Button>().onClick.AddListener(Toggle);",
        "    }",
        "",
        "    public void Toggle()",
        "    {",
        "        Vector3 offset = axis == \"X\" ? Vector3.right : axis == \"Z\" ? Vector3.forward : Vector3.up;",
        "        Vector3 destination = expanded ? origin : origin + offset * distance;",
        "        LeanTween.moveLocal(target, destination, duration).setEase(ease);",
        "        expanded = !expanded;",
        "    }",
        "}"
      ].join("\n");
    }

    if (template.id === "scale-bounce") {
      return [
        "using UnityEngine;",
        "",
        "public class ScaleBounceIntro : MonoBehaviour",
        "{",
        "    [SerializeField] private float delay = " + Number(v.delay) + "f;",
        "    [SerializeField] private float duration = " + Number(v.duration) + "f;",
        "    [SerializeField] private Vector3 targetScale = " + v3(v.targetScale) + ";",
        "    [SerializeField] private LeanTweenType ease = LeanTweenType." + v.ease + ";",
        "",
        "    private void Start()",
        "    {",
        "        transform.localScale = Vector3.zero;",
        "        LeanTween.scale(gameObject, targetScale, duration).setDelay(delay).setEase(ease);",
        "    }",
        "}"
      ].join("\n");
    }

    if (template.id === "button-bounce") {
      return [
        "using UnityEngine;",
        "using UnityEngine.UI;",
        "",
        "[RequireComponent(typeof(Button))]",
        "public class ButtonBounce : MonoBehaviour",
        "{",
        "    [SerializeField] private GameObject target;",
        "    [SerializeField] private float scaleMultiplier = " + Number(v.scaleMultiplier) + "f;",
        "    [SerializeField] private float duration = " + Number(v.duration) + "f;",
        "    [SerializeField] private LeanTweenType ease = LeanTweenType." + v.ease + ";",
        "",
        "    private Vector3 originalScale;",
        "",
        "    private void Start()",
        "    {",
        "        if (!target) target = gameObject;",
        "        originalScale = target.transform.localScale;",
        "        GetComponent<Button>().onClick.AddListener(Play);",
        "    }",
        "",
        "    public void Play()",
        "    {",
        "        LeanTween.cancel(target);",
        "        target.transform.localScale = originalScale;",
        "        LeanTween.scale(target, originalScale * scaleMultiplier, duration).setEase(ease).setOnComplete(() =>",
        "            LeanTween.scale(target, originalScale, duration).setEase(ease));",
        "    }",
        "}"
      ].join("\n");
    }

    if (template.id === "ui-rotation-toggle") {
      return [
        "using UnityEngine;",
        "using UnityEngine.UI;",
        "",
        "[RequireComponent(typeof(Button))]",
        "public class UIRotationToggle : MonoBehaviour",
        "{",
        "    [SerializeField] private GameObject target;",
        "    [SerializeField] private string axis = " + q(v.axis) + ";",
        "    [SerializeField] private float angle = " + Number(v.angle) + "f;",
        "    [SerializeField] private float duration = " + Number(v.duration) + "f;",
        "    [SerializeField] private LeanTweenType ease = LeanTweenType." + v.ease + ";",
        "",
        "    private Vector3 originalEuler;",
        "    private bool rotated;",
        "",
        "    private void Start()",
        "    {",
        "        if (!target) target = gameObject;",
        "        originalEuler = target.transform.localEulerAngles;",
        "        GetComponent<Button>().onClick.AddListener(Toggle);",
        "    }",
        "",
        "    public void Toggle()",
        "    {",
        "        Vector3 delta = axis == \"X\" ? new Vector3(angle,0,0) : axis == \"Y\" ? new Vector3(0,angle,0) : new Vector3(0,0,angle);",
        "        LeanTween.rotateLocal(target, rotated ? originalEuler : originalEuler + delta, duration).setEase(ease);",
        "        rotated = !rotated;",
        "    }",
        "}"
      ].join("\n");
    }

    if (template.id === "multi-rotator") {
      return [
        "using UnityEngine;",
        "using DG.Tweening;",
        "",
        "public class MultiObjectRotator : MonoBehaviour",
        "{",
        "    [SerializeField] private GameObject targetA;",
        "    [SerializeField] private GameObject targetB;",
        "    [SerializeField] private GameObject targetC;",
        "    [SerializeField] private Vector3 axis = " + v3(v.axis) + ";",
        "    [SerializeField] private float duration = " + Number(v.duration) + "f;",
        "",
        "    private void Start()",
        "    {",
        "        Animate(targetA); Animate(targetB); Animate(targetC);",
        "    }",
        "",
        "    private void Animate(GameObject target)",
        "    {",
        "        if (!target) return;",
        "        target.transform.DOLocalRotate(axis.normalized * 360f, duration, RotateMode.LocalAxisAdd).SetEase(Ease.Linear).SetLoops(-1, LoopType.Restart);",
        "    }",
        "",
        "    private void OnDestroy()",
        "    {",
        "        if (targetA) DOTween.Kill(targetA.transform);",
        "        if (targetB) DOTween.Kill(targetB.transform);",
        "        if (targetC) DOTween.Kill(targetC.transform);",
        "    }",
        "}"
      ].join("\n");
    }

    if (template.id === "trivia-quiz") {
      return [
        "using System;",
        "using System.Collections.Generic;",
        "using UnityEngine;",
        "using UnityEngine.SceneManagement;",
        "using UnityEngine.UI;",
        "using TMPro;",
        "",
        "[Serializable] public class TriviaAnswer { public string text; public bool correct; }",
        "[Serializable] public class TriviaQuestion { public string question; public List<TriviaAnswer> answers = new List<TriviaAnswer>(); }",
        "",
        "public class TriviaQuizManager : MonoBehaviour",
        "{",
        "    [SerializeField] private List<TriviaQuestion> questions = new List<TriviaQuestion>();",
        "    [SerializeField] private TMP_Text questionText;",
        "    [SerializeField] private TMP_Text[] answerTexts = new TMP_Text[4];",
        "    [SerializeField] private Button[] answerButtons = new Button[4];",
        "    [SerializeField] private Button nextButton;",
        "    [SerializeField] private int questionsToFinish = " + parseInt(v.questionsToFinish, 10) + ";",
        "    [SerializeField] private int winScene = " + parseInt(v.winScene, 10) + ";",
        "    [SerializeField] private int loseScene = " + parseInt(v.loseScene, 10) + ";",
        "",
        "    private TriviaQuestion current;",
        "    private int answered;",
        "    private int correct;",
        "    private bool locked;",
        "",
        "    private void Start() { nextButton.onClick.AddListener(Next); LoadQuestion(); }",
        "",
        "    private void LoadQuestion()",
        "    {",
        "        if (questions.Count == 0) return;",
        "        current = questions[UnityEngine.Random.Range(0, questions.Count)];",
        "        questionText.text = current.question;",
        "        for (int i = 0; i < answerButtons.Length; i++)",
        "        {",
        "            int index = i;",
        "            bool valid = i < current.answers.Count;",
        "            answerButtons[i].gameObject.SetActive(valid);",
        "            if (!valid) continue;",
        "            answerTexts[i].text = current.answers[i].text;",
        "            answerButtons[i].interactable = true;",
        "            answerButtons[i].onClick.RemoveAllListeners();",
        "            answerButtons[i].onClick.AddListener(() => Answer(index));",
        "        }",
        "        locked = false;",
        "    }",
        "",
        "    private void Answer(int index)",
        "    {",
        "        if (locked) return;",
        "        locked = true; answered++;",
        "        if (current.answers[index].correct) correct++;",
        "        foreach (Button button in answerButtons) button.interactable = false;",
        "    }",
        "",
        "    private void Next()",
        "    {",
        "        if (!locked) return;",
        "        if (answered >= questionsToFinish) SceneManager.LoadScene(correct == answered ? winScene : loseScene);",
        "        else LoadQuestion();",
        "    }",
        "}"
      ].join("\n");
    }

    if (template.id === "registration-form") {
      return [
        "using System.Collections;",
        "using UnityEngine;",
        "using UnityEngine.Networking;",
        "using UnityEngine.UI;",
        "using TMPro;",
        "",
        "public class RegistrationFormPost : MonoBehaviour",
        "{",
        "    [SerializeField] private TMP_InputField fullNameInput, emailInput, phoneInput, ageInput;",
        "    [SerializeField] private Toggle confirmA, confirmB;",
        "    [SerializeField] private Button submitButton;",
        "    [SerializeField] private bool requireConfirmations = " + (v.requireConfirmations ? "true" : "false") + ";",
        "    [SerializeField] private string apiUrl = " + q(v.apiUrl) + ";",
        "    [SerializeField] private string headerName = " + q(v.headerName) + ";",
        "    [SerializeField] private string headerValue = " + q(v.headerValue) + "; // public/non-secret only",
        "",
        "    [System.Serializable] private class Payload { public string fullName; public string email; public string phone; public int age; }",
        "",
        "    private void Start()",
        "    {",
        "        submitButton.onClick.AddListener(Submit);",
        "        fullNameInput.onValueChanged.AddListener(_ => Validate());",
        "        emailInput.onValueChanged.AddListener(_ => Validate());",
        "        phoneInput.onValueChanged.AddListener(_ => Validate());",
        "        ageInput.onValueChanged.AddListener(_ => Validate());",
        "        if (confirmA) confirmA.onValueChanged.AddListener(_ => Validate());",
        "        if (confirmB) confirmB.onValueChanged.AddListener(_ => Validate());",
        "        Validate();",
        "    }",
        "",
        "    private void Validate()",
        "    {",
        "        int age; bool validAge = int.TryParse(ageInput.text, out age) && age > 1 && age <= 100;",
        "        bool validPhone = phoneInput.text.Length == 10;",
        "        bool confirmed = !requireConfirmations || ((!confirmA || confirmA.isOn) && (!confirmB || confirmB.isOn));",
        "        submitButton.interactable = !string.IsNullOrWhiteSpace(fullNameInput.text) && emailInput.text.Contains(\"@\") && validPhone && validAge && confirmed;",
        "    }",
        "",
        "    public void Submit()",
        "    {",
        "        if (!submitButton.interactable) return;",
        "        int age = int.Parse(ageInput.text);",
        "        string json = JsonUtility.ToJson(new Payload { fullName = fullNameInput.text, email = emailInput.text, phone = phoneInput.text, age = age });",
        "        StartCoroutine(Post(json));",
        "    }",
        "",
        "    private IEnumerator Post(string json)",
        "    {",
        "        using (UnityWebRequest request = new UnityWebRequest(apiUrl, \"POST\"))",
        "        {",
        "            request.uploadHandler = new UploadHandlerRaw(System.Text.Encoding.UTF8.GetBytes(json));",
        "            request.downloadHandler = new DownloadHandlerBuffer();",
        "            request.SetRequestHeader(\"Content-Type\", \"application/json\");",
        "            if (!string.IsNullOrWhiteSpace(headerName) && !string.IsNullOrWhiteSpace(headerValue)) request.SetRequestHeader(headerName, headerValue);",
        "            yield return request.SendWebRequest();",
        "            if (request.result != UnityWebRequest.Result.Success) Debug.LogError(request.error);",
        "        }",
        "    }",
        "}"
      ].join("\n");
    }

    if (template.id === "periodic-data-sender") {
      return [
        "using System.Collections;",
        "using UnityEngine;",
        "using UnityEngine.Networking;",
        "using UnityEngine.UI;",
        "using TMPro;",
        "",
        "public class PeriodicDataSender : MonoBehaviour",
        "{",
        "    [SerializeField] private Toggle onlineToggle;",
        "    [SerializeField] private TMP_InputField intervalInput;",
        "    [SerializeField] private TMP_Text textA, textB, textC;",
        "    [SerializeField] private string keyA = " + q(v.keyA) + ", keyB = " + q(v.keyB) + ", keyC = " + q(v.keyC) + ";",
        "    [SerializeField] private float sendIntervalMinutes = " + Number(v.sendIntervalMinutes) + "f;",
        "    [SerializeField] private string apiUrl = " + q(v.apiUrl) + ";",
        "    [SerializeField] private string headerName = " + q(v.headerName) + ";",
        "    [SerializeField] private string headerValue = " + q(v.headerValue) + "; // public/non-secret only",
        "",
        "    private Coroutine loop;",
        "",
        "    private void Start()",
        "    {",
        "        onlineToggle.onValueChanged.AddListener(SetOnline);",
        "        if (intervalInput) intervalInput.onValueChanged.AddListener(SetInterval);",
        "        if (onlineToggle.isOn) SetOnline(true);",
        "    }",
        "",
        "    private void SetOnline(bool online)",
        "    {",
        "        if (loop != null) StopCoroutine(loop);",
        "        loop = online ? StartCoroutine(SendLoop()) : null;",
        "    }",
        "",
        "    private void SetInterval(string value)",
        "    {",
        "        float minutes; if (float.TryParse(value, out minutes)) sendIntervalMinutes = Mathf.Max(0.1f, minutes);",
        "        if (onlineToggle.isOn) SetOnline(true);",
        "    }",
        "",
        "    private IEnumerator SendLoop()",
        "    {",
        "        while (true)",
        "        {",
        "            yield return Send();",
        "            yield return new WaitForSeconds(sendIntervalMinutes * 60f);",
        "        }",
        "    }",
        "",
        "    private IEnumerator Send()",
        "    {",
        "        string json = \"{\" + JsonPair(keyA, textA) + \",\" + JsonPair(keyB, textB) + \",\" + JsonPair(keyC, textC) + \"}\";",
        "        using (UnityWebRequest request = new UnityWebRequest(apiUrl, \"POST\"))",
        "        {",
        "            request.uploadHandler = new UploadHandlerRaw(System.Text.Encoding.UTF8.GetBytes(json));",
        "            request.downloadHandler = new DownloadHandlerBuffer();",
        "            request.SetRequestHeader(\"Content-Type\", \"application/json\");",
        "            if (!string.IsNullOrWhiteSpace(headerName) && !string.IsNullOrWhiteSpace(headerValue)) request.SetRequestHeader(headerName, headerValue);",
        "            yield return request.SendWebRequest();",
        "            if (request.result != UnityWebRequest.Result.Success) Debug.LogError(request.error);",
        "        }",
        "    }",
        "",
        "    private string JsonPair(string key, TMP_Text text)",
        "    {",
        "        string value = text ? text.text : string.Empty;",
        "        return \"\\\\\\\"\" + key.Replace(\"\\\\\\\"\", \"\") + \"\\\\\\\":\\\\\\\"\" + value.Replace(\"\\\\\", \"\\\\\\\\\").Replace(\"\\\\\\\"\", \"\\\\\\\\\\\\\\\"\") + \"\\\\\\\"\";",
        "    }",
        "}"
      ].join("\n");
    }

    return originalBuiltInCode(template);
  };

  const oldToast = toast;
  toast = function (message) {
    if (lang === "es") {
      const map = {
        "C# copied": "C# copiado",
        "Clipboard unavailable": "Portapapeles no disponible",
        "Current component reset": "Componente reiniciado",
        "Name and class are required": "Nombre y clase son obligatorios",
        "Template saved to your library": "Plantilla guardada en tu librería"
      };
      if (map[message]) message = map[message];
      if (/\.cs exported$/.test(message)) message = message.replace(" exported", " exportado");
    }
    oldToast(message);
  };

  document.getElementById("languageBtn").addEventListener("click", function () {
    lang = lang === "es" ? "en" : "es";
    localStorage.setItem("monobuilder-lang", lang);
    renderAll();
    renderCategories();
  });

  applyTemplateLanguage();
  renderCategories();
  values = defaultValues(currentTemplate());
  renderAll();
})();