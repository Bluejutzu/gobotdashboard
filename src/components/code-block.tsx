"use client"

import { useEffect } from "react"
import Prism from "prismjs"
import "prismjs/themes/prism-tomorrow.css"
import "prismjs/components/prism-typescript"
import "prismjs/components/prism-jsx"
import "prismjs/components/prism-tsx"

interface CodeBlockProps {
    code: string
    language: string
    filename?: string
}

export function CodeBlock({ code, language, filename }: CodeBlockProps) {
    useEffect(() => {
        Prism.highlightAll()
    }, [code])

    return (
        <div className="code-block-wrapper">
            {filename && (
                <div className="code-filename">
                    <span>{filename}</span>
                </div>
            )}
            <pre className={`language-${language}`}>
                <code>{code}</code>
            </pre>
            <style jsx>{`
        .code-block-wrapper {
          position: relative;
          margin: 1rem 0;
          border-radius: 0.5rem;
          overflow: hidden;
        }
        .code-filename {
          background-color: #2d2d2d;
          color: #ccc;
          font-family: monospace;
          font-size: 0.875rem;
          padding: 0.5rem 1rem;
          border-bottom: 1px solid #444;
        }
        pre {
          margin: 0;
          padding: 1rem;
          overflow-x: auto;
          background-color: #1e1e1e;
        }
        code {
          font-family: 'Fira Code', Consolas, Monaco, 'Andale Mono', 'Ubuntu Mono', monospace;
          font-size: 0.875rem;
          line-height: 1.5;
        }
      `}</style>
        </div>
    )
}
