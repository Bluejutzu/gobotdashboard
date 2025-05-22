"use client";

import { CodeBlock } from "@/components/code-block";

export default function CodeExamplesPage() {
    const useThemeStylesExample = `import { useThemeStyles } from "@/hooks/use-theme-styles"

function MyComponent() {
  const styles = useThemeStyles()
  
  return (
    <div style={{
      backgroundColor: styles.primary,
      borderRadius: styles.borderRadius
    }}>
      Themed content
    </div>
  )
}`;

    const themeWrapperExample = `import { ThemeWrapper } from "@/components/theme-wrapper"

function MyComponent() {
  return (
    <ThemeWrapper
      applyBorderRadius={true}
      applyBackground={true}
      className="p-4"
    >
      Content with themed styles
    </ThemeWrapper>
  )
}`;

    return (
        <div className="container mx-auto py-12 px-4">
            <h1 className="text-3xl font-bold mb-8">Theme System Code Examples</h1>

            <section className="mb-12">
                <h2 className="text-2xl font-semibold mb-4">useThemeStyles Hook</h2>
                <p className="mb-4">
                    The <code>useThemeStyles</code> hook provides access to the current theme's colors and properties.
                </p>
                <CodeBlock code={useThemeStylesExample} language="tsx" filename="components/my-component.tsx" />
            </section>

            <section className="mb-12">
                <h2 className="text-2xl font-semibold mb-4">ThemeWrapper Component</h2>
                <p className="mb-4">
                    The <code>ThemeWrapper</code> component is a convenient way to apply theme styles to any content.
                </p>
                <CodeBlock code={themeWrapperExample} language="tsx" filename="components/another-component.tsx" />
            </section>
        </div>
    );
}
