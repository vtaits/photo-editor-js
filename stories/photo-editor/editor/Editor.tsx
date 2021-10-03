import {
  useCallback,
  useEffect,
  useState,
  useRef,
} from 'react';
import type {
  ChangeEventHandler,
  FC,
} from 'react';
import styled from 'styled-components';

import Image from '../../assets/image.jpeg';

import { PhotoEditor } from '../../../packages/photo-editor/src';
import {
  Blur,
  Crop,
  Contrast,
  Brightness,
  Rectangle,
  RotateLeft,
  RotateRight,
} from '../../../packages/photo-editor/src/tools';

const StyledSource = styled.img({
  display: 'none',
});

type Tools = {
  blur: typeof Blur;
  crop: typeof Crop;
  rectangle: typeof Rectangle;
  rotateLeft: typeof RotateLeft;
  rotateRight: typeof RotateRight;
  contrast: typeof Contrast;
  brightness: typeof Brightness;
};

export const Editor: FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [currentTool, setCurrentTool] = useState<keyof Tools>(null);
  const photoEditorRef = useRef<PhotoEditor<Tools, keyof Tools, 'img'>>(null);
  const sourceRef = useRef<HTMLImageElement>(null);

  const [radius, setRadius] = useState(10);
  const [sigma, setSigma] = useState(3);
  const [contrast, setContrast] = useState(0);
  const [brightness, setBrightness] = useState(0);

  useEffect(() => {
    const photoEditor = new PhotoEditor(canvasRef.current, {
      tools: {
        blur: Blur,
        crop: Crop,
        rectangle: Rectangle,
        rotateLeft: RotateLeft,
        rotateRight: RotateRight,
        contrast: Contrast,
        brightness: Brightness,
      },
      sourceType: 'img',
      source: sourceRef.current,
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

  const toggleBlur = useCallback(() => {
    if (photoEditorRef.current) {
      photoEditorRef.current.toggleTool('blur');
    }
  }, []);

  const onChangeRadius = useCallback<ChangeEventHandler<HTMLInputElement>>((event) => {
    setRadius(Number(event.target.value));
  }, []);

  const onChangeSigma = useCallback<ChangeEventHandler<HTMLInputElement>>((event) => {
    setSigma(Number(event.target.value));
  }, []);

  const toggleRectangle = useCallback(() => {
    if (photoEditorRef.current) {
      photoEditorRef.current.toggleTool('rectangle');
    }
  }, []);

  const toggleCrop = useCallback(() => {
    if (photoEditorRef.current) {
      photoEditorRef.current.toggleTool('crop');
    }
  }, []);

  const applyCrop = useCallback(() => {
    if (photoEditorRef.current) {
      photoEditorRef.current.tools.crop.applyCrop();
    }
  }, []);

  const cancelCrop = useCallback(() => {
    if (photoEditorRef.current) {
      photoEditorRef.current.tools.crop.cancelCrop();
    }
  }, []);

  const toggleContrast = useCallback(() => {
    if (photoEditorRef.current) {
      photoEditorRef.current.toggleTool('contrast');
      setContrast(0);
    }
  }, []);

  const onChangeContrast = useCallback<ChangeEventHandler<HTMLInputElement>>((event) => {
    setContrast(Number(event.target.value));
  }, []);

  const toggleBrightness = useCallback(() => {
    if (photoEditorRef.current) {
      photoEditorRef.current.toggleTool('brightness');
      setBrightness(0);
    }
  }, []);

  const onChangeBrightness = useCallback<ChangeEventHandler<HTMLInputElement>>((event) => {
    setBrightness(Number(event.target.value));
  }, []);

  const rotateLeft = useCallback(() => {
    if (photoEditorRef.current) {
      photoEditorRef.current.enableTool('rotateLeft');
    }
  }, []);

  const rotateRight = useCallback(() => {
    if (photoEditorRef.current) {
      photoEditorRef.current.enableTool('rotateRight');
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
            border: currentTool === 'blur'
              ? '2px solid #aa0000'
              : undefined,
          }}
          onClick={toggleBlur}
        >
          Blur
        </button>

        {
          currentTool === 'blur' && (
            <>
              Blur radius:
              {' '}
              <input
                type="number"
                min="10"
                max="100"
                step="1"
                value={radius}
                onChange={onChangeRadius}
              />
              Blur sigma:
              {' '}
              <input
                type="number"
                min="1"
                max="10"
                step="0.1"
                value={sigma}
                onChange={onChangeSigma}
              />
            </>
          )
        }

        <button
          type="button"
          style={{
            border: currentTool === 'rectangle'
              ? '2px solid #aa0000'
              : undefined,
          }}
          onClick={toggleRectangle}
        >
          Rectangle
        </button>

        <button
          type="button"
          style={{
            border: currentTool === 'crop'
              ? '2px solid #aa0000'
              : undefined,
          }}
          onClick={toggleCrop}
        >
          Crop
        </button>

        {
          currentTool === 'crop' && (
            <>
              <button
                type="button"
                onClick={applyCrop}
              >
                Apply crop
              </button>

              <button
                type="button"
                onClick={cancelCrop}
              >
                Cancel crop
              </button>
            </>
          )
        }

        <button
          type="button"
          onClick={rotateLeft}
        >
          Rotate left
        </button>

        <button
          type="button"
          onClick={rotateRight}
        >
          Rotate right
        </button>

        <button
          type="button"
          style={{
            border: currentTool === 'contrast'
              ? '2px solid #aa0000'
              : undefined,
          }}
          onClick={toggleContrast}
        >
          Contrast
        </button>

        {
          currentTool === 'contrast' && (
            <span>
              <input
                value={contrast}
                type="range"
                min="-1"
                max="1"
                step="0.01"
                onChange={onChangeContrast}
              />
            </span>
          )
        }

        <button
          type="button"
          style={{
            border: currentTool === 'brightness'
              ? '2px solid #aa0000'
              : undefined,
          }}
          onClick={toggleBrightness}
        >
          Brightness
        </button>

        {
          currentTool === 'brightness' && (
            <span>
              <input
                value={brightness}
                type="range"
                min="-1"
                max="1"
                step="0.01"
                onChange={onChangeBrightness}
              />
            </span>
          )
        }

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

      <StyledSource
        ref={sourceRef}
        src={Image}
        alt=""
      />
    </>
  );
};
