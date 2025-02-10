import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { FolderTree, ListTodo, ChevronDown, ChevronRight, FileText, Code, Eye } from 'lucide-react';
import Editor from "@monaco-editor/react";

interface FileNode {
  id: number;
  name: string;
  type: 'file' | 'folder';
  content?: string;
  children?: FileNode[];
}

interface Tab {
  id: 'code' | 'preview';
  icon: React.ReactNode;
  label: string;
}

const BuilderPage = () => {
  const location = useLocation();
  const { prompt } = location.state || { prompt: '' };
  const [expandedFolders, setExpandedFolders] = useState<number[]>([]);
  const [selectedFile, setSelectedFile] = useState<FileNode | null>(null);
  const [activeTab, setActiveTab] = useState<'code' | 'preview'>('code');

  const tabs: Tab[] = [
    { id: 'code', icon: <Code className="h-4 w-4" />, label: 'Code' },
    { id: 'preview', icon: <Eye className="h-4 w-4" />, label: 'Preview' }
  ];

  // Mock steps for demonstration
  const steps = [
    { id: 1, title: 'Initialize Project', status: 'completed' },
    { id: 2, title: 'Setup Dependencies', status: 'in-progress' },
    { id: 3, title: 'Generate Components', status: 'pending' },
    { id: 4, title: 'Style Implementation', status: 'pending' },
  ];

  // Mock file structure with content
  const files: FileNode[] = [
    { 
      id: 1, 
      name: 'index.html', 
      type: 'file',
      content: '<!DOCTYPE html>\n<html lang="en">\n  <head>\n    <meta charset="UTF-8" />\n    <title>Generated Website</title>\n  </head>\n  <body>\n    <div id="root"></div>\n  </body>\n</html>'
    },
    { 
      id: 2, 
      name: 'src', 
      type: 'folder',
      children: [
        { 
          id: 3, 
          name: 'App.tsx', 
          type: 'file',
          content: 'import React from "react";\n\nfunction App() {\n  return (\n    <div>\n      <h1>Hello World</h1>\n    </div>\n  );\n}\n\nexport default App;'
        },
        { 
          id: 4, 
          name: 'components', 
          type: 'folder',
          children: [
            { 
              id: 5, 
              name: 'Header.tsx', 
              type: 'file',
              content: 'import React from "react";\n\nexport const Header = () => {\n  return (\n    <header>\n      <h1>Website Header</h1>\n    </header>\n  );\n};'
            }
          ]
        },
      ]
    },
  ];

  const toggleFolder = (folderId: number) => {
    setExpandedFolders(prev => 
      prev.includes(folderId)
        ? prev.filter(id => id !== folderId)
        : [...prev, folderId]
    );
  };

  const getLanguageFromFileName = (fileName: string): string => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'html':
        return 'html';
      case 'css':
        return 'css';
      case 'js':
        return 'javascript';
      case 'jsx':
        return 'javascript';
      case 'ts':
        return 'typescript';
      case 'tsx':
        return 'typescript';
      case 'json':
        return 'json';
      default:
        return 'plaintext';
    }
  };

  const renderFileTree = (nodes: FileNode[], level = 0) => {
    return nodes.map((node) => (
      <div key={node.id} style={{ marginLeft: `${level * 16}px` }}>
        <div 
          className={`flex items-center gap-2 py-2 px-2 rounded hover:bg-gray-800 cursor-pointer ${
            selectedFile?.id === node.id ? 'bg-gray-800' : ''
          }`}
          onClick={() => {
            if (node.type === 'folder') {
              toggleFolder(node.id);
            } else {
              setSelectedFile(node);
              setActiveTab('code');
            }
          }}
        >
          {node.type === 'folder' && (
            expandedFolders.includes(node.id) 
              ? <ChevronDown className="h-4 w-4 text-gray-400" />
              : <ChevronRight className="h-4 w-4 text-gray-400" />
          )}
          {node.type === 'folder' ? (
            <FolderTree className="h-4 w-4 text-indigo-400" />
          ) : (
            <FileText className="h-4 w-4 text-gray-400" />
          )}
          <span className="text-gray-300">{node.name}</span>
        </div>
        {node.type === 'folder' && expandedFolders.includes(node.id) && node.children && (
          <div>{renderFileTree(node.children, level + 1)}</div>
        )}
      </div>
    ));
  };

  const renderContent = () => {
    if (!selectedFile) {
      return (
        <div className="text-gray-500 italic p-4">
          Click on a file in the explorer to view its contents
        </div>
      );
    }

    if (activeTab === 'preview') {
      return (
        <iframe
          title="Preview"
          className="w-full h-full bg-white"
          srcDoc={selectedFile.content}
          sandbox="allow-scripts"
        />
      );
    }

    return (
      <Editor
        height="100%"
        defaultLanguage={getLanguageFromFileName(selectedFile.name)}
        defaultValue={selectedFile.content}
        theme="vs-dark"
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          wordWrap: 'on',
          readOnly: true,
          automaticLayout: true,
        }}
      />
    );
  };

  return (
    <div className="min-h-screen bg-gray-900 flex">
      {/* Steps Panel */}
      <div className="w-80 bg-gray-800 border-r border-gray-700 p-6">
        <div className="flex items-center gap-2 mb-6">
          <ListTodo className="h-6 w-6 text-indigo-400" />
          <h2 className="text-xl font-semibold text-white">Build Steps</h2>
        </div>
        <div className="space-y-4">
          {steps.map((step) => (
            <div
              key={step.id}
              className={`p-4 rounded-lg ${
                step.status === 'completed'
                  ? 'bg-green-900/50 text-green-400'
                  : step.status === 'in-progress'
                  ? 'bg-indigo-900/50 text-indigo-400'
                  : 'bg-gray-800 text-gray-400'
              }`}
            >
              <div className="font-medium">{step.title}</div>
              <div className="text-sm mt-1 opacity-80">
                {step.status.charAt(0).toUpperCase() + step.status.slice(1)}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-2 text-white">Building Your Website</h1>
          <p className="text-gray-400">Based on prompt: {prompt}</p>
        </div>

        <div className="grid grid-cols-2 gap-6 h-[calc(100vh-12rem)]">
          {/* File Explorer */}
          <div className="bg-gray-800 rounded-lg shadow-lg border border-gray-700">
            <div className="p-4 border-b border-gray-700 flex items-center gap-2">
              <FolderTree className="h-5 w-5 text-indigo-400" />
              <h2 className="font-semibold text-white">File Explorer</h2>
            </div>
            <div className="p-4">
              {renderFileTree(files)}
            </div>
          </div>

          {/* Editor/Preview Panel */}
          <div className="bg-gray-800 rounded-lg shadow-lg border border-gray-700 flex flex-col">
            {/* Tabs */}
            <div className="flex border-b border-gray-700">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'text-white border-b-2 border-indigo-500'
                      : 'text-gray-400 hover:text-gray-300'
                  }`}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-hidden">
              {renderContent()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuilderPage;