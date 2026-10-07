const storageKey = "monobuilder-custom-templates-v1";

const builtins = [
  {
    id: "player-movement",
    name: "Player Movement",
    className: "PlayerMovement",
    category: "Character",
    icon: "PM",
    description: "CharacterController movement using Unity Input System, camera-relative motion, gravity and jump.",
    features: ["InputActionReference for move and jump", "Optional camera-relative movement", "CharacterController based", "Configurable speed, jump and gravity"],
    setup: ["Add a CharacterController to the Player GameObject.", "Create Move (Vector2) and Jump actions in an Input Actions asset.", "Assign the action references in the generated component.", "Optionally assign the active camera Transform for camera-relative movement."],
    fields: [
      { key: "controller", label: "Controller", type: "CharacterController", default: "Player", help: "CharacterController on the moving object." },
      { key: "moveAction", label: "Move Input", type: "InputActionReference", default: "Player/Move", help: "Vector2 input action, normally WASD / left stick." },
      { key: "jumpAction", label: "Jump Input", type: "InputActionReference", default: "Player/Jump", help: "Button action used to jump." },
      { key: "cameraTransform", label: "Camera", type: "Transform", default: "Main Camera", help: "Optional. Makes movement relative to camera direction." },
      { key: "speed", label: "Move Speed", type: "range", min: 0, max: 20, step: 0.1, default: 5 },
      { key: "jumpHeight", label: "Jump Height", type: "range", min: 0, max: 8, step: 0.1, default: 1.5 },
      { key: "gravity", label: "Gravity", type: "float", default: -20 }
    ]
  },
  {
    id: "health",
    name: "Health",
    className: "Health",
    category: "Character",
    icon: "HP",
    description: "Reusable health component with damage, healing, death callback and optional destruction.",
    features: ["Damage and heal methods", "UnityEvent on death", "Clamp between 0 and max health", "Optional destroy on death"],
    setup: ["Add the generated Health component to any GameObject.", "Set Max Health and Starting Health.", "Call TakeDamage(amount) from weapons, hazards or enemies.", "Optionally connect On Death in the Inspector."],
    fields: [
      { key: "maxHealth", label: "Max Health", type: "int", default: 100 },
      { key: "startingHealth", label: "Starting Health", type: "int", default: 100 },
      { key: "destroyOnDeath", label: "Destroy On Death", type: "bool", default: false },
      { key: "destroyDelay", label: "Destroy Delay", type: "range", min: 0, max: 10, step: 0.1, default: 0 }
    ]
  },
  {
    id: "camera-follow",
    name: "Camera Follow",
    className: "CameraFollow",
    category: "Camera",
    icon: "CF",
    description: "Smooth camera follower with an editable offset and optional look-at behavior.",
    features: ["SmoothDamp follow", "World-space offset", "LateUpdate camera motion", "Optional LookAt"],
    setup: ["Add the generated component to the Camera.", "Assign the target Transform, usually the Player.", "Tune offset and smoothing.", "Enable Look At Target if the camera should always face the target."],
    fields: [
      { key: "target", label: "Target", type: "Transform", default: "Player" },
      { key: "offset", label: "Offset", type: "Vector3", default: "0, 3, -6" },
      { key: "smoothTime", label: "Smooth Time", type: "range", min: 0.01, max: 2, step: 0.01, default: 0.2 },
      { key: "lookAtTarget", label: "Look At Target", type: "bool", default: true }
    ]
  },
  {
    id: "tmp-counter",
    name: "TMP Counter",
    className: "TMPCounter",
    category: "UI",
    icon: "T",
    description: "Controls a TextMeshPro label from a numeric value without writing UI code.",
    features: ["TMP_Text reference", "Prefix and suffix", "Set and Add methods", "Automatic refresh"],
    setup: ["Create a TextMeshProUGUI object in the Canvas.", "Assign its TMP_Text reference.", "Set an optional prefix or suffix.", "Call SetValue or AddValue from other gameplay components."],
    fields: [
      { key: "targetText", label: "Text", type: "TMP_Text", default: "ScoreText" },
      { key: "prefix", label: "Prefix", type: "string", default: "Score: " },
      { key: "suffix", label: "Suffix", type: "string", default: "" },
      { key: "startingValue", label: "Starting Value", type: "int", default: 0 }
    ]
  },
  {
    id: "trigger-message",
    name: "Trigger Message",
    className: "TriggerMessage",
    category: "Interaction",
    icon: "TM",
    description: "Shows a TextMeshPro message while an object with the chosen tag remains inside a trigger.",
    features: ["OnTriggerEnter / Exit", "TMP_Text output", "Tag filtering", "Editable message"],
    setup: ["Set a Collider to Is Trigger on the interaction area.", "Assign the TMP text used for the prompt.", "Ensure the entering object uses the required tag.", "Place this component on the trigger object."],
    fields: [
      { key: "messageText", label: "Message Text", type: "TMP_Text", default: "InteractionText" },
      { key: "message", label: "Message", type: "textarea", default: "Press E to interact" },
      { key: "requiredTag", label: "Required Tag", type: "string", default: "Player" },
      { key: "clearOnExit", label: "Clear On Exit", type: "bool", default: true }
    ]
  },
  {
    id: "door",
    name: "Input Door",
    className: "InputDoor",
    category: "Interaction",
    icon: "DR",
    description: "Simple proximity door controlled through an InputActionReference and a smooth hinge rotation.",
    features: ["Unity Input System", "Trigger proximity check", "Smooth open / close rotation", "Configurable open angle"],
    setup: ["Put a trigger Collider on the same object.", "Assign the Player tag to your player.", "Assign an Interact InputActionReference.", "Assign the Transform that should rotate as the door hinge."],
    fields: [
      { key: "door", label: "Door Transform", type: "Transform", default: "Door" },
      { key: "interactAction", label: "Interact Input", type: "InputActionReference", default: "Player/Interact" },
      { key: "playerTag", label: "Player Tag", type: "string", default: "Player" },
      { key: "openAngle", label: "Open Angle", type: "range", min: -180, max: 180, step: 1, default: 90 },
      { key: "openSpeed", label: "Open Speed", type: "range", min: 0.1, max: 15, step: 0.1, default: 5 }
    ]
  },
  {
    id: "pickup",
    name: "Pickup",
    className: "Pickup",
    category: "Interaction",
    icon: "PK",
    description: "Generic trigger pickup that invokes a UnityEvent and optionally hides or destroys itself.",
    features: ["Tag filtering", "UnityEvent callback", "Hide or destroy mode", "Reusable for coins, keys and powerups"],
    setup: ["Set a Collider to Is Trigger.", "Assign the Player tag or change Required Tag.", "Connect On Picked to the behavior you want.", "Choose whether the object is hidden or destroyed after pickup."],
    fields: [
      { key: "requiredTag", label: "Required Tag", type: "string", default: "Player" },
      { key: "disableOnPickup", label: "Disable On Pickup", type: "bool", default: true },
      { key: "destroyOnPickup", label: "Destroy On Pickup", type: "bool", default: false }
    ]
  },
  {
    id: "rotator",
    name: "Object Rotator",
    className: "ObjectRotator",
    category: "Objects",
    icon: "OR",
    description: "Continuously rotates a GameObject on a configurable axis and speed.",
    features: ["Local or world rotation", "Vector3 axis", "DeltaTime based", "Useful for pickups and displays"],
    setup: ["Add the generated component to the object you want to rotate.", "Choose an axis such as 0, 1, 0 for Y.", "Set rotation speed.", "Choose Local Space if the object should rotate around its own axes."],
    fields: [
      { key: "axis", label: "Axis", type: "Vector3", default: "0, 1, 0" },
      { key: "degreesPerSecond", label: "Degrees / Second", type: "range", min: -360, max: 360, step: 1, default: 90 },
      { key: "localSpace", label: "Local Space", type: "bool", default: true }
    ]
  }
];

const els = {
  libraryList: document.getElementById("libraryList"),
  librarySearch: document.getElementById("librarySearch"),
  categoryChips: document.getElementById("categoryChips"),
  builderTitle: document.getElementById("builderTitle"),
  componentDescription: document.getElementById("componentDescription"),
  featureList: document.getElementById("featureList"),
  propertyForm: document.getElementById("propertyForm"),
  inspectorPreview: document.getElementById("inspectorPreview"),
  generatedCode: document.getElementById("generatedCode"),
  codeFilename: document.getElementById("codeFilename"),
  componentClassBadge: document.getElementById("componentClassBadge"),
  gameObjectName: document.getElementById("gameObjectName"),
  fieldCountBadge: document.getElementById("fieldCountBadge"),
  setupPane: document.getElementById("setupPane"),
  codePane: document.getElementById("codePane"),
  templateDialog: document.getElementById("templateDialog"),
  templateForm: document.getElementById("templateForm"),
  customFields: document.getElementById("customFields"),
  toast: document.getElementById("toast")
};

let customTemplates = loadCustomTemplates();
let templates = builtins.concat(customTemplates);
let selectedId = localStorage.getItem("monobuilder-selected") || "player-movement";
let selectedCategory = "All";
let values = {};
let toastTimer = null;

function loadCustomTemplates() {
  try {
    const raw = JSON.parse(localStorage.getItem(storageKey) || "[]");
    return Array.isArray(raw) ? raw : [];
  } catch (_) {
    return [];
  }
}

function saveCustomTemplates() {
  localStorage.setItem(storageKey, JSON.stringify(customTemplates));
}

function currentTemplate() {
  return templates.find(function (template) { return template.id === selectedId; }) || templates[0];
}

function defaultValues(template) {
  const next = {};
  template.fields.forEach(function (field) { next[field.key] = field.default; });
  return next;
}

function safeClassName(input) {
  const clean = String(input || "NewComponent").replace(/[^a-zA-Z0-9_]/g, "");
  if (!clean) return "NewComponent";
  return /^[0-9]/.test(clean) ? "Component" + clean : clean;
}

function variableName(input) {
  const parts = String(input || "value").replace(/[^a-zA-Z0-9 ]/g, " ").trim().split(/\s+/);
  if (!parts.length) return "value";
  const raw = parts[0].toLowerCase() + parts.slice(1).map(function (part) {
    return part.charAt(0).toUpperCase() + part.slice(1);
  }).join("");
  return /^[0-9]/.test(raw) ? "value" + raw : raw;
}

function escapeCs(value) {
  return String(value == null ? "" : value).replace(/\\/g, "\\\\").replace(/"/g, '\\"').replace(/\r?\n/g, "\\n");
}

function parseVector(value, count) {
  const numbers = String(value || "").split(",").map(function (v) { return Number(v.trim()); });
  while (numbers.length < count) numbers.push(0);
  return numbers.slice(0, count).map(function (n) { return Number.isFinite(n) ? n : 0; });
}

function csLiteral(field, value) {
  const type = field.type;
  if (type === "string" || type === "textarea") return '"' + escapeCs(value) + '"';
  if (type === "bool") return value ? "true" : "false";
  if (type === "int") return String(parseInt(value, 10) || 0);
  if (type === "float" || type === "range") {
    const n = Number(value);
    return (Number.isFinite(n) ? n : 0) + "f";
  }
  if (type === "Vector2") {
    const v = parseVector(value, 2);
    return "new Vector2(" + v[0] + "f, " + v[1] + "f)";
  }
  if (type === "Vector3") {
    const v = parseVector(value, 3);
    return "new Vector3(" + v[0] + "f, " + v[1] + "f, " + v[2] + "f)";
  }
  if (type === "Color") return "Color.white";
  return "null";
}

function renderCategories() {
  const categories = ["All"].concat(Array.from(new Set(templates.map(function (t) { return t.category; }))).sort());
  els.categoryChips.innerHTML = "";
  categories.forEach(function (category) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "category-chip" + (selectedCategory === category ? " active" : "");
    btn.textContent = category;
    btn.addEventListener("click", function () {
      selectedCategory = category;
      renderCategories();
      renderLibrary();
    });
    els.categoryChips.appendChild(btn);
  });
}

function renderLibrary() {
  const query = els.librarySearch.value.trim().toLowerCase();
  const list = templates.filter(function (template) {
    const matchesCategory = selectedCategory === "All" || template.category === selectedCategory;
    const haystack = (template.name + " " + template.description + " " + template.category).toLowerCase();
    return matchesCategory && (!query || haystack.indexOf(query) !== -1);
  });

  els.libraryList.innerHTML = "";
  list.forEach(function (template) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "library-item" + (template.id === selectedId ? " active" : "");
    const custom = template.custom ? '<span class="custom-tag">CUSTOM</span>' : "";
    button.innerHTML =
      '<span class="library-icon">' + template.icon + '</span>' +
      '<span><strong>' + template.name + '</strong><small>' + template.description + '</small>' +
      '<span class="library-meta"><span class="library-tag">' + template.category + '</span>' + custom + '</span></span>';
    button.addEventListener("click", function () { selectTemplate(template.id); });
    els.libraryList.appendChild(button);
  });

  if (!list.length) {
    els.libraryList.innerHTML = '<div class="inspector-note">No components match this search.</div>';
  }
}

function selectTemplate(id) {
  selectedId = id;
  localStorage.setItem("monobuilder-selected", id);
  const template = currentTemplate();
  values = defaultValues(template);
  renderAll();
}

function renderAll() {
  const template = currentTemplate();
  els.builderTitle.textContent = template.name;
  els.componentDescription.textContent = template.description;
  els.componentClassBadge.textContent = template.className;
  els.codeFilename.textContent = template.className + ".cs";
  els.fieldCountBadge.textContent = template.fields.length + (template.fields.length === 1 ? " field" : " fields");

  els.featureList.innerHTML = "";
  (template.features || ["Editable Inspector fields", "Clean generated MonoBehaviour", "Saved as a reusable library template"]).forEach(function (feature) {
    const row = document.createElement("div");
    row.className = "feature-row";
    row.innerHTML = '<span class="feature-check">✓</span><span>' + feature + '</span>';
    els.featureList.appendChild(row);
  });

  renderLibrary();
  renderProperties();
  renderPreview();
  renderCode();
  renderSetup();
}

function fieldTypeLabel(field) {
  if (field.type === "range") return "float";
  if (field.type === "textarea") return "string";
  return field.type;
}

function isReferenceType(type) {
  return ["GameObject", "Transform", "Rigidbody", "CharacterController", "Animator", "AudioSource", "TMP_Text", "Button", "Slider", "InputActionReference"].indexOf(type) !== -1;
}

function renderProperties() {
  const template = currentTemplate();
  els.propertyForm.innerHTML = "";

  template.fields.forEach(function (field) {
    const group = document.createElement("div");
    group.className = "property-group";

    const label = document.createElement("label");
    label.innerHTML = '<span>' + field.label + '</span><span class="type-chip">' + fieldTypeLabel(field) + '</span>';
    group.appendChild(label);

    let control;
    if (field.type === "bool") {
      control = document.createElement("div");
      control.className = "check-control";
      const input = document.createElement("input");
      input.type = "checkbox";
      input.checked = Boolean(values[field.key]);
      const caption = document.createElement("span");
      caption.textContent = input.checked ? "Enabled" : "Disabled";
      input.addEventListener("change", function () {
        values[field.key] = input.checked;
        caption.textContent = input.checked ? "Enabled" : "Disabled";
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
    } else {
      control = field.type === "textarea" ? document.createElement("textarea") : document.createElement("input");
      if (control.tagName === "INPUT") {
        control.type = field.type === "int" || field.type === "float" ? "number" : "text";
        if (field.type === "float") control.step = "0.1";
      }
      control.value = values[field.key] == null ? "" : values[field.key];
      if (isReferenceType(field.type)) control.placeholder = "Scene reference / asset";
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
}

function previewValue(field, value) {
  if (field.type === "bool") {
    return '<div class="unity-toggle' + (value ? " checked" : "") + '"></div>';
  }
  if (isReferenceType(field.type)) return value ? value + " (" + field.type + ")" : "None (" + field.type + ")";
  if (field.type === "string" || field.type === "textarea") return value || "";
  return String(value);
}

function renderPreview() {
  const template = currentTemplate();
  let body = "";
  template.fields.forEach(function (field) {
    body += '<div class="unity-row"><label>' + field.label + '</label><div class="unity-field">' + previewValue(field, values[field.key]) + '</div></div>';
  });
  els.inspectorPreview.innerHTML =
    '<div class="unity-component-header"><span class="unity-script-icon">C#</span><span>' + template.className + ' (Script)</span></div>' +
    '<div class="unity-body">' + body + '</div>';
}

function usingLines(template) {
  const types = template.fields.map(function (f) { return f.type; });
  const lines = ["using UnityEngine;"];
  if (types.indexOf("TMP_Text") !== -1) lines.push("using TMPro;");
  if (types.indexOf("InputActionReference") !== -1) lines.push("using UnityEngine.InputSystem;");
  if (types.indexOf("Button") !== -1 || types.indexOf("Slider") !== -1) lines.push("using UnityEngine.UI;");
  if (template.id === "health" || template.id === "pickup") lines.push("using UnityEngine.Events;");
  return lines.join("\n");
}

function genericCode(template) {
  const fields = template.fields.map(function (field) {
    const type = fieldTypeLabel(field);
    let prefix = "    [SerializeField] private ";
    let init = "";
    if (!isReferenceType(type) && type !== "Color") init = " = " + csLiteral(field, values[field.key]);
    return prefix + type + " " + field.key + init + ";";
  }).join("\n");

  return usingLines(template) + "\n\npublic class " + template.className + " : MonoBehaviour\n{\n" +
    fields + "\n\n    // Add gameplay behavior here, or keep this component as a data/configuration holder.\n}\n";
}

function builtInCode(template) {
  const v = values;
  if (template.id === "player-movement") {
    return 'using UnityEngine;\nusing UnityEngine.InputSystem;\n\n[RequireComponent(typeof(CharacterController))]\npublic class PlayerMovement : MonoBehaviour\n{\n' +
      '    [SerializeField] private CharacterController controller;\n' +
      '    [SerializeField] private InputActionReference moveAction;\n' +
      '    [SerializeField] private InputActionReference jumpAction;\n' +
      '    [SerializeField] private Transform cameraTransform;\n' +
      '    [SerializeField] private float speed = ' + Number(v.speed) + 'f;\n' +
      '    [SerializeField] private float jumpHeight = ' + Number(v.jumpHeight) + 'f;\n' +
      '    [SerializeField] private float gravity = ' + Number(v.gravity) + 'f;\n\n' +
      '    private float verticalVelocity;\n\n' +
      '    private void Reset()\n    {\n        controller = GetComponent<CharacterController>();\n    }\n\n' +
      '    private void OnEnable()\n    {\n        moveAction.action.Enable();\n        jumpAction.action.Enable();\n    }\n\n' +
      '    private void OnDisable()\n    {\n        moveAction.action.Disable();\n        jumpAction.action.Disable();\n    }\n\n' +
      '    private void Update()\n    {\n' +
      '        Vector2 input = moveAction.action.ReadValue<Vector2>();\n' +
      '        Vector3 forward = cameraTransform ? cameraTransform.forward : transform.forward;\n' +
      '        Vector3 right = cameraTransform ? cameraTransform.right : transform.right;\n' +
      '        forward.y = 0f;\n        right.y = 0f;\n        forward.Normalize();\n        right.Normalize();\n\n' +
      '        Vector3 movement = (forward * input.y + right * input.x);\n' +
      '        if (movement.sqrMagnitude > 1f) movement.Normalize();\n\n' +
      '        if (controller.isGrounded && verticalVelocity < 0f) verticalVelocity = -2f;\n' +
      '        if (controller.isGrounded && jumpAction.action.WasPressedThisFrame())\n' +
      '            verticalVelocity = Mathf.Sqrt(jumpHeight * -2f * gravity);\n\n' +
      '        verticalVelocity += gravity * Time.deltaTime;\n' +
      '        movement.y = verticalVelocity;\n' +
      '        controller.Move(movement * speed * Time.deltaTime);\n' +
      '    }\n}\n';
  }

  if (template.id === "health") {
    return 'using UnityEngine;\nusing UnityEngine.Events;\n\npublic class Health : MonoBehaviour\n{\n' +
      '    [SerializeField] private int maxHealth = ' + parseInt(v.maxHealth, 10) + ';\n' +
      '    [SerializeField] private int startingHealth = ' + parseInt(v.startingHealth, 10) + ';\n' +
      '    [SerializeField] private bool destroyOnDeath = ' + (v.destroyOnDeath ? "true" : "false") + ';\n' +
      '    [SerializeField] private float destroyDelay = ' + Number(v.destroyDelay) + 'f;\n' +
      '    [SerializeField] private UnityEvent onDeath;\n\n' +
      '    public int CurrentHealth { get; private set; }\n    public int MaxHealth => maxHealth;\n\n' +
      '    private void Awake()\n    {\n        CurrentHealth = Mathf.Clamp(startingHealth, 0, maxHealth);\n    }\n\n' +
      '    public void TakeDamage(int amount)\n    {\n        if (amount <= 0 || CurrentHealth <= 0) return;\n        CurrentHealth = Mathf.Max(0, CurrentHealth - amount);\n        if (CurrentHealth == 0) Die();\n    }\n\n' +
      '    public void Heal(int amount)\n    {\n        if (amount <= 0 || CurrentHealth <= 0) return;\n        CurrentHealth = Mathf.Min(maxHealth, CurrentHealth + amount);\n    }\n\n' +
      '    private void Die()\n    {\n        onDeath?.Invoke();\n        if (destroyOnDeath) Destroy(gameObject, destroyDelay);\n    }\n}\n';
  }

  if (template.id === "camera-follow") {
    const off = parseVector(v.offset, 3);
    return 'using UnityEngine;\n\npublic class CameraFollow : MonoBehaviour\n{\n' +
      '    [SerializeField] private Transform target;\n' +
      '    [SerializeField] private Vector3 offset = new Vector3(' + off[0] + 'f, ' + off[1] + 'f, ' + off[2] + 'f);\n' +
      '    [SerializeField] private float smoothTime = ' + Number(v.smoothTime) + 'f;\n' +
      '    [SerializeField] private bool lookAtTarget = ' + (v.lookAtTarget ? "true" : "false") + ';\n\n' +
      '    private Vector3 velocity;\n\n' +
      '    private void LateUpdate()\n    {\n        if (!target) return;\n        Vector3 desired = target.position + offset;\n        transform.position = Vector3.SmoothDamp(transform.position, desired, ref velocity, smoothTime);\n        if (lookAtTarget) transform.LookAt(target);\n    }\n}\n';
  }

  if (template.id === "tmp-counter") {
    return 'using UnityEngine;\nusing TMPro;\n\npublic class TMPCounter : MonoBehaviour\n{\n' +
      '    [SerializeField] private TMP_Text targetText;\n' +
      '    [SerializeField] private string prefix = "' + escapeCs(v.prefix) + '";\n' +
      '    [SerializeField] private string suffix = "' + escapeCs(v.suffix) + '";\n' +
      '    [SerializeField] private int startingValue = ' + parseInt(v.startingValue, 10) + ';\n\n' +
      '    public int Value { get; private set; }\n\n' +
      '    private void Awake()\n    {\n        Value = startingValue;\n        Refresh();\n    }\n\n' +
      '    public void SetValue(int value)\n    {\n        Value = value;\n        Refresh();\n    }\n\n' +
      '    public void AddValue(int amount)\n    {\n        Value += amount;\n        Refresh();\n    }\n\n' +
      '    private void Refresh()\n    {\n        if (targetText) targetText.text = prefix + Value + suffix;\n    }\n}\n';
  }

  if (template.id === "trigger-message") {
    return 'using UnityEngine;\nusing TMPro;\n\npublic class TriggerMessage : MonoBehaviour\n{\n' +
      '    [SerializeField] private TMP_Text messageText;\n' +
      '    [SerializeField, TextArea] private string message = "' + escapeCs(v.message) + '";\n' +
      '    [SerializeField] private string requiredTag = "' + escapeCs(v.requiredTag) + '";\n' +
      '    [SerializeField] private bool clearOnExit = ' + (v.clearOnExit ? "true" : "false") + ';\n\n' +
      '    private void OnTriggerEnter(Collider other)\n    {\n        if (other.CompareTag(requiredTag) && messageText) messageText.text = message;\n    }\n\n' +
      '    private void OnTriggerExit(Collider other)\n    {\n        if (clearOnExit && other.CompareTag(requiredTag) && messageText) messageText.text = string.Empty;\n    }\n}\n';
  }

  if (template.id === "door") {
    return 'using UnityEngine;\nusing UnityEngine.InputSystem;\n\npublic class InputDoor : MonoBehaviour\n{\n' +
      '    [SerializeField] private Transform door;\n' +
      '    [SerializeField] private InputActionReference interactAction;\n' +
      '    [SerializeField] private string playerTag = "' + escapeCs(v.playerTag) + '";\n' +
      '    [SerializeField] private float openAngle = ' + Number(v.openAngle) + 'f;\n' +
      '    [SerializeField] private float openSpeed = ' + Number(v.openSpeed) + 'f;\n\n' +
      '    private bool playerInside;\n    private bool open;\n    private Quaternion closedRotation;\n    private Quaternion openRotation;\n\n' +
      '    private void Awake()\n    {\n        if (!door) door = transform;\n        closedRotation = door.localRotation;\n        openRotation = closedRotation * Quaternion.Euler(0f, openAngle, 0f);\n    }\n\n' +
      '    private void OnEnable()\n    {\n        interactAction.action.Enable();\n    }\n\n' +
      '    private void OnDisable()\n    {\n        interactAction.action.Disable();\n    }\n\n' +
      '    private void Update()\n    {\n        if (playerInside && interactAction.action.WasPressedThisFrame()) open = !open;\n        Quaternion target = open ? openRotation : closedRotation;\n        door.localRotation = Quaternion.Slerp(door.localRotation, target, Time.deltaTime * openSpeed);\n    }\n\n' +
      '    private void OnTriggerEnter(Collider other)\n    {\n        if (other.CompareTag(playerTag)) playerInside = true;\n    }\n\n' +
      '    private void OnTriggerExit(Collider other)\n    {\n        if (other.CompareTag(playerTag)) playerInside = false;\n    }\n}\n';
  }

  if (template.id === "pickup") {
    return 'using UnityEngine;\nusing UnityEngine.Events;\n\npublic class Pickup : MonoBehaviour\n{\n' +
      '    [SerializeField] private string requiredTag = "' + escapeCs(v.requiredTag) + '";\n' +
      '    [SerializeField] private bool disableOnPickup = ' + (v.disableOnPickup ? "true" : "false") + ';\n' +
      '    [SerializeField] private bool destroyOnPickup = ' + (v.destroyOnPickup ? "true" : "false") + ';\n' +
      '    [SerializeField] private UnityEvent onPicked;\n\n' +
      '    private bool picked;\n\n' +
      '    private void OnTriggerEnter(Collider other)\n    {\n        if (picked || !other.CompareTag(requiredTag)) return;\n        picked = true;\n        onPicked?.Invoke();\n\n' +
      '        if (destroyOnPickup) Destroy(gameObject);\n        else if (disableOnPickup) gameObject.SetActive(false);\n    }\n}\n';
  }

  if (template.id === "rotator") {
    const axis = parseVector(v.axis, 3);
    return 'using UnityEngine;\n\npublic class ObjectRotator : MonoBehaviour\n{\n' +
      '    [SerializeField] private Vector3 axis = new Vector3(' + axis[0] + 'f, ' + axis[1] + 'f, ' + axis[2] + 'f);\n' +
      '    [SerializeField] private float degreesPerSecond = ' + Number(v.degreesPerSecond) + 'f;\n' +
      '    [SerializeField] private bool localSpace = ' + (v.localSpace ? "true" : "false") + ';\n\n' +
      '    private void Update()\n    {\n        Space space = localSpace ? Space.Self : Space.World;\n        transform.Rotate(axis.normalized, degreesPerSecond * Time.deltaTime, space);\n    }\n}\n';
  }

  return genericCode(template);
}

function generateCode() {
  const template = currentTemplate();
  return template.custom ? genericCode(template) : builtInCode(template);
}

function renderCode() {
  els.generatedCode.textContent = generateCode();
}

function renderSetup() {
  const template = currentTemplate();
  const steps = template.setup || [
    "Export the generated " + template.className + ".cs file.",
    "Place it inside Assets/Scripts in your Unity project.",
    "Add " + template.className + " to the intended GameObject.",
    "Assign the exposed Inspector references and test in Play Mode."
  ];
  els.setupPane.innerHTML = steps.map(function (step, index) {
    return '<div class="setup-step"><span>' + String(index + 1).padStart(2, "0") + '</span><div>' + step + '</div></div>';
  }).join("");
}

function updateOutputs() {
  renderPreview();
  renderCode();
}

function toast(message) {
  clearTimeout(toastTimer);
  els.toast.textContent = message;
  els.toast.classList.add("show");
  toastTimer = setTimeout(function () { els.toast.classList.remove("show"); }, 1800);
}

async function copyCode() {
  try {
    await navigator.clipboard.writeText(generateCode());
    toast("C# copied");
  } catch (_) {
    toast("Clipboard unavailable");
  }
}

function downloadCode() {
  const template = currentTemplate();

  if (window.MonoBuilderBundle && typeof window.MonoBuilderBundle.download === "function") {
    window.MonoBuilderBundle.download(template, generateCode());
    return;
  }

  const blob = new Blob([generateCode()], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = template.className + ".cs";
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
  toast(template.className + ".cs exported");
}

function addCustomField(data) {
  const fragment = document.getElementById("customFieldTemplate").content.cloneNode(true);
  const row = fragment.querySelector(".custom-field-row");
  if (data) {
    row.querySelector('[data-custom="label"]').value = data.label || "";
    row.querySelector('[data-custom="name"]').value = data.name || "";
    row.querySelector('[data-custom="type"]').value = data.type || "GameObject";
    row.querySelector('[data-custom="default"]').value = data.default == null ? "" : data.default;
  }
  row.querySelector(".remove-field").addEventListener("click", function () { row.remove(); });
  els.customFields.appendChild(fragment);
}

function openTemplateDialog() {
  document.getElementById("templateName").value = "";
  document.getElementById("templateClass").value = "";
  document.getElementById("templateCategory").value = "Custom";
  document.getElementById("templateDescription").value = "";
  els.customFields.innerHTML = "";
  addCustomField({ label: "Target", name: "target", type: "GameObject", default: "" });
  addCustomField({ label: "Enabled", name: "enabled", type: "bool", default: "true" });
  els.templateDialog.showModal();
}

function customDefault(type, value) {
  if (type === "bool") return String(value).toLowerCase() !== "false";
  if (type === "int") return parseInt(value, 10) || 0;
  if (type === "float") return Number(value) || 0;
  return value || "";
}

function saveTemplate(event) {
  event.preventDefault();
  const name = document.getElementById("templateName").value.trim();
  const className = safeClassName(document.getElementById("templateClass").value.trim());
  const category = document.getElementById("templateCategory").value.trim() || "Custom";
  const description = document.getElementById("templateDescription").value.trim() || "Custom editable MonoBehaviour template.";
  if (!name || !className) {
    toast("Name and class are required");
    return;
  }

  const fields = Array.from(els.customFields.querySelectorAll(".custom-field-row")).map(function (row, index) {
    const label = row.querySelector('[data-custom="label"]').value.trim() || "Field " + (index + 1);
    const nameInput = row.querySelector('[data-custom="name"]').value.trim();
    const type = row.querySelector('[data-custom="type"]').value;
    const def = row.querySelector('[data-custom="default"]').value;
    return {
      key: variableName(nameInput || label),
      label: label,
      type: type,
      default: customDefault(type, def)
    };
  });

  const template = {
    id: "custom-" + Date.now(),
    name: name,
    className: className,
    category: category,
    icon: className.substring(0, 2).toUpperCase(),
    description: description,
    features: ["Editable visual fields", "Reusable local library item", "Generates a clean MonoBehaviour shell"],
    fields: fields,
    custom: true
  };

  customTemplates.push(template);
  saveCustomTemplates();
  templates = builtins.concat(customTemplates);
  selectedCategory = "All";
  selectedId = template.id;
  values = defaultValues(template);
  els.templateDialog.close();
  renderCategories();
  renderAll();
  toast("Template saved to your library");
}

document.getElementById("newTemplateBtn").addEventListener("click", openTemplateDialog);
document.getElementById("addFieldBtn").addEventListener("click", function () { addCustomField(); });
document.getElementById("saveTemplateBtn").addEventListener("click", saveTemplate);
document.getElementById("copyCodeBtn").addEventListener("click", copyCode);
document.getElementById("copyCodeInlineBtn").addEventListener("click", copyCode);
document.getElementById("downloadCodeBtn").addEventListener("click", downloadCode);
document.getElementById("resetProjectBtn").addEventListener("click", function () {
  values = defaultValues(currentTemplate());
  els.gameObjectName.value = "Player";
  renderAll();
  toast("Current component reset");
});
els.librarySearch.addEventListener("input", renderLibrary);
els.gameObjectName.addEventListener("input", function () {
  if (!els.gameObjectName.value.trim()) els.gameObjectName.value = "GameObject";
});

document.querySelectorAll(".code-tab").forEach(function (tab) {
  tab.addEventListener("click", function () {
    document.querySelectorAll(".code-tab").forEach(function (t) { t.classList.remove("active"); });
    tab.classList.add("active");
    const showCode = tab.dataset.codeTab === "code";
    els.codePane.classList.toggle("hidden", !showCode);
    els.setupPane.classList.toggle("hidden", showCode);
  });
});

if (!templates.some(function (t) { return t.id === selectedId; })) selectedId = "player-movement";
values = defaultValues(currentTemplate());
renderCategories();
renderAll();
