(function () {
  "use strict";

  const DB_NAME = "MonoBuilderCoreVault";
  const DB_VERSION = 1;
  const STORE = "files";
  const CORE_KEY = "gamecreator2-csharp-source";
  const EXPECTED_CORE_FILE = "Packages/Core/Runtime/Characters/Components/Character.cs";

  const CORE_UPM = [
    { id: "input-system", name: "Unity Input System", package: "com.unity.inputsystem", probe: "UnityEngine.InputSystem.InputAction" },
    { id: "ugui", name: "Unity UI", package: "com.unity.ugui", probe: "UnityEngine.UI.Button" },
    { id: "tmp", name: "TextMeshPro", package: "com.unity.textmeshpro", probe: "TMPro.TMP_Text" },
    { id: "mathematics", name: "Unity Mathematics", package: "com.unity.mathematics", probe: "Unity.Mathematics.float3" },
    { id: "collections", name: "Unity Collections", package: "com.unity.collections", probe: "Unity.Collections.NativeArray" }
  ];

  const OTHER_DEPS = {
    "lean-tween": { id: "lean-tween", name: "LeanTween", type: "manual", probe: "LeanTween" },
    "dotween": { id: "dotween", name: "DOTween", type: "manual", probe: "DG.Tweening.DOTween" }
  };

  let coreRecord = null;
  let coreCatalogCache = null;
  let exportAfterLink = false;

  const elsVault = {
    status: document.getElementById("coreVaultStatus"),
    meta: document.getElementById("coreVaultMeta"),
    link: document.getElementById("linkCoreSourceBtn"),
    forget: document.getElementById("forgetCoreSourceBtn"),
    input: document.getElementById("coreSourceFileInput")
  };

  function lang() {
    return localStorage.getItem("monobuilder-lang") === "es" ? "es" : "en";
  }

  function formatBytes(value) {
    if (!Number.isFinite(value) || value <= 0) return "0 B";
    const units = ["B", "KB", "MB", "GB"];
    let size = value;
    let i = 0;
    while (size >= 1024 && i < units.length - 1) {
      size /= 1024;
      i++;
    }
    return (i === 0 ? Math.round(size) : size.toFixed(size >= 10 ? 1 : 2)) + " " + units[i];
  }

  function openDb() {
    return new Promise(function (resolve, reject) {
      if (!("indexedDB" in window)) {
        reject(new Error("IndexedDB unavailable"));
        return;
      }
      const request = indexedDB.open(DB_NAME, DB_VERSION);
      request.onupgradeneeded = function () {
        const db = request.result;
        if (!db.objectStoreNames.contains(STORE)) db.createObjectStore(STORE, { keyPath: "key" });
      };
      request.onsuccess = function () { resolve(request.result); };
      request.onerror = function () { reject(request.error); };
    });
  }

  async function vaultGet() {
    const db = await openDb();
    return new Promise(function (resolve, reject) {
      const tx = db.transaction(STORE, "readonly");
      const request = tx.objectStore(STORE).get(CORE_KEY);
      request.onsuccess = function () { resolve(request.result || null); };
      request.onerror = function () { reject(request.error); };
      tx.oncomplete = function () { db.close(); };
    });
  }

  async function vaultPut(record) {
    const db = await openDb();
    return new Promise(function (resolve, reject) {
      const tx = db.transaction(STORE, "readwrite");
      tx.objectStore(STORE).put(record);
      tx.oncomplete = function () { db.close(); resolve(); };
      tx.onerror = function () { db.close(); reject(tx.error); };
    });
  }

  async function vaultDelete() {
    const db = await openDb();
    return new Promise(function (resolve, reject) {
      const tx = db.transaction(STORE, "readwrite");
      tx.objectStore(STORE).delete(CORE_KEY);
      tx.oncomplete = function () { db.close(); resolve(); };
      tx.onerror = function () { db.close(); reject(tx.error); };
    });
  }

  function zipDirectory(buffer) {
    const view = new DataView(buffer);
    const bytes = new Uint8Array(buffer);
    const decoder = new TextDecoder("utf-8");
    const min = Math.max(0, bytes.length - 65557);
    let eocd = -1;

    for (let i = bytes.length - 22; i >= min; i--) {
      if (view.getUint32(i, true) === 0x06054b50) {
        eocd = i;
        break;
      }
    }
    if (eocd < 0) throw new Error("Not a supported ZIP file");

    const totalEntries = view.getUint16(eocd + 10, true);
    let offset = view.getUint32(eocd + 16, true);
    const names = [];

    for (let i = 0; i < totalEntries; i++) {
      if (offset + 46 > bytes.length || view.getUint32(offset, true) !== 0x02014b50) {
        throw new Error("Invalid ZIP central directory");
      }
      const nameLength = view.getUint16(offset + 28, true);
      const extraLength = view.getUint16(offset + 30, true);
      const commentLength = view.getUint16(offset + 32, true);
      const nameStart = offset + 46;
      const nameEnd = nameStart + nameLength;
      names.push(decoder.decode(bytes.slice(nameStart, nameEnd)).replace(/\\/g, "/"));
      offset = nameEnd + extraLength + commentLength;
    }
    return names;
  }

  function validateCoreZip(buffer) {
    const names = zipDirectory(buffer);
    const hasCharacter = names.indexOf(EXPECTED_CORE_FILE) !== -1;
    const runtimeCount = names.filter(function (name) { return name.startsWith("Packages/Core/Runtime/") && name.endsWith(".cs"); }).length;
    const editorCount = names.filter(function (name) { return name.startsWith("Packages/Core/Editor/") && name.endsWith(".cs"); }).length;

    if (!hasCharacter || runtimeCount < 1000) {
      throw new Error("This ZIP does not look like the Game Creator 2 Core source used by MonoBuilder.");
    }

    return {
      fileCount: names.length,
      runtimeCount: runtimeCount,
      editorCount: editorCount
    };
  }

  function renderVault() {
    if (!elsVault.status) return;
    const es = lang();

    if (coreRecord) {
      elsVault.status.textContent = es ? "Core vinculado ✓" : "Core linked ✓";
      elsVault.meta.textContent =
        coreRecord.name + " · " + formatBytes(coreRecord.size) + " · " +
        coreRecord.fileCount + (es ? " archivos" : " files") +
        " · " + coreRecord.runtimeCount + " Runtime / " + coreRecord.editorCount + " Editor";
      elsVault.link.textContent = es ? "Cambiar Core ZIP" : "Replace Core ZIP";
      elsVault.forget.textContent = es ? "Olvidar" : "Forget";
      elsVault.forget.classList.remove("hidden");
    } else {
      elsVault.status.textContent = es ? "Core no vinculado" : "Core not linked";
      elsVault.meta.textContent = es
        ? "Vincula GameCreator2_CSharp_Source.zip una sola vez. Se guarda únicamente en este navegador."
        : "Link GameCreator2_CSharp_Source.zip once. It is stored only in this browser.";
      elsVault.link.textContent = es ? "Vincular Core ZIP" : "Link Core ZIP";
      elsVault.forget.classList.add("hidden");
    }

    decorateDependencyBadge();
  }

  function decorateDependencyBadge() {
    const container = document.getElementById("dependencyBadges");
    if (!container) return;
    Array.from(container.children).forEach(function (badge) {
      if (badge.textContent.indexOf("Game Creator 2 Core") !== -1) {
        if (coreRecord) {
          badge.textContent = lang() === "es" ? "Game Creator 2 Core · incluido ✓" : "Game Creator 2 Core · bundled ✓";
          badge.classList.remove("licensed");
          badge.classList.add("bundled");
          badge.title = lang() === "es"
            ? "El ZIP del Core se incluirá dentro del paquete descargado."
            : "The linked Core ZIP will be embedded in the downloaded bundle.";
        } else {
          badge.textContent = lang() === "es" ? "Game Creator 2 Core · vincular ZIP" : "Game Creator 2 Core · link ZIP";
        }
      }
    });
  }

  async function linkCoreFile(file) {
    if (!file) return false;
    const buffer = await file.arrayBuffer();
    const info = validateCoreZip(buffer);

    coreRecord = {
      key: CORE_KEY,
      name: file.name,
      size: file.size,
      type: file.type || "application/zip",
      savedAt: Date.now(),
      fileCount: info.fileCount,
      runtimeCount: info.runtimeCount,
      editorCount: info.editorCount,
      bytes: buffer
    };

    await vaultPut(coreRecord);
    renderVault();
    toast(lang() === "es" ? "Core guardado en este navegador" : "Core saved in this browser");
    return true;
  }

  async function ensureCoreRecord() {
    if (coreRecord && coreRecord.bytes) return coreRecord;
    try {
      coreRecord = await vaultGet();
    } catch (error) {
      console.warn("MonoBuilder Core Vault:", error);
      coreRecord = null;
    }
    renderVault();
    return coreRecord;
  }

  function needsCore(template, code) {
    if (!template) return false;
    if (template.id === "gc2-character-core") return true;
    if (/GameCreator\.Runtime/.test(code || "")) return true;
    const pinned = JSON.parse(localStorage.getItem("monobuilder-core-pinned") || "[]");
    return Array.isArray(pinned) && pinned.length > 0;
  }

  async function getCatalog() {
    if (coreCatalogCache) return coreCatalogCache;
    try {
      coreCatalogCache = await window.loadMonoBuilderCoreCatalog();
    } catch (_) {
      coreCatalogCache = [];
    }
    return coreCatalogCache;
  }

  async function resolveBundleDependencies(template, code) {
    const deps = [];
    const seen = new Set();

    function add(dep) {
      if (!dep || seen.has(dep.id)) return;
      seen.add(dep.id);
      deps.push(dep);
    }

    if (/UnityEngine\.InputSystem|InputActionReference/.test(code) || template.fields.some(function (f) { return f.type === "InputActionReference"; })) {
      add(CORE_UPM[0]);
    }
    if (/UnityEngine\.UI/.test(code) || template.fields.some(function (f) { return ["Button", "Slider", "Toggle", "Image"].indexOf(f.type) !== -1; })) {
      add(CORE_UPM[1]);
    }
    if (/TMPro|TMP_/.test(code) || template.fields.some(function (f) { return /^TMP_/.test(f.type); })) {
      add(CORE_UPM[2]);
    }
    if (/LeanTween|LeanTweenType/.test(code)) add(OTHER_DEPS["lean-tween"]);
    if (/DG\.Tweening|DOTween/.test(code)) add(OTHER_DEPS.dotween);

    if (needsCore(template, code)) {
      CORE_UPM.forEach(add);
      add({ id: "playables", name: "Unity Playables", type: "builtin", probe: "UnityEngine.Playables.PlayableGraph" });
      add({
        id: "game-creator-core",
        name: "Game Creator 2 Core",
        type: coreRecord ? "bundled" : "local-source",
        probe: "GameCreator.Runtime.Characters.Character"
      });
    }

    const pinned = JSON.parse(localStorage.getItem("monobuilder-core-pinned") || "[]");
    if (Array.isArray(pinned) && pinned.length) {
      const catalog = await getCatalog();
      const bitMap = [
        [1, CORE_UPM[0]],
        [2, CORE_UPM[1]],
        [4, CORE_UPM[2]],
        [16, CORE_UPM[3]],
        [32, CORE_UPM[4]]
      ];
      pinned.forEach(function (name) {
        const item = catalog.find(function (entry) { return entry.name === name; });
        if (!item) return;
        bitMap.forEach(function (row) {
          if (item.depMask & row[0]) add(row[1]);
        });
      });
    }

    return deps;
  }

  function safeIdentifier(value) {
    let out = String(value || "Component").replace(/[^a-zA-Z0-9_]/g, "_");
    if (!out) out = "Component";
    if (/^[0-9]/.test(out)) out = "_" + out;
    return out;
  }

  function pinnedCoreSelections() {
    let raw = [];
    try {
      raw = JSON.parse(localStorage.getItem("monobuilder-core-pinned") || "[]");
    } catch (_) {
      raw = [];
    }
    if (!Array.isArray(raw)) raw = [];
    return {
      menus: raw.filter(function(value){ return typeof value === "string" && value.indexOf("@menu:") === 0; })
        .map(function(value){ return value.substring("@menu:".length); }),
      types: raw.filter(function(value){ return typeof value === "string" && value.indexOf("@menu:") !== 0; })
    };
  }

  function gameCreatorMenuHelperCode(paths) {
    if (!paths.length) return "";
    const lines = [
      "#if UNITY_EDITOR",
      "using UnityEditor;",
      "using UnityEngine;",
      "",
      "public static class MonoBuilderPinnedGameCreatorMenus",
      "{"
    ];

    paths.forEach(function(path, index) {
      const label = path
        .replace(/^GameObject\/Game Creator\//, "")
        .replace(/^Assets\/Create\/Game Creator\//, "")
        .replace(/\//g, " - ")
        .replace(/"/g, "");
      lines.push(
        "    [MenuItem(\"Tools/MonoBuilder/Game Creator/" + label.replace(/"/g, "\\\\\"") + "\")]",
        "    public static void Create_" + index + "()",
        "    {",
        "        if (!EditorApplication.ExecuteMenuItem(\"" + path.replace(/\\/g, "\\\\\\\\").replace(/"/g, "\\\\\"") + "\"))",
        "            Debug.LogWarning(\"MonoBuilder: Game Creator menu item was not found. Make sure the bundled Core finished importing.\");",
        "    }",
        ""
      );
    });

    lines.push("}", "#endif");
    return lines.join("\\n");
  }

  function characterEditorCodeVault() {
    const v = values;
    const rigs = [
      ["rigFeetPlant","RigFeetPlant"],["rigLookTo","RigLookTo"],["rigBreathing","RigBreathing"],
      ["rigLean","RigLean"],["rigAlignGround","RigAlignGround"],["rigTwitching","RigTwitching"],
      ["rigAimTowards","RigAimTowards"]
    ].filter(function (x) { return v[x[0]]; }).map(function (x) { return x[1]; });

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
      "        so.FindProperty(\"m_IsPlayer\").boolValue = " + (v.isPlayer ? "true" : "false") + ";",
      "        SerializedProperty time = so.FindProperty(\"m_Time\").FindPropertyRelative(\"m_UpdateTime\");",
      "        time.enumValueIndex = " + (v.timeMode === "UnscaledTime" ? "1" : "0") + ";",
      "        SerializedProperty kernel = so.FindProperty(\"m_Kernel\");",
      "        kernel.FindPropertyRelative(\"m_Player\").managedReferenceValue = new " + v.playerUnit + "();",
      "        kernel.FindPropertyRelative(\"m_Motion\").managedReferenceValue = new " + v.motionUnit + "();",
      "        kernel.FindPropertyRelative(\"m_Driver\").managedReferenceValue = new " + v.driverUnit + "();",
      "        kernel.FindPropertyRelative(\"m_Facing\").managedReferenceValue = new " + v.facingUnit + "();",
      "        kernel.FindPropertyRelative(\"m_Animim\").managedReferenceValue = new " + v.animimUnit + "();",
      "        SerializedProperty ragdoll = so.FindProperty(\"m_Ragdoll\").FindPropertyRelative(\"m_Ragdoll\");",
      "        ragdoll.managedReferenceValue = new " + v.ragdollSystem + "();",
      "        SerializedProperty rigs = so.FindProperty(\"m_InverseKinematics\").FindPropertyRelative(\"m_RigLayers\").FindPropertyRelative(\"m_Rigs\");",
      "        rigs.arraySize = " + rigs.length + ";"
    ];

    rigs.forEach(function (name, index) {
      lines.push("        rigs.GetArrayElementAtIndex(" + index + ").managedReferenceValue = new " + name + "();");
    });

    lines.push(
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

  function makeBootstrap(deps, bundleId, includeCore) {
    const upm = deps.filter(function (d) { return d.package; });
    const manual = deps.filter(function (d) { return d.type === "manual"; });
    const className = "MonoBuilderBundleBootstrap_" + safeIdentifier(bundleId);
    const bundleRoot = "Assets/MonoBuilder/Bundles/" + bundleId;

    const upmRows = upm.map(function (dep) {
      return '        new Dependency("' + dep.name.replace(/"/g, '\\"') + '", "' + dep.package.replace(/"/g, '\\"') + '", "' + (dep.probe || "") + '")';
    }).join(",\n");

    const manualRows = manual.map(function (dep) {
      return '        new Dependency("' + dep.name.replace(/"/g, '\\"') + '", "", "' + (dep.probe || "") + '")';
    }).join(",\n");

    return [
      "#if UNITY_EDITOR",
      "using System;",
      "using System.IO;",
      "using System.IO.Compression;",
      "using System.Linq;",
      "using UnityEditor;",
      "using UnityEditor.PackageManager;",
      "using UnityEditor.PackageManager.Requests;",
      "using UnityEngine;",
      "",
      "[InitializeOnLoad]",
      "public static class " + className,
      "{",
      "    private const string BundleRoot = \"" + bundleRoot + "\";",
      "    private const string PayloadRoot = BundleRoot + \"/Payload\";",
      "    private const string ActivatedMarker = BundleRoot + \"/.payload-activated\";",
      "    private const string CoreArchive = \"Assets/MonoBuilder/CoreSource/GameCreator2_CSharp_Source.zip.bytes\";",
      "    private const string CoreRoot = \"Assets/MonoBuilder/Vendor/GameCreator2Core\";",
      "",
      "    private sealed class Dependency",
      "    {",
      "        public readonly string Name;",
      "        public readonly string Package;",
      "        public readonly string Probe;",
      "        public Dependency(string name, string package, string probe) { Name = name; Package = package; Probe = probe; }",
      "    }",
      "",
      "    private static readonly Dependency[] Upm = new Dependency[]",
      "    {",
      upmRows,
      "    };",
      "",
      "    private static readonly Dependency[] Manual = new Dependency[]",
      "    {",
      manualRows,
      "    };",
      "",
      "    private static AddRequest s_Request;",
      "",
      "    static " + className + "()",
      "    {",
      "        EditorApplication.delayCall += ContinueInstall;",
      "    }",
      "",
      "    [MenuItem(\"Tools/MonoBuilder/Install Bundle Dependencies\")]",
      "    public static void InstallFromMenu()",
      "    {",
      "        ContinueInstall();",
      "    }",
      "",
      "    private static void ContinueInstall()",
      "    {",
      "        if (s_Request != null || File.Exists(ActivatedMarker)) return;",
      "",
      "        Dependency package = Upm.FirstOrDefault(x => !HasType(x.Probe) && !HasPackage(x.Package));",
      "        if (package != null)",
      "        {",
      "            Debug.Log(\"MonoBuilder: installing \" + package.Name + \" (\" + package.Package + \")\");",
      "            s_Request = Client.Add(package.Package);",
      "            EditorApplication.update += PollPackage;",
      "            return;",
      "        }",
      "",
      includeCore
        ? "        if (!HasType(\"GameCreator.Runtime.Characters.Character\"))\n        {\n            if (!File.Exists(CoreArchive))\n            {\n                Debug.LogError(\"MonoBuilder: bundled Core archive is missing: \" + CoreArchive);\n                return;\n            }\n            ExtractBundledCore();\n            return;\n        }"
        : "        // No bundled Game Creator Core required.",
      "",
      "        string[] missingManual = Manual.Where(x => !HasType(x.Probe)).Select(x => x.Name).ToArray();",
      "        if (missingManual.Length > 0)",
      "        {",
      "            EditorUtility.DisplayDialog(\"MonoBuilder: dependency required\",",
      "                \"Install these external dependencies and run Tools → MonoBuilder → Install Bundle Dependencies again:\\n\\n• \" + string.Join(\"\\n• \", missingManual), \"OK\");",
      "            return;",
      "        }",
      "",
      "        ActivatePayload();",
      "    }",
      "",
      "    private static void PollPackage()",
      "    {",
      "        if (s_Request == null || !s_Request.IsCompleted) return;",
      "        EditorApplication.update -= PollPackage;",
      "        if (s_Request.Status == StatusCode.Failure)",
      "        {",
      "            Debug.LogError(\"MonoBuilder: package installation failed: \" + s_Request.Error.message);",
      "            s_Request = null;",
      "            return;",
      "        }",
      "        s_Request = null;",
      "        AssetDatabase.Refresh();",
      "        EditorApplication.delayCall += ContinueInstall;",
      "    }",
      "",
      "    private static bool HasPackage(string packageName)",
      "    {",
      "        return UnityEditor.PackageManager.PackageInfo.GetAllRegisteredPackages().Any(x => x.name == packageName);",
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
      "    private static void ExtractBundledCore()",
      "    {",
      "        string rootFull = Path.GetFullPath(CoreRoot + Path.DirectorySeparatorChar);",
      "        Directory.CreateDirectory(rootFull);",
      "",
      "        using (FileStream input = File.OpenRead(CoreArchive))",
      "        using (ZipArchive archive = new ZipArchive(input, ZipArchiveMode.Read))",
      "        {",
      "            foreach (ZipArchiveEntry entry in archive.Entries)",
      "            {",
      "                string source = entry.FullName.Replace('\\\\', '/');",
      "                bool runtime = source.StartsWith(\"Packages/Core/Runtime/\", StringComparison.Ordinal);",
      "                bool editor = source.StartsWith(\"Packages/Core/Editor/\", StringComparison.Ordinal);",
      "                if (!runtime && !editor) continue;",
      "",
      "                string relative = source.Substring(\"Packages/Core/\".Length);",
      "                string target = Path.GetFullPath(Path.Combine(rootFull, relative));",
      "                if (!target.StartsWith(rootFull, StringComparison.OrdinalIgnoreCase)) continue;",
      "",
      "                if (string.IsNullOrEmpty(entry.Name))",
      "                {",
      "                    Directory.CreateDirectory(target);",
      "                    continue;",
      "                }",
      "",
      "                Directory.CreateDirectory(Path.GetDirectoryName(target));",
      "                using (Stream from = entry.Open())",
      "                using (FileStream to = new FileStream(target, FileMode.Create, FileAccess.Write, FileShare.None))",
      "                {",
      "                    from.CopyTo(to);",
      "                }",
      "            }",
      "        }",
      "",
      "        Debug.Log(\"MonoBuilder: bundled Game Creator 2 Core extracted. Unity will compile it before activating the generated component.\");",
      "        AssetDatabase.Refresh();",
      "    }",
      "",
      "    private static void ActivatePayload()",
      "    {",
      "        if (!Directory.Exists(PayloadRoot))",
      "        {",
      "            Directory.CreateDirectory(BundleRoot);",
      "            File.WriteAllText(ActivatedMarker, DateTime.UtcNow.ToString(\"O\"));",
      "            return;",
      "        }",
      "",
      "        foreach (string source in Directory.GetFiles(PayloadRoot, \"*.mbcode\", SearchOption.AllDirectories))",
      "        {",
      "            string destination = source.Substring(0, source.Length - \".mbcode\".Length);",
      "            Directory.CreateDirectory(Path.GetDirectoryName(destination));",
      "            File.Copy(source, destination, true);",
      "            File.Delete(source);",
      "        }",
      "",
      "        File.WriteAllText(ActivatedMarker, DateTime.UtcNow.ToString(\"O\"));",
      "        Debug.Log(\"MonoBuilder: dependencies ready. Generated C# activated.\");",
      "        AssetDatabase.Refresh();",
      "    }",
      "}",
      "#endif"
    ].join("\n");
  }

  function readmeText(template, deps, includeCore) {
    const es = lang();
    const lines = [
      "# MonoBuilder · " + template.name,
      "",
      es ? "Este ZIP es autocontenido para las dependencias del Core que vinculaste localmente." : "This ZIP is self-contained for the Core source you linked locally.",
      "",
      "## " + (es ? "Uso" : "Usage"),
      "",
      es ? "1. Extrae/copía la carpeta Assets dentro de tu proyecto Unity." : "1. Extract/copy the Assets folder into your Unity project.",
      es ? "2. El bootstrap de MonoBuilder instala automáticamente los paquetes UPM faltantes." : "2. MonoBuilder's bootstrap automatically installs missing UPM packages.",
      includeCore
        ? (es ? "3. Si Game Creator Core no existe en el proyecto, se extrae desde el Core que vinculaste al navegador." : "3. If Game Creator Core is absent, it is extracted from the Core source linked in your browser.")
        : "",
      es ? "4. Los scripts generados permanecen inactivos hasta que sus dependencias estén listas y luego se activan automáticamente." : "4. Generated scripts stay inactive until dependencies are ready, then activate automatically.",
      "",
      "## " + (es ? "Dependencias" : "Dependencies"),
      ""
    ];

    deps.forEach(function (dep) {
      let suffix = dep.package ? " · " + dep.package : "";
      if (dep.id === "game-creator-core" && includeCore) suffix += es ? " · incluido en este ZIP" : " · embedded in this ZIP";
      lines.push("- " + dep.name + suffix);
    });

    lines.push(
      "",
      es
        ? "El Core original no se sube ni se guarda en el repositorio de MonoBuilder. Solo se incorpora al ZIP que generas localmente desde tu navegador."
        : "The original Core source is not uploaded to or stored in the MonoBuilder repository. It is only embedded into the ZIP generated locally in your browser."
    );

    return lines.filter(Boolean).join("\n") + "\n";
  }

  function crcTable() {
    const table = new Uint32Array(256);
    for (let n = 0; n < 256; n++) {
      let c = n;
      for (let k = 0; k < 8; k++) c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1);
      table[n] = c >>> 0;
    }
    return table;
  }

  const CRC_TABLE = crcTable();

  function crc32(bytes) {
    let c = 0xffffffff;
    for (let i = 0; i < bytes.length; i++) c = CRC_TABLE[(c ^ bytes[i]) & 0xff] ^ (c >>> 8);
    return (c ^ 0xffffffff) >>> 0;
  }

  function u16(n) {
    return new Uint8Array([n & 255, (n >>> 8) & 255]);
  }

  function u32(n) {
    return new Uint8Array([n & 255, (n >>> 8) & 255, (n >>> 16) & 255, (n >>> 24) & 255]);
  }

  function joinBytes(parts) {
    const total = parts.reduce(function (sum, part) { return sum + part.length; }, 0);
    const out = new Uint8Array(total);
    let offset = 0;
    parts.forEach(function (part) {
      out.set(part, offset);
      offset += part.length;
    });
    return out;
  }

  function asBytes(value, encoder) {
    if (typeof value === "string") return encoder.encode(value);
    if (value instanceof Uint8Array) return value;
    if (value instanceof ArrayBuffer) return new Uint8Array(value);
    if (ArrayBuffer.isView(value)) return new Uint8Array(value.buffer, value.byteOffset, value.byteLength);
    throw new TypeError("Unsupported ZIP value");
  }

  function buildZipBinary(fileMap) {
    const enc = new TextEncoder();
    const localParts = [];
    const centralParts = [];
    let offset = 0;

    Object.entries(fileMap).forEach(function (entry) {
      const nameBytes = enc.encode(entry[0].replace(/\\/g, "/"));
      const data = asBytes(entry[1], enc);
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

  async function exportSelfContainedBundle() {
    const template = currentTemplate();
    const code = generateCode();
    const coreNeeded = needsCore(template, code);

    await ensureCoreRecord();

    if (coreNeeded && !coreRecord) {
      exportAfterLink = true;
      toast(lang() === "es" ? "Selecciona tu ZIP del Core una sola vez" : "Select your Core ZIP once");
      elsVault.input.click();
      return;
    }

    const deps = await resolveBundleDependencies(template, code);
    const selections = pinnedCoreSelections();
    const bundleId = safeIdentifier(template.className || template.name);
    const bundleRoot = "Assets/MonoBuilder/Bundles/" + bundleId + "/";
    const files = {};
    const bootstrapNeeded = deps.some(function (dep) { return dep.type !== "builtin"; });

    if (bootstrapNeeded) {
      files[bundleRoot + "Payload/Generated/" + template.className + ".cs.mbcode"] = code;
      if (template.id === "gc2-character-core") {
        files[bundleRoot + "Payload/Editor/MonoBuilderCreateCharacter.cs.mbcode"] = characterEditorCodeVault();
      }
      if (selections.menus.length) {
        files[bundleRoot + "Payload/Editor/MonoBuilderPinnedGameCreatorMenus.cs.mbcode"] =
          gameCreatorMenuHelperCode(selections.menus);
      }
      files[bundleRoot + "Editor/MonoBuilderBundleBootstrap_" + bundleId + ".cs"] =
        makeBootstrap(deps, bundleId, coreNeeded && !!coreRecord);
    } else {
      files[bundleRoot + "Generated/" + template.className + ".cs"] = code;
      if (selections.menus.length) {
        files[bundleRoot + "Editor/MonoBuilderPinnedGameCreatorMenus.cs"] =
          gameCreatorMenuHelperCode(selections.menus);
      }
    }

    if (coreNeeded && coreRecord && coreRecord.bytes) {
      files["Assets/MonoBuilder/CoreSource/GameCreator2_CSharp_Source.zip.bytes"] = coreRecord.bytes;
    }

    files[bundleRoot + "MonoBuilder.dependencies.json"] = JSON.stringify({
      schema: 3,
      template: template.id,
      className: template.className,
      generatedAt: new Date().toISOString(),
      coreEmbedded: coreNeeded && !!coreRecord,
      coreSource: coreNeeded && coreRecord ? {
        name: coreRecord.name,
        bytes: coreRecord.size,
        files: coreRecord.fileCount,
        runtimeScripts: coreRecord.runtimeCount,
        editorScripts: coreRecord.editorCount
      } : null,
      dependencies: deps.map(function (dep) {
        return {
          id: dep.id,
          name: dep.name,
          type: dep.type,
          package: dep.package || null
        };
      }),
      gameCreatorSelections: {
        menuItems: selections.menus,
        types: selections.types
      }
    }, null, 2);

    files["README.md"] = readmeText(template, deps, coreNeeded && !!coreRecord);

    const zip = buildZipBinary(files);
    const url = URL.createObjectURL(zip);
    const a = document.createElement("a");
    a.href = url;
    a.download = bundleId + "_MonoBuilder_SelfContained.zip";
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(function () { URL.revokeObjectURL(url); }, 1500);
    toast(lang() === "es" ? "Paquete autocontenido exportado" : "Self-contained bundle exported");
  }

  async function initVault() {
    await ensureCoreRecord();

    if (elsVault.link) {
      elsVault.link.addEventListener("click", function () {
        exportAfterLink = false;
        elsVault.input.click();
      });
    }

    if (elsVault.input) {
      elsVault.input.addEventListener("change", async function () {
        const file = elsVault.input.files && elsVault.input.files[0];
        elsVault.input.value = "";
        if (!file) {
          exportAfterLink = false;
          return;
        }

        try {
          const shouldExport = exportAfterLink;
          exportAfterLink = false;
          await linkCoreFile(file);
          if (shouldExport) await exportSelfContainedBundle();
        } catch (error) {
          console.error(error);
          toast(lang() === "es" ? "Ese ZIP no corresponde al Core esperado" : "That ZIP does not match the expected Core");
        }
      });
    }

    if (elsVault.forget) {
      elsVault.forget.addEventListener("click", async function () {
        await vaultDelete();
        coreRecord = null;
        renderVault();
        toast(lang() === "es" ? "Core olvidado de este navegador" : "Core removed from this browser");
      });
    }

    const languageButton = document.getElementById("languageBtn");
    if (languageButton) languageButton.addEventListener("click", function () { setTimeout(renderVault, 0); });

    const dependencyBadges = document.getElementById("dependencyBadges");
    if (dependencyBadges && "MutationObserver" in window) {
      // Watch only direct badge insert/remove operations. Observing the subtree caused
      // decorateDependencyBadge() to retrigger itself whenever it changed badge text.
      new MutationObserver(function () {
        decorateDependencyBadge();
      }).observe(dependencyBadges, { childList: true });
    }

    const oldButton = document.getElementById("downloadBundleBtn");
    if (oldButton) {
      const replacement = oldButton.cloneNode(true);
      oldButton.parentNode.replaceChild(replacement, oldButton);
      replacement.addEventListener("click", exportSelfContainedBundle);
    }

    renderVault();
  }

  initVault().catch(function (error) {
    console.error("MonoBuilder Core Vault init:", error);
  });
})();