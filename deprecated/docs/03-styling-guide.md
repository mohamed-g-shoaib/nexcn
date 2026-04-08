# 03. Styling Guide

This project uses **Tailwind CSS v4** combined with **CSS variables** for theming. This ensures your app looks perfect in both light and dark modes without extra work.

## Core Concepts

### 1. Design Tokens

Do not use hardcoded colors like `bg-white` or `text-black`. Instead, use the semantic tokens defined in `app/globals.css`. These automatically adjust based on the user's theme.

| Class                   | Usage                 | Description                                     |
| :---------------------- | :-------------------- | :---------------------------------------------- |
| `bg-background`         | Page backgrounds      | The hierarchy's lowest level background.        |
| `bg-card`               | Container backgrounds | Used for cards, modals, and isolated sections.  |
| `bg-muted`              | Secondary backgrounds | Used for alternate rows or subtle containers.   |
| `bg-primary`            | Main actions          | High-contrast background for primary buttons.   |
| `border-border`         | Borders               | Standard border color for all inputs and cards. |
| `text-foreground`       | Primary Text          | High-contrast text color.                       |
| `text-muted-foreground` | Secondary Text        | Lower contrast for subtitles or help text.      |

### 2. RTL Support (Arabic)

Since this boilerplate supports Arabic, you must use **Logical Properties** in Tailwind. Do not use "left" or "right" specific classes.

| Instead of...          | Use...           | Logic                                      |
| :--------------------- | :--------------- | :----------------------------------------- |
| `ml-4` (Margin Left)   | **`ms-4`**       | Margin **Start** (Left in EN, Right in AR) |
| `mr-4` (Margin Right)  | **`me-4`**       | Margin **End** (Right in EN, Left in AR)   |
| `pl-4` (Padding Left)  | **`ps-4`**       | Padding **Start**                          |
| `pr-4` (Padding Right) | **`pe-4`**       | Padding **End**                            |
| `text-left`            | **`text-start`** | Aligns to start of reading direction       |

## Common Tasks

### How to Style a Card

```tsx
// ✅ Correct: Uses semantic tokens and logical padding
<div className="bg-card text-card-foreground border-border rounded-lg border p-6 shadow-sm">
  <h2 className="text-lg font-semibold">Title</h2>
  <p className="text-muted-foreground text-sm">Description text goes here.</p>
</div>
```

### How to Conditionally Apply Classes

Use the `cn()` utility to merge classes safely.

```tsx
import { cn } from "@/lib/utils";

export function StatusBadge({ isActive }: { isActive: boolean }) {
  return (
    <span
      className={cn(
        "rounded px-2 py-1 text-sm font-medium", // Base styles
        isActive
          ? "bg-primary text-primary-foreground"
          : "bg-muted text-muted-foreground" // Conditional
      )}
    >
      {isActive ? "Active" : "Inactive"}
    </span>
  );
}
```
