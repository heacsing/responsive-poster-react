/*** examples/src/app.js ***/
import React from 'react'
import { render } from 'react-dom'
import Poster from '../../src' // 引入组件
import bg from './assets/poster_zh.png'
import error from './assets/error.png'
import test from './assets/test.jpg'

const posterData = {
	error: error,
	exportHeight: 740, // true height of the exported image
	cw: 4689, //canvas width
	ch: 7364, //canvas height
	bgColor: '#808080', //background color
	drawData: [
		{
			type: 'staticImage', //background image
			url: bg,
			left: 0,
			top: 0,
			width: 4689,
			height: 7363,
			
		}, //
		{
			type: 'text', //
			content: '1024',
			width: 800,
			top: 6050,
			left: 450,
			fontSize: 260,
			fontWeight: 'bold',
			color: '#0043a5',
		}, //
		{
			type: 'text',
			content: 'Shinomiya',
			top: 4550,
			left: 2344.5,
			fontSize: 200,
			textAlign: 'center',
			fontWeight: 'bold',
			color: '#000'
		},
		{
			type: 'rect',
			left: 200,
			top: 1200,
			width: 4289,
			height: 2930,
			borderRadius: 200,
			borderColor: '#ff0000',
			opacity: 1,

		},
		{
			type: 'responsiveImage',
			url: test
		},
		{
			type: 'qrcode',
			url: 'http://localhost:3001/',
			left: 3590,
			top: 6350,
			width: 710,
			height: 710
		}
	]
}


const App = () => <Poster
				posterData={posterData}
				/>
render(<App />, document.getElementById('root'))
