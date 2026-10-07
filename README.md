# MonoBuilder

MonoBuilder is a browser-based visual builder for Unity `MonoBehaviour` components.

It is aimed at users who do not know C# yet: choose a reusable component, edit friendly Inspector-like fields, preview how the component will look, then export a ready-to-use `.cs` script.

## Current MVP

- Visual component library
- Inspector-style property editor
- Mock Unity Inspector preview
- Live C# generation
- Export and copy generated scripts
- Built-in Unity types such as `GameObject`, `Transform`, `CharacterController`, `TMP_Text`, and `InputActionReference`
- Editable local library: create your own reusable component templates
- Custom templates stored in the browser with `localStorage`
- Responsive interface
- English / Spanish interface toggle
- Animation pack based on LeanTween and DOTween workflows
- Trivia Quiz Manager
- Registration Form POST and Periodic Data Sender templates
- Game Creator 2 Core architecture explorer and Character builder
- Dependency-aware bundle export with a Unity Editor bootstrap installer
- Local Core Source Vault: link the supplied Core ZIP once in the browser and embed it automatically in Core-dependent exports
- Serialized-option index extracted from the supplied Core source
- GitHub Pages deployment workflow

## Included templates

- Player Movement
- Health
- Camera Follow
- TMP Counter
- Trigger Message
- Input Door
- Pickup
- Object Rotator
- UI Spinner
- Infinite Rotation
- Random Levitation
- UI Slide Toggle
- Scale Bounce Intro
- Button Bounce
- UI Rotation Toggle
- Multi Object Rotator
- Trivia Quiz Manager
- Registration Form POST
- Periodic Data Sender
- Game Creator Character Core

## Game Creator Core integration

The supplied Game Creator 2 Core C# source was analyzed as architecture input for MonoBuilder:

- 2,803 source files scanned
- 2,199 Runtime C# scripts
- 489 Editor C# scripts
- 1,400+ runtime-relevant types exposed through Core Explorer
- 1,078 types with detected serialized options
- 1,985 serialized fields indexed for visual inspection
- Modules indexed: Cameras, Characters, Common, Variables, and Visual Scripting

The **Game Creator Character Core** template exposes the main Character kernel choices (Player, Motion, Driver, Rotation, Animation), locomotion/gravity/jump/dash values, Footsteps, Ragdoll, and optional IK rigs.

The public repository intentionally stores only generated integration code and compact architectural metadata. It does **not** redistribute the original Game Creator source or commercial assets. Instead, the **Core Source Vault** stores the source ZIP locally in IndexedDB after the user links it. Core-dependent exports can then embed that local ZIP without uploading it to GitHub.

## Dependency-safe bundles

**Export Bundle** creates a ZIP instead of only a loose C# file.

If a generated component needs an external package, the runtime code is exported as an inactive `.mbcode` payload so Unity does not fail compilation before dependencies exist. A small Editor bootstrapper can then:

1. detect already installed dependencies by reflection,
2. install supported Unity Package Manager dependencies,
3. when Core is required, extract the locally linked Core ZIP into the project if Game Creator is not already present,
4. report any remaining manual dependencies such as DOTween or LeanTween,
5. activate the generated C# only after requirements are available.

For the supplied Core source, the bundle resolver automatically accounts for Input System, uGUI, TextMeshPro, Mathematics, Collections and built-in Playables. Tests are not extracted into the Unity project.

A human-readable README and `MonoBuilder.dependencies.json` are included in every bundle.

## Run locally

This is a static application. Open `index.html` directly or serve the repository with any static file server.

## GitHub Pages

The repository includes `.github/workflows/pages.yml`.

In GitHub, open:

`Settings → Pages → Build and deployment → Source → GitHub Actions`

After Pages is enabled, pushes to `main` deploy automatically.

## Scope

MonoBuilder does not run the Unity engine in the browser. The Inspector preview is a web implementation that models the fields MonoBuilder generates. Exported scripts are intended to be placed in a Unity project and compiled by Unity.

## Roadmap

- Parse existing Unity C# scripts into visual fields
- ScriptableObject templates
- Event/action logic blocks
- Scene-object blueprint editor
- Import existing Unity C# into editable visual controls
- More high-level Game Creator presets for Cameras, Visual Scripting, Variables, Remember, Actions and Conditions
- Roslyn/WASM analysis
