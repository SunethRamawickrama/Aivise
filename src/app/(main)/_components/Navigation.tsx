"use client";

import { cn } from "@/lib/utils";
import { ChevronsLeft, FileText, MenuIcon, ChevronDown, Plus, Folder as FolderIcon, Upload } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { useMediaQuery } from "usehooks-ts";
import { usePathname, useRouter } from "next/navigation";

interface Item {
  id: string;
  name: string;
  fileUrl: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
}

interface FolderStructure {
  id: string;
  name: string;
  files: Item[];
}

function Navigation() {
  const pathname = usePathname();
  const router = useRouter();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [items, setItems] = useState<Item[]>([]);
  const [isDocumentsOpen, setIsDocumentsOpen] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [isAddingFolder, setIsAddingFolder] = useState(false);
  const [draggedItem, setDraggedItem] = useState<Item | null>(null);
  const [isDraggingOver, setIsDraggingOver] = useState<string | null>(null);
  const [openFolders, setOpenFolders] = useState<Set<string>>(new Set());
  const [isCreatingNew, setIsCreatingNew] = useState<'none' | 'file' | 'folder'>('none');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isResizingRef = useRef(false);
  const sidebarRef = useRef<HTMLElement | null>(null);
  const navbarRef = useRef<HTMLDivElement | null>(null);

  const [isResetting, setIsResetting] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(isMobile);

  // Organize items into folder structure
  const folderStructure = React.useMemo(() => {
    const folders = new Map<string, FolderStructure>();
    const rootFiles: Item[] = [];

    items.forEach(item => {
      if (!item.fileUrl) {
        // This is a folder
        folders.set(item.id, {
          id: item.id,
          name: item.name,
          files: [],
        });
      } else {
        // This is a file
        const pathParts = item.name.split('/');
        if (pathParts.length === 1) {
          // No folder prefix, this is a root file
          rootFiles.push(item);
        } else {
          // File is in a folder
          const folderName = pathParts[0];
          const fileName = pathParts[pathParts.length - 1];
          
          // Find the folder by name
          const folder = Array.from(folders.values()).find(f => f.name === folderName);
          if (folder) {
            folder.files.push({
              ...item,
              name: fileName,
            });
          } else {
            // If folder doesn't exist yet, create it
            const newFolder: FolderStructure = {
              id: item.id, // Use file's ID as folder ID temporarily
              name: folderName,
              files: [{
                ...item,
                name: fileName,
              }],
            };
            folders.set(newFolder.id, newFolder);
          }
        }
      }
    });

    return {
      folders: Array.from(folders.values()),
      rootFiles,
    };
  }, [items]);

  const toggleFolder = (folderId: string) => {
    setOpenFolders(prev => {
      const newOpenFolders = new Set(prev);
      if (newOpenFolders.has(folderId)) {
        newOpenFolders.delete(folderId);
      } else {
        newOpenFolders.add(folderId);
      }
      return newOpenFolders;
    });
  };

  useEffect(() => {
    if (isMobile) {
      collapse();
    }
  }, [pathname, isMobile]);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await fetch('/api/folders');
        if (response.ok) {
          const data = await response.json();
          setItems(data);
        }
      } catch (error) {
        console.error('Error fetching items:', error);
      }
    };

    fetchItems();
  }, []);

  const handleCreateFolder = async () => {
    if (!newFolderName.trim()) return;

    try {
      const response = await fetch('/api/folders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: newFolderName }),
      });

      if (response.ok) {
        const newFolder = await response.json();
        setItems([newFolder, ...items]);
        setNewFolderName("");
        setIsAddingFolder(false);
      }
    } catch (error) {
      console.error('Error creating folder:', error);
    }
  };

  const handleDragStart = (item: Item) => {
    if (!item.fileUrl) return; // Only allow dragging files
    setDraggedItem(item);
  };

  const handleDragOver = (e: React.DragEvent, folderId: string) => {
    e.preventDefault();
    setIsDraggingOver(folderId);
  };

  const handleDragLeave = () => {
    setIsDraggingOver(null);
  };

  const handleDrop = async (folderId: string) => {
    if (!draggedItem) return;

    try {
      const response = await fetch('/api/folders/move', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fileId: draggedItem.id,
          folderId,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        console.error('Error moving file:', error);
        return;
      }

      // Refresh the items list
      const updatedResponse = await fetch('/api/folders');
      if (updatedResponse.ok) {
        const updatedData = await updatedResponse.json();
        setItems(updatedData);
        
        // Open the target folder
        setOpenFolders(prev => new Set(prev).add(folderId));
      }
    } catch (error) {
      console.error('Error moving file:', error);
    }

    setDraggedItem(null);
    setIsDraggingOver(null);
  };

  const handleMouseDown = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    event.preventDefault();
    event.stopPropagation();

    isResizingRef.current = true;
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const handleMouseMove = (event: MouseEvent) => {
    if (!isResizingRef.current) return;

    let newWidth = event.clientX;

    if (newWidth < 240) newWidth = 240;
    if (newWidth > 480) newWidth = 480;

    if (sidebarRef.current && navbarRef.current) {
      sidebarRef.current.style.width = `${newWidth}px`;
      navbarRef.current.style.setProperty("left", `${newWidth}px`);
      navbarRef.current.style.setProperty(
        "width",
        `calc(100% - ${newWidth}px)`
      );
    }
  };

  const handleMouseUp = () => {
    isResizingRef.current = false;
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
  };    

  const resetWidth = () => {
    if (sidebarRef.current && navbarRef.current) {
      setIsCollapsed(false);
      setIsResetting(true);

      sidebarRef.current.style.width = isMobile ? "100%" : "240px";

      navbarRef.current.style.setProperty(
        "width",
        isMobile ? "0" : "calc(100% - 240px)"
      );
      navbarRef.current.style.setProperty("left", isMobile ? "100%" : "240px");

      setTimeout(() => {
        setIsResetting(false);
      }, 300);
    }
  };

  const collapse = () => {
    if (sidebarRef.current && navbarRef.current) {
      setIsCollapsed(true);
      setIsResetting(true);

      sidebarRef.current.style.width = "0";
      navbarRef.current.style.setProperty("width", "100%");
      navbarRef.current.style.setProperty("left", "0");

      setTimeout(() => {
        setIsResetting(false);
      }, 300);
    }
  };

  const handleFileUpload = async (file: File, folderId?: string) => {
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    if (folderId) {
      formData.append('folderId', folderId);
    }

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        console.error('Upload error:', error);
        return;
      }

      // Refresh the items list
      const updatedResponse = await fetch('/api/folders');
      if (updatedResponse.ok) {
        const updatedData = await updatedResponse.json();
        setItems(updatedData);
        
        // Open the folder if uploading to one
        if (folderId) {
          setOpenFolders(prev => new Set(prev).add(folderId));
        }
      }
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this item?')) {
      return;
    }

    try {
      const response = await fetch('/api/folders/delete', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
      });

      if (!response.ok) {
        const error = await response.json();
        console.error('Error deleting item:', error);
        return;
      }

      // Refresh the items list
      const updatedResponse = await fetch('/api/folders');
      if (updatedResponse.ok) {
        const updatedData = await updatedResponse.json();
        setItems(updatedData);
      }
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  return (
    <>
      <aside
        ref={sidebarRef}
        className={cn(
          "group/sidebar h-full bg-secondary overflow-y-auto relative flex w-60 flex-col z-[99999]",
          isResetting && "transition-all ease-in-out duration-300",
          isMobile && "w-0"
        )}
      >
        <div
          onClick={collapse}
          role="button"
          className={cn(
            "h-6 w-6 text-muted-foreground rounded-sm hover:bg-neutral-300 dark:hover:bg-neutral-600 absolute top-3 right-2 opacity-0 group-hover/sidebar:opacity-100 transition",
            isMobile && "opacity-100"
          )}
        >
          <ChevronsLeft className="h-6 w-6 hover:cursor-pointer" />
        </div>
        <div>
          <p>Action Items</p>
        </div>

        <div className="mt-4">
          <div 
            className="flex items-center gap-2 cursor-pointer hover:bg-neutral-300 dark:hover:bg-neutral-600 p-2 rounded-sm"
            onClick={() => setIsDocumentsOpen(!isDocumentsOpen)}
          >
            <FileText className="h-5 w-6" />
            <p>Documents</p>
            <ChevronDown className={cn(
              "h-4 w-4 transition-transform",
              isDocumentsOpen && "transform rotate-180"
            )} />
          </div>
          {isDocumentsOpen && (
            <div className="ml-6 mt-2 space-y-1">
              {/* Create new buttons */}
              <div className="flex items-center gap-2 mb-2">
                <button
                  onClick={() => {
                    setIsCreatingNew('folder');
                    setNewFolderName("");
                  }}
                  className="flex items-center gap-1 text-sm px-2 py-1 rounded hover:bg-neutral-300 dark:hover:bg-neutral-600"
                >
                  <FolderIcon className="h-4 w-4" />
                  <span>New Folder</span>
                </button>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-1 text-sm px-2 py-1 rounded hover:bg-neutral-300 dark:hover:bg-neutral-600"
                >
                  <Upload className="h-4 w-4" />
                  <span>Upload File</span>
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      handleFileUpload(file);
                    }
                  }}
                />
              </div>

              {/* New folder/file input */}
              {isCreatingNew === 'folder' && (
                <div className="flex items-center gap-2 mb-2">
                  <input
                    type="text"
                    value={newFolderName}
                    onChange={(e) => setNewFolderName(e.target.value)}
                    placeholder="Folder name"
                    className="text-sm bg-transparent border-b border-gray-300 focus:outline-none"
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleCreateFolder();
                        setIsCreatingNew('none');
                      } else if (e.key === 'Escape') {
                        setIsCreatingNew('none');
                        setNewFolderName("");
                      }
                    }}
                  />
                </div>
              )}

              {/* Display folders and files */}
              {folderStructure.folders.map((folder) => (
                <div key={folder.id} className="space-y-1">
                  <div 
                    className={cn(
                      "flex items-center gap-2 text-sm hover:bg-neutral-300 dark:hover:bg-neutral-600 p-2 rounded-sm cursor-pointer group",
                      isDraggingOver === folder.id && "bg-blue-100 dark:bg-blue-900"
                    )}
                    onClick={() => toggleFolder(folder.id)}
                    onDragOver={(e) => handleDragOver(e, folder.id)}
                    onDragLeave={handleDragLeave}
                    onDrop={() => handleDrop(folder.id)}
                  >
                    <ChevronDown className={cn(
                      "h-4 w-4 transition-transform",
                      !openFolders.has(folder.id) && "-rotate-90"
                    )} />
                    <FolderIcon className="h-4 w-4" />
                    <span>{folder.name}</span>
                    {/* Add delete button to folder */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(folder.id);
                      }}
                      className="ml-auto opacity-0 group-hover:opacity-100 hover:bg-neutral-400 dark:hover:bg-neutral-500 p-1 rounded text-red-500"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                  {openFolders.has(folder.id) && (
                    <div className="ml-4 space-y-1">
                      {folder.files.map((file) => (
                        <div
                          key={file.id}
                          className="flex items-center gap-2 text-sm hover:bg-neutral-300 dark:hover:bg-neutral-600 p-2 rounded-sm cursor-pointer group"
                          draggable
                          onDragStart={() => handleDragStart(file)}
                          onClick={() => router.push(`/space/${file.id}`)}
                        >
                          <FileText className="h-4 w-4" />
                          <span>{file.name}</span>
                          {/* Add delete button to file */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(file.id);
                            }}
                            className="ml-auto opacity-0 group-hover:opacity-100 hover:bg-neutral-400 dark:hover:bg-neutral-500 p-1 rounded text-red-500"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              {folderStructure.rootFiles.map((file) => (
                <div
                  key={file.id}
                  className="flex items-center gap-2 text-sm hover:bg-neutral-300 dark:hover:bg-neutral-600 p-2 rounded-sm cursor-pointer group"
                  draggable
                  onDragStart={() => handleDragStart(file)}
                  onClick={() => router.push(`/space/${file.id}`)}
                >
                  <FileText className="h-4 w-4" />
                  <span>{file.name}</span>
                  {/* Add delete button to root file */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(file.id);
                    }}
                    className="ml-auto opacity-0 group-hover:opacity-100 hover:bg-neutral-400 dark:hover:bg-neutral-500 p-1 rounded text-red-500"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div
          onMouseDown={handleMouseDown}
          onClick={resetWidth}
          className="opacity-0 group-hover/sidebar:opacity-100 transition cursor-ew-resize absolute h-full w-1 bg-primary/10 right-0 top-0"
        />
      </aside>
      <div
        ref={navbarRef}
        className={cn(
          "absolute top-0 z-[99999] left-60 w-[calc(100%-240px)]",
          isResetting && "transition-all ease-in-out duration-300",
          isMobile && "left-0 w-full"
        )}
      >
        <nav className="bg-transparent px-3 py-2 w-full">
          {isCollapsed && (
            <MenuIcon
              onClick={resetWidth}
              role="button"
              className="h-6 w-6 text-muted-foreground hover:cursor-pointer"
            />
          )}
        </nav>
      </div>
    </>
  );
}

export default Navigation;
