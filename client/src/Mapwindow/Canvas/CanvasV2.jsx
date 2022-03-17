import React, { useState, useEffect, useCallback, useRef } from "react";
import styled from "styled-components";
import { useSocket } from "../../lib/socket";
import pencil from "../../Styles/source/pencil.svg";

const CanvasWrapper = styled.canvas`
	position: absolute;
	z-index: 20;
	cursor: url(${pencil}), crosshair;
`;

const Canvas = ({ width, height, color }) => {
	const canvasRef = useRef(null);
	const subcanvasRef = useRef(null);
	const drawingRef = useRef([]);
	const [isPainting, setIsPainting] = useState(false);
	const [otherIsPainting, setOtherIsPainting] = useState(false);
	const [mousePosition, setMousePosition] = useState(undefined);
	const { socket, connected } = useSocket();

	const requestRef = useRef();
	const previousTimeRef = useRef();

	useEffect(() => {
		window.addEventListener("resize", windowResize);

		window.dispatchEvent(new Event("resize"));

		subcanvasRef.current = document.createElement("canvas");
		subcanvasRef.current.width = width;
		subcanvasRef.current.height = height;
	}, []);

	function windowResize() {
		const canvas = document.querySelector("canvas");
		console.log(canvas.parentNode);

		canvas.width = canvas.parentNode.clientWidth;
		canvas.height = canvas.parentNode.clientHeight;
	}

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
					drawLine(mousePosition, newMousePosition, color);

					if (socket && connected) {
						socket.emit("send paint", mousePosition, newMousePosition, color);
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
		const handlePainting = async (mousePosition, newMousePosition, color) => {
			drawLine(mousePosition, newMousePosition, color);
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
		const subcanvas = subcanvasRef.current;

		const subctx = subcanvas.getContext("2d");
		const image = new Image();
		image.src = canvasRef.current.toDataURL();

		image.onload = () =>
			drawingRef.current.push({
				image: image,
				createdAt: new Date().getTime(),
				opacity: 1,
			});

		subctx.closePath();
		subctx.clearRect(0, 0, width, height);

		setIsPainting(false);
		setMousePosition(undefined);
	}, [socket, connected]);

	const getCoordinate = (event) => {
		if (!canvasRef.current) {
			return;
		}

		const subcanvas = subcanvasRef.current;

		return [
			event.pageX - subcanvas.offsetLeft,
			event.pageY - subcanvas.offsetTop,
		];
	};

	const drawLine = (originalMousePosition, newMousePosition, color) => {
		if (!subcanvasRef.current) {
			return;
		}
		const subcanvas = subcanvasRef.current;
		const subctx = subcanvas.getContext("2d");

		if (subctx == null) throw new Error("Could not get context");
		if (subctx) {
			subctx.strokeStyle = color;
			subctx.lineJoin = "round";
			subctx.lineWidth = 3;

			subctx.beginPath();
			subctx.moveTo(originalMousePosition[0], originalMousePosition[1]);
			subctx.fillRect(
				originalMousePosition[0] - subctx.lineWidth / 2,
				originalMousePosition[1] - subctx.lineWidth / 2,
				subctx.lineWidth,
				subctx.lineWidth,
			);
			subctx.lineTo(newMousePosition[0], newMousePosition[1]);
			subctx.stroke();
		}
	};

	const update = () => {
		const subcanvas = subcanvasRef.current;
		const subctx = subcanvas.getContext("2d");
		const canvas = canvasRef.current;
		const ctx = canvas.getContext("2d");

		if (ctx == null) throw new Error("Could not get context");

		const t = new Date().getTime();

		let drawingRefCurrent = drawingRef.current;

		for (let i = 0; i < drawingRefCurrent.length; i++) {
			if (t - drawingRefCurrent[i]["createdAt"] > 1500) {
				drawingRefCurrent[i]["opacity"] -= 0.02;
			}
		}

		drawingRef.current = drawingRefCurrent.filter(
			(drawing) => drawing.opacity > 0,
		);
	};

	const animate = (time) => {
		const subcanvas = subcanvasRef.current;
		const subctx = subcanvas.getContext("2d");
		const canvas = canvasRef.current;
		const ctx = canvas.getContext("2d");
		update();
		if (previousTimeRef.current != undefined) {
			ctx.putImageData(subctx.getImageData(0, 0, width, height), 0, 0);
			drawingRef.current.forEach((drawing) => {
				ctx.save();
				ctx.globalAlpha = drawing.opacity;
				ctx.drawImage(drawing.image, 0, 0);
				ctx.restore();
			});
		}

		previousTimeRef.current = time;
		requestRef.current = requestAnimationFrame(animate);
	};

	useEffect(() => {
		requestRef.current = requestAnimationFrame(animate);

		return () => cancelAnimationFrame(requestRef.current);
	}, []); // Make sure the effect runs only once

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
