# GRIDFRAME Icon Creation & Authoring Workflow

Follow this systematic 20-step workflow when contributing or authoring new vector icons for the GRIDFRAME system.

---

## The 20-Step Icon Creation Workflow

1. **Define the Concept**: Clearly articulate the core concept and its real-world or digital visual metaphor.
2. **Check for Existing Concepts**: Search the catalog to ensure the concept or an identical metaphor does not already exist.
3. **Identify Family Placement**: Determine if the icon belongs to an existing family (e.g. `arrow`, `file`, `user`, `device`, `circle`) or defines a new base family.
4. **Set Up Canvas**: Create a new SVG on a standard $24\times 24$ canvas (`viewBox="0 0 24 24"`).
5. **Establish Safe Zone**: Ensure all primary vector strokes stay within the $22\times 22$ live area ($x \in [1, 23], y \in [1, 23]$), maintaining at least a $1\text{px}$ boundary margin.
6. **Apply Base Stroke**: Set `stroke-width="2"`, `stroke="currentColor"`, and `fill="none"`.
7. **Apply Round Terminations**: Set `stroke-linecap="round"` and `stroke-linejoin="round"`.
8. **Preserve Internal Spacing**: Maintain $\ge 2\text{px}$ visual separation between all distinct paths and shapes.
9. **Calibrate Visual Weight**: Compare against the standard reference circle ($\varnothing 20\text{px}$) and square ($18\times 18\text{px}$) to balance volume and optical heft.
10. **Calibrate Optical Center**: Ensure the center of visual mass rests at $(12, 12)$ for asymmetrical glyphs.
11. **Simplify Density**: Remove microscopic decorations, unnecessary internal lines, or complex cross-hatching that blurs at small sizes.
12. **Optimize Curves & Paths**: Simplify Bézier control points and ensure tangents flow naturally without kinks.
13. **Align to Pixel Grid**: Snap key horizontal/vertical edges and termination endpoints to the integer or half-pixel grid without distorting curves.
14. **Assign Canonical Name**: Use lowercase `kebab-case` with American English descriptive naming (e.g. `floppy-disk`, `circle-slash`).
15. **Structure Family Relationship**: Assign `family`, `baseIcon`, and `modifier` fields.
16. **Author UI Use Cases**: Write $2\text{--}4$ concise UI scenarios starting with **-ing verbs** ($4\text{--}12$ words, no ending punctuation).
17. **Assign Semantic Tags & Aliases**: Add search keywords, synonyms, and domain classifications.
18. **Run Automated Validation**: Run `npm run lint:icons` to verify schema, stroke, geometry, and naming compliance.
19. **Perform QA Visual Inspection**: Open `/qa` and inspect the icon across $16\text{px}$, $20\text{px}$, $24\text{px}$, $32\text{px}$, and $48\text{px}$ alongside reference keyshapes.
20. **Submit for Catalog Ingestion**: Integrate into the catalog build pipeline.
