# 🧹 Clean Code Guidelines

This document outlines the clean code principles applied in this project.

## Naming Conventions

### Files
- Components: `PascalCase.tsx` (e.g., `SquirrelMap.tsx`)
- Utilities: `camelCase.ts` (e.g., `formatDate.ts`)
- Types: `index.ts` or `descriptive.types.ts`

### Variables & Functions
- Use descriptive, meaningful names
- Boolean variables: `is`, `has`, `should` prefix (e.g., `isLoading`, `hasData`)
- Functions: Verb-based names (e.g., `fetchSquirrels`, `formatLocation`)

### Constants
- UPPER_SNAKE_CASE for true constants (e.g., `API_BASE_URL`)
- Avoid magic numbers/strings

## Function Guidelines

### Size
- Keep functions small (5-20 lines ideal)
- One function = one responsibility

### Parameters
- Limit to 3 parameters when possible
- Use object destructuring for multiple params

### Example

```typescript
const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
  return Math.sqrt(Math.pow(lat2 - lat1, 2) + Math.pow(lon2 - lon1, 2))
}

const formatSquirrelData = ({ name, age, color }: SquirrelBasicInfo) => {
  return `${name} (${age}): ${color}`
}
```

## Component Structure

```typescript
type ComponentProps = {
  data: SomeType
  onAction: () => void
}

const Component = ({ data, onAction }: ComponentProps) => {
  const derivedValue = useMemo(() => computeValue(data), [data])
  
  const handleClick = () => {
    onAction()
  }
  
  return <div onClick={handleClick}>{derivedValue}</div>
}

export default Component
```

## Error Handling

- Use try-catch for async operations
- Provide meaningful error messages
- Fail fast when something goes wrong

```typescript
const fetchData = async () => {
  try {
    const response = await api.get('/endpoint')
    return response.data
  } catch (error) {
    throw new Error('Failed to fetch data')
  }
}
```

## Code Organization

### Import Order
1. External libraries (React, etc.)
2. Internal modules (components, hooks)
3. Types
4. Styles

```typescript
import React, { useState } from 'react'
import { Map } from 'leaflet'

import { SquirrelCard } from '@/components'
import { useSquirrels } from '@/hooks'

import type { Squirrel } from '@/types'

import styles from './Component.module.css'
```

## Principles in Practice

### DRY (Don't Repeat Yourself)
- Extract repeated logic into functions/hooks
- Create reusable components

### KISS (Keep It Simple, Stupid)
- Prefer simple solutions
- Avoid premature optimization

### YAGNI (You Aren't Gonna Need It)
- Don't add features speculatively
- Build what's needed now

### Boy Scout Rule
- Leave code cleaner than you found it
- Refactor as you go

## TypeScript Best Practices

- Always type function parameters and return values
- Avoid `any` type
- Use `unknown` over `any` when type is uncertain
- Leverage type inference when obvious

## Testing Mindset

While tests aren't implemented yet, code should be:
- Modular and testable
- Free of side effects when possible
- Easy to mock

