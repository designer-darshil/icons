import type { Icon } from '@/types/icon';
import type { IconRelationshipGraphData, GraphNode, GraphEdge } from '@/types/intelligence';
import { findIconPairings } from './pairing';
import { recommendIconStates } from './state-recommender';
import { findSimilarIcons } from './similarity';

/**
 * Builds nodes and edges for an interactive icon relationship graph.
 */
export function buildIconRelationshipGraph(
  rootIcon: Icon,
  allIcons: Icon[],
  isExpanded: boolean = false
): IconRelationshipGraphData {
  const nodesMap = new Map<string, GraphNode>();
  const edges: GraphEdge[] = [];

  // 1. Root Node
  nodesMap.set(rootIcon.id, {
    id: rootIcon.id,
    name: rootIcon.name,
    slug: rootIcon.slug,
    category: rootIcon.category,
    style: rootIcon.style,
    isPrimary: true,
  });

  const addNode = (icon: Icon) => {
    if (!nodesMap.has(icon.id)) {
      nodesMap.set(icon.id, {
        id: icon.id,
        name: icon.name,
        slug: icon.slug,
        category: icon.category,
        style: icon.style,
        isPrimary: false,
      });
    }
  };

  // 2. Direct Pairs
  const pairingReport = findIconPairings(rootIcon, allIcons);
  for (const pair of pairingReport.pairings.slice(0, isExpanded ? 4 : 2)) {
    addNode(pair.pairedIcon);
    edges.push({
      source: rootIcon.id,
      target: pair.pairedIcon.id,
      relationType: 'pair',
      label: pair.relationLabel,
      strength: pair.confidence,
    });
  }

  // 3. Concept Family Sibling Nodes
  const rootBase = rootIcon.slug.split('-')[0];
  const familySiblings = allIcons.filter(
    (i) => i.id !== rootIcon.id && (i.slug.startsWith(`${rootBase}-`) || i.slug === rootBase)
  );
  for (const sib of familySiblings.slice(0, isExpanded ? 4 : 2)) {
    addNode(sib);
    edges.push({
      source: rootIcon.id,
      target: sib.id,
      relationType: 'family',
      label: `Family: ${rootBase}`,
      strength: 0.9,
    });
  }

  // 4. State Matrix Nodes
  const stateReport = recommendIconStates(rootIcon, allIcons);
  for (const st of stateReport.states) {
    if (st.icon && st.icon.id !== rootIcon.id) {
      addNode(st.icon);
      edges.push({
        source: rootIcon.id,
        target: st.icon.id,
        relationType: 'state',
        label: `State: ${st.label}`,
        strength: 0.85,
      });
      if (!isExpanded && edges.length >= 6) break;
    }
  }

  // 5. Similar Geometric Nodes
  if (isExpanded) {
    const similar = findSimilarIcons(rootIcon, allIcons, 4);
    for (const sim of similar) {
      if (!nodesMap.has(sim.icon.id)) {
        addNode(sim.icon);
        edges.push({
          source: rootIcon.id,
          target: sim.icon.id,
          relationType: 'similarity',
          label: `DNA match (${sim.similarityScore}%)`,
          strength: sim.similarityScore / 100,
        });
      }
    }
  }

  return {
    rootIcon,
    nodes: Array.from(nodesMap.values()),
    edges,
    isExpanded,
  };
}
