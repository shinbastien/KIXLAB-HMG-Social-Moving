import React, { useState, useEffect, useCallback, useRef } from "react";
import styled from "styled-components";
import { useSocket } from "../../lib/socket";

const CanvasWrapper = styled.canvas`
	position: absolute;
	z-index: 20;
`;

const Canvas = ({ width, height }) => {
	const canvasRef = useRef(null);
	const [isPainting, setIsPainting] = useState(false);
	const [otherIsPainting, setOtherIsPainting] = useState(false);
	const [mousePosition, setMousePosition] = useState(undefined);
	const { socket, connected } = useSocket();
	const [drawing, setDrawing] = useState([]);

	const startPoint = useCallback(
		(event) => {
			const coordinates = getCoordinate(event);
			if (coordinates) {
				setMousePosition(coordinates);
				setIsPainting(true);
				if (socket && connected) {
					socket.emit("start drawing");
				}
			}
		},
		[socket, connected],
	);

	useEffect(() => {
		if (!canvasRef.current) {
			return;
		}
		const canvas = canvasRef.current;
		canvas.addEventListener("mousedown", startPoint);

		return () => {
			canvas.removeEventListener("mousedown", startPoint);
		};
	}, [startPoint]);

	const paint = useCallback(
		(event) => {
			if (isPainting) {
				const newMousePosition = getCoordinate(event);

				if (mousePosition && newMousePosition) {
					drawLine(mousePosition, newMousePosition);
					if (socket && connected) {
						socket.emit("send paint", mousePosition, newMousePosition);
						console.log("send paint from:", mousePosition);
						console.log("send paint to: ", newMousePosition);
					}
					setMousePosition(newMousePosition);
				}
			}
		},
		[isPainting, mousePosition, socket, connected],
	);

	useEffect(() => {
		if (socket && connected) {
			socket.on("other start drawing", () => {
				setOtherIsPainting(true);
			});
			socket.on("other stopped drawing", () => {
				setOtherIsPainting(false);
			});
		}
		return () => {
			if (socket && connected) {
				socket.off("other start drawing", () => {
					setOtherIsPainting(true);
				});
				socket.off("other stopped drawing", () => {
					setOtherIsPainting(false);
				});
			}
		};
	}, [otherIsPainting, socket, connected]);
	useEffect(() => {
		const handlePainting = async (mousePosition, newMousePosition) => {
			drawLine(mousePosition, newMousePosition);
			console.log("drawing line");
		};
		if (socket && connected) {
			socket.on("receive paint", handlePainting);
		}
		return () => {
			if (socket && connected) {
				socket.off("receive paint", handlePainting);
			}
		};
	}, [otherIsPainting, socket, connected]);

	useEffect(() => {
		if (!canvasRef.current) {
			return;
		}
		const canvas = canvasRef.current;
		canvas.addEventListener("mousemove", paint);

		return () => {
			canvas.removeEventListener("mousemove", paint);
		};
	}, [paint]);

	const exitPaint = useCallback(() => {
		if (socket && connected) {
			if (isPainting) {
				socket.emit("stop drawing");
				console.log("stop drawing");
			}
		}

		// //when mouse-up set the canvas:
		// const image = new Image();
		// image.src = subCtx.toDataUrl();
		// image.onload = () =>
		// 	setDrawing((drawing) => [
		// 		...drawing,
		// 		{ image: image, createdAt: new Date().getTime(), opacity: 1 },
		// 	]);
		// subCtx.closePath()

		setIsPainting(false);
		setMousePosition(undefined);
	}, [socket, connected]);

	const getCoordinate = (event) => {
		if (!canvasRef.current) {
			return;
		}

		const canvas = canvasRef.current;

		return [event.pageX - canvas.offsetLeft, event.pageY - canvas.offsetTop];
	};

	const drawLine = (originalMousePosition, newMousePosition) => {
		if (!canvasRef.current) {
			return;
		}
		const canvas = canvasRef.current;
		const ctx = canvas.getContext("2d");

		if (ctx == null) throw new Error("Could not get context");
		if (ctx) {
			ctx.strokeStyle = "#151ca2";
			ctx.lineJoin = "round";
			ctx.lineWidth = 3;

			ctx.beginPath();
			ctx.moveTo(originalMousePosition[0], originalMousePosition[1]);
			ctx.lineTo(newMousePosition[0], newMousePosition[1]);
			ctx.closePath();
			ctx.stroke();
		}
	};

	useEffect(() => {
		if (!canvasRef.current) {
			return;
		}

		const canvas = canvasRef.current;
		canvas.addEventListener("mouseup", exitPaint);
		canvas.addEventListener("mouseleave", exitPaint);

		return () => {
			canvas.removeEventListener("mouseup", exitPaint);
			canvas.removeEventListener("mouseleave", exitPaint);
		};
	}, [exitPaint]);

	return (
		<CanvasWrapper
			ref={canvasRef}
			width={width}
			height={height}
		></CanvasWrapper>
	);
};

export default Canvas;
