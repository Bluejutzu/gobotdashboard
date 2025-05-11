"use client";

import React, { useCallback, useState, useMemo } from "react";
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
  Node,
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
    color: "#007bff",
    data: {
      label: "Send or Edit a Message",
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
    color: "#007bff",
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
    label: "Comparison Condition",
    color: "#28a745",
    data: {
      label: "Comparison Condition",
      type: "condition",
      conditionType: "comparison",
      leftValue: "",
      comparisonType: "equal_to",
      rightValue: "",
      runMultiple: false,
      hasElseNode: true
    },
  },
  {
    type: "option",
    label: "Text Option",
    color: "#9b59b6",
    data: {
      label: "Text Option",
      type: "option",
      optionType: "string",
      name: "",
      description: "",
      required: true,
      choices: [],
      sourcePosition: 'bottom',
      targetPosition: 'none'
    },
  },
  {
    type: "action",
    label: "Error Handler",
    color: "#dc3545",
    data: {
      label: "Error Handler",
      type: "action",
      actionType: "error_handler",
      errorMessage: ""
    },
  },
];

const initialNodes = [
  {
    id: "1",
    type: "input",
    data: {
      label: "Command Name",
      description: "",
      type: "command",
      cooldown: 0,
      cooldownType: "user"
    },
    position: { x: 250, y: 50 },
    style: {
      background: "#2b2d3a",
      color: "white",
      border: "1px solid #3a3c47",
      borderRadius: "8px",
      padding: "10px"
    }
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
  cooldown?: number;
  cooldownType?: string;
  hideReplies?: boolean;
  channelId?: string;
  userId?: string;
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
  style?: any;
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

const BlockProperties = ({ block, onChange, onDelete }: BlockPropertiesProps & { onDelete?: (id: string) => void }) => {
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

  // Specific settings for the command node (first block)
  if (block.type === 'input') {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold text-white mb-4">Command Settings</h2>
          <div className="space-y-4">
            <div>
              <Label className="text-white">Trigger</Label>
              <p className="text-sm text-gray-400 mb-2">The trigger and name of your custom command.</p>
              <Input
                value={block.data.label || ""}
                onChange={(e) => {
                  const value = e.target.value.toLowerCase().trim();
                  updateData({ label: value });
                }}
                className={`bg-[#181a20] text-white border-[#3a3c47] ${nameError ? 'border-red-500' : ''
                  }`}
                placeholder="e.g., warn, kick, ban"
              />
              {nameError && (
                <div className="text-red-500 text-sm mt-1 whitespace-pre-line">
                  {nameError}
                </div>
              )}
            </div>

            <div>
              <Label className="text-white">Description</Label>
              <p className="text-sm text-gray-400 mb-2">The description of what the command does.</p>
              <Textarea
                value={block.data.description || ""}
                onChange={(e) => updateData({ description: e.target.value })}
                className="bg-[#181a20] text-white border-[#3a3c47]"
                placeholder="Describe what this command does..."
              />
            </div>

            <div>
              <Label className="text-white">Command Cooldown</Label>
              <p className="text-sm text-gray-400 mb-2">Set either a User or Server wide cooldown for this command. This will only apply to the command and not any buttons or select menus.</p>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Select
                    value={block.data.cooldownType || "user"}
                    onValueChange={(value) => updateData({ cooldownType: value })}
                  >
                    <SelectTrigger className="bg-[#181a20] text-white border-[#3a3c47]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-[#181a20] text-white border-[#3a3c47]">
                      <SelectItem value="user">User</SelectItem>
                      <SelectItem value="server">Server</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Input
                    type="number"
                    value={block.data.cooldown || "0"}
                    onChange={(e) => updateData({ cooldown: parseInt(e.target.value) || 0 })}
                    className="bg-[#181a20] text-white border-[#3a3c47]"
                    placeholder="Cooldown in seconds"
                    min="0"
                  />
                </div>
              </div>
            </div>

            <div className="mt-4">
              <Label className="text-white flex items-center">
                <div className="mr-2">
                  <Switch
                    checked={block.data.hideReplies || false}
                    onCheckedChange={(checked) => updateData({ hideReplies: checked })}
                  />
                </div>
                Hide bot's replies from everyone but the executor of the slash command.
              </Label>
              <p className="text-sm text-gray-400 mt-1 ml-10">
                Hides the replies of the bot from everyone except the person who triggered the command. Will not work for targeted responses and DM actions.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // For other block types
  const commonFields = (
    <div className="space-y-4 mb-6">
      <div>
        <Label className="text-white">Block Label</Label>
        <Input
          value={block.data.label || ""}
          onChange={(e) => updateData({ label: e.target.value })}
          className="bg-[#181a20] text-white border-[#3a3c47]"
        />
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

              {/* Show user ID input field when DM User is selected */}
              {block.data.channel === "dm" && (
                  <div className="mt-2">
                    <Label className="text-white">User ID</Label>
                    <p className="text-sm text-gray-400 mb-2">The ID of the user to DM. You can use variables like {`{{ user.id }}`}</p>
                    <Input
                      value={block.data.userId || ""}
                      onChange={(e) => updateData({ userId: e.target.value })}
                      className="bg-[#181a20] text-white border-[#3a3c47]"
                      placeholder="Enter user ID or {{variable}}"
                    />
                  </div>

              )}

              {/* Show channel ID input field when Custom Channel is selected */}
              {block.data.channel === "custom_channel" && (
                <div className="mt-2">
                  <Label className="text-white">Channel ID</Label>
                  <p className="text-sm text-gray-400 mb-2">The ID of the channel to send to. You can use variables like {`{{ channel.id }}`}</p>
                  <Input
                    value={block.data.channelId || ""}
                    onChange={(e) => updateData({ channelId: e.target.value })}
                    className="bg-[#181a20] text-white border-[#3a3c47]"
                    placeholder="Enter channel ID or {{variable}}"
                  />
                </div>
              )}

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
          value={block.data.conditionType || "comparison"}
          onValueChange={(value) => updateData({ conditionType: value })}
        >
          <SelectTrigger className="bg-[#181a20] text-white border-[#3a3c47]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-[#181a20] text-white border-[#3a3c47]">
            <SelectItem value="comparison">Comparison</SelectItem>
            <SelectItem value="custom">Custom Logic</SelectItem>
          </SelectContent>
        </Select>
      </div>
      {block.data.conditionType === "comparison" ? (
        <>
          <div>
            <Label className="text-white">Left Value</Label>
            <p className="text-sm text-gray-400 mb-2">The first value to compare. Can be a static value or a variable.</p>
            <Input
              value={block.data.leftValue || ""}
              onChange={(e) => updateData({ leftValue: e.target.value })}
              className="bg-[#181a20] text-white border-[#3a3c47]"
              placeholder="Enter value or {{variable}}"
            />
          </div>

          <div>
            <Label className="text-white">Comparison Type</Label>
            <p className="text-sm text-gray-400 mb-2">How these values should be compared.</p>
            <Select
              value={block.data.comparisonType || "equal_to"}
              onValueChange={(value) => updateData({ comparisonType: value })}
            >
              <SelectTrigger className="bg-[#181a20] text-white border-[#3a3c47]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-[#181a20] text-white border-[#3a3c47]">
                <SelectItem value="equal_to">Equal to</SelectItem>
                <SelectItem value="not_equal_to">Not equal to</SelectItem>
                <SelectItem value="greater_than">Greater than</SelectItem>
                <SelectItem value="less_than">Less than</SelectItem>
                <SelectItem value="greater_than_equal">Greater than or equal to</SelectItem>
                <SelectItem value="less_than_equal">Less than or equal to</SelectItem>
                <SelectItem value="contains">Contains</SelectItem>
                <SelectItem value="not_contains">Does not contain</SelectItem>
                <SelectItem value="starts_with">Starts with</SelectItem>
                <SelectItem value="ends_with">Ends with</SelectItem>
                <SelectItem value="not_starts_with">Does not start with</SelectItem>
                <SelectItem value="not_ends_with">Does not end with</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-white">Right Value</Label>
            <p className="text-sm text-gray-400 mb-2">The second value to compare against. Can be a static value or a variable.</p>
            <Input
              value={block.data.rightValue || ""}
              onChange={(e) => updateData({ rightValue: e.target.value })}
              className="bg-[#181a20] text-white border-[#3a3c47]"
              placeholder="Enter value or {{variable}}"
            />
          </div>

          <div className="flex items-center space-x-2 mt-4">
            <Switch
              checked={block.data.hasElseNode || false}
              onCheckedChange={(checked) => updateData({ hasElseNode: checked })}
            />
            <Label className="text-white">Include Else Node</Label>
            <div className="ml-2">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="10" stroke="#3a3c47" strokeWidth="2" />
                <path d="M12 7V13M12 16V16.01" stroke="#3a3c47" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>
            <div className="text-xs text-gray-400">
              When enabled, an "Else" path will be created for actions to run when the condition is false.
            </div>
          </div>

          <div className="flex items-center space-x-2 mt-2">
            <Switch
              checked={block.data.runMultiple || false}
              onCheckedChange={(checked) => updateData({ runMultiple: checked })}
            />
            <Label className="text-white">Run Multiple Actions</Label>
            <div className="ml-2">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="10" stroke="#3a3c47" strokeWidth="2" />
                <path d="M12 7V13M12 16V16.01" stroke="#3a3c47" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>
            <div className="text-xs text-gray-400">
              When enabled, all matching actions will be run rather than just the first.
            </div>
          </div>
        </>
      ) : (
        <div>
          <Label className="text-white">Custom Logic</Label>
          <p className="text-sm text-gray-400 mb-2">Enter custom logic for more complex conditions.</p>
          <Textarea
            value={block.data.customLogic || ""}
            onChange={(e) => updateData({ customLogic: e.target.value })}
            className="bg-[#181a20] text-white border-[#3a3c47] min-h-[100px]"
            placeholder="Enter custom logic or code..."
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
          value={block.data.optionType || "string"}
          onValueChange={(value) => updateData({ optionType: value })}
        >
          <SelectTrigger className="bg-[#181a20] text-white border-[#3a3c47]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-[#181a20] text-white border-[#3a3c47]">
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

      {/* Delete button for all blocks except input (command) block */}
      {block.type !== 'input' && onDelete && (
        <div className="pt-6 mt-8 border-t border-[#3a3c47]">
          <Button
            onClick={() => onDelete(block.id)}
            variant="destructive"
            className="w-full bg-red-600 hover:bg-red-700 text-white"
          >
            <svg className="mr-2" width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 6H5H21" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6H19Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M10 11V17" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M14 11V17" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Delete Block
          </Button>
        </div>
      )}
    </div>
  );
};

export default function CommandBuilderPage() {
  const params = useParams();
  const router = useRouter();
  const serverId = params.serverId as string;
  const commandId = params.commandId as string;
  const isNewCommand = commandId === 'new';

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
        x: event.clientX - 350, // adjust for sidebar width (wider now)
        y: event.clientY - 100,
      };

      // Determine node type based on block type
      const nodeType = blockType === "condition" ? "condition" :
        blockType === "option" ? "option" : "default";

      const newNode = {
        id: `${Date.now()}`,
        type: nodeType,
        position,
        data: {
          ...template.data,
          // Add default values to satisfy type requirements
          description: template.data.description || "",
          cooldown: 0,
          cooldownType: "user"
        },
        style: {
          background: template.color || "#2b2d3a",
          color: "white",
          border: "1px solid #3a3c47",
          borderRadius: "8px",
          padding: "10px",
          minWidth: "180px"
        },
        // For option nodes, only show handles on the bottom (output) side
        ...(blockType === "option" ? {
          sourcePosition: 'bottom',
          targetPosition: 'top',
          // Setting this to false prevents connections to the input
          isConnectable: false
        } : {})
      };

      setNodes((nds) => [...nds, newNode as Node]);

      // For option blocks, auto-connect to the command block (first node)
      if (blockType === "option") {
        // Find the command block (input node, usually the first one)
        const commandNode = nodes.find(node => node.type === 'input');

        if (commandNode) {
          // Create an edge from command to option
          setTimeout(() => {
            const optionEdge = {
              id: `${commandNode.id}-${newNode.id}`,
              source: commandNode.id,
              target: newNode.id,
              type: 'smoothstep',
              animated: true,
              style: { stroke: template.color }
            };

            setEdges((eds) => [...eds, optionEdge]);
          }, 100);
        }
      }

      // If this is a condition node with an else branch, create the Else node
      if (blockType === "condition" && template.data.hasElseNode) {
        const elseNodeId = `else-${Date.now()}`;
        const elsePosition = {
          x: position.x + 200,
          y: position.y + 100
        };

        const elseNode = {
          id: elseNodeId,
          type: "default",
          position: elsePosition,
          data: {
            label: "Else",
            type: "else",
            description: "Actions to run when the condition is false",
            cooldown: 0,
            cooldownType: "user"
          },
          style: {
            background: "#dc3545",
            color: "white",
            border: "1px solid #3a3c47",
            borderRadius: "8px",
            padding: "10px",
            minWidth: "120px"
          }
        };

        setNodes((nds) => [...nds, elseNode as Node]);

        // Create the edge from condition to else
        setTimeout(() => {
          const elseEdge = {
            id: `${newNode.id}-${elseNodeId}`,
            source: newNode.id,
            target: elseNodeId,
            label: "Else",
            animated: true,
            style: { stroke: "#dc3545" }
          };

          setEdges((eds) => [...eds, elseEdge]);
        }, 100);
      }
    },
    [setNodes, setEdges, nodes]
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

  // Add a custom node type to render differently
  const nodeTypes = useMemo(() => ({
    condition: ({ data }: any) => (
      <div className="px-2 py-1">
        <div className="font-bold">{data.label}</div>
        {data.conditionType === "comparison" ? (
          <div className="text-xs">
            {data.leftValue || "[Value 1]"}
            {" "}
            {getComparisonOperator(data.comparisonType)}
            {" "}
            {data.rightValue || "[Value 2]"}
          </div>
        ) : (
          <div className="text-xs">Custom condition</div>
        )}
      </div>
    ),
    option: ({ data }: any) => (
      <div className="px-2 py-1">
        <div className="font-bold">{data.label}</div>
        <div className="text-xs">
          {data.name || "Unnamed"} ({data.optionType || "string"})
          {data.required ? " (required)" : " (optional)"}
        </div>
      </div>
    )
  }), []);

  // Helper function to display comparison operators in a readable format
  function getComparisonOperator(type: string): string {
    switch (type) {
      case "equal_to": return "==";
      case "not_equal_to": return "!=";
      case "greater_than": return ">";
      case "less_than": return "<";
      case "greater_than_equal": return ">=";
      case "less_than_equal": return "<=";
      case "contains": return "contains";
      case "not_contains": return "doesn't contain";
      case "starts_with": return "starts with";
      case "ends_with": return "ends with";
      case "not_starts_with": return "doesn't start with";
      case "not_ends_with": return "doesn't end with";
      default: return "==";
    }
  }

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

  // Add a function to delete nodes
  const handleDeleteNode = useCallback((id: string) => {
    // Remove the node
    setNodes((nds) => nds.filter(node => node.id !== id));

    // Remove any connected edges
    setEdges((eds) => eds.filter(edge =>
      edge.source !== id && edge.target !== id
    ));

    // Close the sidebar
    setSelectedBlock(null);
  }, [setNodes, setEdges]);

  return (
    <div className="flex min-h-screen bg-[#181a20]">
      {/* Block Palette Sidebar - increased width from w-72 to w-96 */}
      <div className="w-96 bg-[#232530] p-4 border-r border-[#3a3c47] overflow-y-auto">
        <div className="flex items-center gap-4 mb-4">
          <button onClick={() => router.push(`/dashboard/servers/${serverId}/commands`)} className="text-white">
            &lt;
          </button>
          <h2 className="text-xl font-bold text-white">Blocks</h2>
          <div className="bg-blue-600 rounded-md p-1 ml-auto">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 6H20M4 12H20M4 18H20" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>
        <p className="text-gray-400 text-sm mb-4">
          Drag and drop <span className="text-purple-400">Options</span>, <span className="text-blue-400">Actions</span> and <span className="text-green-400">Conditions</span> to add them to your command. Connect the corresponding colors to create your command flow.
        </p>

        <div className="flex space-x-2 border-b border-[#3a3c47] mb-4">
          <button className="px-4 py-2 text-white font-medium border-b-2 border-blue-500">Options</button>
          <button className="px-4 py-2 text-gray-400">Actions</button>
          <button className="px-4 py-2 text-gray-400">Conditions</button>
        </div>

        <div className="mb-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search"
              className="w-full bg-[#1e2028] text-white border border-[#3a3c47] rounded-md py-2 px-4 pl-10"
            />
            <svg className="absolute left-3 top-2.5" width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="text-gray-400 uppercase text-xs font-bold mb-2">Advanced Message</h3>
          {blockTemplates.filter(b => b.type === "action").map((block) => (
            <div
              key={block.label}
              draggable
              onDragStart={(e) => e.dataTransfer.setData("block/type", block.type)}
              className="flex items-center bg-[#2b2d3a] text-white rounded-md p-3 cursor-move border border-[#3a3c47] hover:bg-[#31334a]"
              style={{ borderLeft: `4px solid ${block.color}` }}
            >
              <div className="bg-blue-500 p-1 rounded mr-3">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M7 8H17M7 12H17M7 16H13" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div>
                <div className="font-medium">{block.label}</div>
                <div className="text-xs text-gray-400">
                  {block.label === "Send or Edit a Message"
                    ? "Send or edit a message with optional buttons and select menus."
                    : block.label === "Embed Reply"
                      ? "Bot replies with an embed response"
                      : "Handle errors that occur during the command execution"}
                </div>
              </div>
            </div>
          ))}

          <h3 className="text-gray-400 uppercase text-xs font-bold mb-2 mt-6">Conditions</h3>
          {blockTemplates.filter(b => b.type === "condition").map((block) => (
            <div
              key={block.label}
              draggable
              onDragStart={(e) => e.dataTransfer.setData("block/type", block.type)}
              className="flex items-center bg-[#2b2d3a] text-white rounded-md p-3 cursor-move border border-[#3a3c47] hover:bg-[#31334a]"
              style={{ borderLeft: `4px solid ${block.color}` }}
            >
              <div className="bg-green-500 p-1 rounded mr-3">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M8 10L12 14L16 10" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div>
                <div className="font-medium">{block.label}</div>
                <div className="text-xs text-gray-400">Run actions based on the difference between two values.</div>
              </div>
            </div>
          ))}

          <h3 className="text-gray-400 uppercase text-xs font-bold mb-2 mt-6">Options</h3>
          {blockTemplates.filter(b => b.type === "option").map((block) => (
            <div
              key={block.label}
              draggable
              onDragStart={(e) => e.dataTransfer.setData("block/type", block.type)}
              className="flex items-center bg-[#2b2d3a] text-white rounded-md p-3 cursor-move border border-[#3a3c47] hover:bg-[#31334a]"
              style={{ borderLeft: `4px solid ${block.color}` }}
            >
              <div className="bg-purple-500 p-1 rounded mr-3">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 12H15M12 9V15" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div>
                <div className="font-medium">{block.label}</div>
                <div className="text-xs text-gray-400">A text option. Use the variable in your responses to reference this option.</div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6">
          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded flex items-center justify-center">
            <svg className="mr-2" width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 6H20M4 12H20M4 18H20" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Block Templates
          </button>
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
            nodeTypes={nodeTypes}
            fitView
            style={{ background: "#181a20" }}
            connectionLineStyle={{ stroke: '#3a3c47', strokeWidth: 2 }}
            defaultEdgeOptions={{
              style: { stroke: '#3a3c47', strokeWidth: 2 },
              type: 'smoothstep',
              animated: true
            }}
          >
            <MiniMap
              nodeColor={(node) => {
                return node.style?.background?.toString() || '#2b2d3a';
              }}
              maskColor="rgba(24, 26, 32, 0.5)"
              style={{ background: '#232530' }}
            />
            <Controls className="bg-[#232530] text-white border border-[#3a3c47] rounded" />
            <Background gap={16} size={1} color="#2b2d3a" />
          </ReactFlow>
        </div>
        <div className="absolute bottom-6 left-6 flex gap-2">
          <Button
            onClick={() => router.push(`/dashboard/servers/${serverId}/commands`)}
            variant="outline"
            className="bg-[#232530] text-white border-[#3a3c47] hover:bg-[#31334a]"
          >
            Cancel
          </Button>
          <div className="flex flex-col">
            <Button
              onClick={handleSave}
              disabled={isLoading}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
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

      {/* Block Properties Sidebar with delete button */}
      {selectedBlock && (
        <div className="fixed right-0 top-0 w-112 h-full bg-[#232530] p-6 border-l border-[#3a3c47] z-50 overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-white">Block Settings</h2>
            <button
              className="text-white bg-red-500 w-6 h-6 rounded-md flex items-center justify-center"
              onClick={() => setSelectedBlock(null)}
            >×</button>
          </div>
          <BlockProperties
            block={selectedBlock}
            onChange={handleBlockChange}
            onDelete={handleDeleteNode}
          />
        </div>
      )}
    </div>
  );
} 