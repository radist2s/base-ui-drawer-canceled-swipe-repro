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
close request. On the `reproduction` branch, Base UI still proceeds to a root
close and restoration path, so the popup can briefly fade out before returning.
On the `fixed` branch, the canceled `null` proposal settles back immediately.

The reliable event-log difference is:

```text
reproduction: onSnapPointChange(null) canceled
              onOpenChange(false) canceled
              onSnapPointChange(0.26) accepted

fixed:        onSnapPointChange(null) canceled
```

The log also uses `MutationObserver` to retain transient `data-ending-style`
and `data-swipe-dismiss` changes if a browser exposes them on this path.

## Dependency setup

The project commits Yarn 4.6.0 in `.yarn/releases` so StackBlitz's entry-point
`yarn` delegates to the repository version. The `fixed` branch applies
`.yarn/patches/@base-ui-react-https-f037ce4b76.patch` through Yarn's `patch:`
protocol. Both branches resolve Base UI to:

```text
@base-ui/react https://pkg.pr.new/mui/base-ui/@base-ui/react@903ed2e
@base-ui/utils https://pkg.pr.new/mui/base-ui/@base-ui/utils@903ed2e
```
