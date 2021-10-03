import {
  useCallback,
  useEffect,
  useState,
  useRef,
} from 'react';
import type {
  FC,
} from 'react';

import { PhotoEditor } from '../../../packages/photo-editor/src';

import { Pencil } from './Pencil';

type Tools = {
  pencil: typeof Pencil;
};

export const Draw: FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [currentTool, setCurrentTool] = useState<keyof Tools>(null);
  const photoEditorRef = useRef<PhotoEditor<{
    pencil: typeof Pencil;
  }, 'pencil'>>(null);

  useEffect(() => {
    const photoEditor = new PhotoEditor(canvasRef.current, {
      tools: {
        pencil: Pencil,
      },
    });

    photoEditorRef.current = photoEditor;

    photoEditor.addListener('enableTool', (tool: keyof Tools) => {
      setCurrentTool(tool);
    });
    
    photoEditor.addListener('disableTool', () => {
      setCurrentTool(null);
    });

    return () => {
      photoEditor.removeAllListeners();
      photoEditorRef.current = null;
    };
  }, []);

  const togglePencil = useCallback(() => {
    if (photoEditorRef.current) {
      photoEditorRef.current.toggleTool('pencil');
    }
  }, []);

  const undo = useCallback(() => {
    if (photoEditorRef.current) {
      photoEditorRef.current.undo();
    }
  }, []);

  const redo = useCallback(() => {
    if (photoEditorRef.current) {
      photoEditorRef.current.redo();
    }
  }, []);
  
  return (
    <>
      <div>
        <button
          type="button"
          style={{
            border: currentTool === 'pencil'
              ? '2px solid #aa0000'
              : undefined,
          }}
          onClick={togglePencil}
        >
          Pencil
        </button>

        <button
          type="button"
          onClick={undo}
        >
          Undo
        </button>

        <button
          type="button"
          onClick={redo}
        >
          Redo
        </button>
      </div>

      <div>
        <canvas
          width="640"
          height="480"
          style={{
            border: '2px solid #999',
          }}
          ref={canvasRef}
        />
      </div>
    </>
  );
};
