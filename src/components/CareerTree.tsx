'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  ReactFlow,
  MiniMap,
  Controls,
  useNodesState,
  useEdgesState,
  Node,
  Edge,
  Position,
  useReactFlow,
  ReactFlowProvider,
  Handle
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { AnimatePresence } from 'framer-motion';
import { ArrowLeft, ZoomIn, ZoomOut, Maximize2, Compass } from 'lucide-react';
import { ROOT_NODES, CHILD_NODES, ALL_NODES, CareerNode } from '../lib/data/careerData';
import NodeDrawer from './NodeDrawer';

// Custom Node Component to display glowing, glassmorphic cards
const CustomCareerNode = ({ data }: { data: { label: string; node: CareerNode; isActive: boolean; isExpanded: boolean } }) => {
  const node = data.node;
  
  // Theme styling mapping
  const colorMap = {
    cyan: 'border-cyan-500/30 text-cyan-300 bg-cyan-950/20 shadow-[0_0_15px_rgba(6,182,212,0.15)] hover:border-cyan-400',
    green: 'border-emerald-500/30 text-emerald-300 bg-emerald-950/20 shadow-[0_0_15px_rgba(16,185,129,0.15)] hover:border-emerald-400',
    purple: 'border-purple-500/30 text-purple-300 bg-purple-950/20 shadow-[0_0_15px_rgba(168,85,247,0.15)] hover:border-purple-400',
    orange: 'border-orange-500/30 text-orange-300 bg-orange-950/20 shadow-[0_0_15px_rgba(249,115,22,0.15)] hover:border-orange-400',
    warm: 'border-amber-500/30 text-amber-300 bg-amber-950/20 shadow-[0_0_15px_rgba(245,158,11,0.15)] hover:border-amber-400',
    blue: 'border-blue-500/30 text-blue-300 bg-blue-950/20 shadow-[0_0_15px_rgba(59,130,246,0.15)] hover:border-blue-400',
    indigo: 'border-indigo-500/30 text-indigo-300 bg-indigo-950/20 shadow-[0_0_15px_rgba(99,102,241,0.15)] hover:border-indigo-400',
    gold: 'border-yellow-500/30 text-yellow-300 bg-yellow-950/20 shadow-[0_0_15px_rgba(234,179,8,0.15)] hover:border-yellow-400',
    pink: 'border-pink-500/30 text-pink-300 bg-pink-950/20 shadow-[0_0_15px_rgba(236,72,153,0.15)] hover:border-pink-400',
    red: 'border-red-500/30 text-red-300 bg-red-950/20 shadow-[0_0_15px_rgba(239,68,68,0.15)] hover:border-red-400'
  };

  const styleClass = colorMap[node.theme_color || 'cyan'] || colorMap.cyan;
  const isLeaf = !CHILD_NODES.some(c => c.parent_id === node.id);

  return (
    <div className={`px-5 py-3.5 rounded-2xl border glass-panel transition-all duration-300 select-none text-center cursor-pointer min-w-[180px] max-w-[240px] relative ${styleClass} ${
      data.isExpanded ? 'ring-2 ring-emerald-400 border-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.3)]' : ''
    }`}>
      {/* Input Handle */}
      {node.parent_id && (
        <Handle
          type="target"
          position={Position.Left}
          style={{ background: 'currentColor', opacity: 0.8 }}
        />
      )}

      <div>
        <div className="font-black text-sm md:text-base tracking-wide flex flex-col justify-center items-center gap-0.5 whitespace-normal break-words px-2">
          {node.title}
        </div>
        {node.roadmap_steps && node.roadmap_steps.length > 0 && (
          <span className="text-[9px] text-gray-500 block mt-1 font-bold uppercase tracking-widest">
            {isLeaf ? '🚀 View Career Details' : '🌳 Click to expand'}
          </span>
        )}
      </div>

      {/* Output Handle */}
      {!isLeaf && (
        <Handle
          type="source"
          position={Position.Right}
          style={{ background: 'currentColor', opacity: 0.8 }}
        />
      )}
    </div>
  );
};

const nodeTypes = {
  customCareerNode: CustomCareerNode,
};

interface CareerTreeProps {
  onBack: () => void;
}

function CareerTreeContent({ onBack }: CareerTreeProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  const [expandedNodes, setExpandedNodes] = useState<string[]>([]);
  const [selectedNodeData, setSelectedNodeData] = useState<CareerNode | null>(null);
  const { setCenter, fitView, zoomTo } = useReactFlow();

  // Lay out the nodes programmatically
  const buildTreeLayout = useCallback((activeExpandedIds: string[]) => {
    const newNodes: Node[] = [];
    const newEdges: Edge[] = [];

    // 1. Position the 8 Root Nodes in Column 1 (X = 50)
    const rootSpacing = 110;
    const rootStartY = -((ROOT_NODES.length - 1) * rootSpacing) / 2;

    ROOT_NODES.forEach((root, idx) => {
      const isExpanded = activeExpandedIds.includes(root.id);
      newNodes.push({
        id: root.id,
        type: 'customCareerNode',
        position: { x: 50, y: rootStartY + idx * rootSpacing },
        data: {
          label: root.title,
          node: root,
          isActive: true,
          isExpanded
        },
      });
    });

    // 2. Position expanded children nodes
    // We will support deep layout by tracing paths
    activeExpandedIds.forEach((expandedId) => {
      // Find direct children
      const children = CHILD_NODES.filter((c) => c.parent_id === expandedId);
      if (children.length === 0) return;

      // Find parent node coordinates
      const parentNode = newNodes.find((n) => n.id === expandedId);
      if (!parentNode) return;

      const px = parentNode.position.x;
      const py = parentNode.position.y;

      // Position children in next column to the right (X + 320)
      const childSpacing = 100;
      const childStartY = py - ((children.length - 1) * childSpacing) / 2;

      children.forEach((child, idx) => {
        const isChildExpanded = activeExpandedIds.includes(child.id);
        const cx = px + 280;
        const cy = childStartY + idx * childSpacing;

        // Add node
        newNodes.push({
          id: child.id,
          type: 'customCareerNode',
          position: { x: cx, y: cy },
          data: {
            label: child.title,
            node: child,
            isActive: true,
            isExpanded: isChildExpanded
          },
        });

        // Map colors for curved neon edges
        let edgeColor = '#06b6d4'; // cyan
        if (child.theme_color === 'green') edgeColor = '#10b981'; // emerald
        if (child.theme_color === 'purple') edgeColor = '#a855f7'; // purple
        if (child.theme_color === 'orange') edgeColor = '#f97316'; // orange

        // Add custom neon edge link
        newEdges.push({
          id: `edge-${expandedId}-${child.id}`,
          source: expandedId,
          target: child.id,
          type: 'default',
          animated: true,
          style: {
            stroke: edgeColor,
            strokeWidth: 2,
            opacity: 0.6,
            filter: `drop-shadow(0 0 5px ${edgeColor})`
          },
        });
      });
    });

    setNodes(newNodes);
    setEdges(newEdges);
  }, [setNodes, setEdges]);

  // Initial layout loading
  useEffect(() => {
    buildTreeLayout([]);
    // Smooth initial centering
    setTimeout(() => {
      fitView({ padding: 0.2, duration: 1000 });
    }, 100);
  }, [buildTreeLayout, fitView]);

  // Handle clicking a node card
  const onNodeClick = useCallback(
    (_event: React.MouseEvent, node: Node) => {
      const clickedCareerNode = node.data.node as CareerNode;
      const hasChildren = CHILD_NODES.some((c) => c.parent_id === clickedCareerNode.id);

      if (clickedCareerNode.id === 'school-students') {
        // Expand the full stream path: school-students -> school-11-12 -> school-science -> pcm-careers
        const autoExpandPath = ['school-students', 'school-11-12', 'school-science', 'pcm-careers'];
        setExpandedNodes(autoExpandPath);
        buildTreeLayout(autoExpandPath);

        // Center on the 'school-students' root node first
        setCenter(node.position.x + 100, node.position.y, { zoom: 1.1, duration: 600 });

        // Let the branches grow and then trigger the slow scenic cinematic drag/pan over to the leaf node 'ai-ml-engineer'!
        setTimeout(() => {
          // X = 1170 is the coordinate of Column 5 (leaf nodes like 'ai-ml-engineer')
          // Y = -435 is the exact computed Y height of the 'ai-ml-engineer' node
          // Pan very slowly (duration: 3500ms) to create a premium cinematic galactic glide
          setCenter(1170, -435, { zoom: 1.25, duration: 3500 });

          // After the slow panning transition completes, automatically reveal the details drawer for 'ai-ml-engineer'
          setTimeout(() => {
            const aiEngineerData = CHILD_NODES.find(c => c.id === 'ai-ml-engineer');
            if (aiEngineerData) {
              setSelectedNodeData(aiEngineerData);
            }
          }, 3600);
        }, 800);

        return;
      }

      // Perform a smooth GSAP-like camera pan and zoom into clicked node
      setCenter(node.position.x + 100, node.position.y, { zoom: 1.1, duration: 800 });

      if (hasChildren) {
        setExpandedNodes((prev) => {
          let updated: string[];
          if (prev.includes(clickedCareerNode.id)) {
            // Collapse branch and all descendants
            const collapseDescendants = (parentId: string, list: string[]): string[] => {
              const children = CHILD_NODES.filter(c => c.parent_id === parentId);
              let newList = list.filter(id => id !== parentId);
              children.forEach(c => {
                newList = collapseDescendants(c.id, newList);
              });
              return newList;
            };
            updated = collapseDescendants(clickedCareerNode.id, prev);
          } else {
            // Keep siblings of SAME level but collapse other non-adjacent structures
            // Or simple add to list for seamless expanding tree
            updated = [...prev, clickedCareerNode.id];
          }
          buildTreeLayout(updated);
          return updated;
        });
      } else {
        // Leaf Node clicked: Open statistical details slide-out drawer
        setSelectedNodeData(clickedCareerNode);
      }
    },
    [buildTreeLayout, setCenter]
  );

  return (
    <div className="h-screen w-screen relative overflow-hidden flex flex-col justify-between">
      {/* Custom dynamic glowing accent on top */}
      <div className="absolute top-0 left-1/4 w-[50%] h-[350px] bg-gradient-to-b from-emerald-500/5 to-transparent blur-[120px] pointer-events-none" />

      {/* Glass header panel */}
      <div className="w-full glass-panel border-b border-gray-800/60 py-4 px-6 z-10 flex items-center justify-between">
        <div className="flex items-center gap-4">
          {/* Profile Photo at top-left of CareerTree header */}
          <div className="flex items-center gap-2.5 border-r border-gray-800/80 pr-4 mr-1">
            <div className="relative w-8 h-8 rounded-full overflow-hidden border border-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.3)] bg-gray-950">
              <img src="/sirganguly.png" alt="Sir Ganguly" className="w-full h-full object-cover" />
            </div>
            <div className="hidden xs:block">
              <h4 className="text-white font-extrabold text-xs tracking-wide">Sir Ganguly</h4>
              <p className="text-[8px] text-gray-500 font-bold uppercase tracking-wider">Visionary</p>
            </div>
          </div>

          <button
            onClick={onBack}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full glass-panel hover:border-emerald-500/30 text-xs text-emerald-400 group cursor-pointer transition-all"
          >
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
            Home
          </button>
          <div>
            <h1 className="text-lg md:text-xl font-black bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent flex items-center gap-1.5 tracking-wide">
              🌳 GrowthVerse Tree of Life
            </h1>
            <p className="text-[10px] text-gray-500 font-semibold tracking-wider uppercase hidden sm:block">
              Interactive Multi-Universe Roadmap Ecosystem
            </p>
          </div>
        </div>

        {/* Action Controls & Legend */}
        <div className="flex items-center gap-2">
          <div className="text-[10px] text-gray-500 font-bold uppercase hidden md:flex items-center gap-3 mr-4 border-r border-gray-800/80 pr-4">
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-cyan-400" /> Science</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-400" /> Commerce</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-purple-400" /> Arts/Skills</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-orange-400" /> Creators</span>
          </div>

          <button
            onClick={() => fitView({ padding: 0.25, duration: 800 })}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full glass-panel hover:border-emerald-500/30 text-xs text-gray-300 hover:text-white cursor-pointer transition-all"
          >
            <Compass size={14} className="animate-spin-slow" />
            Recenter Graph
          </button>
        </div>
      </div>

      {/* React Flow Core Graph */}
      <div className="flex-1 w-full h-full relative">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          nodeTypes={nodeTypes}
          onNodeClick={onNodeClick}
          fitView
          fitViewOptions={{ padding: 0.25 }}
          minZoom={0.2}
          maxZoom={2}
          zoomOnPinch={true}
          panOnDrag={true}
          draggable={false}
          className="w-full h-full"
        >
          {/* Controls UI overlay */}
          <div className="absolute bottom-6 left-6 z-20 flex flex-col gap-2 glass-panel p-2 rounded-2xl border-gray-800/80">
            <button
              onClick={() => zoomTo(nodes.length > 0 ? 1.2 : 1, { duration: 500 })}
              className="p-3 rounded-xl hover:bg-gray-900 text-gray-400 hover:text-emerald-400 transition-colors cursor-pointer"
              title="Zoom In"
            >
              <ZoomIn size={18} />
            </button>
            <button
              onClick={() => zoomTo(0.5, { duration: 500 })}
              className="p-3 rounded-xl hover:bg-gray-900 text-gray-400 hover:text-emerald-400 transition-colors cursor-pointer"
              title="Zoom Out"
            >
              <ZoomOut size={18} />
            </button>
            <button
              onClick={() => fitView({ padding: 0.2, duration: 600 })}
              className="p-3 rounded-xl hover:bg-gray-900 text-gray-400 hover:text-emerald-400 transition-colors cursor-pointer"
              title="Fit View"
            >
              <Maximize2 size={18} />
            </button>
          </div>

          <MiniMap
            style={{
              background: 'rgba(3, 7, 18, 0.95)',
              border: '1px solid rgba(255, 255, 255, 0.06)',
              borderRadius: '16px',
            }}
            nodeColor={(node) => {
              const theme = (node.data?.node as any)?.theme_color || 'cyan';
              if (theme === 'green') return '#10b981';
              if (theme === 'purple') return '#a855f7';
              if (theme === 'orange') return '#f97316';
              return '#06b6d4';
            }}
            maskColor="rgba(0, 0, 0, 0.6)"
            className="bottom-6 right-6 hidden md:block"
          />
        </ReactFlow>
      </div>

      {/* Info Slide Drawer Panels */}
      <AnimatePresence>
        {selectedNodeData && (
          <NodeDrawer
            node={selectedNodeData}
            onClose={() => setSelectedNodeData(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default function CareerTree({ onBack }: CareerTreeProps) {
  return (
    <ReactFlowProvider>
      <CareerTreeContent onBack={onBack} />
    </ReactFlowProvider>
  );
}
