'use client';

import { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';
import { AlertCircle, Loader2 } from 'lucide-react';
import type { App, Image } from 'leafer-ui';

interface MermaidPreviewProps {
  code: string;
  theme: string;
}

export function MermaidPreview({ code, theme }: MermaidPreviewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const leaferAppRef = useRef<App | null>(null);
  const leaferImageRef = useRef<Image | null>(null);
  const svgToUrlRef = useRef<((svg: string) => string) | null>(null);
  const renderVersionRef = useRef(0);
  const [isLeaferReady, setIsLeaferReady] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!containerRef.current) {
      return;
    }

    let app: App | null = null;
    let disposed = false;

    const initLeafer = async () => {
      const [{ App, Image, Platform }] = await Promise.all([
        import('leafer-ui'),
        import('@leafer-in/editor'),
        import('@leafer-in/viewport'),
        import('@leafer-in/view'),
      ]);

      if (disposed || !containerRef.current) {
        return;
      }

      app = new App({
        view: containerRef.current,
        tree: { type: 'viewport' },
        editor: {
        },
        move: {
          drag: true,
        },
        wheel: { zoomMode: true }
      });
      const image = new Image({
        draggable: true,
      });

      app.tree.add(image);
      leaferAppRef.current = app;
      leaferImageRef.current = image;
      svgToUrlRef.current = (svg: string) => Platform.toURL(svg, 'svg');
      setIsLeaferReady(true);
    };

    initLeafer().catch((err) => {
      console.error('Leafer init error:', err);
      setError(err instanceof Error ? err.message : 'Leafer 初始化失败');
    });

    return () => {
      disposed = true;
      svgToUrlRef.current = null;
      leaferImageRef.current = null;
      leaferAppRef.current = null;
      app?.destroy();
    };
  }, []);

  useEffect(() => {
    // 初始化 Mermaid
    mermaid.initialize({
      startOnLoad: false,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      theme: theme as any,
      securityLevel: 'loose',
      fontFamily: 'Arial, sans-serif',
      fontSize: 14,
      flowchart: {
        useMaxWidth: true,
        htmlLabels: true,
        curve: 'basis',
      },
      sequence: {
        diagramMarginX: 50,
        diagramMarginY: 10,
        actorMargin: 50,
        width: 150,
        height: 65,
        boxMargin: 10,
        boxTextMargin: 5,
        noteMargin: 10,
        messageMargin: 35,
        mirrorActors: true,
        bottomMarginAdj: 1,
        useMaxWidth: true,
      },
      gantt: {
        titleTopMargin: 25,
        barHeight: 20,
        fontSize: 11,
        gridLineStartPadding: 35,
        leftPadding: 75,
        topPadding: 50,
        rightPadding: 75,
      },
    });
  }, [theme]);

  useEffect(() => {
    const renderDiagram = async () => {
      const renderVersion = renderVersionRef.current + 1;
      renderVersionRef.current = renderVersion;

      const app = leaferAppRef.current;
      const image = leaferImageRef.current;
      const svgToUrl = svgToUrlRef.current;

      if (!isLeaferReady || !app || !image || !svgToUrl) {
        return;
      }

      if (!code.trim()) {
        image.url = '';
        setError(null);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        // 生成唯一 ID
        const id = `mermaid-${Date.now()}`;

        // 验证语法
        const isValid = await mermaid.parse(code);

        if (isValid) {
          // 渲染图表
          const { svg } = await mermaid.render(id, code);

          if (renderVersionRef.current !== renderVersion) {
            return;
          }

          image.set({
            url: svgToUrl(svg),
            editable: true,
          });

          requestAnimationFrame(() => {
            if (renderVersionRef.current === renderVersion) {
              app.tree.zoom('fit', 100)
            }
          });
        }
      } catch (err) {
        if (renderVersionRef.current !== renderVersion) {
          return;
        }

        console.error('Mermaid render error:', err);
        setError(err instanceof Error ? err.message : '图表渲染失败');
      } finally {
        if (renderVersionRef.current === renderVersion) {
          setIsLoading(false);
        }
      }
    };

    const timeoutId = setTimeout(renderDiagram, 300);
    return () => clearTimeout(timeoutId);
  }, [code, theme, isLeaferReady]);

  return (
    <div className="relative h-full min-h-0">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-50 bg-opacity-75 z-10">
          <div className="flex items-center gap-2 text-gray-600">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>渲染中...</span>
          </div>
        </div>
      )}

      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-red-50 z-10">
          <div className="flex items-center gap-2 text-red-600 bg-white px-4 py-2 rounded-lg shadow-sm border border-red-200">
            <AlertCircle className="w-5 h-5" />
            <div>
              <div className="font-medium">语法错误</div>
              <div className="text-sm text-red-500">{error}</div>
            </div>
          </div>
        </div>
      )}

      <div
        ref={containerRef}
        className="relative h-full min-h-0 w-full overflow-hidden"
      />

      {!code.trim() && !isLoading && (
        <div className="absolute inset-0 flex items-center justify-center text-gray-400">
          <div className="text-center">
            <div className="text-lg font-medium mb-2">开始编写 Mermaid 代码</div>
            <div className="text-sm">在左侧编辑器中输入代码，这里将显示实时预览</div>
          </div>
        </div>
      )}
    </div>
  );
}
