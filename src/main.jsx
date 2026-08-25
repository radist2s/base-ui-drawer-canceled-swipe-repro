import { Drawer } from '@base-ui/react/drawer';
import * as React from 'react';
import { createRoot } from 'react-dom/client';

import './styles.css';

const DEMO_VARIANT = 'BROKEN';
const COLLAPSED_SNAP_POINT = 0.26;
const EXPANDED_SNAP_POINT = 0.82;
const SNAP_POINTS = [COLLAPSED_SNAP_POINT, EXPANDED_SNAP_POINT];

function App() {
  const [snapPoint, setSnapPoint] = React.useState(COLLAPSED_SNAP_POINT);
  const [events, setEvents] = React.useState([]);
  const popupRef = React.useRef(null);

  const appendEvent = React.useCallback((message) => {
    const time = new Date().toLocaleTimeString(undefined, {
      fractionalSecondDigits: 3,
    });

    setEvents((previous) => [`${time}  ${message}`, ...previous].slice(0, 12));
  }, []);

  React.useEffect(() => {
    const popup = popupRef.current;
    if (!popup) {
      return undefined;
    }

    const observer = new MutationObserver((records) => {
      for (const record of records) {
        if (
          record.attributeName === 'data-ending-style' ||
          record.attributeName === 'data-swipe-dismiss'
        ) {
          const state = popup.hasAttribute(record.attributeName)
            ? 'added'
            : 'removed';
          appendEvent(`${record.attributeName} ${state}`);
        }
      }
    });

    observer.observe(popup, { attributes: true });
    return () => observer.disconnect();
  }, [appendEvent]);

  function handleSnapPointChange(nextSnapPoint, eventDetails) {
    if (nextSnapPoint === null) {
      eventDetails.cancel();
      appendEvent('onSnapPointChange(null) canceled');
      return;
    }

    setSnapPoint(nextSnapPoint);
    appendEvent(`onSnapPointChange(${nextSnapPoint}) accepted`);
  }

  function handleOpenChange(nextOpen, eventDetails) {
    if (!nextOpen) {
      eventDetails.cancel();
      appendEvent('onOpenChange(false) canceled');
    }
  }

  function resetDemo() {
    setSnapPoint(COLLAPSED_SNAP_POINT);
    setEvents([]);
  }

  const isFixed = DEMO_VARIANT === 'FIXED';

  return (
    <main className="page">
      <section className="evidence">
        <div className="headingRow">
          <div>
            <p className="eyebrow">Base UI Drawer regression</p>
            <h1>Canceled swipe dismissal</h1>
          </div>
          <span className={isFixed ? 'badge fixed' : 'badge broken'}>
            {DEMO_VARIANT}
          </span>
        </div>

        <p className="instructions">
          Quickly drag the drawer handle downward and release. The app cancels
          <code> onSnapPointChange(null) </code>and keeps the Drawer open.
        </p>

        <div className="expected">
          <strong>{isFixed ? 'Expected with patch:' : 'Bug:'}</strong>{' '}
          {isFixed
            ? 'the drawer settles back without entering an exit style.'
            : 'the drawer briefly fades out, then returns.'}
        </div>

        <div className="logHeader">
          <strong>Observed lifecycle</strong>
          <button type="button" onClick={resetDemo}>
            Reset
          </button>
        </div>
        <ol className="eventLog" aria-live="polite">
          {events.length === 0 ? (
            <li className="empty">No rejected swipe recorded yet.</li>
          ) : (
            events.map((event, index) => <li key={`${event}-${index}`}>{event}</li>)
          )}
        </ol>
      </section>

      <Drawer.Root
        open
        modal={false}
        disablePointerDismissal
        snapPoint={snapPoint}
        snapPoints={SNAP_POINTS}
        snapToSequentialPoints
        onOpenChange={handleOpenChange}
        onSnapPointChange={handleSnapPointChange}
      >
        <Drawer.Portal>
          <Drawer.Backdrop className="backdrop" />
          <Drawer.Viewport className="viewport">
            <Drawer.Popup
              ref={popupRef}
              className="popup"
              initialFocus={false}
              finalFocus={false}
            >
              <div className="handleArea">
                <div className="handle" />
                <span>Drag down quickly</span>
              </div>
              <Drawer.Content className="content">
                <Drawer.Title className="title">Route-owned drawer</Drawer.Title>
                <Drawer.Description className="description">
                  The route rejects dismissal while it remains active.
                </Drawer.Description>
                <button
                  className="secondaryButton"
                  type="button"
                  onClick={() => setSnapPoint(COLLAPSED_SNAP_POINT)}
                >
                  Collapse
                </button>
                <div className="placeholderGrid" aria-hidden="true">
                  <span />
                  <span />
                  <span />
                  <span />
                </div>
              </Drawer.Content>
            </Drawer.Popup>
          </Drawer.Viewport>
        </Drawer.Portal>
      </Drawer.Root>
    </main>
  );
}

createRoot(document.getElementById('root')).render(<App />);
