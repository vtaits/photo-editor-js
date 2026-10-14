import { useCallback, useEffect, useRef, useState } from "react";
import { PhotoEditor } from "../../../packages/photo-editor/src/index.js";
import { Pencil } from "./Pencil.js";

/**
 * @typedef {Object} Tools
 * @property {typeof Pencil} pencil
 */

export function Draw() {
	/** @type {React.RefObject<HTMLCanvasElement | null>} */
	const canvasRef = useRef(null);
	const [currentTool, setCurrentTool] = useState(
		/** @type {keyof Tools | null} */ (null),
	);
	/** @type {React.RefObject<PhotoEditor<
		{
			pencil: typeof Pencil;
		},
		"pencil",
		"current-canvas"
	> | null>} */
	const photoEditorRef = useRef(null);

	useEffect(() => {
		const canvas = canvasRef.current;

		if (!canvas) {
			return;
		}

		const photoEditor = new PhotoEditor(canvas, {
			tools: {
				pencil: Pencil,
			},
		});

		photoEditorRef.current = photoEditor;

		photoEditor.addListener(
			"enableTool",
			/**
			 * @param {keyof Tools} tool
			 */
			(tool) => {
				setCurrentTool(tool);
			},
		);

		photoEditor.addListener("disableTool", () => {
			setCurrentTool(null);
		});

		return () => {
			photoEditor.removeAllListeners();
			photoEditorRef.current = null;
		};
	}, []);

	const togglePencil = useCallback(() => {
		if (photoEditorRef.current) {
			photoEditorRef.current.toggleTool("pencil");
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
						border: currentTool === "pencil" ? "2px solid #aa0000" : undefined,
					}}
					onClick={togglePencil}
				>
					Pencil
				</button>

				<button type="button" onClick={undo}>
					Undo
				</button>

				<button type="button" onClick={redo}>
					Redo
				</button>
			</div>

			<div>
				<canvas
					width="640"
					height="480"
					style={{
						border: "2px solid #999",
					}}
					ref={canvasRef}
				/>
			</div>
		</>
	);
}
