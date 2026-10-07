(function () {
  "use strict";

  const CORE_TEMPLATE_ID = "gc2-character-core";
  const MODULES = ["Cameras", "Characters", "Common", "Variables", "VisualScripting"];
  const DEP_BITS = [
    [1, "input-system"], [2, "ugui"], [4, "tmp"], [8, "ai-navigation"],
    [16, "mathematics"], [32, "collections"], [64, "playables"]
  ];

  const DEPENDENCIES = {
    "input-system": { id: "input-system", name: "Unity Input System", type: "upm", package: "com.unity.inputsystem" },
    "ugui": { id: "ugui", name: "Unity UI", type: "upm", package: "com.unity.ugui" },
    "tmp": { id: "tmp", name: "TextMeshPro", type: "upm", package: "com.unity.textmeshpro" },
    "ai-navigation": { id: "ai-navigation", name: "AI Navigation", type: "upm", package: "com.unity.ai.navigation" },
    "mathematics": { id: "mathematics", name: "Unity Mathematics", type: "upm", package: "com.unity.mathematics" },
    "collections": { id: "collections", name: "Unity Collections", type: "upm", package: "com.unity.collections" },
    "playables": { id: "playables", name: "Unity Playables", type: "builtin" },
    "lean-tween": { id: "lean-tween", name: "LeanTween", type: "manual" },
    "dotween": { id: "dotween", name: "DOTween", type: "manual" },
    "game-creator-core": { id: "game-creator-core", name: "Game Creator 2 Core", type: "licensed" }
  };

  // Exact entries exposed by the supplied Game Creator 2 Core through Unity's
  // GameObject/Create Asset menus. Keeping this list explicit lets MonoBuilder
  // mirror the actual Core hierarchy instead of inventing approximations.
  const CORE_MENU_ITEMS = [
    "GameObject/Game Creator/Cameras/Camera Shot",
    "GameObject/Game Creator/Cameras/Main Camera",
    "GameObject/Game Creator/Characters/Character",
    "GameObject/Game Creator/Characters/Player",
    "GameObject/Game Creator/Characters/Marker",
    "GameObject/Game Creator/UI/Button",
    "GameObject/Game Creator/UI/Button - TextMeshPro",
    "GameObject/Game Creator/UI/Dropdown",
    "GameObject/Game Creator/UI/Dropdown - TextMeshPro",
    "GameObject/Game Creator/UI/Input Field",
    "GameObject/Game Creator/UI/Input Field - TextMeshPro",
    "GameObject/Game Creator/UI/Slider",
    "GameObject/Game Creator/UI/Text",
    "GameObject/Game Creator/UI/Toggle",
    "GameObject/Game Creator/Variables/List Variables",
    "GameObject/Game Creator/Variables/Name Variables",
    "GameObject/Game Creator/Visual Scripting/Actions",
    "GameObject/Game Creator/Visual Scripting/Conditions",
    "GameObject/Game Creator/Visual Scripting/Hotspot",
    "GameObject/Game Creator/Visual Scripting/Trigger",
    "Assets/Create/Game Creator/Characters/Animation State",
    "Assets/Create/Game Creator/Characters/Basic Locomotion State",
    "Assets/Create/Game Creator/Characters/Complete Locomotion State",
    "Assets/Create/Game Creator/Characters/Handle",
    "Assets/Create/Game Creator/Characters/Skeleton",
    "Assets/Create/Game Creator/Common/Material Sounds",
    "Assets/Create/Game Creator/Developer/Touchstick Skin",
    "Assets/Create/Game Creator/Variables/List Variables",
    "Assets/Create/Game Creator/Variables/Name Variables"
  ];

  const CORE_BROWSER_MODES = [
    "Hierarchy", "Actions", "Conditions", "Events", "Properties",
    "Characters", "Cameras", "Variables", "UI", "All"
  ];

  const coreTemplateEnglish = {
    id: CORE_TEMPLATE_ID,
    name: "Game Creator Character Core",
    className: "MonoBuilderCharacterPreset",
    category: "Core",
    icon: "GC",
    description: "Builds a configurable Character setup around the imported Game Creator 2 Core architecture without copying the original Core source.",
    features: [
      "Player, Motion, Driver, Rotation and Animation units",
      "IK rigs, Footsteps and Ragdoll configuration",
      "Motion, gravity, jump and dash tuning",
      "Dependency-aware Unity bundle export"
    ],
    setup: [
      "Install your licensed Game Creator 2 Core package in the Unity project.",
      "Export this MonoBuilder bundle and copy its Assets folder into the project.",
      "Run Tools → MonoBuilder → Create Configured Character.",
      "Assign your 3D model and any project-specific assets in the Game Creator Character Inspector."
    ],
    fields: [
      { key: "isPlayer", label: "Is Player", type: "bool", default: true },
      { key: "timeMode", label: "Update Time", type: "string", default: "GameTime", options: ["GameTime", "UnscaledTime"] },
      { key: "playerUnit", label: "Player", type: "string", default: "UnitPlayerDirectional", options: ["UnitPlayerDirectional", "UnitPlayerFollowPointer", "UnitPlayerPointClick", "UnitPlayerTank"] },
      { key: "motionUnit", label: "Motion", type: "string", default: "UnitMotionController", options: ["UnitMotionController"] },
      { key: "driverUnit", label: "Driver", type: "string", default: "UnitDriverController", options: ["UnitDriverController", "UnitDriverNavmesh", "UnitDriverRigidbody"] },
      { key: "facingUnit", label: "Rotation", type: "string", default: "UnitFacingPivot", options: ["UnitFacingPivot", "UnitFacingPivotDelayed", "UnitFacingDirection", "UnitFacingInputDirection", "UnitFacingObjectDirection", "UnitFacingPointer", "UnitFacingTarget", "UnitFacingTank"] },
      { key: "animimUnit", label: "Animation", type: "string", default: "UnitAnimimKinematic", options: ["UnitAnimimKinematic"] },
      { key: "moveSpeed", label: "Move Speed", type: "range", min: 0, max: 20, step: 0.1, default: 4 },
      { key: "angularSpeed", label: "Angular Speed", type: "range", min: -1, max: 3600, step: 10, default: 1800 },
      { key: "mass", label: "Mass", type: "float", default: 80 },
      { key: "height", label: "Height", type: "range", min: 0.2, max: 4, step: 0.05, default: 2 },
      { key: "radius", label: "Radius", type: "range", min: 0.05, max: 1, step: 0.01, default: 0.2 },
      { key: "gravityUp", label: "Gravity Upwards", type: "float", default: -9.81 },
      { key: "gravityDown", label: "Gravity Downwards", type: "float", default: -9.81 },
      { key: "terminalVelocity", label: "Terminal Velocity", type: "float", default: -53 },
      { key: "canJump", label: "Can Jump", type: "bool", default: true },
      { key: "airJumps", label: "Air Jumps", type: "int", default: 0 },
      { key: "jumpCooldown", label: "Jump Cooldown", type: "range", min: 0, max: 5, step: 0.05, default: 0 },
      { key: "dashInSuccession", label: "Dash In Succession", type: "int", default: 1 },
      { key: "dashInAir", label: "Dash In Air", type: "bool", default: false },
      { key: "dashCooldown", label: "Dash Cooldown", type: "range", min: 0, max: 10, step: 0.05, default: 0.5 },
      { key: "footstepsActive", label: "Footsteps Active", type: "bool", default: true },
      { key: "ragdollSystem", label: "Ragdoll", type: "string", default: "RagdollNone", options: ["RagdollNone", "RagdollDefault"] },
      { key: "rigFeetPlant", label: "IK · Feet Plant", type: "bool", default: false },
      { key: "rigLookTo", label: "IK · Look At Targets", type: "bool", default: false },
      { key: "rigBreathing", label: "IK · Breathing", type: "bool", default: false },
      { key: "rigLean", label: "IK · Lean With Momentum", type: "bool", default: false },
      { key: "rigAlignGround", label: "IK · Align Body With Ground", type: "bool", default: false },
      { key: "rigTwitching", label: "IK · Twitching", type: "bool", default: false },
      { key: "rigAimTowards", label: "IK · Aim Pitch (Obsolete)", type: "bool", default: false }
    ],
    core: true
  };

  const coreSpanish = {
    name: "Core de Personaje Game Creator",
    description: "Construye un Character configurable sobre la arquitectura importada de Game Creator 2 Core sin copiar su código fuente original.",
    features: [
      "Unidades Player, Motion, Driver, Rotación y Animación",
      "Configuración de IK, pasos y Ragdoll",
      "Ajustes de movimiento, gravedad, salto y dash",
      "Exportación para Unity con resolución de dependencias"
    ],
    setup: [
      "Instala tu copia con licencia de Game Creator 2 Core en el proyecto Unity.",
      "Exporta el paquete de MonoBuilder y copia su carpeta Assets al proyecto.",
      "Ejecuta Tools → MonoBuilder → Create Configured Character.",
      "Asigna tu modelo 3D y los assets específicos del proyecto desde el Inspector de Character."
    ],
    fields: {
      isPlayer: "Es Jugador", timeMode: "Tiempo de Actualización", playerUnit: "Player", motionUnit: "Motion",
      driverUnit: "Driver", facingUnit: "Rotación", animimUnit: "Animación", moveSpeed: "Velocidad",
      angularSpeed: "Velocidad Angular", mass: "Masa", height: "Altura", radius: "Radio",
      gravityUp: "Gravedad al Subir", gravityDown: "Gravedad al Bajar", terminalVelocity: "Velocidad Terminal",
      canJump: "Puede Saltar", airJumps: "Saltos en Aire", jumpCooldown: "Cooldown de Salto",
      dashInSuccession: "Dash Seguidos", dashInAir: "Dash en Aire", dashCooldown: "Cooldown de Dash",
      footstepsActive: "Pasos Activos", ragdollSystem: "Ragdoll", rigFeetPlant: "IK · Pies en Suelo",
      rigLookTo: "IK · Mirar Objetivos", rigBreathing: "IK · Respiración", rigLean: "IK · Inclinación por Impulso",
      rigAlignGround: "IK · Alinear Cuerpo al Suelo", rigTwitching: "IK · Twitching", rigAimTowards: "IK · Aim Pitch (Obsoleto)"
    }
  };

  if (!builtins.some(function(t){ return t.id === CORE_TEMPLATE_ID; })) builtins.unshift(coreTemplateEnglish);
  templates = builtins.concat(customTemplates);

  let coreCatalog = [];
  let coreCatalogReady = false;
  let coreFieldMap = new Map();
  let coreFieldsReady = false;
  let corePinned = new Set(JSON.parse(localStorage.getItem("monobuilder-core-pinned") || "[]"));
  let coreMode = localStorage.getItem("monobuilder-core-mode") || "Hierarchy";
  if (CORE_BROWSER_MODES.indexOf(coreMode) === -1) coreMode = "Hierarchy";

  const coreEls = {
    dialog: document.getElementById("coreDialog"),
    open: document.getElementById("coreBtn"),
    close: document.getElementById("closeCoreBtn"),
    search: document.getElementById("coreSearch"),
    filter: document.getElementById("coreModuleFilter"),
    list: document.getElementById("coreList"),
    detail: document.getElementById("coreDetail"),
    summary: document.getElementById("coreSummary"),
    depStrip: document.getElementById("dependencyStrip"),
    depBadges: document.getElementById("dependencyBadges"),
    bundle: document.getElementById("downloadBundleBtn")
  };

  function currentLang() {
    const stored = localStorage.getItem("monobuilder-lang");
    if (stored === "es" || stored === "en") return stored;
    return document.documentElement.lang === "es" ? "es" : "en";
  }

  function localizeCoreTemplate() {
    const t = builtins.find(function(x){ return x.id === CORE_TEMPLATE_ID; });
    if (!t) return;
    const es = currentLang() === "es";
    t.name = es ? coreSpanish.name : coreTemplateEnglish.name;
    t.description = es ? coreSpanish.description : coreTemplateEnglish.description;
    t.features = (es ? coreSpanish.features : coreTemplateEnglish.features).slice();
    t.setup = (es ? coreSpanish.setup : coreTemplateEnglish.setup).slice();
    t.fields.forEach(function(field){
      const original = coreTemplateEnglish.fields.find(function(x){ return x.key === field.key; });
      field.label = es && coreSpanish.fields[field.key] ? coreSpanish.fields[field.key] : original.label;
    });
  }

  function depsFromMask(mask) {
    const ids = [];
    DEP_BITS.forEach(function(pair){ if (mask & pair[0]) ids.push(pair[1]); });
    return ids;
  }

  function resolveDependencies(template, code) {
    const ids = new Set();
    const text = code || "";
    if (/UnityEngine\.InputSystem|InputActionReference/.test(text) || template.fields.some(function(f){ return f.type === "InputActionReference"; })) ids.add("input-system");
    if (/TMPro|TMP_/.test(text) || template.fields.some(function(f){ return /^TMP_/.test(f.type); })) ids.add("tmp");
    if (/UnityEngine\.UI/.test(text) || template.fields.some(function(f){ return ["Button","Slider","Toggle","Image"].includes(f.type); })) ids.add("ugui");
    if (/UnityEngine\.AI|NavMesh/.test(text) || values.driverUnit === "UnitDriverNavmesh") ids.add("ai-navigation");
    if (/Unity\.Mathematics/.test(text)) ids.add("mathematics");
    if (/Unity\.Collections/.test(text)) ids.add("collections");
    if (/UnityEngine\.Playables/.test(text)) ids.add("playables");
    if (/LeanTween|LeanTweenType/.test(text)) ids.add("lean-tween");
    if (/DG\.Tweening|DOTween/.test(text)) ids.add("dotween");
    if (/GameCreator\.Runtime/.test(text) || template.id === CORE_TEMPLATE_ID) {
      ids.add("game-creator-core");
      ids.add("input-system");
      ids.add("ugui");
      ids.add("tmp");
    }
    corePinned.forEach(function(name){
      const item = coreCatalog.find(function(x){ return x.name === name; });
      if (item) depsFromMask(item.depMask).forEach(function(id){ ids.add(id); });
      ids.add("game-creator-core");
    });
    return Array.from(ids).map(function(id){ return DEPENDENCIES[id]; }).filter(Boolean);
  }

  function renderDependencyStrip() {
    if (!coreEls.depBadges) return;
    const deps = resolveDependencies(currentTemplate(), generateCode());
    coreEls.depBadges.innerHTML = "";
    if (!deps.length) {
      const badge = document.createElement("span");
      badge.className = "dependency-badge none";
      badge.textContent = currentLang() === "es" ? "Sin paquetes extra" : "No extra packages";
      coreEls.depBadges.appendChild(badge);
      return;
    }
    deps.forEach(function(dep){
      const badge = document.createElement("span");
      badge.className = "dependency-badge " + dep.type;
      badge.textContent = dep.name;
      badge.title = dep.type === "upm" ? dep.package : dep.type;
      coreEls.depBadges.appendChild(badge);
    });
  }

  function characterCode() {
    const v = values;
    const rigs = [
      ["rigFeetPlant","RigFeetPlant"],["rigLookTo","RigLookTo"],["rigBreathing","RigBreathing"],
      ["rigLean","RigLean"],["rigAlignGround","RigAlignGround"],["rigTwitching","RigTwitching"],
      ["rigAimTowards","RigAimTowards"]
    ].filter(function(x){ return v[x[0]]; }).map(function(x){ return "        character.IK.RequireRig<" + x[1] + ">();"; }).join("\n");

    return [
      "using UnityEngine;",
      "using GameCreator.Runtime.Characters;",
      "using GameCreator.Runtime.Characters.IK;",
      "using GameCreator.Runtime.Common;",
      "",
      "[DisallowMultipleComponent]",
      "[RequireComponent(typeof(Character))]",
      "public class MonoBuilderCharacterPreset : MonoBehaviour",
      "{",
      "    [SerializeField] private bool applyOnAwake = true;",
      "",
      "    private void Awake()",
      "    {",
      "        if (applyOnAwake) Apply();",
      "    }",
      "",
      "    [ContextMenu(\"Apply MonoBuilder Character Preset\")]",
      "    public void Apply()",
      "    {",
      "        Character character = GetComponent<Character>();",
      "        if (!character) return;",
      "",
      "        character.IsPlayer = " + (v.isPlayer ? "true" : "false") + ";",
      "        character.Time = new TimeMode(TimeMode.UpdateMode." + v.timeMode + ");",
      "        character.Kernel.ChangePlayer(character, new " + v.playerUnit + "());",
      "        character.Kernel.ChangeMotion(character, new " + v.motionUnit + "());",
      "        character.Kernel.ChangeDriver(character, new " + v.driverUnit + "());",
      "        character.Kernel.ChangeFacing(character, new " + v.facingUnit + "());",
      "        character.Kernel.ChangeAnimim(character, new " + v.animimUnit + "());",
      "",
      "        character.Motion.LinearSpeed = " + Number(v.moveSpeed) + "f;",
      "        character.Motion.AngularSpeed = " + Number(v.angularSpeed) + "f;",
      "        character.Motion.Mass = " + Number(v.mass) + "f;",
      "        character.Motion.Height = " + Number(v.height) + "f;",
      "        character.Motion.Radius = " + Number(v.radius) + "f;",
      "        character.Motion.GravityUpwards = " + Number(v.gravityUp) + "f;",
      "        character.Motion.GravityDownwards = " + Number(v.gravityDown) + "f;",
      "        character.Motion.TerminalVelocity = " + Number(v.terminalVelocity) + "f;",
      "        character.Motion.CanJump = " + (v.canJump ? "true" : "false") + ";",
      "        character.Motion.AirJumps = " + (parseInt(v.airJumps,10)||0) + ";",
      "        character.Motion.JumpCooldown = " + Number(v.jumpCooldown) + "f;",
      "        character.Motion.DashInSuccession = " + (parseInt(v.dashInSuccession,10)||0) + ";",
      "        character.Motion.DashInAir = " + (v.dashInAir ? "true" : "false") + ";",
      "        character.Motion.DashCooldown = " + Number(v.dashCooldown) + "f;",
      "        character.Footsteps.IsActive = " + (v.footstepsActive ? "true" : "false") + ";",
      (rigs
        ? "        if (character.Animim != null && character.Animim.Animator != null)\n        {\n" +
          rigs.split("\n").map(function(line){ return "    " + line; }).join("\n") +
          "\n        }\n        else\n        {\n            Debug.LogWarning(\"MonoBuilder: assign a Character model/Animator before applying IK rigs.\", character);\n        }"
        : "        // No optional IK rigs selected."),
      "    }",
      "}"
    ].join("\n");
  }

  function characterEditorCode() {
    const v = values;
    const rigs = [
      ["rigFeetPlant","RigFeetPlant"],["rigLookTo","RigLookTo"],["rigBreathing","RigBreathing"],
      ["rigLean","RigLean"],["rigAlignGround","RigAlignGround"],["rigTwitching","RigTwitching"],
      ["rigAimTowards","RigAimTowards"]
    ].filter(function(x){ return v[x[0]]; }).map(function(x){ return x[1]; });

    const lines = [
      "#if UNITY_EDITOR",
      "using UnityEditor;",
      "using UnityEngine;",
      "using GameCreator.Runtime.Characters;",
      "using GameCreator.Runtime.Characters.IK;",
      "",
      "public static class MonoBuilderCreateCharacter",
      "{",
      "    [MenuItem(\"Tools/MonoBuilder/Create Configured Character\")]",
      "    public static void Create()",
      "    {",
      "        GameObject instance = new GameObject(\"" + (v.isPlayer ? "Player" : "Character") + "\");",
      "        Character character = instance.AddComponent<Character>();",
      "        SerializedObject so = new SerializedObject(character);",
      "",
      "        so.FindProperty(\"m_IsPlayer\").boolValue = " + (v.isPlayer ? "true" : "false") + ";",
      "        SerializedProperty time = so.FindProperty(\"m_Time\").FindPropertyRelative(\"m_UpdateTime\");",
      "        time.enumValueIndex = " + (v.timeMode === "UnscaledTime" ? "1" : "0") + ";",
      "",
      "        SerializedProperty kernel = so.FindProperty(\"m_Kernel\");",
      "        kernel.FindPropertyRelative(\"m_Player\").managedReferenceValue = new " + v.playerUnit + "();",
      "        kernel.FindPropertyRelative(\"m_Motion\").managedReferenceValue = new " + v.motionUnit + "();",
      "        kernel.FindPropertyRelative(\"m_Driver\").managedReferenceValue = new " + v.driverUnit + "();",
      "        kernel.FindPropertyRelative(\"m_Facing\").managedReferenceValue = new " + v.facingUnit + "();",
      "        kernel.FindPropertyRelative(\"m_Animim\").managedReferenceValue = new " + v.animimUnit + "();",
      "",
      "        SerializedProperty ragdoll = so.FindProperty(\"m_Ragdoll\").FindPropertyRelative(\"m_Ragdoll\");",
      "        ragdoll.managedReferenceValue = new " + v.ragdollSystem + "();",
      "",
      "        SerializedProperty rigs = so.FindProperty(\"m_InverseKinematics\").FindPropertyRelative(\"m_RigLayers\").FindPropertyRelative(\"m_Rigs\");",
      "        rigs.arraySize = " + rigs.length + ";"
    ];
    rigs.forEach(function(name,index){
      lines.push("        rigs.GetArrayElementAtIndex(" + index + ").managedReferenceValue = new " + name + "();");
    });
    lines.push(
      "",
      "        so.ApplyModifiedProperties();",
      "        instance.AddComponent<MonoBuilderCharacterPreset>();",
      "        Undo.RegisterCreatedObjectUndo(instance, \"Create MonoBuilder Character\");",
      "        Selection.activeGameObject = instance;",
      "    }",
      "}",
      "#endif"
    );
    return lines.join("\n");
  }

  const previousBuiltInCode = builtInCode;
  builtInCode = function (template) {
    if (template.id === CORE_TEMPLATE_ID) return characterCode();
    return previousBuiltInCode(template);
  };

  const previousRenderPreview = renderPreview;
  renderPreview = function () {
    const template = currentTemplate();
    if (template.id !== CORE_TEMPLATE_ID) {
      previousRenderPreview();
      return;
    }
    const v = values;
    const es = currentLang() === "es";
    const rows = [
      [es ? "Es Jugador" : "Is Player", v.isPlayer ? "✓" : "—"],
      [es ? "Tiempo" : "Update Time", v.timeMode],
      ["Player", String(v.playerUnit).replace("UnitPlayer","")],
      ["Motion", String(v.motionUnit).replace("UnitMotion","")],
      ["Driver", String(v.driverUnit).replace("UnitDriver","")],
      [es ? "Rotación" : "Rotation", String(v.facingUnit).replace("UnitFacing","")],
      [es ? "Animación" : "Animation", String(v.animimUnit).replace("UnitAnimim","")],
      ["Inverse Kinematics", [v.rigFeetPlant,v.rigLookTo,v.rigBreathing,v.rigLean,v.rigAlignGround,v.rigTwitching,v.rigAimTowards].filter(Boolean).length + (es ? " rigs activos" : " rigs enabled")],
      [es ? "Pasos" : "Footsteps", v.footstepsActive ? (es ? "Activo" : "Active") : (es ? "Inactivo" : "Inactive")],
      ["Ragdoll", String(v.ragdollSystem).replace("Ragdoll","")]
    ];
    els.inspectorPreview.innerHTML =
      '<div class="unity-component-header"><span class="unity-script-icon">GC</span><span>Character</span></div>' +
      '<div class="unity-body core-character-preview">' +
      rows.map(function(r){ return '<div class="unity-row"><label>' + r[0] + '</label><div class="unity-field">' + r[1] + '</div></div>'; }).join("") +
      '</div>';
  };

  const previousRenderAll = renderAll;
  renderAll = function () {
    localizeCoreTemplate();
    previousRenderAll();
    renderDependencyStrip();
    localizeCoreControls();
  };

  const previousUpdateOutputs = updateOutputs;
  updateOutputs = function () {
    previousUpdateOutputs();
    renderDependencyStrip();
  };

  function modeLabel(mode, es) {
    const labels = {
      Hierarchy: es ? "Jerarquía" : "Hierarchy",
      Actions: es ? "Acciones" : "Actions",
      Conditions: es ? "Condiciones" : "Conditions",
      Events: es ? "Eventos" : "Events",
      Properties: es ? "Propiedades" : "Properties",
      Characters: es ? "Personajes" : "Characters",
      Cameras: es ? "Cámaras" : "Cameras",
      Variables: "Variables",
      UI: "UI",
      All: es ? "Todo" : "All"
    };
    return labels[mode] || mode;
  }

  function ensureCoreTabs() {
    if (!coreEls.dialog || document.getElementById("coreTabs")) return;
    const tabs = document.createElement("div");
    tabs.id = "coreTabs";
    tabs.className = "core-tabs";
    coreEls.summary.insertAdjacentElement("afterend", tabs);
    renderCoreTabs();
  }

  function renderCoreTabs() {
    const tabs = document.getElementById("coreTabs");
    if (!tabs) return;
    const es = currentLang() === "es";
    const counts = coreModeCounts();

    tabs.innerHTML = "";
    CORE_BROWSER_MODES.forEach(function(mode) {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "core-tab" + (coreMode === mode ? " active" : "");
      const count = counts[mode];
      button.innerHTML = "<span>" + modeLabel(mode, es) + "</span>" +
        (Number.isFinite(count) ? "<small>" + count + "</small>" : "");
      button.addEventListener("click", function() {
        coreMode = mode;
        localStorage.setItem("monobuilder-core-mode", mode);
        renderCoreTabs();
        renderCoreList();
      });
      tabs.appendChild(button);
    });
  }

  function coreMeta(item) {
    return coreFieldMap.get(item.module + "::" + item.name) || null;
  }

  function corePath(item) {
    const meta = coreMeta(item);
    return meta && meta.path ? meta.path.replace(/\\/g, "/") : "";
  }

  function isAction(item) {
    const path = corePath(item);
    return /^Instruction/.test(item.name) ||
      path.indexOf("VisualScripting/Instructions/") !== -1;
  }

  function isCondition(item) {
    const path = corePath(item);
    return /^Condition/.test(item.name) ||
      path.indexOf("VisualScripting/Conditions/") !== -1;
  }

  function isEvent(item) {
    const path = corePath(item);
    return /^Event/.test(item.name) ||
      path.indexOf("VisualScripting/Events/") !== -1;
  }

  function isProperty(item) {
    const path = corePath(item);
    return /^(Property(Get|Set)|PropertyType(Get|Set)|TProperty(Get|Set))/.test(item.name) ||
      path.indexOf("/Properties/") !== -1 ||
      path.indexOf("Polymorphism/") !== -1 && /Property/.test(item.name);
  }

  function itemMatchesMode(item, mode) {
    const path = corePath(item);
    switch (mode) {
      case "Actions": return isAction(item);
      case "Conditions": return isCondition(item);
      case "Events": return isEvent(item);
      case "Properties": return isProperty(item);
      case "Characters": return item.module === "Characters";
      case "Cameras": return item.module === "Cameras";
      case "Variables": return item.module === "Variables";
      case "UI": return path.indexOf("Common/UI/") !== -1 || /^(Button|Dropdown|InputField|Slider|Text|Toggle)/.test(item.name);
      case "All": return true;
      default: return false;
    }
  }

  function coreModeCounts() {
    const counts = { Hierarchy: CORE_MENU_ITEMS.length };
    CORE_BROWSER_MODES.forEach(function(mode) {
      if (mode === "Hierarchy") return;
      counts[mode] = coreCatalogReady
        ? coreCatalog.reduce(function(total, item) { return total + (itemMatchesMode(item, mode) ? 1 : 0); }, 0)
        : NaN;
    });
    return counts;
  }

  function prettifyCoreName(name) {
    return String(name || "")
      .replace(/^(Instruction|Condition|Event|PropertyTypeGet|PropertyTypeSet|PropertyGet|PropertySet)/, "")
      .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
      .replace(/([A-Z]+)([A-Z][a-z])/g, "$1 $2")
      .replace(/\s+/g, " ")
      .trim() || name;
  }

  function shortCoreGroup(item) {
    const path = corePath(item);
    const markers = [
      "Instructions/Collection/", "Conditions/Collection/", "Events/Collection/",
      "Runtime/Characters/", "Runtime/Cameras/", "Runtime/Variables/", "Runtime/Common/UI/"
    ];
    for (let i = 0; i < markers.length; i++) {
      const at = path.indexOf(markers[i]);
      if (at !== -1) {
        const tail = path.substring(at + markers[i].length).replace(/\/[^/]+\.cs$/, "");
        if (tail) return tail.replace(/\//g, " › ");
      }
    }
    return item.module;
  }

  function corePinKey(item) {
    return item.menuPath ? "@menu:" + item.menuPath : item.name;
  }

  function localizeCoreControls() {
    const es = currentLang() === "es";
    if (coreEls.bundle) coreEls.bundle.textContent = es ? "Exportar paquete" : "Export Bundle";
    const rawButton = document.getElementById("downloadCodeBtn");
    if (rawButton) rawButton.textContent = es ? "Solo .cs" : "Raw .cs";
    if (coreEls.open) coreEls.open.textContent = "Core";
    if (coreEls.depStrip) {
      const label = coreEls.depStrip.querySelector(".dependency-label");
      if (label) label.textContent = es ? "Dependencias" : "Dependencies";
    }
    if (coreEls.dialog) {
      const eyebrow = coreEls.dialog.querySelector(".modal-header .eyebrow");
      const title = coreEls.dialog.querySelector(".modal-header h2");
      if (eyebrow) eyebrow.textContent = es ? "Game Creator 2 · Core completo" : "Game Creator 2 · full Core";
      if (title) title.textContent = es ? "Catálogo completo del Core" : "Full Core Catalog";
      if (coreEls.search) coreEls.search.placeholder = es ? "Buscar menús, Actions, Conditions, Events, propiedades..." : "Search menus, Actions, Conditions, Events, properties...";
      const first = coreEls.filter && coreEls.filter.options[0];
      if (first) first.textContent = es ? "Todos los módulos" : "All modules";
    }
    renderCoreTabs();
  }

  async function ensureCoreCatalog() {
    if (coreCatalogReady) return;
    coreEls.summary.innerHTML = '<div class="core-loading">Loading Core catalog…</div>';
    try {
      coreCatalog = await window.loadMonoBuilderCoreCatalog();
      coreCatalogReady = true;
      renderCoreSummary();
      renderCoreTabs();
      renderCoreList();
    } catch (error) {
      coreEls.summary.innerHTML = '<div class="core-error">Catalog could not be decompressed in this browser.</div>';
      console.error(error);
    }
  }

  async function ensureCoreFields() {
    if (coreFieldsReady) return;
    try {
      coreFieldMap = await window.loadMonoBuilderCoreFields();
      coreFieldsReady = true;
      renderCoreSummary();
      renderCoreTabs();
    } catch (error) {
      console.error("MonoBuilder Core field metadata:", error);
    }
  }

  function renderCoreSummary() {
    const es = currentLang() === "es";
    let serializedFields = 0;
    if (coreFieldsReady) coreFieldMap.forEach(function(meta){ serializedFields += meta.fields.length; });
    coreEls.summary.innerHTML = [
      [2803, es ? "archivos analizados" : "files scanned"],
      [CORE_MENU_ITEMS.length, es ? "entradas reales de menú" : "real menu entries"],
      [coreCatalog.length || "…", es ? "tipos del Core indexados" : "indexed Core types"],
      [coreFieldsReady ? coreFieldMap.size : "…", es ? "tipos inspeccionables" : "inspectable types"],
      [coreFieldsReady ? serializedFields : "…", es ? "campos serializados" : "serialized fields"],
      [corePinned.size, es ? "elementos en tu paquete" : "items in your bundle"]
    ].map(function(x){ return '<div class="core-stat"><strong>' + x[0] + '</strong><span>' + x[1] + '</span></div>'; }).join("");
  }

  function renderMenuRow(path) {
    const q = (coreEls.search.value || "").trim().toLowerCase();
    if (q && path.toLowerCase().indexOf(q) === -1) return null;
    const clean = path.replace(/^GameObject\/Game Creator\//, "").replace(/^Assets\/Create\/Game Creator\//, "");
    const parts = clean.split("/");
    const leaf = parts.pop();
    const kind = path.indexOf("GameObject/") === 0 ? "GameObject" : "Asset";
    const item = { menuPath: path, name: leaf, module: parts[0] || "Core", kind: kind };
    const key = corePinKey(item);

    const row = document.createElement("button");
    row.type = "button";
    row.className = "core-type-row core-menu-row" + (corePinned.has(key) ? " pinned" : "");
    row.innerHTML =
      '<span class="core-type-icon">' + (kind === "GameObject" ? "GO" : "AS") + '</span>' +
      '<span><strong>' + escapeHtmlCore(leaf) + '</strong><small>' +
        escapeHtmlCore(parts.join(" › ") || "Game Creator") + '</small></span>' +
      (corePinned.has(key) ? '<span class="pin-dot">●</span>' : '');
    row.addEventListener("click", function(){ showCoreMenuDetail(item); });
    return row;
  }

  function renderCoreList() {
    if (!coreCatalogReady && coreMode !== "Hierarchy") return;
    const q = (coreEls.search.value || "").trim().toLowerCase();
    const module = coreEls.filter.value || "All";
    coreEls.list.innerHTML = "";
    const fragment = document.createDocumentFragment();

    if (coreMode === "Hierarchy") {
      CORE_MENU_ITEMS.forEach(function(path) {
        const row = renderMenuRow(path);
        if (row) fragment.appendChild(row);
      });
      coreEls.list.appendChild(fragment);
      if (!coreEls.list.children.length) coreEls.list.innerHTML = '<div class="core-empty">No matching Game Creator menu entries.</div>';
      return;
    }

    let total = 0;
    coreCatalog.forEach(function(item) {
      if (!itemMatchesMode(item, coreMode)) return;
      if (module !== "All" && item.module !== module) return;
      const meta = coreMeta(item);
      const haystack = (item.name + " " + prettifyCoreName(item.name) + " " + shortCoreGroup(item) + " " + (meta ? meta.path : "")).toLowerCase();
      if (q && haystack.indexOf(q) === -1) return;
      total++;

      const key = corePinKey(item);
      const row = document.createElement("button");
      row.type = "button";
      row.className = "core-type-row" + (corePinned.has(key) ? " pinned" : "");
      row.innerHTML =
        '<span class="core-type-icon">' + item.module.slice(0,2).toUpperCase() + '</span>' +
        '<span><strong>' + escapeHtmlCore(prettifyCoreName(item.name)) + '</strong><small>' +
          escapeHtmlCore(shortCoreGroup(item)) + ' · ' + escapeHtmlCore(item.name) + '</small></span>' +
        (corePinned.has(key) ? '<span class="pin-dot">●</span>' : '');
      row.addEventListener("click", function(){ showCoreDetail(item); });
      fragment.appendChild(row);
    });

    coreEls.list.appendChild(fragment);
    if (!total) coreEls.list.innerHTML = '<div class="core-empty">No matching Core types.</div>';
  }

  function fieldsHtmlFor(meta, es) {
    return meta && meta.fields.length
      ? '<div class="core-options"><h4>' + (es ? 'Opciones serializadas detectadas' : 'Detected serialized options') + '</h4>' +
        meta.fields.map(function(field){
          const badges = [];
          if (field.serializeReference) badges.push('SerializeReference');
          (field.attributes || []).forEach(function(attr){
            if (attr !== 'SerializeField' && attr !== 'SerializeReference' && badges.indexOf(attr) === -1) badges.push(attr);
          });
          return '<div class="core-option-row">' +
            '<div><strong>' + escapeHtmlCore(field.name) + '</strong><small>' + escapeHtmlCore(field.type) + '</small></div>' +
            '<div class="core-option-meta">' +
              (field.defaultValue ? '<code>' + escapeHtmlCore(field.defaultValue) + '</code>' : '') +
              badges.map(function(b){ return '<span>' + escapeHtmlCore(b) + '</span>'; }).join('') +
            '</div>' +
          '</div>';
        }).join('') +
        '</div>'
      : '<div class="core-no-options">' + (es ? 'No se detectaron campos serializados directos en este tipo.' : 'No direct serialized fields were detected on this type.') + '</div>';
  }

  function persistCorePins() {
    localStorage.setItem("monobuilder-core-pinned", JSON.stringify(Array.from(corePinned)));
    renderCoreSummary();
    renderCoreTabs();
    renderCoreList();
    renderDependencyStrip();
  }

  function showCoreMenuDetail(item) {
    const es = currentLang() === "es";
    const key = corePinKey(item);
    const pinned = corePinned.has(key);
    const clean = item.menuPath.replace(/^GameObject\/Game Creator\//, "").replace(/^Assets\/Create\/Game Creator\//, "");

    coreEls.detail.innerHTML =
      '<p class="eyebrow">Unity · Game Creator</p>' +
      '<h3>' + escapeHtmlCore(item.name) + '</h3>' +
      '<p>' + (es
        ? 'Esta entrada existe realmente en el menú del Core que me pasaste. Al añadirla al paquete, MonoBuilder genera un acceso de Unity que ejecuta exactamente este MenuItem.'
        : 'This entry exists in the supplied Core menu. Adding it to the bundle makes MonoBuilder generate a Unity helper that executes this exact MenuItem.') + '</p>' +
      '<div class="core-source-meta"><span>' + escapeHtmlCore(item.kind) + '</span><span>' + escapeHtmlCore(clean) + '</span></div>' +
      '<div class="core-dep-list"><span class="dependency-badge licensed">Game Creator 2 Core</span></div>' +
      '<button type="button" class="button ' + (pinned ? 'ghost' : 'primary') + '" id="toggleCorePin">' +
        (pinned ? (es ? 'Quitar del paquete' : 'Remove from bundle') : (es ? 'Añadir al paquete' : 'Add to bundle')) +
      '</button>';

    document.getElementById("toggleCorePin").addEventListener("click", function(){
      if (corePinned.has(key)) corePinned.delete(key); else corePinned.add(key);
      persistCorePins();
      showCoreMenuDetail(item);
    });
  }

  function showCoreDetail(item) {
    const es = currentLang() === "es";
    const deps = depsFromMask(item.depMask).map(function(id){ return DEPENDENCIES[id]; });
    const key = corePinKey(item);
    const pinned = corePinned.has(key);
    const meta = coreMeta(item);
    const label = prettifyCoreName(item.name);

    coreEls.detail.innerHTML =
      '<p class="eyebrow">' + escapeHtmlCore(item.module) + '</p>' +
      '<h3>' + escapeHtmlCore(label) + '</h3>' +
      '<p>' + (es
        ? 'Tipo real del Core. Puedes inspeccionar sus campos serializados y fijarlo como referencia del paquete exportado.'
        : 'Real Core type. Inspect its serialized fields and pin it as a reference in the exported bundle.') + '</p>' +
      (meta ? '<div class="core-source-meta"><span>' + escapeHtmlCore(meta.kind) + '</span><span>' + escapeHtmlCore(meta.namespace || '') + '</span><span>' + escapeHtmlCore(meta.path || '') + '</span></div>' : '') +
      '<div class="core-dep-list">' +
        '<span class="dependency-badge licensed">Game Creator 2 Core</span>' +
        deps.map(function(dep){ return '<span class="dependency-badge ' + dep.type + '">' + escapeHtmlCore(dep.name) + '</span>'; }).join("") +
      '</div>' +
      fieldsHtmlFor(meta, es) +
      '<button type="button" class="button ' + (pinned ? 'ghost' : 'primary') + '" id="toggleCorePin">' +
        (pinned ? (es ? 'Quitar del paquete' : 'Remove from bundle') : (es ? 'Añadir al paquete' : 'Add to bundle')) +
      '</button>';

    document.getElementById("toggleCorePin").addEventListener("click", function(){
      if (corePinned.has(key)) corePinned.delete(key); else corePinned.add(key);
      persistCorePins();
      showCoreDetail(item);
    });
  }

  function escapeHtmlCore(value) {
    return String(value == null ? "" : value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  coreEls.open.addEventListener("click", async function(){
    coreEls.dialog.showModal();
    ensureCoreTabs();
    await Promise.all([ensureCoreCatalog(), ensureCoreFields()]);
    renderCoreSummary();
    renderCoreTabs();
    renderCoreList();
    localizeCoreControls();
  });
  coreEls.close.addEventListener("click", function(){ coreEls.dialog.close(); });
  coreEls.search.addEventListener("input", renderCoreList);
  coreEls.filter.addEventListener("change", renderCoreList);

  function dependencyInstallerCode(deps) {
    const packages = deps.filter(function(d){ return d.type === "upm"; }).map(function(d){ return d.package; });
    if (!packages.length) return "";
    return [
      "#if UNITY_EDITOR",
      "using System.Collections.Generic;",
      "using UnityEditor;",
      "using UnityEditor.PackageManager;",
      "using UnityEditor.PackageManager.Requests;",
      "using UnityEngine;",
      "",
      "public static class MonoBuilderDependencyInstaller",
      "{",
      "    private static readonly Queue<string> Packages = new Queue<string>(new[] {",
      packages.map(function(p){ return '        "' + p + '"'; }).join(",\n"),
      "    });",
      "    private static AddRequest request;",
      "",
      "    [MenuItem(\"Tools/MonoBuilder/Install Required UPM Packages\")]",
      "    public static void Install()",
      "    {",
      "        if (request != null) return;",
      "        EditorApplication.update += Update;",
      "        Next();",
      "    }",
      "",
      "    private static void Next()",
      "    {",
      "        if (Packages.Count == 0)",
      "        {",
      "            EditorApplication.update -= Update;",
      "            request = null;",
      "            Debug.Log(\"MonoBuilder: dependency installation finished.\");",
      "            return;",
      "        }",
      "        string package = Packages.Dequeue();",
      "        Debug.Log(\"MonoBuilder: installing \" + package);",
      "        request = Client.Add(package);",
      "    }",
      "",
      "    private static void Update()",
      "    {",
      "        if (request == null || !request.IsCompleted) return;",
      "        if (request.Status == StatusCode.Failure) Debug.LogError(request.Error.message);",
      "        request = null;",
      "        Next();",
      "    }",
      "}",
      "#endif"
    ].join("\n");
  }


  function bundleBootstrapCode(deps) {
    const probes = {
      "input-system": "UnityEngine.InputSystem.InputAction",
      "ugui": "UnityEngine.UI.Button",
      "tmp": "TMPro.TMP_Text",
      "ai-navigation": "Unity.AI.Navigation.NavMeshSurface",
      "mathematics": "Unity.Mathematics.float3",
      "collections": "Unity.Collections.NativeArray",
      "game-creator-core": "GameCreator.Runtime.Characters.Character",
      "lean-tween": "LeanTween",
      "dotween": "DG.Tweening.DOTween"
    };
    const upm = deps.filter(function(d){ return d.type === "upm"; });
    const external = deps.filter(function(d){ return d.type === "manual" || d.type === "licensed"; });

    const upmRows = upm.map(function(d){
      return '        new Dependency("' + d.name.replace(/"/g, '\"') + '", "' + d.package.replace(/"/g, '\"') + '", "' + (probes[d.id] || "") + '")';
    }).join(",\n");
    const externalRows = external.map(function(d){
      return '        new Dependency("' + d.name.replace(/"/g, '\"') + '", "", "' + (probes[d.id] || "") + '")';
    }).join(",\n");

    return [
      "#if UNITY_EDITOR",
      "using System;",
      "using System.Collections.Generic;",
      "using System.IO;",
      "using System.Linq;",
      "using UnityEditor;",
      "using UnityEditor.PackageManager;",
      "using UnityEditor.PackageManager.Requests;",
      "using UnityEngine;",
      "",
      "[InitializeOnLoad]",
      "public static class MonoBuilderBundleBootstrap",
      "{",
      "    private const string Root = \"Assets/MonoBuilder\";",
      "    private const string Marker = Root + \"/.monobuilder-installed\";",
      "    private const string ApprovedKey = \"MonoBuilder.Bundle.InstallApproved\";",
      "    private const string AskedKey = \"MonoBuilder.Bundle.InstallAsked\";",
      "",
      "    private sealed class Dependency",
      "    {",
      "        public readonly string Name;",
      "        public readonly string Package;",
      "        public readonly string ProbeType;",
      "        public Dependency(string name, string package, string probeType) { Name = name; Package = package; ProbeType = probeType; }",
      "    }",
      "",
      "    private static readonly Dependency[] Upm = new Dependency[]",
      "    {",
      upmRows,
      "    };",
      "",
      "    private static readonly Dependency[] External = new Dependency[]",
      "    {",
      externalRows,
      "    };",
      "",
      "    private static AddRequest request;",
      "",
      "    static MonoBuilderBundleBootstrap()",
      "    {",
      "        EditorApplication.delayCall += AutoStart;",
      "    }",
      "",
      "    private static void AutoStart()",
      "    {",
      "        if (File.Exists(Marker)) return;",
      "        if (!SessionState.GetBool(AskedKey, false))",
      "        {",
      "            SessionState.SetBool(AskedKey, true);",
      "            string list = string.Join(\"\\\\n\", Upm.Select(x => \"• \" + x.Name).Concat(External.Select(x => \"• \" + x.Name)));",
      "            bool install = EditorUtility.DisplayDialog(",
      "                \"MonoBuilder bundle\",",
      "                \"This bundle needs the following dependencies before its generated scripts can compile:\\\\n\\\\n\" + list + \"\\\\n\\\\nInstall supported Unity packages now?\",",
      "                \"Install / Continue\", \"Later\");",
      "            if (!install) return;",
      "            SessionState.SetBool(ApprovedKey, true);",
      "        }",
      "        if (SessionState.GetBool(ApprovedKey, false)) ContinueInstall();",
      "    }",
      "",
      "    [MenuItem(\"Tools/MonoBuilder/Install Bundle Dependencies\")]",
      "    public static void InstallFromMenu()",
      "    {",
      "        SessionState.SetBool(ApprovedKey, true);",
      "        ContinueInstall();",
      "    }",
      "",
      "    private static void ContinueInstall()",
      "    {",
      "        if (request != null || File.Exists(Marker)) return;",
      "",
      "        Dependency package = Upm.FirstOrDefault(x => !HasType(x.ProbeType) && !HasPackage(x.Package));",
      "        if (package != null)",
      "        {",
      "            Debug.Log(\"MonoBuilder: installing \" + package.Name + \" (\" + package.Package + \")\");",
      "            request = Client.Add(package.Package);",
      "            EditorApplication.update += PollRequest;",
      "            return;",
      "        }",
      "",
      "        string[] missingExternal = External.Where(x => !HasType(x.ProbeType)).Select(x => x.Name).ToArray();",
      "        if (missingExternal.Length > 0)",
      "        {",
      "            EditorUtility.DisplayDialog(",
      "                \"MonoBuilder: manual dependencies required\",",
      "                \"Install these dependencies, then run Tools → MonoBuilder → Install Bundle Dependencies again:\\\\n\\\\n• \" + string.Join(\"\\\\n• \", missingExternal),",
      "                \"OK\");",
      "            return;",
      "        }",
      "",
      "        MaterializePayload();",
      "    }",
      "",
      "    private static void PollRequest()",
      "    {",
      "        if (request == null || !request.IsCompleted) return;",
      "        EditorApplication.update -= PollRequest;",
      "        if (request.Status == StatusCode.Failure)",
      "        {",
      "            Debug.LogError(\"MonoBuilder dependency install failed: \" + request.Error.message);",
      "            request = null;",
      "            return;",
      "        }",
      "        request = null;",
      "        AssetDatabase.Refresh();",
      "        EditorApplication.delayCall += ContinueInstall;",
      "    }",
      "",
      "    private static bool HasPackage(string packageName)",
      "    {",
      "        if (string.IsNullOrEmpty(packageName)) return true;",
      "        return PackageInfo.GetAllRegisteredPackages().Any(x => x.name == packageName);",
      "    }",
      "",
      "    private static bool HasType(string typeName)",
      "    {",
      "        if (string.IsNullOrEmpty(typeName)) return true;",
      "        foreach (var assembly in AppDomain.CurrentDomain.GetAssemblies())",
      "        {",
      "            try",
      "            {",
      "                if (assembly.GetType(typeName, false) != null) return true;",
      "                if (!typeName.Contains(\".\") && assembly.GetTypes().Any(x => x.Name == typeName)) return true;",
      "            }",
      "            catch { }",
      "        }",
      "        return false;",
      "    }",
      "",
      "    private static void MaterializePayload()",
      "    {",
      "        string payload = Root + \"/Payload\";",
      "        if (!Directory.Exists(payload))",
      "        {",
      "            Directory.CreateDirectory(Root);",
      "            File.WriteAllText(Marker, DateTime.UtcNow.ToString(\"O\"));",
      "            return;",
      "        }",
      "",
      "        foreach (string source in Directory.GetFiles(payload, \"*.mbcode\", SearchOption.AllDirectories))",
      "        {",
      "            string destination = source.Substring(0, source.Length - \".mbcode\".Length);",
      "            Directory.CreateDirectory(Path.GetDirectoryName(destination));",
      "            File.Copy(source, destination, true);",
      "            File.Delete(source);",
      "        }",
      "",
      "        File.WriteAllText(Marker, DateTime.UtcNow.ToString(\"O\"));",
      "        Debug.Log(\"MonoBuilder: dependencies ready and generated scripts activated.\");",
      "        AssetDatabase.Refresh();",
      "    }",
      "}",
      "#endif"
    ].join("\n");
  }

  function bundleReadme(template, deps) {
    const es = currentLang() === "es";
    const upm = deps.filter(function(d){ return d.type === "upm"; });
    const manual = deps.filter(function(d){ return d.type === "manual"; });
    const licensed = deps.filter(function(d){ return d.type === "licensed"; });
    const lines = [
      "# MonoBuilder · " + template.name,
      "",
      es ? "Paquete generado por MonoBuilder." : "Bundle generated by MonoBuilder.",
      "",
      "## " + (es ? "Instalación" : "Installation"),
      "",
      es ? "1. Copia la carpeta Assets dentro de tu proyecto Unity. Los scripts con dependencias quedan inactivos como .mbcode hasta que estén listas." : "1. Copy the Assets folder into your Unity project. Dependency-sensitive scripts stay inactive as .mbcode until requirements are ready.",
      upm.length ? (es ? "2. Unity ofrecerá instalar automáticamente los paquetes UPM compatibles. También puedes ejecutar Tools → MonoBuilder → Install Bundle Dependencies." : "2. Unity will offer to install compatible UPM packages automatically. You can also run Tools → MonoBuilder → Install Bundle Dependencies.") : "",
      licensed.length ? (es ? "3. Instala previamente las dependencias comerciales/licenciadas que aparecen abajo." : "3. Install the licensed/commercial dependencies listed below first.") : "",
      "",
      "## " + (es ? "Dependencias detectadas" : "Detected dependencies"),
      ""
    ];
    if (!deps.length) lines.push("- " + (es ? "Ninguna dependencia adicional." : "No additional dependencies."));
    deps.forEach(function(dep){ lines.push("- " + dep.name + " · " + dep.type + (dep.package ? " · " + dep.package : "")); });
    if (manual.length) {
      lines.push("", "## " + (es ? "Dependencias manuales" : "Manual dependencies"), "");
      manual.forEach(function(dep){ lines.push("- " + dep.name + ": " + (es ? "MonoBuilder no la redistribuye; instálala en tu proyecto antes de compilar." : "MonoBuilder does not redistribute it; install it in the project before compiling.")); });
    }
    if (licensed.length) {
      lines.push("", "## " + (es ? "Dependencias con licencia" : "Licensed dependencies"), "");
      lines.push(es
        ? "El código fuente del paquete con licencia no se incluye en este ZIP. El generador solo crea integración y referencias para una instalación que ya poseas."
        : "Licensed package source is not included in this ZIP. The generator only creates integrations and references for an installation you already own.");
    }
    if (corePinned.size) {
      lines.push("", "## Core references", "");
      Array.from(corePinned).sort().forEach(function(name){ lines.push("- " + name); });
    }
    return lines.filter(Boolean).join("\n") + "\n";
  }

  function makeBundleFiles() {
    const template = currentTemplate();
    const code = generateCode();
    const deps = resolveDependencies(template, code);
    const root = "Assets/MonoBuilder/";
    const files = {};
    const needsBootstrap = deps.some(function(d){ return d.type !== "builtin"; });

    if (needsBootstrap) {
      files[root + "Payload/Generated/" + template.className + ".cs.mbcode"] = code;
      if (template.id === CORE_TEMPLATE_ID) {
        files[root + "Payload/Editor/MonoBuilderCreateCharacter.cs.mbcode"] = characterEditorCode();
      }
      files[root + "Editor/MonoBuilderBundleBootstrap.cs"] = bundleBootstrapCode(deps);
    } else {
      files[root + "Generated/" + template.className + ".cs"] = code;
      if (template.id === CORE_TEMPLATE_ID) files[root + "Editor/MonoBuilderCreateCharacter.cs"] = characterEditorCode();
    }

    files[root + "MonoBuilder.dependencies.json"] = JSON.stringify({
      schema: 2,
      template: template.id,
      className: template.className,
      dependencies: deps,
      coreReferences: Array.from(corePinned).sort(),
      activation: needsBootstrap ? "payload-after-dependencies" : "immediate",
      note: "Licensed/manual dependencies are detected but never redistributed by MonoBuilder."
    }, null, 2);
    files["README.md"] = bundleReadme(template, deps);
    return { files: files, template: template, deps: deps };
  }

  const crcTable = (function(){
    const table = new Uint32Array(256);
    for (let n = 0; n < 256; n++) {
      let c = n;
      for (let k = 0; k < 8; k++) c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1);
      table[n] = c >>> 0;
    }
    return table;
  })();

  function crc32(bytes) {
    let c = 0xffffffff;
    for (let i = 0; i < bytes.length; i++) c = crcTable[(c ^ bytes[i]) & 0xff] ^ (c >>> 8);
    return (c ^ 0xffffffff) >>> 0;
  }

  function u16(n) { return new Uint8Array([n & 255, (n >>> 8) & 255]); }
  function u32(n) { return new Uint8Array([n & 255, (n >>> 8) & 255, (n >>> 16) & 255, (n >>> 24) & 255]); }
  function joinBytes(parts) {
    const length = parts.reduce(function(sum,p){ return sum + p.length; }, 0);
    const out = new Uint8Array(length);
    let offset = 0;
    parts.forEach(function(p){ out.set(p, offset); offset += p.length; });
    return out;
  }

  function buildZip(fileMap) {
    const enc = new TextEncoder();
    const localParts = [];
    const centralParts = [];
    let offset = 0;
    Object.entries(fileMap).forEach(function(entry){
      const name = entry[0], text = entry[1];
      const nameBytes = enc.encode(name.replace(/\\/g,"/"));
      const data = enc.encode(text);
      const crc = crc32(data);
      const local = joinBytes([
        u32(0x04034b50), u16(20), u16(0x0800), u16(0), u16(0), u16(0),
        u32(crc), u32(data.length), u32(data.length), u16(nameBytes.length), u16(0), nameBytes, data
      ]);
      localParts.push(local);
      const central = joinBytes([
        u32(0x02014b50), u16(20), u16(20), u16(0x0800), u16(0), u16(0), u16(0),
        u32(crc), u32(data.length), u32(data.length), u16(nameBytes.length), u16(0), u16(0),
        u16(0), u16(0), u32(0), u32(offset), nameBytes
      ]);
      centralParts.push(central);
      offset += local.length;
    });
    const localData = joinBytes(localParts);
    const centralData = joinBytes(centralParts);
    const end = joinBytes([
      u32(0x06054b50), u16(0), u16(0), u16(centralParts.length), u16(centralParts.length),
      u32(centralData.length), u32(localData.length), u16(0)
    ]);
    return new Blob([localData, centralData, end], { type: "application/zip" });
  }

  function downloadBundle() {
    const bundle = makeBundleFiles();
    const zip = buildZip(bundle.files);
    const url = URL.createObjectURL(zip);
    const a = document.createElement("a");
    a.href = url;
    a.download = bundle.template.className + "_MonoBuilder.zip";
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(function(){ URL.revokeObjectURL(url); }, 1000);
    toast(currentLang() === "es" ? "Paquete Unity exportado" : "Unity bundle exported");
  }

  coreEls.bundle.addEventListener("click", downloadBundle);

  renderCategories();
  localizeCoreTemplate();
  renderAll();
  // Core metadata is intentionally lazy-loaded from the Core dialog.
  // Loading and decompressing both indexes during initial page startup is unnecessary.
  renderDependencyStrip();
})();