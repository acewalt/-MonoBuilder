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
- Package export
- Roslyn/WASM analysis
