# Computed Behaviour
#### TODO: Convert these scenarios into unit tests.

A computed can be notified by (via run())
 - Observable
 - Another Computed

A Computed can notify
 - AutoRun
 - Reaction
 - $Component

Confusing: Called by Responder vs dependencies to notify.

Imagine: 
 - A computed contains an observable.
 - It was created inside a $Component
 - The observable is updated
 - This notifies the computed outside a Responder
 - The computed calls run:
    - Notifies the $Component
    - $Component calls its run. $Component requests latest value (get) from Computed.
    - Computed is given a responder this time.
 - The $Component is unmounted, setting its own _ref to null. The computed has the null ref in it's notify list
 - The computed no longer has non-null responders to notify.
    - We should clear our list next time we run and set our _ref to null if we have none.

## Called outside/without a Responder:

### run()
`run()` can only be called if _ref is not null.

If a Computed is called outside a responder it should run because the observable
that called it is allowed to be outside a responder.

### get(responder: Responder | null = null)
get is typically called by another computed, a reaction or $Component.

Example:
We call a computed inside the body of a $Reaction.

(TODO: Check this example, seems wrong)
Imagine an onmouseover event; a computed is then called outside a responder via `get(null)`.
E.g. onmouseover -> set $hoverIndex -> notify $hovering computed -> draw

If we are dirty (run() queued in action), then rerun. Notify responders.
if _ref is null we don't know whether we are dirty because `run()` can only be called 
(by a notifier) if _ref is not null! (we have been turned off after all)
This means we also have to rerun. We should have no responders?

If get is called outside a responder, then no responders will be added to our list. 
Do we have any responders? If not, then _ref should be null.

## Call Computed.get(responder) when computed._ref is null

### If the responder is active (reaction or a computed with a reaction dependency):
We haven't been listening for changes, so must call f(). We have a new responder
to add to our list.
_ref is no longer null

### We are called by a computed with null _ref
We must call f(). _ref is still null. Warn about full recompute?
