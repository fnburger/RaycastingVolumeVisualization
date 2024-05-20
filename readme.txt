The histogram automatically updates when loading a new dataset.
The transition is animated: the old histogram fades to black before the update.

The stepsize along each ray can easily be changed in my_frag.essl at line 51.
We chose 100.0 for the multiplier because the performance is decent and the volume data looks pretty much the same as with higher sampling rates.