"use client"

import type React from "react"

import { useCallback, useEffect, useRef, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, ChevronRight, Plus, Save, Search, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import { BlockDataProperties } from "@/lib/types"

// Block type definitions
interface BlockData {
  id: string
  type: string
  blockType: string
  label: string
  position: { x: number; y: number }
  data: BlockDataProperties,
  connections: Record<string, string>
}

interface Connection {
  id: string
  fromId: string
  toId: string
  fromSocket: string
  toSocket: string
}

const CommandBuilder = () => {
  const params = useParams()
  const router = useRouter()
  const serverId = params.serverId as string
  const commandId = params.commandId as string
  const isNewCommand = commandId === "new"

  const canvasRef = useRef<HTMLDivElement>(null)
  const [activeTab, setActiveTab] = useState("options")
  const [searchTerm, setSearchTerm] = useState("")
  const [blocks, setBlocks] = useState<BlockData[]>([])
  const [connections, setConnections] = useState<Connection[]>([])
  const [selectedBlock, setSelectedBlock] = useState<BlockData | null>(null)
  const [commandName, setCommandName] = useState("")
  const [, setCommandDescription] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [, setError] = useState<string | null>(null)
  const [isConnecting, setIsConnecting] = useState(false)
  const [connectionStart, setConnectionStart] = useState<{ id: string; socket: string } | null>(null)

  
  const fetchCommandData = useCallback(async () => {
    try {
      setIsLoading(true)
      // Fetch command data from API
      const response = await fetch(`/api/commands/${commandId}`)
      if (!response.ok) {
        throw new Error("Failed to fetch command data")
      }

      const data = await response.json()
      if (data.blocks && data.connections) {
        setBlocks(data.blocks)
        setConnections(data.connections)
        setCommandName(data.name || "")
        setCommandDescription(data.description || "")
      }
    } catch (err) {
      setError("Failed to load command data")
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }, [commandId])
  
  useEffect(() => {
    if (isNewCommand && blocks.length === 0) {
      setBlocks([
        {
          id: "command-1",
          type: "command",
          blockType: "start",
          label: "Command",
          position: { x: 400, y: 100 },
          data: {
            name: "",
            description: "",
            cooldown: 0,
            cooldownType: "user",
            hideReplies: false,
          },
          connections: {},
        },
      ])
    } else if (!isNewCommand) {
      // Fetch existing command data
      fetchCommandData()
    }
  }, [isNewCommand, blocks.length, fetchCommandData])

  const handleSave = async () => {
    try {
      setIsLoading(true)
      setError(null)

      // Validate command name
      const commandBlock = blocks.find((block) => block.type === "command")
      if (!commandBlock || !commandBlock.data.name) {
        throw new Error("Command name is required")
      }

      const endpoint = isNewCommand ? "/api/commands" : `/api/commands/${commandId}`
      const response = await fetch(endpoint, {
        method: isNewCommand ? "POST" : "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: commandBlock.data.name,
          description: commandBlock.data.description,
          serverId,
          blocks,
          connections,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to save command")
      }

      router.push(`/dashboard/servers/${serverId}/commands`)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred while saving")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDragStart = (e: React.DragEvent, blockType: string, category: string) => {
    e.dataTransfer.setData("blockType", blockType)
    e.dataTransfer.setData("category", category)
    e.dataTransfer.effectAllowed = "copy"
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()

    if (!canvasRef.current) return

    const blockType = e.dataTransfer.getData("blockType")
    const category = e.dataTransfer.getData("category")

    if (!blockType) return

    const canvasRect = canvasRef.current.getBoundingClientRect()
    const x = e.clientX - canvasRect.left
    const y = e.clientY - canvasRect.top

    addBlock(blockType, category, { x, y })
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = "copy"
  }

  const addBlock = (blockType: string, category: string, position: { x: number; y: number }) => {
    const id = `${blockType}-${Date.now()}`
    const newBlock = createBlockByType(id, blockType, category, position)

    setBlocks((prev) => [...prev, newBlock])
    setSelectedBlock(newBlock)
  }

  const createBlockByType = (
    id: string,
    blockType: string,
    category: string,
    position: { x: number; y: number },
  ): BlockData => {
    const baseBlock = {
      id,
      type: blockType,
      blockType: category,
      position,
      connections: {},
    }

    switch (blockType) {
      case "text-option":
        return {
          ...baseBlock,
          label: "Text Option",
          data: {
            name: "",
            description: "",
            required: true,
          },
        }
      case "number-option":
        return {
          ...baseBlock,
          label: "Number Option",
          data: {
            name: "",
            description: "",
            required: true,
            min: null,
            max: null,
          },
        }
      case "send-message":
        return {
          ...baseBlock,
          label: "Send or Edit a Message",
          data: {
            content: "",
            channel: "same_channel",
            ephemeral: false,
          },
        }
      case "embed-reply":
        return {
          ...baseBlock,
          label: "Embed Reply",
          data: {
            title: "",
            description: "",
            color: "#0099ff",
          },
        }
      case "error-handler":
        return {
          ...baseBlock,
          label: "Error Handler",
          data: {
            errorMessage: "",
          },
        }
      case "comparison":
        return {
          ...baseBlock,
          label: "Comparison Condition",
          data: {
            leftValue: "",
            comparisonType: "equal_to",
            rightValue: "",
            hasElseNode: true,
          },
        }
      default:
        return {
          ...baseBlock,
          label: "Unknown Block",
          data: {},
        }
    }
  }

  const handleBlockSelect = (block: BlockData) => {
    setSelectedBlock(block)
  }

  const handleBlockChange = (updatedData: Record<string, any>) => {
    if (!selectedBlock) return

    setBlocks((prev) =>
      prev.map((block) =>
        block.id === selectedBlock.id
          ? { ...block, data: { ...block.data, ...updatedData }, label: updatedData.name || block.label }
          : block,
      ),
    )

    setSelectedBlock((prev) =>
      prev ? { ...prev, data: { ...prev.data, ...updatedData }, label: updatedData.name || prev.label } : null,
    )
  }

  const handleBlockMove = (id: string, newPosition: { x: number; y: number }) => {
    setBlocks((prev) => prev.map((block) => (block.id === id ? { ...block, position: newPosition } : block)))
  }

  const handleBlockDelete = (id: string) => {
    // Remove connections to/from this block
    setConnections((prev) => prev.filter((conn) => conn.fromId !== id && conn.toId !== id))

    // Remove the block
    setBlocks((prev) => prev.filter((block) => block.id !== id))

    // Clear selection if the deleted block was selected
    if (selectedBlock?.id === id) {
      setSelectedBlock(null)
    }
  }

  const handleConnectionStart = (blockId: string, socket: string) => {
    setIsConnecting(true)
    setConnectionStart({ id: blockId, socket })
  }

  const handleConnectionEnd = (blockId: string, socket: string) => {
    if (!connectionStart) return

    // Don't connect to self
    if (connectionStart.id === blockId) {
      setIsConnecting(false)
      setConnectionStart(null)
      return
    }

    // Create the connection
    handleCreateConnection(connectionStart.id, blockId, connectionStart.socket, socket)

    // Reset connection state
    setIsConnecting(false)
    setConnectionStart(null)
  }

  const handleCreateConnection = (fromId: string, toId: string, fromSocket = "output", toSocket = "input") => {
    const connectionId = `${fromId}-${toId}-${fromSocket}-${toSocket}`

    // Check if connection already exists
    if (connections.some((conn) => conn.id === connectionId)) {
      return
    }

    const newConnection = {
      id: connectionId,
      fromId,
      toId,
      fromSocket,
      toSocket,
    }

    setConnections((prev) => [...prev, newConnection])

    // Update the blocks' connections
    setBlocks((prev) =>
      prev.map((block) => {
        if (block.id === fromId) {
          return {
            ...block,
            connections: {
              ...block.connections,
              [fromSocket]: toId,
            },
          }
        }
        if (block.id === toId) {
          return {
            ...block,
            connections: {
              ...block.connections,
              [toSocket]: fromId,
            },
          }
        }
        return block
      }),
    )
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleConnectionDelete = (connectionId: string) => {
    const connection = connections.find((conn) => conn.id === connectionId)
    if (!connection) return

    // Remove the connection
    setConnections((prev) => prev.filter((conn) => conn.id !== connectionId))

    // Update the blocks' connections
    setBlocks((prev) =>
      prev.map((block) => {
        if (block.id === connection.fromId) {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { [connection.fromSocket]: _, ...restConnections } = block.connections
          return {
            ...block,
            connections: restConnections,
          }
        }
        if (block.id === connection.toId) {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { [connection.toSocket]: _, ...restConnections } = block.connections
          return {
            ...block,
            connections: restConnections,
          }
        }
        return block
      }),
    )
  }

  const filteredBlocks = () => {
    const blocksByCategory = {
      options: [
        {
          type: "text-option",
          label: "Text Option",
          icon: "T",
          color: "#a855f7",
          description: "A text option for your command",
        },
        {
          type: "number-option",
          label: "Number Option",
          icon: "N",
          color: "#a855f7",
          description: "A number option for your command",
        },
        {
          type: "user-option",
          label: "User Option",
          icon: "U",
          color: "#a855f7",
          description: "A user option for your command",
        },
        {
          type: "channel-option",
          label: "Channel Option",
          icon: "C",
          color: "#a855f7",
          description: "A channel option for your command",
        },
        {
          type: "role-option",
          label: "Role Option",
          icon: "R",
          color: "#a855f7",
          description: "A role option for your command",
        },
      ],
      actions: [
        {
          type: "send-message",
          label: "Send or Edit a Message",
          icon: "M",
          color: "#3b82f6",
          description: "Send or edit a message with optional buttons",
        },
        {
          type: "embed-reply",
          label: "Embed Reply",
          icon: "E",
          color: "#3b82f6",
          description: "Send an embed message",
        },
        {
          type: "delete-message",
          label: "Delete Message",
          icon: "D",
          color: "#3b82f6",
          description: "Delete a message",
        },
        { type: "add-role", label: "Add Role", icon: "A", color: "#3b82f6", description: "Add a role to a user" },
        {
          type: "remove-role",
          label: "Remove Role",
          icon: "R",
          color: "#3b82f6",
          description: "Remove a role from a user",
        },
      ],
      conditions: [
        { type: "comparison", label: "Comparison", icon: "C", color: "#22c55e", description: "Compare two values" },
        { type: "has-role", label: "Has Role", icon: "R", color: "#22c55e", description: "Check if a user has a role" },
        {
          type: "has-permission",
          label: "Has Permission",
          icon: "P",
          color: "#22c55e",
          description: "Check if a user has a permission",
        },
        {
          type: "error-handler",
          label: "Error Handler",
          icon: "E",
          color: "#ef4444",
          description: "Handle errors in your command",
        },
      ],
    }

    const categoryBlocks = blocksByCategory[activeTab as keyof typeof blocksByCategory] || []

    if (!searchTerm) return categoryBlocks

    return categoryBlocks.filter(
      (block) =>
        block.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
        block.description.toLowerCase().includes(searchTerm.toLowerCase()),
    )
  }

  return (
    <div className="flex h-screen bg-[#1e2030] text-white overflow-hidden">
      {/* Left sidebar - Block palette */}
      <div className="w-80 border-r border-[#2a2d3d] flex flex-col">
        <div className="p-4 border-b border-[#2a2d3d] flex items-center">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push(`/dashboard/servers/${serverId}/commands`)}
            className="mr-2"
          >
            <ArrowLeft size={18} />
          </Button>
          <h1 className="text-lg font-medium">Command Builder</h1>
        </div>

        <div className="p-4 border-b border-[#2a2d3d]">
          <p className="text-sm text-gray-400 mb-2">
            Drag and drop <span className="text-[#a855f7]">Options</span>,{" "}
            <span className="text-[#3b82f6]">Actions</span> and <span className="text-[#22c55e]">Conditions</span> to
            add them to your command. Connect the corresponding colors to create your command flow.
          </p>
        </div>

        <div className="p-4 border-b border-[#2a2d3d]">
          <div className="relative mb-4">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search blocks"
              className="pl-9 bg-[#252839] border-[#2a2d3d] text-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <Tabs defaultValue="options" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="w-full bg-[#252839] border border-[#2a2d3d]">
              <TabsTrigger
                value="options"
                className="flex-1 data-[state=active]:bg-[#a855f7] data-[state=active]:text-white"
              >
                Options
              </TabsTrigger>
              <TabsTrigger
                value="actions"
                className="flex-1 data-[state=active]:bg-[#3b82f6] data-[state=active]:text-white"
              >
                Actions
              </TabsTrigger>
              <TabsTrigger
                value="conditions"
                className="flex-1 data-[state=active]:bg-[#22c55e] data-[state=active]:text-white"
              >
                Conditions
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <ScrollArea className="flex-1 p-2">
          <div className="space-y-2">
            {filteredBlocks().map((block) => (
              <div
                key={block.type}
                draggable
                onDragStart={(e) => handleDragStart(e, block.type, activeTab)}
                className="flex items-center p-3 bg-[#252839] rounded-md border border-[#2a2d3d] cursor-move hover:bg-[#2a2d3d] transition-colors hover-lift will-animate"
                style={{ borderLeft: `4px solid ${block.color}` }}
              >
                <div
                  className="w-8 h-8 rounded-md flex items-center justify-center mr-3 text-white"
                  style={{ backgroundColor: block.color }}
                >
                  {block.icon}
                </div>
                <div>
                  <div className="font-medium">{block.label}</div>
                  <div className="text-xs text-gray-400">{block.description}</div>
                </div>
              </div>
            ))}

            {filteredBlocks().length === 0 && (
              <div className="text-center py-8 text-gray-400">
                <p>No blocks match your search</p>
              </div>
            )}
          </div>
        </ScrollArea>

        <div className="p-4 border-t border-[#2a2d3d]">
          <Button className="w-full bg-[#3b82f6] hover:bg-[#2563eb] hover-glow" onClick={() => { }}>
            <Plus size={16} className="mr-2" />
            Block Templates
          </Button>
        </div>
      </div>

      {/* Main canvas area */}
      <div className="flex-1 flex flex-col">
        <div className="h-14 border-b border-[#2a2d3d] flex items-center justify-between px-4">
          <div className="flex items-center">
            <h2 className="text-lg font-medium mr-4">{isNewCommand ? "Creating new command" : "Editing command"}</h2>
            <Input
              placeholder="Command name"
              className="w-64 h-8 bg-[#252839] border-[#2a2d3d] text-white"
              value={commandName}
              onChange={(e) => {
                setCommandName(e.target.value)
                // Also update the command block
                setBlocks((prev) =>
                  prev.map((block) =>
                    block.type === "command" ? { ...block, data: { ...block.data, name: e.target.value } } : block,
                  ),
                )
              }}
            />
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => router.push(`/dashboard/servers/${serverId}/commands`)}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={isLoading} className="bg-[#3b82f6] hover:bg-[#2563eb] btn-pulse">
              <Save size={16} className="mr-2" />
              {isLoading ? "Saving..." : "Save Command"}
            </Button>
          </div>
        </div>

        {/* Canvas for blocks */}
        <div
          ref={canvasRef}
          className="flex-1 relative bg-[#1e2030] overflow-auto"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          style={{ backgroundImage: "radial-gradient(#2a2d3d 1px, transparent 1px)", backgroundSize: "20px 20px" }}
        >
          {/* Render blocks */}
          {blocks.map((block) => (
            <BlockComponent
              key={block.id}
              block={block}
              isSelected={selectedBlock?.id === block.id}
              onSelect={() => handleBlockSelect(block)}
              onMove={handleBlockMove}
              onConnectionStart={handleConnectionStart}
              onConnectionEnd={handleConnectionEnd}
              isConnecting={isConnecting}
              connectionStart={connectionStart}
            />
          ))}

          {/* Render connections */}
          <svg className="absolute inset-0 pointer-events-none">
            {connections.map((connection) => {
              const fromBlock = blocks.find((b) => b.id === connection.fromId)
              const toBlock = blocks.find((b) => b.id === connection.toId)

              if (!fromBlock || !toBlock) return null

              const fromX = fromBlock.position.x + 100 // Center of block
              const fromY = fromBlock.position.y + 60 // Bottom of block
              const toX = toBlock.position.x + 100 // Center of block
              const toY = toBlock.position.y // Top of block

              // Create a curved path
              const midY = (fromY + toY) / 2
              const path = `M${fromX},${fromY} C${fromX},${midY} ${toX},${midY} ${toX},${toY}`

              let strokeColor = "#3b82f6" // Default blue
              if (fromBlock.blockType === "options" || toBlock.blockType === "options") {
                strokeColor = "#a855f7" // Purple for options
              } else if (fromBlock.blockType === "conditions" || toBlock.blockType === "conditions") {
                strokeColor = "#22c55e" // Green for conditions
              }

              // Special case for "else" connections
              if (fromBlock.blockType === "conditions" && connection.fromSocket === "else") {
                strokeColor = "#ef4444" // Red for else
              }

              return (
                <g key={connection.id} className="animate-fade-in">
                  <path
                    d={path}
                    fill="none"
                    stroke={strokeColor}
                    strokeWidth="2"
                    strokeDasharray={
                      fromBlock.blockType === "conditions" && connection.fromSocket === "else" ? "5,5" : "none"
                    }
                    className={
                      fromBlock.blockType === "conditions" && connection.fromSocket === "else" ? "animate-dash" : ""
                    }
                  />
                  {/* Connection dots */}
                  <circle cx={fromX} cy={fromY} r="4" fill={strokeColor} className="animate-pulse-slow" />
                  <circle cx={toX} cy={toY} r="4" fill={strokeColor} className="animate-pulse-slow" />
                </g>
              )
            })}

            {/* Draw active connection line when connecting */}
            {isConnecting && connectionStart && (
              <ConnectionLine
                startBlock={blocks.find((b) => b.id === connectionStart.id)}
                connectionStart={connectionStart}
                mousePosition={{ x: 0, y: 0 }} // This will be updated in the component
              />
            )}
          </svg>
        </div>
      </div>

      {/* Right sidebar - Block properties */}
      {selectedBlock && (
        <div className="w-96 border-l border-[#2a2d3d] flex flex-col animate-slide-in-right">
          <div className="h-14 border-b border-[#2a2d3d] flex items-center justify-between px-4">
            <h2 className="text-lg font-medium">Block Settings</h2>
            <Button variant="ghost" size="icon" onClick={() => setSelectedBlock(null)}>
              <X size={18} />
            </Button>
          </div>

          <ScrollArea className="flex-1 p-4">
            <BlockProperties
              block={selectedBlock}
              onChange={handleBlockChange}
              onDelete={() => handleBlockDelete(selectedBlock.id)}
            />
          </ScrollArea>
        </div>
      )}
    </div>
  )
}

// Connection line component for active connections
const ConnectionLine = ({
  startBlock,
  connectionStart,
  mousePosition,
}: {
  startBlock: BlockData | undefined
  connectionStart: { id: string; socket: string }
  mousePosition: { x: number; y: number }
}) => {
  const [mousePos, setMousePos] = useState(mousePosition)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY })
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
    }
  }, [])

  if (!startBlock) return null

  // Calculate start position
  let startX = startBlock.position.x + 100 // Center of block
  let startY = startBlock.position.y

  if (connectionStart.socket === "output") {
    startY = startBlock.position.y + 60 // Bottom of block
  } else if (connectionStart.socket === "else") {
    startX = startBlock.position.x + 200 // Right side of block
    startY = startBlock.position.y + 30 // Middle of block
  }

  // Get color based on block type
  let strokeColor = "#3b82f6" // Default blue
  if (startBlock.blockType === "options") {
    strokeColor = "#a855f7" // Purple for options
  } else if (startBlock.blockType === "conditions") {
    if (connectionStart.socket === "else") {
      strokeColor = "#ef4444" // Red for else
    } else {
      strokeColor = "#22c55e" // Green for conditions
    }
  }

  // Create a curved path
  const midY = (startY + mousePos.y) / 2
  const path = `M${startX},${startY} C${startX},${midY} ${mousePos.x},${midY} ${mousePos.x},${mousePos.y}`

  return (
    <g>
      <path
        d={path}
        fill="none"
        stroke={strokeColor}
        strokeWidth="2"
        strokeDasharray={connectionStart.socket === "else" ? "5,5" : "none"}
        className="animate-pulse-slow"
      />
      <circle cx={startX} cy={startY} r="4" fill={strokeColor} />
      <circle cx={mousePos.x} cy={mousePos.y} r="4" fill={strokeColor} className="animate-pulse-glow" />
    </g>
  )
}

// Block component
export const BlockComponent = ({
  block,
  isSelected,
  onSelect,
  onMove,
  onConnectionStart,
  onConnectionEnd,
  isConnecting,
  connectionStart,
}: {
  block: BlockData
  isSelected: boolean
  onSelect: () => void
  onMove: (id: string, position: { x: number; y: number }) => void
  onConnectionStart: (blockId: string, socket: string) => void
  onConnectionEnd: (blockId: string, socket: string) => void
  isConnecting: boolean
  connectionStart: { id: string; socket: string } | null
}) => {
  const [isDragging, setIsDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })

  // Determine block color based on type
  let blockColor = "#3b82f6" // Default blue for actions
  if (block.blockType === "options") {
    blockColor = "#a855f7" // Purple for options
  } else if (block.blockType === "conditions") {
    blockColor = "#22c55e" // Green for conditions
  } else if (block.type === "error-handler") {
    blockColor = "#ef4444" // Red for error handler
  } else if (block.type === "command") {
    blockColor = "#f59e0b" // Amber for command block
  }

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging) return
    const x = e.clientX - dragOffset.x
    const y = e.clientY - dragOffset.y
    onMove(block.id, { x, y })
  }, [isDragging, dragOffset, onMove, block.id])

  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
    document.removeEventListener("mousemove", handleMouseMove)
    document.removeEventListener("mouseup", handleMouseUp)
  }, [setIsDragging, handleMouseMove])

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
    onSelect()
    setIsDragging(true)
    const rect = (e.target as HTMLElement).getBoundingClientRect()
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    })
    document.addEventListener("mousemove", handleMouseMove)
    document.addEventListener("mouseup", handleMouseUp)
  }, [onSelect, setIsDragging, setDragOffset, handleMouseMove, handleMouseUp])

  // Clean up event listeners
  useEffect(() => {
    return () => {
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseup", handleMouseUp)
    }
  }, [handleMouseDown, handleMouseUp, handleMouseMove])

  // Get block icon
  const getBlockIcon = () => {
    switch (block.type) {
      case "command":
        return "/"
      case "send-message":
        return "M"
      case "embed-reply":
        return "E"
      case "error-handler":
        return "!"
      case "comparison":
        return "C"
      case "text-option":
        return "T"
      case "number-option":
        return "N"
      default:
        return "?"
    }
  }

  // Handle connection socket interactions
  const handleSocketMouseDown = (e: React.MouseEvent, socket: string) => {
    e.stopPropagation()
    onConnectionStart(block.id, socket)
  }

  const handleSocketMouseUp = (e: React.MouseEvent, socket: string) => {
    e.stopPropagation()
    if (isConnecting && connectionStart && connectionStart.id !== block.id) {
      onConnectionEnd(block.id, socket)
    }
  }

  return (
    <div
      className={cn(
        "absolute w-[200px] rounded-md overflow-hidden transition-all duration-300 animate-scale-in will-animate",
        isSelected ? "ring-2 ring-white shadow-lg" : "hover:shadow-md",
        isDragging ? "opacity-90 scale-105" : "",
      )}
      style={{
        left: `${block.position.x}px`,
        top: `${block.position.y}px`,
        cursor: isDragging ? "grabbing" : "grab",
      }}
    >
      {/* Block header */}
      <div
        className="h-10 flex items-center px-3 text-white"
        style={{ backgroundColor: blockColor }}
        onMouseDown={handleMouseDown}
      >
        <div className="w-6 h-6 rounded bg-white/20 flex items-center justify-center mr-2 text-sm font-medium">
          {getBlockIcon()}
        </div>
        <div className="font-medium truncate">{block.label}</div>
      </div>

      {/* Block content */}
      <div className="bg-[#252839] p-3 border border-[#2a2d3d] border-t-0">
        <div className="text-xs text-gray-300">
          {block.type === "command" && <div>Command: /{block.data.name || "unnamed"}</div>}
          {block.type === "send-message" && (
            <div className="truncate">{block.data.content || "No message content"}</div>
          )}
          {block.type === "embed-reply" && <div className="truncate">{block.data.title || "No embed title"}</div>}
          {block.type === "comparison" && (
            <div className="truncate">
              {block.data.leftValue || "[Value 1]"} {getComparisonOperator(block.data.comparisonType)}{" "}
              {block.data.rightValue || "[Value 2]"}
            </div>
          )}
          {block.type === "text-option" && <div className="truncate">Option: {block.data.name || "unnamed"}</div>}
          {block.type === "error-handler" && <div className="truncate">Handles errors during execution</div>}
        </div>
      </div>

      {/* Connection points */}
      {block.type !== "command" && (
        <div
          className={cn(
            "absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-[#252839] border-2 cursor-pointer transition-all duration-300",
            isConnecting && connectionStart?.id !== block.id
              ? "scale-125 animate-pulse-glow"
              : "hover:scale-110 hover:animate-pulse-glow",
          )}
          style={{ borderColor: blockColor }}
          title="Connect from"
          onMouseUp={(e) => handleSocketMouseUp(e, "input")}
        />
      )}

      <div
        className={cn(
          "absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 w-4 h-4 rounded-full bg-[#252839] border-2 cursor-pointer transition-all duration-300",
          isConnecting && connectionStart?.id === block.id && connectionStart.socket === "output"
            ? "scale-125 animate-pulse-glow"
            : "hover:scale-110 hover:animate-pulse-glow",
        )}
        style={{ borderColor: blockColor }}
        title="Connect to"
        onMouseDown={(e) => handleSocketMouseDown(e, "output")}
      />

      {/* Condition blocks have an additional "else" output */}
      {block.type === "comparison" && (
        <div
          className={cn(
            "absolute bottom-0 right-0 transform translate-x-1/2 translate-y-1/2 w-4 h-4 rounded-full bg-[#252839] border-2 border-[#ef4444] cursor-pointer transition-all duration-300",
            isConnecting && connectionStart?.id === block.id && connectionStart.socket === "else"
              ? "scale-125 animate-pulse-glow"
              : "hover:scale-110 hover:animate-pulse-glow",
          )}
          title="Else"
          onMouseDown={(e) => handleSocketMouseDown(e, "else")}
        />
      )}
    </div>
  )
}

// Block properties component
export const BlockProperties = ({
  block,
  onChange,
  onDelete,
}: {
  block: BlockData
  onChange: (data: Partial<BlockData['data']>) => void
  onDelete: () => void
}) => {
  // Render different properties based on block type
  const renderProperties = () => {
    switch (block.type) {
      case "command":
        return (
          <div className="space-y-4 animate-fade-in">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Command Name</label>
              <Input
                placeholder="e.g., ban, kick, help"
                className="bg-[#252839] border-[#2a2d3d] text-white"
                value={block.data.name || ""}
                onChange={(e) => onChange({ name: e.target.value })}
              />
              <p className="text-xs text-gray-400 mt-1">The name users will type to trigger this command.</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Description</label>
              <Input
                placeholder="Describe what this command does"
                className="bg-[#252839] border-[#2a2d3d] text-white"
                value={block.data.description || ""}
                onChange={(e) => onChange({ description: e.target.value })}
              />
              <p className="text-xs text-gray-400 mt-1">Shown in the help menu and command list.</p>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="hideReplies"
                checked={block.data.hideReplies || false}
                onChange={(e) => onChange({ hideReplies: e.target.checked })}
                className="rounded bg-[#252839] border-[#2a2d3d] text-[#3b82f6]"
              />
              <label htmlFor="hideReplies" className="text-sm text-gray-300">
                Hide bot's replies from everyone but the executor
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Cooldown (seconds)</label>
              <div className="flex gap-2">
                <select
                  className="bg-[#252839] border-[#2a2d3d] text-white rounded-md p-2 flex-1"
                  value={block.data.cooldownType || 'user'}
                  onChange={(e) => onChange({ cooldownType: e.target.value as 'user' | 'server' })}
                >
                  <option value="user">Per User</option>
                  <option value="server">Per Server</option>
                </select>
                <Input
                  type="number"
                  min="0"
                  className="bg-[#252839] border-[#2a2d3d] text-white w-24"
                  value={block.data.cooldown || 0}
                  onChange={(e) => onChange({ cooldown: Number.parseInt(e.target.value) || 0 })}
                />
              </div>
            </div>
          </div>
        )

      case "send-message":
        return (
          <div className="space-y-4 animate-fade-in">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Message Content</label>
              <textarea
                placeholder="Enter your message content"
                className="w-full h-32 bg-[#252839] border-[#2a2d3d] text-white rounded-md p-2"
                value={block.data.content || ""}
                onChange={(e) => onChange({ content: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Send To</label>
              <select
                className="w-full bg-[#252839] border-[#2a2d3d] text-white rounded-md p-2"
                value={block.data.channel || 'same_channel'}
                onChange={(e) => onChange({ channel: e.target.value as 'same_channel' | 'dm' | 'custom_channel' })}
              >
                <option value="same_channel">Same Channel</option>
                <option value="dm">DM User</option>
                <option value="custom_channel">Custom Channel</option>
              </select>
            </div>

            {block.data.channel === "dm" && (
              <div className="animate-fade-in">
                <label className="block text-sm font-medium text-gray-300 mb-1">User ID</label>
                <Input
                  placeholder="Enter user ID or {{variable}}"
                  className="bg-[#252839] border-[#2a2d3d] text-white"
                  value={block.data.userId || ""}
                  onChange={(e) => onChange({ userId: e.target.value })}
                />
              </div>
            )}

            {block.data.channel === "custom_channel" && (
              <div className="animate-fade-in">
                <label className="block text-sm font-medium text-gray-300 mb-1">Channel ID</label>
                <Input
                  placeholder="Enter channel ID or {{variable}}"
                  className="bg-[#252839] border-[#2a2d3d] text-white"
                  value={block.data.channelId || ""}
                  onChange={(e) => onChange({ channelId: e.target.value })}
                />
              </div>
            )}

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="ephemeral"
                checked={block.data.ephemeral || false}
                onChange={(e) => onChange({ ephemeral: e.target.checked })}
                className="rounded bg-[#252839] border-[#2a2d3d] text-[#3b82f6]"
              />
              <label htmlFor="ephemeral" className="text-sm text-gray-300">
                Ephemeral (Only visible to command user)
              </label>
            </div>
          </div>
        )

      case "embed-reply":
        return (
          <div className="space-y-4 animate-fade-in">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Embed Title</label>
              <Input
                placeholder="Enter embed title"
                className="bg-[#252839] border-[#2a2d3d] text-white"
                value={block.data.title || ""}
                onChange={(e) => onChange({ title: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Embed Description</label>
              <textarea
                placeholder="Enter embed description"
                className="w-full h-32 bg-[#252839] border-[#2a2d3d] text-white rounded-md p-2"
                value={block.data.description || ""}
                onChange={(e) => onChange({ description: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Embed Color</label>
              <div className="flex gap-2">
                <input
                  type="color"
                  className="bg-[#252839] border-[#2a2d3d] h-10 w-10"
                  value={block.data.color || "#0099ff"}
                  onChange={(e) => onChange({ color: e.target.value })}
                />
                <Input
                  placeholder="#0099ff"
                  className="bg-[#252839] border-[#2a2d3d] text-white flex-1"
                  value={block.data.color || "#0099ff"}
                  onChange={(e) => onChange({ color: e.target.value })}
                />
              </div>
            </div>
          </div>
        )

      case "comparison":
        return (
          <div className="space-y-4 animate-fade-in">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Left Value</label>
              <Input
                placeholder="Enter value or {{variable}}"
                className="bg-[#252839] border-[#2a2d3d] text-white"
                value={block.data.leftValue || ""}
                onChange={(e) => onChange({ leftValue: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Comparison Type</label>
              <select
                className="w-full bg-[#252839] border-[#2a2d3d] text-white rounded-md p-2"
                value={block.data.comparisonType || 'equal_to'}
                onChange={(e) => onChange({ comparisonType: e.target.value as BlockData['data']['comparisonType'] })}
              >
                <option value="equal_to">Equal to</option>
                <option value="not_equal_to">Not equal to</option>
                <option value="greater_than">Greater than</option>
                <option value="less_than">Less than</option>
                <option value="greater_than_equal">Greater than or equal to</option>
                <option value="less_than_equal">Less than or equal to</option>
                <option value="contains">Contains</option>
                <option value="not_contains">Does not contain</option>
                <option value="starts_with">Starts with</option>
                <option value="ends_with">Ends with</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Right Value</label>
              <Input
                placeholder="Enter value or {{variable}}"
                className="bg-[#252839] border-[#2a2d3d] text-white"
                value={block.data.rightValue || ""}
                onChange={(e) => onChange({ rightValue: e.target.value })}
              />
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="hasElseNode"
                checked={block.data.hasElseNode || false}
                onChange={(e) => onChange({ hasElseNode: e.target.checked })}
                className="rounded bg-[#252839] border-[#2a2d3d] text-[#3b82f6]"
              />
              <label htmlFor="hasElseNode" className="text-sm text-gray-300">
                Include Else Path
              </label>
            </div>
          </div>
        )

      case "text-option":
      case "number-option":
        return (
          <div className="space-y-4 animate-fade-in">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Option Name</label>
              <Input
                placeholder="e.g., user, reason, amount"
                className="bg-[#252839] border-[#2a2d3d] text-white"
                value={block.data.name || ""}
                onChange={(e) => onChange({ name: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Description</label>
              <Input
                placeholder="Describe what this option is for"
                className="bg-[#252839] border-[#2a2d3d] text-white"
                value={block.data.description || ""}
                onChange={(e) => onChange({ description: e.target.value })}
              />
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="required"
                checked={block.data.required || false}
                onChange={(e) => onChange({ required: e.target.checked })}
                className="rounded bg-[#252839] border-[#2a2d3d] text-[#3b82f6]"
              />
              <label htmlFor="required" className="text-sm text-gray-300">
                Required Option
              </label>
            </div>

            {block.type === "number-option" && (
              <div className="grid grid-cols-2 gap-4 animate-fade-in">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Min Value</label>
                  <Input
                    type="number"
                    className="bg-[#252839] border-[#2a2d3d] text-white"
                    value={block.data.min || ""}
                    onChange={(e) => onChange({ min: e.target.value ? Number.parseInt(e.target.value) : null })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Max Value</label>
                  <Input
                    type="number"
                    className="bg-[#252839] border-[#2a2d3d] text-white"
                    value={block.data.max || ""}
                    onChange={(e) => onChange({ max: e.target.value ? Number.parseInt(e.target.value) : null })}
                  />
                </div>
              </div>
            )}
          </div>
        )

      case "error-handler":
        return (
          <div className="space-y-4 animate-fade-in">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Error Message</label>
              <textarea
                placeholder="Enter error message"
                className="w-full h-32 bg-[#252839] border-[#2a2d3d] text-white rounded-md p-2"
                value={block.data.errorMessage || ""}
                onChange={(e) => onChange({ errorMessage: e.target.value })}
              />
              <p className="text-xs text-gray-400 mt-1">This message will be shown when an error occurs.</p>
            </div>
          </div>
        )

      default:
        return <div className="text-gray-400">No properties available for this block type.</div>
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-4 flex items-center">
          <span className="gradient-text">{block.label}</span>
          <ChevronRight className="mx-1 text-gray-500" size={16} />
          <span className="text-gray-400 text-sm">Settings</span>
        </h3>
        {renderProperties()}
      </div>

      <div className="animate-fade-in animation-delay-300">
        <label className="block text-sm font-medium text-gray-300 mb-1">Block Label</label>
        <Input
          placeholder="Custom label for this block"
          className="bg-[#252839] border-[#2a2d3d] text-white"
          value={block.label}
          onChange={(e) => {
            const updatedBlock = { ...block, label: e.target.value }
            onChange(updatedBlock.data)
          }}
        />
        <p className="text-xs text-gray-400 mt-1">
          Add an optional label to this block. This will change how the block appears in the builder.
        </p>
      </div>

      {/* Don't show delete button for command block */}
      {block.type !== "command" && (
        <div className="pt-4 border-t border-[#2a2d3d] animate-fade-in animation-delay-500">
          <Button variant="destructive" className="w-full bg-red-600 hover:bg-red-700 btn-pulse" onClick={onDelete}>
            Delete Block
          </Button>
        </div>
      )}
    </div>
  )
}

// Helper function to get comparison operator display text
function getComparisonOperator(type: string | undefined): string {
  switch (type) {
    case "equal_to":
      return "=="
    case "not_equal_to":
      return "!="
    case "greater_than":
      return ">"
    case "less_than":
      return "<"
    case "greater_than_equal":
      return ">="
    case "less_than_equal":
      return "<="
    case "contains":
      return "contains"
    case "not_contains":
      return "doesn't contain"
    case "starts_with":
      return "starts with"
    case "ends_with":
      return "ends with"
    default:
      return "=="
  }
}

export default CommandBuilder
