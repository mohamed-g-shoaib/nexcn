# 04. Adding Components

This guide explains how to build and add new components to your application using Base UI primitives.

## Understanding Base UI

The boilerplate uses **Base UI**, which provides "headless" components.

- **Headless**: They handle logic (accessibility, keyboard nav, state) but have **no styles** by default.
- **You Style It**: You apply Tailwind classes to make them match your design.

### How to Create a Base UI Component

1. **Import the Primitive**: Import the parts from `@base-ui/react`.
2. **Assemble the Parts**: Base UI components use a "Root" and "Parts" pattern.
3. **Style Each Part**: Apply utility classes directly.

**Example: Creating a Custom Popover**

```tsx
import { Popover } from "@base-ui/react/popover";

export function NotificationFeature() {
  return (
    <Popover.Root>
      {/* The trigger button */}
      <Popover.Trigger className="bg-primary hover:bg-primary/90 rounded px-4 py-2 text-white">
        Open Notifications
      </Popover.Trigger>

      {/* The content that appears */}
      <Popover.Portal>
        <Popover.Positioner sideOffset={8}>
          <Popover.Popup className="bg-card w-64 rounded-lg border p-4 shadow-lg">
            <h3 className="text-foreground font-bold">Notifications</h3>
            <p className="text-muted-foreground text-sm">
              You have no new messages.
            </p>
          </Popover.Popup>
        </Popover.Positioner>
      </Popover.Portal>
    </Popover.Root>
  );
}
```

## Creating Generic UI Components

For standard layout components (Cards, Wrappers), you can create simple functional components.

**1. Create the file**: `components/ContentCard.tsx`
**2. Add the code**:

```tsx
import { cn } from "@/lib/utils";

interface ContentCardProps {
  title: string;
  children: React.ReactNode;
  className?: string; // Allow external styling overrides
}

export function ContentCard({ title, children, className }: ContentCardProps) {
  return (
    <div className={cn("rounded-border bg-card border p-6", className)}>
      <h2 className="mb-4 text-xl font-bold">{title}</h2>
      <div className="space-y-2">{children}</div>
    </div>
  );
}
```

## When to use "use client"

- **Server Components (Default)**: Use for data fetching, layout, or static content.
- **Client Components**: Add `"use client";` at the top if you use:
  - `useState`, `useEffect`
  - Event listeners (`onClick`, `onChange`)
  - Browser APIs (`window`, `localstorage`)

**Example Client Component:**

```tsx
"use client";

import { useState } from "react";

export function Counter() {
  const [count, setCount] = useState(0); // Needs client state
  return <button onClick={() => setCount((c) => c + 1)}>{count}</button>;
}
```
