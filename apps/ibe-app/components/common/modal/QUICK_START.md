# Modal System - Quick Start Guide

## 5-Minute Setup

### 1. Import

```typescript
import { Modal, useModal } from 'components/common/modal';
```

### 2. Create Component

```typescript
function MyComponent() {
  const modal = useModal();

  return (
    <>
      <button onClick={modal.open}>Open Modal</button>
      
      <Modal
        isOpen={modal.isOpen}
        onClose={modal.close}
        title="Hello World"
      >
        <p>This is my first modal!</p>
      </Modal>
    </>
  );
}
```

That's it! ✅

---

## Common Patterns

### Confirmation Dialog

```typescript
const modal = useModal();

<Modal
  isOpen={modal.isOpen}
  onClose={modal.close}
  title="Confirm"
  size="sm"
  actions={[
    { label: 'Cancel', variant: 'secondary', onClick: modal.close },
    { label: 'Confirm', variant: 'primary', onClick: handleConfirm },
  ]}
>
  <p>Are you sure?</p>
</Modal>
```

### Form Modal

```typescript
<Modal
  isOpen={modal.isOpen}
  onClose={modal.close}
  title="Edit Profile"
  size="md"
  actions={[
    { label: 'Cancel', onClick: modal.close },
    { label: 'Save', variant: 'primary', onClick: handleSave },
  ]}
>
  <form className="space-y-4">
    <input placeholder="Name" />
    <textarea placeholder="Bio" />
  </form>
</Modal>
```

### Selection Modal

```typescript
<Modal
  isOpen={modal.isOpen}
  onClose={modal.close}
  title="Choose Option"
  size="sm"
>
  <div className="space-y-2">
    {options.map((opt) => (
      <button
        key={opt.id}
        onClick={() => {
          handleSelect(opt);
          modal.close();
        }}
        className="w-full p-3 text-left hover:bg-slate-100 rounded"
      >
        {opt.name}
      </button>
    ))}
  </div>
</Modal>
```

---

## Prop Cheat Sheet

| Prop | Type | Default | Purpose |
|------|------|---------|---------|
| `isOpen` | `boolean` | - | Controls visibility |
| `onClose` | `() => void` | - | Called when modal closes |
| `title` | `string\|ReactNode` | - | Modal header title |
| `children` | `ReactNode` | - | Modal body content |
| `size` | `'sm'\|'md'\|'lg'\|'xl'\|'full'` | `'md'` | Width of modal |
| `animation` | `'fade'\|'slide'\|'zoom'\|'none'` | `'fade'` | Open animation |
| `actions` | `ModalAction[]` | - | Footer buttons |
| `closeOnEscape` | `boolean` | `true` | Escape key closes? |
| `closeOnBackdropClick` | `boolean` | `true` | Backdrop click closes? |
| `showHeader` | `boolean` | `true` | Show header section? |
| `showFooter` | `boolean` | `true` | Show footer section? |
| `ariaLabel` | `string` | - | ARIA accessibility |
| `zIndex` | `number` | `50` | CSS z-index |
| `backdropOpacity` | `number` | `50` | 0-100 % opacity |

---

## Size Guide

```typescript
size="sm"   // 420px - confirmations, quick selections
size="md"   // 448px - default for most use cases
size="lg"   // 512px - forms, longer content
size="xl"   // 576px - complex layouts
size="full" // 100% - fullscreen on mobile
```

---

## Actions (Buttons)

```typescript
actions={[
  {
    id: 'cancel',              // unique id
    label: 'Cancel',           // button text
    variant: 'secondary',      // 'primary'|'secondary'|'danger'|'ghost'
    onClick: handleCancel,     // click handler
    disabled: false,           // disable button?
    loading: isLoading,        // show spinner?
  },
  {
    label: 'Delete',
    variant: 'danger',
    onClick: handleDelete,
  },
]}
```

---

## Accessibility ✅

Modal automatically provides:
- Escape key to close
- Focus trap (tab within modal only)
- Focus restoration on close
- ARIA roles and labels
- Keyboard navigation
- Screen reader support

---

## Examples

See full examples in:
- `components/common/modal/examples/LanguageSelectorModal.tsx`
- `components/common/modal/examples/ConfirmationModal.tsx`
- `components/common/modal/examples/AirportSelectorModal.tsx`
- `components/common/modal/examples/RefactoredDatePickerModal.tsx`

Run examples in your app to see real-world usage!

---

## Common Issues & Fixes

| Issue | Fix |
|-------|-----|
| Modal won't close | Make sure `onClose` updates `isOpen` |
| Scrollbars look odd | Add `bodyConfig={{ scrollable: true }}` |
| Content hidden | Use `size="lg"` or `size="xl"` |
| Keyboard close doesn't work | Check `closeOnEscape={true}` |
| Buttons stacking on mobile | Add responsive classes: `className="flex flex-col sm:flex-row gap-2"` |

---

## Next Steps

1. ✅ Copy a quick pattern above
2. ✅ Replace `Modal` with your content
3. ✅ Customize `title` and `actions`
4. ✅ Test with keyboard (Escape, Tab)
5. ✅ Done! 🎉

---

**Need more details?** → See `MODAL_SYSTEM.md` for full documentation
