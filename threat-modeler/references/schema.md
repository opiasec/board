# Board JSON Schema

The Board application uses a JSON format to represent C4 Model diagrams with security metadata.

## Structure

```json
{
  "nodes": [ ... ],
  "edges": [ ... ],
  "version": "1.0.0",
  "timestamp": "ISO-8601 string"
}
```

## Nodes

Each node has:
- `id`: Unique string (e.g., `node_123`).
- `type`: One of `person`, `softwareSystem`, `container`, `boundary`, `asset`, `threat`, `control`.
- `data`:
    - `label`: Display name.
    - `description`: Textual details.
    - `technology`: (Optional) Technical stack.
- `parentId`: (Optional) ID of the parent node (used for nesting).
- `extent`: Set to `"parent"` if `parentId` is present.
- `position`: `{ "x": number, "y": number }`.

## Hierarchy Rules

- `asset`, `threat`, and `control` should ideally be children of a `softwareSystem` or `container`.
- `boundary` can contain other nodes but usually doesn't use `parentId` for logical containment in the current implementation (it uses spatial containment).
