# Date Picker Module - Complete Documentation

## Overview

A **production-grade, reusable date picker system** for airline booking engines, supporting both one-way and round-trip selection modes. Built with React, Next.js, TypeScript, and Tailwind CSS.

---

## Architecture

### Design Principles

✅ **Separation of Concerns** - Business logic (hooks) separate from UI (components)  
✅ **Reusability** - Single component tree for all booking modes  
✅ **Extensibility** - Built for future enhancements (APIs, localization, complex itineraries)  
✅ **Testability** - Pure functions, hooks, and typed props  
✅ **Accessibility** - Full keyboard navigation, ARIA support, focus management  
✅ **Performance** - Memoized components, optimized renders, efficient state

### Folder Structure

```
features/booking/date-picker/
├── types.ts                 # TypeScript interfaces
├── constants.ts             # Configuration constants
├── utils.ts                 # Pure utility functions
├── hooks/
│   ├── useDateSelection.ts   # Date range/single date logic
│   ├── useCalendarNavigation.ts # Month navigation
│   ├── useDatePicker.ts      # Top-level orchestration
│   └── index.ts              # Barrel export
├── components/
│   ├── CalendarDayCell.tsx           # Single day cell
│   ├── CalendarGrid.tsx              # 7-column day grid
│   ├── CalendarMonth.tsx             # Month view
│   ├── CalendarNavigation.tsx        # Month prev/next
│   ├── SelectedDateSummary.tsx       # Date display
│   ├── DatePickerHeader.tsx          # Modal header
│   ├── DatePickerFooter.tsx          # Reset/Confirm buttons
│   ├── DatePickerModal.tsx           # Main modal container
│   └── index.ts                      # Barrel export
├── index.ts                 # Public API
└── examples/
    ├── OneWayBookingFormExample.tsx
    └── RoundTripBookingFormExample.tsx
```

---

## State Flow Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      DatePickerModal                         │
│ (Container: backdrop, title, close button, scroll handling) │
└──────────────┬──────────────────────────────────────────────┘
               │ useDatePicker()
               ├─────────── orchestration
               │
         ┌─────┴──────────────┬─────────────────┐
         │                    │                 │
    ┌────V──┐        ┌─────────V──┐      ┌──────V──────┐
    │ Date  │        │ Calendar   │      │ Modal State │
    │Selection       │Navigation  │      └─────────────┘
    │State  │        │State       │
    └────┬──┘        └──────┬─────┘
         │useDateSelection  │useDateNavigation
         │(date range logic)│(month navigation)
         │                  │
         ├─ departureDate   ├─ visibleMonths
         ├─ returnDate      ├─ can go prev/next
         ├─ hoveredDate     └─ goToMonth()
         ├─ focusedInput
         └─ handleDateClick()
            (1st click = departure,
             2nd click = return,
             smart swap if needed)
```

### State Model

```typescript
// Top-level state (managed by useDatePicker)
type DatePickerState = {
  dateSelection: DateSelectionState;   // Selection logic
  calendarNavigation: CalendarNavigationState; // Month nav
  isInitialized: boolean;
};

// Date selection (handled by useDateSelection)
type DateSelection = {
  tripType: 'oneWay' | 'roundTrip';
  departureDate: Date | null;
  returnDate: Date | null;
  hoveredDate?: Date | null;            // For preview
  focusedInput?: 'departure' | 'return'; // Keyboard focus
};

// Calendar navigation (handled by useCalendarNavigation)
type CalendarNavigationState = {
  visibleMonths: CalendarMonth[];
  canGoToPrevious: boolean;
  canGoToNext: boolean;
  goToPreviousMonth: () => void;
  goToNextMonth: () => void;
};
```

---

## Component Breakdown

### 1. **CalendarDayCell**
Individual date cell component
- **Responsibility**: Render single date with state styling
- **States**: default, selected, rangeStart, rangeEnd, rangeMiddle, disabled, unavailable, today
- **Features**: Optional price display, keyboard support (Enter/Space), hover effects
- **Props**: `date`, `state`, `price`, `currency`, `onClick`, `onHover`, `showPrice`

### 2. **CalendarGrid**
Grid layout for calendar week (7 columns)
- **Responsibility**: Layout days + weekday labels
- **Features**: Responsive weekday labels, gap spacing
- **Props**: `days[]`, `onDayClick`, `onDayHover`, `showFares`, `weekStartsOn`

### 3. **CalendarMonth**
Complete single-month view
- **Responsibility**: Render month label + grid
- **Features**: Month name formatting (English/Japanese), date label
- **Props**: `month`, `showFares`, `onDayClick`, `onDayHover`, `monthLabel`, `locale`

### 4. **CalendarNavigation**
Month pagination controls
- **Responsibility**: Previous/next month arrows
- **Features**: Disabled states, hover effects, semantic buttons
- **Props**: `canGoToPrevious`, `canGoToNext`, `onPrevious`, `onNext`, `currentMonthLabel`

### 5. **SelectedDateSummary**
Display area for selected dates
- **Responsibility**: Show currently selected departure/return dates
- **Features**: Mode-aware (one-way vs round-trip), formatted date strings
- **Props**: `tripType`, `departureDate`, `returnDate`, `locale`

### 6. **DatePickerHeader**
Modal header with close button
- **Responsibility**: Title + close action
- **Features**: Dynamic title based on trip type
- **Props**: `tripType`, `onClose`

### 7. **DatePickerFooter**
Modal footer with action buttons
- **Responsibility**: Reset + Confirm buttons
- **Features**: Disabled/enabled states, helper text, reset visibility
- **Props**: `canConfirm`, `onReset`, `onConfirm`, `helperText`, `showResetButton`

### 8. **DatePickerModal** (Main Container)
Orchestrates all components + modal behavior
- **Responsibility**: Layout, scroll handling, modal lifecycle
- **Features**:
  - Two-month side-by-side display (desktop)
  - Escape key closes modal
  - Backdrop click closes modal (optional)
  - Body scroll lock
  - Focus management
  - Accessibility (role="dialog", aria-modal)
- **Props**: All `DatePickerProps`

---

## Hook Architecture

### `useDateSelection`
Manages date selection logic for both modes

```typescript
const dateSelection = useDateSelection({
  tripType: 'roundTrip',
  initialDepartureDate: null,
  initialReturnDate: null,
  minStay: 0,
  maxStay: 90,
  onSelectionChange: (selection) => { /* ... */ }
});

// Returns:
{
  selection: DateSelection,
  isValid: boolean,
  canConfirm: boolean,
  handleDateClick: (date: Date) => void,
  handleHoverDate: (date: Date | null) => void,
  handleFocusInput: (input: 'departure' | 'return') => void,
  resetSelection: () => void,
  confirmSelection: () => { departureDate, returnDate }
}
```

**One-way logic:**
- Single click = select departure
- Confirm returns `{ departureDate, null }`

**Round-trip logic:**
- First click = select departure
- Second click = select return
- Smart swap: if return < departure, automatically swap
- Stay length validation: errors if too short/long
- Can re-click to modify either date

### `useCalendarNavigation`
Manages visible months and pagination

```typescript
const calendar = useCalendarNavigation({
  monthsToShow: 2,
  initialMonthOffset: 0,
  minMonthOffset: 0,
  maxMonthOffset: 11,
  fareCalendarData,
  constraints
});

// Returns:
{
  visibleMonths: CalendarMonth[],
  visibleMonthIndices: number[],
  canGoToPrevious: boolean,
  canGoToNext: boolean,
  goToPreviousMonth: () => void,
  goToNextMonth: () => void,
  goToMonth: (offset: number) => void
}
```

### `useDatePicker`
Top-level orchestration (combines both hooks)

```typescript
const state = useDatePicker({
  tripType: 'roundTrip',
  initialDepartureDate,
  initialReturnDate,
  constraints: { disablePastDates: true, minStay: 0, maxStay: 90 },
  fareCalendarData,
  calendarConfig: { monthsToShow: 2 },
  onConfirm: (selection) => { /* ... */ },
  onReset: () => { /* ... */ }
});

// Returns DatePickerState with both hook results
```

### `useDatePickerModal`
Manages modal open/close (body scroll lock, focus)

```typescript
useDatePickerModal(isOpen);

// Side effects:
// - Locks body scroll when open
// - Restores previous focus when closed
// - Cleans up on unmount
```

---

## Utility Functions

Pure functions for date operations (all in `utils.ts`):

```typescript
// Date comparisons
isSameDay(date1, date2)           // true/false
isDateBefore(date1, date2)        // date1 < date2?
isDateAfter(date1, date2)         // date1 > date2?
isDateBetween(date, start, end)   // start <= date <= end?
getDaysBetween(date1, date2)      // number of days

// Date manipulation
cloneDate(date)                   // Deep copy
addDaysToDate(date, days)         // Add/subtract days
clampDate(date, min, max)         // Constrain to range

// Calendar generation
generateCalendarDays(year, month, fareData, constraints)
determineDateCellState(date, departure, return, hovered, baseState)

// Formatting
formatDateLabel(date, locale)     // "Jul 16, 2025" or "7月16日"
formatDateRange(dep, ret, locale) // "Jul 16 - Jul 20"
formatPrice(price, currency)      // "¥37,600" or "$125.50"
getISODateString(date)            // "2025-07-16"

// Validation
isValidOneWaySelection(date)
isValidRoundTripSelection(dep, ret, minStay, maxStay)

// Other
smartSwapDatesIfNeeded(d1, d2)    // Ensures d1 <= d2
getMonthOffset(date)              // Months from today
```

---

## Usage Examples

### One-Way Booking

```typescript
import { DatePickerModal, formatDateLabel } from '../date-picker';
import { useState } from 'react';

function OneWayForm() {
  const [isOpen, setIsOpen] = useState(false);
  const [departureDate, setDepartureDate] = useState<Date | null>(null);

  const handleConfirm = (selection) => {
    setDepartureDate(selection.departureDate);
    setIsOpen(false);
  };

  return (
    <>
      <button onClick={() => setIsOpen(true)}>
        {departureDate
          ? formatDateLabel(departureDate)
          : 'Select date'}
      </button>

      <DatePickerModal
        isOpen={isOpen}
        tripType="oneWay"
        initialDepartureDate={departureDate}
        onClose={() => setIsOpen(false)}
        onConfirm={handleConfirm}
        constraints={{ disablePastDates: true }}
      />
    </>
  );
}
```

### Round-Trip Booking

```typescript
import { DatePickerModal, formatDateRange } from '../date-picker';
import { useState } from 'react';

function RoundTripForm() {
  const [isOpen, setIsOpen] = useState(false);
  const [departure, setDeparture] = useState<Date | null>(null);
  const [returnDate, setReturnDate] = useState<Date | null>(null);

  const handleConfirm = (selection) => {
    setDeparture(selection.departureDate);
    setReturnDate(selection.returnDate);
    setIsOpen(false);
  };

  return (
    <>
      <button onClick={() => setIsOpen(true)}>
        {departure && returnDate
          ? formatDateRange(departure, returnDate)
          : 'Select dates'}
      </button>

      <DatePickerModal
        isOpen={isOpen}
        tripType="roundTrip"
        initialDepartureDate={departure}
        initialReturnDate={returnDate}
        onClose={() => setIsOpen(false)}
        onConfirm={handleConfirm}
        constraints={{
          disablePastDates: true,
          minStay: 0,
          maxStay: 90,
        }}
      />
    </>
  );
}
```

### With Fare Calendar Data

```typescript
const fareData = {
  '2025-07-16': { price: 37600, currency: 'JPY', available: true },
  '2025-07-17': { price: 42000, currency: 'JPY', available: true },
  '2025-07-18': { available: false }, // Sold out
};

<DatePickerModal
  isOpen={isOpen}
  tripType="roundTrip"
  onClose={() => setIsOpen(false)}
  onConfirm={handleConfirm}
  fareCalendarData={fareData}
  constraints={{
    minDate: new Date('2025-07-01'),
    maxDate: new Date('2025-09-30'),
    unavailableDates: [new Date('2025-07-25')],
  }}
/>
```

---

## Props API

### DatePickerModal

```typescript
interface DatePickerProps {
  // Modal state
  isOpen: boolean;
  onClose: () => void;

  // Mode & initial values
  tripType: 'oneWay' | 'roundTrip';
  initialDepartureDate?: Date | null;
  initialReturnDate?: Date | null;

  // Callbacks
  onConfirm: (selection: {
    departureDate: Date | null;
    returnDate: Date | null;
  }) => void;
  onReset?: () => void;

  // Data & constraints
  constraints?: {
    minDate?: Date;
    maxDate?: Date;
    unavailableDates?: Date[];
    minStay?: number;        // For round-trip
    maxStay?: number;        // For round-trip
    disablePastDates?: boolean;
  };

  // Calendar data
  fareCalendarData?: Record<string, {
    price?: number;
    currency?: string;
    available?: boolean;
  }>;

  // Configuration
  calendarConfig?: Partial<CalendarConfig>;
  disableBackdropClose?: boolean;
  showFareLegend?: boolean;
}
```

---

## Scroll Handling (Fixed)

The modal uses a **scroll-safe layout pattern** suitable for any viewport:

```
┌─────────────────────────────────────────┐
│ Backdrop (overflow-y-auto)              │ ← Scrolls if needed
├─────────────────────────────────────────┤
│ Centering Wrapper (flex min-h-full)     │ ← Centers modal
├─────────────────────────────────────────┤
│ Modal (flex flex-col max-h-[90vh])      │
│  ├─ Header (shrink-0)                   │ ← Never scrolls
│  ├─ Content (min-h-0 flex-1             │   (scrolls internally if too tall)
│  │   overflow-y-auto)                   │
│  │  ├─ Calendar Body flex               │
│  │  └─ Fare Legend                      │
│  └─ Footer (shrink-0)                   │ ← Always visible
└─────────────────────────────────────────┘
```

**Key constraints:**
- Header + Footer use `shrink-0` (never shrink)
- Calendar body uses `min-h-0 flex-1 overflow-y-auto` (scrolls if needed)
- Modal capped at `max-h-[90vh]` (leaves 5% viewport padding top/bottom)
- Footer always reaches end of scroll

---

## Extensibility & Future Enhancements

### Planned Additions

1. **API-Driven Fare Calendar**
   ```typescript
   const fareData = await fetchFareCalendar({
     origin: 'NRT',
     destination: 'KIX',
     month: '2025-07'
   });
   ```

2. **Multi-City Support**
   ```typescript
   <DatePickerModal
     tripType="multiCity"
     segments={[
       { origin: 'NRT', destination: 'KIX' },
       { origin: 'KIX', destination: 'NRT' },
       { origin: 'NRT', destination: 'HND' }
     ]}
   />
   ```

3. **Internationalization**
   ```typescript
   <DatePickerModal
     locale="ja-JP"
     fareCalendarData={localizedData}
   />
   ```

4. **Min/Max Stay Rules**
   ```typescript
   constraints={{
     minStay: 2,           // At least 2 nights
     maxStay: 30,          // At most 30 nights
     blockoutDates: [...]  // Blackout dates
   }}
   ```

5. **Minimum Passenger Stay**
   ```typescript
   constraints={{
     minStayByPassengerCount: {
       1: 1,
       2: 2,
       '3+': 3
     }
   }}
   ```

6. **Promotional Fares**
   ```typescript
   fareCalendarData={{
     '2025-07-16': {
       price: 37600,
       promotionalPrice: 29800,  // New field
       promoCode: 'SUMMER20'
     }
   }}
   ```

7. **Seat Type Filters** (already hinted in types)
   ```typescript
   component="SeatTypeSelector"
   availableSeatTypes={['economy', 'business']}
   ```

---

## Performance Optimizations

- ✅ All components use `React.memo()` for prevention of unnecessary re-renders
- ✅ Callbacks use `useCallback()` to maintain stable references
- ✅ Calendar generation memoized with `useMemo()`
- ✅ Pure utility functions (no side effects, easily testable)
- ✅ Efficient date comparisons (avoid new Date() in loops)

---

## Testing Strategy

### Unit Tests
- Pure utilities: `utils.ts`
- State logic: hooks
- Component props: rendering with different states

### Integration Tests
- One-way flow: select → confirm → submit
- Round-trip flow: select → select → confirm → submit
- Smart swap: select return before departure
- Modal interactions: escape key, backdrop close

### E2E Tests
- Full booking forms with date picker
- Cross-browser compatibility
- Mobile responsiveness (1 month vs 2 months)

---

## Accessibility Checklist

- ✅ `role="dialog"` on modal
- ✅ `aria-modal="true"` on modal wrapper
- ✅ `aria-label` on buttons
- ✅ `aria-disabled` on unavailable dates
- ✅ `aria-pressed` on selected dates
- ✅ Escape key closes modal
- ✅ Focus management (close button focused on open)
- ✅ Tab order logical and predictable
- ✅ Keyboard navigation (Enter/Space to select dates)
- ✅ Screen reader friendly labels

---

## Migration Path

If you have existing calendar modals, migrate by:

1. Replace component with `DatePickerModal`
2. Update props to match `DatePickerProps` interface
3. Update callbacks to expect new selection structure
4. Adjust CSS if using custom styling (now uses Tailwind defaults)
5. Test one-way and round-trip flows

---

## Support & Questions

For issues or feature requests, refer to:
- Architecture: `/date-picker/types.ts` and `/date-picker/utils.ts`
- Implementation: `/date-picker/hooks/` and `/date-picker/components/`
- Examples: `/examples/` directory

---

**Status**: Production-ready ✅  
**Last Updated**: 2025  
**Maintainer**: AIR Booking Team
