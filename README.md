# Base UI Drawer: canceled snap-point dismissal

Minimal reproduction for a controlled Drawer that rejects a swipe dismissal by
canceling `onSnapPointChange(null)`.

The two branches use the same prerelease Base UI artifact and the same app code:

- [`reproduction`](https://stackblitz.com/github/radist2s/base-ui-drawer-canceled-swipe-repro/tree/reproduction) — unpatched behavior
- [`fixed`](https://stackblitz.com/github/radist2s/base-ui-drawer-canceled-swipe-repro/tree/fixed) — the same artifact with a Yarn patch

## Reproduce

1. Wait for the drawer to appear at the collapsed snap point.
2. Grab the handle.
3. Drag it down quickly and release.

The app synchronously cancels both the proposed `null` snap point and the root
close request. On the `reproduction` branch, the popup still briefly enters its
ending style and fades out before returning. On the `fixed` branch, it settles
back without entering the close animation.

The event log uses `MutationObserver` so the transient `data-ending-style` and
`data-swipe-dismiss` attributes remain visible as evidence after the frame in
which they occurred.

## Dependency setup

The project commits Yarn 4.6.0 in `.yarn/releases` so StackBlitz's entry-point
`yarn` delegates to the repository version. The `fixed` branch applies
`.yarn/patches/@base-ui-react-https-f037ce4b76.patch` through Yarn's `patch:`
protocol. Both branches resolve Base UI to:

```text
@base-ui/react https://pkg.pr.new/mui/base-ui/@base-ui/react@903ed2e
@base-ui/utils https://pkg.pr.new/mui/base-ui/@base-ui/utils@903ed2e
```

