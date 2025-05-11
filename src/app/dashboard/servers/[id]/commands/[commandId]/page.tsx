"use client";

import React, { useCallback, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  addEdge,
  useNodesState,
  useEdgesState,
  Edge,
  Connection,
} from "react-flow-renderer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

const blockTemplates = [
  {
    type: "action",
    label: "Send or Edit a Message",
    data: { 
      label: "Send/Edit Message", 
      type: "action",
      actionType: "send_message",
      content: "",
      channel: "same_channel",
      ephemeral: false,
      components: [] // For buttons, selects, etc.
    },
  },
  {
    type: "action",
    label: "Embed Reply",
    data: { 
      label: "Embed Reply", 
      type: "action",
      actionType: "embed_reply",
      title: "",
      description: "",
      color: "#000000",
      fields: []
    },
  },
  {
    type: "condition",
    label: "If Condition",
    data: { 
      label: "If Condition", 
      type: "condition",
      conditionType: "permission",
      permission: "everyone",
      customLogic: ""
    },
  },
  {
    type: "option",
    label: "User Option",
    data: { 
      label: "User Option", 
      type: "option",
      optionType: "user",
      name: "",
      description: "",
      required: true
    },
  },
];

const initialNodes = [
  {
    id: "1",
    type: "input",
    data: { label: "Start Command" },
    position: { x: 250, y: 50 },
  },
];

const initialEdges: Edge<any>[] = [];

interface BlockData {
  label: string;
  type: string;
  actionType?: string;
  content?: string;
  channel?: string;
  ephemeral?: boolean;
  components?: any[];
  title?: string;
  description?: string;
  color?: string;
  fields?: any[];
  conditionType?: string;
  permission?: string;
  customLogic?: string;
  optionType?: string;
  name?: string;
  required?: boolean;
  [key: string]: any;
}

interface Block {
  id: string;
  type: string;
  data: BlockData;
  position: {
    x: number;
    y: number;
  };
}

interface BlockPropertiesProps {
  block: Block;
  onChange: (block: Block) => void;
}

const COMMAND_NAME_REGEX = /^[\p{Ll}\p{Lm}\p{Lo}\p{N}\p{sc=Devanagari}\p{sc=Thai}_-]+$/u;

function isValidCommandName(name: string): boolean {
    return COMMAND_NAME_REGEX.test(name) && 
           name.length >= 1 && 
           name.length <= 32 &&
           !name.includes('__') &&  // No double underscores
           !/^[-_]|[-_]$/.test(name); // Can't start or end with hyphen/underscore
}

const BlockProperties = ({ block, onChange }: BlockPropertiesProps) => {
  const [nameError, setNameError] = useState<string>("");

  if (!block) return null;

  const updateData = (updates: Partial<BlockData>) => {
    // For the start node (input type), validate the command name
    if (block.type === 'input' && 'label' in updates) {
      const name = updates.label?.toLowerCase().trim() || '';
      if (name && !isValidCommandName(name)) {
        setNameError(
          'Command names must:\n' +
          '- Be 1-32 characters long\n' +
          '- Include only lowercase letters, numbers, hyphens, or underscores\n' +
          '- Not contain double underscores\n' +
          '- Not start or end with a hyphen or underscore'
        );
      } else {
        setNameError("");
      }
    }
    
    onChange({
      ...block,
      data: { ...block.data, ...updates }
    });
  };

  const commonFields = (
    <div className="space-y-4 mb-6">
      <div>
        <Label className="text-white">
          {block.type === 'input' ? 'Command Name' : 'Block Label'}
        </Label>
        <Input
          value={block.data.label || ""}
          onChange={(e) => {
            const value = block.type === 'input' 
              ? e.target.value.toLowerCase().trim()
              : e.target.value;
            updateData({ label: value });
          }}
          className={`bg-[#181a20] text-white border-[#3a3c47] ${
            nameError ? 'border-red-500' : ''
          }`}
          placeholder={block.type === 'input' ? 'e.g., warn, kick, ban' : ''}
        />
        {nameError && (
          <div className="text-red-500 text-sm mt-1 whitespace-pre-line">
            {nameError}
          </div>
        )}
      </div>
    </div>
  );

  const renderActionFields = () => {
    switch (block.data.actionType) {
      case "send_message":
        return (
          <>
            <div className="space-y-4">
              <div>
                <Label className="text-white">Message Content</Label>
                <Textarea
                  value={block.data.content || ""}
                  onChange={(e) => updateData({ content: e.target.value })}
                  className="bg-[#181a20] text-white border-[#3a3c47] min-h-[100px]"
                  placeholder="Enter your message content..."
                />
              </div>
              <div>
                <Label className="text-white">Send To</Label>
                <Select
                  value={block.data.channel || "same_channel"}
                  onValueChange={(value) => updateData({ channel: value })}
                >
                  <SelectTrigger className="bg-[#181a20] text-white border-[#3a3c47]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[#181a20] text-white border-[#3a3c47]">
                    <SelectItem value="same_channel">Same Channel</SelectItem>
                    <SelectItem value="dm">DM User</SelectItem>
                    <SelectItem value="custom_channel">Custom Channel</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  checked={block.data.ephemeral || false}
                  onCheckedChange={(checked) => updateData({ ephemeral: checked })}
                />
                <Label className="text-white">Ephemeral (Only visible to command user)</Label>
              </div>
            </div>
          </>
        );
      
      case "embed_reply":
        return (
          <div className="space-y-4">
            <div>
              <Label className="text-white">Embed Title</Label>
              <Input
                value={block.data.title || ""}
                onChange={(e) => updateData({ title: e.target.value })}
                className="bg-[#181a20] text-white border-[#3a3c47]"
              />
            </div>
            <div>
              <Label className="text-white">Embed Description</Label>
              <Textarea
                value={block.data.description || ""}
                onChange={(e) => updateData({ description: e.target.value })}
                className="bg-[#181a20] text-white border-[#3a3c47] min-h-[100px]"
              />
            </div>
            <div>
              <Label className="text-white">Embed Color</Label>
              <Input
                type="color"
                value={block.data.color || "#000000"}
                onChange={(e) => updateData({ color: e.target.value })}
                className="bg-[#181a20] text-white border-[#3a3c47] h-10"
              />
            </div>
          </div>
        );
    }
  };

  const renderConditionFields = () => (
    <div className="space-y-4">
      <div>
        <Label className="text-white">Condition Type</Label>
        <Select
          value={block.data.conditionType || "permission"}
          onValueChange={(value) => updateData({ conditionType: value })}
        >
          <SelectTrigger className="bg-[#181a20] text-white border-[#3a3c47]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-[#181a20] text-white border-[#3a3c47]">
            <SelectItem value="permission">Permission Check</SelectItem>
            <SelectItem value="custom">Custom Logic</SelectItem>
          </SelectContent>
        </Select>
      </div>
      {block.data.conditionType === "permission" ? (
        <div>
          <Label className="text-white">Required Permission</Label>
          <Select
            value={block.data.permission || "everyone"}
            onValueChange={(value) => updateData({ permission: value })}
          >
            <SelectTrigger className="bg-[#181a20] text-white border-[#3a3c47]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-[#181a20] text-white border-[#3a3c47]">
              <SelectItem value="everyone">Everyone</SelectItem>
              <SelectItem value="moderator">Moderator</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
            </SelectContent>
          </Select>
        </div>
      ) : (
        <div>
          <Label className="text-white">Custom Logic</Label>
          <Textarea
            value={block.data.customLogic || ""}
            onChange={(e) => updateData({ customLogic: e.target.value })}
            className="bg-[#181a20] text-white border-[#3a3c47] min-h-[100px]"
            placeholder="Enter custom logic..."
          />
        </div>
      )}
    </div>
  );

  const renderOptionFields = () => (
    <div className="space-y-4">
      <div>
        <Label className="text-white">Option Type</Label>
        <Select
          value={block.data.optionType || "user"}
          onValueChange={(value) => updateData({ optionType: value })}
        >
          <SelectTrigger className="bg-[#181a20] text-white border-[#3a3c47]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-[#181a20] text-white border-[#3a3c47]">
            <SelectItem value="user">User</SelectItem>
            <SelectItem value="string">Text</SelectItem>
            <SelectItem value="number">Number</SelectItem>
            <SelectItem value="channel">Channel</SelectItem>
            <SelectItem value="role">Role</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label className="text-white">Option Name</Label>
        <Input
          value={block.data.name || ""}
          onChange={(e) => updateData({ name: e.target.value })}
          className="bg-[#181a20] text-white border-[#3a3c47]"
          placeholder="e.g., user, reason, amount"
        />
      </div>
      <div>
        <Label className="text-white">Description</Label>
        <Input
          value={block.data.description || ""}
          onChange={(e) => updateData({ description: e.target.value })}
          className="bg-[#181a20] text-white border-[#3a3c47]"
          placeholder="Describe what this option is for"
        />
      </div>
      <div className="flex items-center space-x-2">
        <Switch
          checked={block.data.required || false}
          onCheckedChange={(checked) => updateData({ required: checked })}
        />
        <Label className="text-white">Required Option</Label>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {commonFields}
      {block.data.type === "action" && renderActionFields()}
      {block.data.type === "condition" && renderConditionFields()}
      {block.data.type === "option" && renderOptionFields()}
    </div>
  );
};

export default function CommandBuilderPage() {
  const params = useParams();
  const router = useRouter();
  const serverId = params.id as string;
  const commandId = params.commandId as string;
  const isNewCommand = commandId === 'new';
  console.log(serverId, commandId, isNewCommand)

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedBlock, setSelectedBlock] = useState<Block | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Drag and drop block from palette
  const onDrop = useCallback(
    (event: { preventDefault: () => void; dataTransfer: { getData: (arg0: string) => any; }; clientX: number; clientY: number; }) => {
      event.preventDefault();
      const blockType = event.dataTransfer.getData("block/type");
      const template = blockTemplates.find((b) => b.type === blockType);
      if (!template) return;
      const position = {
        x: event.clientX - 300, // adjust for sidebar width
        y: event.clientY - 100,
      };
      setNodes((nds) => [
        ...nds,
        {
          id: `${Date.now()}`,
          position,
          data: { ...template.data },
        },
      ]);
    },
    [setNodes]
  );

  const onDragOver = useCallback((event: { preventDefault: () => void; dataTransfer: { dropEffect: string; }; }) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onConnect = useCallback(
    (params: Edge<any> | Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  // Block selection for editing
  const onNodeClick = useCallback((event: any, node: any) => {
    setSelectedBlock(node);
  }, []);

  const handleBlockChange = useCallback((updatedBlock: any) => {
    setNodes((nds) =>
      nds.map((node) => (node.id === updatedBlock.id ? updatedBlock : node))
    );
    setSelectedBlock(updatedBlock);
  }, [setNodes]);

  // Save command (stub)
  const handleSave = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Find the start node and validate its name
      const startNode = nodes.find(node => node.type === 'input');
      if (!startNode) {
        throw new Error('Command must have a start node');
      }

      const commandName = startNode.data.label?.toLowerCase().trim() || '';
      if (!isValidCommandName(commandName)) {
        throw new Error(
          'Invalid command name. Names must:\n' +
          '- Be 1-32 characters long\n' +
          '- Include only lowercase letters, numbers, hyphens, or underscores\n' +
          '- Not contain double underscores\n' +
          '- Not start or end with a hyphen or underscore'
        );
      }

      const endpoint = isNewCommand 
        ? '/api/commands'
        : `/api/commands/${commandId}`;

      const response = await fetch(endpoint, {
        method: isNewCommand ? 'POST' : 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nodes,
          edges,
          serverId
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to save command');
      }

      router.push(`/dashboard/servers/${serverId}/commands`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while saving');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#181a20]">
      {/* Block Palette Sidebar */}
      <div className="w-64 bg-[#232530] p-4 border-r border-[#3a3c47]">
        <h2 className="text-lg font-bold mb-4 text-white">Blocks</h2>
        <div className="space-y-3">
          {blockTemplates.map((block) => (
            <div
              key={block.label}
              draggable
              onDragStart={(e) => e.dataTransfer.setData("block/type", block.type)}
              className="bg-[#2b2d3a] text-white rounded-md p-3 cursor-move border border-[#3a3c47] hover:bg-[#31334a]"
            >
              {block.label}
            </div>
          ))}
        </div>
      </div>
      {/* Canvas */}
      <div className="flex-1 relative">
        <div style={{ height: "80vh", minHeight: 500 }}
          onDrop={onDrop}
          onDragOver={onDragOver}
        >
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeClick={onNodeClick}
            fitView
            style={{ background: "#181a20" }}
          >
            <MiniMap />
            <Controls />
            <Background />
          </ReactFlow>
        </div>
        <div className="absolute bottom-6 left-6 flex gap-2">
          <Button 
            onClick={() => router.push(`/dashboard/servers/${serverId}/commands`)} 
            variant="outline"
          >
            Cancel
          </Button>
          <div className="flex flex-col">
            <Button onClick={handleSave} disabled={isLoading}>
              {isLoading ? "Saving..." : (isNewCommand ? "Create Command" : "Save Command")}
            </Button>
            {error && (
              <div className="text-red-500 text-sm mt-1 whitespace-pre-line">
                {error}
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Block Properties Sidebar */}
      {selectedBlock && (
        <div className="fixed right-0 top-0 w-96 h-full bg-[#232530] p-6 border-l border-[#3a3c47] z-50 overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-white">Block Settings</h2>
            <button
              className="text-white text-2xl"
              onClick={() => setSelectedBlock(null)}
            >×</button>
          </div>
          <BlockProperties
            block={selectedBlock}
            onChange={handleBlockChange}
          />
        </div>
      )}
    </div>
  );
} 