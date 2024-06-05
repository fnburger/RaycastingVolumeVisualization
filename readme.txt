The histogram automatically updates when loading a new dataset.
The transition is animated: the old histogram fades to black before the update.

The stepsize along each ray is computed dynamically and can also be modified using the "Dynamic Sampling Step-Size Multiplier Modifier" slider in the editor.
We chose 10.0 as default for the multiplier because the performance is decent and the volume data looks pretty much the same as with higher sampling rates.

Editor functionality:
- Up to 3 iso surfaces can be visualized with independent opacities, iso values and colors.
- Surfaces can be created and removed using the add and remove buttons.
- Each surface has its own iso-slider, color-picker and opacity-slider.
- The sampling rate can be adjusted by the user to adjust detail / performance using a slider.
- Ambient Occlusion can be toggled on and off.