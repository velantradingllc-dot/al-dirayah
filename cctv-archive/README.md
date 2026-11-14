# Archived CCTV & ELV Infrastructure Page

This folder contains the standalone CCTV & ELV Infrastructure page and all associated 3D photorealistic render assets, preserved separately for future use.

## Files Preserved
- `cctv-elv.html`: Full responsive standalone page with 3D exploded dome camera disassembly (#f2), Fluke DSX-8000 cabling spec studio (#cabling), surveillance camera HUD navigation console (#camHud), and technical consultation survey modal.
- `cctv_ip_camera_3d.jpg`: 3D render of the assembled 4K dome camera.
- `cctv_camera_exploded_3d.jpg`: 3D render of the exploded 6-layer camera disassembly.
- `cctv_control_room_3d.jpg`: 3D photorealistic command center / control room showcase.

## How to Restore
To bring this page back into the active website:
1. Move `cctv-elv.html` and the 3 `.jpg` images back to the root website directory.
2. Re-add `<a href="cctv-elv.html" class="sw-pill"><span class="icon">📹</span> CCTV</a>` to the `.div-switcher` navigation bar in `index.html`, `lifts.html`, `escalators.html`, and `accessibility-elevators.html`.
