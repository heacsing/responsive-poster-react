import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import QRCode from 'qrcode';

const loadImage = (url, error) => {
	return new Promise((resolve) => {
		const img = new Image();
		img.crossOrigin = 'anonymous';
		img.onload = () => resolve(img);
		img.onerror = () => {
			const temp = new Image();
			temp.onload = () => resolve(temp);
			temp.src = error
		};
		img.src = url;
	});
};

const initCanvas = (width, height) => {
	const cvs = document.createElement('canvas');
	cvs.width = width;
	cvs.height = height;
	const ctx = cvs.getContext('2d');
	//const ratio = getPixelRatio(ctx);

	return [cvs, ctx]
}


const radiusRect = (ctx, left, top, w, h, r, borderWidth, borderColor) => {
	const br = r / 2;
	ctx.beginPath();
	if (borderWidth > 0) { ctx.lineWidth = borderWidth; }
	ctx.strokeStyle = borderColor;
	ctx.moveTo(left + br, top); // 移动到左上角的点
	ctx.lineTo(left + w - br, top);
	ctx.arc(left + w - br, top + br, br, 2 * Math.PI * (3 / 4), 2 * Math.PI * (4 / 4));
	ctx.lineTo(left + w, top + h - br);
	ctx.arc(left + w - br, top + h - br, br, 0, 2 * Math.PI * (1 / 4));
	ctx.lineTo(left + br, top + h);
	ctx.arc(left + br, top + h - br, br, 2 * Math.PI * (1 / 4), 2 * Math.PI * (2 / 4));
	ctx.lineTo(left, top + br);
	ctx.arc(left + br, top + br, br, 2 * Math.PI * (2 / 4), 2 * Math.PI * (3 / 4));
	ctx.closePath();
	ctx.stroke();
}

const drawText = (
	ctx, top = 0, left = 0, fontSize = 16, color = '#000', baseLine = 'bottom', textAlign = 'left', content, opacity = 1,
	fontWeight = 'normal', fontStyle = 'normal', fontFamily = 'Microsoft YaHei',
) => {
	ctx.save();
	ctx.beginPath();
	ctx.font = `${fontStyle} ${fontWeight} ${fontSize}px ${fontFamily}`;
	ctx.globalAlpha = opacity;
	ctx.textAlign = textAlign;
	ctx.textBaseline = baseLine;
	ctx.fillStyle = color;
	ctx.fillText(content, left, top);
	ctx.restore();
}
const drawLine = (
	ctx, startX, startY, endX, endY, color = '#000', width = 1, lineCap = 'butt',
) => {
	ctx.save();
	ctx.beginPath();
	ctx.lineCap = lineCap;
	ctx.strokeStyle = color;
	ctx.lineWidth = width;
	ctx.moveTo(startX, startY);
	ctx.lineTo(endX, endY);
	ctx.stroke(); // 进行绘制
	ctx.closePath();
	ctx.restore();
}
const drawRect = (ctx, width, height, left, top, borderWidth, backgroundColor, borderColor, borderRadius, opacity, error) => {
	if (backgroundColor) {
		ctx.save();
		ctx.globalAlpha = opacity;
		ctx.strokeStyle = backgroundColor;
		if (borderRadius > 0) {
			radiusRect(ctx, left, top, width, height, borderRadius, borderColor);
			ctx.fill()
		} else {
			ctx.fillRect(left, top, width, height);
		}
		ctx.restore();
	}
	if (borderWidth) {
		ctx.save();
		ctx.globalAlpha = opacity;
		ctx.strokeStyle = borderColor;
		ctx.lineWidth = borderWidth;
		if (borderRadius > 0) {
			radiusRect(ctx, left, top, width, height, borderRadius, borderColor);
			ctx.stroke();
		} else {
			ctx.strokeRect(left, top, width, height);
		}
		ctx.restore();
	}
	return async (ctx = ctx, url) => {
		const img = await loadImage(url, error)
		const imgHeight = img.height;
		const imgWidth = img.width;
		const rectHeight = height;
		const rectWidth = width;
		const ratio = imgHeight / imgWidth;
		const standardRatio = rectHeight / rectWidth;
		console.log(ratio, standardRatio)
		if (ratio - standardRatio < 0.01 && ratio - standardRatio > -0.01) {
			ctx.drawImage(img, left, top, width, height);
		} else if (ratio > standardRatio) {
			const tmpWidth = (height * imgWidth) / imgHeight;
			const tmpX = width / 2 + left - tmpWidth / 2;
			ctx.drawImage(img, tmpX, top, tmpWidth, height);
		} else {
			const tmpHeight = (width * imgHeight) / imgWidth;
			const tmpY = height / 2 + top - tmpHeight / 2;
			ctx.drawImage(img, left, tmpY, width, tmpHeight);
		}
	}
}

const Poster = (props) => {
	const { posterData } = props
	const { cw, ch, bgColor, exportHeight, error, drawData } = posterData
	const [canvas, ctx] = initCanvas(cw, ch)
	const imgRef = useRef(null);
	const [display, setDisplay] = useState('none')
	//绘制 背景颜色
	if (bgColor !== undefined) {
		ctx.save();
		ctx.fillStyle = bgColor;
		ctx.fillRect(0, 0, cw, ch);
		ctx.restore();
	}
	const imgPipe = [] //图片文件 加载管道
	const len = drawData.length;
	for (let i = 0; i < len; i++) {
		const { type } = drawData[i];
		if (type === 'staticImage') {
			const { url } = drawData[i];
			imgPipe.push({
				index: i,
				content: loadImage(url, error)
			})
		}else if(type === 'qrcode'){
			const { url } = drawData[i];
			QRCode.toDataURL(url, {
				errorCorrectionLevel: 'H',
				quality: 1,
				margin: 0
			}, (e,u)=>{
				imgPipe.push({
					index: i,
					content: loadImage(u, error)
				})
			})
		}
	}
	Promise.all(Array.from(imgPipe, (({ content }) => content))).then(res => {
		const len = res.length;
		for (let i = 0; i < len; i++) {
			ctx.save();

			const { top = 0, left = 0, width = 0, height = 0, borderRadius = 0, borderWidth = 0, borderColor = 'rgba(255,255,255,0)' } = drawData[imgPipe[i]['index']];
			if (borderRadius > 0) {
				radiusRect(ctx, left, top, width, height, borderRadius, borderWidth, borderColor)
				ctx.clip()
			}
			ctx.drawImage(res[i], left, top, width, height);
			ctx.restore();
		}
	}).then(() => {
		let drawResponsive = null;
		for (let i = 0; i < len; i++) {
			const { type } = drawData[i];
			switch (type) {
				case 'text': {
					const { top = 0, left = 0, fontSize = 16, color = '#000', baseLine = 'bottom', textAlign = 'center', content, opacity = 1,
						 fontWeight = 'normal', fontStyle = 'normal', fontFamily = 'Microsoft YaHei', } = drawData[i]
					drawText(ctx, top, left, fontSize, color, baseLine, textAlign, content, opacity, width, lineNum, lineHeight, fontWeight, fontStyle, fontFamily)
					break;
				}
				case 'line': {
					const { startX, startY, endX, endY, color = '#000', width = 1, lineCap = 'butt', } = drawData[i];
					drawLine(ctx, startX, startY, endX, endY, color, width, lineCap,)
					break;
				}
				case 'rect': {
					const { width = 0, height, left, top, borderWidth=0, backgroundColor, borderColor='#000', borderRadius=0, opacity } = drawData[i];
					drawResponsive = drawRect(ctx, width, height, left, top, borderWidth, backgroundColor, borderColor, borderRadius, opacity, error)
					break;
				}
				case 'responsiveImage': {
					const { url } = drawData[i]
					if (drawResponsive === null) {
						console.error('Fail to create a responsive drawing rectangle. Please check the sequence of drawData and assure the "rect" being set before the "responsiveImage".')
					} else {
						console.log('loading')
						drawResponsive(ctx, url)
					}
					break;
				}
				default:
					break;
			}
		}
	}).then(() => {
		setTimeout(() => {
			const target = imgRef.current
			const dataURL = canvas.toDataURL('image/jpeg', 0.7)

			target.src = dataURL
			setDisplay('block')
		}, 0)
	})
	return (
		<div style={{ display: display, textAlign: 'center' }}>
			<img
				crossOrigin="anonymous"
				alt="poster"
				width="auto"
				height={exportHeight}
				ref={imgRef}
			/>
		</div>
	)
}
Poster.propTypes = {
	posterData: PropTypes.object
}
export default Poster