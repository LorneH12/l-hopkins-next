L Hopkins existing alpha assets for l-hopkins-next

Three existing PNG assets copied byte for byte. No generation, retouch, crop, resize or recompression during this handoff.

Football F01: 2048 x 1365, original-photo RGB with existing alpha. This is a mid-shot; shoes are not present in the source framing.
Student S01: 1672 x 941, approved generated entry proof based on IMG_2523, with existing alpha. Not an original-photo extraction. The proof face and shoes are unchanged in its existing alpha master.
Track T01: 1920 x 1080, alpha layer from the approved normalized derivative of conditionally accepted v3. Known likeness limitation remains. Its prior normalization used uniform affine resampling and neutralized unverified shoe marks and tiny bib-footer text. Face/neck were not retouched. We preserve that approved layer exactly, rather than restoring the older unverified markings.

All three have a real 8-bit alpha channel spanning 0 to 255. Both full-body subjects retain the shoes present in their selected existing assets. Hidden RGB behind fully transparent pixels may retain the prior background, which must remain hidden by alpha. Use CSS placement and the bounds in asset-provenance.json; do not flatten these files or infer transparency from a preview that ignores alpha.

Exact PNG hashes, alpha bounds and source comparison details are in asset-provenance.json.
